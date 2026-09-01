import { useState } from "react";
import { books } from "../content/books";
import { BookSpine } from "./BookSpine";
import "./Bookshelf.css";

export function Bookshelf({ openSlug }: { openSlug?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = books.find((b) => b.slug === (hovered ?? openSlug));

  return (
    <section className="shelf" aria-label="Темы курса">
      <div className="shelf__glow" aria-hidden="true" />

      <div
        className="shelf__row"
        onMouseLeave={() => setHovered(null)}
        role="list"
      >
        {books.map((book, i) => (
          <div
            key={book.slug}
            role="listitem"
            onMouseEnter={() => setHovered(book.slug)}
            onFocus={() => setHovered(book.slug)}
          >
            <BookSpine book={book} open={book.slug === openSlug} order={i} />
          </div>
        ))}
      </div>

      <div className="shelf__board" aria-hidden="true" />

      {/* Читалка названий: корешок узкий, а название длинное — подписываем здесь. */}
      <div className="shelf__readout" aria-live="polite">
        {active ? (
          <>
            <span className="chip">{String(active.no).padStart(2, "0")}</span>
            <span className="shelf__readout-title">{active.title}</span>
            <span className="mono">{active.subtitle}</span>
            <span className="mono shelf__readout-hours">{active.hours} ч</span>
          </>
        ) : (
          <span className="mono">
            <span className="shelf__hint-hover">наведи на корешок</span>
            <span className="shelf__hint-touch">листай вбок</span>
            {" · нажми, чтобы открыть · "}
            {books.length} тем
          </span>
        )}
      </div>
    </section>
  );
}
