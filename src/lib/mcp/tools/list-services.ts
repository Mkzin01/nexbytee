import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { SERVICES } from "../content";

export default defineTool({
  name: "list_services",
  title: "Listar serviços",
  description: "Lista os serviços oferecidos pela NexByte, com descrição e tecnologias associadas.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Filtro opcional por texto no título, descrição ou tags do serviço."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const needle = query?.toLowerCase() ?? "";
    const items = needle
      ? SERVICES.filter((s) =>
          [s.title, s.description, ...s.tags].join(" ").toLowerCase().includes(needle),
        )
      : SERVICES;

    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { services: items },
    };
  },
});
