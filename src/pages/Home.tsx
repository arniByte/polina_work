import { useNavigate } from "react-router-dom";
import { subjects } from "../content/subjects";
import type { L } from "../lib/layout";

/* Первый экран: ничего, кроме выбора дисциплины. */
export function Home({ L }: { L: L }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: L.homePad,
      }}
    >
      {/* Пятна живут в своём слое: overflow на контейнере контента срезал бы сферу. */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <span
          style={{
            position: "absolute", top: "-12vh", left: "-8vw", width: "46vw", height: "46vw",
            borderRadius: 999, filter: "blur(60px)", opacity: 0.55,
            background: "radial-gradient(circle at 40% 40%, oklch(0.92 0.07 196) 0%, oklch(0.88 0.06 250) 60%, transparent 72%)",
            animation: "driftA 34s ease-in-out infinite alternate",
          }}
        />
        <span
          style={{
            position: "absolute", bottom: "-18vh", right: "-10vw", width: "52vw", height: "52vw",
            borderRadius: 999, filter: "blur(70px)", opacity: 0.5,
            background: "radial-gradient(circle at 50% 50%, oklch(0.91 0.07 322) 0%, oklch(0.90 0.05 280) 58%, transparent 72%)",
            animation: "driftB 44s ease-in-out infinite alternate",
          }}
        />
        <span
          style={{
            position: "absolute", top: "34vh", right: "22vw", width: "26vw", height: "26vw",
            borderRadius: 999, filter: "blur(54px)", opacity: 0.42,
            background: "radial-gradient(circle at 50% 50%, oklch(0.93 0.06 168) 0%, transparent 70%)",
            animation: "driftC 38s ease-in-out infinite alternate",
          }}
        />
      </div>

      <div
        style={{
          position: "relative", fontWeight: 500, fontSize: L.homeLogo,
          letterSpacing: "-0.03em", lineHeight: 1,
          animation: "riseIn 900ms cubic-bezier(.16,.84,.24,1) both",
        }}
      >
        ПИКС
      </div>
      <p
        style={{
          position: "relative", marginTop: 20, fontSize: L.homeNote, color: "var(--ink-2)",
          animation: "riseIn 900ms cubic-bezier(.16,.84,.24,1) 120ms both",
        }}
      >
        Выберите дисциплину
      </p>

      <div
        style={{
          position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: 32, marginTop: "clamp(28px, 7vh, 64px)",
        }}
      >
        {subjects.map((s) => (
          <button
            key={s.id}
            className="bubble"
            onClick={() => navigate(`/s/${s.id}`)}
            aria-label={`Открыть дисциплину ${s.label}`}
            style={{
              position: "relative", width: L.bubble, height: L.bubble, borderRadius: 999,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "0 clamp(16px, 6%, 30px)", overflow: "hidden",
              backgroundSize: "190% 190%",
              animation: "bubbleFloat 11s ease-in-out infinite alternate, holoFlow 16s ease-in-out infinite",
              backgroundImage:
                "radial-gradient(circle at 30% 24%, oklch(0.975 0.022 200) 0%, oklch(0.948 0.042 204) 11%, oklch(0.916 0.068 214) 24%, oklch(0.876 0.098 228) 40%, oklch(0.836 0.118 250) 56%, oklch(0.796 0.132 276) 71%, oklch(0.758 0.138 300) 86%, oklch(0.724 0.140 322) 100%)",
              boxShadow:
                "0 44px 90px -46px oklch(0.60 0.13 268), inset 0 -26px 60px -30px oklch(0.52 0.12 300), inset 0 18px 44px -22px rgba(255,255,255,0.9)",
              transition: "box-shadow 500ms ease, transform 500ms ease",
            }}
          >
            <span
              style={{
                position: "absolute", top: "6%", left: "14%", width: "46%", height: "30%",
                borderRadius: 999, pointerEvents: "none", filter: "blur(16px)",
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.85) 0%, transparent 70%)",
              }}
            />
            {/* Без overflow-wrap: иначе «Гражданское» рвётся посередине. */}
            <span
              style={{
                position: "relative", maxWidth: "100%", fontSize: L.bubbleTitle, lineHeight: 1.15,
                letterSpacing: "-0.025em", fontWeight: 500, color: "var(--ink)", textWrap: "balance",
              }}
            >
              {s.label}
            </span>
            <span
              style={{ position: "relative", marginTop: 12, fontSize: L.bubbleNote, color: "rgba(20,20,15,0.72)" }}
            >
              {s.note}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
