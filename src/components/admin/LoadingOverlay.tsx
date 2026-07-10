"use client";

interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
}

export default function LoadingOverlay({ visible, text }: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-[#0e1017]/90 border border-white/[0.08] shadow-2xl">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin" />
        <span className="text-sm font-mono text-slate-400 tracking-wider">{text || '处理中...'}</span>
      </div>
    </div>
  );
}
