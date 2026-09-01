import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { books, bookBySlug } from "../content/books";
import { Blocks } from "./Blocks";
import "./Reader.css";

const kindLabel = {
  law: "закон",
  practice: "практика",
  video: "видео",
  article: "статья",
} as const;

export function Reader() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const book = bookBySlug(slug);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const close = () => navigate("/");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!book) {
    return (
      <div className="reader">
        <div className="reader__missing">
          <p className="mono">тема не найдена</p>
          <button className="chip" onClick={close}>
            вернуться на полку
          </button>
        </div>
      </div>
    );
  }

  const idx = books.findIndex((b) => b.slug === book.slug);
  const prev = books[idx - 1];
  const next = books[idx + 1];
  const [from, to] = book.palette;
  const empty = book.sections.length === 0;

  const goSection = (i: number) => {
    setActiveSection(i);
    const el = scrollRef.current?.querySelector<HTMLElement>(
      `#sec-${book.sections[i].id}`,
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div
      className="reader"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <button className="reader__scrim" onClick={close} aria-label="Закрыть книгу" />

      <div className="reader__book">
        {/* Корешок прилетает с полки — тот же layoutId, что у BookSpine. */}
        <motion.div
          layoutId={`cover-${book.slug}`}
          className="reader__spine"
          style={{ backgroundImage: `linear-gradient(170deg, ${from}, ${to})` }}
          transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="reader__spine-no">
            {String(book.no).padStart(2, "0")}
          </span>
          <span className="reader__spine-title">{book.title}</span>
        </motion.div>

        {/* Разворот раскрывается от корешка, как обложка на петлях. */}
        <motion.div
          className="reader__page"
          initial={{ scaleX: 0.06, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0.06, opacity: 0 }}
          transition={{
            duration: 0.52,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.24 },
          }}
        >
          <motion.div
            className="reader__inner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.34, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="reader__close" onClick={close} aria-label="Закрыть">
              ✕
            </button>

            {/* Форзац: оглавление, статьи, ссылки */}
            <aside className="reader__aside">
              <div className="reader__meta">
                <span className="chip">тема {String(book.no).padStart(2, "0")}</span>
                <span className="chip">{book.hours} ч</span>
              </div>

              <h1 className="reader__title">{book.title}</h1>
              <p className="reader__subtitle mono mono--tight">{book.subtitle}</p>

              {!empty && (
                <nav className="reader__toc">
                  <span className="mono">в этой теме</span>
                  <ol>
                    {book.sections.map((s, i) => (
                      <li key={s.id}>
                        <button
                          className={
                            i === activeSection ? "reader__toc-on" : undefined
                          }
                          onClick={() => goSection(i)}
                        >
                          <span className="mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {s.title}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {book.articles.length > 0 && (
                <div className="reader__articles">
                  <span className="mono">ключевые статьи</span>
                  <div className="reader__articles-row">
                    {book.articles.map((a) => (
                      <span className="chip" key={a}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {book.links.length > 0 && (
                <div className="reader__links">
                  <span className="mono">куда идти дальше</span>
                  <ul>
                    {book.links.map((l) => (
                      <li key={l.href + l.label}>
                        <a href={l.href} target="_blank" rel="noreferrer">
                          <span className="mono">{kindLabel[l.kind]}</span>
                          <span className="reader__link-label">{l.label}</span>
                          {l.note ? (
                            <span className="reader__link-note mono mono--tight">
                              {l.note}
                            </span>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* Правая страница — сам текст */}
            <div className="reader__content" ref={scrollRef}>
              {empty ? (
                <div className="reader__soon">
                  <p className="b-lead">{book.summary}</p>
                  <p className="b-text">
                    Конспект по этой теме ещё готовится. Пока держите список
                    статей слева — с них начинается разбор на паре.
                  </p>
                </div>
              ) : (
                book.sections.map((s, i) => (
                  <section className="reader__section" id={`sec-${s.id}`} key={s.id}>
                    <header className="reader__section-head">
                      <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                      <h2>{s.title}</h2>
                    </header>
                    <Blocks blocks={s.blocks} />
                  </section>
                ))
              )}

              <nav className="reader__flip">
                {prev ? (
                  <Link to={`/book/${prev.slug}`} className="reader__flip-btn">
                    <span className="mono">← предыдущая</span>
                    <span>{prev.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    to={`/book/${next.slug}`}
                    className="reader__flip-btn reader__flip-btn--next"
                  >
                    <span className="mono">следующая →</span>
                    <span>{next.title}</span>
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
