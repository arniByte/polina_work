import { useEffect, useRef } from "react";
import type { Book } from "../content/types";
import type { Palette } from "../design/palette";
import { pad } from "../lib/format";
import type { ChipState } from "./TopicChip";

type Card = { book: Book; palette: Palette; state: ChipState };

/* Мобильная полка: карточки листаются пальцем, активная — та, что в центре.
   Столбец из 16 полос уводил панель темы на 900px вниз и заставлял скроллить,
   чтобы понять, что вообще выбрано. */
export function TopicDeck({
  cards, sel, onSelect, onOpen,
}: {
  cards: Card[];
  sel: number;
  onSelect: (i: number) => void;
  onOpen: (i: number) => void;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const fromScroll = useRef(false);

  // Выбор снаружи (стрелки, возврат с конспекта) подтягивает ленту к карточке.
  useEffect(() => {
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    items.current[sel]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [sel]);

  const onScroll = () => {
    const box = rail.current;
    if (!box) return;
    const mid = box.scrollLeft + box.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    items.current.forEach((el, i) => {
      if (!el) return;
      const c = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(c - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (best !== sel) {
      fromScroll.current = true;
      onSelect(best);
    }
  };

  return (
    <div
      ref={rail}
      onScroll={onScroll}
      style={{
        display: "flex",
        gap: 12,
        overflowX: "auto",
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        // Карточка центрируется, крайние не липнут к краям экрана.
        padding: "0 10vw",
        margin: "0 -20px",
        scrollPaddingInline: "10vw",
      }}
    >
      {cards.map(({ book, palette, state }, i) => {
        const locked = state === "locked";
        const active = i === sel;
        return (
          <button
            key={book.slug}
            ref={(el) => { items.current[i] = el; }}
            className="deck-card"
            onClick={() => (active ? onOpen(i) : onSelect(i))}
            aria-label={`Тема ${pad(book.no)}: ${book.title}${locked ? ", закрыта" : ""}`}
            style={{
              position: "relative",
              flex: "0 0 78vw",
              maxWidth: 420,
              height: 320,
              scrollSnapAlign: "center",
              borderRadius: 22,
              padding: "24px 24px 26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: "left",
              overflow: "hidden",
              backgroundImage: locked ? palette.matte : active ? palette.grad : palette.color,
              opacity: active ? 1 : 0.9,
              transform: active ? "scale(1)" : "scale(0.94)",
              transition: "transform 420ms var(--ease-chip), opacity 320ms ease, background-image 420ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 22, fontWeight: 500, color: locked ? "rgba(20,20,15,0.42)" : "var(--ink)" }}>
                {pad(book.no)}
              </span>
              {locked ? (
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" aria-hidden="true" style={{ opacity: 0.4 }}>
                  <path d="M2.6 6V4a3.4 3.4 0 0 1 6.8 0v2" stroke="#14140F" strokeWidth="1.4" strokeLinecap="round" />
                  <rect x="1" y="6" width="10" height="7.6" rx="2" fill="#14140F" />
                </svg>
              ) : (
                <span style={{ fontSize: 15, color: "rgba(20,20,15,0.62)" }}>
                  {state === "passed" ? "сдана" : state === "soon" ? "скоро" : `${book.hours} ч`}
                </span>
              )}
            </div>

            <div>
              <div
                style={{
                  fontSize: 26, lineHeight: 1.12, letterSpacing: "-0.025em", fontWeight: 500,
                  color: locked ? "rgba(20,20,15,0.5)" : "var(--ink)", textWrap: "balance",
                }}
              >
                {book.title}
              </div>
              <div
                style={{
                  marginTop: 10, fontSize: 15, lineHeight: 1.35,
                  color: locked ? "rgba(20,20,15,0.38)" : "rgba(20,20,15,0.66)", textWrap: "pretty",
                }}
              >
                {book.subtitle}
              </div>
            </div>

            <span style={{ fontSize: 15, color: "rgba(20,20,15,0.62)" }}>
              {locked
                ? "Сдайте предыдущую тему"
                : book.sections.length
                  ? active
                    ? "Нажмите ещё раз, чтобы открыть →"
                    : "Нажмите, чтобы выбрать"
                  : "Конспект готовится"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
