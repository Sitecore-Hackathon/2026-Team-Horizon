# Hackathon Submission Entry form

## Team name
Team Horizon

## Category
Best Marketplace App for SitecoreAI

## Description

**SitecoreAI llms.txt Generator** is a Sitecore Marketplace dashboard widget that generates llms.txt files for SitecoreAI sites, enabling better AI/LLM integration and content understanding.

### Module Purpose
This widget provides a streamlined way to generate llms.txt files directly from the SitecoreAI dashboard. The llms.txt standard helps Large Language Models (LLMs) understand website structure and content, improving AI-powered interactions with Sitecore sites.

### Problem Solved
As AI and LLMs become increasingly important for content discovery and interaction, websites need a standardized way to communicate their structure to these systems. The llms.txt format provides this standard, but manually creating these files for each site is time-consuming and error-prone.

### Solution
Our Marketplace widget:
- Integrates seamlessly into the SitecoreAI dashboard as a native widget
- Automatically discovers all sites in your SitecoreAI environment via the SitecoreAI API
- Generates properly formatted llms.txt content with site metadata
- Provides one-click copy-to-clipboard functionality for easy deployment
- Supports direct upload to Sitecore Media Library (when deployed)
- Requires zero additional infrastructure - runs entirely within the Sitecore Marketplace framework

## Video link

⟹ [Add Video Link Here](#video-link)

## Pre-requisites and Dependencies

- **SitecoreAI Environment** - Active SitecoreAI tenant
- **Sitecore Cloud Portal Access** - To register and install the Marketplace app
- **Node.js 16+** and **npm 10+** (for local development only)
- **Sitecore Marketplace SDK**:
  - `@sitecore-marketplace-sdk/client` (^0.3.2)
  - `@sitecore-marketplace-sdk/xmc` (^0.4.1)

## Installation instructions

### 1. Register the Marketplace App

1. Log into [Sitecore Cloud Portal](https://portal.sitecorecloud.io)
2. Navigate to App Studio
3. Click "Create App" 
4. Fill in app details:
   - **Name**: SitecoreAI llms.txt Generator
   - **Description**: Generate llms.txt files for your SitecoreAI sites
5. Under **Extension Points**, enable:
   - ✅ Dashboard Widget (SitecoreAI)
6. Under **API Access**, enable:
   - ✅ SitecoreAI APIs
7. Save the app

### 2. Build and Deploy the Widget

```bash
# Navigate to the app directory
cd src/headapps/llmsgenerator

# Install dependencies
npm install

# Build for production
npm run build

# Deploy the 'dist' folder to your hosting provider
# (e.g., Azure Static Web Apps, Vercel, Netlify)
```

### 3. Configure App Deployment URL

1. Return to App Studio in Cloud Portal
2. Open your app configuration
3. Set **Deployment URL** to your hosted app URL (e.g., `https://your-app.azurestaticapps.net`)
4. Set **Route URL** to `/` (or your configured route)
5. Save changes

### 4. Install the App in Your Environment

1. In Cloud Portal, navigate to your SitecoreAI organization
2. Go to the Marketplace
3. Find your app (or install from the marketplace once published)
4. Click "Install" and select your SitecoreAI environment
5. Confirm installation

### Configuration

No additional configuration required! The widget uses built-in Marketplace authentication and automatically discovers your SitecoreAI sites via the SitecoreAI API.

## Usage instructions

### Accessing the Widget

1. Log into your SitecoreAI environment
2. Navigate to any site's dashboard in SitecoreAI
3. The **SitecoreAI llms.txt Generator** widget will appear in your dashboard

### Generating llms.txt Files

1. **View Current Site** - The widget displays your current site context at the top
2. **Select a Site** - Use the dropdown to select any site in your environment
3. **Generate Content** - Click the "Generate llms.txt" button
4. **Copy or Upload**:
   - **📋 Copy to Clipboard**: Copy the generated content and manually upload
   - **☁️ Upload to Media Library**: Directly upload to Sitecore Media Library at `/sitecore/media library/Project/rp-poc/{site-name}/llms.txt` (works when app is deployed to Sitecore; may be blocked by CORS in local development)
5. **Deploy** (if using clipboard): Save the content as `llms.txt` in your site's root directory

### Generated Content Structure

The generated llms.txt file includes:
- Site name and ID
- Generation timestamp
- Site purpose and structure information
- Standard llms.txt formatting for LLM consumption

### Widget Features

- **Site Discovery**: Automatically lists all sites in your SitecoreAI environment using SitecoreAI Sites REST API
- **Context Awareness**: Pre-selects the current dashboard site from application context
- **Live Preview**: View generated content in an editable textarea before copying or uploading
- **Copy to Clipboard**: One-click copying that works within the Sitecore iframe security context
- **Media Library Upload**: Direct upload to Sitecore Media Library using GraphQL uploadMedia mutation
  - Uses two-step process: get presigned URL via GraphQL, then POST file to URL
  - Automatically organizes files by site: `/sitecore/media library/Project/rp-poc/{site-name}/llms.txt`
  - Works when deployed; may encounter CORS restrictions in local development
- **Site Counter**: Shows total number of available sites
- **Status Messages**: Clear feedback for success/error states

### Developer Console Logs

The widget includes extensive console logging for debugging:
- SDK initialization status
- Application and site context retrieval
- Sites list fetching
- Site selection events
- Content generation

Open browser Developer Tools (F12) → Console to view detailed logs.

## Comments

This project demonstrates the power of the Sitecore Marketplace SDK for creating native dashboard extensions. The widget uses modern React development with TypeScript and integrates seamlessly with SitecoreAI APIs.

**Technical Highlights:**
- Built with React 19.2.4 and TypeScript 5.9.3
- Uses Vite 7.3.1 for blazing-fast development
- Implements Sitecore Marketplace SDK:
  - `@sitecore-marketplace-sdk/client` for SDK core functionality
  - `@sitecore-marketplace-sdk/xmc` for SitecoreAI API access
- Integrates with multiple SitecoreAI APIs:
  - **Application Context API**: Retrieves app and environment context
  - **Site Context API**: Gets current site information
  - **Sites REST API**: Lists all sites in the environment
  - **Authoring GraphQL API**: Executes uploadMedia mutation for file uploads
- Follows Sitecore API best practices:
  - Uses SDK mutation operations (`xmc.authoring.graphql`) to avoid CORS issues
  - Implements proper error handling and user feedback
  - Respects iframe security constraints
- Custom React hook (`useMarketplaceClient`) for SDK initialization with XMC module

**Future Enhancements:**
- Auto-crawl site content structure from Sitecore items
- Include page hierarchy and navigation in llms.txt
- Support custom llms.txt templates with user-defined sections
- Batch processing for multiple sites
- Schedule automated llms.txt regeneration
- Integration with Sitecore Publishing Service to deploy to delivery edge

**Known Limitations:**
- Media Library upload requires the app to be deployed within Sitecore environment
- Local development upload may be blocked by browser CORS policy (use "Copy to Clipboard" for local testing)
- Generated files currently use static template; content crawling planned for future release
- Multi-language site support
