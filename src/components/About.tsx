"use client";

import { motion } from "motion/react";
import { Github, Twitter, Mail, MapPin, ExternalLink, Calendar, Code } from "lucide-react";
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
  };
}

export default function About({ glowMode = true, theme = "glow", language = "zh", settings }: AboutProps) {
  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";
  const t = translations[language];

  const stats = [
    { value: "3+", label: isZh ? "年研发经验" : "Years Experience" },
    { value: "20+", label: isZh ? "开源与实验项目" : "Open Source Projects" },
    { value: "∞", label: isZh ? "持续探索与热爱" : "Endless Passion" },
  ];

  const timeline = isZh ? [
    {
      year: "2024 - 至今",
      role: "独立开发者 & 顾问",
      company: "专注于极简 design 美学与前沿 Serverless 技术生态",
      desc: "研发并部署多个开源极简工具。为初创团队提供 React/Next.js 前端性能优化与 Cloudflare 部署架构咨询。",
    },
    {
      year: "2022 - 2024",
      role: "全栈工程师",
      company: "主导高性能 SaaS 数据监控平台的前端架构",
      desc: "使用 React/TypeScript 重构核心数据大屏组件库，提升并发大数据量场景下的流畅度，将综合首屏首帧加载耗时缩短了 45%。",
    },
    {
      year: "2020 - 2022",
      role: "高级前端开发",
      company: "负责企业级中台组件库设计与研发",
      desc: "负责设计并维护统一的视觉标准（Design System），编写易复用、强鲁棒性的核心通用组件，打通像素级还原的最佳工程化流程。",
    },
  ] : [
    {
      year: "2024 - Present",
      role: "Indie Developer & Consultant",
      company: "Focused on minimalist design aesthetics & cutting-edge Serverless",
      desc: "Built and deployed multiple open-source tools. Provided React/Next.js performance optimization and Cloudflare deployment consulting for startups.",
    },
    {
      year: "2022 - 2024",
      role: "Full-Stack Engineer",
      company: "Led frontend architecture for a high-performance SaaS platform",
      desc: "Rebuilt core dashboard component library with React/TypeScript, improving throughput under heavy data scenarios and reducing first-paint time by 45%.",
    },
    {
      year: "2020 - 2022",
      role: "Senior Frontend Developer",
      company: "Enterprise design system and component library",
      desc: "Designed and maintained a unified Design System, wrote reusable and robust core components, established pixel-perfect engineering workflows.",
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
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {isZh ? "坐标地球 📍" : "Based in Earth 📍"}
            </div>

            {/* Social Link Handles */}
            <div className="flex items-center gap-3 mb-8" id="about-socials">
              <a
                href="https://github.com/nono"
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
                href="https://twitter.com/nono"
                target="_blank"
                rel="noreferrer"
                className={`p-2.5 rounded-xl border transition-all ${
                  isLight
                    ? "bg-slate-50 border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                    : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5"
                }`}
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@nono.com"
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

          {/* Timeline block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`p-6 rounded-2xl border ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/40 border-white/[0.04]"
            }`}
            id="about-timeline-panel"
          >
            <h3 className={`text-base font-bold tracking-widest uppercase mb-6 border-b pb-2 font-mono ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              {isZh ? "我的历程" : "My Journey"}
            </h3>

            <div className={`space-y-6 relative border-l pl-5 ml-2 ${isLight ? "border-[#e5e2db]" : "border-white/[0.04]"}`} id="timeline-list">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative group">
                  {/* Outer circle dot line */}
                  <span className={`absolute -left-[26px] top-1.5 w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    isLight 
                      ? "bg-white border-slate-300 group-hover:border-indigo-500 group-hover:bg-indigo-100"
                      : "bg-slate-800 border-slate-600 group-hover:border-indigo-400 group-hover:bg-indigo-500/20"
                  }`} />
                  
                  {/* Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border w-fit ${
                      isLight
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}>
                      {item.year}
                    </span>
                    <h4 className={`text-sm font-mono font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                      {item.company}
                    </h4>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold transition-colors ${
                    isLight ? "text-slate-800 group-hover:text-indigo-600" : "text-slate-200 group-hover:text-white"
                  }`}>
                    {item.role}
                  </h3>

                  {/* Desc */}
                  <p className={`text-sm leading-relaxed mt-2.5 ${isLight ? "text-slate-600" : "text-slate-300"}`}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
