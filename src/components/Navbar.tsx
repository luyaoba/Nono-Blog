"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Menu, X, Sparkles } from "lucide-react";
import { translations } from "../data/translations";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchClick: () => void;
  isSearchActive: boolean;
  theme: "dark" | "light";
  language: "zh" | "en";
  setLanguage: (lang: "zh" | "en") => void;
  settings?: {
    nickname?: string;
    avatarUrl?: string;
  };
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onSearchClick,
  isSearchActive,
  theme,
  language,
  setLanguage,
  settings,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const t = translations[language];

  const navItems = [
    { id: "home", label: t.navHome },
    { id: "articles", label: t.navArticles },
    { id: "categories", label: t.navCategories },
    { id: "about", label: t.navAbout },
  ];

  const isLight = theme === "light";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? isLight
          ? "backdrop-blur-xl border-b bg-[#fefdfb]/80 border-[#e5e2db]/60 shadow-xs text-slate-800"
          : "backdrop-blur-xl border-b bg-[#07080c]/70 border-white/[0.04] text-slate-100"
        : isLight
          ? "border-b border-transparent bg-transparent text-slate-800"
          : "border-b border-transparent bg-transparent text-slate-100"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-logo"
        >
          {settings?.avatarUrl ? (
            <img src={settings.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10 transition-transform duration-300 group-hover:scale-110" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-indigo-400">N</span>
            </div>
          )}
          <span className={`text-lg font-extrabold tracking-wider transition-all duration-500 bg-clip-text text-transparent ${
            isLight
              ? "bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 group-hover:from-indigo-600 group-hover:to-slate-900"
              : "bg-gradient-to-r from-white via-slate-200 to-slate-400 group-hover:from-indigo-300 group-hover:to-white"
          }`}>
            {settings?.nickname || "Nono"}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8" id="nav-desktop-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isSearchActive) onSearchClick(); // Deactivate search if tab changed
              }}
              className={`relative py-1 text-sm tracking-wide font-medium transition-all duration-300 ${
                activeTab === item.id && !isSearchActive
                  ? isLight ? "text-indigo-600 font-bold" : "text-white"
                  : isLight ? "text-slate-600 hover:text-slate-800" : "text-slate-400 hover:text-slate-200"
              }`}
              id={`nav-item-${item.id}`}
            >
              {item.label}
              {activeTab === item.id && !isSearchActive && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-indigo-500 ${isLight ? "shadow-none" : "shadow-[0_0_8px_#818cf8]"}`} />
              )}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4" id="nav-actions">
          {/* Search Icon */}
          <button
            onClick={onSearchClick}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              isSearchActive
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.15)]"
                : isLight
                ? "bg-[#fefdfb] border-[#e5e2db] text-slate-500 hover:text-slate-800 hover:border-indigo-200 hover:shadow-[0_2px_8px_rgba(99,102,241,0.08)]"
                : "bg-white/[0.02] border-white/[0.04] text-slate-400 hover:text-white hover:border-white/[0.1] hover:bg-white/[0.04]"
            }`}
            title={t.navSearch}
            id="nav-search-btn"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Lang */}
          <button
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            className={`px-2.5 py-2 rounded-xl border transition-all duration-300 ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] text-slate-500 hover:border-indigo-200 hover:shadow-[0_2px_8px_rgba(99,102,241,0.08)]"
                : "border-white/[0.04] bg-white/[0.02] text-slate-400 hover:text-white"
            } flex items-center gap-1 cursor-pointer`}
            title={language === "zh" ? "Switch to English" : "切换为中文"}
            id="nav-lang-btn"
          >
            <Globe className="w-4 h-4" />
            <span className="font-mono text-[10px] font-semibold">{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className={`p-2 rounded-xl border ${
              isSearchActive
                ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                : isLight
                ? "bg-[#fefdfb] border-[#e5e2db] text-slate-500"
                : "bg-white/[0.02] border-white/[0.04] text-slate-400"
            }`}
            id="nav-mobile-search-btn"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 rounded-xl border ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] text-slate-600"
                : "border-white/[0.04] bg-white/[0.02] text-slate-400"
            }`}
            id="nav-mobile-menu-btn"
          >
            {isOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className={`md:hidden absolute top-16 left-0 right-0 border-b py-6 px-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200 ${
          isLight
            ? "bg-[#fefdfb]/98 border-[#e5e2db] text-slate-800"
            : "bg-[#07080c]/95 border-white/[0.06] text-slate-100"
        }`} id="nav-mobile-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
                if (isSearchActive) onSearchClick();
              }}
              className={`py-2 text-left text-base font-medium tracking-wide transition-colors ${
                activeTab === item.id && !isSearchActive
                  ? isLight
                    ? "text-indigo-600 border-l-2 border-indigo-500 pl-3 font-bold"
                    : "text-white border-l-2 border-indigo-400 pl-3"
                  : isLight
                    ? "text-slate-500 pl-3 border-l border-slate-100"
                    : "text-slate-400 pl-3 border-l border-white/5"
              }`}
              id={`nav-mobile-item-${item.id}`}
            >
              {item.label}
            </button>
          ))}
          <div className={`flex flex-col gap-4 pt-4 border-t pl-3 ${
            isLight ? "border-[#e5e2db]" : "border-white/[0.05]"
          }`}>
            <button
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              className="flex items-center gap-2 text-sm text-slate-400"
              id="nav-mobile-lang-btn"
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>
                {language === "zh" ? "简体中文" : "English"}
              </span>
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}
