import { defineTool } from "@lovable.dev/mcp-js";

import { CONTACT, PLANS, SERVICES } from "../content";

export default defineTool({
  name: "get_contact_info",
  title: "Obter contacto e resumo",
  description: "Devolve o resumo público da NexByte: o que faz, como contactar (WhatsApp, site) e os planos disponíveis.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const payload = {
      ...CONTACT,
      services: SERVICES.map((s) => s.title),
      plans: PLANS.map((p) => p.name),
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
