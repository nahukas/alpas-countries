# Alpas Country Selector

This is a React application that provides an intuitive country selection component with fuzzy search capabilities and keyboard navigation.

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:nahukas/alpas-countries.git
   cd alpas-countries
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

From the root directory of the project, start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is already in use).

## Usage

The Country Selector component provides an input field where you can:

1. Type to search for countries (fuzzy search enabled, allowing users to find countries even with slight misspellings or partial matches)
2. Use arrow keys (up/down) to navigate through suggestions
3. Press Enter to select a country
4. Click on a suggestion to select it

The selected country will be saved in localStorage and pre-filled on subsequent visits. This means that users won't need to re-select their preferred country each time they visit the app.

## Features

- Fuzzy search for country names
- Keyboard navigation
- Persistence of selected country
- Simulated API call for country data
- Loading and error states

## API Simulation

The app simulates an API call to fetch the list of countries. There's an intentional random error built into the API simulation:

- There's a 10% chance that the API call will fail
- If it fails, an error message will be displayed
- To test error handling, you may need to refresh the page a few times

To adjust the error rate or disable it entirely, you can modify the `fetchCountries` function in `src/api/countriesApi.ts`. You can find the file in the `src/api` directory. Look for the intentional error simulation logic, which you can modify to suit your needs.

## Running Tests

To run the test suite, use the following command:

```bash
npm test
```

## Built With

- React
- TypeScript
- Vite
- React Query
- Fuse.js (for fuzzy search)
- Styled Components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or raise a new Issue.
