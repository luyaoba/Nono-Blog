"use client";

import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, MapPin, Github, Twitter, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { translations } from "../data/translations";

interface ContactProps {
  glowMode?: boolean;
  theme?: "glow" | "dark" | "light";
  language?: "zh" | "en";
}

export default function Contact({ glowMode = true, theme = "glow", language = "zh" }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const isLight = theme === "light";
  const actualGlow = theme === "glow";
  const isZh = language === "zh";
  const t = translations[language];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    
    // Simulate API delivery
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 relative" id="contact-section">
      {/* Background glow overlay */}
      {actualGlow && (
        <div className="absolute top-[20%] left-[10%] w-[380px] h-[380px] rounded-full bg-indigo-600/[0.01] blur-[150px] pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="mb-12">
        <h1 className={`text-3xl font-extrabold tracking-wider flex items-center gap-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
          {isZh ? "联系我" : "Contact Me"}
          <span className={`text-sm font-mono font-normal px-3 py-1 rounded border ${
            isLight ? "border-indigo-100 bg-indigo-50/50 text-indigo-600" : "border-indigo-500/20 bg-indigo-500/5 text-indigo-400"
          }`}>
            {isZh ? "联络" : "Contact"}
          </span>
        </h1>
        <p className={`text-base mt-3 tracking-wide ${isLight ? "text-slate-600" : "text-slate-300"}`}>{isZh ? "期待交流与合作" : "Looking forward to connecting"}</p>
      </div>

      {/* Grid Layout corresponding to Section 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left column: Contact Info (2/5 size) */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-6 rounded-2xl border backdrop-blur-md flex flex-col gap-6 ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/60 border-white/[0.06] hover:border-white/[0.12]"
            }`}
            id="contact-info-panel"
          >
            <h3 className={`text-base font-bold tracking-widest uppercase border-b pb-2 font-mono ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              {isZh ? "联络渠道" : "Contact Channels"}
            </h3>

            {/* Email */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isLight 
                ? "bg-slate-50 border-slate-100/80 hover:border-indigo-200 hover:bg-slate-100/30" 
                : "bg-white/[0.01] border-white/[0.03] hover:border-white/10"
            }`}>
              <div className={`p-2.5 rounded-lg border ${
                isLight ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}>
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase">{isZh ? "电子邮件" : "Email"}</h4>
                <a href="mailto:hello@nono.com" className={`text-sm md:text-sm font-semibold transition-colors ${
                  isLight ? "text-slate-700 hover:text-indigo-600" : "text-slate-200 hover:text-white"
                }`}>
                  hello@nono.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isLight 
                ? "bg-slate-50 border-slate-100/80 hover:border-indigo-200 hover:bg-slate-100/30" 
                : "bg-white/[0.01] border-white/[0.03] hover:border-white/10"
            }`}>
              <div className={`p-2.5 rounded-lg border ${
                isLight ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase">{isZh ? "当前位置" : "Location"}</h4>
                <span className={`text-sm md:text-sm font-semibold ${isLight ? "text-slate-700" : "text-slate-200"}`}>
                  Earth, Orbiting Sol 📍
                </span>
              </div>
            </div>

            {/* Github */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isLight 
                ? "bg-slate-50 border-slate-100/80 hover:border-indigo-200 hover:bg-slate-100/30" 
                : "bg-white/[0.01] border-white/[0.03] hover:border-white/10"
            }`}>
              <div className={`p-2.5 rounded-lg border ${
                isLight ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}>
                <Github className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase">{isZh ? "代码仓库" : "Code Repo"}</h4>
                <a href="https://github.com/nono" target="_blank" rel="noreferrer" className={`text-sm md:text-sm font-semibold transition-colors ${
                  isLight ? "text-slate-700 hover:text-indigo-600" : "text-slate-200 hover:text-white"
                }`}>
                  github.com/nono
                </a>
              </div>
            </div>

            {/* Twitter */}
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              isLight 
                ? "bg-slate-50 border-slate-100/80 hover:border-indigo-200 hover:bg-slate-100/30" 
                : "bg-white/[0.01] border-white/[0.03] hover:border-white/10"
            }`}>
              <div className={`p-2.5 rounded-lg border ${
                isLight ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }`}>
                <Twitter className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase">{isZh ? "社交平台" : "Social"}</h4>
                <a href="https://twitter.com/nono" target="_blank" rel="noreferrer" className={`text-sm md:text-sm font-semibold transition-colors ${
                  isLight ? "text-slate-700 hover:text-indigo-600" : "text-slate-200 hover:text-white"
                }`}>
                  @nono_dev
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column: Message Form (3/5 size) */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`p-6 rounded-2xl border backdrop-blur-md relative ${
              isLight
                ? "bg-[#fefdfb] border-[#e5e2db] hover:border-indigo-200 hover:shadow-[0_8px_30px_rgba(99,102,241,0.06)]"
                : "bg-[#0c0d14]/60 border-white/[0.06]"
            }`}
            id="contact-form-panel"
          >
            <h3 className={`text-base font-bold tracking-widest uppercase border-b pb-2 mb-6 font-mono text-left ${
              isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"
            }`}>
              {isZh ? "向我留言" : "Send a Message"}
            </h3>

            {/* Success Notification overlay */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute inset-0 z-10 rounded-2xl flex flex-col items-center justify-center p-6 text-center ${
                  isLight ? "bg-[#fefdfb]/95" : "bg-[#07080c]/95"
                }`}
                id="contact-success"
              >
                <CheckCircle2 className={`w-16 h-16 mb-4 animate-bounce ${isLight ? "text-indigo-600" : "text-indigo-400"}`} />
                <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>{isZh ? "留言发送成功！" : "Message Sent!"}</h3>
                <p className="text-sm text-slate-300 max-w-xs mb-6">
                  {isZh ? "感谢您的来信！消息已经通过加密传输送达，我将会在 24 小时内与您取得联系。" : "Thank you! Your message has been delivered. I'll get back to you within 24 hours."}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className={`px-6 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isLight 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)]" 
                      : "bg-white hover:bg-slate-100 text-[#07080c]"
                  }`}
                >
                  {isZh ? "再次发送" : "Send Again"}
                </button>
              </motion.div>
            )}

            {/* Error notifications */}
            {status === "error" && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6 text-sm text-left" id="contact-error-notice">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{isZh ? "请先填写全部必填字段（名字、邮箱及留言内容）。" : "Please fill in all required fields (name, email, and message)."}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 text-left" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
                    {isZh ? "你的名字 *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className={`w-full border focus:ring-1 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-sm tracking-wider outline-none transition-all ${
                      isLight
                        ? "bg-slate-50 border-slate-200/80 focus:border-indigo-500/50 text-slate-800 placeholder-slate-400"
                        : "bg-[#07080c]/60 border-white/[0.04] focus:border-indigo-500/40 focus:ring-1 text-slate-200 placeholder-slate-600"
                    }`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
                    {isZh ? "你的邮箱 *" : "Your Email *"}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full border focus:ring-1 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-sm tracking-wider outline-none transition-all ${
                      isLight
                        ? "bg-slate-50 border-slate-200/80 focus:border-indigo-500/50 text-slate-800 placeholder-slate-400"
                        : "bg-[#07080c]/60 border-white/[0.04] focus:border-indigo-500/40 focus:ring-1 text-slate-200 placeholder-slate-600"
                    }`}
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
                  {isZh ? "主题" : "Subject"}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject of message"
                  className={`w-full border focus:ring-1 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-xs tracking-wider outline-none transition-all ${
                    isLight
                      ? "bg-slate-50 border-slate-200/80 focus:border-indigo-500/50 text-slate-800 placeholder-slate-400"
                      : "bg-[#07080c]/60 border-white/[0.04] focus:border-indigo-500/40 focus:ring-1 text-slate-200 placeholder-slate-600"
                  }`}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
                  {isZh ? "写下你的消息 *" : "Your Message *"}
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className={`w-full border focus:ring-1 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-xs tracking-wider outline-none transition-all resize-none ${
                    isLight
                      ? "bg-slate-50 border-slate-200/80 focus:border-indigo-500/50 text-slate-800 placeholder-slate-400"
                      : "bg-[#07080c]/60 border-white/[0.04] focus:border-indigo-500/40 focus:ring-1 text-slate-200 placeholder-slate-600"
                  }`}
                />
              </div>

              {/* Submit button with glow under it */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={`w-full py-3 rounded-xl font-semibold tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    isLight
                      ? "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
                      : "bg-white hover:bg-slate-100 disabled:bg-slate-400 text-[#07080c] shadow-[0_4px_24px_rgba(255,255,255,0.06)] hover:shadow-[0_4px_30px_rgba(255,255,255,0.15)]"
                  }`}
                  id="contact-submit-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  {status === "sending" ? (isZh ? "发送中..." : "Sending...") : (isZh ? "发送消息" : "Send Message")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
