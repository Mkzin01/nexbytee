import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { FAQ } from "../content";

export default defineTool({
  name: "search_faq",
  title: "Pesquisar FAQ",
  description: "Pesquisa nas perguntas frequentes públicas da NexByte (prazos, domínio, alojamento, SEO, manutenção).",
  inputSchema: {
    query: z.string().trim().optional().describe("Termo a pesquisar nas perguntas e respostas."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const needle = query?.toLowerCase() ?? "";
    const items = needle
      ? FAQ.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(needle))
      : FAQ;

    return {
      content: [{ type: "text" as const, text: JSON.stringify(items, null, 2) }],
      structuredContent: { faq: items },
    };
  },
});
