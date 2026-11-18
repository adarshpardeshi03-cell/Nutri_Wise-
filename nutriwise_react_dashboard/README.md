# NutriWise — React Dashboard

A responsive, dashboard-only wellness project. It uses React, Vite, Recharts and browser `localStorage`. **No SQL database or backend is required.**

## Requirements

- Node.js (LTS version recommended)
- npm (installed with Node.js)
- VS Code (optional)

## Run the project

1. Extract `nutriwise_react_dashboard.zip`.
2. Open the extracted `nutriwise_react_dashboard` folder in VS Code (or a terminal).
3. Open the terminal in that folder.
4. Install the project packages:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Vite will show a local address, usually `http://localhost:5173/`.
7. Open that address in Chrome.

To stop the server, click the terminal and press `Ctrl + C`.

## Create a production build

```bash
npm run build
```

The optimized website files will be created in the `dist` folder.

## Features

- Responsive wellness dashboard
- Food-choice advisor with practical suggestions
- Daily habit tracker
- Water-glass counter
- Meal inspiration
- Wellness progress chart
- Daily food log
- Saves habits, water and food log in browser localStorage

## Important notes

- This is a frontend dashboard project; it does not include a backend, SQL database, account login or live AI service.
- Data is saved only in the current browser on the current device. Clearing browser site data may erase it.
- Dashboard score and chart trend are demo indicators, not medical measurements.
- Nutrition content is general educational guidance, not personal medical advice.
- Google Fonts are loaded from the internet. The app's main functionality runs locally after npm dependencies have been installed.
