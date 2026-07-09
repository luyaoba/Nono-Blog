"use client";

import { motion } from "motion/react";

interface TagsProps {
  onSelectTag: (tag: string) => void;
  theme?: "glow" | "dark" | "light";
  language?: "zh" | "en";
}

export default function Tags({ onSelectTag, theme = "glow", language = "zh" }: TagsProps) {
  const isLight = theme === "light";
  const actualGlow = theme === "glow";

  // 16 beautiful floating cloud tags based on the picture
  const tagsList = [
    { name: "Cloudflare", count: 6, glow: isLight ? "hover:border-blue-300 hover:shadow-xs" : "hover:border-blue-500/30 hover:shadow-[0_0_12px_rgba(59,130,246,0.1)]" },
    { name: "Next.js", count: 4, glow: isLight ? "hover:border-slate-300 hover:shadow-xs" : "hover:border-slate-500/30 hover:shadow-[0_0_12px_rgba(255,255,255,0.06)]" },
    { name: "TypeScript", count: 5, glow: isLight ? "hover:border-sky-300 hover:shadow-xs" : "hover:border-sky-500/30 hover:shadow-[0_0_12px_rgba(56,189,248,0.1)]" },
    { name: "部署", count: 6, glow: isLight ? "hover:border-emerald-300 hover:shadow-xs" : "hover:border-emerald-500/30 hover:shadow-[0_0_12px_rgba(52,211,153,0.1)]" },
    { name: "前端", count: 6, glow: isLight ? "hover:border-indigo-300 hover:shadow-xs" : "hover:border-indigo-500/30 hover:shadow-[0_0_12px_rgba(129,140,248,0.1)]" },
    { name: "设计", count: 5, glow: isLight ? "hover:border-pink-300 hover:shadow-xs" : "hover:border-pink-500/30 hover:shadow-[0_0_12px_rgba(236,72,153,0.1)]" },
    { name: "Vue", count: 3, glow: isLight ? "hover:border-emerald-300 hover:shadow-xs" : "hover:border-emerald-500/30 hover:shadow-[0_0_12px_rgba(16,185,129,0.1)]" },
    { name: "React", count: 4, glow: isLight ? "hover:border-cyan-300 hover:shadow-xs" : "hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(6,182,212,0.1)]" },
    { name: "Node.js", count: 3, glow: isLight ? "hover:border-green-300 hover:shadow-xs" : "hover:border-green-500/30 hover:shadow-[0_0_12px_rgba(34,197,94,0.1)]" },
    { name: "MongoDB", count: 3, glow: isLight ? "hover:border-green-400 hover:shadow-xs" : "hover:border-green-600/30 hover:shadow-[0_0_12px_rgba(22,163,74,0.1)]" },
    { name: "Docker", count: 2, glow: isLight ? "hover:border-blue-300 hover:shadow-xs" : "hover:border-blue-400/30 hover:shadow-[0_0_12px_rgba(96,165,250,0.1)]" },
    { name: "Drizzle", count: 2, glow: isLight ? "hover:border-yellow-400 hover:shadow-xs" : "hover:border-yellow-500/30 hover:shadow-[0_0_12px_rgba(234,179,8,0.1)]" },
    { name: "Go", count: 3, glow: isLight ? "hover:border-sky-300 hover:shadow-xs" : "hover:border-sky-400/30 hover:shadow-[0_0_12px_rgba(56,189,248,0.1)]" },
    { name: "PostgreSQL", count: 2, glow: isLight ? "hover:border-blue-400 hover:shadow-xs" : "hover:border-blue-600/30 hover:shadow-[0_0_12px_rgba(29,78,216,0.1)]" },
    { name: "Linux", count: 3, glow: isLight ? "hover:border-amber-300 hover:shadow-xs" : "hover:border-amber-500/30 hover:shadow-[0_0_12px_rgba(245,158,11,0.1)]" },
    { name: "Git", count: 2, glow: isLight ? "hover:border-red-300 hover:shadow-xs" : "hover:border-red-500/30 hover:shadow-[0_0_12px_rgba(239,68,68,0.1)]" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="tags-section">
      {/* Background Glow Overlay */}
      {actualGlow && (
        <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-cyan-600/[0.015] blur-[150px] pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          标签
          <span className={`text-xs font-mono font-normal px-2 py-0.5 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            共 {tagsList.length} 个标签
          </span>
        </h1>
        <p className={`text-sm mt-2 tracking-wide ${isLight ? "text-slate-500" : "text-slate-400"}`}>按标签极速检索与筛选本站内容</p>
      </div>

      {/* Floating Pill Buttons Tag Cloud */}
      <div className={`p-8 rounded-2xl border backdrop-blur-md flex flex-wrap gap-4 items-center justify-center max-w-4xl mx-auto ${
        isLight ? "bg-[#fefdfb] border-[#e5e2db] shadow-xs" : "bg-[#0c0d14]/40 border-white/[0.04]"
      }`} id="tags-cloud-container">
        {tagsList.map((tag, index) => (
          <motion.button
            key={tag.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
            onClick={() => onSelectTag(tag.name)}
            className={`group px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
              isLight
                ? "bg-[#f8f7f4] border-[#e5e2db] hover:border-indigo-200 hover:bg-indigo-50/10 text-slate-600 hover:text-indigo-600"
                : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.12] hover:bg-white/[0.04] text-slate-300 hover:text-white"
            } ${tag.glow}`}
            id={`tag-btn-${tag.name}`}
          >
            <span>{tag.name}</span>
            {/* Post Count Pill Bubble */}
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full border transition-colors ${
              isLight
                ? "bg-[#e5e2db]/60 border-[#e5e2db]/40 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 group-hover:border-indigo-100"
                : "bg-white/[0.05] border-white/[0.02] text-slate-500 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30"
            }`}>
              {tag.count}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
