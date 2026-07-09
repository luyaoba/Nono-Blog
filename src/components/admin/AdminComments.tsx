"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Check, 
  Trash2, 
  AlertOctagon, 
  Clock, 
  Mail, 
  BookOpen, 
  Filter
} from "lucide-react";
import { Comment } from "../../data/mockAdminData";
import { translations } from "../../data/translations";

interface AdminCommentsProps {
  comments: Comment[];
  onUpdateComments: (updated: Comment[]) => void;
  language?: "zh" | "en";
  theme?: "dark" | "light";
}

export default function AdminComments({ comments, onUpdateComments, language = "zh", theme = "dark" }: AdminCommentsProps) {
  const isZh = language === "zh";
  const isLight = theme === "light";
  const handleDelete = (id: string) => {
    if (confirm(isZh ? "确定要永久删除这条评论吗？" : "Are you sure to permanently delete this comment?")) {
      const updated = comments.filter(c => c.id !== id);
      onUpdateComments(updated);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300" id="admin-comments-container">
      {/* Intro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold tracking-wide ${isLight ? "text-slate-800" : "text-white"}`}>{isZh ? "评论与留言管理" : "Comments Management"}</h2>
          <p className={`text-sm mt-2 ${isLight ? "text-slate-600" : "text-slate-400"}`}>{isZh ? "管理读者留言。新提交的评论已配置为自动批准发布。" : "Manage reader comments. New comments are auto-approved."}</p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="space-y-4" id="comments-visual-admin-list">
        <AnimatePresence mode="popLayout">
          {comments.length > 0 ? (
            comments.map((comm) => (
              <motion.div
                key={comm.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-2xl backdrop-blur-md relative overflow-hidden group transition-all flex flex-col md:flex-row gap-5 items-start justify-between ${isLight ? "bg-[#fefdfb] border border-[#e5e2db] shadow-sm hover:border-indigo-300" : "bg-[#0c0e16]/60 border border-white/[0.08] hover:border-indigo-500/10"}`}
              >
                {/* Comment Body */}
                <div className="space-y-3 flex-grow max-w-4xl text-left">
                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-3">
                    <img 
                      src={comm.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${comm.author}`} 
                      alt="avatar" 
                      className="w-6 h-6 rounded-full bg-[#141521] border border-white/10 shrink-0 object-cover"
                    />

                    <span className={`text-sm font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{comm.author}</span>

                    <span className={`text-sm font-mono flex items-center gap-1 ${isLight ? "text-slate-600" : "text-slate-500"}`}>
                      <Mail className={`w-3.5 h-3.5 ${isLight ? "text-slate-500" : "text-slate-600"}`} />
                      {comm.email}
                    </span>

                    <span className={`text-sm font-mono flex items-center gap-1 ${isLight ? "text-slate-600" : "text-slate-500"}`}>
                      <Clock className={`w-3.5 h-3.5 ${isLight ? "text-slate-500" : "text-slate-600"}`} />
                      {comm.date}
                    </span>

                    <span className="text-sm px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase font-mono tracking-wider">
                      {isZh ? "已发布" : "Published"}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className={`text-sm leading-7 font-sans pl-1 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    {comm.content}
                  </p>

                  {/* Article reference */}
                  <div className="flex items-center gap-2 pl-1 text-sm text-indigo-400 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400/60" />
                    <span>{isZh ? "针对文章" : "From Article"}: 《{comm.articleTitle}》</span>
                  </div>
                </div>

                {/* Operations buttons */}
                <div className={`flex items-center gap-2 shrink-0 md:self-center pt-3 md:pt-0 w-full md:w-auto justify-end ${isLight ? "border-t border-[#e5e2db] md:border-none" : "border-t border-white/[0.06] md:border-none"}`}>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(comm.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer flex items-center gap-1.5 text-sm font-semibold px-3"
                    title={isZh ? "永久删除此留言" : "Delete permanently"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isZh ? "永久删除" : "Delete"}</span>
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`py-16 text-center text-slate-500 text-sm font-mono rounded-2xl ${isLight ? "bg-[#fefdfb] border border-[#e5e2db]" : "bg-[#0c0e16]/30 border border-white/[0.08]"}`}>
              {isZh ? "留言板暂无新消息记录" : "No comments yet"}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
