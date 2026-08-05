/**
 * Conteúdo público do site NexByte partilhado pelas ferramentas MCP.
 * Espelha o que já está visível na landing page — nada privado aqui.
 */

export const CONTACT = {
  company: "NexByte",
  tagline: "Criação de websites profissionais, landing pages e presença digital em Portugal.",
  whatsapp: "https://wa.me/351000000000",
  website: "https://proximo-prompt-spark.lovable.app",
} as const;

export type Service = {
  title: string;
  description: string;
  tags: readonly string[];
};

export const SERVICES: readonly Service[] = [
  { title: "Website Institucional", description: "Presença digital sólida, moderna e alinhada com a sua marca.", tags: ["React", "SEO", "CMS"] },
  { title: "Landing Pages", description: "Páginas focadas em conversão para as suas campanhas.", tags: ["A/B Tests", "Analytics", "Copy"] },
  { title: "Google Business", description: "Perfis otimizados para atrair mais chamadas e clientes locais.", tags: ["Local SEO", "Reviews", "Maps"] },
  { title: "Lojas Online", description: "E-commerce rápido, seguro e pronto para vender.", tags: ["Shopify", "Stripe", "ERP"] },
  { title: "Logótipos", description: "Identidade única, memorável e profissional.", tags: ["Vector", "Brand", "Manual"] },
  { title: "SEO", description: "Aparecer no Google para as pesquisas certas.", tags: ["On-page", "Core Web", "Content"] },
  { title: "Identidade Visual", description: "Branding coerente em todos os pontos de contacto.", tags: ["Colors", "Type", "Mockups"] },
  { title: "Otimização de Conversão", description: "Mais leads e vendas a partir do mesmo tráfego.", tags: ["Heatmaps", "Funnels", "KPIs"] },
];

export type Plan = {
  name: string;
  description: string;
  features: readonly string[];
  featured: boolean;
};

export const PLANS: readonly Plan[] = [
  {
    name: "Landing Page",
    description: "Ideal para pequenas empresas.",
    features: ["1 página otimizada", "Design personalizado", "Formulário de contacto", "SEO básico", "100% Mobile"],
    featured: false,
  },
  {
    name: "Website Profissional",
    description: "Ideal para empresas em crescimento.",
    features: ["Até 6 páginas", "Design premium exclusivo", "Blog opcional", "SEO on-page", "Integração WhatsApp", "Google Analytics"],
    featured: true,
  },
  {
    name: "Solução Completa",
    description: "Website + Google Business + Branding + SEO.",
    features: ["Website Profissional", "Identidade visual completa", "Google Business otimizado", "SEO avançado", "Suporte prioritário"],
    featured: false,
  },
];

export type CaseStudy = {
  name: string;
  tag: string;
  sector: string;
  location: string;
  year: string;
  description: string;
  results: readonly { value: string; label: string }[];
  stack: readonly string[];
  services: readonly string[];
};

export const PORTFOLIO: readonly CaseStudy[] = [
  {
    name: "Aurora Studio",
    tag: "Website Institucional",
    sector: "Arquitetura & Design de Interiores",
    location: "Porto",
    year: "2025",
    description:
      "Presença digital minimalista para um estúdio de arquitetura premiado, focada em visual impactante e UX fluida.",
    results: [
      { value: "+218%", label: "pedidos de orçamento" },
      { value: "1.4s", label: "tempo de carregamento" },
      { value: "98", label: "score Lighthouse" },
    ],
    stack: ["Next.js", "Sanity CMS", "Framer Motion"],
    services: ["UI/UX", "Desenvolvimento", "SEO técnico"],
  },
  {
    name: "Nova Café",
    tag: "Landing Page de Conversão",
    sector: "Restauração & Cafetaria",
    location: "Lisboa",
    year: "2025",
    description:
      "Landing page vibrante para uma marca de café artesanal, otimizada para subscrições e pedidos rápidos.",
    results: [
      { value: "+312%", label: "subscrições no 1º mês" },
      { value: "6.8%", label: "taxa de conversão" },
      { value: "42s", label: "tempo médio na página" },
    ],
    stack: ["Astro", "Tailwind", "Mailchimp"],
    services: ["Copywriting", "Landing Page", "Integração CRM"],
  },
  {
    name: "Vela Boutique",
    tag: "Loja Online Premium",
    sector: "Moda & Retalho",
    location: "Cascais",
    year: "2024",
    description:
      "Loja online sofisticada com navegação intuitiva, focada na experiência de luxo e conversão de vendas mobile.",
    results: [
      { value: "+165%", label: "vendas online" },
      { value: "-41%", label: "abandono de carrinho" },
      { value: "4.9★", label: "avaliação de clientes" },
    ],
    stack: ["Shopify", "Hydrogen", "Klaviyo"],
    services: ["E-commerce", "Integração ERP", "Email marketing"],
  },
  {
    name: "Norte Advogados",
    tag: "Website + SEO Local",
    sector: "Sociedade de Advogados",
    location: "Braga",
    year: "2025",
    description:
      "Portal jurídico de alta autoridade, focado em clareza informativa e geração de leads qualificados via SEO local.",
    results: [
      { value: "#1", label: "Google 'advogado Braga'" },
      { value: "+520%", label: "tráfego orgânico" },
      { value: "34", label: "leads / mês" },
    ],
    stack: ["Astro", "Contentful", "Google Business"],
    services: ["SEO On-page", "Conteúdo", "Google Business"],
  },
];

export const FAQ: readonly { question: string; answer: string }[] = [
  { question: "Quanto tempo demora um website?", answer: "Entre 7 e 21 dias úteis dependendo da complexidade e do plano escolhido." },
  { question: "O domínio está incluído?", answer: "Sim, incluímos o registo do domínio no primeiro ano em todos os planos." },
  { question: "O alojamento está incluído?", answer: "Sim, alojamento rápido e seguro incluído durante o primeiro ano." },
  { question: "Posso alterar o site depois?", answer: "Claro. Entregamos formação e oferecemos planos de manutenção mensais." },
  { question: "O site aparece no Google?", answer: "Todos os sites são otimizados para SEO desde o primeiro dia." },
  { question: "Fazem manutenção?", answer: "Sim, temos planos de suporte técnico e atualizações contínuas." },
];
