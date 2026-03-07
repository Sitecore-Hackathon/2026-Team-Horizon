import { useState, useEffect } from "react";
import { useMarketplaceClient } from "./utils/hooks/useMarketplaceClient";
import type { ApplicationContext } from "@sitecore-marketplace-sdk/client";
import "./App.css";

interface Site {
  id: string | null | undefined;
  name: string | null | undefined;
  hosts?: Array<{
    id?: string;
    name?: string;
    targetHostname?: string;
    hostnames?: string[];
    properties?: {
      rootPath?: string;
      startItem?: string;
    };
  }>;
}

interface SiteContext {
  site?: {
    id?: string;
    name?: string;
  };
}

interface LLMPage {
  id: string;
  name: string;
  path: string;
  url: string;
}

export default function App() {
  const { client, error, isInitialized } = useMarketplaceClient();
  const [appContext, setAppContext] = useState<ApplicationContext>();
  const [siteContext, setSiteContext] = useState<SiteContext>();
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");

  useEffect(() => {
    if (!error && isInitialized && client) {
      console.log("Marketplace client initialized successfully.");

      // Make a query to retrieve the application context
      client.query("application.context")
        .then((res) => {
          console.log("Success retrieving application.context:", res.data);
          setAppContext(res.data);
        })
        .catch((error) => {
          console.error("Error retrieving application.context:", error);
        });

      // Query site context (available in dashboard widget extension point)
      client.query("site.context")
        .then((res) => {
          console.log("Success retrieving site.context:", res.data);
          setSiteContext(res.data as SiteContext);
          // Pre-select the current site
          if (res.data?.site?.id) {
            setSelectedSiteId(res.data.site.id);
          }
        })
        .catch((error) => {
          console.error("Error retrieving site.context:", error);
        });

      // List all sites using XM Cloud Sites API
      if (appContext?.resourceAccess?.[0]?.context?.preview) {
        listAllSites();
      }
    } else if (error) {
      console.error("Error initializing Marketplace client:", error);
    }
  }, [client, error, isInitialized]);

  // List all sites when appContext is available
  useEffect(() => {
    if (client && appContext?.resourceAccess?.[0]?.context?.preview) {
      listAllSites();
    }
  }, [appContext, client]);

  const listAllSites = async () => {
    if (!client || !appContext?.resourceAccess?.[0]?.context?.preview) {
      console.error("Client or Sitecore Context ID not available");
      return;
    }

    const sitecoreContextId = appContext.resourceAccess[0].context.preview;
    console.log("Fetching sites with Context ID:", sitecoreContextId);

    try {
      const response = await client.query("xmc.xmapp.listSites", {
        params: {
          query: {
            sitecoreContextId,
          },
        },
      });

      console.log("Sites API response:", response);
      
      if (response.data?.data) {
        // Debug: Log the first site to see its structure
        console.log("First site structure:", JSON.stringify(response.data.data[0], null, 2));
        setSites(response.data.data as Site[]);
        console.log("Sites loaded:", response.data.data);
      }
    } catch (error) {
      console.error("Error listing sites:", error);
    }
  };

  const fetchLLMPages = async (siteId: string): Promise<LLMPage[]> => {
    if (!client || !appContext) {
      console.error("Client or appContext not available");
      return [];
    }

    try {
      // Get the sitecoreContextId from the app context
      const sitecoreContextId = appContext.resourceAccess?.[0]?.context?.preview || "";
      
      if (!sitecoreContextId) {
        console.error("sitecoreContextId not found in appContext");
        return [];
      }

      // GraphQL query to search using sitecore_master_index
      // Search for items with "isLLMPage" field set to "1"
      const graphqlQuery = `
        query GetLLMPages {
          search(
            query: {
              index: "sitecore_master_index"
              searchStatement: {
                criteria: [
                  {
                    operator: MUST
                    field: "isllmpage_b"
                    value: "1"
                  }
                ]
              }
            }
          ) {
            results {
              innerItem {
                itemId
                name
                path
                url
              }
            }
          }
        }
      `;

      const response = await client.mutate("xmc.authoring.graphql", {
        params: {
          query: {
            sitecoreContextId,
          },
          body: {
            query: graphqlQuery
          }
        }
      });

      console.log("LLM Pages GraphQL response:", response);

      // Parse the response from search query  - results contain innerItem
      const searchResults = (response.data as any)?.data?.search?.results || [];
      
      // Extract the innerItem from each result
      const llmPages = searchResults.map((result: any) => result.innerItem).filter((item: any) => item);
      
      console.log(`Found ${llmPages.length} pages with LLM checkbox enabled:`, llmPages);
      
      // Get the selected site to construct URLs
      const selectedSite = sites.find(s => s.id === siteId);
      const siteName = selectedSite?.name || '';
      
      // Debug: Log the selected site object
      console.log("Selected site for URL construction:", selectedSite);
      console.log("Selected site hosts:", selectedSite?.hosts);
      
      // Get target hostname from site hosts
      let targetHostname = selectedSite?.hosts?.[0]?.targetHostname;
      
      // Remove protocol if present (to add it back consistently)
      if (targetHostname) {
        targetHostname = targetHostname.replace(/^https?:\/\//, '');
      }
      
      console.log("Target hostname:", targetHostname);
      
      // Get the root path and start item from hosts[0].properties
      const rootPath = selectedSite?.hosts?.[0]?.properties?.rootPath || `/sitecore/content/${siteName}`;
      const startItem = selectedSite?.hosts?.[0]?.properties?.startItem || '';
      console.log("Root path to strip:", rootPath);
      console.log("Start item:", startItem);
      
      return llmPages.map((item: any) => {
        // Always construct URL from path using targetHostname
        let url = '';
        
        if (item.path) {
          console.log("Processing path:", item.path);
          
          // Remove the root path prefix (e.g., /sitecore/content/rp-poc/sug-demo)
          let relativePath = item.path;
          if (relativePath.toLowerCase().startsWith(rootPath.toLowerCase())) {
            relativePath = relativePath.substring(rootPath.length);
            console.log("  After stripping rootPath:", relativePath);
          }
          
          // Remove start item prefix (e.g., /Home) if present
          if (startItem && relativePath.toLowerCase().startsWith(startItem.toLowerCase())) {
            console.log("  Stripping startItem:", startItem);
            relativePath = relativePath.substring(startItem.length);
            console.log("  After stripping startItem:", relativePath);
          }
          
          // Remove leading slash
          relativePath = relativePath.replace(/^\//, '');
          console.log("  Final relativePath:", relativePath);
          
          // Construct full URL with target hostname if available
          if (targetHostname) {
            // Don't add trailing slash if relativePath is empty (for home page)
            url = relativePath ? `https://${targetHostname}/${relativePath}` : `https://${targetHostname}`;
          } else {
            url = relativePath ? '/' + relativePath : '/';
          }
          console.log("  Final URL:", url);
        }
        
        return {
          id: item.itemId || "",
          name: item.name || "",
          path: item.path || "",
          url: url || item.path || ""
        };
      });
    } catch (error) {
      console.error("Error fetching LLM pages:", error);
      return [];
    }
  };

  const handleCreateLlmsTxt = async () => {
    if (!selectedSiteId) {
      setMessage("Please select a site first");
      return;
    }

    setIsCreatingFile(true);
    setMessage("");

    try {
      const selectedSite = sites.find(s => s.id === selectedSiteId);
      console.log("Creating LLMs.txt for site:", selectedSite);

      // Fetch pages marked for LLM indexing
      setMessage("⏳ Fetching pages marked for LLM indexing...");
      const llmPages = await fetchLLMPages(selectedSiteId);
      console.log(`Found ${llmPages.length} pages marked for LLM indexing:`, llmPages);

      // Generate llms.txt content with pages
      setMessage("⏳ Generating llms.txt content...");
      const llmsTxtContent = generateLlmsTxtContent(selectedSite, llmPages);
      console.log("Generated llms.txt content:", llmsTxtContent);

      // Store the generated content to display in the widget
      setGeneratedContent(llmsTxtContent);

      const pagesInfo = llmPages.length > 0 
        ? ` (including ${llmPages.length} page${llmPages.length !== 1 ? 's' : ''})`
        : ' (no pages marked for LLM indexing)';
      setMessage(`✅ Content generated for ${selectedSite?.name}${pagesInfo}! Use the copy button below.`);
      console.log("✅ llms.txt content generated and displayed");
    } catch (error) {
      console.error("Error creating LLMs.txt:", error);
      setMessage(`❌ Error creating LLMs.txt: ${error}`);
    } finally {
      setIsCreatingFile(false);
    }
  };

  const handleCopyContent = () => {
    // Fallback method for copying text in iframes
    try {
      const textarea = document.createElement('textarea');
      textarea.value = generatedContent;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        setMessage("✅ Content copied to clipboard!");
        console.log("Content copied to clipboard");
      } else {
        throw new Error("Copy command failed");
      }
    } catch (error) {
      console.error("Failed to copy content:", error);
      setMessage("❌ Failed to copy content. Please manually select and copy the text.");
    }
  };

  const handleUploadToMediaLibrary = async () => {
    if (!client || !appContext?.resourceAccess?.[0]?.context?.preview) {
      setMessage("❌ Cannot upload: Client or Context ID not available");
      return;
    }

    if (!generatedContent) {
      setMessage("❌ No content to upload. Please generate llms.txt first.");
      return;
    }

    const selectedSite = sites.find(s => s.id === selectedSiteId);
    // Path should NOT include "/sitecore/media library" prefix
    const mediaItemPath = `Project/rp-poc/${selectedSite?.name || 'default'}/llms`;
    
    try {
      console.log("Step 1: Requesting pre-signed upload URL for path:", mediaItemPath);
      setMessage("⏳ Requesting upload URL...");

      const sitecoreContextId = appContext.resourceAccess[0].context.preview;
      
      console.log("Using Sitecore Context ID:", sitecoreContextId);

      // GraphQL mutation to get pre-signed upload URL
      const uploadMediaMutation = {
        query: `
          mutation {
            uploadMedia(input: { itemPath: "${mediaItemPath}" }) {
              presignedUploadUrl
            }
          }
        `
      };

      console.log("Calling uploadMedia mutation via SDK...");

      // Use SDK's mutation operation to make GraphQL call
      // Type assertion to ensure TypeScript knows client is not null
      const uploadUrlResponse = await client!.mutate("xmc.authoring.graphql", {
        params: {
          query: { sitecoreContextId },
          body: uploadMediaMutation
        }
      });

      console.log("Upload URL response:", uploadUrlResponse);

      // Type assertion for GraphQL response structure
      const graphqlData = uploadUrlResponse.data?.data as { 
        uploadMedia?: { 
          presignedUploadUrl?: string 
        } 
      };
      const presignedUrl = graphqlData?.uploadMedia?.presignedUploadUrl;
      
      if (!presignedUrl) {
        console.error("No presigned URL in response:", uploadUrlResponse);
        throw new Error("Failed to get pre-signed upload URL");
      }

      console.log("Step 2: Uploading file to pre-signed URL...");
      setMessage("⏳ Uploading file...");

      // Create a blob from the content
      const blob = new Blob([generatedContent], { type: 'text/plain' });
      
      // Create FormData and append the file (using empty key as per Sitecore docs)
      const formData = new FormData();
      formData.append('', blob, 'llms.txt');

      // POST the file to the pre-signed URL with SDK-provided context ID for authorization
      const uploadResponse = await fetch(presignedUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sitecoreContextId}`
        },
        body: formData,
        mode: 'cors' // Explicitly set CORS mode
      });

      console.log("Upload response status:", uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("Upload failed:", errorText);
        throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log("Upload successful:", uploadResult);
      
      setMessage(`✅ File uploaded successfully to /sitecore/media library/${mediaItemPath}.txt`);
      
    } catch (error) {
      console.error("Failed to upload file to media library:", error);
      
      // Check if it's a CORS error (common in local development)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setMessage(`ℹ️ Upload blocked by browser CORS policy (expected in local dev). Use "Copy to Clipboard" or test upload after deploying the app to Sitecore.`);
      } else {
        setMessage(`❌ Upload failed: ${error}. Try using Copy to Clipboard instead.`);
      }
    }
  };

  const generateLlmsTxtContent = (site: Site | undefined, pages: LLMPage[] = []): string => {
    if (!site || !site.name) return "";

    // Build pages section if pages are available
    let pagesSection = "";
    if (pages.length > 0) {
      pagesSection = `\n# Pages\nThe following pages are marked for LLM indexing:\n\n`;
      pages.forEach(page => {
        pagesSection += `- ${page.name}: ${page.url || 'N/A'}\n`;
      });
    }

    return `# llms.txt for ${site.name}

# Site Information
Site Name: ${site.name}
Site ID: ${site.id || 'N/A'}
Generated: ${new Date().toISOString()}

# About this site
This file provides information about ${site.name} for Large Language Models (LLMs).

# Purpose
This llms.txt file follows the llms.txt standard to help LLMs understand the structure
and content of this Sitecore XM Cloud site.

# Site Structure
- Site ID: ${site.id || 'N/A'}
- Site Name: ${site.name}
- Generated from Sitecore XM Cloud Dashboard Widget
${pagesSection}
# Additional Information
For more details about this site, please refer to the Sitecore XM Cloud documentation.
`;
  };

  if (!isInitialized) {
    return (
      <div className="app">
        <p>Initializing Marketplace client...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <h2>⚠️ Error</h2>
        <p>Failed to initialize Marketplace client: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sites-list">
        <h3>Available Sites ({sites.filter(site => site.id && site.name).length})</h3>
        <ul>
          {sites.filter(site => site.id && site.name).map((site) => (
            <li key={site.id!}>
              {site.name} <span className="site-id">({site.id})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="widget-content">
        <h2>Select a site to get started</h2>        
        <div className="form-group">          
          <select
            id="site-select"
            value={selectedSiteId}
            onChange={(e) => {
              setSelectedSiteId(e.target.value);
              console.log("Site selected:", e.target.value);
            }}
            className="site-dropdown"
          >
            <option value="">-- Select a site --</option>
            {sites.filter(site => site.id && site.name).map((site) => (
              <option key={site.id!} value={site.id!}>
                {site.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreateLlmsTxt}
          disabled={!selectedSiteId || isCreatingFile}
          className="confirm-button"
        >
          {isCreatingFile ? "Generating..." : "Generate LLMs.txt"}
        </button>

        {generatedContent && (
          <div className="content-display">
            
                {message && (
                  <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
            
            <div className="content-actions">
              <div className="button-group">
                <button onClick={handleCopyContent} className="copy-button">
                  📋 Copy to Clipboard
                </button>
                <button 
                  onClick={handleUploadToMediaLibrary} 
                  className="upload-button"
                  title="Upload LLMs.txt to your Media Library"
                >
                  ☁️ Upload to Media Library
                </button>
              </div>
              <p style={{ fontSize: '11px', color: '#666', marginTop: '8px', marginBottom: '0' }}>
                💡 Upload may not work in local dev due to CORS. Works after deploying to Sitecore.
              </p>
              
            </div>
            <div className="content-info">
                <textarea
                  className="content-textarea"
                  value={generatedContent}
                  readOnly
                  rows={15}
                />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
