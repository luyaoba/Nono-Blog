"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Settings as SettingsIcon, 
  Github, 
  Twitter, 
  Mail, 
  Save, 
  Globe, 
  Heart,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { SiteSettings } from "../../data/mockAdminData";
import { translations } from "../../data/translations";
import { adminApi } from "../../api";

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdateSettings: (updated: SiteSettings) => void;
  authToken?: string | null;
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminSettings({ settings, onUpdateSettings, authToken, language = "zh", theme = "dark" }: AdminSettingsProps) {
  const isZh = language === "zh";
  const isLight = theme === "light";
  // Form States
  const [nickname, setNickname] = useState(settings.nickname);
  const [title, setTitle] = useState(settings.title);
  const [avatarUrl, setAvatarUrl] = useState(settings.avatarUrl);
  const [bio, setBio] = useState(settings.bio);

  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [siteSlogan, setSiteSlogan] = useState(settings.siteSlogan);
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription);
  const [homeImage, setHomeImage] = useState(settings.homeImage || "");

  const [github, setGithub] = useState(settings.github);
  const [twitter, setTwitter] = useState(settings.twitter);
  const [mail, setMail] = useState(settings.mail);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    const updated: SiteSettings = {
      nickname,
      title,
      avatarUrl,
      bio,
      siteTitle,
      siteSlogan,
      siteDescription,
      github,
      twitter,
      mail,
      homeImage,
    };
    // 更新本地状态
    onUpdateSettings(updated);
    // 持久化到 D1
    if (authToken) {
      try {
        await adminApi.updateSettings(authToken, {
          nickname, title, avatarUrl, bio,
          siteTitle, siteSlogan, siteDescription,
          github, twitter, mail, homeImage,
        });
        showToast(isZh ? "保存成功！" : "Settings saved successfully!");
      } catch {
        showToast(isZh ? "保存失败，请重试" : "Save failed, please retry");
      }
    } else {
      showToast(isZh ? "已保存（仅本地）" : "Saved (local only)");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-settings-container">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-wide ${isLight ? "text-slate-800" : "text-white"}`}>{isZh ? "站点与个人属性配置" : "Site & Profile Settings"}</h2>
          <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "管理核心信息。本页的修改将直接应用于博客前端。" : "Manage core info. Changes apply to the blog frontend."}</p>
        </div>

        <button
          onClick={handleSave}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_25px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
          id="settings-save-btn"
        >
          <Save className="w-4 h-4" />
          <span>{isZh ? "保存全部修改" : "Save All Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-bento-grid">
        
        {/* Box 1: Profile Settings (2 cols span) */}
        <div className="lg:col-span-2 space-y-6" id="settings-personal-section">
          {/* Bento Block 1: Profile card */}
          <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
            <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
              <User className="w-4.5 h-4.5" />
              <span>{isZh ? "站长个人名片设置" : "Profile Settings"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nickname */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "站长昵称" : "Nickname"}</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder="如: Nono"
                />
              </div>

              {/* Professional Title */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "头衔/标语职位" : "Title/Position"}</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder="如: 全栈开发者 & 独立设计师"
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "头像图片链接" : "Avatar URL"}</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                    placeholder="https://example.com/avatar.png"
                  />
                  {/* Direct File Upload */}
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="avatar-file-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (authToken) {
                          try {
                            const res = await adminApi.uploadImage(authToken, file);
                            if (res.url) setAvatarUrl(res.url);
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => setAvatarUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        } else {
                          const reader = new FileReader();
                          reader.onloadend = () => setAvatarUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="avatar-file-upload"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer text-sm font-semibold h-full justify-center"
                    >
                      <Upload className="w-4 h-4 shrink-0" />
                    </label>
                  </div>
                  <img
                    src={avatarUrl}
                    alt="avatar preview"
                    className="w-9 h-9 rounded-xl border border-white/10 shrink-0 bg-[#0f111a]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/pixel-art/svg?seed=fallback";
                    }}
                  />
                </div>
              </div>

              {/* Bio description */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "站长简介说明" : "Bio"}</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`w-full border rounded-xl p-4 text-sm outline-none resize-none leading-relaxed focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-200"}`}
                  placeholder="写下关于你的经历和理念..."
                />
              </div>
            </div>
          </div>

          {/* Bento Block 2: Social media details */}
          <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
            <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
              <Link2 className="w-4.5 h-4.5" />
              <span>{isZh ? "社交矩阵渠道网络" : "Social Channels"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* GitHub */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 flex items-center gap-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <Github className="w-3.5 h-3.5 text-slate-500" /> {isZh ? "GitHub 链接" : "GitHub URL"}
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 transition-colors ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-100"
                  }`}
                />
              </div>

              {/* Twitter/X */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 flex items-center gap-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <Twitter className="w-3.5 h-3.5 text-slate-500" /> {isZh ? "Twitter/X 链接" : "Twitter/X URL"}
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 transition-colors ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-100"
                  }`}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 flex items-center gap-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {isZh ? "联系邮箱" : "Contact Email"}
                </label>
                <input
                  type="text"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 transition-colors ${
                    isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-100"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Site SEO Settings (1 col span) */}
        <div className="space-y-6" id="settings-site-seo-section">
          <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 h-full flex flex-col justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
            <div className="space-y-5">
              <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
                <Globe className="w-4.5 h-4.5" />
                <span>{isZh ? "站点配置与全局 SEO" : "Site Config & SEO"}</span>
              </h3>

              {/* Site Name */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "网站名称" : "Site Title"}</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder="如: Space Minimalist Blog"
                />
              </div>

              {/* Slogan */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "主页大标语" : "Homepage Slogan"}</label>
                <input
                  type="text"
                  value={siteSlogan}
                  onChange={(e) => setSiteSlogan(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder={isZh ? "探索 · 记录 · 分享" : "Explore · Record · Share"}
                />
              </div>

              {/* Configurable homepage banner image URL */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 flex items-center gap-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> {isZh ? "主页个性化背景大图" : "Homepage Background Image"}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={homeImage}
                    onChange={(e) => setHomeImage(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none font-mono focus:border-indigo-500/40 transition-colors ${
                      isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-100"
                    }`}
                    placeholder={isZh ? "留空即使用太空动态 SVG" : "Leave empty for default space SVG"}
                  />
                  {/* Direct File Upload */}
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="home-bg-file-upload"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (authToken) {
                          try {
                            const res = await adminApi.uploadImage(authToken, file);
                            if (res.url) setHomeImage(res.url);
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => setHomeImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        } else {
                          const reader = new FileReader();
                          reader.onloadend = () => setHomeImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="home-bg-file-upload"
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all cursor-pointer text-sm font-semibold h-full justify-center"
                    >
                      <Upload className="w-4 h-4 shrink-0" />
                    </label>
                  </div>
                </div>
                <span className={`text-xs block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "输入图片 URL 或点击上传按钮直接上传本地图片。" : "Enter image URL or click upload button."}</span>
              </div>

              {/* SEO Description */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "搜索引擎描述" : "SEO Description"}</label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={4}
                  className={`w-full border rounded-xl p-4 text-sm outline-none resize-none leading-relaxed focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-700" : "bg-black/40 border-white/[0.08] text-slate-200"}`}
                  placeholder="给蜘蛛爬虫读取的站点详情描述..."
                />
              </div>
            </div>

            {/* Micro visual indicator */}
            <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2.5 mt-4">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs text-indigo-300 leading-snug">
                {isZh ? "SEO部署状态：成功 | 站点属性与主页背景大图配置已实时生效。" : "SEO Status: Active | All settings applied in real-time."}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-8 left-1/2 z-[999] px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold shadow-[0_8px_30px_rgba(16,185,129,0.3)] flex items-center gap-2 select-none"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
