# Migration Guide: Multi-Page to Single-Page App (SPA)

## 🎉 What's New

Your meal planning app has been modernized to a Single-Page Application! Here's what changed and what stayed the same.

## ✅ What Stayed the Same

**Your AI workflow is IDENTICAL:**
- Same prompt
- Same data structure
- Same weekly data files (plan-YYYY-MM-DD.js)
- Same plan-manifest.js
- Just upload new data files to the `data/` folder as before!

## 🆕 What Changed

### Old Structure (Multi-Page)
```
mealplan/
├── index.html
├── shopping.html
├── prep.html  
├── recipes.html
├── recipe-sunday.html
├── recipe-monday.html
├── (... 5 more recipe pages)
└── data/
    └── plan-YYYY-MM-DD.js
```

### New Structure (SPA)
```
mealplan/
├── index.html              ← One HTML file!
├── app.js                  ← All the app logic
├── plan-manifest.js        ← Same as before
└── data/
    └── plan-YYYY-MM-DD.js  ← Same as before
```

## 🚀 How to Deploy

### Option 1: Clean Slate (Recommended)

1. **Backup your current site** (download all files just in case)

2. **Clear your GitHub repo** (or create a new branch)

3. **Upload the new files:**
   - `index.html` (the new single-page version)
   - `app.js` (the new app logic)
   - `plan-manifest.js` (your existing file)
   - `data/` folder with all your weekly plans

4. **Delete the old files:**
   - All the old recipe-*.html files
   - shopping.html, prep.html, recipes.html
   - Any old JavaScript files

5. **Test it!** Visit your GitHub Pages URL

### Option 2: Side-by-Side Testing

1. Create a new branch in GitHub
2. Upload new files to the branch
3. Enable GitHub Pages for that branch
4. Test the new version
5. When happy, merge to main

## 📱 New Features You Get

### Smooth Navigation
- No page reloads! Everything loads instantly
- Browser back/forward buttons work
- Bookmarkable URLs (e.g., `#recipes`, `#shopping`)

### Better Mobile Experience
- Responsive design throughout
- Smooth animations
- Touch-friendly interface

### Week Switching
- Drop-down selector in header
- Instantly switch between weeks
- No page reloads needed

### Print Still Works!
- Print button in bottom-right corner
- Clean print layouts
- Print current view or entire plan

## 🔧 Weekly Workflow (Unchanged!)

Your process stays exactly the same:

1. Open your AI assistant (ChatGPT, Claude, Gemini)
2. Use your usual prompt
3. Get the meal-plan-data.js file
4. Upload to `data/` folder in GitHub
5. Update plan-manifest.js to add the new week:
   ```javascript
   const allPlans = [
     {
       id: "2025-10-06",
       name: "Week of October 6, 2025"
     },
     {
       id: "2025-10-12",
       name: "Week of October 12, 2025"
     },
     // Add new week here:
     {
       id: "2025-10-19",
       name: "Week of October 19, 2025"
     }
   ];
   ```
6. Done! The app automatically loads your new plan

## 🐛 Troubleshooting

### "Plan not loading"
- Check that the plan file is named correctly: `plan-YYYY-MM-DD.js`
- Check that the id in plan-manifest.js matches the filename date
- Make sure the file starts with `const planData = {`

### "Week selector is empty"
- Make sure plan-manifest.js is in the root folder
- Check that it defines `const allPlans = [...]`

### "Styles look broken"
- Make sure you're using the new index.html (all CSS is embedded)
- Clear your browser cache (Ctrl+F5 or Cmd+Shift+R)

### "Recipe not showing"
- Check that the meal has `isSpecial: false` and a `recipe` object
- Look for JavaScript errors in browser console (F12)

## 📊 Performance Improvements

The SPA is faster because:
- **First load**: Downloads 3 files instead of 10+
- **Navigation**: No page reloads, instant transitions
- **Data loading**: Caches plan data in memory
- **Mobile**: Less data transferred, faster loading

## 🎨 Future Enhancements (Now Easier!)

With the SPA architecture, these features are now simpler to add:

- [ ] Search recipes
- [ ] Filter by meal type
- [ ] Nutritional information display
- [ ] Recipe favorites/ratings
- [ ] Meal history across weeks
- [ ] Export shopping list to other apps
- [ ] Dark mode
- [ ] Progressive Web App (install on phone)

## 💡 Tips

1. **Bookmarks**: You can now bookmark specific views:
   - `your-url.com/#home`
   - `your-url.com/#shopping`
   - `your-url.com/#prep`

2. **Sharing**: Send links to specific sections to family members

3. **Mobile**: Add to home screen for app-like experience

4. **Testing Locally**: 
   ```bash
   # Simple Python server
   python -m http.server 8000
   
   # Then visit: http://localhost:8000
   ```

## 🤝 Need Help?

If something isn't working:
1. Check the browser console for errors (F12)
2. Make sure all files are uploaded correctly
3. Verify your data files have the correct structure
4. Try clearing browser cache

## 🎓 What You Learned

By switching to an SPA, you've:
- Reduced file count from 10+ to 2 core files
- Improved user experience with instant navigation
- Made future updates easier (one place to edit)
- Created a more modern, app-like experience
- Kept your AI workflow completely unchanged!

---

**Remember**: Your weekly meal planning process hasn't changed at all. You're just getting a better interface for viewing and using those plans!
