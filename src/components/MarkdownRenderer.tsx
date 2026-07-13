import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  theme?: "glow" | "dark" | "light";
}

// 从 React children 中提取纯文本
function extractText(children: React.ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) return extractText(children.props.children);
  return '';
}

// 将文本转为 URL 安全的 slug ID
function slugify(text: string): string {
  return text.toLowerCase().replace(/[\s]+/g, '-').replace(/[^\w\u4e00-\u9fff-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'heading';
}

// 代码块组件（带复制按钮）
function CodeBlock({ className, children, isLight }: { className?: string; children: React.ReactNode; isLight: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative rounded-xl border overflow-hidden my-4 ${
      isLight ? "border-[#e5e2db] bg-[#f8f7f4]" : "border-white/[0.04] bg-[#0c0d15]/80"
    }`}>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 p-1.5 rounded-md border transition-colors z-10 ${
          isLight
            ? "bg-[#fefdfb] border-[#e5e2db] hover:bg-[#f0efeb] text-slate-400 hover:text-slate-700"
            : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08] text-slate-400 hover:text-white"
        }`}
        title="复制代码"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <pre className={`p-4 overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, theme = "glow" }: MarkdownRendererProps) {
  const isLight = theme === "light";

  // 无内容时显示占位
  if (!content) {
    return (
      <p className={`text-sm italic ${isLight ? "text-slate-400" : "text-slate-500"}`}>
        暂无内容
      </p>
    );
  }

  return (
    <div className={`markdown-body prose max-w-none text-sm md:text-base leading-relaxed ${
      isLight ? "text-slate-600" : "text-slate-300"
    }`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => {
            const text = extractText(children);
            return (
              <h1 id={slugify(text)} className={`text-xl md:text-2xl font-extrabold pt-6 pb-2 border-b ${isLight ? "text-slate-800 border-[#e5e2db]" : "text-slate-100 border-white/[0.06]"}`}>
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = extractText(children);
            return (
              <h2 id={slugify(text)} className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                <span className="w-1.5 h-6 rounded bg-indigo-500" />
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = extractText(children);
            return (
              <h3 id={slugify(text)} className={`text-base md:text-lg font-semibold pt-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
                {children}
              </h3>
            );
          },
          p: ({ children }) => <p className="my-3">{children}</p>,
          ul: ({ children }) => (
            <ul className={`list-disc list-inside space-y-1 pl-4 my-3 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal list-inside space-y-1 pl-4 my-3 ${isLight ? "text-slate-600" : "text-slate-400"}`}>
              {children}
            </ol>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = className?.includes("hljs");
            if (isBlock) {
              return (
                <CodeBlock className={className} isLight={isLight}>
                  {children}
                </CodeBlock>
              );
            }
            return (
              <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                isLight ? "bg-indigo-50 text-indigo-700" : "bg-indigo-500/15 text-indigo-300"
              }`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          blockquote: ({ children }) => (
            <blockquote className={`border-l-4 pl-4 my-4 italic ${
              isLight ? "border-indigo-200 text-slate-500 bg-indigo-50/50 py-2" : "border-indigo-500/30 text-slate-400 bg-indigo-500/5 py-2"
            }`}>
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className={isLight ? "text-slate-800 font-bold" : "text-slate-100 font-bold"}>{children}</strong>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className={`min-w-full text-sm border-collapse ${isLight ? "border-[#e5e2db]" : "border-white/[0.06]"}`}>
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className={`border px-3 py-2 text-left font-semibold ${
              isLight ? "border-[#e5e2db] bg-[#f0efeb] text-slate-700" : "border-white/[0.06] bg-white/[0.03] text-slate-200"
            }`}>
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={`border px-3 py-2 ${isLight ? "border-[#e5e2db]" : "border-white/[0.06]"}`}>
              {children}
            </td>
          ),
          hr: () => (
            <hr className={`my-8 ${isLight ? "border-[#e5e2db]" : "border-white/[0.06]"}`} />
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="rounded-xl my-4 max-w-full" loading="lazy" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
