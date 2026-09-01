import { Link } from "react-router-dom";
import "./Page.css";

export function NotFound() {
  return (
    <div className="page">
      <header className="phead">
        <span className="mono">404</span>
        <h1 className="phead__title">Такой темы нет</h1>
        <p className="phead__sub">
          Страница не найдена — но полка на месте.
        </p>
      </header>
      <section className="pblock">
        <Link className="chip" to="/">
          вернуться на полку
        </Link>
      </section>
    </div>
  );
}
