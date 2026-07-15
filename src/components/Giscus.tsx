import { useEffect, useRef } from "react";

interface GiscusProps {
  theme?: "dark" | "light";
  articleId?: string;
}

export default function Giscus({ theme = "dark", articleId }: GiscusProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 清除旧实例
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    // Giscus 主题映射
    const giscusTheme = theme === "light" ? "light" : "dark_dimmed";

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "luyaoba/Nono-Blog");
    script.setAttribute("data-repo-id", "R_kgDOTS7Ayw");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOTS7Ay84DA0lV");
    // 使用 articleId 作为 term，确保每篇文章对应独立的评论讨论
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", articleId || "default");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
  }, [theme, articleId]);

  return <div ref={containerRef} className="mt-12" />;
}
