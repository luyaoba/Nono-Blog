const fs = require('fs');

// === Fix Hero.tsx: remove meteor + bottom gradient ===
let hero = fs.readFileSync('src/components/Hero.tsx', 'utf8');

// Remove the bottom gradient transition block (lines 440-449)
const gradStart = '      {/* Bottom gradient transition: fade Hero background into Tags section below */}';
const gradEnd = '      />\n\n      {/* Subtle meteor streaks';
const gradIdx = hero.indexOf(gradStart);
const gradEndIdx = hero.indexOf(gradEnd);
if (gradIdx !== -1 && gradEndIdx !== -1) {
  hero = hero.slice(0, gradIdx) + hero.slice(gradEndIdx + gradEnd.length - '\n\n      {/* Subtle meteor streaks'.length);
}

// Remove the meteor streaks block
const meteorStart = '      {/* Subtle meteor streaks for space-minimal ambience */}';
const meteorEnd = "      )}\n    </div>";
const meteorIdx = hero.indexOf(meteorStart);
const meteorEndIdx = hero.indexOf(meteorEnd, meteorIdx);
if (meteorIdx !== -1 && meteorEndIdx !== -1) {
  hero = hero.slice(0, meteorIdx) + hero.slice(meteorEndIdx + '      )}\n'.length);
}

fs.writeFileSync('src/components/Hero.tsx', hero);
console.log('[OK] Hero.tsx: meteor + bottom gradient removed');


// === Fix AdminPosts.tsx: cursor-aware paste + reliable scroll sync ===
let posts = fs.readFileSync('src/components/admin/AdminPosts.tsx', 'utf8');

// 1. Add cursorPosRef alongside isSyncingScroll
const oldSync = '  const isSyncingScroll = useRef(false);';
posts = posts.replace(oldSync,
  oldSync + '\n  const cursorPosRef = useRef<number>(0);'
);

// 2. Replace the scroll sync useEffect to remove editMarkdown from deps and use setTimeout
const oldEffect = `  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;
    const onLeftScroll = () => {
      if (isSyncingScroll.current) return;
      const max = left.scrollHeight - left.clientHeight;
      if (max <= 0) return;
      const ratio = left.scrollTop / max;
      const rMax = right.scrollHeight - right.clientHeight;
      isSyncingScroll.current = true;
      right.scrollTop = ratio * rMax;
      requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };
    const onRightScroll = () => {
      if (isSyncingScroll.current) return;
      const max = right.scrollHeight - right.clientHeight;
      if (max <= 0) return;
      const ratio = right.scrollTop / max;
      const lMax = left.scrollHeight - left.clientHeight;
      isSyncingScroll.current = true;
      left.scrollTop = ratio * lMax;
      requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };
    left.addEventListener("scroll", onLeftScroll, { passive: true });
    right.addEventListener("scroll", onRightScroll, { passive: true });
    return () => {
      left.removeEventListener("scroll", onLeftScroll);
      right.removeEventListener("scroll", onRightScroll);
    };
  }, [isEditing, editMarkdown]);`;

const newEffect = `  useEffect(() => {
    // Wait a tick for refs to attach after render
    const timer = setTimeout(() => {
      const left = leftRef.current;
      const right = rightRef.current;
      if (!left || !right) return;
      const onLeftScroll = () => {
        if (isSyncingScroll.current) return;
        const max = left.scrollHeight - left.clientHeight;
        if (max <= 0) return;
        const ratio = left.scrollTop / max;
        const rMax = right.scrollHeight - right.clientHeight;
        if (rMax <= 0) return;
        isSyncingScroll.current = true;
        right.scrollTop = ratio * rMax;
        setTimeout(() => { isSyncingScroll.current = false; }, 50);
      };
      const onRightScroll = () => {
        if (isSyncingScroll.current) return;
        const max = right.scrollHeight - right.clientHeight;
        if (max <= 0) return;
        const ratio = right.scrollTop / max;
        const lMax = left.scrollHeight - left.clientHeight;
        if (lMax <= 0) return;
        isSyncingScroll.current = true;
        left.scrollTop = ratio * lMax;
        setTimeout(() => { isSyncingScroll.current = false; }, 50);
      };
      left.addEventListener("scroll", onLeftScroll, { passive: true });
      right.addEventListener("scroll", onRightScroll, { passive: true });
      // Store cleanup fn on element for effect cleanup
      (left as any).__scrollCleanup = () => left.removeEventListener("scroll", onLeftScroll);
      (right as any).__scrollCleanup = () => right.removeEventListener("scroll", onRightScroll);
    }, 100);
    return () => {
      clearTimeout(timer);
      const left = leftRef.current;
      const right = rightRef.current;
      if (left && (left as any).__scrollCleanup) (left as any).__scrollCleanup();
      if (right && (right as any).__scrollCleanup) (right as any).__scrollCleanup();
    };
  }, [isEditing]);`;

posts = posts.replace(oldEffect, newEffect);

// 3. Modify uploadAndInsertImage to insert at cursor position
const oldInsert = `          const imgMd = \`![\${file.name}](\${res.url})\`;
          setEditMarkdown(prev => prev + '\\n' + imgMd + '\\n');`;
const newInsert = `          const imgMd = \`![\${file.name}](\${res.url})\`;
          setEditMarkdown(prev => {
            const pos = cursorPosRef.current;
            const before = prev.slice(0, pos);
            const after = prev.slice(pos);
            const insert = (before.endsWith('\\n') || before === '') ? imgMd : '\\n' + imgMd;
            return before + insert + '\\n' + after;
          });`;
posts = posts.replace(oldInsert, newInsert);

// 4. Add cursor position tracking to textarea - add onSelect + update onChange
const oldTextarea = `                  ref={leftRef}
                  value={editMarkdown}
                  onChange={(e) => setEditMarkdown(e.target.value)}`;
const newTextarea = `                  ref={leftRef}
                  value={editMarkdown}
                  onChange={(e) => { setEditMarkdown(e.target.value); cursorPosRef.current = e.target.selectionStart; }}
                  onSelect={(e) => { cursorPosRef.current = (e.target as HTMLTextAreaElement).selectionStart; }}`;
posts = posts.replace(oldTextarea, newTextarea);

fs.writeFileSync('src/components/admin/AdminPosts.tsx', posts);
console.log('[OK] AdminPosts.tsx: cursor-aware paste + reliable scroll sync');
