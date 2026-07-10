"use client";

import { motion } from "motion/react";
import { Github, Mail, MapPin, ExternalLink, Calendar, Code, Pen, Layers, Lightbulb } from "lucide-react";
import { translations } from "../data/translations";

interface AboutProps {
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  language?: "zh" | "en";
  settings?: {
    bio?: string;
    notice?: string;
    slogan?: string;
    nickname?: string;
    title?: string;
    avatarUrl?: string;
    github?: string;
    twitter?: string;
    mail?: string;
    location?: string;
  };
}

export default function About({ glowMode = true, theme = "glow", language = "zh", settings }: AboutProps) {
  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";
  const t = translations[language];

  const stats = [
    { value: "8+", label: isZh ? "原创文章" : "Original Articles" },
    { value: "16", label: isZh ? "技术标签" : "Tech Tags" },
    { value: "✓", label: isZh ? "持续更新中" : "Actively Updating" },
  ];

  const focusAreas = isZh ? [
    {
      icon: "code",
      title: "前端工程与性能优化",
      desc: "React / Next.js / TypeScript 全栈实践，追求极致的首屏渲染速度与流畅交互体验。",
    },
    {
      icon: "layers",
      title: "Cloudflare 全栈部署",
      desc: "Workers + D1 + R2 架构，Serverless 优先，零运维、全球边缘加速。",
    },
    {
      icon: "design",
      title: "设计美学与交互细节",
      desc: "太空极简风、像素级还原、微动效缓动曲线，相信好的产品源自对细节的偏执。",
    },
  ] : [
    {
      icon: "code",
      title: "Frontend Engineering & Performance",
      desc: "React / Next.js / TypeScript full-stack practice, pursuing ultimate first-paint speed and smooth interactions.",
    },
    {
      icon: "layers",
      title: "Cloudflare Full-Stack Deployment",
      desc: "Workers + D1 + R2 architecture, Serverless-first, zero-ops global edge acceleration.",
    },
    {
      icon: "design",
      title: "Design Aesthetics & Micro-interactions",
      desc: "Space-minimalist style, pixel-perfect implementation, subtle easing curves — great products come from obsessive detail.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="about-section">
      {/* Background glow overlay */}
      {actualGlow && (
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-blue-600/[0.015] blur-[150px] pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "关于我" : "About Me"}
          <span className={`text-sm font-mono font-normal px-3 py-1 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {isZh ? "关于" : "About"}
          </span>
        </h1>
        <p className={`text-base mt-3 tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{isZh ? "持续学习，持续创造" : "Keep learning, keep creating"}</p>
      </div>

      {/* Split grid layout based on Section 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Card: Personal Card (Avatar, profile and basic stats) */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-2xl border backdrop-blur-md text-center flex flex-col items-center ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/60 border-white/[0.06] hover:border-white/[0.12]"
            }`}
            id="about-profile-card"
          >
            {/* Avatar - use uploaded image if available, otherwise SVG */}
            <div className={`w-24 h-24 rounded-full border-2 relative overflow-hidden flex items-center justify-center mb-6 group ${
              isLight
                ? "border-indigo-100 bg-indigo-50/30 shadow-[0_8px_20px_rgba(99,102,241,0.1)]"
                : "border-indigo-500/20 bg-[#080914] shadow-[0_0_20px_rgba(99,102,241,0.15)]"
            }`}>
              {settings?.avatarUrl ? (
                <img src={settings.avatarUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Background stars (Dark mode only) */}
                  {!isLight && (
                    <>
                      <circle cx="20" cy="30" r="1" fill="#fff" opacity="0.3" />
                      <circle cx="80" cy="25" r="1.5" fill="#fff" opacity="0.2" />
                    </>
                  )}
                  {/* Minimalist mountain horizon behind avatar head */}
                  <path d="M 10 90 L 50 60 L 90 90 Z" fill={isLight ? "#e0e7ff" : "#1b1c2b"} />
                  {/* Human developer figure torso */}
                  <path d="M 25 100 Q 25 80 50 80 Q 75 80 75 100 Z" fill={isLight ? "#4f46e5" : "#0c0e1e"} />
                  {/* Face/neck */}
                  <rect x="45" y="55" width="10" height="15" fill={isLight ? "#fed7aa" : "#e2e8f0"} rx="2" />
                  {/* Hair (Cool modern black haircut) */}
                  <path d="M 36 50 Q 50 35 64 50 L 62 55 Q 50 48 38 55 Z" fill="#040508" />
                  <circle cx="50" cy="51" r="11" fill="#04060a" />
                  <path d="M 38 48 Q 50 42 62 48" stroke={isLight ? "#4338ca" : "#1e1b4b"} strokeWidth="1" />
                  {/* Eyes/glasses (Modern minimalist look) */}
                  <rect x="42" y="49" width="6" height="3" fill="#fff" rx="0.5" opacity="0.8" />
                  <rect x="52" y="49" width="6" height="3" fill="#fff" rx="0.5" opacity="0.8" />
                  <line x1="48" y1="50" x2="52" y2="50" stroke="#fff" strokeWidth="0.5" opacity="0.8" />
                </svg>
              )}
              {/* Outer hover rings */}
              <div className="absolute inset-0 border border-white/5 rounded-full scale-100 group-hover:scale-105 transition-transform" />
            </div>

            {/* Title & Metadata */}
            <h2 className={`text-xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`} id="about-username">{settings?.nickname || "Nono"}</h2>
            <p className={`text-sm font-medium mb-2 tracking-wide ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{settings?.title || (isZh ? "全栈开发工程师 & 独立创作者" : "Full-Stack Developer & Indie Creator")}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mb-6" id="about-location">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {settings?.location || (isZh ? "坐标地球 📍" : "Based in Earth 📍")}
            </div>

            {/* Social Link Handles */}
            <div className="flex items-center gap-3 mb-8" id="about-socials">
              <a
                href={settings?.github || "https://github.com/nono"}
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`}
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings?.mail || "hello@nono.com"}`}
                className={`p-2.5 rounded-xl border transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                    : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5"
                }`}
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Stats indicators inside profile card */}
            <div className={`w-full border-t pt-6 flex flex-col gap-4 text-left ${isLight ? "border-[#e5e2db]" : "border-white/[0.04]"}`} id="about-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className={`flex justify-between items-center px-4 py-2.5 border rounded-xl ${
                  isLight 
                    ? "bg-slate-50/60 border-slate-200/50" 
                    : "bg-white/[0.01] border-white/[0.02]"
                }`}>
                  <span className={`text-sm tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{stat.label}</span>
                  <span className={`text-base font-extrabold font-mono ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Columns: Biography & Detailed Milestones Timeline */}
        <div className="lg:col-span-2 text-left space-y-8">
          {/* Bio block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`p-6 rounded-2xl border ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/40 border-white/[0.04]"
            }`}
            id="about-bio-panel"
          >
            <h3 className={`text-base font-bold tracking-widest uppercase mb-4 border-b pb-2 font-mono ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              {isZh ? "个人简介" : "Bio"}
            </h3>
            <p className={`text-sm leading-relaxed space-y-4 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {settings?.bio ? settings.bio : (isZh ? (
                <>
                  热爱技术、设计与写作，致力于实现极致的用户交互与体验，始终保持对前端前沿动态的高敏感度。
                  <br />
                  <br />
                  作为一名“视觉强迫症”后端出身的全栈工作者，我深信真正的软件工艺（Software Craftsmanship）源自技术深度与美学的结合。我不仅编写高并发、可靠的 Serverless 接口逻辑，更专注于前端界面的“像素级还原”。无论是多小间距的留白（Negative Space）、组件排版的对比率还是平滑缓动的贝塞尔曲线，我都倾注心血。
                </>
              ) : (
                <>
                  Passionate about technology, design, and writing. Dedicated to delivering exceptional user experiences with a keen eye on cutting-edge frontend trends.
                  <br />
                  <br />
                  As a full-stack developer with a designer's eye, I believe true software craftsmanship comes from combining technical depth with aesthetics. I write high-concurrency, reliable Serverless logic while focusing on pixel-perfect frontend implementation — from micro-spacing to typography contrast ratios to smooth bezier curves.
                </>
              ))}
            </p>
          </motion.div>

          {/* Tech Stack & Writing Focus block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-6 rounded-2xl border ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/40 border-white/[0.04]"
            }`}
            id="about-focus-panel"
          >
            <h3 className={`text-base font-bold tracking-widest uppercase mb-6 border-b pb-2 font-mono flex items-center gap-2 ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              <Lightbulb className="w-4 h-4 text-amber-400" />
              {isZh ? "技术栈与写作方向" : "Tech Stack & Writing Focus"}
            </h3>

            <div className="space-y-5" id="focus-areas-list">
              {focusAreas.map((item) => {
                const IconMap: Record<string, any> = { code: Code, layers: Layers, design: Pen };
                const ItemIcon = IconMap[item.icon] || Code;
                return (
                  <div
                    key={item.title}
                    className={`flex gap-4 p-4 rounded-xl border transition-all group ${
                      isLight
                        ? "bg-slate-50/60 border-slate-200/50 hover:border-indigo-200 hover:shadow-[0_4px_12px_rgba(99,102,241,0.04)]"
                        : "bg-white/[0.01] border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      isLight ? "bg-indigo-50 text-indigo-500" : "bg-indigo-500/10 text-indigo-400"
                    }`}>
                      <ItemIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold mb-1.5 ${
                        isLight ? "text-slate-800" : "text-slate-200"
                      }`}>{item.title}</h4>
                      <p className={`text-sm leading-relaxed ${
                        isLight ? "text-slate-600" : "text-slate-400"
                      }`}>{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
