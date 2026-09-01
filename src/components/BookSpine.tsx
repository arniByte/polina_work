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
