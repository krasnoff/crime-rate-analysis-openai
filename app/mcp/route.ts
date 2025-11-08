import { baseURL } from "@/baseUrl";
import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { SYSTEM_PROMPT } from "../utils/system-prompt";

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
    id: "generate_query_widget",
    title: "Show Crime rates",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html: html,
    description: "Displays crime rates based on user queries",
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

  // // Register a prompt with instructions in user message
  // server.registerPrompt(
  //   "content_assistant",
  //   {
  //     title: "Content Assistant", 
  //     description: "A prompt for helping with content creation",
  //     argsSchema: {
  //       topic: z.string().describe("The topic to create content about"),
  //       tone: z.string().optional().describe("The tone of voice to use")
  //     }
  //   },
  //   ({ topic, tone }) => ({
  //     messages: [
  //       {
  //         role: "user",
  //         content: {
  //           type: "text",
  //           text: `You are a helpful content assistant. Create engaging content about the given topic. ${tone ? `Use a ${tone} tone of voice.` : 'Use a friendly and professional tone.'} Always be helpful and accurate.\n\nPlease create content about: ${topic}`
  //         }
  //       }
  //     ]
  //   })
  // );

  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description:
        `Generate the query necessary to retrieve the crime rates data the user wants`,
      inputSchema: {
        query: z.string().describe("The keyword or keywords to generate the SQL query for"),
        
      },
      _meta: {
        ...widgetMeta(contentWidget),
        // "openai/suggestedPrompt": "content_assistant"
      }
      
    },
    async ({ query }) => {
      // Combine the system prompt with the user query to generate proper SQL
      const fullPrompt = `${SYSTEM_PROMPT}\n\nUser Query: ${query}`;

      return {
        content: [
          {
            type: "text",
            text: fullPrompt,
          },
        ],
        structuredContent: {
          systemPrompt: SYSTEM_PROMPT,
          userQuery: query,
          fullPrompt: fullPrompt,
          timestamp: new Date().toISOString(),
        },
        _meta: widgetMeta(contentWidget),
      };
    }
  );
});

export const GET = handler;
export const POST = handler;
