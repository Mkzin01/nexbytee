import { defineMcp } from "@lovable.dev/mcp-js";

import getContactInfoTool from "./tools/get-contact-info";
import listPlansTool from "./tools/list-plans";
import listPortfolioTool from "./tools/list-portfolio";
import listServicesTool from "./tools/list-services";
import searchFaqTool from "./tools/search-faq";

export default defineMcp({
  name: "next-prompt-guide",
  title: "Next Prompt Guide",
  version: "0.1.0",
  instructions:
    "Ferramentas com o conteúdo público do site da NexByte (agência de websites em Portugal). Use `list_services` para os serviços, `list_plans` para os planos, `list_portfolio` para casos de estudo, `search_faq` para perguntas frequentes e `get_contact_info` para contacto e resumo da empresa.",
  tools: [listServicesTool, listPlansTool, listPortfolioTool, searchFaqTool, getContactInfoTool],
});
