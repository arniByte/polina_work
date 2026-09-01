import { Fragment } from "react";
import { AnimatePresence } from "motion/react";
import { useMatch, useOutlet } from "react-router-dom";
import { Bookshelf } from "../components/Bookshelf";
import { books } from "../content/books";
import { profile } from "../content/profile";
import "./Shelf.css";

export function Shelf() {
  const match = useMatch("/book/:slug");
  const outlet = useOutlet();
  const openSlug = match?.params.slug;

  const ready = books.filter((b) => b.status === "ready").length;
  const hours = books.reduce((s, b) => s + b.hours, 0);

  return (
    <>
      <div className="page shelf-page">
        <header className="hero">
          <div className="hero__row mono">
            <span>{profile.program}</span>
            <span className="hero__rule" />
            <span>{profile.year}</span>
          </div>

          <h1 className="hero__title">
            Полка
            <em>гражданского права</em>
          </h1>

          <p className="hero__lead">{profile.lead}</p>

          <div className="hero__stats">
            <span className="chip">{books.length} тем</span>
            <span className="chip">{hours} часов</span>
            <span className="chip">{ready} готово</span>
          </div>
        </header>

        <Bookshelf openSlug={openSlug} />
      </div>

      {/* Без mode="wait": Outlet на "/" отдаёт null, и режим ожидания
          подвешивал появление ридера до несуществующего exit. */}
      <AnimatePresence>
        {outlet ? <Fragment key={openSlug}>{outlet}</Fragment> : null}
      </AnimatePresence>
    </>
  );
}
