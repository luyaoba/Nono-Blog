"use client";

import { useState } from "react";
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
  Upload
} from "lucide-react";
import { Article, Category } from "../../data/mockAdminData";
import { translations } from "../../data/translations";

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
  return (
    <div className="relative inline-block text-left w-full min-w-[140px]" style={{ zIndex: open ? 50 : 10 }}>
      <div>
        <button
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
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`origin-top-right absolute right-0 mt-1.5 w-full rounded-xl shadow-2xl border backdrop-blur-3xl focus:outline-none z-50 overflow-hidden animate-in fade-in slide-in-from-top-1.5 duration-200 ${
            isLight ? "bg-[#fefdfb] border-[#e5e2db]" : "bg-[#0e1017] border-white/[0.08]"
          }`}>
            <div className="py-1 max-h-64 overflow-y-auto scrollbar-thin">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-indigo-600 hover:text-white ${
                    isLight ? "text-slate-700" : "text-slate-200"
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
      )}
    </div>
  );
}

interface AdminPostsProps {
  articles: Article[];
  onUpdateArticles: (updated: Article[]) => void;
  categories?: Category[];
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminPosts({ articles, onUpdateArticles, categories = [], language = "zh", theme = "dark" }: AdminPostsProps) {
  const isZh = language === "zh";
  const t = translations[language];
  const isLight = theme === "light";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(() => isZh ? "全部" : "All");
  
  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [activeArticle, setActiveArticle] = useState<Partial<Article> | null>(null);
  const [editMarkdown, setEditMarkdown] = useState("");

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

  // Delete
  const handleDelete = (id: string) => {
    if (confirm(isZh ? "确定要删除这篇文章吗？" : "Are you sure you want to delete this article?")) {
      const updated = articles.filter(a => a.id !== id);
      onUpdateArticles(updated);
    }
  };

  // Save
  const handleSave = () => {
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
  };

  return (
    <div className="space-y-6" id="admin-posts-container">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    onChange={(val) => setFilterCategory(val)}
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
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" id="articles-list-table">
                  <thead>
                    <tr className={`text-sm font-mono tracking-wider uppercase ${isLight ? "border-b border-[#e5e2db] text-slate-600 bg-[#f8f7f4]" : "border-b border-white/[0.08] text-slate-400 bg-[#05060a]/40"}`}>
                      <th className="py-4 px-6">{isZh ? "文章标题" : "Title"}</th>
                      <th className="py-4 px-6">{isZh ? "分类" : "Category"}</th>
                      <th className="py-4 px-6">{isZh ? "标签" : "Tags"}</th>
                      <th className="py-4 px-6">{isZh ? "发布状态" : "Status"}</th>
                      <th className="py-4 px-6">{isZh ? "发布时间" : "Date"}</th>
                      <th className="py-4 px-6 text-right">{isZh ? "操作" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className={isLight ? "divide-y divide-[#e5e2db]" : "divide-y divide-white/[0.06]"}>
                    {filteredArticles.length > 0 ? (
                      filteredArticles.map((art) => (
                        <tr 
                          key={art.id} 
                          className={`hover:bg-white/[0.01] transition-all text-sm ${isLight ? "hover:bg-[#f8f7f4]" : ""}`}
                        >
                          {/* Title */}
                          <td className="py-4 px-6">
                            <div className="max-w-xs md:max-w-md flex items-center gap-3">
                              {art.coverImage && (
                                <img 
                                  src={art.coverImage} 
                                  alt="" 
                                  className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-white/10 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
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
                          <td className="py-4 px-6">
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
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1.5 max-w-[150px]">
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
                          <td className="py-4 px-6">
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

                          {/* Operations */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {/* Quick Visibility Toggle */}
                              <button
                                onClick={() => {
                                  const updated = articles.map(a => a.id === art.id ? { ...a, status: (a.status === "published" ? "draft" : "published") as "published" | "draft" } : a);
                                  onUpdateArticles(updated);
                                }}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  art.status === "published" 
                                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20" 
                                    : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20"
                                }`}
                                title={art.status === "published" ? (isZh ? "一键下线" : "Unpublish") : (isZh ? "一键上线" : "Publish")}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleEdit(art)}
                                className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
                                title={isZh ? "编辑文章" : "Edit Article"}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(art.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                                title={isZh ? "删除文章" : "Delete Article"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className={`py-12 text-center text-sm font-mono ${isLight ? "text-slate-500" : "text-slate-500"}`}>
                          {isZh ? "没有找到匹配的文章记录" : "No matching articles found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setActiveArticle({
                              ...activeArticle,
                              coverImage: reader.result as string
                            });
                          };
                          reader.readAsDataURL(file);
                        }
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

              {/* Tags Input (split by space/comma) */}
              <div className="space-y-1.5">
                <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "技术栈标签（逗号隔开）" : "Tags (comma separated)"}</label>
                <input
                  type="text"
                  value={activeArticle?.tags?.join(", ") || ""}
                  onChange={(e) => {
                    const tagArr = e.target.value.split(/[,，\s]+/).filter(Boolean);
                    setActiveArticle({ ...activeArticle, tags: tagArr });
                  }}
                  placeholder="Next.js, TS, Cloudflare"
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans focus:border-indigo-500/40 ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.06] text-slate-200"
                  }`}
                />
              </div>
            </div>

            {/* Markdown Dual-Column Pane Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]" id="markdown-split-panel">
              {/* Left Column: Markdown Input Source code */}
              <div className={`flex flex-col rounded-2xl overflow-hidden ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#07080e]/90 border border-white/[0.08]"}`}>
                <div className={`px-4 py-2.5 text-xs font-mono text-slate-400 flex items-center justify-between ${isLight ? "bg-[#f8f7f4] border-b border-[#e5e2db]" : "bg-white/[0.02] border-b border-white/[0.08]"}`}>
                  <span>{isZh ? "源码编辑器" : "Source Editor"}</span>
                  <span>UTF-8</span>
                </div>
                <textarea
                  value={editMarkdown}
                  onChange={(e) => setEditMarkdown(e.target.value)}
                  className={`w-full flex-grow p-4 bg-transparent outline-none font-mono text-sm resize-none overflow-y-auto leading-relaxed border-none ${
                    isLight ? "text-slate-700" : "text-slate-300"
                  }`}
                  placeholder="# 一级标题\n\n写下你的内容..."
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

                {/* Simulated Markdown renderer */}
                <div className={`w-full flex-grow p-5 overflow-y-auto text-sm font-sans prose leading-relaxed max-w-none ${
                  isLight ? "text-slate-700" : "text-slate-300 prose-invert"
                }`}>
                  {editMarkdown ? (
                    <div className="space-y-4">
                      {editMarkdown.split("\n\n").map((block, idx) => {
                        const trimmed = block.trim();
                        if (trimmed.startsWith("# ")) {
                          return <h1 key={idx} className={`text-xl font-bold border-b pb-2 mt-2 ${isLight ? "text-slate-800 border-[#e5e2db]" : "text-white border-white/10"}`}>{trimmed.slice(2)}</h1>;
                        }
                        if (trimmed.startsWith("## ")) {
                          return <h2 key={idx} className={`text-base font-bold border-l-2 border-indigo-500 pl-2 mt-4 ${isLight ? "text-slate-700" : "text-slate-100"}`}>{trimmed.slice(3)}</h2>;
                        }
                        if (trimmed.startsWith("### ")) {
                          return <h3 key={idx} className={`text-sm font-semibold mt-3 ${isLight ? "text-slate-700" : "text-slate-200"}`}>{trimmed.slice(4)}</h3>;
                        }
                        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                          return (
                            <ul key={idx} className="list-disc pl-4 space-y-1">
                              {trimmed.split("\n").map((li, lIdx) => (
                                <li key={lIdx}>{li.replace(/^[\s*-]+/, "")}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (trimmed.startsWith("```")) {
                          const lines = trimmed.split("\n");
                          const code = lines.slice(1, lines.length - 1).join("\n");
                          return (
                            <pre key={idx} className={`border p-3 rounded-lg font-mono text-xs overflow-x-auto my-3 leading-snug ${
                              isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-indigo-600" : "bg-black/60 border-white/5 text-indigo-300"
                            }`}>
                              <code>{code}</code>
                            </pre>
                          );
                        }
                        return <p key={idx} className="leading-6">{trimmed}</p>;
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                      {isZh ? "等待输入源渲染预览..." : "Waiting for input..."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
