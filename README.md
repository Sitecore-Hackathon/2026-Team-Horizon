# SitecoreAI llms.txt Generator - Marketplace Widget

A Sitecore Marketplace dashboard widget app that generates llms.txt files for SitecoreAI sites.

## 🎯 Overview

This Marketplace app appears as a dashboard widget in SitecoreAI. It allows users to:
- View all sites in their SitecoreAI environment
- Select a site from a dropdown
- Generate an llms.txt file for the selected site
- Copy the generated content to clipboard
- Upload directly to Sitecore Media Library (when deployed)

## 🏗️ Architecture

**Referenced Documentation:**
- [Sitecore Marketplace SDK - Quick Start (Manual)](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/quick-start--manual-.html)
- [Initialize the xmc package](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/initialize-the-xmc-package.html)
- [Dashboard Widget Extension Point](https://doc.sitecore.com/mp/en/developers/marketplace/extension-points.html#sitecoreai)
- [Make a GraphQL Query](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/make-a-graphql-query.html)
- [Query the Site Context](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk/query-the-site-context.html)

### Extension Point
- **Dashboard Widget** - Appears in the SitecoreAI site dashboard

### SDK Packages Used
- `@sitecore-marketplace-sdk/client` (latest) - Required for all Marketplace apps
- `@sitecore-marketplace-sdk/xmc` (latest) - For XM Cloud API access

### APIs Used
- **application.context** - Retrieves app details and Sitecore Context ID
- **site.context** - Gets current site information (dashboard widget specific)
- **xmc.xmapp.listSites** - Lists all sites in the SitecoreAI environment
- **xmc.authoring.graphql** - Executes GraphQL mutations (uploadMedia) for file uploads

## 📁 Project Structure

```
src/headapps/llmsgenerator/
├── src/
│   ├── App.tsx                           # Main dashboard widget component
│   ├── App.css                           # Widget styling
│   ├── main.tsx                          # React entry point
│   ├── index.css                         # Global styles
│   └── hooks/
│       └── useMarketplaceClient.ts       # Marketplace SDK initialization hook with XMC
├── public/                                # Static assets
├── package.json                           # Dependencies and scripts
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite build configuration
```

## 🚀 Development

### Prerequisites
- Node.js 16+ 
- npm 10+
- A Marketplace app registered and installed in Sitecore Cloud Portal
- SitecoreAI environment access

### Installation

Dependencies are already installed. The app uses:
```json
{
  "@sitecore-marketplace-sdk/client": "^0.3.2",
  "@sitecore-marketplace-sdk/xmc": "^0.4.1",
  "react": "19.2.4",
  "react-dom": "19.2.4",
  "typescript": "5.9.3",
  "vite": "7.3.1"
}
```

### Running the App

Navigate to the app directory and start the development server:

```bash
cd src/headapps/llmsgenerator
npm run dev
```

The app will be available at: http://localhost:5173

### Console Logging

The app includes extensive console logging for debugging:
- SDK initialization status
- Application context retrieval
- Site context retrieval  
- Sites list fetching
- Site selection
- llms.txt generation
- Media library upload status

Open your browser's Developer Tools console to see these logs.

## 🔧 Configuration

### Marketplace App Setup

1. **Register the app** in Sitecore Cloud Portal (App Studio)
2. **Extension Point**: Enable "Dashboard Widget"
3. **API Access**: Enable "SitecoreAI APIs"
4. **Deployment URL**: Set to `http://localhost:5173` for local development
5. **Route URL**: Use the default route (e.g., `/dashboard-widget`)
6. **Install the app** in your SitecoreAI environment

### Important Notes from Documentation

- The app uses **built-in authorization** managed by the Marketplace SDK
- Page information in SitecoreAI is stored in `pageContext.pageInfo` (not `pageContext.item`)
- SitecoreAI API requests require the Sitecore Context ID from `application.context`
- The SDK wraps API responses in a `data` property
- Media library uploads use the GraphQL `uploadMedia` mutation via SDK's `xmc.authoring.graphql` operation

## 🎨 Features

### Dashboard Widget
- Displays as a widget in the SitecoreAI site dashboard
- Shows current site context
- Lists all available sites in a dropdown
- Generates llms.txt files with site information
- Copy to clipboard functionality
- Direct upload to Sitecore Media Library

### llms.txt Generation
The generated llms.txt file includes:
- Site name and ID
- Generation timestamp
- Site structure information
- Following the llms.txt standard for LLMs

### Media Library Upload
- Uses GraphQL `uploadMedia` mutation to get presigned upload URL
- Uploads file to `/sitecore/media library/Project/rp-poc/{site-name}/llms.txt`
- Two-step process: request presigned URL, then POST file
- Note: May encounter CORS restrictions in local development; works when deployed to Sitecore

## 📝 Implementation Details

### XMC Package Initialization

The `useMarketplaceClient` hook initializes the SDK with the XMC module:

```typescript
const config = {
  target: window.parent,
  modules: [XMC], // Enables XM Cloud API access
};
```

### Site Querying

The app queries sites using the SitecoreAI Sites REST API:

```typescript
const response = await client.query("xmc.xmapp.listSites", {
  params: {
    query: {
      sitecoreContextId,
    },
  },
});
```

### Media Library Upload

The app uploads files using the GraphQL uploadMedia mutation:

```typescript
const uploadUrlResponse = await client.mutate("xmc.authoring.graphql", {
  params: {
    query: { sitecoreContextId },
    body: {
      query: `
        mutation {
          uploadMedia(input: { itemPath: "${mediaItemPath}" }) {
            presignedUploadUrl
          }
        }
      `
    }
  }
});
```

## 🔍 Debugging

1. Open the app in SitecoreAI (not localhost)
2. Open browser Developer Tools > Console
3. Look for initialization logs and API responses
4. Network tab will show API requests to SitecoreAI
5. For upload issues, check for CORS errors (expected in local dev)

## 📚 Additional Resources

- [Sitecore Marketplace Documentation](https://doc.sitecore.com/mp/en/developers/marketplace)
- [Marketplace SDK for JavaScript](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk)
- [SitecoreAI APIs](https://api-docs.sitecore.com/xmc)
- [SitecoreAI GraphQL API](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-authoring-and-management-graphql-api.html)

## 🎯 Next Steps

1. Build the app: `cd src/headapps/llmsgenerator && npm run build`
2. Deploy the `dist` folder to a hosting provider (Azure Static Web Apps, Vercel, etc.)
3. Register the app in Cloud Portal with your deployed URL
4. Configure the dashboard widget extension point
5. Install the app in your SitecoreAI environment
6. Open the dashboard of any SitecoreAI site
7. Find your widget and test the llms.txt generation
8. Try both "Copy to Clipboard" and "Upload to Media Library" features

## ⚠️ Important

- The app must be opened within SitecoreAI (not localhost) to access Sitecore APIs
- Ensure your app has API access configured for "SitecoreAI APIs"
- The Sitecore Context ID is retrieved from the application context automatically
- Media library upload works when deployed; may encounter CORS restrictions in local development
- For local testing, use the "Copy to Clipboard" feature instead of upload
