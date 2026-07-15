"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ChevronLeft, 
  Eye, 
  Send, 
  Save, 
  RefreshCw,
  FolderOpen,
  Image as ImageIcon,
  Upload,
  EyeOff,
  Wand2,
  ListTree
} from "lucide-react";
import { Article, Category, Tag } from "../../data/mockAdminData";
import { translations } from "../../data/translations";
import { adminApi } from "../../api";
import MarkdownRenderer from "../MarkdownRenderer";
import ConfirmDialog from "./ConfirmDialog";
import LoadingOverlay from "./LoadingOverlay";

// Custom polished dropdown selector to replace ugly native <select> elements
function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder,
  isLight
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: string[]; 
  placeholder?: string; 
  isLight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  // Compute menu position relative to viewport so it can be rendered at body level
  // This avoids being clipped by any overflow-hidden ancestor.
  useEffect(() => {
    if (!open || !btnRef.current) {
      setMenuPos(null);
      return;
    }
    const updatePos = () => {
      if (!btnRef.current) return;
      const r = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 160) });
    };
    updatePos();
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open]);

  const menu = open && menuPos ? (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
      <div
        className={`fixed z-[9999] rounded-xl shadow-2xl border backdrop-blur-3xl focus:outline-none overflow-hidden ${
          isLight ? "bg-white border-[#d6d3cc] shadow-lg" : "bg-[#1a1d2e] border-indigo-500/30 shadow-[0_10px_40px_rgba(99,102,241,0.25)]"
        }`}
        style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width, maxHeight: '240px' }}
      >
        <div className="py-1 max-h-[240px] overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-600 hover:text-white ${
                isLight ? "text-slate-800 font-medium" : "text-slate-100"
              } ${
                value === opt ? "bg-indigo-500/20 text-indigo-400 font-bold" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </>
  ) : null;

  return (
    <div className="relative inline-block text-left w-full min-w-[140px]">
      <div>
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen(!open)}
          className={`inline-flex justify-between items-center w-full rounded-xl border px-4 py-2.5 text-sm transition-all ${
            isLight 
              ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700 hover:bg-[#f0efeb]" 
              : "border-white/[0.06] bg-[#05060a]/90 text-slate-200 hover:bg-white/[0.02]"
          }`}
        >
          <span className="truncate">{value || placeholder}</span>
          <svg className={`-mr-1 ml-2 h-4 w-4 shrink-0 ${isLight ? "text-slate-500" : "text-slate-400"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Render menu via portal so it's never clipped by overflow ancestors */}
      {menu && typeof document !== 'undefined' ? createPortal(menu, document.body) : menu}
    </div>
  );
}

// Multi-select tag picker with dropdown
function TagSelector({ 
  selected, 
  onChange, 
  availableTags, 
  isLight 
}: { 
  selected: string[]; 
  onChange: (tags: string[]) => void; 
  availableTags: Tag[]; 
  isLight?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const allTagNames = availableTags.map(t => t.name);
  const filtered = allTagNames.filter(n => 
    !selected.includes(n) && n.toLowerCase().includes(inputVal.toLowerCase())
  );

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setInputVal("");
  };

  return (
    <div className="relative">
      {/* Selected tags display */}
      <div 
        className={`w-full border rounded-xl px-3 py-2 flex flex-wrap gap-1.5 min-h-[42px] cursor-text ${
          isLight ? "bg-[#f8f7f4] border-[#e5e2db]" : "bg-black/40 border-white/[0.06]"
        }`}
        onClick={() => setOpen(true)}
      >
        {selected.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            {tag}
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange(selected.filter(t => t !== tag)); }} className="hover:text-rose-400 transition-colors cursor-pointer">×</button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={e => { setInputVal(e.target.value); setOpen(true); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(inputVal); } }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={selected.length === 0 ? (isLight ? "选择或输入新标签..." : "Select or type new tag...") : ""}
          className={`flex-grow min-w-[80px] bg-transparent outline-none text-sm border-none p-0 ${
            isLight ? "text-slate-800 placeholder-slate-400" : "text-slate-200 placeholder-slate-500"
          }`}
        />
      </div>
      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className={`absolute left-0 right-0 top-full mt-1 rounded-xl border shadow-2xl overflow-hidden z-50 max-h-40 overflow-y-auto ${
          isLight ? "bg-[#fefdfb] border-[#e5e2db]" : "bg-[#0e1017] border-white/[0.08]"
        }`}>
          {filtered.map(name => (
            <button
              key={name}
              type="button"
              onClick={() => addTag(name)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-indigo-600 hover:text-white ${
                isLight ? "text-slate-700" : "text-slate-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface AdminPostsProps {
  articles: Article[];
  onUpdateArticles: (updated: Article[]) => void;
  categories?: Category[];
  tags?: Tag[];
  authToken?: string | null;
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminPosts({ articles, onUpdateArticles, categories = [], tags = [], authToken, language = "zh", theme = "dark" }: AdminPostsProps) {
  const isZh = language === "zh";
  const t = translations[language];
  const isLight = theme === "light";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(() => isZh ? "全部" : "All");
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Partial<Article> | null>(null);
  const [editMarkdown, setEditMarkdown] = useState("");
  
  // Preview state
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Map category titles dynamically
  const categoriesList = categories.length > 0
    ? [(isZh ? "\u5168\u90e8" : "All"), ...Array.from(new Set(categories.map(c => c.colorName).filter(n => n && n.trim() !== ""))).filter(c => c !== "\u5168\u90e8")]
    : [(isZh ? "\u5168\u90e8" : "All"), "\u524d\u7aef\u5f00\u53d1", "\u540e\u7aef\u5f00\u53d1", "Cloudflare", "\u8bbe\u8ba1\u7f8e\u5b66", "\u5de5\u5177\u63a8\u8350"];

  const editorCategories = categoriesList.filter(c => c !== "\u5168\u90e8" && c !== "All");

  // Filter list
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === categoriesList[0] || art.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Start edit
  const handleEdit = (art: Article) => {
    setActiveArticle({ ...art });
    setEditMarkdown(art.content || (isZh ? `# ${art.title}\n\n写点什么...` : `# ${art.title}\n\nWrite something...`));
    setIsEditing(true);
  };

  // Start create
  const handleCreateNew = () => {
    const newArt: Partial<Article> = {
      id: "art-" + Date.now(),
      title: "",
      summary: "",
      category: editorCategories[0] || "前端开发",
      tags: ["React"],
      readTime: isZh ? "5分钟阅读" : "5 min read",
      views: 0,
      comments: 0,
      gradient: "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
      thumbnailType: "starfield",
      status: "draft",
      coverImage: "",
    };
    setActiveArticle(newArt);
    setEditMarkdown(isZh ? "# 新文章标题\n\n开始编写精彩内容..." : "# New Article\n\nStart writing...");
    setIsEditing(true);
  };

  // Global loading overlay
  const [loadingText, setLoadingText] = useState<string | null>(null);

  // Markdown image upload helper (drag/paste)
  const [dragOver, setDragOver] = useState(false);
  // Scroll sync: keep left textarea and right preview scrolling together
  const leftRef = useRef<HTMLTextAreaElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const isSyncingScroll = useRef(false);
  const cursorPosRef = useRef<number>(0);

  useEffect(() => {
    if (!isEditing) return;
    let left: HTMLTextAreaElement | null = null;
    let right: HTMLDivElement | null = null;
    let onLeftScroll: (() => void) | null = null;
    let onRightScroll: (() => void) | null = null;
    let attached = false;

    const tryAttach = () => {
      if (attached) return true;
      left = leftRef.current;
      right = rightRef.current;
      if (!left || !right) return false;
      attached = true;

      onLeftScroll = () => {
        if (isSyncingScroll.current) return;
        const max = left!.scrollHeight - left!.clientHeight;
        if (max <= 0) return;
        const ratio = left!.scrollTop / max;
        const rMax = right!.scrollHeight - right!.clientHeight;
        if (rMax <= 0) return;
        isSyncingScroll.current = true;
        right!.scrollTop = ratio * rMax;
        setTimeout(() => { isSyncingScroll.current = false; }, 60);
      };
      onRightScroll = () => {
        if (isSyncingScroll.current) return;
        const max = right!.scrollHeight - right!.clientHeight;
        if (max <= 0) return;
        const ratio = right!.scrollTop / max;
        const lMax = left!.scrollHeight - left!.clientHeight;
        if (lMax <= 0) return;
        isSyncingScroll.current = true;
        left!.scrollTop = ratio * lMax;
        setTimeout(() => { isSyncingScroll.current = false; }, 60);
      };

      left.addEventListener("scroll", onLeftScroll, { passive: true });
      right.addEventListener("scroll", onRightScroll, { passive: true });
      return true;
    };

    // Poll for ref readiness (AnimatePresence delays DOM insertion)
    const poll = setInterval(() => { tryAttach(); }, 200);
    tryAttach();
    const giveUp = setTimeout(() => clearInterval(poll), 3000);

    return () => {
      clearInterval(poll);
      clearTimeout(giveUp);
      if (left && onLeftScroll) left.removeEventListener("scroll", onLeftScroll);
      if (right && onRightScroll) right.removeEventListener("scroll", onRightScroll);
    };
  }, [isEditing]);
  const uploadAndInsertImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(isZh ? '\u56fe\u7247\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7 5MB' : 'Image size must be under 5MB');
      return;
    }
    setLoadingText(isZh ? "\u4e0a\u4f20\u56fe\u7247\u4e2d..." : "Uploading image...");
    try {
      if (authToken) {
        const res = await adminApi.uploadImage(authToken, file, 'articles', activeArticle?.id);
        if (res.url) {
          const imgMd = `![${file.name}](${res.url})`;
          setEditMarkdown(prev => {
            const pos = cursorPosRef.current;
            const before = prev.slice(0, pos);
            const after = prev.slice(pos);
            const insert = (before.endsWith('\n') || before === '') ? imgMd : '\n' + imgMd;
            return before + insert + '\n' + after;
          });
        }
      }
    } catch (err) {
      console.error('\u56fe\u7247\u4e0a\u4f20\u5931\u8d25', err);
      alert(isZh ? '\u56fe\u7247\u4e0a\u4f20\u5931\u8d25\uff0c\u8bf7\u67e5\u770b\u63a7\u5236\u53f0' : 'Image upload failed');
    }
    setLoadingText(null);
  };
  // Markdown \u683c\u5f0f\u5316\uff1a\u7edf\u4e00\u6392\u7248\uff08\u6807\u9898\u7a7a\u884c\u3001\u4ee3\u7801\u5757\u95f4\u8ddd\u3001\u56fe\u7247\u95f4\u8ddd\u3001\u6e05\u7406\u591a\u4f59\u7a7a\u884c\uff09
  const formatMarkdown = () => {
    let md = editMarkdown;
    md = md.replace(/\r\n/g, '\n');
    md = md.replace(/([^\n])\n(#{1,6} )/g, '$1\n\n$2');
    md = md.replace(/(#{1,6} .+)\n([^\n#])/g, '$1\n\n$2');
    md = md.replace(/([^\n])\n(```)/g, '$1\n\n$2');
    md = md.replace(/(```)\n([^\n`])/g, '$1\n\n$2');
    md = md.replace(/([^\n])\n(!\[)/g, '$1\n\n$2');
    md = md.replace(/(\]\([^)]+\))\n([^\n!])/g, '$1\n\n$2');
    md = md.replace(/([^\n])\n(---)/g, '$1\n\n$2');
    md = md.replace(/(---)\n([^\n-])/g, '$1\n\n$2');
    md = md.replace(/\n{4,}/g, '\n\n\n');
    md = md.trimEnd() + '\n';
    setEditMarkdown(md);
  };

  // 自动生成大纲并插入文章顶部
  const generateTOC = () => {
    const lines = editMarkdown.split('\n');
    const headings: { level: number; text: string }[] = [];
    let inCodeBlock = false;
    for (const line of lines) {
      if (line.trim().startsWith('```')) { inCodeBlock = !inCodeBlock; continue; }
      if (inCodeBlock) continue;
      const match = line.match(/^(#{1,6})\s+(.+)/);
      if (match) {
        headings.push({ level: match[1].length, text: match[2].trim() });
      }
    }
    if (headings.length === 0) return;
    // 生成 TOC markdown
    const minLevel = Math.min(...headings.map(h => h.level));
    const tocLines = headings
      .filter(h => h.level <= minLevel + 2)
      .map(h => {
        const indent = '  '.repeat(h.level - minLevel);
        const slug = h.text.toLowerCase().replace(/[\s]+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'heading';
        return `${indent}- [${h.text}](#${slug})`;
      });
    const tocBlock = `## ${isZh ? '目录' : 'Table of Contents'}\n\n${tocLines.join('\n')}\n`;
    // 移除旧 TOC
    let content = editMarkdown;
    const tocRegex = /## (?:\u76ee\u5f55|Table of Contents)\n\n(?:[^\n]+\n)*/;
    content = content.replace(tocRegex, '');
    // 在第一个标题后插入 TOC
    const firstHeadingEnd = content.search(/\n(?=#{1,6} )/);
    if (firstHeadingEnd > 0) {
      content = content.slice(0, firstHeadingEnd + 1) + '\n' + tocBlock + '\n' + content.slice(firstHeadingEnd + 1);
    } else {
      content = tocBlock + '\n' + content;
    }
    setEditMarkdown(content.trimEnd() + '\n');
  };

  // Unpublish confirmation
  const [unpublishTarget, setUnpublishTarget] = useState<string | null>(null);

  // Publish confirmation
  const [publishTarget, setPublishTarget] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    // 乐观更新：立即移除UI
    const updated = articles.filter(a => a.id !== deleteTarget);
    onUpdateArticles(updated);
    setDeleteTarget(null);
    // 后台同步API
    if (authToken) {
      try {
        await adminApi.deleteArticle(authToken, deleteTarget);
      } catch {
        console.error('文章删除失败');
      }
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('');
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 when filter changes
  const handleSearchChange = (val: string) => { setSearchTerm(val); setCurrentPage(1); };
  const handleCategoryChange = (val: string) => { setFilterCategory(val); setCurrentPage(1); };

  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpPage('');
    }
  };

  // Save — 乐观更新：先更新UI，后台同步API
  const handleSave = async () => {
    if (!activeArticle || !activeArticle.id) return;

    // Build the updated object
    const finalArticle: Article = {
      id: activeArticle.id,
      title: activeArticle.title || (isZh ? "未命名文章" : "Untitled"),
      summary: activeArticle.summary || (isZh ? "未添加文章摘要..." : "No summary..."),
      content: editMarkdown,
      date: activeArticle.date || new Date().toISOString().split('T')[0],
      category: activeArticle.category || "前端开发",
      tags: activeArticle.tags || ["React"],
      readTime: activeArticle.readTime || "5分钟阅读",
      views: activeArticle.views || 0,
      comments: activeArticle.comments || 0,
      gradient: activeArticle.gradient || "from-blue-600/30 via-indigo-500/20 to-purple-600/30",
      thumbnailType: activeArticle.thumbnailType || "starfield",
      status: activeArticle.status || "draft",
      coverImage: activeArticle.coverImage || "",
    };

    // 立即更新UI（乐观更新）
    const exists = articles.some(a => a.id === finalArticle.id);
    let updated: Article[];
    if (exists) {
      updated = articles.map(a => a.id === finalArticle.id ? finalArticle : a);
    } else {
      updated = [finalArticle, ...articles];
    }
    onUpdateArticles(updated);
    setIsEditing(false);
    setActiveArticle(null);

    // 后台同步API
    if (authToken) {
      try {
        if (exists) {
          await adminApi.updateArticle(authToken, finalArticle.id, finalArticle);
        } else {
          await adminApi.createArticle(authToken, finalArticle);
        }
      } catch (err) {
        console.error('文章保存失败:', err);
      }
    }
  };

  return (
    <div className="space-y-6" id="admin-posts-container">
      <LoadingOverlay visible={!!loadingText} text={loadingText || undefined} />
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            key="list-view"
          >
            {/* Action Bar */}
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl backdrop-blur-md ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0a0c14]/50 border border-white/[0.08]"}`}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow max-w-2xl">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isLight ? "text-slate-500" : "text-slate-500"}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all font-sans focus:border-indigo-500/40 ${
                      isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700 placeholder-slate-400" : "bg-[#05060a]/80 border-white/[0.06] text-slate-200 placeholder-slate-500"
                    }`}
                    placeholder={isZh ? "按文章标题、关键字过滤..." : "Filter by title or keyword..."}
                  />
                </div>

                {/* Category Select custom */}
                <div className="w-full sm:w-44">
                  <CustomSelect 
                    value={filterCategory}
                    onChange={(val) => handleCategoryChange(val)}
                    options={categoriesList}
                    placeholder={isZh ? "全部分类" : "All Categories"}
                    isLight={isLight}
                  />
                </div>
              </div>

              {/* Create post button */}
              <button
                onClick={handleCreateNew}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0 shrink-0"
                id="create-new-post-btn"
              >
                <Plus className="w-4 h-4" />
                <span>{isZh ? "撰写新文章" : "New Article"}</span>
              </button>
            </div>

            {/* Articles Table Grid */}
            <div className={`rounded-2xl overflow-hidden backdrop-blur-xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/60 border border-white/[0.08]"}`}>
              <div>
                <table className="w-full table-fixed text-left border-collapse" id="articles-list-table">
                  <colgroup>
                    <col style={{ width: "34%" }} />
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "8%" }} />
                    <col style={{ width: "16%" }} />
                  </colgroup>
                  <thead>
                    <tr className={`text-sm font-mono tracking-wider uppercase ${isLight ? "border-b border-[#e5e2db] text-slate-600 bg-[#f8f7f4]" : "border-b border-white/[0.08] text-slate-400 bg-[#05060a]/40"}`}>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "文章标题" : "Title"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "分类" : "Category"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "标签" : "Tags"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "发布状态" : "Status"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "发布时间" : "Date"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate">{isZh ? "修改时间" : "Modified"}</th>
                      <th className="py-4 px-3 overflow-hidden whitespace-nowrap truncate text-right">{isZh ? "操作" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className={isLight ? "divide-y divide-[#e5e2db]" : "divide-y divide-white/[0.06]"}>
                    {paginatedArticles.length > 0 ? (
                      paginatedArticles.map((art) => (
                        <tr 
                          key={art.id} 
                          className={`hover:bg-white/[0.01] transition-all text-sm ${isLight ? "hover:bg-[#f8f7f4]" : ""}`}
                        >
                          {/* Title */}
                          <td className="py-4 px-3 overflow-hidden">
                            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                              {art.coverImage ? (
                                <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-900/50 border border-white/10 shrink-0">
                                  <img 
                                    src={art.coverImage} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ) : null}
                              <div className="truncate">
                                <div className={`font-bold tracking-wide hover:text-indigo-400 transition-colors truncate ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                                  {art.title}
                                </div>
                                <div className={`text-xs truncate mt-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                                  {art.summary}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-3 overflow-hidden">
                            <span className={`text-xs font-mono px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 ${
                              isLight ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-indigo-500/5 text-indigo-400 border border-indigo-500/10"
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
                          </td>

                          {/* Tags */}
                          <td className="py-4 px-3 overflow-hidden">
                            <div className="flex flex-wrap gap-1.5 overflow-hidden">
                              {art.tags.map(t => (
                                <span key={t} className={`text-xs font-sans px-2 py-0.5 rounded flex items-center gap-1 ${
                                  isLight ? "bg-[#f0efeb] text-slate-600" : "bg-white/5 text-slate-400"
                                }`}>
                                  <span className="w-1 h-1 rounded-full bg-indigo-400 shrink-0" />
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-3 overflow-hidden">
                            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold tracking-wider ${
                              art.status === "published" ? "text-emerald-400" : "text-amber-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${art.status === "published" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                              {art.status === "published" ? (isZh ? "已发布" : "Published") : (isZh ? "草稿" : "Draft")}
                            </span>
                          </td>

                          {/* Date */}
                          <td className={`py-4 px-6 font-mono text-sm ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                            {art.date}
                          </td>

                          {/* Modified time */}
                          <td className={`py-4 px-6 font-mono text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                            {(() => {
              const raw = (art as any).updated_at;
              if (!raw) return '\u2014';
              const d = new Date(raw);
              if (isNaN(d.getTime())) return raw;
              const p = (n: number) => String(n).padStart(2, '0');
              return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
            })()}
                          </td>

                          {/* Operations */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview - open modal */}
                              <button
                                onClick={() => setPreviewArticle(art)}
                                className="p-1.5 rounded-lg bg-slate-500/20 hover:bg-slate-500/30 text-slate-200 border border-slate-400/30 transition-all cursor-pointer hover:scale-105"
                                title={isZh ? "预览文章" : "Preview Article"}
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Unpublish/Publish toggle */}
                              <button
                                onClick={() => {
                                  if (art.status === "published") {
                                    setUnpublishTarget(art.id);
                                  } else {
                                    setPublishTarget(art.id);
                                  }
                                }}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer hover:scale-105 ${
                                  art.status === "published" 
                                    ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-400/40" 
                                    : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-400/40"
                                }`}
                                title={art.status === "published" ? (isZh ? "下线文章" : "Unpublish") : (isZh ? "发布文章" : "Publish")}
                              >
                                {art.status === "published" ? <EyeOff className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleEdit(art)}
                                className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 transition-all cursor-pointer hover:scale-105"
                                title={isZh ? "编辑文章" : "Edit Article"}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(art.id)}
                                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 transition-all cursor-pointer hover:scale-105"
                                title={isZh ? "删除文章" : "Delete Article"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className={`py-12 text-center text-sm font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                          {isZh ? "没有找到匹配的文章记录" : "No matching articles found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredArticles.length > pageSize && (
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 ${isLight ? "border-t border-[#e5e2db]" : "border-t border-white/[0.06]"}`}>
                  <span className={`text-xs font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                    {isZh
                      ? `共 ${filteredArticles.length} 篇，第 ${currentPage}/${totalPages} 页`
                      : `${filteredArticles.length} articles, page ${currentPage}/${totalPages}`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-600 hover:bg-[#f0efeb]" : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"}`}
                    >
                      {isZh ? "上一页" : "Prev"}
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                        .map((p, idx, arr) => {
                          const prev = arr[idx - 1];
                          const showEllipsis = prev !== undefined && p - prev > 1;
                          return (
                            <span key={p} className="flex items-center">
                              {showEllipsis && <span className="px-1 text-slate-600">…</span>}
                              <button
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                                  p === currentPage
                                    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/25"
                                    : isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-600 hover:bg-[#f0efeb]" : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"
                                }`}
                              >
                                {p}
                              </button>
                            </span>
                          );
                        })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-600 hover:bg-[#f0efeb]" : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"}`}
                    >
                      {isZh ? "下一页" : "Next"}
                    </button>
                    <div className="flex items-center gap-1.5 ml-2">
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={jumpPage}
                        onChange={e => setJumpPage(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleJumpPage()}
                        placeholder={isZh ? "页码" : "Page"}
                        className={`w-16 px-2 py-1.5 rounded-lg text-xs font-mono border outline-none text-center ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-white/[0.02] border-white/[0.06] text-slate-300"}`}
                      />
                      <button
                        onClick={handleJumpPage}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-600 hover:bg-[#f0efeb]" : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.04]"}`}
                      >
                        {isZh ? "跳转" : "Go"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
            key="editor-view"
          >
            {/* Editor Headers / Actions */}
            <div className={`flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl backdrop-blur-md ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0a0c14]/50 border border-white/[0.08]"}`}>
              <button
                onClick={() => setIsEditing(false)}
                className={`flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer ${isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-white"}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isZh ? "返回列表" : "Back to List"}</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Draft / Published Custom Selection */}
                <div className="w-36">
                  <CustomSelect 
                    value={activeArticle?.status === "published" ? (isZh ? "发布上线" : "Published") : (isZh ? "存为草稿" : "Draft")}
                    onChange={(val) => {
                      setActiveArticle({ 
                        ...activeArticle, 
                        status: val === (isZh ? "发布上线" : "Published") ? "published" : "draft" 
                      });
                    }}
                    options={isZh ? ["存为草稿", "发布上线"] : ["Draft", "Published"]}
                    isLight={isLight}
                  />
                </div>

                {/* Save action */}
                <button
                  onClick={handleSave}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0 shrink-0"
                  id="editor-save-btn"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isZh ? "保存并应用" : "Save & Apply"}</span>
                </button>
              </div>
            </div>

            {/* Fields input blocks */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/40 border border-white/[0.08]"}`}>
              {/* Title input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章标题" : "Article Title"}</label>
                <input
                  type="text"
                  value={activeArticle?.title || ""}
                  onChange={(e) => setActiveArticle({ ...activeArticle, title: e.target.value })}
                  placeholder={isZh ? "输入文章标题..." : "Enter article title..."}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans focus:border-indigo-500/40 ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.06] text-slate-100"
                  }`}
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "主分类" : "Category"}</label>
                <CustomSelect 
                  value={activeArticle?.category || "前端开发"}
                  onChange={(val) => setActiveArticle({ ...activeArticle, category: val })}
                  options={editorCategories}
                  placeholder="主分类"
                  isLight={isLight}
                />
              </div>

              {/* Cover Image Input */}
              <div className="space-y-1.5 md:col-span-3">
                <label className={`text-sm font-semibold flex items-center gap-1.5 pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> {isZh ? "文章列表展示配图" : "Cover Image"}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={activeArticle?.coverImage || ""}
                    onChange={(e) => setActiveArticle({ ...activeArticle, coverImage: e.target.value })}
                    placeholder={isZh ? "输入配图 URL 或点击右侧上传本地图片" : "Enter image URL or upload..."}
                    className={`flex-grow border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 ${
                      isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.06] text-slate-100"
                    }`}
                  />
                  
                  {/* Direct File Upload button */}
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-file-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert(isZh ? '图片大小不能超过 5MB' : 'Image size must be under 5MB');
                          return;
                        }
                        if (authToken) {
                          setLoadingText(isZh ? "上传图片中..." : "Uploading...");
                          try {
                            const res = await adminApi.uploadImage(authToken, file, 'covers', activeArticle?.id);
                            if (res.url) {
                              setActiveArticle({ ...activeArticle, coverImage: res.url });
                              setLoadingText(null);
                              return;
                            }
                          } catch {}
                          setLoadingText(null);
                        }
                        // 回退：本地预览
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setActiveArticle({
                            ...activeArticle,
                            coverImage: reader.result as string
                          });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <label
                      htmlFor="cover-file-upload"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer text-sm font-semibold h-full justify-center"
                    >
                      <Upload className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>{isZh ? "直接上传图片" : "Upload Image"}</span>
                    </label>
                  </div>

                  {activeArticle?.coverImage && (
                    <div className="relative shrink-0 w-10 h-10 group rounded-xl overflow-hidden border border-white/10 bg-[#0f111a]">
                      <img
                        src={activeArticle.coverImage}
                        alt="预览"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setActiveArticle({ ...activeArticle, coverImage: "" })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 text-xs transition-opacity cursor-pointer font-bold"
                      >
                        {isZh ? "清除" : "Clear"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary Input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "内容摘要" : "Summary"}</label>
                <input
                  type="text"
                  value={activeArticle?.summary || ""}
                  onChange={(e) => setActiveArticle({ ...activeArticle, summary: e.target.value })}
                  placeholder={isZh ? "精简输入几句摘要说明..." : "Brief summary..."}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans focus:border-indigo-500/40 ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.06] text-slate-200"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "技术栈标签" : "Tags"}</label>
                <TagSelector
                  selected={activeArticle?.tags || []}
                  onChange={(newTags) => setActiveArticle({ ...activeArticle, tags: newTags })}
                  availableTags={tags}
                  isLight={isLight}
                />
              </div>
            </div>

            {/* Markdown Dual-Column Pane Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]" id="markdown-split-panel">
              {/* Left Column: Markdown Input Source code */}
              <div className={`flex flex-col rounded-2xl overflow-hidden ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#07080e]/90 border border-white/[0.08]"}`}>
                <div className={`px-4 py-2.5 text-xs font-mono text-slate-400 flex items-center justify-between ${isLight ? "bg-[#f8f7f4] border-b border-[#e5e2db]" : "bg-white/[0.02] border-b border-white/[0.08]"}`}>
                  <span>{isZh ? "源码编辑器" : "Source Editor"}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={formatMarkdown}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        isLight ? "hover:bg-indigo-50 text-slate-500 hover:text-indigo-600" : "hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-300"
                      }`}
                      title={isZh ? "美化格式" : "Format"}
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>{isZh ? "格式化" : "Format"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={generateTOC}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                        isLight ? "hover:bg-indigo-50 text-slate-500 hover:text-indigo-600" : "hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-300"
                      }`}
                      title={isZh ? "生成大纲" : "Generate TOC"}
                    >
                      <ListTree className="w-3.5 h-3.5" />
                      <span>{isZh ? "大纲" : "TOC"}</span>
                    </button>
                    <span className={isLight ? "text-slate-300" : "text-slate-600"}>|</span>
                    <span>UTF-8</span>
                  </div>
                </div>
                <textarea
                  ref={leftRef}
                  value={editMarkdown}
                  onChange={(e) => { setEditMarkdown(e.target.value); cursorPosRef.current = e.target.selectionStart; }}
                  onSelect={(e) => { cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart; }}
                  onPaste={(e) => {
                    const items = e.clipboardData?.items;
                    if (!items) return;
                    for (const item of items) {
                      if (item.type.startsWith('image/')) {
                        e.preventDefault();
                        const file = item.getAsFile();
                        if (!file) return;
                        if (!authToken) {
                          console.warn('[paste] authToken 为空，请先登录');
                          alert(isZh ? '请先登录后台再粘贴图片' : 'Please log in first');
                          return;
                        }
                        uploadAndInsertImage(file).catch((err) => {
                          console.error('[paste] upload failed:', err);
                          setLoadingText(null);
                          alert(isZh ? '图片上传失败，请查看控制台' : 'Image upload failed');
                        });
                      }
                    }
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const files = e.dataTransfer?.files;
                    if (files) Array.from(files).forEach(uploadAndInsertImage);
                  }}
                  className={`w-full flex-grow p-4 bg-transparent outline-none font-mono text-sm resize-none overflow-y-auto leading-relaxed border-none ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  } ${dragOver ? "ring-2 ring-indigo-500/50 ring-inset" : ""}`}
                  placeholder="# 一级标题\n\n写下你的内容... 可拖拽或粘贴图片"
                />
              </div>

              {/* Right Column: Real-time Live Preview */}
              <div className={`flex flex-col rounded-2xl overflow-hidden ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0a0b12]/60 border border-white/[0.08]"}`}>
                <div className={`px-4 py-2.5 text-xs font-mono text-indigo-400 flex items-center justify-between ${isLight ? "bg-indigo-50/50 border-b border-[#e5e2db]" : "bg-indigo-500/5 border-b border-white/[0.08]"}`}>
                  <span>{isZh ? "实时渲染预览" : "Live Preview"}</span>
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" />
                    <span>{isZh ? "预览中" : "Previewing"}</span>
                  </div>
                </div>

                {/* Real Markdown Renderer */}
                <div ref={rightRef} className="w-full flex-grow p-5 overflow-y-auto">
                  <MarkdownRenderer content={editMarkdown} theme={isLight ? "light" : "dark"} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview Modal */}
      <AnimatePresence>
        {previewArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewArticle(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-4xl max-h-[90vh] rounded-2xl border overflow-hidden shadow-2xl ${
                isLight ? "bg-[#fefdfb] border-[#e5e2db]" : "bg-[#0c0d14] border-white/[0.06]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-md ${
                isLight ? "bg-[#f8f7f4]/90 border-[#e5e2db]" : "bg-[#0c0d14]/90 border-white/[0.06]"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{previewArticle.title}</h2>
                    <p className={`text-xs mt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>{previewArticle.summary}</p>
                  </div>
                  <button
                    onClick={() => setPreviewArticle(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      isLight ? "hover:bg-[#e5e2db] text-slate-600" : "hover:bg-white/[0.06] text-slate-400"
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <MarkdownRenderer content={previewArticle.content || ""} theme={isLight ? "light" : "dark"} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <ConfirmDialog
        open={!!deleteTarget}
        title={isZh ? "确认删除文章" : "Confirm Delete"}
        message={isZh ? "确定要删除这篇文章吗？此操作不可撤销。" : "Are you sure you want to delete this article? This action cannot be undone."}
        confirmLabel={isZh ? "确认删除" : "Delete"}
        cancelLabel={isZh ? "取消" : "Cancel"}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={!!unpublishTarget}
        title={isZh ? "确认下线文章" : "Confirm Unpublish"}
        message={isZh ? "下线后文章将不再对外展示，确定要继续吗？" : "This article will be hidden from the site. Continue?"}
        confirmLabel={isZh ? "确认下线" : "Unpublish"}
        cancelLabel={isZh ? "取消" : "Cancel"}
        danger
        onConfirm={async () => {
          if (unpublishTarget) {
            // 乐观更新
            const updated = articles.map(a => a.id === unpublishTarget ? { ...a, status: "draft" as const } : a);
            onUpdateArticles(updated);
            setUnpublishTarget(null);
            if (authToken) {
              try { await adminApi.updateArticle(authToken, unpublishTarget, { status: 'draft' }); } catch {}
            }
          }
        }}
        onCancel={() => setUnpublishTarget(null)}
      />
      <ConfirmDialog
        open={!!publishTarget}
        title={isZh ? "确认发布文章" : "Confirm Publish"}
        message={isZh ? "发布后文章将立即对外展示，确定要继续吗？" : "This article will be visible to the public. Continue?"}
        confirmLabel={isZh ? "确认发布" : "Publish"}
        cancelLabel={isZh ? "取消" : "Cancel"}
        onConfirm={async () => {
          if (publishTarget) {
            const updated = articles.map(a => a.id === publishTarget ? { ...a, status: "published" as const } : a);
            onUpdateArticles(updated);
            setPublishTarget(null);
            if (authToken) {
              try { await adminApi.updateArticle(authToken, publishTarget, { status: 'published' }); } catch {}
            }
          }
        }}
        onCancel={() => setPublishTarget(null)}
      />
    </div>
  );
}
