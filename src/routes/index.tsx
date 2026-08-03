import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Check, Globe, Rocket, MapPin, ShoppingBag, Sparkles, Search,
  Palette, TrendingUp, Menu, X, Phone, Mail, Instagram, Facebook, Linkedin,
  Zap, ShieldCheck, Code2, Smartphone, Plus, Minus, Star,
  Navigation as NavigationIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroMockup from "@/assets/hero-nexbyte.jpg.asset.json";
import auroraImg from "@/assets/portfolio/aurora.jpg";
import novaImg from "@/assets/portfolio/nova.jpg";
import velaImg from "@/assets/portfolio/vela.jpg";
import norteImg from "@/assets/portfolio/norte.jpg";
import helixLogo from "@/assets/logos/helix-logo.png";
import verdeLogo from "@/assets/logos/verde-logo.png";
import luminaLogo from "@/assets/logos/lumina-logo.png";
import atlasLogo from "@/assets/logos/atlas-logo.png";



const WHATSAPP_URL = "https://wa.me/351000000000?text=Ol%C3%A1%20NexByte%2C%20quero%20um%20or%C3%A7amento";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexByte — Criação de Websites Profissionais em Portugal" },
      { name: "description", content: "Desenvolvimento de websites, landing pages, identidade visual, SEO e Google Business para empresas em todo Portugal. Design premium e alta conversão." },
      { property: "og:title", content: "NexByte — Criação de Websites em Portugal" },
      { property: "og:description", content: "Websites que fazem empresas crescer. Design premium, mobile first e otimizado para conversão." },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-4");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function CountUp({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{n.toLocaleString("pt-PT")}{suffix}</span>;
}

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary to-[oklch(0.85_0.13_220)] shadow-[0_0_12px_var(--electric-glow)] transition-[width] duration-150"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}

function TechMarquee() {
  const items = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "SEO técnico",
    "Core Web Vitals", "Figma", "Supabase", "Google Analytics", "Cloudflare", "WordPress",
  ];
  return (
    <div className="relative overflow-hidden border-b border-border bg-background py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="marquee-track flex w-max gap-10">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-primary shadow-[0_0_8px_var(--electric)]" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Index() {
  useReveal();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Nav open={navOpen} setOpen={setNavOpen} />

      <Hero />
      <Stats />
      <TechMarquee />
      <Services />
      <Plans />
      <Process />
      <Portfolio />
      <WhyUs />
      <GoogleBusiness />
      <LandingSection />
      <LogoSection />

      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}


/* ---------------- NAV ---------------- */
function Nav({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["Serviços", "#servicos"],
    ["Planos", "#planos"],
    ["Processo", "#processo"],
    ["Projetos", "#projetos"],
    ["Logótipo", "#logotipo"],
    ["FAQ", "#faq"],

  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span className="text-lg">NexByte</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([l, h]) => (
            <a key={h} href={h} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">
          <a
            href={WHATSAPP_URL}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_30px_-5px_var(--electric-glow)]"
          >
            Pedir Orçamento <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <button
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-4">
            <div className="flex flex-col gap-1">
              {links.map(([l, h]) => (
                <a
                  key={h}
                  href={h}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {l}
                </a>
              ))}
              <a
                href={WHATSAPP_URL}
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Pedir Orçamento <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-20">
      <div className="grid-bg-animated pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl float-slow"
        style={{ background: "radial-gradient(closest-side, var(--electric-glow), transparent)" }}
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div data-reveal className="opacity-0 translate-y-4 transition-all duration-700">
            <div className="relative inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="relative grid h-1.5 w-1.5 place-items-center rounded-full bg-primary shadow-[0_0_10px_var(--electric)] pulse-ring" />
              Atendemos empresas em todo Portugal
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Criamos websites que{" "}
              <span className="relative whitespace-nowrap">
                <span className="text-gradient-tech">fazem empresas</span>
              </span>{" "}
              crescer.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Desenvolvemos websites, landing pages, identidade visual e presença digital para empresas em todo Portugal.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_40px_-5px_var(--electric-glow)]"
              >
                Pedir Orçamento
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#projetos"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Ver Projetos
              </a>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span>+1000 clientes atendidos</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Entrega garantida
              </div>
            </div>
          </div>

          <div data-reveal className="opacity-0 translate-y-4 transition-all duration-700 delay-150">
            <div className="relative float-slow">
              <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl" />
              <div className="scan-beam relative overflow-hidden rounded-2xl border border-border bg-card glow-electric">
                <div className="flex items-center gap-1.5 border-b border-border bg-secondary/40 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                  <span className="h-2 w-2 rounded-full bg-primary/70" />
                  <span className="ml-2 font-mono text-[10px] tracking-wider text-muted-foreground">nexbyte.pt</span>
                </div>
                <img
                  src={heroMockup.url}
                  alt="Mockups de websites desenvolvidos pela NexByte"
                  className="w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 backdrop-blur sm:flex">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="font-mono text-[11px] text-muted-foreground">performance: 98/100</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
function Stats() {
  const items = [
    { v: 5, s: "+", l: "anos de experiência" },
    { v: 1000, s: "+", l: "clientes atendidos em Portugal" },
    { v: 100, s: "+", l: "clientes recorrentes" },
    { v: 40, s: "+", l: "projetos para grandes empresas" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/30">
      <div className="grid-bg-animated pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-8 gap-x-4 px-5 py-12 sm:px-8 md:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} data-reveal className="group opacity-0 translate-y-4 transition-all duration-500" style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="text-3xl font-black tracking-tight text-foreground transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_16px_var(--electric-glow)] sm:text-4xl">
              <CountUp to={it.v} suffix={it.s} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{it.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SERVICES ---------------- */
const services = [
  { icon: Globe, title: "Website Institucional", desc: "Presença digital sólida, moderna e alinhada com a sua marca.", tags: ["React", "SEO", "CMS"] },
  { icon: Rocket, title: "Landing Pages", desc: "Páginas focadas em conversão para as suas campanhas.", tags: ["A/B Tests", "Analytics", "Copy"] },
  { icon: MapPin, title: "Google Business", desc: "Perfis otimizados para atrair mais chamadas e clientes locais.", tags: ["Local SEO", "Reviews", "Maps"] },
  { icon: ShoppingBag, title: "Lojas Online", desc: "E-commerce rápido, seguro e pronto para vender.", tags: ["Shopify", "Stripe", "ERP"] },
  { icon: Sparkles, title: "Logótipos", desc: "Identidade única, memorável e profissional.", tags: ["Vector", "Brand", "Manual"] },
  { icon: Search, title: "SEO", desc: "Aparecer no Google para as pesquisas certas.", tags: ["On-page", "Core Web", "Content"] },
  { icon: Palette, title: "Identidade Visual", desc: "Branding coerente em todos os pontos de contacto.", tags: ["Colors", "Type", "Mockups"] },
  { icon: TrendingUp, title: "Otimização de Conversão", desc: "Mais leads e vendas a partir do mesmo tráfego.", tags: ["Heatmaps", "Funnels", "KPIs"] },
];

function ServiceCard({ s, i, className }: { s: typeof services[0]; i: number; className?: string }) {
  return (
    <div
      data-reveal
      className={cn(
        "card-tech group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-card to-card/60 p-6 opacity-0 translate-y-4 transition-all duration-500 hover:border-primary/45 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_-26px_var(--electric-glow)]",
        className,
      )}
      style={{ transitionDelay: `${(i % 4) * 60}ms` }}
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
      {/* index badge */}
      <span className="pointer-events-none absolute right-4 top-4 font-mono text-[11px] tracking-widest text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary/70">
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_32px_-4px_var(--electric-glow)]">
        <s.icon className="h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-110" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {s.tags.map((t) => (
          <span
            key={t}
            className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:border-primary/30 group-hover:text-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <span className="mt-5 block h-px w-full bg-gradient-to-r from-primary/60 via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="mt-auto pt-4">
        <a
          href={WHATSAPP_URL}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-all duration-500 group-hover:opacity-100"
        >
          Saber mais <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}


function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const updateActive = () => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.scrollLeft / (el.scrollWidth / services.length);
    setActive(Math.min(services.length - 1, Math.max(0, Math.round(slide))));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateActive, { passive: true });
    return () => el.removeEventListener("scroll", updateActive);
  }, []);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / services.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  };

  const next = () => scrollTo((active + 1) % services.length);
  const prev = () => scrollTo((active - 1 + services.length) % services.length);

  return (
    <Section id="servicos" eyebrow="Serviços" title="Tudo o que a sua empresa precisa online.">
      {/* Desktop: grid horizontal */}
      <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </div>

      {/* Mobile: carrossel horizontal com snap */}
      <div className="sm:hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-8"
        >
          {services.map((s, i) => (
            <div
              key={s.title}
              className="w-[78vw] shrink-0 snap-center"
            >
              <ServiceCard s={s} i={i} className="h-full" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs tracking-widest text-muted-foreground">
            <span className="text-primary">{String(active + 1).padStart(2, "0")}</span>
            {" / "}
            {String(services.length).padStart(2, "0")}
          </span>

          <div className="mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.85_0.13_220)] shadow-[0_0_10px_var(--electric-glow)] transition-all duration-300"
              style={{ width: `${((active + 1) / services.length) * 100}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:border-primary hover:text-primary active:scale-95"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Próximo"
              className="grid h-10 w-10 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </Section>
  );
}

/* ---------------- PLANS ---------------- */
function Plans() {
  const plans = [
    {
      name: "Landing Page",
      desc: "Ideal para pequenas empresas.",
      features: ["1 página otimizada", "Design personalizado", "Formulário de contacto", "SEO básico", "100% Mobile"],
    },
    {
      name: "Website Profissional",
      desc: "Ideal para empresas em crescimento.",
      features: ["Até 6 páginas", "Design premium exclusivo", "Blog opcional", "SEO on-page", "Integração WhatsApp", "Google Analytics"],
      featured: true,
    },
    {
      name: "Solução Completa",
      desc: "Website + Google Business + Branding + SEO.",
      features: ["Website Profissional", "Identidade visual completa", "Google Business otimizado", "SEO avançado", "Suporte prioritário"],
    },
  ];
  return (
    <Section id="planos" eyebrow="Planos" title="Uma solução para cada fase do seu negócio.">
      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={p.name}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className={`relative opacity-0 translate-y-4 rounded-2xl border p-6 transition-all duration-500 ${
              p.featured
                ? "border-primary/50 bg-gradient-to-b from-primary/10 to-card glow-electric md:-mt-4 md:mb-4"
                : "border-border bg-card hover:border-border/80"
            }`}
          >
            {p.featured && (
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                Mais escolhido
              </div>
            )}
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${p.featured ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_URL}
              className={`mt-8 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                p.featured
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-border bg-secondary text-foreground hover:bg-accent"
              }`}
            >
              Pedir Orçamento <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PROCESS ---------------- */
function Process() {
  const steps = [
    ["Briefing", "Compreender o seu negócio e objetivos."],
    ["Design", "Prototipagem visual moderna e alinhada com a marca."],
    ["Desenvolvimento", "Código limpo, rápido e responsivo."],
    ["Revisões", "Ajustes finos até ficar perfeito."],
    ["Publicação", "Lançamento e configuração no seu domínio."],
    ["Suporte", "Acompanhamento contínuo pós-lançamento."],
  ];
  return (
    <Section id="processo" eyebrow="Processo" title="Simples, transparente, previsível.">
      <ol className="relative grid gap-6 md:grid-cols-3">
        {steps.map(([t, d], i) => (
          <li
            key={t}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="card-tech group opacity-0 translate-y-4 transition-all duration-500 rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                0{i + 1}
              </span>
              <h3 className="font-semibold">{t}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{d}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------- PORTFOLIO ---------------- */
type Project = {
  name: string;
  tag: string;
  sector: string;
  location: string;
  year: string;
  hue: number;
  description: string;
  results: { value: string; label: string }[];
  stack: string[];
  services: string[];
  mockup: "site" | "landing" | "shop" | "seo";
  image: string;
};

function Portfolio() {
  const projects: Project[] = [
    {
      name: "Aurora Studio",
      tag: "Website Institucional",
      sector: "Arquitetura & Design de Interiores",
      location: "Porto",
      year: "2025",
      hue: 240,
      image: auroraImg,
      description:
        "Presença digital minimalista para um estúdio de arquitetura premiado, focada em visual impactante e UX fluida.",
      results: [
        { value: "+218%", label: "pedidos de orçamento" },
        { value: "1.4s", label: "tempo de carregamento" },
        { value: "98", label: "score Lighthouse" },
      ],
      stack: ["Next.js", "Sanity CMS", "Framer Motion"],
      services: ["UI/UX", "Desenvolvimento", "SEO técnico"],
      mockup: "site",
    },
    {
      name: "Nova Café",
      tag: "Landing Page de Conversão",
      sector: "Restauração & Cafetaria",
      location: "Lisboa",
      year: "2025",
      hue: 20,
      image: novaImg,
      description:
        "Landing page vibrante para uma marca de café artesanal, otimizada para subscrições e pedidos rápidos.",
      results: [
        { value: "+312%", label: "subscrições no 1º mês" },
        { value: "6.8%", label: "taxa de conversão" },
        { value: "42s", label: "tempo médio na página" },
      ],
      stack: ["Astro", "Tailwind", "Mailchimp"],
      services: ["Copywriting", "Landing Page", "Integração CRM"],
      mockup: "landing",
    },
    {
      name: "Vela Boutique",
      tag: "Loja Online Premium",
      sector: "Moda & Retalho",
      location: "Cascais",
      year: "2024",
      hue: 310,
      image: velaImg,
      description:
        "Loja online sofisticada com navegação intuitiva, focada na experiência de luxo e conversão de vendas mobile.",
      results: [
        { value: "+165%", label: "vendas online" },
        { value: "-41%", label: "abandono de carrinho" },
        { value: "4.9★", label: "avaliação de clientes" },
      ],
      stack: ["Shopify", "Hydrogen", "Klaviyo"],
      services: ["E-commerce", "Integração ERP", "Email marketing"],
      mockup: "shop",
    },
    {
      name: "Norte Advogados",
      tag: "Website + SEO Local",
      sector: "Sociedade de Advogados",
      location: "Braga",
      year: "2025",
      hue: 200,
      image: norteImg,
      description:
        "Portal jurídico de alta autoridade, focado em clareza informativa e geração de leads qualificados via SEO local.",
      results: [
        { value: "#1", label: "Google 'advogado Braga'" },
        { value: "+520%", label: "tráfego orgânico" },
        { value: "34", label: "leads / mês" },
      ],
      stack: ["Astro", "Contentful", "Google Business"],
      services: ["SEO On-page", "Conteúdo", "Google Business"],
      mockup: "seo",
    },
  ];

  return (
    <Section id="projetos" eyebrow="Portefólio" title="Projetos recentes.">
      <p className="-mt-6 mb-10 max-w-2xl text-muted-foreground">
        Projetos reais, resultados extraordinários. Conheça algumas das soluções digitais que
        desenvolvemos para transformar o negócio dos nossos clientes.
      </p>
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <article
            key={p.name}
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
            className="group flex flex-col opacity-0 translate-y-4 transition-all duration-500 overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_18px_50px_-24px_var(--electric-glow)] card-tech"
          >
            <div
              className="relative aspect-video overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 20%, oklch(0.55 0.2 ${p.hue}) 0%, oklch(0.18 0.02 260) 70%)`,
              }}
            >
              <div className="grid-bg absolute inset-0 opacity-30" />
              <div className="absolute inset-0 overflow-hidden flex flex-col">
                <ProjectMockup type={p.mockup} image={p.image} name={p.name} />
              </div>
              <div className="absolute left-4 top-4 flex gap-2 sm:left-6 sm:top-6 z-30">
                <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white/90 backdrop-blur">
                  {p.year}
                </span>
                <span className="rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-medium text-primary-foreground">
                  {p.tag}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.location} · {p.sector}
                </div>
                <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background/40 p-3">
                {p.results.map((r) => (
                  <div key={r.label} className="text-center">
                    <div className="text-base font-bold text-primary sm:text-lg">{r.value}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">{r.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.services.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <div className="text-[11px] text-muted-foreground">
                  Stack: <span className="text-foreground/80">{p.stack.join(" · ")}</span>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ProjectMockup({ type, image, name }: { type: Project["mockup"]; image: string; name: string }) {
  return (
    <div className="relative h-full w-full group/mockup">
      <img
        src={image}
        alt={`Preview do projeto ${name}`}
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover/mockup:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />
    </div>
  );
}


/* ---------------- WHY US ---------------- */
function WhyUs() {
  const items = [
    { icon: Palette, t: "Design exclusivo", d: "Sem templates genéricos." },
    { icon: Smartphone, t: "Mobile First", d: "Perfeito em qualquer dispositivo." },
    { icon: Search, t: "SEO", d: "Preparado para aparecer no Google." },
    { icon: MapPin, t: "Google Business", d: "Presença local otimizada." },
    { icon: Zap, t: "Carregamento rápido", d: "Performance acima de 95." },
    { icon: ShieldCheck, t: "Suporte real", d: "Estamos aqui depois do lançamento." },
    { icon: Rocket, t: "Entrega rápida", d: "Do briefing ao live em dias." },
    { icon: Code2, t: "Código moderno", d: "Manutenção fácil e escalável." },
  ];
  return (
    <Section eyebrow="Porquê NexByte" title="Motivos para trabalhar connosco.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.t}
            data-reveal
            style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            className="card-tech group opacity-0 translate-y-4 transition-all duration-500 rounded-xl border border-border bg-card p-5 transition-transform hover:-translate-y-1"
          >
            <it.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-semibold">{it.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{it.d}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- GOOGLE BUSINESS ---------------- */
function GoogleBusiness() {
  const perks = [
    { icon: Search, t: "Mais visibilidade local", d: "Topo do mapa nas pesquisas da sua zona." },
    { icon: Phone, t: "Mais chamadas", d: "Botão de contacto direto no perfil." },
    { icon: NavigationIcon, t: "Mais rotas até si", d: "Clientes a um toque da sua porta." },
    { icon: Star, t: "Mais avaliações", d: "Reputação que gera confiança imediata." },
  ];

  const ranking = [
    { pos: 3, name: "Concorrente A", rating: "4,2", active: false },
    { pos: 2, name: "Concorrente B", rating: "4,5", active: false },
    { pos: 1, name: "A sua Empresa", rating: "4,9", active: true },
  ];

  return (
    <Section eyebrow="Google Business" title="Apareça no topo do mapa. Literalmente.">
      <div className="card-tech relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="scan-beam pointer-events-none absolute inset-0 z-0" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative z-10 grid gap-10 md:grid-cols-2 md:items-center">
          {/* ---- Left: copy + perks + ranking ---- */}
          <div>
            <p className="text-muted-foreground">
              Desenvolvemos e otimizamos o seu perfil do Google Business para que a sua empresa apareça primeiro
              quando um cliente pesquisa pelos seus serviços na sua zona.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <li
                  key={p.t}
                  className="group flex gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{p.t}</span>
                    <span className="block text-xs text-muted-foreground">{p.d}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { v: 3, s: "x", l: "mais chamadas" },
                { v: 128, s: "", l: "avaliações" },
                { v: 92, s: "%", l: "cliques locais" },
              ].map((m) => (
                <div key={m.l} className="rounded-xl border border-border/60 bg-background/40 p-3 text-center">
                  <div className="text-xl font-bold text-gradient-tech sm:text-2xl">
                    <CountUp to={m.v} suffix={m.s} />
                  </div>
                  <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Right: live profile mock ---- */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background p-4 glow-electric">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="pulse-ring relative grid h-10 w-10 place-items-center rounded-lg bg-primary/20 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">A sua Empresa • Portugal</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">4,9</span>
                    <span className="flex gap-0.5 text-primary">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                    <span>· 128 avaliações</span>
                  </div>
                </div>
                <span className="ml-auto hidden shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary sm:flex">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Aberto agora
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  { l: "Ligar", i: Phone },
                  { l: "Rota", i: NavigationIcon },
                  { l: "Website", i: Globe },
                ].map((a) => (
                  <div
                    key={a.l}
                    className="flex cursor-default items-center justify-center gap-1.5 rounded-lg bg-secondary py-2 text-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    <a.i className="h-3.5 w-3.5" />
                    {a.l}
                  </div>
                ))}
              </div>

              {/* animated radar map */}
              <div className="relative mt-3 h-36 overflow-hidden rounded-lg border border-border grid-bg-animated">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="pulse-ring relative grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                {[
                  "left-[18%] top-[26%]",
                  "left-[74%] top-[34%]",
                  "left-[30%] top-[70%]",
                  "left-[66%] top-[74%]",
                ].map((pos, i) => (
                  <span
                    key={pos}
                    className={cn("absolute h-2 w-2 animate-pulse rounded-full bg-primary/40", pos)}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </div>
            </div>

            {/* ranking list */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Search className="h-3.5 w-3.5 text-primary" />
                “o seu serviço perto de mim”
              </div>
              <ul className="space-y-2">
                {ranking.map((r) => (
                  <li
                    key={r.name}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all duration-500",
                      r.active
                        ? "border-primary/50 bg-primary/10 font-semibold text-foreground"
                        : "border-border/50 bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold",
                        r.active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {r.pos}
                    </span>
                    <span className="truncate">{r.name}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-1 text-xs">
                      <Star className={cn("h-3 w-3", r.active ? "fill-primary text-primary" : "text-muted-foreground")} />
                      {r.rating}
                    </span>
                    {r.active && <TrendingUp className="h-4 w-4 shrink-0 text-primary" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}


/* ---------------- LANDING SECTION ---------------- */
function LandingSection() {
  return (
    <Section eyebrow="Landing Pages" title="Feitas para converter, não só para apresentar.">
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { t: "Ideais para anúncios", d: "Google Ads e Meta Ads chegam a uma página focada num único objetivo." },
          { t: "Alta taxa de conversão", d: "Estrutura, copy e provas sociais desenhadas para gerar leads." },
          { t: "Testes A/B", d: "Iteramos rapidamente para melhorar resultados ao longo do tempo." },
        ].map((c, i) => (
          <div
            key={c.t}
            data-reveal
            style={{ transitionDelay: `${i * 60}ms` }}
            className="card-tech group opacity-0 translate-y-4 transition-all duration-500 rounded-xl border border-border bg-card p-6 transition-transform hover:-translate-y-1"
          >
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">{c.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- LOGO SECTION ---------------- */
function LogoSection() {
  const marks = [
    { label: "Helix Labs", tag: "Tecnologia", logo: helixLogo },
    { label: "Verde Bistrô", tag: "Restauração", logo: verdeLogo },
    { label: "Lumina Joias", tag: "Joalharia", logo: luminaLogo },
    { label: "Atlas Capital", tag: "Finanças", logo: atlasLogo },
  ];

  const deliverables = [
    "Logótipo principal",
    "Versões horizontal e vertical",
    "Símbolo / favicon",
    "Versão monocromática",
    "Paleta de cores",
    "Tipografia",
    "Ficheiros SVG, PNG e PDF",
    "Manual de utilização",
  ];

  return (
    <Section id="logotipo" eyebrow="Logótipo" title="Uma marca que se reconhece à primeira.">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div data-reveal className="opacity-0 translate-y-4 transition-all duration-700">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Criamos identidades visuais desenhadas do zero — sem templates, sem ícones genéricos.
            Cada logótipo nasce de um estudo do negócio, do público e da concorrência, e é entregue
            pronto para viver no site, nas redes, na fachada e na papelada.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: Palette, t: "Conceito exclusivo", d: "3 propostas distintas para escolher." },
              { icon: Code2, t: "Vetorial e escalável", d: "Nítido do favicon ao outdoor." },
              { icon: Smartphone, t: "Testado em contexto", d: "Aplicado em mockups reais." },
              { icon: ShieldCheck, t: "Revisões incluídas", d: "Até ficar exatamente certo." },
            ].map((b, i) => (
              <div
                key={b.t}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="card-tech group opacity-0 translate-y-4 rounded-xl border border-border bg-card p-4 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
              >
                <b.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="mt-2.5 text-sm font-semibold">{b.t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{b.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {deliverables.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Check className="h-3 w-3 text-primary" />
                {d}
              </span>
            ))}
          </div>

          <a
            href={WHATSAPP_URL}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_30px_-5px_var(--electric-glow)]"
          >
            Quero o meu logótipo <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div
          data-reveal
          className="scan-beam card-tech relative opacity-0 translate-y-4 rounded-2xl border border-border bg-card p-5 transition-all duration-700 sm:p-6"
        >
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
          <div className="relative flex items-center justify-between">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Marcas criadas</div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              vetorial
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-3">
            {marks.map((m, i) => (
              <div
                key={m.label}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className="group relative overflow-hidden rounded-xl border border-border bg-secondary/30 p-3 opacity-0 translate-y-4 transition-all duration-500 hover:border-primary/50 hover:bg-secondary/60 sm:p-4"
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex h-full flex-col items-center gap-2">
                  <div className="relative flex aspect-square w-full min-h-0 flex-1 items-center justify-center rounded-xl border border-border bg-background p-2 transition-all duration-500 group-hover:border-primary/60 group-hover:shadow-[0_0_36px_-6px_var(--electric-glow)]">
                    <img
                      src={m.logo}
                      alt={`Logótipo ${m.label}`}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="h-full w-full scale-105 object-contain opacity-95 invert brightness-125 contrast-125 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                    />
                  </div>

                  <div className="w-full shrink-0 pb-0.5 text-center">
                    <div className="truncate text-xs font-semibold leading-tight">{m.label}</div>
                    <div className="truncate text-[10px] uppercase leading-tight tracking-wider text-muted-foreground">{m.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-4 flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
            <div className="text-xs text-muted-foreground">Entrega média</div>
            <div className="text-sm font-semibold">
              <CountUp to={5} suffix=" dias" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

function FAQ() {
  const faqs = [
    ["Quanto tempo demora um website?", "Entre 7 e 21 dias úteis dependendo da complexidade e do plano escolhido."],
    ["O domínio está incluído?", "Sim, incluímos o registo do domínio no primeiro ano em todos os planos."],
    ["O alojamento está incluído?", "Sim, alojamento rápido e seguro incluído durante o primeiro ano."],
    ["Posso alterar o site depois?", "Claro. Entregamos formação e oferecemos planos de manutenção mensais."],
    ["O site aparece no Google?", "Todos os sites são otimizados para SEO desde o primeiro dia."],
    ["Fazem manutenção?", "Sim, temos planos de suporte técnico e atualizações contínuas."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow="FAQ" title="Perguntas frequentes.">
      <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <button
              key={q}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full px-5 py-4 text-left"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium sm:text-base">{q}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground">
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </div>
              <div
                className={`grid overflow-hidden text-sm text-muted-foreground transition-all duration-300 ${
                  isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">{a}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, var(--electric-glow), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 data-reveal className="opacity-0 translate-y-4 transition-all duration-700 text-3xl font-black tracking-tight sm:text-5xl">
          O próximo cliente da sua empresa pode estar a uma pesquisa de distância.
        </h2>
        <p data-reveal className="opacity-0 translate-y-4 transition-all duration-700 delay-100 mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Vamos criar uma presença digital que transmite confiança, gera autoridade e converte visitantes em clientes.
        </p>
        <div data-reveal className="opacity-0 translate-y-4 transition-all duration-700 delay-200 mt-8 flex justify-center">
          <a
            href={WHATSAPP_URL}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_50px_-5px_var(--electric-glow)] sm:text-base"
          >
            <Phone className="h-4 w-4" />
            Pedir Orçamento no WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-4 w-4" />
              </span>
              NexByte
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Agência web em Portugal. Websites, landing pages e presença digital para empresas que querem crescer.
            </p>
          </div>
          <FooterCol title="Empresa" items={["Sobre", "Projetos", "Blog", "Contacto"]} />
          <FooterCol title="Serviços" items={["Websites", "Landing Pages", "Google Business", "SEO", "Branding"]} />
          <div>
            <div className="text-sm font-semibold">Contacto</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> WhatsApp</li>
              <li className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> ola@nexbyte.pt</li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Linkedin].map((Ic, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary" aria-label="social">
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} NexByte. Todos os direitos reservados.</div>
          <div>Feito com precisão em Portugal.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}><a href="#" className="hover:text-foreground">{i}</a></li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- SECTION WRAPPER ---------------- */
function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  // Destaca a última palavra do título com o gradiente tech.
  const words = title.trim().split(" ");
  const head = words.slice(0, -1).join(" ");
  const tail = words[words.length - 1];

  return (
    <section id={id} className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-3xl sm:mb-14">
          <div
            data-reveal
            className="group relative inline-flex translate-y-3 items-center gap-2 overflow-hidden rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary opacity-0 shadow-[0_0_24px_-10px_var(--electric-glow)] transition-all duration-500"
          >
            {/* shimmer */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative grid h-1.5 w-1.5 place-items-center rounded-full bg-primary shadow-[0_0_10px_var(--electric)] pulse-ring" />
            {eyebrow}
          </div>

          <h2
            data-reveal
            style={{ transitionDelay: "80ms" }}
            className="mt-5 translate-y-4 text-[2.1rem] font-black leading-[1.03] tracking-tight opacity-0 transition-all duration-700 sm:text-[3rem] lg:text-[3.8rem]"
          >
            {head && <span>{head} </span>}
            <span className="text-gradient-tech">{tail}</span>
          </h2>

          <div
            data-reveal
            style={{ transitionDelay: "160ms" }}
            className="mt-6 flex translate-y-3 items-center gap-3 opacity-0 transition-all duration-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--electric)]" />
            <span className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
            <span className="h-px w-28 bg-border" />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

