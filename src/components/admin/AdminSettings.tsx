"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Settings as SettingsIcon, 
  Github, 
  Mail, 
  Save, 
  Globe, 
  Heart,
  Sparkles,
  Link2,
  Image as ImageIcon,
  Upload,
  MapPin
} from "lucide-react";
import { SiteSettings } from "../../data/mockAdminData";
import { translations } from "../../data/translations";
import { adminApi, api, mapSettings } from "../../api";
import LoadingOverlay from "./LoadingOverlay";

interface AdminSettingsProps {
  settings: SiteSettings;
  onUpdateSettings: (updated: SiteSettings) => void;
  authToken?: string | null;
  onAutoLogout?: () => void;
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminSettings({ settings, onUpdateSettings, authToken, onAutoLogout, language = "zh", theme = "dark" }: AdminSettingsProps) {
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
  const [mail, setMail] = useState(settings.mail);

  const [location, setLocation] = useState(settings.location || "");
  const [siteNotice, setSiteNotice] = useState(settings.siteNotice || "");
  const [siteSloganEn, setSiteSloganEn] = useState(settings.siteSloganEn || "");

  // 页面标题配置
  const [categoriesTitle, setCategoriesTitle] = useState(settings.categoriesTitle || "");
  const [categoriesSubtitle, setCategoriesSubtitle] = useState(settings.categoriesSubtitle || "");
  const [categoriesTitleEn, setCategoriesTitleEn] = useState(settings.categoriesTitleEn || "");
  const [categoriesSubtitleEn, setCategoriesSubtitleEn] = useState(settings.categoriesSubtitleEn || "");
  const [tagsTitle, setTagsTitle] = useState(settings.tagsTitle || "");
  const [tagsSubtitle, setTagsSubtitle] = useState(settings.tagsSubtitle || "");
  const [tagsTitleEn, setTagsTitleEn] = useState(settings.tagsTitleEn || "");
  const [tagsSubtitleEn, setTagsSubtitleEn] = useState(settings.tagsSubtitleEn || "");

  // 首页领域卡片标题
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || "");
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || "");
  const [heroTitleEn, setHeroTitleEn] = useState(settings.heroTitleEn || "");
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(settings.heroSubtitleEn || "");

  // 文章页标题
  const [articlesTitle, setArticlesTitle] = useState(settings.articlesTitle || "");
  const [articlesSubtitle, setArticlesSubtitle] = useState(settings.articlesSubtitle || "");
  const [articlesTitleEn, setArticlesTitleEn] = useState(settings.articlesTitleEn || "");
  const [articlesSubtitleEn, setArticlesSubtitleEn] = useState(settings.articlesSubtitleEn || "");

  // 关于页 - 统计卡片
  const [aboutStatsValue1, setAboutStatsValue1] = useState(settings.aboutStatsValue1 || "");
  const [aboutStatsLabel1, setAboutStatsLabel1] = useState(settings.aboutStatsLabel1 || "");
  const [aboutStatsLabel1En, setAboutStatsLabel1En] = useState(settings.aboutStatsLabel1En || "");
  const [aboutStatsValue2, setAboutStatsValue2] = useState(settings.aboutStatsValue2 || "");
  const [aboutStatsLabel2, setAboutStatsLabel2] = useState(settings.aboutStatsLabel2 || "");
  const [aboutStatsLabel2En, setAboutStatsLabel2En] = useState(settings.aboutStatsLabel2En || "");
  const [aboutStatsValue3, setAboutStatsValue3] = useState(settings.aboutStatsValue3 || "");
  const [aboutStatsLabel3, setAboutStatsLabel3] = useState(settings.aboutStatsLabel3 || "");
  const [aboutStatsLabel3En, setAboutStatsLabel3En] = useState(settings.aboutStatsLabel3En || "");
  // 关于页 - 技术栈与写作方向
  const [aboutFocusTitle, setAboutFocusTitle] = useState(settings.aboutFocusTitle || "");
  const [aboutFocusTitleEn, setAboutFocusTitleEn] = useState(settings.aboutFocusTitleEn || "");
  const [aboutFocus1Title, setAboutFocus1Title] = useState(settings.aboutFocus1Title || "");
  const [aboutFocus1TitleEn, setAboutFocus1TitleEn] = useState(settings.aboutFocus1TitleEn || "");
  const [aboutFocus1Desc, setAboutFocus1Desc] = useState(settings.aboutFocus1Desc || "");
  const [aboutFocus1DescEn, setAboutFocus1DescEn] = useState(settings.aboutFocus1DescEn || "");
  const [aboutFocus2Title, setAboutFocus2Title] = useState(settings.aboutFocus2Title || "");
  const [aboutFocus2TitleEn, setAboutFocus2TitleEn] = useState(settings.aboutFocus2TitleEn || "");
  const [aboutFocus2Desc, setAboutFocus2Desc] = useState(settings.aboutFocus2Desc || "");
  const [aboutFocus2DescEn, setAboutFocus2DescEn] = useState(settings.aboutFocus2DescEn || "");
  const [aboutFocus3Title, setAboutFocus3Title] = useState(settings.aboutFocus3Title || "");
  const [aboutFocus3TitleEn, setAboutFocus3TitleEn] = useState(settings.aboutFocus3TitleEn || "");
  const [aboutFocus3Desc, setAboutFocus3Desc] = useState(settings.aboutFocus3Desc || "");
  const [aboutFocus3DescEn, setAboutFocus3DescEn] = useState(settings.aboutFocus3DescEn || "");

  // Loading overlay
  const [loadingText, setLoadingText] = useState<string | null>(null);

  // 当 settings prop 更新时同步表单状态（保存后 API 重新拉取会触发）
  useEffect(() => {
    setNickname(settings.nickname);
    setTitle(settings.title);
    setAvatarUrl(settings.avatarUrl);
    setBio(settings.bio);
    setSiteTitle(settings.siteTitle);
    setSiteSlogan(settings.siteSlogan);
    setSiteDescription(settings.siteDescription);
    setHomeImage(settings.homeImage || "");
    setGithub(settings.github);
    setMail(settings.mail);
    setLocation(settings.location || "");
    setSiteNotice(settings.siteNotice || "");
    setSiteSloganEn(settings.siteSloganEn || "");
    setCategoriesTitle(settings.categoriesTitle || "");
    setCategoriesSubtitle(settings.categoriesSubtitle || "");
    setCategoriesTitleEn(settings.categoriesTitleEn || "");
    setCategoriesSubtitleEn(settings.categoriesSubtitleEn || "");
    setTagsTitle(settings.tagsTitle || "");
    setTagsSubtitle(settings.tagsSubtitle || "");
    setTagsTitleEn(settings.tagsTitleEn || "");
    setTagsSubtitleEn(settings.tagsSubtitleEn || "");
    setHeroTitle(settings.heroTitle || "");
    setHeroSubtitle(settings.heroSubtitle || "");
    setHeroTitleEn(settings.heroTitleEn || "");
    setHeroSubtitleEn(settings.heroSubtitleEn || "");
    setArticlesTitle(settings.articlesTitle || "");
    setArticlesSubtitle(settings.articlesSubtitle || "");
    setArticlesTitleEn(settings.articlesTitleEn || "");
    setArticlesSubtitleEn(settings.articlesSubtitleEn || "");
    setAboutStatsValue1(settings.aboutStatsValue1 || "");
    setAboutStatsLabel1(settings.aboutStatsLabel1 || "");
    setAboutStatsLabel1En(settings.aboutStatsLabel1En || "");
    setAboutStatsValue2(settings.aboutStatsValue2 || "");
    setAboutStatsLabel2(settings.aboutStatsLabel2 || "");
    setAboutStatsLabel2En(settings.aboutStatsLabel2En || "");
    setAboutStatsValue3(settings.aboutStatsValue3 || "");
    setAboutStatsLabel3(settings.aboutStatsLabel3 || "");
    setAboutStatsLabel3En(settings.aboutStatsLabel3En || "");
    setAboutFocusTitle(settings.aboutFocusTitle || "");
    setAboutFocusTitleEn(settings.aboutFocusTitleEn || "");
    setAboutFocus1Title(settings.aboutFocus1Title || "");
    setAboutFocus1TitleEn(settings.aboutFocus1TitleEn || "");
    setAboutFocus1Desc(settings.aboutFocus1Desc || "");
    setAboutFocus1DescEn(settings.aboutFocus1DescEn || "");
    setAboutFocus2Title(settings.aboutFocus2Title || "");
    setAboutFocus2TitleEn(settings.aboutFocus2TitleEn || "");
    setAboutFocus2Desc(settings.aboutFocus2Desc || "");
    setAboutFocus2DescEn(settings.aboutFocus2DescEn || "");
    setAboutFocus3Title(settings.aboutFocus3Title || "");
    setAboutFocus3TitleEn(settings.aboutFocus3TitleEn || "");
    setAboutFocus3Desc(settings.aboutFocus3Desc || "");
    setAboutFocus3DescEn(settings.aboutFocus3DescEn || "");
  }, [settings]);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = async () => {
    setLoadingText(isZh ? "保存中..." : "Saving...");
    const updated: SiteSettings = {
      nickname, title, avatarUrl, bio,
      siteTitle, siteSlogan, siteDescription,
      github, mail, homeImage,
      location, siteNotice, siteSloganEn,
      categoriesTitle, categoriesSubtitle, categoriesTitleEn, categoriesSubtitleEn,
      tagsTitle, tagsSubtitle, tagsTitleEn, tagsSubtitleEn,
      heroTitle, heroSubtitle, heroTitleEn, heroSubtitleEn,
      articlesTitle, articlesSubtitle, articlesTitleEn, articlesSubtitleEn,
      aboutStatsValue1, aboutStatsLabel1, aboutStatsLabel1En,
      aboutStatsValue2, aboutStatsLabel2, aboutStatsLabel2En,
      aboutStatsValue3, aboutStatsLabel3, aboutStatsLabel3En,
      aboutFocusTitle, aboutFocusTitleEn,
      aboutFocus1Title, aboutFocus1TitleEn, aboutFocus1Desc, aboutFocus1DescEn,
      aboutFocus2Title, aboutFocus2TitleEn, aboutFocus2Desc, aboutFocus2DescEn,
      aboutFocus3Title, aboutFocus3TitleEn, aboutFocus3Desc, aboutFocus3DescEn,
    };
    // 更新本地状态
    onUpdateSettings(updated);
    // 持久化到 D1
    if (authToken) {
      try {
        await adminApi.updateSettings(authToken, {
          nickname, title, avatarUrl, bio,
          siteTitle, siteSlogan, siteDescription,
          github, mail, homeImage,
          location, siteNotice, siteSloganEn,
          categoriesTitle, categoriesSubtitle, categoriesTitleEn, categoriesSubtitleEn,
          tagsTitle, tagsSubtitle, tagsTitleEn, tagsSubtitleEn,
          heroTitle, heroSubtitle, heroTitleEn, heroSubtitleEn,
          articlesTitle, articlesSubtitle, articlesTitleEn, articlesSubtitleEn,
          aboutStatsValue1, aboutStatsLabel1, aboutStatsLabel1En,
          aboutStatsValue2, aboutStatsLabel2, aboutStatsLabel2En,
          aboutStatsValue3, aboutStatsLabel3, aboutStatsLabel3En,
          aboutFocusTitle, aboutFocusTitleEn,
          aboutFocus1Title, aboutFocus1TitleEn, aboutFocus1Desc, aboutFocus1DescEn,
          aboutFocus2Title, aboutFocus2TitleEn, aboutFocus2Desc, aboutFocus2DescEn,
          aboutFocus3Title, aboutFocus3TitleEn, aboutFocus3Desc, aboutFocus3DescEn,
        });
        // 保存成功后重新从 API 拉取最新配置，确保前端同步
        try {
          const freshSettings = await api.getSettings();
          onUpdateSettings(mapSettings(freshSettings));
        } catch {}
        showToast(isZh ? "保存成功！已同步到全站" : "Settings saved & synced!");
      } catch (err: any) {
        console.error("Settings save error:", err);
        const msg = err?.message || '';
        if (msg.includes('401') || msg.includes('未授权')) {
          showToast(isZh ? "登录已过期，即将返回登录页" : "Session expired, redirecting to login");
          setTimeout(() => onAutoLogout?.(), 1500);
        } else {
          showToast(isZh ? `保存失败：${msg || '请重试'}` : `Save failed: ${msg || 'please retry'}`);
        }
      }
    } else {
      showToast(isZh ? "已保存（仅本地）" : "Saved (local only)");
    }
    setLoadingText(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-settings-container">
      <LoadingOverlay visible={!!loadingText} text={loadingText || undefined} />
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
                        if (file.size > 5 * 1024 * 1024) {
                          alert(isZh ? '图片大小不能超过 5MB' : 'Image size must be under 5MB');
                          return;
                        }
                        if (authToken) {
                          setLoadingText(isZh ? "上传头像中..." : "Uploading avatar...");
                          try {
                            const res = await adminApi.uploadImage(authToken, file, 'avatars');
                            if (res.url) setAvatarUrl(res.url);
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => setAvatarUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                          setLoadingText(null);
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

              {/* Location */}
              <div className="space-y-1.5 md:col-span-2">
                <label className={`text-sm font-medium block pl-1 flex items-center gap-1.5 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {isZh ? "位置/坐标" : "Location"}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder={isZh ? "如：坐标地球 📍" : "e.g. Based in Earth 📍"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              {/* English Slogan */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "英文标语" : "English Slogan"}</label>
                <input
                  type="text"
                  value={siteSloganEn}
                  onChange={(e) => setSiteSloganEn(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder="Minimalist Space Blog"
                />
              </div>

              {/* Site Notice/Badge */}
              <div className="space-y-1.5">
                <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "首页徽章文本" : "Hero Badge Text"}</label>
                <input
                  type="text"
                  value={siteNotice}
                  onChange={(e) => setSiteNotice(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                  placeholder={isZh ? "探索 · 记录 · 分享" : "EXPLORE · RECORD · SHARE"}
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
                        if (file.size > 5 * 1024 * 1024) {
                          alert(isZh ? '图片大小不能超过 5MB' : 'Image size must be under 5MB');
                          return;
                        }
                        if (authToken) {
                          setLoadingText(isZh ? "上传背景图中..." : "Uploading image...");
                          try {
                            const res = await adminApi.uploadImage(authToken, file, 'backgrounds');
                            if (res.url) setHomeImage(res.url);
                          } catch {
                            const reader = new FileReader();
                            reader.onloadend = () => setHomeImage(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                          setLoadingText(null);
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

      {/* 页面标题配置 */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
        <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
          <SettingsIcon className="w-4.5 h-4.5" />
          <span>{isZh ? "页面标题与描述配置" : "Page Titles & Descriptions"}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类页标题" : "Categories Title"}</label>
            <input type="text" value={categoriesTitle} onChange={e => setCategoriesTitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="分类" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类页标题 (EN)" : "Categories Title (EN)"}</label>
            <input type="text" value={categoriesTitleEn} onChange={e => setCategoriesTitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Categories" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类页副标题" : "Categories Subtitle"}</label>
            <input type="text" value={categoriesSubtitle} onChange={e => setCategoriesSubtitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="分类探寻我感兴趣的研究与工程实践领域" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "分类页副标题 (EN)" : "Categories Subtitle (EN)"}</label>
            <input type="text" value={categoriesSubtitleEn} onChange={e => setCategoriesSubtitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Explore my areas of research and engineering practice" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签页标题" : "Tags Title"}</label>
            <input type="text" value={tagsTitle} onChange={e => setTagsTitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="标签" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签页标题 (EN)" : "Tags Title (EN)"}</label>
            <input type="text" value={tagsTitleEn} onChange={e => setTagsTitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Tags" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签页副标题" : "Tags Subtitle"}</label>
            <input type="text" value={tagsSubtitle} onChange={e => setTagsSubtitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="按标签检索与筛选本站内容" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "标签页副标题 (EN)" : "Tags Subtitle (EN)"}</label>
            <input type="text" value={tagsSubtitleEn} onChange={e => setTagsSubtitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Filter content by tags" />
          </div>
          {/* 文章页标题 */}
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章页标题" : "Articles Title"}</label>
            <input type="text" value={articlesTitle} onChange={e => setArticlesTitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="文章" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章页标题 (EN)" : "Articles Title (EN)"}</label>
            <input type="text" value={articlesTitleEn} onChange={e => setArticlesTitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Articles" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章页副标题" : "Articles Subtitle"}</label>
            <input type="text" value={articlesSubtitle} onChange={e => setArticlesSubtitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="记录学习与思考的点滴" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "文章页副标题 (EN)" : "Articles Subtitle (EN)"}</label>
            <input type="text" value={articlesSubtitleEn} onChange={e => setArticlesSubtitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Recording learning and reflections" />
          </div>
        </div>
      </div>

      {/* 首页领域卡片标题配置 */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
        <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
          <Sparkles className="w-4.5 h-4.5" />
          <span>{isZh ? "首页领域卡片标题" : "Hero Domain Card Titles"}</span>
        </h3>
        <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "控制首页“领域”卡片的标题和副标题，独立于分类页配置。" : "Controls the Hero domain card titles, independent from Categories page."}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "领域标题" : "Hero Title"}</label>
            <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="领域" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "领域标题 (EN)" : "Hero Title (EN)"}</label>
            <input type="text" value={heroTitleEn} onChange={e => setHeroTitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Domains" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "领域副标题" : "Hero Subtitle"}</label>
            <input type="text" value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="记录与开发相关的核心技能与技术领域" />
          </div>
          <div className="space-y-1.5">
            <label className={`text-sm font-medium block pl-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "领域副标题 (EN)" : "Hero Subtitle (EN)"}</label>
            <input type="text" value={heroSubtitleEn} onChange={e => setHeroSubtitleEn(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
              placeholder="Documenting core skills and technical domains" />
          </div>
        </div>
      </div>

      {/* 关于页配置 */}
      <div className={`p-6 rounded-2xl backdrop-blur-xl space-y-5 ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm" : "bg-[#0c0e16]/70 border border-white/[0.08]"}`}>
        <h3 className={`text-sm font-bold text-indigo-400 flex items-center gap-2 pb-3 uppercase tracking-wider ${isLight ? "border-b border-[#e5e2db]" : "border-b border-white/[0.06]"}`}>
          <User className="w-4.5 h-4.5" />
          <span>{isZh ? "关于页配置" : "About Page Settings"}</span>
        </h3>

        {/* 统计卡片 */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "统计卡片" : "Stats Card"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第1项数值" : "Item 1 Value"}</label>
              <input type="text" value={aboutStatsValue1} onChange={e => setAboutStatsValue1(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="8+" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第1项标签" : "Item 1 Label"}</label>
              <input type="text" value={aboutStatsLabel1} onChange={e => setAboutStatsLabel1(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="原创文章" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第1项标签 (EN)" : "Item 1 Label (EN)"}</label>
              <input type="text" value={aboutStatsLabel1En} onChange={e => setAboutStatsLabel1En(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Original Articles" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第2项数值" : "Item 2 Value"}</label>
              <input type="text" value={aboutStatsValue2} onChange={e => setAboutStatsValue2(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="16" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第2项标签" : "Item 2 Label"}</label>
              <input type="text" value={aboutStatsLabel2} onChange={e => setAboutStatsLabel2(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="技术标签" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第2项标签 (EN)" : "Item 2 Label (EN)"}</label>
              <input type="text" value={aboutStatsLabel2En} onChange={e => setAboutStatsLabel2En(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Tech Tags" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第3项数值" : "Item 3 Value"}</label>
              <input type="text" value={aboutStatsValue3} onChange={e => setAboutStatsValue3(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="✓" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第3项标签" : "Item 3 Label"}</label>
              <input type="text" value={aboutStatsLabel3} onChange={e => setAboutStatsLabel3(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="持续更新中" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "第3项标签 (EN)" : "Item 3 Label (EN)"}</label>
              <input type="text" value={aboutStatsLabel3En} onChange={e => setAboutStatsLabel3En(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Actively Updating" />
            </div>
          </div>
        </div>

        {/* 技术栈与写作方向 */}
        <div className={`space-y-3 pt-4 ${isLight ? "border-t border-[#e5e2db]" : "border-t border-white/[0.06]"}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "技术栈与写作方向" : "Tech Stack & Writing Focus"}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "区块标题" : "Section Title"}</label>
              <input type="text" value={aboutFocusTitle} onChange={e => setAboutFocusTitle(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="技术栈与写作方向" />
            </div>
            <div className="space-y-1.5">
              <label className={`text-xs font-medium block pl-1 ${isLight ? "text-slate-500" : "text-slate-500"}`}>{isZh ? "区块标题 (EN)" : "Section Title (EN)"}</label>
              <input type="text" value={aboutFocusTitleEn} onChange={e => setAboutFocusTitleEn(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Tech Stack & Writing Focus" />
            </div>
          </div>

          {/* Focus 1 */}
          <div className={`p-4 rounded-xl ${isLight ? "bg-slate-50/60 border border-slate-200/50" : "bg-white/[0.02] border border-white/[0.04]"}`}>
            <p className={`text-xs font-bold mb-3 ${isLight ? "text-slate-700" : "text-slate-300"}`}>{isZh ? "方向 1（代码图标）" : "Area 1 (Code icon)"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value={aboutFocus1Title} onChange={e => setAboutFocus1Title(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "标题" : "Title"} />
              <input type="text" value={aboutFocus1TitleEn} onChange={e => setAboutFocus1TitleEn(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Title (EN)" />
              <textarea value={aboutFocus1Desc} onChange={e => setAboutFocus1Desc(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "描述" : "Description"} />
              <textarea value={aboutFocus1DescEn} onChange={e => setAboutFocus1DescEn(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Description (EN)" />
            </div>
          </div>

          {/* Focus 2 */}
          <div className={`p-4 rounded-xl ${isLight ? "bg-slate-50/60 border border-slate-200/50" : "bg-white/[0.02] border border-white/[0.04]"}`}>
            <p className={`text-xs font-bold mb-3 ${isLight ? "text-slate-700" : "text-slate-300"}`}>{isZh ? "方向 2（层叠图标）" : "Area 2 (Layers icon)"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value={aboutFocus2Title} onChange={e => setAboutFocus2Title(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "标题" : "Title"} />
              <input type="text" value={aboutFocus2TitleEn} onChange={e => setAboutFocus2TitleEn(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Title (EN)" />
              <textarea value={aboutFocus2Desc} onChange={e => setAboutFocus2Desc(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "描述" : "Description"} />
              <textarea value={aboutFocus2DescEn} onChange={e => setAboutFocus2DescEn(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Description (EN)" />
            </div>
          </div>

          {/* Focus 3 */}
          <div className={`p-4 rounded-xl ${isLight ? "bg-slate-50/60 border border-slate-200/50" : "bg-white/[0.02] border border-white/[0.04]"}`}>
            <p className={`text-xs font-bold mb-3 ${isLight ? "text-slate-700" : "text-slate-300"}`}>{isZh ? "方向 3（画笔图标）" : "Area 3 (Pen icon)"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" value={aboutFocus3Title} onChange={e => setAboutFocus3Title(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "标题" : "Title"} />
              <input type="text" value={aboutFocus3TitleEn} onChange={e => setAboutFocus3TitleEn(e.target.value)}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Title (EN)" />
              <textarea value={aboutFocus3Desc} onChange={e => setAboutFocus3Desc(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder={isZh ? "描述" : "Description"} />
              <textarea value={aboutFocus3DescEn} onChange={e => setAboutFocus3DescEn(e.target.value)} rows={2}
                className={`w-full border rounded-xl px-3 py-2 text-sm outline-none resize-none focus:border-indigo-500/40 ${isLight ? "bg-[#f8f7f4] border-[#e5e2db] text-slate-800" : "bg-black/40 border-white/[0.08] text-slate-100"}`}
                placeholder="Description (EN)" />
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
