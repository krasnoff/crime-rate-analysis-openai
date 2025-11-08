import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const getAppsSdkCompatibleHtml = async (baseUrl: string, path: string) => {
  const result = await fetch(`${baseUrl}${path}`);
  return await result.text();
};

type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
  widgetDomain: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const html = await getAppsSdkCompatibleHtml(baseURL, "/");

  const contentWidget: ContentWidget = {
    id: "show_content",
    title: "Show Content",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html: html,
    description: "Displays the homepage content",
    widgetDomain: "https://nextjs.org/docs",
  };
  
  server.registerResource(
    "content-widget",
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": contentWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/html+skybridge",
          text: `<html>${contentWidget.html}</html>`,
          _meta: {
            "openai/widgetDescription": contentWidget.description,
            "openai/widgetPrefersBorder": true,
            "openai/widgetDomain": contentWidget.widgetDomain,
          },
        },
      ],
    })
  );

  // Register a prompt with instructions in user message
  server.registerPrompt(
    "content_assistant",
    {
      title: "Content Assistant", 
      description: "A prompt for helping with content creation",
      argsSchema: {
        topic: z.string().describe("The topic to create content about"),
        tone: z.string().optional().describe("The tone of voice to use")
      }
    },
    ({ topic, tone }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a helpful content assistant. Create engaging content about the given topic. ${tone ? `Use a ${tone} tone of voice.` : 'Use a friendly and professional tone.'} Always be helpful and accurate.\n\nPlease create content about: ${topic}`
          }
        }
      ]
    })
  );

  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description:
        "Fetch and display the homepage content with the name of the user",
      inputSchema: {
        name: z.string().describe("The name of the user to display on the homepage"),
        topic: z.string().describe("Topic for content generation"),
        tone: z.string().optional().describe("Tone of voice to use")
      },
      _meta: {
        ...widgetMeta(contentWidget),
        // "openai/suggestedPrompt": "content_assistant"
      }
      
    },
    async ({ name, topic, tone }) => {
      // Generate content message directly
      const contentMessage = `You are a helpful content assistant. Create engaging content about the given topic. ${tone ? `Use a ${tone} tone of voice.` : 'Use a friendly and professional tone.'} Always be helpful and accurate.\n\nPlease create content about: ${topic}`;

      return {
        content: [
          {
            type: "text",
            text: `Hello ${name}! ${contentMessage}`,
          },
        ],
        structuredContent: {
          name: name,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(contentWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
