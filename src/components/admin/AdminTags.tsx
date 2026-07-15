"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Tag as TagIcon, 
  X, 
  Save, 
  PlusCircle, 
  FileCheck,
  Flame,
  Palette,
  Laptop,
  Server,
  Cloud,
  PenTool,
  Wrench,
  Layers,
  Sparkles,
  Brain,
  Globe,
  Cpu,
  Terminal,
  Rocket,
  Search
} from "lucide-react";
import { Tag, Category } from "../../data/mockAdminData";
import { adminApi } from "../../api";
import { translations } from "../../data/translations";
import ConfirmDialog from "./ConfirmDialog";
import LoadingOverlay from "./LoadingOverlay";

// Custom polished dropdown selector to replace native <select> elements
function CustomSelect({ 
  value, 
  onChange, 
  options, 
  displayLabels,
  placeholder,
  isLight
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: string[]; 
  displayLabels?: Record<string, string>;
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
          <span className="truncate">{(displayLabels && displayLabels[value]) || value || placeholder}</span>
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
                  {(displayLabels && displayLabels[opt]) || opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface AdminTagsProps {
  tags: Tag[];
  onUpdateTags: (updated: Tag[]) => void;
  categories?: Category[];
  onUpdateCategories?: (updated: Category[]) => void;
  language?: "zh" | "en";
  theme?: "dark" | "light";
  authToken?: string;
}

export default function AdminTags({ 
  tags, 
  onUpdateTags, 
  categories = [], 
  onUpdateCategories,
  language = "zh",
  theme = "dark",
  authToken = ""
}: AdminTagsProps) {
  const isZh = language === "zh";
  const isLight = theme === "light";
  // Navigation Tab inside: tags (标签管理) vs categories (分类管理)
  const [activeSubTab, setActiveSubTab] = useState<"tags" | "categories">("tags");

  const [isAdding, setIsAdding] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  // Pagination for tags and categories
  const [tagPage, setTagPage] = useState(1);
  const [catPage, setCatPage] = useState(1);
  const itemsPerPage = 6;

  // Fuzzy search
  const [tagSearch, setTagSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");

  // Form Fields for Tags
  const [tagName, setTagName] = useState("");
  const [tagSlug, setTagSlug] = useState("");
  const [tagColor, setTagColor] = useState("from-blue-500 to-indigo-500");

  const gradientPresets = [
    "from-blue-500 to-indigo-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-purple-500 to-indigo-600",
    "from-pink-500 to-rose-500",
    "from-cyan-400 to-sky-600",
    "from-slate-500 to-slate-800",
  ];

  const gradientLabels: Record<string, string> = isZh ? {
    "from-blue-500 to-indigo-500": "深海星辰",
    "from-emerald-500 to-teal-500": "极光森林",
    "from-amber-500 to-orange-500": "炽热恒星",
    "from-purple-500 to-indigo-600": "暗紫螺旋",
    "from-pink-500 to-rose-500": "星系红移",
    "from-cyan-400 to-sky-600": "超新星",
    "from-slate-500 to-slate-800": "黑洞视界",
  } : {
    "from-blue-500 to-indigo-500": "Blue/Indigo",
    "from-emerald-500 to-teal-500": "Emerald/Teal",
    "from-amber-500 to-orange-500": "Amber/Orange",
    "from-purple-500 to-indigo-600": "Purple/Indigo",
    "from-pink-500 to-rose-500": "Pink/Rose",
    "from-cyan-400 to-sky-600": "Cyan/Sky",
    "from-slate-500 to-slate-800": "Slate/Dark",
  };

  // Form Fields for Categories
  const [catTitle, setCatTitle] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catId, setCatId] = useState("");
  const [catColorName, setCatColorName] = useState("");
  const [catIconType, setCatIconType] = useState<Category["iconType"]>("laptop");

  const iconOptions = ["laptop", "server", "cloud", "palette", "pen-tool", "wrench", "brain", "globe", "cpu", "terminal", "flame", "sparkles", "rocket"];
  const iconLabels: Record<string, string> = isZh ? {
    laptop: "电脑图标",
    server: "服务器图标",
    cloud: "云朵图标",
    palette: "调色板图标",
    "pen-tool": "钢笔图标",
    wrench: "扳手图标",
    brain: "大脑图标",
    globe: "地球图标",
    cpu: "芯片图标",
    terminal: "终端图标",
    flame: "火焰图标",
    sparkles: "星光图标",
    rocket: "火箭图标",
  } : {
    laptop: "Laptop",
    server: "Server",
    cloud: "Cloud",
    palette: "Palette",
    "pen-tool": "Pen Tool",
    wrench: "Wrench",
    brain: "Brain",
    globe: "Globe",
    cpu: "CPU",
    terminal: "Terminal",
    flame: "Flame",
    sparkles: "Sparkles",
    rocket: "Rocket",
  };

  const [isAddingCat, setIsAddingCat] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Auto generate tag slug
  const handleTagNameChange = (val: string) => {
    setTagName(val);
    setTagSlug(val.toLowerCase().replace(/[^a-z0-9]/gi, "-"));
  };

  // Auto generate category ID and ColorName from Title
  const handleCatTitleChange = (val: string) => {
    setCatTitle(val);
    setCatId(val.toLowerCase().replace(/[^a-z0-9]/gi, "-") || "cat-" + Date.now());
    setCatColorName(val);
  };

  // Save Tag
  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      showToast(isZh ? "标签名称不能为空！" : "Tag name cannot be empty!");
      return;
    }
    if (!authToken) {
      showToast(isZh ? "登录已过期，请重新登录" : "Session expired");
      return;
    }

    setLoadingText(isZh ? "保存中..." : "Saving...");
    try {
      if (editingTag) {
        await adminApi.updateTag(authToken, editingTag.id, {
          name: tagName,
          slug: tagSlug || editingTag.slug,
          color: tagColor,
        });
        const updated = tags.map(t => t.id === editingTag.id ? {
          ...t,
          name: tagName,
          slug: tagSlug || t.slug,
          color: tagColor
        } : t);
        onUpdateTags(updated);
        setEditingTag(null);
      } else {
        const res = await adminApi.createTag(authToken, {
          id: "tag-" + Date.now(),
          name: tagName,
          slug: tagSlug || "tag-" + Date.now(),
          color: tagColor,
          count: 0
        });
        const newTag: Tag = {
          id: res.id || ("tag-" + Date.now()),
          name: tagName,
          slug: tagSlug || "tag-" + Date.now(),
          color: tagColor,
          count: 0
        };
        onUpdateTags([...tags, newTag]);
        setIsAdding(false);
      }
      setTagName("");
      setTagSlug("");
      setTagColor("from-blue-500 to-indigo-500");
      showToast(isZh ? "标签已保存" : "Tag saved");
    } catch (err: any) {
      showToast(err.message || (isZh ? "保存失败" : "Save failed"));
    } finally {
      setLoadingText(null);
    }
  };

  // Delete Tag
  const [deleteTagId, setDeleteTagId] = useState<string | null>(null);
  const handleDeleteTag = (id: string) => {
    setDeleteTagId(id);
  };
  const confirmDeleteTag = async () => {
    if (!deleteTagId) return;
    if (!authToken) {
      showToast(isZh ? "登录已过期，请重新登录" : "Session expired");
      return;
    }
    setLoadingText(isZh ? "删除中..." : "Deleting...");
    try {
      await adminApi.deleteTag(authToken, deleteTagId);
      onUpdateTags(tags.filter(t => t.id !== deleteTagId));
      setDeleteTagId(null);
      showToast(isZh ? "标签已删除" : "Tag deleted");
    } catch (err: any) {
      showToast(err.message || (isZh ? "删除失败" : "Delete failed"));
    } finally {
      setLoadingText(null);
    }
  };

  const startEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagSlug(tag.slug);
    setTagColor(tag.color);
    setIsAdding(false);
  };

  // Save Category
  const handleSaveCategory = async () => {
    if (!catTitle.trim()) {
      showToast(isZh ? "分类标题不能为空！" : "Category title cannot be empty!");
      return;
    }
    if (!onUpdateCategories) return;
    if (!authToken) {
      showToast(isZh ? "登录已过期，请重新登录" : "Session expired");
      return;
    }

    setLoadingText(isZh ? "保存中..." : "Saving...");
    try {
      if (editingCat) {
        await adminApi.updateCategory(authToken, editingCat.id, {
          title: catTitle,
          desc: catDesc,
          colorName: catColorName || catTitle,
          iconType: catIconType,
        });
        const updated = categories.map(c => c.id === editingCat.id ? {
          ...c,
          title: catTitle,
          desc: catDesc,
          colorName: catColorName || catTitle,
          iconType: catIconType
        } : c);
        onUpdateCategories(updated);
        setEditingCat(null);
      } else {
        const finalId = catId || "cat-" + Date.now();
        await adminApi.createCategory(authToken, {
          id: finalId,
          title: catTitle,
          desc: catDesc || (isZh ? "探讨相关的前沿开发技术与工程化细节。" : "Exploring cutting-edge tech and engineering."),
          colorName: catColorName || catTitle,
          iconType: catIconType,
        });
        const newCat: Category = {
          id: finalId,
          title: catTitle,
          desc: catDesc || (isZh ? "探讨相关的前沿开发技术与工程化细节。" : "Exploring cutting-edge tech and engineering."),
          colorName: catColorName || catTitle,
          iconType: catIconType
        };
        onUpdateCategories([...categories, newCat]);
        setIsAddingCat(false);
      }
      // Reset Category form
      setCatTitle("");
      setCatDesc("");
      setCatId("");
      setCatColorName("");
      setCatIconType("laptop");
      showToast(isZh ? "分类已保存" : "Category saved");
    } catch (err: any) {
      showToast(err.message || (isZh ? "保存失败" : "Save failed"));
    } finally {
      setLoadingText(null);
    }
  };

  // Delete Category
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);
  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      showToast(isZh ? "请至少保留一个分类！" : "Please keep at least one category!");
      return;
    }
    setDeleteCatId(id);
  };
  const confirmDeleteCategory = async () => {
    if (!deleteCatId || !onUpdateCategories) return;
    if (!authToken) {
      showToast(isZh ? "登录已过期，请重新登录" : "Session expired");
      return;
    }
    setLoadingText(isZh ? "删除中..." : "Deleting...");
    try {
      await adminApi.deleteCategory(authToken, deleteCatId);
      onUpdateCategories(categories.filter(c => c.id !== deleteCatId));
      setDeleteCatId(null);
      showToast(isZh ? "分类已删除" : "Category deleted");
    } catch (err: any) {
      showToast(err.message || (isZh ? "删除失败" : "Delete failed"));
    } finally {
      setLoadingText(null);
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCatTitle(cat.title);
    setCatDesc(cat.desc || "");
    setCatId(cat.id);
    setCatColorName(cat.colorName);
    setCatIconType(cat.iconType || "laptop");
    setIsAddingCat(false);
  };

  // Helper icon renderer
  const renderCategoryIcon = (type?: string) => {
    const classStr = "w-4 h-4";
    switch (type) {
      case "laptop": return <Laptop className={classStr} />;
      case "server": return <Server className={classStr} />;
      case "cloud": return <Cloud className={classStr} />;
      case "palette": return <Palette className={classStr} />;
      case "pen-tool": return <PenTool className={classStr} />;
      case "wrench": return <Wrench className={classStr} />;
      case "brain": return <Brain className={classStr} />;
      case "globe": return <Globe className={classStr} />;
      case "cpu": return <Cpu className={classStr} />;
      case "terminal": return <Terminal className={classStr} />;
      case "flame": return <Flame className={classStr} />;
      case "sparkles": return <Sparkles className={classStr} />;
      case "rocket": return <Rocket className={classStr} />;
      default: return <Layers className={classStr} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-tags-container">
      <LoadingOverlay visible={!!loadingText} text={loadingText || undefined} />
      {/* Tab toggle */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.08]"}`}>
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${isLight ? "bg-[#f0efeb] border border-[#e5e2db]" : "bg-[#0a0c14]/50 border-white/[0.08]"}`}>
          <button
            onClick={() => {
              setActiveSubTab("tags");
              setIsAdding(false);
              setEditingTag(null);
            }}
            className={`py-2 px-4 rounded-lg text-sm font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "tags"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TagIcon className="w-3.5 h-3.5" />
            <span>{isZh ? "标签管理" : "Tags"}</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("categories");
              setIsAddingCat(false);
              setEditingCat(null);
            }}
            className={`py-2 px-4 rounded-lg text-sm font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === "categories"
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isZh ? "分类目录管理" : "Categories"}</span>
          </button>
        </div>

        {activeSubTab === "tags" && !isAdding && !editingTag && (
          <button
            onClick={() => setIsAdding(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isZh ? "创建新标签" : "New Tag"}</span>
          </button>
        )}

        {activeSubTab === "categories" && !isAddingCat && !editingCat && (
          <button
            onClick={() => setIsAddingCat(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isZh ? "创建新分类" : "New Category"}</span>
          </button>
        )}
      </div>

      {/* 1. TAGS SECTION */}
      {activeSubTab === "tags" && (
        <div className="space-y-6">
          {/* Form Tag */}
          <AnimatePresence>
            {(isAdding || editingTag) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`border p-6 rounded-2xl backdrop-blur-xl relative overflow-visible space-y-6 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/80 border-white/[0.08]"}`}
                id="tag-form-card"
              >
                <div className={`flex items-center justify-between pb-3 ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.08]"}`}>
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Palette className="w-4.5 h-4.5" />
                    <span>{editingTag ? (isZh ? "编辑文章标签属性" : "Edit Tag") : (isZh ? "创建新文章标签" : "New Tag")}</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingTag(null);
                      setTagName("");
                      setTagSlug("");
                    }}
                    className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签显示名称" : "Tag Name"}</label>
                    <input
                      type="text"
                      value={tagName}
                      onChange={(e) => handleTagNameChange(e.target.value)}
                      placeholder="例如: Next.js"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.06] text-slate-100"}`}
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "路由别名 (Slug)" : "Slug"}</label>
                    <input
                      type="text"
                      value={tagSlug}
                      onChange={(e) => setTagSlug(e.target.value)}
                      placeholder="例如: nextjs"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans font-mono focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.06] text-slate-100"}`}
                    />
                  </div>

                  {/* Presets Custom Dropdown */}
                  <div className="space-y-1.5">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "星云渐变配色" : "Gradient Color"}</label>
                    <CustomSelect 
                      value={tagColor}
                      onChange={(val) => setTagColor(val)}
                      options={gradientPresets}
                      displayLabels={gradientLabels}
                      isLight={isLight}
                    />
                  </div>
                </div>

                {/* Color preview bar */}
                <div className={`p-4 rounded-xl flex items-center justify-between ${isLight ? "bg-[#f8f7f4] border border-[#e5e2db]" : "bg-black/20 border border-white/[0.06]"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500">{isZh ? "实时气泡预览:" : "Preview:"}</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${tagColor} shadow-[0_2px_10px_rgba(0,0,0,0.1)]`}>
                      <TagIcon className="w-3.5 h-3.5" />
                      {tagName || (isZh ? "预览标签" : "Preview")}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveTag}
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isZh ? "保存标签配置" : "Save Tag"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + Grid of tags */}
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => { setTagSearch(e.target.value); setTagPage(1); }}
                className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700 placeholder-slate-400" : "bg-[#05060a]/80 border-white/[0.06] text-slate-200 placeholder-slate-500"}`}
                placeholder={isZh ? "搜索标签名称..." : "Search tags..."}
              />
            </div>
          {(() => {
            const filteredTags = tagSearch.trim()
              ? tags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase()) || t.slug.toLowerCase().includes(tagSearch.toLowerCase()))
              : tags;
            const totalTagPages = Math.ceil(filteredTags.length / itemsPerPage);
            const pagedTags = filteredTags.slice((tagPage - 1) * itemsPerPage, tagPage * itemsPerPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="tags-visual-grid">
                  {pagedTags.map((tag) => (
              <div
                key={tag.id}
                className={`rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group transition-all duration-300 flex flex-col justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm hover:border-indigo-300" : "bg-[#0a0c14]/70 border border-white/[0.08] hover:border-indigo-500/20"}`}
              >
                <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-gradient-to-br ${tag.color} opacity-5 blur-xl group-hover:opacity-15 transition-opacity pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${tag.color} text-white shadow-[0_2px_15px_rgba(0,0,0,0.2)]`}>
                      <TagIcon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wide"> {tag.slug}
                    </span>
                  </div>

                  <h4 className={`text-sm font-bold tracking-wide mt-1 ${isLight ? "text-slate-700" : "text-slate-100"}`}>{tag.name}</h4>
                  <p className="text-xs font-mono text-slate-400 mt-2 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>{isZh ? "关联应用了" : "Linked to"} {tag.count} {isZh ? "篇文章" : "articles"}</span>
                  </p>
                </div>

                <div className={`flex items-center gap-2 mt-6 pt-3 justify-end opacity-60 group-hover:opacity-100 transition-opacity ${isLight ? "border-t border-[#e5e2db]" : "border-t border-white/[0.08]"}`}>
                  <button
                    onClick={() => startEditTag(tag)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
                    title={isZh ? "编辑属性" : "Edit"}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                    title={isZh ? "删除标签" : "Delete"}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
                </div>

                {/* Tag pagination */}
                {totalTagPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      disabled={tagPage === 1}
                      onClick={() => setTagPage(p => Math.max(p - 1, 1))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${tagPage === 1 ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent" : "text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.05] cursor-pointer"}`}
                    >
                      {isZh ? "上一页" : "Prev"}
                    </button>
                    {Array.from({ length: totalTagPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setTagPage(i + 1)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${tagPage === i + 1 ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={tagPage === totalTagPages}
                      onClick={() => setTagPage(p => Math.min(p + 1, totalTagPages))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${tagPage === totalTagPages ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent" : "text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.05] cursor-pointer"}`}
                    >
                      {isZh ? "下一页" : "Next"}
                    </button>
                  </div>
                )}
              </>
            );
          })()}
          </div>
        </div>
      )}

      {/* 2. CATEGORIES SECTION */}
      {activeSubTab === "categories" && (
        <div className="space-y-6">
          {/* Form Category */}
          <AnimatePresence>
            {(isAddingCat || editingCat) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`border p-6 rounded-2xl backdrop-blur-xl relative overflow-visible space-y-6 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/80 border-white/[0.08]"}`}
                id="category-form-card"
              >
                <div className={`flex items-center justify-between pb-3 ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.08]"}`}>
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5" />
                    <span>{editingCat ? (isZh ? "编辑文章分类配置" : "Edit Category") : (isZh ? "创设文章大分类" : "New Category")}</span>
                  </h3>
                  <button 
                    onClick={() => {
                      setIsAddingCat(false);
                      setEditingCat(null);
                      setCatTitle("");
                      setCatDesc("");
                      setCatId("");
                      setCatColorName("");
                    }}
                    className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类名称" : "Category Name"}</label>
                    <input
                      type="text"
                      value={catTitle}
                      onChange={(e) => handleCatTitleChange(e.target.value)}
                      placeholder="如: 前端技术, 人工智能"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-sans focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.06] text-slate-100"}`}
                    />
                  </div>

                  {/* ID / Slug */}
                  <div className="space-y-1.5">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类唯一代码 (ID/Slug)" : "Category ID/Slug"}</label>
                    <input
                      type="text"
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      placeholder="如: frontend"
                      className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.06] text-slate-100"}`}
                    />
                  </div>

                  {/* Custom select Icon dropdown */}
                  <div className="space-y-1.5">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "前端展示图标" : "Display Icon"}</label>
                    <CustomSelect 
                      value={catIconType || "laptop"}
                      onChange={(val) => setCatIconType(val as Category["iconType"])}
                      options={iconOptions}
                      displayLabels={iconLabels}
                      isLight={isLight}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 md:col-span-4">
                    <label className={`text-sm font-semibold block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类描述说明" : "Description"}</label>
                    <textarea
                      value={catDesc}
                      onChange={(e) => setCatDesc(e.target.value)}
                      rows={2}
                      placeholder={isZh ? "输入几句简单描述..." : "Enter description..."}
                      className={`w-full border rounded-xl p-4 text-sm outline-none resize-none leading-relaxed focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.06] text-slate-200"}`}
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl flex items-center justify-between ${isLight ? "bg-[#f8f7f4] border border-[#e5e2db]" : "bg-black/20 border border-white/[0.06]"}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono text-slate-500">{isZh ? "图标预览:" : "Icon Preview:"}</span>
                    <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                      {renderCategoryIcon(catIconType)}
                    </div>
                    <span className="text-sm text-slate-300 font-bold">{catTitle || (isZh ? "未定名称" : "Unnamed")}</span>
                  </div>

                  <button
                    onClick={handleSaveCategory}
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isZh ? "保存分类配置" : "Save Category"}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search + Grid of categories */}
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => { setCatSearch(e.target.value); setCatPage(1); }}
                className={`w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700 placeholder-slate-400" : "bg-[#05060a]/80 border-white/[0.06] text-slate-200 placeholder-slate-500"}`}
                placeholder={isZh ? "搜索分类名称..." : "Search categories..."}
              />
            </div>
          {(() => {
            const validCats = categories.filter(c => c.title && c.title.trim() !== "");
            const filteredCats = catSearch.trim()
              ? validCats.filter(c => c.title.toLowerCase().includes(catSearch.toLowerCase()) || (c.desc || "").toLowerCase().includes(catSearch.toLowerCase()))
              : validCats;
            const totalCatPages = Math.ceil(filteredCats.length / itemsPerPage);
            const pagedCats = filteredCats.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage);
            return (
              <>
                {validCats.length === 0 && (
                  <div className={`py-12 text-center text-slate-500 text-sm font-mono rounded-2xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db]" : "bg-[#0c0e16]/30 border border-white/[0.08]"}`}>
                    {isZh ? "\u6682\u65e0\u5206\u7c7b\u6570\u636e\uff0c\u8bf7\u70b9\u51fb\u201c\u521b\u5efa\u65b0\u5206\u7c7b\u201d\u6dfb\u52a0" : "No categories yet. Click 'New Category' to add."}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-visual-grid">
                  {pagedCats.map((cat) => (
              <div
                key={cat.id}
                className={`border rounded-2xl p-5 backdrop-blur-md relative overflow-visible group transition-all duration-300 flex flex-col justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] hover:border-indigo-300" : "bg-[#0a0c14]/70 border-white/[0.08] hover:border-indigo-500/20"}`}
              >
                <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-indigo-500/5 blur-xl group-hover:opacity-15 transition-opacity pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_2px_15px_rgba(99,102,241,0.1)]">
                      {renderCategoryIcon(cat.iconType)}
                    </div>
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wide">
                    </span>
                  </div>

                  <h4 className={`text-base font-bold tracking-wide mt-1 ${isLight ? "text-slate-700" : "text-slate-100"}`}>{cat.title}</h4>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{cat.desc}</p>
                </div>

                <div className={`flex items-center gap-2 mt-4 pt-3 justify-end opacity-60 group-hover:opacity-100 transition-opacity ${isLight ? "border-t border-[#e5e2db]" : "border-t border-white/[0.08]"}`}>
                  <button
                    onClick={() => startEditCategory(cat)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer"
                    title={isZh ? "编辑分类" : "Edit"}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
                    title={isZh ? "删除分类" : "Delete"}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
                </div>

                {/* Category pagination */}
                {totalCatPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      disabled={catPage === 1}
                      onClick={() => setCatPage(p => Math.max(p - 1, 1))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${catPage === 1 ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent" : "text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.05] cursor-pointer"}`}
                    >
                      {isZh ? "上一页" : "Prev"}
                    </button>
                    {Array.from({ length: totalCatPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCatPage(i + 1)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${catPage === i + 1 ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={catPage === totalCatPages}
                      onClick={() => setCatPage(p => Math.min(p + 1, totalCatPages))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${catPage === totalCatPages ? "opacity-30 cursor-not-allowed text-slate-500 border-transparent" : "text-slate-400 border-white/[0.08] hover:text-white hover:bg-white/[0.05] cursor-pointer"}`}
                    >
                      {isZh ? "下一页" : "Next"}
                    </button>
                  </div>
                )}
              </>
            );
          })()}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTagId}
        title={isZh ? "确认删除标签" : "Confirm Delete Tag"}
        message={isZh ? "确定要删除这个标签吗？已关联的文章不会受影响。" : "Are you sure to delete this tag? Linked articles won't be affected."}
        confirmLabel={isZh ? "确认删除" : "Delete"}
        cancelLabel={isZh ? "取消" : "Cancel"}
        danger
        onConfirm={confirmDeleteTag}
        onCancel={() => setDeleteTagId(null)}
      />
      <ConfirmDialog
        open={!!deleteCatId}
        title={isZh ? "确认删除分类" : "Confirm Delete Category"}
        message={isZh ? "确定要删除这个文章分类吗？已关联的文章不会受影响。" : "Are you sure to delete this category? Linked articles won't be affected."}
        confirmLabel={isZh ? "确认删除" : "Delete"}
        cancelLabel={isZh ? "取消" : "Cancel"}
        danger
        onConfirm={confirmDeleteCategory}
        onCancel={() => setDeleteCatId(null)}
      />
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-[999] px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold shadow-[0_8px_30px_rgba(245,158,11,0.3)] flex items-center gap-2 select-none"
          >
            <Flame className="w-4 h-4" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
