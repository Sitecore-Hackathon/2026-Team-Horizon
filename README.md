
![Hackathon Logo](docs/images/hackathon.png?raw=true "Hackathon Logo")
# Sitecore Hackathon 2026 - Team Horizon
![Team Horizon Logo](docs/images/sitecore-hackathon-2026-TeamHorizon.png)


## Category
**Best Marketplace App for Sitecore AI**

## Description
The main goal of our submission is to revolutionize how Sitecore websites prepare for AI interactions (optional integration) through our innovative Marketplace App that automatically generates **LLMS.txt** files. 

**What is LLMS.txt?**  
LLMS.txt is a standardized markdown file that helps Large Language Models (LLMs) understand your website's content quickly and accurately. Think of it as a comprehensive guide for AI-a single file that contains all the essential information from your site in a format that AI agents can easily digest. This enables AI assistants like ChatGPT, Claude, and others to provide accurate, context-aware responses about your content without having to crawl your entire website.

Our Sitecore Marketplace app makes creating LLMS.txt effortless. Here's how it transforms your content workflow:

**The Smart Way to Build LLMS.txt:**  
Our app intelligently reads all pages tagged as "LLMS pages" within your Sitecore instance (based on configurable Sitecore Templates). It then automatically extracts each page's title and content, organizing them into a ready-to-use LLMS.txt file that follows industry best practices. No manual copying, no formatting headaches-just seamless automation that saves you hours of work.

**By Integrating with AI Agents for Optimized LLMS.txt:**  
This is where the magic happens. While our app generates a comprehensive LLMS.txt file, integrating with AI Agents takes it to the next level:

- **Intelligent Content Summarization:** Agents can analyze your page content and create concise, meaningful summaries rather than dumping entire pages, making the LLMS.txt file more efficient and faster for AI models to process.

- **Smart Prioritization:** AI Agents can identify and highlight the most important information from each page, ensuring critical content gets prominent placement in your LLMS.txt file.

- **Automatic SEO Optimization:** Agents can enhance your content with relevant keywords and structure it in a way that improves discoverability by AI search engines and assistants.

- **Context-Aware Formatting:** Instead of generic content extraction, Agents understand the relationships between your pages and can create logical groupings, hierarchies, and cross-references that make your LLMS.txt file more coherent.

- **Dynamic Updates:** With Agent integration, your LLMS.txt can be automatically regenerated and optimized whenever content changes, ensuring AI systems always have access to your latest, most relevant information.

- **Multi-Language Intelligence:** If you're running a global site, Agents can help create optimized LLMS.txt files for different languages, maintaining context and cultural nuances.

The result? A living, breathing LLMS.txt file that doesn't just list your content-it presents it in the most AI-friendly way possible, improving how AI assistants understand and represent your brand.

### How It Works
**Step 1: Content Discovery**  
The Marketplace app scans your Sitecore content tree and identifies all pages tagged for LLMS inclusion based on your Sitecore Template configuration.

**Step 2: Intelligent Extraction**  
For each tagged page, the app extracts the title and main content, respecting your content structure and hierarchy.

**Step 3: LLMS.txt Generation**  
All extracted content is compiled into a properly formatted LLMS.txt file following industry standards and best practices.

**Step 4: Agent Optimization (Optional)**  
When integrated with AI Agents, the generated content is analyzed and optimized for:
- Clarity and conciseness
- Proper structure and hierarchy
- Keyword optimization
- Context preservation
- Readability for AI models

**Step 5: Deployment**  
The finalized LLMS.txt file is ready to be deployed to your website root, making your entire site instantly AI-accessible.

![Architecture](docs/images/SitecoreAI-Marketplace-App-Architecture.png?raw=true "Architecture Logo")

### Template and Page Details

![Template and Page Details](docs/images/SitecoreAI-Template-Page-View.png?raw=true "Template and Page Details")

### Dashboard Widget in Action

The app appears as a dashboard widget in SitecoreAI, providing:
- Current site context display
- Dropdown to select from all available sites in your environment
- One-click llms.txt generation
- Copy to clipboard functionality
- Direct upload to Sitecore Media Library

![Marketplace App Dashboard](docs/images/marketplace-dashboard.png?raw=true "Dashboard Widget")

![LLMS.txt Output](docs/images/llms-output.png?raw=true "Generated Output")

## Video link

<a href="http://www.youtube.com/watch?feature=player_embedded&v=ENyBnhuoXlc" target="_blank">
 <img src="https://img.youtube.com/vi/ENyBnhuoXlc/hqdefault.jpg" alt="Watch the video" width="240" height="180" border="10" />
</a>


## Pre-requisites and Dependencies

**Required:**

1. SitecoreAI Access
2. Marketplace app installed in your Sitecore Cloud Portal organization.
3. Node.js 16 or later
4. npm 10 or later
5. Visual Studio Code

**Optional (For AI Agent Integration):**

6. Azure Subscription for Azure OpenAI (for Agent optimization features)


**Sitecore Configuration:**

- Configure Sitecore templates to include LLMS tagging fields
- Ensure proper content author permissions for tagging pages


## Installation instructions

1. **Configure Templates:**
   - Install the LLMS template (`docs\LLMS Template.zip`) for the LLMS tagging field
   - Inherit the template into your Page Template
 
2. **Register the Custom Marketplace App:**
   - Follow the instructions at [Create a custom Marketplace app](https://doc.sitecore.com/mp/en/developers/marketplace/create-a-custom-marketplace-app.html)
   - Configure the dashboard widget extension point
   - Enable "SitecoreAI APIs" access
   - Set deployment URL (use `http://localhost:5173` for local development)
   - Install the app in your SitecoreAI environment

   Your LLM Generator will appear on `My apps` as shown below
   
   ![My apps](docs/images/SitecoreCloud-MyApps.png?raw=true "My apps")

   Follow the link to launch the LLM Generator in `App studio` as shown below
   
   ![App studio](docs/images/SitecoreCloud-Appstudio.png?raw=true "App studio")

### Configuration

**AI Agent Integration (Optional):**
- Add your Azure OpenAI API keys in the configuration
- Set optimization preferences (summary length, keyword density, etc.)
- Configure regeneration schedules

## Usage instructions

**Basic LLMS.txt Generation:**

1. **Tag Your Content:**
   - Open pages you want to include in LLMS.txt
   - Check the "Is Displayed in LLMS.txt File" checkbox (or your configured field)
   - Publish your changes

2. **Generate LLMS.txt:**
   - Open your SitecoreAI site dashboard
   - Locate the LLMS Generator widget
   - Select your site from the dropdown (or use the current site)
   - Click "Generate LLMS.txt"
   - Wait for the process to complete (typically a few seconds)

3. **Review & Deploy:**
   - Preview the generated LLMS.txt file in the widget
   - Click "Copy to Clipboard" to copy the content
   - Or click "Upload to Media Library" to upload directly to `/sitecore/media library/Project/{site-name}/llms.txt`
   - Your site is now AI-ready!

---

## 🏗️ Technical Implementation

### Architecture Overview

This Marketplace app is built as a **Dashboard Widget** that appears in the SitecoreAI site dashboard.

**Extension Point:** Dashboard Widget  
**SDK Packages Used:**
- `@sitecore-marketplace-sdk/client` (v0.3.2+) - Required for all Marketplace apps
- `@sitecore-marketplace-sdk/xmc` (v0.4.1+) - For XM Cloud API access

### APIs Utilized

- **application.context** - Retrieves app details and Sitecore Context ID
- **site.context** - Gets current site information (dashboard widget specific)
- **xmc.xmapp.listSites** - Lists all sites in the SitecoreAI environment
- **xmc.authoring.graphql** - Executes GraphQL mutations (uploadMedia) for file uploads

### Project Structure

```
src/headapps/llmsgenerator/
├── src/
│   ├── App.tsx                     # Main dashboard widget component
│   ├── App.css                     # Widget styling
│   ├── main.tsx                    # React entry point
│   ├── index.css                   # Global styles
│   └── hooks/
│       └── useMarketplaceClient.ts # Marketplace SDK initialization hook with XMC
├── public/                         # Static assets
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

### Development Setup

**Prerequisites:**
- Node.js 16+
- npm 10+
- A Marketplace app registered and installed in Sitecore Cloud Portal
- SitecoreAI environment access

**Running Locally:**

```bash
cd src/headapps/llmsgenerator
npm run dev
```

The app will be available at: `http://localhost:5173`

**Building for Production:**

```bash
npm run build
```

Deploy the `dist` folder to a hosting provider (Azure Static Web Apps, Vercel, etc.)

### Key Implementation Details

**XMC Package Initialization:**

```typescript
const config = {
  target: window.parent,
  modules: [XMC], // Enables XM Cloud API access
};
```

**Site Querying:**

```typescript
const response = await client.query("xmc.xmapp.listSites", {
  params: {
    query: {
      sitecoreContextId,
    },
  },
});
```

**Media Library Upload:**

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

### Debugging Tips

1. Open the app in SitecoreAI (not localhost)
2. Open browser Developer Tools > Console
3. Look for initialization logs and API responses
4. Network tab will show API requests to SitecoreAI
5. For upload issues, check for CORS errors (expected in local dev)

### Important Notes

- The app must be opened within SitecoreAI (not localhost) to access Sitecore APIs
- Built-in authorization is managed by the Marketplace SDK
- Page information in SitecoreAI is stored in `pageContext.pageInfo` (not `pageContext.item`)
- Media library upload works when deployed; may encounter CORS restrictions in local development
- For local testing, use the "Copy to Clipboard" feature instead of upload

### Additional Resources

- [Sitecore Marketplace Documentation](https://doc.sitecore.com/mp/en/developers/marketplace)
- [Marketplace SDK for JavaScript](https://doc.sitecore.com/mp/en/developers/sdk/latest/sitecore-marketplace-sdk)
- [SitecoreAI APIs](https://api-docs.sitecore.com/xmc)
- [SitecoreAI GraphQL API](https://doc.sitecore.com/xmc/en/developers/xm-cloud/sitecore-authoring-and-management-graphql-api.html)

---

## Comments

This Marketplace app bridges the gap between traditional CMS content management and the AI-first future. By making it easy to generate and maintain LLMS.txt files, we're ensuring that Sitecore websites are ready for the next generation of AI-powered search and discovery.

The Agent integration feature represents the cutting edge of content optimization-combining human creativity with AI intelligence to create the best possible representation of your content for AI systems.
