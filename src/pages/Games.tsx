import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { books } from "../content/books";
import { subjects } from "../content/subjects";
import { paletteFor } from "../design/palette";
import { pad } from "../lib/format";
import type { L } from "../lib/layout";
import type { ProgressApi } from "../lib/progress";

type Dot = { x: number; y: number; vx: number; vy: number };

/* Игровой хаб. Плитки летают по полю и собираются в кольцо.
   Позиции ведём через transform: left/top React сбрасывал бы на каждом ре-рендере. */
export function Games({ L, progress }: { L: L; progress: ProgressApi }) {
  const navigate = useNavigate();
  const subject = subjects[0];
  const [ring, setRing] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const pos = useRef<Dot[]>([]);
  const angle = useRef(0);
  const spawned = useRef(false);
  const ringRef = useRef(ring);
  ringRef.current = ring;

  const base = L.tile;

  // Стартовые точки ставим сразу, а не в первом кадре rAF: в фоновой вкладке
  // кадры троттлятся, и плитки стояли бы стопкой в углу.
  if (pos.current.length === 0) {
    const w0 = typeof window === "undefined" ? 1280 : window.innerWidth;
    const h0 = typeof window === "undefined" ? 720 : window.innerHeight;
    const spread = Math.min(w0, h0 * 0.7) * 0.16;
    pos.current = books.map((_, i) => {
      const a = (i / books.length) * Math.PI * 2;
      return {
        x: w0 / 2 - base / 2 + Math.cos(a) * spread * (0.4 + (i % 4) * 0.2),
        y: h0 * 0.32 - base / 2 + Math.sin(a) * spread * (0.4 + (i % 3) * 0.25),
        vx: (i % 2 ? 1 : -1) * (0.5 + (i % 5) * 0.13),
        vy: (i % 3 ? 1 : -1) * (0.42 + (i % 4) * 0.15),
      };
    });
  }

  const tick = useCallback(() => {
    const box = stage.current;
    // Кадры считаем, только когда поле в DOM — на других экранах цикл простаивает.
    if (!box || !box.isConnected || !tiles.current[0]) return;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const N = books.length;
    const isRing = ringRef.current;

    if (!spawned.current && W > 0 && H > 0) {
      spawned.current = true;
      const cx0 = W / 2 - base / 2;
      const cy0 = H / 2 - base / 2;
      const spread = Math.min(W, H) * 0.16;
      pos.current.forEach((p, i) => {
        const a = (i / N) * Math.PI * 2;
        p.x = cx0 + Math.cos(a) * spread * (0.4 + (i % 4) * 0.2);
        p.y = cy0 + Math.sin(a) * spread * (0.4 + (i % 3) * 0.25);
        p.vx = Math.cos(a) * (0.5 + (i % 5) * 0.12);
        p.vy = Math.sin(a) * (0.45 + (i % 4) * 0.13);
      });
    }

    // В кольце плитка сжимается, чтобы 16 штук встали без наложения.
    let S = base;
    let R = 0;
    if (isRing) {
      const maxR = Math.min(W, H) / 2 - base / 2 - 10;
      const fit = ((2 * Math.PI * maxR) / N) * 0.84;
      S = Math.max(36, Math.min(base, fit));
      R = Math.min(W, H) / 2 - S / 2 - 10;
    }
    const cx = W / 2 - S / 2;
    const cy = H / 2 - S / 2;

    pos.current.forEach((p, i) => {
      const el = tiles.current[i];
      if (!el) return;
      const k = isRing ? S / base : 1;
      const hz = el.dataset.hover ? 1.3 : 1;
      el.style.width = `${isRing ? S : base}px`;
      el.style.height = `${isRing ? S : base}px`;
      el.style.fontSize = `${Math.round(L.tileFont * k)}px`;
      el.style.borderRadius = `${Math.round(L.tileRadius * k)}px`;
      if (isRing) {
        const a = ((i / N) * 360 + angle.current) * (Math.PI / 180);
        p.x += (cx + Math.cos(a) * R - p.x) * 0.12;
        p.y += (cy + Math.sin(a) * R - p.y) * 0.12;
      } else {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > W - base) { p.x = W - base; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > H - base) { p.y = H - base; p.vy = -Math.abs(p.vy); }
      }
      el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) scale(${hz})`;
    });
  }, [base, L.tileFont, L.tileRadius]);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      tick();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [tick]);

  useEffect(() => {
    spawned.current = false;
  }, [base]);

  const drag = (e: React.PointerEvent) => {
    if (!ringRef.current) return;
    let last = e.clientX;
    const move = (ev: PointerEvent) => {
      angle.current += (ev.clientX - last) * 0.4;
      last = ev.clientX;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const openTopic = (i: number) => {
    if (!progress.isUnlocked(i)) return;
    const b = books[i];
    navigate(b.sections.length ? `/s/${subject.id}/${b.slug}` : `/s/${subject.id}`);
  };

  return (
    <div style={{ width: "100%", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          // width:100% обязателен: в flex-колонке горизонтальный margin:auto
          // отменяет растяжение, и шапка съезжает к центру.
          width: "100%", maxWidth: 1240, margin: "0 auto", padding: L.gamesPad, display: "flex",
          alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: L.h1, lineHeight: 0.98, letterSpacing: "-0.04em" }}>Игры</h1>
          <p style={{ marginTop: 16, fontSize: L.sub, lineHeight: 1.4, color: "var(--ink-2)", maxWidth: 620, textWrap: "pretty" }}>
            {ring ? "Крутите кольцо перетаскиванием. Нажмите на плитку, чтобы открыть тему." : "Плитки летают свободно. Нажмите на любую, чтобы открыть тему."}
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setRing((r) => !r)}
          style={{
            padding: L.btnPad, borderRadius: 999, fontSize: L.btn, fontWeight: 500,
            whiteSpace: "nowrap", backgroundColor: "var(--ink)", color: "#FFFFFF",
            transition: "opacity 160ms ease",
          }}
        >
          {ring ? "Разлететься" : "Собрать в круг"}
        </button>
      </div>

      <div
        ref={stage}
        onPointerDown={drag}
        style={{
          // Поле берёт остаток экрана: фиксированная высота промахивалась мимо
          // на заголовке в две строки и кольцо уезжало под нижний край.
          position: "relative", width: "100%", flex: "1 1 auto", minHeight: L.stageMin,
          overflow: "hidden", touchAction: "none", cursor: ring ? "grab" : "default",
        }}
      >
        {books.map((b, i) => (
          <button
            key={b.slug}
            ref={(el) => { tiles.current[i] = el; }}
            className="tile"
            onClick={() => openTopic(i)}
            onPointerEnter={(e) => { (e.currentTarget as HTMLElement).dataset.hover = "1"; }}
            onPointerLeave={(e) => { delete (e.currentTarget as HTMLElement).dataset.hover; }}
            aria-label={`Тема ${pad(b.no)}: ${b.title}`}
            style={{
              position: "absolute", left: 0, top: 0, width: base, height: base,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 500, color: "var(--ink)", userSelect: "none", willChange: "transform",
              backgroundSize: "420% 420%", animation: "holoFlow 14s ease-in-out infinite",
              animationDelay: `${(i % 8) * -0.9}s`,
              backgroundImage: paletteFor(i, subject.hue, subject.hueStep).holo,
              opacity: progress.isUnlocked(i) ? 1 : 0.45,
              transition: "box-shadow 220ms ease, opacity 320ms ease",
            }}
          >
            {pad(b.no)}
          </button>
        ))}
      </div>
    </div>
  );
}
