import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownRendererProps {
  content: string;
  theme?: "glow" | "dark" | "light";
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
          h2: ({ children, id }) => (
            <h2 id={id} className={`text-lg md:text-xl font-bold pt-4 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              <span className="w-1.5 h-6 rounded bg-indigo-500" />
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 id={id} className={`text-base md:text-lg font-semibold pt-3 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              {children}
            </h3>
          ),
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
                <div className={`relative rounded-xl border overflow-hidden my-4 ${
                  isLight ? "border-[#e5e2db] bg-[#f8f7f4]" : "border-white/[0.04] bg-[#0c0d15]/80"
                }`}>
                  <pre className={`p-4 overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    <code className={className} {...props}>{children}</code>
                  </pre>
                </div>
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
