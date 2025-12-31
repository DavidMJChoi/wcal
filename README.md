# (UNDER DEVELOPMENT) Weight Calendar

A component that can be used independently or be embedded.

A lightweight web application for tracking daily weight records with an interactive calendar interface.

## Features

- **Interactive Calendar**: Monthly calendar view with navigation
- **Weight Tracking**: Click any date to record your weight in kilograms
- **Data Persistence**: Uses IndexedDB for local storage - data persists in your browser

## Tech Stack

- **HTML5/CSS3/JavaScript (Vanilla)** - No framework dependencies
- **IndexedDB** - Browser-based database for data persistence
- **Tailwind CSS** - Utility-first CSS framework for styling

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wcal
```

2. Install dependencies:
```bash
npm install
```

3. Build the CSS:
```bash
npx tailwindcss -i styles.css -o output.css
```

## Usage

Simply open `index.html` in your web browser. No server required.

### Recording Weight

1. Click on any date in the calendar
2. Enter your weight in kilograms in the input modal
3. Click "DONE" to save or "CANCEL" to abort
4. The weight will be displayed on the calendar day

### (TODO) Navigation 

- Click `❰` to navigate to the previous month
- Click `❱` to navigate to the next month

## Project Structure

```
wcal/
├── index.html      # Main HTML file
├── calendar.js     # Calendar UI and interaction logic
├── weightDB.js     # IndexedDB wrapper for weight data management
├── styles.css      # Tailwind CSS input
├── output.css      # Compiled Tailwind CSS
└── package.json    # Node.js dependencies
```

## API

### weightDB Functions

- `initDB()` - Initialize the IndexedDB database
- `insertWeight(date, weight)` - Insert a weight record for a specific date
- `getWeightByDate(date)` - Retrieve weight records by date
- `getAllWeights()` - Get all weight records
- `deleteWeight(id)` - Delete a weight record by ID
- `clearAllWeights()` - Clear all weight records

## Browser Compatibility

Works in all modern browsers that support:
- IndexedDB
- ES6 JavaScript
- CSS Grid
- CSS Custom Properties (for dark mode)