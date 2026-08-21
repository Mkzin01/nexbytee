import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe,
  Rocket,
  MapPin,
  ShoppingBag,
  Sparkles,
  Search,
  Palette,
  TrendingUp,
  Menu,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Zap,
  ShieldCheck,
  Code2,
  Smartphone,
  Plus,
  Minus,
  Star,
  Terminal,
  Navigation as NavigationIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import heroMockup from "@/assets/hero-nexbyte.jpg";
import auroraImg from "@/assets/portfolio/aurora.jpg";
import novaImg from "@/assets/portfolio/nova.jpg";
import velaImg from "@/assets/portfolio/vela.jpg";
import norteImg from "@/assets/portfolio/norte.jpg";
import helixLogo from "@/assets/logos/helix-logo.png";
import verdeLogo from "@/assets/logos/verde-logo.png";
import luminaLogo from "@/assets/logos/lumina-logo.png";
import atlasLogo from "@/assets/logos/atlas-logo.png";
import whatsappIcon from "@/assets/whatsapp.svg";

const WHATSAPP_NUMBER = "351932111175";
const getWhatsAppUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexByte — Criação de Websites Profissionais em Portugal" },
      {
        name: "description",
        content:
          "Desenvolvimento de websites, landing pages, identidade visual, SEO e Google Business para empresas em todo Portugal. Design premium e alta conversão.",
      },
      { property: "og:title", content: "NexByte — Criação de Websites em Portugal" },
      {
        property: "og:description",
        content:
          "Websites que fazem empresas crescer. Design premium, mobile first e otimizado para conversão.",
      },
    ],
  }),
  component: Index,
});

/* ============================================================
   PRIMITIVAS
   ============================================================ */

/**
 * Registo partilhado de "entrou em cena".
 *
 * Um IntersectionObserver perde elementos quando o scroll é muito rápido — e
 * um elemento perdido fica invisível para sempre. Esta varredura em rAF olha
 * para a posição real: tudo o que já passou a linha de disparo aparece,
 * mesmo que o utilizador atire a página de uma ponta à outra.
 */
type EnterWatcher = { el: HTMLElement; run: () => void };
let watchers: EnterWatcher[] = [];
let sweepRaf = 0;
let sweepBound = false;

function sweepEnter() {
  sweepRaf = 0;
  if (!watchers.length) return;
  const line = window.innerHeight * 0.92;
  const pending: EnterWatcher[] = [];
  for (const w of watchers) {
    if (w.el.getBoundingClientRect().top < line) w.run();
    else pending.push(w);
  }
  watchers = pending;
}

function requestSweep() {
  if (!sweepRaf) sweepRaf = requestAnimationFrame(sweepEnter);
}

function watchEnter(el: HTMLElement, run: () => void) {
  watchers.push({ el, run });
  if (!sweepBound) {
    sweepBound = true;
    window.addEventListener("scroll", requestSweep, { passive: true });
    window.addEventListener("resize", requestSweep);
  }
  requestSweep();
  return () => {
    watchers = watchers.filter((w) => w.el !== el);
  };
}

function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const cleanups = els.map((el) =>
      watchEnter(el, () => {
        el.classList.add("opacity-100", "translate-y-0");
        el.classList.remove("opacity-0", "translate-y-4", "translate-y-3");
      }),
    );
    return () => cleanups.forEach((fn) => fn());
  }, []);
}

/** Ilumina o cartão a partir da posição do ponteiro (utilitário `lift`). */
function onGlow(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--px", `${e.clientX - r.left}px`);
  el.style.setProperty("--py", `${e.clientY - r.top}px`);
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;
    // guardamos quem está na faixa central para poder limpar o destaque
    // quando nenhuma secção lá está (topo da página, por exemplo)
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        });
        const next = ids.find((id) => inBand.has(id)) ?? "";
        setActive(next);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function CountUp({
  to,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let alive = true;
    const stop = watchEnter(el, () => {
      const start = performance.now();
      const step = (t: number) => {
        if (!alive) return;
        const p = Math.min(1, (t - start) / duration);
        // desaceleração no fim: sensação de instrumento a estabilizar
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.floor(eased * to));
        if (p < 1) requestAnimationFrame(step);
        else setN(to);
      };
      requestAnimationFrame(step);
    });
    return () => {
      alive = false;
      stop();
    };
  }, [to, duration]);
  return (
    <span ref={ref} className="num">
      {n.toLocaleString("pt-PT")}
      {suffix}
    </span>
  );
}

/** Máquina de escrever para a linha de comando do hero. */
function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(words[0]);
      return;
    }
    let w = 0;
    let i = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w % words.length];
      i = deleting ? i - 1 : i + 1;
      setText(word.slice(0, i));
      let delay = deleting ? 45 : 85;
      if (!deleting && i === word.length) {
        delay = 1900;
        deleting = true;
      } else if (deleting && i === 0) {
        deleting = false;
        w += 1;
        delay = 350;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [words]);
  return (
    <span className="text-cyan">
      {text}
      <span className="caret ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-cyan" />
    </span>
  );
}

/** Grão + vinheta: tira o aspeto de render sintético e assenta as cores. */
function Atmosphere() {
  return (
    <>
      <div
        className="grain pointer-events-none fixed inset-0 z-[70] opacity-[0.035] mix-blend-overlay"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 z-[69]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, transparent 45%, oklch(0.09 0.01 262 / 55%) 100%)",
        }}
      />
    </>
  );
}

/** Halo subtil que segue o ponteiro (apenas em ecrãs com rato). */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      if (ref.current)
        ref.current.style.background = `radial-gradient(420px circle at ${x}px ${y}px, oklch(0.67 0.185 250 / 7%), transparent 65%)`;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden />
  );
}

/**
 * Traçados de circuito com impulsos a percorrer as pistas.
 * Desenhado em canvas para custar pouco e nunca bloquear o scroll.
 */
function CircuitCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    type Pt = { x: number; y: number };
    type Trace = { pts: Pt[]; segs: number[]; len: number; speed: number; dist: number };

    let w = 0;
    let h = 0;
    let traces: Trace[] = [];
    let raf = 0;
    let last = 0;
    let visible = true;

    const build = () => {
      const grid = 46;
      traces = [];
      const count = Math.max(5, Math.min(13, Math.round(w / 130)));
      for (let i = 0; i < count; i++) {
        const pts: Pt[] = [];
        let x = -grid * 2;
        let y = Math.round((Math.random() * h) / grid) * grid;
        pts.push({ x, y });
        let guard = 0;
        while (x < w + grid * 2 && guard++ < 40) {
          x += grid * (1 + Math.floor(Math.random() * 4));
          pts.push({ x, y });
          if (Math.random() > 0.32) {
            const dir = Math.random() > 0.5 ? 1 : -1;
            const rise = grid * (1 + Math.floor(Math.random() * 2));
            x += rise;
            y = Math.min(h + grid, Math.max(-grid, y + rise * dir));
            pts.push({ x, y });
          }
        }
        const segs: number[] = [];
        let len = 0;
        for (let k = 1; k < pts.length; k++) {
          const d = Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
          segs.push(d);
          len += d;
        }
        traces.push({ pts, segs, len, speed: 55 + Math.random() * 95, dist: Math.random() * len });
      }
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      drawStatic();
    };

    const pathAt = (t: Trace, d: number): { p: Pt; i: number; local: number } => {
      let acc = 0;
      for (let i = 0; i < t.segs.length; i++) {
        if (acc + t.segs[i] >= d) {
          const local = (d - acc) / t.segs[i];
          const a = t.pts[i];
          const b = t.pts[i + 1];
          return { p: { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local }, i, local };
        }
        acc += t.segs[i];
      }
      return { p: t.pts[t.pts.length - 1], i: t.segs.length - 1, local: 1 };
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "oklch(0.67 0.185 250 / 13%)";
      traces.forEach((t) => {
        ctx.beginPath();
        ctx.moveTo(t.pts[0].x, t.pts[0].y);
        t.pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        // nós nas mudanças de direção
        ctx.fillStyle = "oklch(0.67 0.185 250 / 22%)";
        t.pts.forEach((p, i) => {
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      drawStatic();
      ctx.lineCap = "round";
      traces.forEach((t) => {
        t.dist = (t.dist + t.speed * dt) % t.len;
        const tail = Math.max(0, t.dist - 34);
        const a = pathAt(t, tail);
        const b = pathAt(t, t.dist);
        ctx.beginPath();
        ctx.moveTo(a.p.x, a.p.y);
        for (let i = a.i + 1; i <= b.i; i++) ctx.lineTo(t.pts[i].x, t.pts[i].y);
        ctx.lineTo(b.p.x, b.p.y);
        ctx.strokeStyle = "oklch(0.83 0.135 199 / 85%)";
        ctx.lineWidth = 1.6;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "oklch(0.67 0.185 250 / 90%)";
        ctx.stroke();
        ctx.shadowBlur = 0;
        // cabeça do impulso
        ctx.beginPath();
        ctx.arc(b.p.x, b.p.y, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = "oklch(0.95 0.06 199)";
        ctx.fill();
      });
    };

    resize();
    window.addEventListener("resize", resize);
    const io = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
    });
    io.observe(canvas);

    if (!reduced) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    return () => {
      window.removeEventListener("resize", resize);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
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
    <>
      <div className="fixed inset-x-0 top-0 z-[65] h-px bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary via-cyan to-primary shadow-[0_0_12px_var(--electric-glow)] transition-[width] duration-150"
          style={{ width: `${p}%` }}
        />
      </div>
      {/* régua lateral: leitura de instrumento, não decoração */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-[55] hidden -translate-y-1/2 flex-col items-center gap-3 xl:flex">
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70 num">
          {String(Math.round(p)).padStart(3, "0")}
        </span>
        <div className="relative h-40 w-px bg-border">
          <div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary to-cyan"
            style={{ height: `${p}%` }}
          />
          <div
            className="absolute -left-[3px] h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--electric)]"
            style={{ top: `calc(${p}% - 3px)` }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40">%</span>
      </div>
    </>
  );
}

function TechMarquee() {
  const items = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "SEO técnico",
    "Core Web Vitals",
    "Figma",
    "Supabase",
    "Google Analytics",
    "Cloudflare",
    "WordPress",
  ];
  return (
    <div className="relative overflow-hidden border-y border-border bg-[oklch(0.155_0.014_262)] py-3.5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-slow flex w-max items-center gap-8">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80"
          >
            <span className="h-px w-4 bg-primary/50" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href={getWhatsAppUrl("Olá NexByte, gostaria de falar sobre um projeto.")}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-[60] flex items-center gap-0 overflow-hidden rounded-xl border border-primary/40 bg-[oklch(0.17_0.015_263)]/90 pl-3.5 pr-3.5 py-3 backdrop-blur-xl transition-all duration-500 hover:border-primary hover:shadow-[0_16px_40px_-14px_var(--electric-glow)] sm:bottom-8 sm:right-8"
      aria-label="Falar no WhatsApp"
    >
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <img
        src={whatsappIcon}
        alt=""
        className="relative h-6 w-6 brightness-0 invert transition-transform duration-500 group-hover:scale-110"
      />
      <span className="relative max-w-0 overflow-hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-all duration-500 group-hover:ml-3 group-hover:max-w-[9rem]">
        Falar agora
      </span>
    </a>
  );
}

/* ============================================================
   PÁGINA
   ============================================================ */

function Index() {
  useReveal();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Atmosphere />
      <Spotlight />
      <ScrollProgress />
      <WhatsAppFloat />
      <Nav open={navOpen} setOpen={setNavOpen} />

      <main className="relative z-10">
        <Hero />
        <Telemetry />
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
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */

const NAV_LINKS: [string, string][] = [
  ["Serviços", "servicos"],
  ["Planos", "planos"],
  ["Processo", "processo"],
  ["Projetos", "projetos"],
  ["Logótipo", "logotipo"],
  ["FAQ", "faq"],
];
const NAV_IDS = NAV_LINKS.map(([, id]) => id);

function Nav({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-xl border px-3 py-2.5 transition-all duration-500 sm:px-4",
          scrolled
            ? "border-border bg-[oklch(0.15_0.014_262)]/85 shadow-[0_18px_50px_-30px_oklch(0_0_0/90%)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" className="group flex shrink-0 items-center gap-2.5">
          <span className="logo-3d grid h-9 w-9 place-items-center rounded-lg text-primary">
            <Zap className="relative h-4 w-4 transition-transform duration-500 group-hover:scale-110" />
          </span>
          <span className="font-display text-[17px] font-bold tracking-tight transition-colors group-hover:text-cyan">
            NexByte
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(([label, id], i) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "group relative rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
                active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="mr-1.5 text-primary/50 transition-colors group-hover:text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              {label}
              <span
                className={cn(
                  "absolute inset-x-2.5 -bottom-px h-px bg-gradient-to-r from-primary to-cyan transition-transform duration-300",
                  active === id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 md:block">
          <a
            href={getWhatsAppUrl("Olá NexByte, gostaria de pedir um orçamento através do site.")}
            className="group inline-flex items-center gap-2 rounded-lg border border-primary/45 bg-primary/12 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            Orçamento
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          className="rounded-md border border-border p-2 text-foreground md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-xl border border-border bg-[oklch(0.15_0.014_262)]/95 backdrop-blur-xl md:hidden">
          <div className="divide-y divide-border">
            {NAV_LINKS.map(([label, id], i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
              </a>
            ))}
          </div>
          <div className="p-3">
            <a
              href={getWhatsAppUrl(
                "Olá NexByte, gostaria de pedir um orçamento através do menu mobile.",
              )}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground"
            >
              Pedir Orçamento <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* camadas de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_50%_20%,black_25%,transparent_75%)]">
        <CircuitCanvas />
      </div>
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" />
      <div
        className="float-slow pointer-events-none absolute left-1/2 -top-40 h-[520px] w-[980px] -translate-x-1/2 rounded-full opacity-45 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--electric-glow), transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.06fr_1fr]">
          {/* ---- coluna esquerda ---- */}
          <div data-reveal className="translate-y-4 opacity-0 transition-all duration-700">
            <div className="inline-flex items-center gap-2.5 rounded-md border border-border bg-[oklch(0.17_0.015_263)]/70 px-3 py-1.5 font-mono text-[11px] text-muted-foreground backdrop-blur">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground/60">nexbyte ~</span>
              <span className="text-foreground">deploy</span>
              <Typewriter
                words={["website", "landing-page", "loja-online", "identidade", "seo-local"]}
              />
            </div>

            <h1 className="mt-7 font-display text-[2.55rem] font-bold leading-[0.97] tracking-[-0.035em] sm:text-[3.6rem] lg:text-[4.35rem]">
              <span className="block font-medium text-foreground/55">Criamos websites</span>
              <span className="block">que fazem empresas</span>
              <span className="relative block w-fit">
                <span className="text-gradient-tech">crescer.</span>
                <svg
                  className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/70"
                  viewBox="0 0 200 10"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 7 C 50 2, 120 9, 198 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Desenvolvemos websites, landing pages, identidade visual e presença digital para
              empresas em todo Portugal — com engenharia a sério por trás do design.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppUrl(
                  "Olá NexByte, gostaria de pedir um orçamento para o meu projeto.",
                )}
                className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_18px_45px_-16px_var(--electric-glow)] sm:w-auto"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Pedir Orçamento</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#projetos"
                className="group inline-flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-[oklch(0.19_0.015_263)]/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-primary/50 hover:bg-secondary sm:w-auto"
              >
                Ver Projetos
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </a>
            </div>

            {/* faixa de especificações — substitui as “5 estrelas” genéricas */}
            <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-border border-y border-border">
              {[
                ["Cobertura", "Todo o Portugal"],
                ["Entrega", "7 a 21 dias"],
                ["Lighthouse", "95+ garantido"],
              ].map(([k, v]) => (
                <div key={k} className="px-3 py-3.5 first:pl-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[13px] font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-cyan text-cyan" />
                  ))}
                </span>
                <span className="num">+1000</span> clientes atendidos
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Entrega garantida
              </span>
            </div>
          </div>

          {/* ---- coluna direita: painel de instrumento ---- */}
          <div
            data-reveal
            className="translate-y-4 opacity-0 transition-all delay-150 duration-700"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />

              <div className="hud relative rounded-xl border border-border bg-[oklch(0.16_0.014_262)] p-2 backdrop-blur-xl glow-electric">
                <div className="relative overflow-hidden rounded-lg border border-border bg-card">
                  {/* barra do browser */}
                  <div className="flex items-center gap-2 border-b border-border bg-[oklch(0.19_0.015_263)] px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="h-2 w-2 rounded-full bg-cyan/70" />
                    <div className="ml-2 flex flex-1 items-center gap-1.5 rounded border border-border/70 bg-background/60 px-2 py-0.5">
                      <ShieldCheck className="h-2.5 w-2.5 text-cyan" />
                      <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
                        nexbyte.site
                      </span>
                    </div>
                    <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-primary sm:block">
                      live
                    </span>
                  </div>

                  <div className="relative">
                    <img
                      src={heroMockup}
                      alt="Mockups de websites desenvolvidos pela NexByte"
                      className="aspect-[5/4] w-full bg-[oklch(0.19_0.015_263)] object-cover"
                      width={1200}
                      height={960}
                      loading="eager"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.014_262)] via-transparent to-transparent" />
                  </div>

                  {/* leitura de métricas reais, em mono */}
                  <div className="grid grid-cols-4 divide-x divide-border border-t border-border bg-[oklch(0.175_0.015_263)]">
                    {[
                      ["LCP", "1.1s"],
                      ["CLS", "0.00"],
                      ["SEO", "100"],
                      ["A11Y", "98"],
                    ].map(([k, v]) => (
                      <div key={k} className="px-2 py-2.5 text-center">
                        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
                          {k}
                        </div>
                        <div className="num mt-0.5 font-mono text-xs font-semibold text-cyan">
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* etiqueta flutuante */}
              <div className="pointer-events-none absolute -bottom-5 -left-3 hidden items-center gap-2 rounded-lg border border-primary/30 bg-[oklch(0.17_0.015_263)]/95 px-3 py-2 backdrop-blur sm:flex">
                <span className="relative grid h-1.5 w-1.5 place-items-center rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)] pulse-ring" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  build <span className="text-foreground">passed</span> · 98/100
                </span>
              </div>

              <div className="pointer-events-none absolute -right-3 -top-4 hidden rounded-lg border border-border bg-[oklch(0.17_0.015_263)]/95 px-3 py-2 backdrop-blur lg:block">
                <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
                  uptime
                </div>
                <div className="num font-mono text-sm font-semibold text-foreground">99,9%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TELEMETRIA (antigo STATS) ---------------- */

function Telemetry() {
  const items = [
    { v: 5, s: "+", l: "anos de experiência", k: "EXP" },
    { v: 1000, s: "+", l: "clientes atendidos", k: "CLI" },
    { v: 100, s: "+", l: "clientes recorrentes", k: "REC" },
    { v: 40, s: "+", l: "projetos enterprise", k: "ENT" },
  ];
  return (
    <section className="relative border-y border-border bg-[oklch(0.155_0.014_262)]">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {items.map((it, i) => (
          <div
            key={it.k}
            data-reveal
            style={{ transitionDelay: `${i * 70}ms` }}
            className={cn(
              "group translate-y-4 border-border px-5 py-8 opacity-0 transition-all duration-500 sm:px-8 sm:py-10",
              i < 2 && "border-b md:border-b-0",
              i % 2 === 1 && "border-l",
              i % 2 === 0 && i > 0 && "md:border-l",
            )}
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              <span className="h-px w-3 bg-primary/60 transition-all duration-500 group-hover:w-6" />
              {it.k}
            </div>
            <div className="mt-3 font-display text-[2.2rem] font-bold leading-none tracking-tight transition-colors duration-300 group-hover:text-cyan sm:text-[2.75rem]">
              <CountUp to={it.v} suffix={it.s} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground sm:text-[13px]">{it.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SERVIÇOS ---------------- */

const services = [
  {
    icon: Globe,
    title: "Website Institucional",
    desc: "Presença digital sólida, moderna e alinhada com a sua marca.",
    tags: ["React", "SEO", "CMS"],
  },
  {
    icon: Rocket,
    title: "Landing Pages",
    desc: "Páginas focadas em conversão para as suas campanhas.",
    tags: ["A/B Tests", "Analytics", "Copy"],
  },
  {
    icon: MapPin,
    title: "Google Business",
    desc: "Perfis otimizados para atrair mais chamadas e clientes locais.",
    tags: ["Local SEO", "Reviews", "Maps"],
  },
  {
    icon: ShoppingBag,
    title: "Lojas Online",
    desc: "E-commerce rápido, seguro e pronto para vender.",
    tags: ["Shopify", "Stripe", "ERP"],
  },
  {
    icon: Sparkles,
    title: "Logótipos",
    desc: "Identidade única, memorável e profissional.",
    tags: ["Vector", "Brand", "Manual"],
  },
  {
    icon: Search,
    title: "SEO",
    desc: "Aparecer no Google para as pesquisas certas.",
    tags: ["On-page", "Core Web", "Content"],
  },
  {
    icon: Palette,
    title: "Identidade Visual",
    desc: "Branding coerente em todos os pontos de contacto.",
    tags: ["Colors", "Type", "Mockups"],
  },
  {
    icon: TrendingUp,
    title: "Otimização de Conversão",
    desc: "Mais leads e vendas a partir do mesmo tráfego.",
    tags: ["Heatmaps", "Funnels", "KPIs"],
  },
];

/** Áreas do bento: o primeiro serviço domina a grelha, os restantes encaixam à volta. */
const SERVICE_SPAN = ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", "", "", "", "", ""];

function ServiceCard({
  s,
  i,
  big,
  className,
}: {
  s: (typeof services)[0];
  i: number;
  big?: boolean;
  className?: string;
}) {
  return (
    <div
      data-reveal
      onMouseMove={onGlow}
      style={{ transitionDelay: `${(i % 4) * 55}ms` }}
      className={cn(
        "lift group relative flex translate-y-4 flex-col overflow-hidden rounded-xl border border-border bg-card p-5 opacity-0 transition-all duration-500 sm:p-6",
        big && "justify-between",
        className,
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 opacity-40", big ? "dot-bg" : "")} />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="scene-3d">
            <span
              className={cn(
                "icon-3d group-hover:icon-3d-hover grid place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:text-cyan",
                big ? "h-14 w-14" : "h-11 w-11",
              )}
            >
              <s.icon className={big ? "h-6 w-6" : "h-5 w-5"} />
            </span>
          </div>
          <span className="num font-mono text-[10px] tracking-[0.2em] text-muted-foreground/35 transition-colors group-hover:text-primary/80">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>

        <h3
          className={cn(
            "mt-5 font-display font-semibold tracking-tight",
            big ? "text-2xl sm:text-[1.75rem]" : "text-[17px]",
          )}
        >
          {s.title}
        </h3>
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted-foreground",
            big ? "max-w-md text-sm sm:text-[15px]" : "text-[13px]",
          )}
        >
          {s.desc}
        </p>

        {big && (
          <ul className="mt-7 max-w-sm divide-y divide-border/60 border-y border-border/60">
            {[
              ["Estrutura", "Home, serviços, sobre, contactos"],
              ["Conteúdo", "Copywriting e imagens tratadas"],
              ["Domínio", "Configuração e email profissional"],
              ["Depois", "Formação e manutenção opcional"],
            ].map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-4 py-2.5">
                <span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50">
                  {k}
                </span>
                <span className="text-[13px] text-foreground/80">{v}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative mt-5">
        <div className="flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <span
              key={t}
              className="rounded border border-border/70 bg-secondary/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80 transition-colors group-hover:border-primary/30 group-hover:text-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={getWhatsAppUrl(`Olá NexByte, gostaria de saber mais sobre o serviço: ${s.title}`)}
          className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-cyan"
        >
          Saber mais
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
}

function Services() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      const slide = el.scrollLeft / (el.scrollWidth / services.length);
      setActive(Math.min(services.length - 1, Math.max(0, Math.round(slide))));
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.scrollWidth / services.length) * index, behavior: "smooth" });
  };

  return (
    <Section
      id="servicos"
      index="01"
      kicker="Serviços"
      meta="08 capacidades"
      title={
        <>
          Tudo o que a sua empresa <span className="text-foreground/45">precisa</span> online.
        </>
      }
    >
      {/* Desktop: bento assimétrico */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:auto-rows-[minmax(0,1fr)] lg:grid-cols-4">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} big={i === 0} className={SERVICE_SPAN[i]} />
        ))}
      </div>

      {/* Mobile: carrossel com leitura de posição */}
      <div className="sm:hidden">
        <div
          ref={scrollRef}
          className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-7"
        >
          {services.map((s, i) => (
            <div key={s.title} className="w-[80vw] shrink-0 snap-center">
              <ServiceCard s={s} i={i} className="h-full" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="num font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
            <span className="text-cyan">{String(active + 1).padStart(2, "0")}</span>
            <span className="text-muted-foreground/40">
              {" "}
              / {String(services.length).padStart(2, "0")}
            </span>
          </span>
          <div className="h-px flex-1 bg-border">
            <span
              className="block h-px bg-gradient-to-r from-primary to-cyan transition-all duration-300"
              style={{ width: `${((active + 1) / services.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo((active - 1 + services.length) % services.length)}
              aria-label="Serviço anterior"
              className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-all active:scale-95"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            </button>
            <button
              onClick={() => scrollTo((active + 1) % services.length)}
              aria-label="Serviço seguinte"
              className="grid h-9 w-9 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary transition-all active:scale-95"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- PLANOS ---------------- */

function Plans() {
  const plans = [
    {
      name: "Landing Page",
      code: "LP-01",
      desc: "Ideal para pequenas empresas.",
      features: [
        "1 página otimizada",
        "Design personalizado",
        "Formulário de contacto",
        "SEO básico",
        "100% Mobile",
      ],
    },
    {
      name: "Website Profissional",
      code: "WP-02",
      desc: "Ideal para empresas em crescimento.",
      features: [
        "Até 6 páginas",
        "Design premium exclusivo",
        "Blog opcional",
        "SEO on-page",
        "Integração WhatsApp",
        "Google Analytics",
      ],
      featured: true,
    },
    {
      name: "Solução Completa",
      code: "SC-03",
      desc: "Website + Google Business + Branding + SEO.",
      features: [
        "Website Profissional",
        "Identidade visual completa",
        "Google Business otimizado",
        "SEO avançado",
        "Suporte prioritário",
      ],
    },
  ];

  return (
    <Section
      id="planos"
      index="02"
      kicker="Planos"
      meta="3 configurações"
      title={
        <>
          Uma solução para cada <span className="text-foreground/45">fase</span> do seu negócio.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={p.name}
            data-reveal
            onMouseMove={onGlow}
            style={{ transitionDelay: `${i * 80}ms` }}
            className={cn(
              "relative flex translate-y-4 flex-col overflow-hidden rounded-xl border p-6 opacity-0 transition-all duration-500 sm:p-7",
              p.featured
                ? "topwire border-primary/45 bg-gradient-to-b from-[oklch(0.22_0.045_255)] to-card glow-electric md:-my-3 md:py-10"
                : "lift border-border bg-card",
            )}
          >
            {p.featured && (
              <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
            )}

            <div className="relative flex items-center justify-between">
              <span className="num font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/50">
                {p.code}
              </span>
              {p.featured && (
                <span className="inline-flex items-center gap-1.5 rounded border border-cyan/40 bg-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
                  Mais escolhido
                </span>
              )}
            </div>

            <h3 className="relative mt-4 font-display text-2xl font-bold tracking-tight">
              {p.name}
            </h3>
            <p className="relative mt-1.5 text-sm text-muted-foreground">{p.desc}</p>

            <ul className="relative mt-7 divide-y divide-border/70 border-y border-border/70">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 py-2.5 text-[13px]">
                  <Check
                    className={cn(
                      "mt-0.5 h-3.5 w-3.5 shrink-0",
                      p.featured ? "text-cyan" : "text-primary/70",
                    )}
                  />
                  <span className="text-foreground/85">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={getWhatsAppUrl(
                `Olá NexByte, gostaria de pedir um orçamento para o plano: ${p.name}`,
              )}
              className={cn(
                "relative mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-all",
                p.featured
                  ? "mt-8 bg-primary text-primary-foreground hover:shadow-[0_16px_40px_-16px_var(--electric-glow)]"
                  : "mt-8 border border-border bg-secondary text-foreground hover:border-primary/50 hover:bg-accent",
              )}
            >
              Pedir Orçamento <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>

      <p className="mt-6 flex items-center gap-2 font-mono text-[11px] text-muted-foreground/60">
        <span className="h-px w-6 bg-border" />
        Orçamento à medida em 24h · sem compromisso
      </p>
    </Section>
  );
}

/* ---------------- PROCESSO ---------------- */

function Process() {
  const steps: [string, string][] = [
    ["Briefing", "Compreender o seu negócio e objetivos."],
    ["Design", "Prototipagem visual moderna e alinhada com a marca."],
    ["Desenvolvimento", "Código limpo, rápido e responsivo."],
    ["Revisões", "Ajustes finos até ficar perfeito."],
    ["Publicação", "Lançamento e configuração no seu domínio."],
    ["Suporte", "Acompanhamento contínuo pós-lançamento."],
  ];

  return (
    <Section
      id="processo"
      index="03"
      kicker="Processo"
      meta="6 fases · 7–21 dias"
      title={
        <>
          Simples, transparente, <span className="text-foreground/45">previsível.</span>
        </>
      }
    >
      <div className="relative">
        {/* trilho da pipeline */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-border to-transparent lg:left-0 lg:right-0 lg:top-[13px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r" />

        <ol className="grid gap-7 lg:grid-cols-6 lg:gap-4">
          {steps.map(([t, d], i) => (
            <li
              key={t}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
              className="group relative flex translate-y-4 gap-4 opacity-0 transition-all duration-500 lg:block"
            >
              <span className="relative z-10 mt-0.5 grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border border-border bg-[oklch(0.17_0.015_263)] font-mono text-[10px] font-semibold text-muted-foreground transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground lg:h-[27px] lg:w-[27px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="lg:mt-5 lg:pr-4">
                <h3 className="font-display text-[15px] font-semibold tracking-tight transition-colors group-hover:text-cyan">
                  {t}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------------- PORTEFÓLIO ---------------- */

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
  image: string;
};

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
      { value: "1.4s", label: "carregamento" },
      { value: "98", label: "Lighthouse" },
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
    hue: 20,
    image: novaImg,
    description:
      "Landing page vibrante para uma marca de café artesanal, otimizada para subscrições e pedidos rápidos.",
    results: [
      { value: "+312%", label: "subscrições 1º mês" },
      { value: "6.8%", label: "taxa de conversão" },
      { value: "42s", label: "tempo na página" },
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
    hue: 310,
    image: velaImg,
    description:
      "Loja online sofisticada com navegação intuitiva, focada na experiência de luxo e conversão de vendas mobile.",
    results: [
      { value: "+165%", label: "vendas online" },
      { value: "-41%", label: "abandono carrinho" },
      { value: "4.9★", label: "avaliação" },
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
    hue: 200,
    image: norteImg,
    description:
      "Portal jurídico de alta autoridade, focado em clareza informativa e geração de leads qualificados via SEO local.",
    results: [
      { value: "#1", label: "'advogado Braga'" },
      { value: "+520%", label: "tráfego orgânico" },
      { value: "34", label: "leads / mês" },
    ],
    stack: ["Astro", "Contentful", "Google Business"],
    services: ["SEO On-page", "Conteúdo", "Google Business"],
  },
];

function Portfolio() {
  return (
    <Section
      id="projetos"
      index="04"
      kicker="Portefólio"
      meta="04 casos"
      title={
        <>
          Projetos reais, resultados <span className="text-foreground/45">medidos.</span>
        </>
      }
      lead="Conheça algumas das soluções digitais que desenvolvemos para transformar o negócio dos nossos clientes."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p, i) => (
          <article
            key={p.name}
            data-reveal
            onMouseMove={onGlow}
            style={{ transitionDelay: `${(i % 2) * 90}ms` }}
            className="lift group flex translate-y-4 flex-col overflow-hidden rounded-xl border border-border bg-card opacity-0 transition-all duration-500"
          >
            <div
              className="relative aspect-[16/10] overflow-hidden"
              style={{
                background: `radial-gradient(circle at 30% 20%, oklch(0.5 0.16 ${p.hue}) 0%, oklch(0.15 0.014 262) 70%)`,
              }}
            >
              <img
                src={p.image}
                alt={`Preview do projeto ${p.name}`}
                loading="lazy"
                width={1600}
                height={1000}
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />

              {/* índice em marca-d'água */}
              <span className="num pointer-events-none absolute -bottom-4 right-3 font-display text-[5rem] font-bold leading-none text-white/10 sm:text-[6rem]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                <span className="num rounded border border-white/15 bg-black/55 px-2 py-1 font-mono text-[10px] tracking-wider text-white/85 backdrop-blur">
                  {p.year}
                </span>
                <span className="rounded border border-primary/40 bg-primary/85 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary-foreground backdrop-blur">
                  {p.tag}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5 p-6">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  <MapPin className="h-3 w-3 text-primary" />
                  {p.location}
                  <span className="h-px w-3 bg-border" />
                  {p.sector}
                </div>
                <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {p.description}
                </p>
              </div>

              {/* resultados como leitura de painel */}
              <div className="grid grid-cols-3 divide-x divide-border border-y border-border">
                {p.results.map((r) => (
                  <div key={r.label} className="px-2 py-3 text-center">
                    <div className="num font-display text-lg font-bold text-cyan sm:text-xl">
                      {r.value}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {p.services.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  stack <span className="text-foreground/75">{p.stack.join(" · ")}</span>
                </div>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- PORQUÊ NEXBYTE ---------------- */

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
    <Section
      index="05"
      kicker="Porquê NexByte"
      meta="spec sheet"
      title={
        <>
          Motivos para trabalhar <span className="text-foreground/45">connosco.</span>
        </>
      }
    >
      {/* matriz de especificações: uma só moldura, sem cartões soltos */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={it.t}
              data-reveal
              style={{ transitionDelay: `${(i % 4) * 55}ms` }}
              className={cn(
                "group relative translate-y-4 p-6 opacity-0 transition-all duration-500 hover:bg-[oklch(0.19_0.015_263)]",
                "border-b border-border last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0",
                i >= items.length - 2 && "sm:border-b-0",
                i >= items.length - 4 && "lg:border-b-0",
              )}
            >
              <span className="num absolute right-4 top-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="scene-3d">
                <span className="icon-3d group-hover:icon-3d-hover grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:text-cyan">
                  <it.icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <div className="mt-4 font-display text-[15px] font-semibold tracking-tight">
                {it.t}
              </div>
              <div className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{it.d}</div>
              <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-primary to-cyan transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
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
    { pos: 1, name: "A sua Empresa", rating: "4,9", active: true },
    { pos: 2, name: "Concorrente B", rating: "4,5", active: false },
    { pos: 3, name: "Concorrente A", rating: "4,2", active: false },
  ];

  return (
    <Section
      index="06"
      kicker="Google Business"
      meta="local seo"
      title={
        <>
          Apareça no topo do mapa. <span className="text-foreground/45">Literalmente.</span>
        </>
      }
    >
      <div className="hud relative overflow-hidden rounded-xl border border-border bg-card p-6 md:p-10">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_0%,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Desenvolvemos e otimizamos o seu perfil do Google Business para que a sua empresa
              apareça primeiro quando um cliente pesquisa pelos seus serviços na sua zona.
            </p>

            <ul className="mt-7 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
              {perks.map((p) => (
                <li
                  key={p.t}
                  className="scene-3d group flex gap-3 bg-card p-4 transition-colors hover:bg-[oklch(0.2_0.016_263)]"
                >
                  <span className="icon-3d group-hover:icon-3d-hover grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                    <p.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold">{p.t}</span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                      {p.d}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-3 divide-x divide-border border-y border-border">
              {[
                { v: 3, s: "x", l: "mais chamadas" },
                { v: 128, s: "", l: "avaliações" },
                { v: 92, s: "%", l: "cliques locais" },
              ].map((m) => (
                <div key={m.l} className="px-2 py-4 text-center">
                  <div className="font-display text-xl font-bold text-cyan sm:text-2xl">
                    <CountUp to={m.v} suffix={m.s} />
                  </div>
                  <div className="mt-1 text-[11px] leading-tight text-muted-foreground">{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* mock do perfil */}
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background p-4 glow-electric">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <div className="pulse-ring relative grid h-10 w-10 place-items-center rounded-lg bg-primary/20 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">A sua Empresa • Portugal</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="num font-semibold text-foreground">4,9</span>
                    <span className="flex gap-0.5 text-cyan">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </span>
                    <span className="num">· 128 avaliações</span>
                  </div>
                </div>
                <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded border border-cyan/30 bg-cyan/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan sm:flex">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
                  Aberto
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                {[
                  { l: "Ligar", i: Phone },
                  { l: "Rota", i: NavigationIcon },
                  { l: "Website", i: Globe },
                ].map((a) => (
                  <div
                    key={a.l}
                    className="flex cursor-default items-center justify-center gap-1.5 rounded-md bg-secondary py-2 font-mono uppercase tracking-wider text-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                  >
                    <a.i className="h-3 w-3" />
                    {a.l}
                  </div>
                ))}
              </div>

              {/* radar do mapa */}
              <div className="scanline grid-bg-animated relative mt-3 h-36 overflow-hidden rounded-lg border border-border">
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
                    className={cn(
                      "absolute h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50",
                      pos,
                    )}
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </div>
            </div>

            {/* ranking */}
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                <Search className="h-3 w-3 text-primary" />
                “o seu serviço perto de mim”
              </div>
              <ul className="space-y-1.5">
                {ranking.map((r) => (
                  <li
                    key={r.name}
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-3 py-2 text-[13px] transition-all duration-500",
                      r.active
                        ? "border-primary/50 bg-primary/10 font-semibold text-foreground"
                        : "border-border/60 bg-secondary/40 text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "num grid h-5 w-5 shrink-0 place-items-center rounded font-mono text-[10px] font-bold",
                        r.active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {r.pos}
                    </span>
                    <span className="truncate">{r.name}</span>
                    <span className="num ml-auto flex shrink-0 items-center gap-1 font-mono text-[11px]">
                      <Star
                        className={cn(
                          "h-3 w-3",
                          r.active ? "fill-cyan text-cyan" : "text-muted-foreground",
                        )}
                      />
                      {r.rating}
                    </span>
                    {r.active && <TrendingUp className="h-3.5 w-3.5 shrink-0 text-cyan" />}
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

/* ---------------- LANDING PAGES ---------------- */

function LandingSection() {
  const cards = [
    {
      n: "01",
      t: "Ideais para anúncios",
      d: "Google Ads e Meta Ads chegam a uma página focada num único objetivo.",
    },
    {
      n: "02",
      t: "Alta taxa de conversão",
      d: "Estrutura, copy e provas sociais desenhadas para gerar leads.",
    },
    {
      n: "03",
      t: "Testes A/B",
      d: "Iteramos rapidamente para melhorar resultados ao longo do tempo.",
    },
  ];
  return (
    <Section
      index="07"
      kicker="Landing Pages"
      meta="cro"
      title={
        <>
          Feitas para converter, <span className="text-foreground/45">não só para apresentar.</span>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c, i) => (
          <div
            key={c.t}
            data-reveal
            onMouseMove={onGlow}
            style={{ transitionDelay: `${i * 70}ms` }}
            className="lift group relative translate-y-4 overflow-hidden rounded-xl border border-border bg-card p-6 opacity-0 transition-all duration-500"
          >
            <div className="num font-display text-[3.2rem] font-bold leading-none text-foreground/8 transition-colors duration-500 group-hover:text-primary/25">
              {c.n}
            </div>
            <h3 className="mt-3 font-display text-[17px] font-semibold tracking-tight">{c.t}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{c.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- LOGÓTIPO ---------------- */

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
    <Section
      id="logotipo"
      index="08"
      kicker="Logótipo"
      meta="brand system"
      title={
        <>
          Uma marca que se reconhece <span className="text-foreground/45">à primeira.</span>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div data-reveal className="translate-y-4 opacity-0 transition-all duration-700">
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            Criamos identidades visuais desenhadas do zero — sem templates, sem ícones genéricos.
            Cada logótipo nasce de um estudo do negócio, do público e da concorrência, e é entregue
            pronto para viver no site, nas redes, na fachada e na papelada.
          </p>

          <div className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {[
              { icon: Palette, t: "Conceito exclusivo", d: "3 propostas distintas para escolher." },
              { icon: Code2, t: "Vetorial e escalável", d: "Nítido do favicon ao outdoor." },
              { icon: Smartphone, t: "Testado em contexto", d: "Aplicado em mockups reais." },
              { icon: ShieldCheck, t: "Revisões incluídas", d: "Até ficar exatamente certo." },
            ].map((b) => (
              <div
                key={b.t}
                className="scene-3d group bg-card p-5 transition-colors hover:bg-[oklch(0.2_0.016_263)]"
              >
                <span className="icon-3d group-hover:icon-3d-hover grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:text-cyan">
                  <b.icon className="h-4.5 w-4.5" />
                </span>
                <div className="mt-3.5 font-display text-[14px] font-semibold tracking-tight">
                  {b.t}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">{b.d}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              Entregáveis
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {deliverables.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/40 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Check className="h-3 w-3 text-primary" />
                  {d}
                </span>
              ))}
            </div>
          </div>

          <a
            href={getWhatsAppUrl(
              "Olá NexByte, gostaria de um orçamento para a criação de um logótipo.",
            )}
            className="group mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-primary-foreground transition-all hover:shadow-[0_16px_40px_-16px_var(--electric-glow)]"
          >
            Quero o meu logótipo
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div
          data-reveal
          className="hud relative translate-y-4 overflow-hidden rounded-xl border border-border bg-card p-5 opacity-0 transition-all duration-700 sm:p-6"
        >
          <div className="dot-bg pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />

          <div className="relative flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Marcas criadas
            </div>
            <div className="inline-flex items-center gap-1.5 rounded border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
              vetorial
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {marks.map((m) => (
              <div
                key={m.label}
                className="group relative overflow-hidden bg-card p-4 transition-colors hover:bg-[oklch(0.2_0.016_263)]"
              >
                <div className="relative flex aspect-square items-center justify-center rounded-lg border border-border bg-background transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-10px_var(--electric-glow)]">
                  <img
                    src={m.logo}
                    alt={`Logótipo ${m.label}`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-4/5 w-4/5 object-contain opacity-90 invert brightness-125 contrast-125 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
                <div className="mt-3 text-center">
                  <div className="truncate text-[12px] font-semibold leading-tight">{m.label}</div>
                  <div className="truncate font-mono text-[9px] uppercase leading-tight tracking-[0.14em] text-muted-foreground">
                    {m.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-4 flex items-center justify-between border-t border-border pt-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
              Entrega média
            </div>
            <div className="font-display text-base font-bold">
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
  const faqs: [string, string][] = [
    [
      "Quanto tempo demora um website?",
      "Entre 7 e 21 dias úteis dependendo da complexidade e do plano escolhido.",
    ],
    [
      "O domínio está incluído?",
      "Não. O registo do domínio é um valor à parte, permitindo que tenha total propriedade e liberdade de escolha.",
    ],
    ["O alojamento está incluído?", "Sim, alojamento rápido e seguro incluído."],
    [
      "Posso alterar o site depois?",
      "Claro. Entregamos formação e oferecemos planos de manutenção mensais.",
    ],
    ["O site aparece no Google?", "Todos os sites são otimizados para SEO desde o primeiro dia."],
    ["Fazem manutenção?", "Sim, temos planos de suporte técnico e atualizações contínuas."],
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section
      id="faq"
      index="09"
      kicker="FAQ"
      meta="suporte"
      title={
        <>
          Perguntas <span className="text-foreground/45">frequentes.</span>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        <div data-reveal className="translate-y-4 opacity-0 transition-all duration-700">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Não encontrou a sua pergunta? Fale connosco — respondemos normalmente em menos de uma
            hora.
          </p>
          <a
            href={getWhatsAppUrl("Olá NexByte, tenho uma dúvida sobre os vossos serviços.")}
            className="group mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground transition-all hover:border-primary/50"
          >
            Falar connosco
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-4 py-5 text-left"
                >
                  <span
                    className={cn(
                      "num mt-0.5 font-mono text-[11px] tracking-[0.18em] transition-colors",
                      isOpen ? "text-cyan" : "text-muted-foreground/40 group-hover:text-primary",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block font-display text-[15px] font-semibold tracking-tight transition-colors sm:text-base",
                        isOpen
                          ? "text-foreground"
                          : "text-foreground/85 group-hover:text-foreground",
                      )}
                    >
                      {q}
                    </span>
                    <span
                      className={cn(
                        "grid overflow-hidden text-[13px] leading-relaxed text-muted-foreground transition-all duration-300",
                        isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="min-h-0">{a}</span>
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded border transition-all duration-300",
                      isOpen
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- CTA FINAL ---------------- */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="grid-bg-animated pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: "radial-gradient(ellipse at 50% 55%, var(--electric-glow), transparent 62%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <div
          data-reveal
          className="inline-flex translate-y-3 items-center gap-2 rounded border border-border bg-[oklch(0.17_0.015_263)]/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground opacity-0 backdrop-blur transition-all duration-700"
        >
          <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
          Vagas abertas este mês
        </div>

        <h2
          data-reveal
          style={{ transitionDelay: "80ms" }}
          className="mt-7 translate-y-4 font-display text-[2rem] font-bold leading-[1.02] tracking-[-0.035em] opacity-0 transition-all duration-700 sm:text-[3.2rem]"
        >
          O próximo cliente da sua empresa está
          <br className="hidden sm:block" />{" "}
          <span className="text-gradient-tech">a uma pesquisa de distância.</span>
        </h2>

        <p
          data-reveal
          style={{ transitionDelay: "160ms" }}
          className="mx-auto mt-6 max-w-2xl translate-y-4 text-[15px] text-muted-foreground opacity-0 transition-all duration-700 sm:text-base"
        >
          Vamos criar uma presença digital que transmite confiança, gera autoridade e converte
          visitantes em clientes.
        </p>

        <div
          data-reveal
          style={{ transitionDelay: "240ms" }}
          className="mt-9 flex translate-y-4 flex-col items-center gap-4 opacity-0 transition-all duration-700"
        >
          <a
            href={getWhatsAppUrl(
              "Olá NexByte, gostaria de pedir um orçamento e transformar a minha presença digital.",
            )}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_22px_60px_-18px_var(--electric-glow)] sm:text-base"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Phone className="relative h-4 w-4" />
            <span className="relative">Pedir Orçamento no WhatsApp</span>
            <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
            <span>Resposta &lt; 1h</span>
            <span className="h-px w-4 bg-border" />
            <span>Sem compromisso</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- RODAPÉ ---------------- */

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-[oklch(0.15_0.014_262)]">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="group flex items-center gap-2.5">
              <span className="logo-3d grid h-9 w-9 place-items-center rounded-lg text-primary">
                <Zap className="relative h-4 w-4" />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">NexByte</span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Agência web em Portugal. Websites, landing pages e presença digital para empresas que
              querem crescer.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1 w-1 animate-pulse rounded-full bg-cyan" />
              Disponível para novos projetos
            </div>
          </div>

          <FooterCol title="Empresa" items={["Sobre", "Projetos", "Blog", "Contacto"]} />
          <FooterCol
            title="Serviços"
            items={["Websites", "Landing Pages", "Google Business", "SEO", "Branding"]}
          />

          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
              Contacto
            </div>
            <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
              <li>
                <a
                  href={getWhatsAppUrl("Olá NexByte, gostaria de falar convosco.")}
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone className="h-3.5 w-3.5 text-primary" /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:ola@nexbyte.pt"
                  className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5 text-primary" /> ola@nexbyte.pt
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-2">
              {[Instagram, Facebook, Linkedin].map((Ic, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary hover:text-cyan"
                  aria-label="Redes sociais"
                >
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60 sm:flex-row sm:items-center">
          <div className="num">
            © {new Date().getFullYear()} NexByte · Todos os direitos reservados
          </div>
          <div>Feito com precisão em Portugal</div>
        </div>
      </div>

      {/* wordmark em contorno: assinatura tipográfica, corta a leitura de template */}
      <div className="pointer-events-none relative select-none px-5 sm:px-8" aria-hidden>
        <div className="mx-auto max-w-7xl">
          <div className="text-outline translate-y-[18%] font-display text-[19vw] font-bold leading-[0.75] tracking-[-0.05em]">
            NEXBYTE
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        {title}
      </div>
      <ul className="mt-4 space-y-2.5 text-[13px] text-muted-foreground">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="transition-colors hover:text-foreground">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- CABEÇALHO DE SECÇÃO ----------------
   Numeração de documento técnico em vez do habitual
   “pill + título com a última palavra em gradiente”.        */

function Section({
  id,
  index,
  kicker,
  title,
  lead,
  meta,
  children,
}: {
  id?: string;
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="mb-10 border-t border-border pt-6 sm:mb-14">
          <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-8">
            <div className="flex items-center gap-3 md:block">
              <div className="num font-mono text-[11px] font-semibold tracking-[0.2em] text-primary">
                [{index}]
              </div>
              <div className="tick-rail hidden h-12 w-px md:mt-3 md:block" />
            </div>

            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70">
                {kicker}
              </div>
              <h2
                data-reveal
                className="mt-4 max-w-3xl translate-y-4 font-display text-[1.95rem] font-bold leading-[1.03] tracking-[-0.035em] opacity-0 transition-all duration-700 sm:text-[2.9rem] lg:text-[3.2rem]"
              >
                {title}
              </h2>
              {lead && (
                <p
                  data-reveal
                  style={{ transitionDelay: "120ms" }}
                  className="mt-5 max-w-2xl translate-y-3 text-[15px] leading-relaxed text-muted-foreground opacity-0 transition-all duration-700"
                >
                  {lead}
                </p>
              )}
            </div>

            {meta && (
              <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/45 md:flex">
                <span className="h-px w-6 bg-border" />
                {meta}
              </div>
            )}
          </div>
        </header>

        {children}
      </div>
    </section>
  );
}
