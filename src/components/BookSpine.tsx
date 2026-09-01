import type React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { Book } from "../content/types";
import "./BookSpine.css";

type Props = {
  book: Book;
  /** Книга сейчас открыта: корешок отдаёт свой layoutId ридеру и остаётся щелью. */
  open: boolean;
  /** Индекс в ряду — для лестничной задержки появления. */
  order: number;
};

/** Относительная яркость sRGB — по ней решаем, каким цветом печатать корешок. */
function luma(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

const inkFor = (hex: string) => (luma(hex) > 0.38 ? "#021B10" : "#F2F4F1");

const statusLabel: Record<Book["status"], string> = {
  ready: "",
  draft: "черновик",
  soon: "скоро",
};

export function BookSpine({ book, open, order }: Props) {
  const [from, to] = book.palette;

  return (
    <motion.div
      className="spine-slot"
      style={
        {
          "--w": book.thickness,
          "--h": book.height,
          // градиент идёт сверху вниз, поэтому у шапки и подвала свой контраст
          "--ink-top": inkFor(from),
          "--ink-bot": inkFor(to),
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.04 * order,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {open ? (
        <div className="spine-slot__gap" aria-hidden="true" />
      ) : (
        <Link
          to={`/book/${book.slug}`}
          className={`spine spine--${book.status}`}
          aria-label={`Тема ${book.no}. ${book.title}`}
        >
          <motion.span
            layoutId={`cover-${book.slug}`}
            className="spine__body"
            style={{ backgroundImage: `linear-gradient(170deg, ${from}, ${to})` }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* motion держит inline opacity на элементе с layoutId, поэтому
              «скоро» гасим отдельным слоем, а не прозрачностью корешка */}
          <span className="spine__veil" aria-hidden="true" />
          <span className="spine__inner">
            <span className="spine__no">{String(book.no).padStart(2, "0")}</span>
            <span className="spine__title">{book.short}</span>
            <span className="spine__foot">
              {statusLabel[book.status] || `${book.hours} ч`}
            </span>
          </span>
        </Link>
      )}
    </motion.div>
  );
}
