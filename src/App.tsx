import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Shelf } from "./pages/Shelf";
import { Reader } from "./pages/Reader";
import { Quiz } from "./pages/Quiz";
import { Result } from "./pages/Result";
import { Games } from "./pages/Games";
import { Progress } from "./pages/Progress";
import { useLayout } from "./lib/layout";
import { useProgress } from "./lib/progress";

export default function App() {
  const { L } = useLayout();
  const progress = useProgress();
  const { pathname } = useLocation();
  const page = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  // Смена экрана: наверх и переиграть pageIn.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    const el = page.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "pageIn 520ms var(--ease) both";
  }, [pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {!isHome && <Header L={L} />}
      <div ref={page} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/" element={<Home L={L} />} />
          <Route path="/s/:subjectId" element={<Shelf L={L} progress={progress} />} />
          <Route path="/s/:subjectId/:slug" element={<Reader L={L} progress={progress} />} />
          <Route path="/s/:subjectId/:slug/quiz" element={<Quiz L={L} />} />
          <Route path="/s/:subjectId/:slug/result" element={<Result L={L} progress={progress} />} />
          <Route path="/games" element={<Games L={L} progress={progress} />} />
          <Route path="/me" element={<Progress L={L} progress={progress} />} />
          <Route path="*" element={<Home L={L} />} />
        </Routes>
      </div>
    </div>
  );
}
