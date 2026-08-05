import { defineTool } from "@lovable.dev/mcp-js";

import { PLANS } from "../content";

export default defineTool({
  name: "list_plans",
  title: "Listar planos",
  description: "Lista os planos da NexByte (Landing Page, Website Profissional, Solução Completa) e o que cada um inclui.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text" as const, text: JSON.stringify(PLANS, null, 2) }],
    structuredContent: { plans: PLANS },
  }),
});
