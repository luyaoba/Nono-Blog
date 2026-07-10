"use client";

import { motion } from "motion/react";
import { ArrowRight, Laptop, Cloud, PenTool, Wrench, Brain, Globe, Cpu, Terminal, Flame, Sparkles, Rocket, Server, Palette } from "lucide-react";
import type { Category, Article } from "../data/mockAdminData";

interface HeroProps {
  onNavigate: (tab: string) => void;
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  settings?: {
    siteSlogan?: string;
    bio?: string;
    siteSloganEn?: string;
    siteNotice?: string;
    homeImage?: string;
  };
  categories?: Category[];
  articles?: Article[];
  language?: "zh" | "en";
}

export default function Hero({ onNavigate, glowMode = true, theme = "glow", settings, categories = [], articles = [], language = "zh" }: HeroProps) {
  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";

  // Icon mapping by iconType (smaller for cards)
  const iconMap: Record<string, React.ReactNode> = {
    laptop: <Laptop className="w-5 h-5" />,
    server: <Server className="w-5 h-5" />,
    cloud: <Cloud className="w-5 h-5" />,
    palette: <Palette className="w-5 h-5" />,
    "pen-tool": <PenTool className="w-5 h-5" />,
    wrench: <Wrench className="w-5 h-5" />,
    brain: <Brain className="w-5 h-5" />,
    globe: <Globe className="w-5 h-5" />,
    cpu: <Cpu className="w-5 h-5" />,
    terminal: <Terminal className="w-5 h-5" />,
    flame: <Flame className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
    rocket: <Rocket className="w-5 h-5" />,
  };

  // Color mapping by iconType
  const colorMap: Record<string, { text: string; bg: string; border: string }> = {
    laptop: { text: isLight ? "text-sky-600" : "text-sky-400", bg: isLight ? "bg-sky-50" : "bg-sky-500/10", border: isLight ? "border-sky-200" : "border-sky-500/20" },
    server: { text: isLight ? "text-emerald-600" : "text-emerald-400", bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", border: isLight ? "border-emerald-200" : "border-emerald-500/20" },
    cloud: { text: isLight ? "text-blue-600" : "text-blue-400", bg: isLight ? "bg-blue-50" : "bg-blue-500/10", border: isLight ? "border-blue-200" : "border-blue-500/20" },
    palette: { text: isLight ? "text-indigo-600" : "text-indigo-400", bg: isLight ? "bg-indigo-50" : "bg-indigo-500/10", border: isLight ? "border-indigo-200" : "border-indigo-500/20" },
    "pen-tool": { text: isLight ? "text-fuchsia-600" : "text-fuchsia-400", bg: isLight ? "bg-fuchsia-50" : "bg-fuchsia-500/10", border: isLight ? "border-fuchsia-200" : "border-fuchsia-500/20" },
    wrench: { text: isLight ? "text-amber-600" : "text-amber-400", bg: isLight ? "bg-amber-50" : "bg-amber-500/10", border: isLight ? "border-amber-200" : "border-amber-500/20" },
    brain: { text: isLight ? "text-purple-600" : "text-purple-400", bg: isLight ? "bg-purple-50" : "bg-purple-500/10", border: isLight ? "border-purple-200" : "border-purple-500/20" },
    globe: { text: isLight ? "text-indigo-600" : "text-indigo-400", bg: isLight ? "bg-indigo-50" : "bg-indigo-500/10", border: isLight ? "border-indigo-200" : "border-indigo-500/20" },
    cpu: { text: isLight ? "text-teal-600" : "text-teal-400", bg: isLight ? "bg-teal-50" : "bg-teal-500/10", border: isLight ? "border-teal-200" : "border-teal-500/20" },
    terminal: { text: isLight ? "text-emerald-600" : "text-emerald-400", bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", border: isLight ? "border-emerald-200" : "border-emerald-500/20" },
    flame: { text: isLight ? "text-rose-600" : "text-rose-400", bg: isLight ? "bg-rose-50" : "bg-rose-500/10", border: isLight ? "border-rose-200" : "border-rose-500/20" },
    sparkles: { text: isLight ? "text-amber-600" : "text-amber-400", bg: isLight ? "bg-amber-50" : "bg-amber-500/10", border: isLight ? "border-amber-200" : "border-amber-500/20" },
    rocket: { text: isLight ? "text-indigo-600" : "text-indigo-400", bg: isLight ? "bg-indigo-50" : "bg-indigo-500/10", border: isLight ? "border-indigo-200" : "border-indigo-500/20" },
  };

  // Compute category display list with article counts
  const validCats = categories.filter(c => c.title && c.title.trim());
  const fallbackCatsZh = [
    { id: "frontend", title: "前端开发", desc: "精研 React、Next.js、Vite 等前沿技术栈与极致性能优化。", iconType: "laptop", colorName: "前端开发" },
    { id: "backend", title: "后端开发", desc: "构建高可用分布式服务，精进 Node.js、Go、数据库设计。", iconType: "server", colorName: "后端开发" },
    { id: "cloud", title: "运维部署", desc: "分享 Cloudflare 生态、Docker 容器化与 CI/CD 极速部署实践。", iconType: "cloud", colorName: "Cloudflare" },
    { id: "design", title: "设计美学", desc: "像素级前端还原技术，前沿视觉、排版美感设计与优雅微交互。", iconType: "palette", colorName: "设计美学" },
  ];
  const fallbackCatsEn = [
    { id: "frontend", title: "Frontend", desc: "Deep dive into React, Next.js, Vite and pixel-perfect performance.", iconType: "laptop", colorName: "前端开发" },
    { id: "backend", title: "Backend", desc: "Building distributed services with Node.js, Go, and elegant databases.", iconType: "server", colorName: "后端开发" },
    { id: "cloud", title: "DevOps", desc: "Cloudflare ecosystem, Docker containerization and CI/CD best practices.", iconType: "cloud", colorName: "Cloudflare" },
    { id: "design", title: "Design", desc: "Pixel-perfect UI, visual aesthetics, typography and elegant interactions.", iconType: "palette", colorName: "设计美学" },
  ];
  const fallbackCats = isZh ? fallbackCatsZh : fallbackCatsEn;
  const displayCats = (validCats.length > 0 ? validCats : fallbackCats).slice(0, 4);
  const getCatsCount = (cat: any) => cat.colorName === "全部" ? articles.length : articles.filter(a => a.category === cat.colorName).length;

  return (
    <div className="relative w-full overflow-hidden" id="hero-section">
      {/* Background Star Ambient Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {!isLight ? (
          actualGlow ? (
            <>
              <div className="absolute top-[5%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-indigo-500/[0.08] via-purple-500/[0.04] to-transparent blur-[150px] animate-pulse duration-[8000ms]" />
              <div className="absolute top-[15%] right-[15%] w-[650px] h-[650px] rounded-full bg-gradient-to-l from-blue-500/[0.06] via-indigo-600/[0.04] to-transparent blur-[160px]" />
              <div className="absolute top-[40%] left-[40%] w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[120px]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent opacity-40 pointer-events-none" />
          )
        ) : null}

        {/* Dense Star constellations layer behind Title for dark modes */}
        {!isLight && (
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] opacity-60" viewBox="0 0 1200 550" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke={actualGlow ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)"} strokeWidth="0.75">
              <line x1="250" y1="120" x2="310" y2="80" />
              <line x1="310" y1="80" x2="380" y2="150" />
              <line x1="880" y1="140" x2="940" y2="90" />
              <line x1="940" y1="90" x2="1020" y2="180" />
              <line x1="580" y1="60" x2="620" y2="130" />
            </g>
            <g fill="#ffffff">
              <circle cx="250" cy="120" r="1.5" className="animate-ping duration-[4000ms]" />
              <circle cx="310" cy="80" r="2" />
              <circle cx="380" cy="150" r="1.5" />
              <circle cx="880" cy="140" r="1.5" />
              <circle cx="940" cy="90" r="2.5" className="animate-pulse" />
              <circle cx="1020" cy="180" r="1.5" />
              <circle cx="580" cy="60" r="2" />
              <circle cx="620" cy="130" r="1.5" />
            </g>
            <g fill={actualGlow ? "#818cf8" : "#94a3b8"} opacity="0.3">
              <circle cx="150" cy="220" r="1" />
              <circle cx="220" cy="300" r="1" />
              <circle cx="450" cy="180" r="1" />
              <circle cx="780" cy="120" r="1" />
              <circle cx="910" cy="280" r="1" />
              <circle cx="1100" cy="200" r="1" />
            </g>
          </svg>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative flex flex-col items-center text-center z-10">
        {/* Hero Copy (探索 · 记录 · 分享) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 select-none"
        >
          {/* Subtle Tag badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold tracking-wider uppercase mb-8 backdrop-blur-sm transition-colors duration-1000 ${
            isLight
              ? "border-indigo-100 bg-indigo-50/50 text-indigo-600"
              : actualGlow 
              ? "border-white/[0.04] bg-white/[0.02] text-slate-400" 
              : "border-white/10 bg-white/5 text-slate-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? "bg-indigo-500" : actualGlow ? "bg-indigo-400" : "bg-white"}`} />
            {isZh ? (settings?.siteNotice || "探索 · 记录 · 分享") : "EXPLORE · RECORD · SHARE"}
          </div>

          <h1 className={`text-4xl md:text-6xl font-extrabold tracking-[0.25em] mb-6 drop-shadow-xl pl-[0.25em] ${
            isLight
              ? "text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-950"
              : "text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400"
          }`} id="hero-main-title">
            {isZh ? (settings?.siteSlogan || "极简太空博客") : (settings?.siteSloganEn || "Minimalist Space Blog")}
          </h1>

          <p className={`max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed tracking-wider px-4 ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`} id="hero-sub-title">
            {isZh 
              ? (settings?.bio || "一个热爱技术与设计的开发者，记录思考，分享经验，持续成长。") 
              : "A developer passionate about technology and design, documenting thoughts, sharing experiences, and growing constantly."}
          </p>
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10 relative z-10"
          id="hero-cta-buttons"
        >
          <button
            onClick={() => onNavigate("articles")}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-[1px] cursor-pointer ${
              isLight
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_14px_rgba(99,102,241,0.2)]"
                : "bg-white hover:bg-slate-100 text-[#07080c] shadow-[0_4px_24px_rgba(255,255,255,0.08)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.18)]"
            }`}
          >
            {isZh ? "开始阅读" : "Start Reading"}
          </button>
          <button
            onClick={() => onNavigate("about")}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl border text-sm font-semibold tracking-wide backdrop-blur-md transition-all duration-300 hover:-translate-y-[1px] cursor-pointer ${
              isLight
                ? "bg-[#fefdfb] hover:bg-[#f8f7f4] text-slate-700 border-[#e5e2db]"
                : "bg-white/[0.03] hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-white/20"
            }`}
          >
            {isZh ? "了解更多" : "Learn More"}
          </button>
        </motion.div>

        {/* Inline High-Fidelity SVG Mountain starry night scene with observer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className={`w-full max-w-4xl h-[280px] md:h-[380px] mt-12 relative overflow-hidden transition-all duration-1000 ${
            isLight
              ? "bg-transparent"
              : actualGlow 
              ? "bg-transparent" 
              : "bg-transparent"
          }`}
          id="hero-illustration"
        >
          {settings?.homeImage ? (
            <motion.div 
              className="w-full h-full relative group"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <img 
                src={settings.homeImage} 
                alt="主页个性化背景图" 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          ) : (
            <svg className="w-full h-full object-cover" viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Sky Deep Gradient */}
              <rect width="800" height="350" fill="url(#skyGradient)" />

              {/* Glowing Nebula/Stars Behind Peak */}
              <circle cx="400" cy="180" r="160" fill="url(#nebulaGlow)" />
              <circle cx="580" cy="100" r="120" fill="url(#secondaryGlow)" />

              {/* Tiny Star Particles (Only visible in dark) */}
              {!isLight && (
                <g opacity={actualGlow ? "0.6" : "0.4"}>
                  <circle cx="120" cy="60" r="1" fill="#fff" opacity="0.8" />
                  <circle cx="180" cy="120" r="1.5" fill="#fff" opacity="0.5" />
                  <circle cx="280" cy="50" r="1.2" fill="#fff" opacity="0.9" />
                  <circle cx="340" cy="90" r="1" fill="#fff" opacity="0.4" />
                  <circle cx="480" cy="70" r="1.5" fill="#fff" opacity="0.75" />
                  <circle cx="520" cy="140" r="1" fill="#fff" opacity="0.5" />
                  <circle cx="640" cy="40" r="1.8" fill="#fff" opacity="0.8" />
                  <circle cx="710" cy="110" r="1" fill="#fff" opacity="0.6" />
                  <circle cx="80" cy="150" r="1.2" fill="#fff" opacity="0.7" />
                  <circle cx="220" cy="80" r="1" fill="#fff" opacity="0.6" />
                  <circle cx="600" cy="160" r="1.3" fill="#fff" opacity="0.7" />
                </g>
              )}

              {/* Constellation line links (Only visible in dark) */}
              {!isLight && (
                <>
                  <path d="M 120 60 L 180 120 L 220 80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  <path d="M 480 70 L 520 140" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                  <path d="M 640 40 L 710 110" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                </>
              )}

              {/* Mountain 3 (Far mountain - subtle outline) */}
              <path d="M 50 350 L 220 160 L 380 350 Z" fill="url(#mountainFarGradient)" opacity="0.7" />
              <path d="M 450 350 L 620 180 L 750 350 Z" fill="url(#mountainFarGradient)" opacity="0.6" />

              {/* Mountain 2 (Middle mountain) */}
              <path d="M -20 350 L 150 190 L 320 350 Z" fill="url(#mountainMidGradient)" />
              <path d="M 500 350 L 680 190 L 830 350 Z" fill="url(#mountainMidGradient)" />

              {/* Main Peak - Mountain 1 (Foreground Center Sharp Mountain) */}
              <path d="M 180 350 L 400 120 L 620 350 Z" fill="url(#mountainMainGradient)" />
              
              {/* Snowy peak outline and highlights */}
              <path d="M 360 162 L 400 120 L 440 162 L 420 180 L 400 155 L 380 178 Z" fill="url(#snowCapGradient)" />
              <path d="M 400 120 L 402 350" stroke={isLight ? "rgba(99, 102, 241, 0.15)" : "rgba(255, 255, 255, 0.05)"} strokeWidth="1" />

              {/* Ground shading/Fogginess at base */}
              <rect y="310" width="800" height="40" fill="url(#groundFogGradient)" />

              {/* Tiny Explorer Silhouette & Ground Mound */}
              <ellipse cx="400" cy="328" rx="16" ry="3" fill={isLight ? "rgba(99, 102, 241, 0.1)" : "#030406"} />
              <g transform="translate(397, 313)">
                <circle cx="3" cy="3" r="1.5" fill={isLight ? "#4f46e5" : "#040608"} />
                <path d="M 1.5 4.5 L 4.5 4.5 L 5 12 L 1 12 Z" fill={isLight ? "#312e81" : "#030406"} />
                <circle cx="5.5" cy="7.5" r="0.8" fill={isLight ? "#4f46e5" : actualGlow ? "#06b6d4" : "#ffffff"} className="animate-pulse" />
              </g>

              {/* Definitions for Gradients */}
              <defs>
                <linearGradient id="skyGradient" x1="400" y1="0" x2="400" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#e0e7ff" : actualGlow ? "#040407" : "#000000"} />
                  <stop offset="0.4" stopColor={isLight ? "#eef2ff" : actualGlow ? "#080914" : "#020202"} />
                  <stop offset="0.8" stopColor={isLight ? "#f5f7fb" : actualGlow ? "#0c0e1b" : "#040405"} />
                  <stop offset="1" stopColor={isLight ? "#ffffff" : actualGlow ? "#07080c" : "#000000"} />
                </linearGradient>

                <radialGradient id="nebulaGlow" cx="400" cy="180" r="160" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#a5b4fc" : actualGlow ? "#312e81" : "#ffffff"} stopOpacity={isLight ? "0.4" : actualGlow ? "0.25" : "0.03"} />
                  <stop offset="0.6" stopColor={isLight ? "#c7d2fe" : actualGlow ? "#1e1b4b" : "#ffffff"} stopOpacity={isLight ? "0.1" : actualGlow ? "0.08" : "0.01"} />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="secondaryGlow" cx="580" cy="100" r="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#c7d2fe" : actualGlow ? "#1e3a8a" : "#ffffff"} stopOpacity={isLight ? "0.3" : actualGlow ? "0.12" : "0.02"} />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="mountainMainGradient" x1="400" y1="120" x2="400" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#818cf8" : actualGlow ? "#1b1d2d" : "#12131b"} />
                  <stop offset="0.4" stopColor={isLight ? "#6366f1" : actualGlow ? "#10121d" : "#090a0f"} />
                  <stop offset="1" stopColor={isLight ? "#4f46e5" : actualGlow ? "#040509" : "#010103"} />
                </linearGradient>

                <linearGradient id="mountainMidGradient" x1="150" y1="190" x2="150" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#93c5fd" : actualGlow ? "#141522" : "#0e0f14"} />
                  <stop offset="1" stopColor={isLight ? "#3b82f6" : actualGlow ? "#040508" : "#010102"} />
                </linearGradient>

                <linearGradient id="mountainFarGradient" x1="220" y1="160" x2="220" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#c7d2fe" : actualGlow ? "#0d0e17" : "#09090c"} />
                  <stop offset="1" stopColor={isLight ? "#818cf8" : actualGlow ? "#05060a" : "#010102"} />
                </linearGradient>

                <linearGradient id="snowCapGradient" x1="400" y1="120" x2="400" y2="180" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#ffffff" : actualGlow ? "#38bdf8" : "#ffffff"} stopOpacity={isLight ? "0.8" : actualGlow ? "0.4" : "0.2"} />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="groundFogGradient" x1="400" y1="310" x2="400" y2="350" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor={isLight ? "#ffffff" : actualGlow ? "#07080c" : "#000000"} stopOpacity="0" />
                  <stop offset="1" stopColor={isLight ? "#ffffff" : actualGlow ? "#07080c" : "#000000"} stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Floating Info Overlay - only show for default SVG */}
          {!settings?.homeImage && (
            <div className="absolute bottom-4 left-6 flex items-center gap-6 text-xs font-mono text-slate-400 tracking-widest uppercase hidden sm:flex select-none">
              <div>{isZh ? "极简太空博客" : "MINIMAL SPACE BLOG"}</div>
            </div>
          )}
        </motion.div>

        {/* Feature Grid Section - 领域专长卡片 */}
        <div className="w-full mt-20 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className={`text-xl md:text-2xl font-bold tracking-wider ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {isZh ? "领域专长" : "Areas of Expertise"}
              </h2>
              <p className={`text-sm mt-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                {isZh ? "记录与开发相关的核心技能与技术领域" : "Documenting core skills and technical domains"}
              </p>
            </div>
            <div className={`h-[1px] flex-grow mx-0 md:mx-6 hidden md:block ${isLight ? "bg-[#e5e2db]" : "bg-white/[0.04]"}`} />
            <button
              onClick={() => onNavigate("categories")}
              className={`group inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                isLight ? "text-indigo-600 hover:text-indigo-700" : "text-indigo-400 hover:text-indigo-300"
              }`}
            >
              {isZh ? "浏览全部分类" : "All Categories"} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="hero-feature-grids">
            {displayCats.map((cat, index) => {
              const count = getCatsCount(cat);
              const iconType = cat.iconType || "laptop";
              const colors = colorMap[iconType] || colorMap.laptop;
              const desc = (cat as any).desc || "";
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  onClick={() => onNavigate("articles")}
                  className={`group cursor-pointer p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-[200px] ${
                    isLight
                      ? "bg-[#fefdfb]/80 border-[#e5e2db]/60 hover:bg-[#fefdfb] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                      : "bg-[#0c0d14]/60 border-white/[0.06] hover:border-white/[0.12] hover:bg-[#10121e]/60"
                  }`}
                  id={`hero-feature-card-${cat.id}`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isLight ? "from-indigo-500/5 to-transparent" : "from-indigo-500/10 to-transparent"
                  }`} />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl border transition-all duration-300 ${
                        isLight
                          ? "bg-[#f8f7f4] border-[#e5e2db]/60 group-hover:bg-indigo-50 group-hover:border-indigo-100"
                          : `${colors.bg} ${colors.border} group-hover:bg-white/[0.05] group-hover:border-white/[0.1]`
                      }`}>
                        <span className={colors.text}>{iconMap[iconType] || iconMap.laptop}</span>
                      </div>
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded border tracking-wide font-semibold ${
                        isLight ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-white/5 text-slate-300 border-white/10"
                      }`}>
                        {count} {isZh ? "篇文章" : "articles"}
                      </span>
                    </div>
                    <h3 className={`text-lg font-bold group-hover:translate-x-0.5 transition-all ${
                      isLight ? "text-slate-800" : "text-slate-100 group-hover:text-white"
                    }`}>
                      {cat.title}
                    </h3>
                    {desc && (
                      <p className={`text-sm line-clamp-2 mt-2 leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                        {desc}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <span className={`text-xs font-mono group-hover:text-indigo-500 transition-colors ${isLight ? "text-slate-500" : "text-slate-400"}`}>
                      {isZh ? "探索更多 →" : "Explore →"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
