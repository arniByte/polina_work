import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { L } from "../lib/layout";

const items = [
  { to: "/games", label: "Игры" },
  { to: "/me", label: "Прогресс" },
];

/** Шапка липнет к верху; нижняя граница проявляется только при скролле. */
export function Header({ L }: { L: L }) {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Скролл слушаем на document с capture: страница может ехать в любом из трёх мест.
    const onScroll = () => {
      const el = document.scrollingElement || document.documentElement;
      const top = Math.max(window.scrollY || 0, el.scrollTop || 0, document.body.scrollTop || 0);
      setScrolled(top > 8);
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true });
  }, []);

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "saturate(180%) blur(28px)",
        WebkitBackdropFilter: "saturate(180%) blur(28px)",
        background: "rgba(247,246,243,0.62)",
        borderBottom: `1px solid ${scrolled ? "rgba(20,20,15,0.07)" : "transparent"}`,
        transition: "border-color 300ms ease, background 300ms ease",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: L.headPad,
          height: L.m ? undefined : 76,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            fontWeight: 500,
            fontSize: L.logo,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          ПИКС
        </button>

        <nav style={{ display: "flex", alignItems: "center", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
          {items.map((n) => {
            const on = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className="nav-pill"
                style={{
                  padding: L.navPad,
                  borderRadius: 999,
                  fontSize: L.nav,
                  whiteSpace: "nowrap",
                  color: on ? "var(--ink)" : "var(--ink-2)",
                  background: on ? "var(--active)" : "transparent",
                  transition: "background 160ms ease, color 160ms ease",
                }}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
