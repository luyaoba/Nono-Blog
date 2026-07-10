"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Tags, 
  Briefcase, 
  MessageSquare, 
  Settings as SettingsIcon, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Globe,
  CircleDot
} from "lucide-react";
import { translations } from "../../data/translations";

interface AdminLayoutProps {
  children: ReactNode;
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  onLogout: () => void;
  onExitConsole: () => void;
  language?: "zh" | "en";
  theme?: "dark" | "light";
  settings?: {
    nickname?: string;
    avatarUrl?: string;
  };
}

export default function AdminLayout({ 
  children, 
  activeSubTab, 
  setActiveSubTab, 
  onLogout, 
  onExitConsole,
  language = "zh",
  theme = "dark",
  settings,
}: AdminLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = translations[language];
  const isZh = language === "zh";
  const isLight = theme === "light";

  // High-fidelity menus matching the requested items
  const menuItems = [
    { id: "dashboard", label: isZh ? "控制台首屏" : "Dashboard", icon: LayoutDashboard },
    { id: "posts", label: isZh ? "文章内容管理" : "Articles", icon: BookOpen },
    { id: "tags", label: isZh ? "标签分类管理" : "Tags & Categories", icon: Tags },
    { id: "comments", label: isZh ? "评论留言管理" : "Comments", icon: MessageSquare },
    { id: "settings", label: isZh ? "站点属性配置" : "Settings", icon: SettingsIcon },
  ];

  return (
    <div className={`min-h-screen flex font-sans relative overflow-hidden transition-colors duration-500 ${isLight ? "bg-[#f5f4f0] text-slate-700" : "bg-[#07080e] text-slate-200"}`} id="admin-layout-root">
      {/* Background overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isLight ? (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(120,113,108,0.04)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(120,113,108,0.04)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-60" />
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:40px_40px] opacity-25" />
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.015] blur-[150px]" />
          </>
        )}
      </div>

      {/* Expanded/Collapsed Sidebar Deck */}
      <motion.aside
        animate={{ width: isCollapsed ? 76 : 260 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`shrink-0 backdrop-blur-3xl relative z-20 flex flex-col justify-between py-6 h-screen transition-colors duration-500 ${isLight ? "bg-[#faf9f6]/95 border-r border-[#e5e2db]" : "bg-[#0a0c14]/80 border-r border-white/[0.08]"} ${isCollapsed ? "overflow-visible" : "overflow-hidden"}`}
        id="admin-sidebar"
      >
        <div className="space-y-8 flex flex-col">
          {/* Brand Header */}
          <div className="px-5 flex items-center justify-between" id="admin-sidebar-header">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 cursor-pointer min-w-0"
                  onClick={onExitConsole}
                >
                  <span className={`text-lg font-extrabold whitespace-nowrap ${isLight ? "text-slate-800" : "text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300"}`}>
                    {settings?.nickname || "Nono"} Console
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] shrink-0" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto text-sm font-bold shrink-0 ${isLight ? "bg-indigo-50 border border-indigo-200 text-indigo-600" : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"}`}
                  onClick={onExitConsole}
                >
                  N.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapse Trigger for Desktop */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer hidden md:block relative z-30 shrink-0 ${isLight ? "border border-[#e5e2db] bg-[#f0efeb] text-slate-500 hover:text-slate-800 hover:border-[#d4d0c8] hover:bg-[#ebe9e4]" : "border border-white/[0.05] bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/[0.1] hover:bg-white/[0.04]"}`}
              title={isCollapsed ? (isZh ? "展开" : "Expand") : (isZh ? "收起" : "Collapse")}
            >
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* User Profile Info Info */}
          <div className={`px-4 ${isCollapsed ? "text-center" : ""}`}>
            <div className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${isLight ? "bg-[#f0efeb] border border-[#e5e2db]" : "bg-white/[0.02] border border-white/[0.06]"} ${isCollapsed ? "justify-center" : ""}`}>
              <img
                src={settings?.avatarUrl || "https://api.dicebear.com/7.x/pixel-art/svg?seed=nono"}
                alt={settings?.nickname || "Nono"}
                referrerPolicy="no-referrer"
                className={`w-9 h-9 rounded-xl shrink-0 object-cover ${isLight ? "border border-[#e5e2db] bg-[#f0efeb]" : "border border-white/10 bg-[#0f111a]"}`}
              />
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h4 className={`text-sm font-semibold tracking-wider truncate ${isLight ? "text-slate-800" : "text-white"}`}>{settings?.nickname || "Nono"}</h4>
                  <p className={`text-xs font-medium tracking-wide ${isLight ? "text-indigo-600" : "text-indigo-400"}`}>{isZh ? "主站创作者" : "Site Creator"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1.5" id="admin-nav-deck">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 relative cursor-pointer group ${
                    isActive
                      ? isLight
                        ? "text-indigo-700 font-semibold bg-indigo-50 border border-indigo-200"
                        : "text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.06)]"
                      : isLight
                        ? "text-slate-600 hover:text-slate-800 hover:bg-[#f0efeb] border border-transparent"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                  id={`admin-nav-item-${item.id}`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-300 ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:scale-110"
                  }`} />
                  
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}

                  {/* Left luminous accent line for selected item */}
                  {isActive && (
                    <span className="absolute left-[-2px] top-1/4 bottom-1/4 w-[4px] rounded-r-md bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer actions */}
        <div className="px-3 space-y-1.5" id="admin-sidebar-footer">
          {/* Back to Website Portal */}
          <button
            onClick={onExitConsole}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium tracking-wider transition-all cursor-pointer group ${isLight ? "text-slate-600 hover:text-slate-800 hover:bg-[#f0efeb]" : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"}`}
          >
            <Globe className="w-4.5 h-4.5 shrink-0 text-slate-500 group-hover:text-indigo-400" />
            {!isCollapsed && <span>{isZh ? "返回前台主站" : "Back to Site"}</span>}
          </button>

          {/* Secure Logout */}
          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium tracking-wider transition-all cursor-pointer group ${isLight ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/5"}`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-rose-400/80 group-hover:translate-x-0.5 transition-transform" />
            {!isCollapsed && <span>{isZh ? "安全登出系统" : "Log Out"}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Core Working Area */}
      <main className="flex-grow h-screen overflow-y-auto z-10 flex flex-col" id="admin-main-canvas">
        {/* Secondary Header */}
        <header className={`h-16 shrink-0 backdrop-blur-xl px-8 flex items-center justify-between relative z-10 transition-colors ${isLight ? "border-b border-[#e5e2db] bg-[#faf9f6]/80" : "border-b border-white/[0.08] bg-[#07080e]/40"}`}>
          <div className="px-4 flex items-center gap-3">
            <CircleDot className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            <span className={`text-sm font-medium tracking-wider ${isLight ? "text-slate-600" : "text-slate-300"}`}>
              {isZh ? "管理系统已安全连接" : "Console Connected"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium px-3 py-1.5 rounded-md ${isLight ? "text-slate-600 bg-[#f0efeb] border border-[#e5e2db]" : "text-slate-300 bg-white/[0.03] border border-white/[0.08]"}`}>
              {isZh ? "系统权限：站长专享" : "Access: Owner Only"}
            </span>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-grow p-8 max-w-7xl w-full mx-auto pb-16 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
