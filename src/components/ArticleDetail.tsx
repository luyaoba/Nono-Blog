"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Tag, Share2, Heart, Copy, Check } from "lucide-react";
import { Article } from "../data/mockAdminData";
import Giscus from "./Giscus";

interface ArticleDetailProps {
  articleId: string;
  onBack: () => void;
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  articles: Article[];
  language?: "zh" | "en";
}

export default function ArticleDetail({ articleId, onBack, glowMode = true, theme = "glow", articles, language = "zh" }: ArticleDetailProps) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";

  // Find the actual article in the reactive state database
  const targetArticle = articles.find((a) => a.id === articleId) || articles[0];

  // 获取文章点赞状态
  useEffect(() => {
    if (!targetArticle?.id) return;
    fetch(`${import.meta.env.VITE_API_URL || 'https://blog-api.187771.xyz'}/api/articles/${targetArticle.id}/likes`)
      .then(res => res.json())
      .then(data => {
        setLikes(data.likes || 0);
        setHasLiked(data.liked || false);
      })
      .catch(() => {});
  }, [targetArticle?.id]);

  const handleLike = async () => {
    if (hasLiked || likeLoading || !targetArticle?.id) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://blog-api.187771.xyz'}/api/articles/${targetArticle.id}/like`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setLikes(data.likes);
        setHasLiked(true);
      }
    } catch {}
    setLikeLoading(false);
  };

  const copyCode = () => {
    const code = `// wrangler.toml configuration file
name = "cloudflare-fullstack-blog"
main = "src/index.ts"
compatibility_date = "2024-05-20"

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "nono-blog-db"
database_id = "5a0bc01d-88ab-402a-992d-94c0b435ffaa"

[[kv_namespaces]]
binding = "CACHE"
id = "49b4009a-6bba-4e9f-889d-7df9fa435111"`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  // Generate dynamic table of contents based on actual sections or standard items
  const tocList = [
    { id: "intro", title: "1. 为什么选择 Cloudflare?" },
    { id: "deploy", title: "2. 极速 Cloudflare Pages 部署" },
    { id: "workers", title: "3. Serverless Workers 路由" },
    { id: "database", title: "4. D1 关系型数据库整合" },
    { id: "custom-domain", title: "5. 自定义域名与 SSL 锁" },
    { id: "summary", title: "6. 结语与成本复盘" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 relative" id="article-detail-section">
      {/* Back to articles */}
      <button
        onClick={onBack}
        className={`group inline-flex items-center gap-2 text-xs font-semibold tracking-wider transition-colors mb-8 cursor-pointer ${
          isLight ? "text-slate-600 hover:text-indigo-600" : "text-slate-400 hover:text-white"
        }`}
        id="detail-back-btn"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> {isZh ? "返回文章列表" : "Back to Articles"}
      </button>

      {/* Hero Banner with Lighthouse illustration matching top right block */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`w-full h-[280px] md:h-[400px] rounded-2xl overflow-hidden border backdrop-blur-md relative mb-12 ${
          isLight ? "border-[#e5e2db] bg-[#f0efeb]" : "border-white/[0.04] bg-[#0c0d14]/40"
        }`}
        id="detail-lighthouse-banner"
      >
        {/* SVG Beacon Canvas */}
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1200 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Night Sky Gradient */}
          <rect width="1200" height="500" fill="url(#detailSky)" />

          {/* Stars */}
          <g opacity="0.7">
            <circle cx="150" cy="80" r="1.2" fill="#fff" />
            <circle cx="320" cy="140" r="1" fill="#fff" />
            <circle cx="480" cy="90" r="1.5" fill="#fff" />
            <circle cx="620" cy="120" r="1" fill="#fff" />
            <circle cx="850" cy="70" r="1.8" fill="#fff" />
            <circle cx="980" cy="150" r="1" fill="#fff" />
            <circle cx="1070" cy="100" r="1.2" fill="#fff" />
            <circle cx="210" cy="180" r="1" fill="#fff" />
            <circle cx="740" cy="160" r="1.3" fill="#fff" />
          </g>

          {/* Deep Nebula glow behind lighthouse */}
          <circle cx="950" cy="220" r="250" fill="url(#detailNebula)" />

          {/* Sea / Lake Water Gradient in bottom third */}
          <rect y="380" width="1200" height="120" fill="url(#waterGradient)" />
          
          {/* Subtle horizontal waves on lake */}
          <path d="M 0 395 Q 300 392 600 395 T 1200 395" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <path d="M 0 420 Q 300 417 600 420 T 1200 420" stroke="rgba(255,255,255,0.03)" strokeWidth="1.2" />
          <path d="M 0 450 Q 300 447 600 450 T 1200 450" stroke="rgba(255,255,255,0.02)" strokeWidth="1.5" />

          {/* Far Distant Mountain Range */}
          <path d="M 0 380 L 150 290 L 320 380 Z" fill="#080a13" opacity="0.9" />
          <path d="M 280 380 L 450 270 L 650 380 Z" fill="#05070e" opacity="0.85" />
          <path d="M 580 380 L 720 310 L 900 380 Z" fill="#030407" opacity="0.7" />

          {/* Lighthouse structure (on a small cliff right side) */}
          <path d="M 880 380 L 1020 380 L 1000 350 L 900 350 Z" fill="#030406" /> {/* Rocky base */}
          
          {/* Light Beam (Sweeping white translucent cone from lighthouse lantern to the left) */}
          <polygon points="950,220 0,140 0,330" fill="url(#lighthouseBeam)" />
          
          {/* The Tower */}
          <polygon points="938,350 962,350 957,235 943,235" fill="#f1f5f9" /> {/* Tower white part */}
          <polygon points="943,235 957,235 956,225 944,225" fill="#030406" /> {/* Lantern gallery deck */}
          <rect x="946" y="210" width="8" height="15" fill="#e2e8f0" opacity="0.3" /> {/* Glass room */}
          <polygon points="943,210 957,210 950,195" fill="#030406" /> {/* Cone roof */}
          <circle cx="950" cy="217" r="4" fill="#fff" className="animate-pulse" /> {/* Bright bulb */}

          {/* Waves Reflection under Lighthouse Light */}
          <ellipse cx="400" cy="410" rx="350" ry="12" fill="url(#reflectionGlow)" />

          {/* Defs */}
          <defs>
            <linearGradient id="detailSky" x1="600" y1="0" x2="600" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#040407" />
              <stop offset="0.5" stopColor="#080914" />
              <stop offset="0.9" stopColor="#0c0e1b" />
              <stop offset="1" stopColor="#06070a" />
            </linearGradient>

            <radialGradient id="detailNebula" cx="950" cy="220" r="250" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#1e3a8a" stopOpacity="0.22" />
              <stop offset="0.5" stopColor="#312e81" stopOpacity="0.08" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="lighthouseBeam" x1="950" y1="220" x2="0" y2="235" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="0.3" stopColor="#818cf8" stopOpacity="0.12" />
              <stop offset="0.8" stopColor="#3b82f6" stopOpacity="0.02" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="waterGradient" x1="600" y1="380" x2="600" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#07080c" />
              <stop offset="0.4" stopColor="#0a0c16" />
              <stop offset="1" stopColor="#050609" />
            </linearGradient>

            <radialGradient id="reflectionGlow" cx="400" cy="410" r="350" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#818cf8" stopOpacity="0.08" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>

        {/* Floating coordinates indicator to matching top right block */}
        <div className={`absolute top-4 right-6 px-3 py-1 border rounded-md text-xs font-mono backdrop-blur-md ${
          isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/5 text-slate-400"
        }`}>
          PROJECT: CF_SVRLESS_V2
        </div>
      </motion.div>

      {/* Main Core Layout: Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left column: Article detail main content */}
        <div className="lg:col-span-3 text-left">
          {/* Header Metadata */}
          <div className={`border-b pb-6 mb-8 ${isLight ? "border-[#e5e2db]" : "border-white/[0.04]"}`}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                isLight ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-indigo-500/15 border-indigo-500/20 text-indigo-400"
              }`}>
                {targetArticle.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" /> {targetArticle.date}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5" /> {targetArticle.readTime || (isZh ? "5分钟阅读" : "5 min read")}
              </div>
            </div>

            <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight ${
              isLight ? "text-slate-800" : "text-slate-100"
            }`}>
              {targetArticle.title}
            </h1>
            <p className={`text-sm md:text-base leading-relaxed font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {targetArticle.summary}
            </p>
          </div>

          {/* Article Body Columns */}
          <div className={`prose max-w-none text-sm md:text-base leading-relaxed space-y-6 ${
            isLight ? "text-slate-600" : "text-slate-300"
          }`} id="detail-rich-content">
            <h2 id="intro" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 1. 为什么选择 Cloudflare?
            </h2>
            <p>
              在传统的 Web 架构中，全栈应用往往需要依赖专用的虚拟机、后端服务器集群以及高昂的网络专线。这不仅大幅提升了前期的运维门槛，也让中小型独立开发者在面临流量洪峰时需要时刻担心服务器瓶颈。
            </p>
            <p>
              而 <strong>Cloudflare</strong> 提供了一整套云原生、全无服务器（Serverless）的现代基础设施。它利用遍布全球的 300 多个骨干节点（Edge Network），真正实现了“代码和数据在全球边缘同时运行”。相比传统的托管环境，它具备近乎零的冷启动时间，极度轻量的打包体积，以及业内首个全免费额度。
            </p>

            <h2 id="deploy" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 2. 极速 Cloudflare Pages 部署
            </h2>
            <p>
              Cloudflare Pages 是专门为前端 SPA 以及主流 SSR 框架量身打造的静态/全栈托管平台。如果你使用的是 Vite 或 Next.js，仅需两步即可自动构建并发布：
            </p>
            <ul className={`list-disc list-inside space-y-2 pl-4 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              <li>绑定你的 GitHub 仓库</li>
              <li>在配置中选择 <code>Next.js (App Router)</code> 并指定输出路径为 <code>dist</code></li>
              <li>享受由全球 CDN 节点支撑的 50ms 以内的首包触达体验。</li>
            </ul>

            <h2 id="workers" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 3. Serverless Workers 路由与配置
            </h2>
            <p>
              当静态页面需要连接动态 API 时，Cloudflare Workers 是绝佳 of 解决方案。其本质是在 V8 隔离沙盒中运行的极轻量 JavaScript 运行时。
            </p>
            <p>
              通过配置一个简单的 <code>wrangler.toml</code> 配置文件，你可以轻松将关系型数据库 D1 以及分布式内存缓存 KV 注入到代码运行时中：
            </p>

            {/* Code Snippet Area matching the top right screenshot */}
            <div className={`relative rounded-xl border overflow-hidden my-6 ${
              isLight ? "border-[#e5e2db] bg-[#f8f7f4]" : "border-white/[0.04] bg-[#0c0d15]/80"
            }`}>
              <div className={`flex items-center justify-between px-4 py-2 border-b select-none ${
                isLight ? "border-[#e5e2db] bg-[#f0efeb]" : "border-white/[0.04] bg-[#07080c]/80"
              }`}>
                <span className={`text-xs font-mono tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>wrangler.toml</span>
                <button
                  onClick={copyCode}
                  className={`p-1 rounded border transition-colors ${
                    isLight 
                      ? "bg-[#fefdfb] border-[#e5e2db] hover:bg-[#f0efeb] text-slate-400 hover:text-slate-700" 
                      : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08] text-slate-400 hover:text-white"
                  }`}
                  title={isZh ? "复制代码" : "Copy Code"}
                  id="detail-copy-code-btn"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className={`p-4 overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <code>{`// wrangler.toml configuration file
name = "cloudflare-fullstack-blog"
main = "src/index.ts"
compatibility_date = "2024-05-20"

[vars]
ENVIRONMENT = "production"

[[d1_databases]]
binding = "DB"
database_name = "nono-blog-db"
database_id = "5a0bc01d-88ab-402a-992d-94c0b435ffaa"

[[kv_namespaces]]
binding = "CACHE"
id = "49b4009a-6bba-4e9f-889d-7df9fa435111"`}</code>
              </pre>
            </div>

            <h2 id="database" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 4. D1 关系型数据库整合
            </h2>
            <p>
              D1 是 Cloudflare 原生的、基于 SQLite 的嵌入式关系型数据库，具有极低的网络访问延迟。通过 Drizzle ORM，你可以像编写常规 SQL 语句一样对文章数据、留言信息进行实时检索。
            </p>

            <h2 id="custom-domain" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 5. 自定义域名与 SSL 锁
            </h2>
            <p>
              部署完成后，通过仪表盘只需轻轻点击一下即可完成自定义域名解析，Cloudflare 会自动为您签发高安全性的 Universal SSL 证书，并自动重定向所有非安全 HTTP 流量。
            </p>

            <h2 id="summary" className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" /> 6. 结语与成本复盘
            </h2>
            <p>
              在本篇实践中，我们将全栈应用的月度支出压缩到了惊人的 <strong>$0 元</strong>。Pages 无限制构建次数、Workers 每日 10 万次免费调用额度、D1 日均 500 万行读取，完美承载一个每日万级 PV 的个人太空美学博客系统。
            </p>
          </div>

          {/* Detail actions */}
          <div className={`flex items-center gap-4 border-t pt-6 mt-12 ${isLight ? "border-[#e5e2db]" : "border-white/[0.04]"}`}>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                hasLiked
                  ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                  : isLight
                  ? "bg-[#f8f7f4] border border-[#e5e2db] text-slate-500 hover:text-slate-800 hover:bg-[#f0efeb]"
                  : "bg-white/[0.02] border border-white/[0.04] text-slate-400 hover:text-white"
              }`}
              id="detail-like-btn"
            >
              <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{isZh ? `赞 (${likes})` : `Like (${likes})`}</span>
            </button>
            <button
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                isLight
                  ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-500 hover:text-slate-800 hover:bg-[#f0efeb]"
                  : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white"
              }`}
              id="detail-share-btn"
            >
              {shareCopied ? <Check className="w-4 h-4 text-indigo-500" /> : <Share2 className="w-4 h-4" />}
              <span>{shareCopied ? (isZh ? "链接已复制" : "Link Copied") : (isZh ? "分享" : "Share")}</span>
            </button>
          </div>

          {/* Giscus 评论区（GitHub 登录评论） */}
          <Giscus theme={theme === "light" ? "light" : "dark"} />
        </div>

        {/* Right column: Sticky Navigation TOC (目录) */}
        <div className="hidden lg:block relative col-span-1">
          <div className={`sticky top-24 p-6 rounded-2xl border backdrop-blur-md ${
            isLight
              ? "bg-[#fefdfb] border-[#e5e2db]/85 shadow-sm"
              : "bg-[#0c0d14]/60 border-white/[0.06]"
          }`}>
            <h3 className={`text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b font-mono ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              {isZh ? "目录" : "Table of Contents"}
            </h3>
            <div className={`flex flex-col gap-3.5 text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`} id="detail-toc-links">
              {tocList.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`hover:translate-x-1 transition-all leading-relaxed ${
                    isLight ? "hover:text-indigo-600" : "hover:text-white"
                  }`}
                >
                  {section.title}
                </a>
              ))}
            </div>

            {/* Author card footer inside TOC column */}
            <div className={`mt-8 pt-6 border-t flex items-center gap-3 ${isLight ? "border-[#e5e2db]" : "border-white/[0.04]"}`}>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-[11px] font-bold ${
                isLight ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
              }`}>
                N
              </div>
              <div>
                <div className={`text-xs font-bold ${isLight ? "text-slate-700" : "text-slate-200"}`}>Written by Nono</div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Edge Engineer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
