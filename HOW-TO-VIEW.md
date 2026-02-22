# How to view your site (and see updates)

## You must use the dev server

This is a **React + Vite** app. To see your site and any code changes:

1. **Open a terminal** in this folder (`PROJECT_HESTIA`).

2. **Install dependencies** (only needed once):
   ```bash
   npm install
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:  
   Go to **http://localhost:5173** (Vite will show this URL in the terminal).

5. **See updates**:  
   Keep the dev server running. When you edit and save files, the page at http://localhost:5173 will **reload automatically** with your changes.

---

## If you still don’t see updates

- **Don’t open `index.html` directly** (e.g. by double-clicking it). That won’t run the React app.
- **Use the URL from the terminal** (usually http://localhost:5173).
- **Hard refresh** the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac).
- Make sure you **saved the file** after editing.

If you ran `npm run build` and are opening the `dist` folder, you need to run `npm run build` again after each change to see updates.
