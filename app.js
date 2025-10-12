// Mise en Place - SPA Application Logic

class MealPlanApp {
    constructor() {
        this.currentPlan = null;
        this.currentView = 'home';
        this.planData = null;
        this.init();
    }

    async init() {
        // Set up event listeners
        this.setupNavigation();
        this.setupWeekSelector();
        
        // Load initial plan
        await this.loadPlanManifest();
    }

    // Load and populate week selector
    async loadPlanManifest() {
        try {
            const weekSelect = document.getElementById('weekSelect');
            
            if (typeof allPlans === 'undefined' || !allPlans || allPlans.length === 0) {
                weekSelect.innerHTML = '<option value="">No plans available</option>';
                return;
            }

            // Clear loading option
            weekSelect.innerHTML = '';
            
            // Add plans to selector (most recent first)
            allPlans.reverse().forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = plan.name;
                weekSelect.appendChild(option);
            });

            // Load the most recent plan
            if (allPlans.length > 0) {
                weekSelect.value = allPlans[0].id;
                await this.loadPlan(allPlans[0].id);
            }
        } catch (error) {
            console.error('Error loading plan manifest:', error);
            document.getElementById('weekTitle').textContent = 'Error loading plans';
        }
    }

    // Load a specific week's plan
    async loadPlan(planId) {
        try {
            this.currentPlan = planId;
            
            // Dynamically load the plan data file
            const script = document.createElement('script');
            script.src = `data/plan-${planId}.js`;
            
            // Wait for script to load
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Failed to load plan: ${planId}`));
                document.head.appendChild(script);
            });

            // planData is now available globally from the loaded script
            if (typeof planData !== 'undefined') {
                this.planData = planData;
                this.renderCurrentView();
            } else {
                throw new Error('Plan data not found');
            }
            
        } catch (error) {
            console.error('Error loading plan:', error);
            this.showError('Failed to load meal plan');
        }
    }

    // Navigation setup
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.navigateTo(view);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.view) {
                this.navigateTo(e.state.view, false);
            }
        });

        // Set initial state
        history.replaceState({ view: 'home' }, '', '#home');
    }

    // Week selector setup
    setupWeekSelector() {
        const weekSelect = document.getElementById('weekSelect');
        weekSelect.addEventListener('change', async (e) => {
            await this.loadPlan(e.target.value);
        });
    }

    // Navigate to a different view
    navigateTo(viewName, pushState = true) {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
            
            // Update URL hash
            if (pushState) {
                history.pushState({ view: viewName }, '', `#${viewName}`);
            }

            // Render view content if needed
            this.renderCurrentView();
        }
    }

    // Render the current view with data
    renderCurrentView() {
        if (!this.planData) return;

        switch(this.currentView) {
            case 'home':
                this.renderHome();
                break;
            case 'shopping':
                this.renderShopping();
                break;
            case 'prep':
                this.renderPrep();
                break;
            case 'recipes':
                this.renderRecipes();
                break;
        }
    }

    // Render Home View
    renderHome() {
        document.getElementById('weekTitle').textContent = this.planData.title;
        document.getElementById('weekMeta').textContent = this.planData.meta;

        const mealsGrid = document.getElementById('mealsGrid');
        mealsGrid.innerHTML = '';

        this.planData.meals.forEach(meal => {
            const card = document.createElement('div');
            card.className = `meal-card ${meal.isSpecial ? 'special' : ''}`;
            
            let content = `
                <div class="meal-day">${meal.day} ${meal.date}</div>
                <div class="meal-name">${meal.name}</div>
            `;

            if (meal.description) {
                content += `<div class="meal-description">${meal.description}</div>`;
            }

            if (meal.schedulingNotes) {
                content += `<div class="meal-notes">📅 ${meal.schedulingNotes}</div>`;
            }

            card.innerHTML = content;

            // Make clickable if it has a recipe
            if (!meal.isSpecial && meal.recipe) {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    this.showRecipeDetail(meal);
                });
            }

            mealsGrid.appendChild(card);
        });
    }

    // Render Shopping List
    renderShopping() {
        const shoppingLists = document.getElementById('shoppingLists');
        shoppingLists.innerHTML = '';

        const shoppingData = this.planData.shopping;
        
        // Handle the consolidated shopping list structure
        for (const [sectionTitle, sectionData] of Object.entries(shoppingData)) {
            for (const [category, items] of Object.entries(sectionData.lists)) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'shopping-category';
                
                categoryDiv.innerHTML = `<h3>${category}</h3>`;
                
                items.forEach((item, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'shopping-item';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `shop-${category}-${index}`;
                    checkbox.checked = item.checked || false;
                    
                    checkbox.addEventListener('change', () => {
                        itemDiv.classList.toggle('checked', checkbox.checked);
                    });
                    
                    const label = document.createElement('label');
                    label.htmlFor = checkbox.id;
                    label.textContent = item.text;
                    
                    itemDiv.appendChild(checkbox);
                    itemDiv.appendChild(label);
                    categoryDiv.appendChild(itemDiv);
                    
                    if (checkbox.checked) {
                        itemDiv.classList.add('checked');
                    }
                });
                
                shoppingLists.appendChild(categoryDiv);
            }
        }
    }

    // Render Prep View
    renderPrep() {
        const prepData = this.planData.prep;
        
        document.getElementById('prepTitle').textContent = prepData.title;
        document.getElementById('prepIntro').textContent = prepData.intro;
        
        // Render ingredients
        const ingredientsList = document.getElementById('prepIngredients');
        ingredientsList.innerHTML = '';
        
        prepData.ingredients.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'prep-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `prep-ing-${index}`;
            checkbox.checked = item.checked || false;
            
            checkbox.addEventListener('change', () => {
                li.classList.toggle('checked', checkbox.checked);
            });
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = item.text;
            
            li.appendChild(checkbox);
            li.appendChild(label);
            ingredientsList.appendChild(li);
            
            if (checkbox.checked) {
                li.classList.add('checked');
            }
        });
        
        // Render steps
        const stepsList = document.getElementById('prepSteps');
        stepsList.innerHTML = '';
        
        prepData.steps.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'prep-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `prep-step-${index}`;
            checkbox.checked = item.checked || false;
            
            checkbox.addEventListener('change', () => {
                li.classList.toggle('checked', checkbox.checked);
            });
            
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = item.text;
            
            li.appendChild(checkbox);
            li.appendChild(label);
            stepsList.appendChild(li);
            
            if (checkbox.checked) {
                li.classList.add('checked');
            }
        });
    }

    // Render Recipes Grid
    renderRecipes() {
        const recipesGrid = document.getElementById('recipesGrid');
        recipesGrid.innerHTML = '';

        this.planData.meals.forEach(meal => {
            if (!meal.isSpecial && meal.recipe) {
                const card = document.createElement('div');
                card.className = 'recipe-card';
                
                card.innerHTML = `
                    <div class="meal-day">${meal.day}</div>
                    <div class="meal-name">${meal.recipe.cardTitle || meal.name}</div>
                    <div class="meal-description">${meal.description || ''}</div>
                `;
                
                card.addEventListener('click', () => {
                    this.showRecipeDetail(meal);
                });
                
                recipesGrid.appendChild(card);
            }
        });
    }

    // Show detailed recipe view
    showRecipeDetail(meal) {
        const recipe = meal.recipe;
        
        // Switch to recipe detail view
        this.navigateTo('recipe-detail');
        
        const recipeDetail = document.getElementById('recipeDetail');
        recipeDetail.innerHTML = `
            <div class="recipe-header">
                <h2 class="recipe-title">${recipe.title}</h2>
                <p class="recipe-meta">${recipe.meta}</p>
            </div>
            
            <div class="recipe-section">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            
            <div class="recipe-section">
                <h3>Instructions</h3>
                <ol>
                    ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="action-buttons">
                <button class="btn-secondary" onclick="app.navigateTo('recipes')">← Back to Recipes</button>
                <button class="btn" onclick="window.print()">🖨️ Print Recipe</button>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <h2 style="color: var(--accent);">⚠️ ${message}</h2>
                <p style="color: var(--text-light); margin-top: 1rem;">Please try refreshing the page</p>
            </div>
        `;
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MealPlanApp();
});
