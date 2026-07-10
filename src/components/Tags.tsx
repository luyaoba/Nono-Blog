"use client";

import { motion } from "motion/react";
import type { Tag } from "../data/mockAdminData";

interface TagsProps {
  onSelectTag: (tag: string) => void;
  tags?: Tag[];
  theme?: "glow" | "dark" | "light";
  language?: "zh" | "en";
}

const tagColors = [
  { hover: "hover:border-blue-500/30", lightHover: "hover:border-blue-300", dot: "bg-blue-400" },
  { hover: "hover:border-emerald-500/30", lightHover: "hover:border-emerald-300", dot: "bg-emerald-400" },
  { hover: "hover:border-indigo-500/30", lightHover: "hover:border-indigo-300", dot: "bg-indigo-400" },
  { hover: "hover:border-sky-500/30", lightHover: "hover:border-sky-300", dot: "bg-sky-400" },
  { hover: "hover:border-pink-500/30", lightHover: "hover:border-pink-300", dot: "bg-pink-400" },
  { hover: "hover:border-amber-500/30", lightHover: "hover:border-amber-300", dot: "bg-amber-400" },
  { hover: "hover:border-cyan-500/30", lightHover: "hover:border-cyan-300", dot: "bg-cyan-400" },
  { hover: "hover:border-purple-500/30", lightHover: "hover:border-purple-300", dot: "bg-purple-400" },
  { hover: "hover:border-rose-500/30", lightHover: "hover:border-rose-300", dot: "bg-rose-400" },
  { hover: "hover:border-teal-500/30", lightHover: "hover:border-teal-300", dot: "bg-teal-400" },
];

export default function Tags({ onSelectTag, tags = [], theme = "glow", language = "zh" }: TagsProps) {
  const isLight = theme === "light";
  const isZh = language === "zh";

  // Fallback if no tags from API
  const displayTags: { name: string; count: number }[] = tags.length > 0
    ? tags.map(t => ({ name: t.name, count: t.count || 0 }))
    : [
        { name: "Cloudflare", count: 6 }, { name: "Next.js", count: 4 },
        { name: "TypeScript", count: 5 }, { name: "React", count: 4 },
        { name: "Vue", count: 3 }, { name: "Node.js", count: 3 },
        { name: "Docker", count: 2 }, { name: "Go", count: 3 },
        { name: "PostgreSQL", count: 2 }, { name: "Linux", count: 3 },
        { name: "Git", count: 2 }, { name: "Drizzle", count: 2 },
      ];

  return (
    <div className="max-w-7xl mx-auto relative" id="tags-section">
      {/* Header */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "标签" : "Tags"}
          <span className={`text-xs font-mono font-normal px-2.5 py-0.5 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {isZh ? `共 ${displayTags.length} 个` : `${displayTags.length} tags`}
          </span>
        </h2>
        <p className={`text-sm mt-2 tracking-wide ${isLight ? "text-slate-500" : "text-slate-400"}`}>
          {isZh ? "按标签检索与筛选本站内容" : "Filter content by tags"}
        </p>
      </div>

      {/* Organized Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" id="tags-grid">
        {displayTags.map((tag, index) => {
          const color = tagColors[index % tagColors.length];
          return (
            <motion.button
              key={tag.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              onClick={() => onSelectTag(tag.name)}
              className={`group px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between gap-2 transition-all duration-200 cursor-pointer ${
                isLight
                  ? `bg-white border border-[#e5e2db] text-slate-700 hover:text-slate-900 hover:bg-slate-50 ${color.lightHover}`
                  : `bg-white/[0.02] border border-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.05] ${color.hover}`
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                <span>{tag.name}</span>
              </div>
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                isLight ? "bg-slate-100 text-slate-500" : "bg-white/[0.06] text-slate-500"
              }`}>
                {tag.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
