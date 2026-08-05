import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { PORTFOLIO } from "../content";

export default defineTool({
  name: "list_portfolio",
  title: "Listar portefólio",
  description: "Lista os casos de estudo do portefólio público da NexByte, com setor, resultados e stack usada.",
  inputSchema: {
    name: z
      .string()
      .trim()
      .optional()
      .describe("Nome (ou parte do nome) de um projeto específico, por exemplo 'Aurora'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ name }) => {
    const needle = name?.toLowerCase() ?? "";
    const items = needle
      ? PORTFOLIO.filter((p) => p.name.toLowerCase().includes(needle))
      : PORTFOLIO;

    if (needle && items.length === 0) {
      return {
        content: [{ type: "text" as const, text: `Nenhum projeto encontrado para "${name}".` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { projects: items },
    };
  },
});
