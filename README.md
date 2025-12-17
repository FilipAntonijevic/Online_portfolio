# Portfolio Vending Machine

A minimal React portfolio application with an interactive vending machine UI for showcasing GitHub projects.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Features

- 3-column responsive layout (About Me, Project Vending Machine, Work Experience)
- Fetches public GitHub repositories via REST API
- Interactive "drop" animation when clicking projects
- Accessible keyboard navigation
- Mobile-responsive design

## Customization

- **About Me text**: Edit `src/components/LeftColumn.js`
- **GitHub username**: Change in `src/App.js` (GITHUB_USERNAME constant)
- **Number of projects**: Edit MAX_PROJECTS in `src/App.js`
- **Colors & spacing**: Modify CSS variables in `src/styles.css`

## Optional Enhancement

For smoother animations, install framer-motion:
```bash
npm install framer-motion
```

Then update ProjectTile.js to use motion components.
