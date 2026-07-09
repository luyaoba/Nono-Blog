"use client";

import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Lock, User, Terminal, ShieldAlert, ArrowRight } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToHome: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToHome }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        (import.meta.env.VITE_API_URL || 'https://blog-api.luyaoba61.workers.dev') + '/api/auth/login',
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }
      );
      if (!res.ok) throw new Error('认证失败');
      const data = await res.json();
      onLoginSuccess(data.token);
    } catch {
      setError("认证密钥不匹配。请输入正确的管理员账号。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-6 relative overflow-hidden select-none" id="admin-login-wrapper">
      {/* Visual cyber background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.012)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-30" />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.04] blur-[100px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-[#0a0c14]/70 border border-white/[0.05] rounded-3xl p-8 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] relative z-10"
        id="admin-login-card"
      >
        {/* Terminal Status Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-6 text-[10px] font-mono tracking-wider text-indigo-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SECURE GATE // GATEWAY_09</span>
          </div>
          <div>PORT_3000 // UTC</div>
        </div>

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wider">控制台认证中心</h2>
          <p className="text-xs text-slate-400 mt-1.5 font-mono">ROOT NODE SECURE LOGIN</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="space-y-5" id="login-form">
          <div className="space-y-1.5">
            <label className="text-xs font-mono tracking-wider text-slate-400 pl-1 block">USER ACCOUNT // 账号</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.06] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-mono tracking-wide outline-none transition-all"
                placeholder="请输入管理账号"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono tracking-wider text-slate-400 pl-1 block">SECURE KEY // 密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.06] focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 font-mono tracking-wide outline-none transition-all"
                placeholder="请输入登录密码"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-start gap-2.5 font-sans"
              id="login-error-msg"
            >
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.45)] hover:-translate-y-[1px] active:translate-y-0"
            id="login-submit-btn"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>验证并进入控制台</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToHome}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono cursor-pointer"
            id="login-back-to-site"
          >
            ← RETURN_TO_WEBSITE // 返回主页
          </button>
        </div>
      </motion.div>
    </div>
  );
}
