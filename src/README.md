# Source Code

## Project Structure

This folder contains the source code for the SitecoreAI llms.txt Generator Marketplace app.

### Directory Layout

```
src/
└── headapps/
    └── llmsgenerator/          # Main application directory
        ├── src/
        │   ├── App.tsx         # Main React component
        │   ├── App.css         # Application styles
        │   ├── main.tsx        # Entry point
        │   └── hooks/
        │       └── useMarketplaceClient.ts  # SDK initialization hook
        ├── public/             # Static assets
        ├── .env.local          # Local environment variables (not in version control)
        ├── package.json        # Dependencies and scripts
        ├── tsconfig.json       # TypeScript configuration
        └── vite.config.ts      # Vite build configuration
```

## Development

### Prerequisites

- Node.js 16+ and npm 10+
- SitecoreAI environment with API access

### Setup

```bash
cd headapps/llmsgenerator
npm install
npm run dev
```

The app will run on `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Key Technologies

- **React 19.2.4** - UI framework
- **TypeScript 5.9.3** - Type safety
- **Vite 7.3.1** - Build tool and dev server
- **Sitecore Marketplace SDK** - Integration with SitecoreAI

## Features

- Dashboard widget for SitecoreAI
- Generates llms.txt files for sites
- Copy to clipboard functionality
- Upload to Sitecore Media Library
- Site discovery via SitecoreAI APIs

