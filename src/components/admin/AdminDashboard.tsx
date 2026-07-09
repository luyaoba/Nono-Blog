"use client";

import { motion } from "motion/react";
import { 
  BookOpen, 
  Briefcase, 
  Tags, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Eye, 
  MessageSquare,
  Zap,
  Clock
} from "lucide-react";
import { Article, Tag, Comment } from "../../data/mockAdminData";
import { translations } from "../../data/translations";

interface AdminDashboardProps {
  articles: Article[];
  tags: Tag[];
  comments: Comment[];
  onWritePost: () => void;
  onViewComments: () => void;
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminDashboard({
  articles,
  tags,
  comments,
  onWritePost,
  onViewComments,
  language = "zh",
  theme = "dark",
}: AdminDashboardProps) {
  const isZh = language === "zh";
  const isLight = theme === "light";
  // Stat counts
  const totalPosts = articles.length;
  const totalTags = tags.length;
  const totalViews = articles.reduce((sum, a) => sum + a.views, 0);
  const monthlyViews = totalViews + 3480; // Simulated constant offset for current month

  // Chart Coordinates & Data for SVG Line Drawing (30-day visit simulation)
  const chartPoints = [
    { label: "06/10", val: 120 },
    { label: "06/15", val: 320 },
    { label: "06/20", val: 240 },
    { label: "06/25", val: 480 },
    { label: "06/30", val: 610 },
    { label: "07/05", val: 890 },
    { label: "07/08", val: 1100 },
  ];

  // Map simulated values to SVG ViewBox coordinates (width: 600, height: 180)
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...chartPoints.map((p) => p.val));
  const minVal = 0;

  // Generate SVG Points String
  const points = chartPoints.map((p, index) => {
    const x = paddingLeft + (index / (chartPoints.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((p.val - minVal) / (maxVal - minVal)) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  // Create SVG Area Path points string (closes path to bottom for glowing fill gradient)
  const firstX = paddingLeft;
  const firstY = paddingTop + chartHeight;
  const lastX = paddingLeft + chartWidth;
  const lastY = paddingTop + chartHeight;
  const areaPoints = `${firstX},${firstY} ${points} ${lastX},${lastY}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300" id="admin-dashboard-container">
      {/* Dynamic Greetings */}
      <div>
        <h1 className={`text-3xl font-bold tracking-tight ${isLight ? "text-slate-800" : "text-white"}`}>{isZh ? "你好, Nono" : "Hello, Nono"}</h1>
        <p className={`text-base mt-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "这是今天站点的核心状态。所有文章浏览与评论互动已实时汇聚。" : "Here's today's site overview. All views and comments are updated in real time."}</p>
      </div>

      {/* 3 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="dashboard-stats-grid">
        {/* Article Count */}
        <div className={`bg-[#0c0e16]/80 border p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300 ${isLight ? "bg-[#fefdfb] border-[#e5e2db] shadow-sm" : "border-white/[0.1]"}`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/[0.015] blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono tracking-wider uppercase ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章创作总数" : "Total Articles"}</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isLight ? "text-slate-800" : "text-white"}`}>{totalPosts}</span>
            <span className="text-sm font-mono text-emerald-400 flex items-center gap-1">
              +1 {isZh ? "篇本周" : "this week"} <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Tag Count */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/80 border border-white/[0.1] hover:border-purple-500/20"}`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/[0.015] blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono tracking-wider uppercase ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签管理维度" : "Active Tags"}</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isLight ? "text-slate-800" : "text-white"}`}>{totalTags}</span>
            <span className="text-sm font-mono text-slate-500">{isZh ? "多维过滤" : "Multi-filter"}</span>
          </div>
        </div>

        {/* Monthly Views */}
        <div className={`p-5 rounded-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/80 border border-white/[0.1] hover:border-emerald-500/20"}`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/[0.015] blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className={`text-sm font-mono tracking-wider uppercase ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "本月访问人次" : "Monthly Visits"}</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isLight ? "text-slate-800" : "text-white"}`}>{monthlyViews}</span>
            <span className="text-sm font-mono text-emerald-400 flex items-center gap-1">
              +18.4% {isZh ? "环比" : "vs last month"} <TrendingUp className="w-3.5 h-3.5 animate-bounce" />
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-and-actions">
        {/* Trend line chart (2/3 width) */}
        <div className={`lg:col-span-2 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`} id="dashboard-trend-chart-box">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-base font-semibold tracking-wider ${isLight ? "text-slate-800" : "text-white"}`}>{isZh ? "流量走势分析（最近30天）" : "Traffic Trends (Last 30 Days)"}</h3>
              <p className={`text-sm mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{isZh ? "边缘测点每日统计数据 (PV统计)" : "Daily edge metrics (PV)"}</p>
            </div>
            <span className="text-sm font-mono text-indigo-400 bg-indigo-500/5 px-2.5 py-1 border border-indigo-500/10 rounded-md">
              {isZh ? "指标：访问量" : "Metric: Visits"}
            </span>
          </div>

          {/* SVG Animated line chart */}
          <div className={`w-full h-48 rounded-xl flex items-center justify-center p-2 relative overflow-hidden ${isLight ? "bg-[#f8f7f4] border border-[#e5e2db]" : "bg-[#040508]/40 border border-white/[0.06]"}`}>
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" id="stats-svg-chart">
              <defs>
                {/* Gradient Line */}
                <linearGradient id="lineGlowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>

                {/* Fill Area Gradient */}
                <linearGradient id="areaFillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid guide lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = paddingTop + ratio * chartHeight;
                return (
                  <line
                    key={index}
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                );
              })}

              {/* Glowing Fill Area */}
              <polygon points={areaPoints} fill="url(#areaFillGrad)" />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="url(#lineGlowGrad)"
                strokeWidth="2.5"
                points={points}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glowing Interactive Data Nodes */}
              {chartPoints.map((p, index) => {
                const x = paddingLeft + (index / (chartPoints.length - 1)) * chartWidth;
                const y = paddingTop + chartHeight - ((p.val - minVal) / (maxVal - minVal)) * chartHeight;
                return (
                  <g key={index} className="group/node cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r="7"
                      fill="#818cf8"
                      className="opacity-0 group-hover/node:opacity-30 transition-all duration-300"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="4.5"
                      fill="#0c0e16"
                      stroke="#818cf8"
                      strokeWidth="2"
                    />
                    {/* Node value tooltips displayed directly */}
                    <text
                      x={x}
                      y={y - 10}
                      fill="#fff"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 font-semibold"
                    >
                      {p.val}
                    </text>
                  </g>
                );
              })}

              {/* X-axis indicators */}
              {chartPoints.map((p, index) => {
                const x = paddingLeft + (index / (chartPoints.length - 1)) * chartWidth;
                return (
                  <text
                    key={index}
                    x={x}
                    y={svgHeight - 10}
                    fill="rgba(148,163,184,0.5)"
                    fontSize="11"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {p.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Quick Operations panel (1/3 width) */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.1]"}`} id="dashboard-quick-actions">
          <div>
            <h3 className={`text-base font-semibold tracking-wider mb-1 ${isLight ? "text-slate-800" : "text-white"}`}>{isZh ? "快捷工具箱" : "Quick Toolbox"}</h3>
            <p className={`text-sm ${isLight ? "text-slate-500" : "text-slate-400"}`}>{isZh ? "一键发布与管理，即刻更新全站缓存。" : "Publish and manage with one click."}</p>
          </div>

          <div className="space-y-3 mt-6">
            {/* Quick Article trigger */}
            <button
              onClick={onWritePost}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all cursor-pointer group"
              id="quick-action-write-post"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-indigo-400 group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-semibold tracking-wide">{isZh ? "撰写新文章" : "New Article (Markdown)"}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5" />
            </button>

            {/* Quick comment approval */}
            <button
              onClick={onViewComments}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer group ${isLight ? "bg-[#f8f7f4] border border-[#e5e2db] text-slate-600 hover:bg-[#f0efeb]" : "bg-white/[0.02] border border-white/[0.08] text-slate-300 hover:bg-white/[0.05] hover:text-white"}`}
              id="quick-action-manage-comments"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold tracking-wide">{isZh ? "最新读者留言" : "Latest Comments"}</span>
              </div>
              <span className="text-sm font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {comments.length} {isZh ? "条留言" : "comments"}
              </span>
            </button>
          </div>

          <div className={`mt-6 p-3 rounded-xl flex items-center gap-2.5 ${isLight ? "bg-[#f8f7f4] border border-[#e5e2db]" : "bg-slate-900/30 border border-white/[0.06]"}`}>
            <Zap className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
            <span className="text-sm text-slate-500 font-mono tracking-wider leading-snug">
              {isZh ? "系统延迟：0.1ms // 边缘缓存已刷新" : "Latency: 0.1ms // Edge cache refreshed"}
            </span>
          </div>
        </div>
      </div>

      {/* Latest Submissions grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-recent-feeds">
        {/* Recent 5 Articles */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`} id="dashboard-recent-posts">
          <div className={`flex items-center justify-between pb-4 mb-4 ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.08]"}`}>
            <h3 className={`text-base font-semibold tracking-wider flex items-center gap-2 ${isLight ? "text-slate-800" : "text-white"}`}>
              <Clock className="w-4.5 h-4.5 text-indigo-400" />
              <span>{isZh ? "最新发布的文章" : "Latest Articles"}</span>
            </h3>
            <span className="text-sm text-indigo-400 font-mono">{isZh ? "最新发布" : "Newest"}</span>
          </div>

          <div className="space-y-3">
            {articles.slice(0, 5).map((art) => (
              <div 
                key={art.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isLight ? "bg-[#f8f7f4] border-[#e5e2db]" : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.06]"}`}
              >
                <div className="overflow-hidden pr-4">
                  <h4 className={`text-sm font-semibold truncate ${isLight ? "text-slate-800" : "text-slate-200"}`}>{art.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2.5 py-0.5 rounded-md font-mono flex items-center gap-1.5 ${
                      isLight ? "bg-[#f0efeb] text-slate-600" : "bg-white/5 text-slate-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        art.category === "前端开发" ? "bg-sky-500" :
                        art.category === "后端开发" ? "bg-emerald-500" :
                        art.category === "Cloudflare" ? "bg-orange-500" :
                        art.category === "设计美学" ? "bg-fuchsia-500" :
                        art.category === "工具推荐" ? "bg-amber-500" :
                        "bg-indigo-500"
                      }`} />
                      {art.category}
                    </span>
                    <span className={`text-sm font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>{art.date}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-4 text-sm font-mono shrink-0 ${isLight ? "text-slate-600" : "text-slate-500"}`}>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                  <span className={`px-2 py-0.5 rounded text-sm font-semibold tracking-wider uppercase ${
                    art.status === "published" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}>
                    {art.status === "published" ? (isZh ? "已发布" : "Published") : (isZh ? "草稿" : "Draft")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent 5 Comments */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`} id="dashboard-recent-comments">
          <div className={`flex items-center justify-between pb-4 mb-4 ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.08]"}`}>
            <h3 className={`text-base font-semibold tracking-wider flex items-center gap-2 ${isLight ? "text-slate-800" : "text-white"}`}>
              <MessageSquare className="w-4.5 h-4.5 text-indigo-400" />
              <span>{isZh ? "最新评论留言" : "Latest Comments"}</span>
            </h3>
            <span className="text-sm text-indigo-400 font-mono">{isZh ? "最新留言" : "Newest"}</span>
          </div>

          <div className="space-y-3">
            {comments.slice(0, 5).map((comm) => (
              <div 
                key={comm.id}
                className={`p-3 rounded-xl border transition-colors ${isLight ? "bg-[#f8f7f4] border-[#e5e2db]" : "bg-white/[0.01] hover:bg-white/[0.03] border-white/[0.06]"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={comm.avatar} alt="avatar" className="w-5 h-5 rounded-full bg-slate-800" />
                    <span className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-200"}`}>{comm.author}</span>
                  </div>
                  <span className={`text-sm font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>{comm.date}</span>
                </div>
                <p className={`text-sm mt-2 truncate ${isLight ? "text-slate-600" : "text-slate-400"}`}>{comm.content}</p>
                <div className="text-sm text-indigo-400 font-mono mt-1 truncate">
                  {isZh ? "源自" : "From"}: 《{comm.articleTitle}》
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
