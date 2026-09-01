import { books } from "../content/books";
import { profile } from "../content/profile";
import "./Page.css";

export function About() {
  const hours = books.reduce((s, b) => s + b.hours, 0);

  return (
    <div className="page">
      <header className="phead">
        <span className="mono">о преподавателе</span>
        <h1 className="phead__title">
          {profile.name}
          {profile.lastName ? ` ${profile.lastName}` : ""}
        </h1>
        <p className="phead__sub">
          {profile.role}
          {profile.place ? ` · ${profile.place}` : ""}
        </p>
      </header>

      <section className="pblock">
        <p className="pblock__lead">{profile.lead}</p>
      </section>

      <section className="pblock">
        <span className="mono">как устроены пары</span>
        <div className="cards">
          {profile.principles.map((p, i) => (
            <article className="card" key={p.title}>
              <span className="card__no mono">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pblock">
        <span className="mono">курс в цифрах</span>
        <div className="figures">
          <div className="figure">
            <b>{books.length}</b>
            <span className="mono">тем в программе</span>
          </div>
          <div className="figure">
            <b>{hours}</b>
            <span className="mono">часов</span>
          </div>
          <div className="figure">
            <b>{books.filter((b) => b.status === "ready").length}</b>
            <span className="mono">конспектов готово</span>
          </div>
        </div>
      </section>

      {profile.contacts.length > 0 && (
        <section className="pblock">
          <span className="mono">связь</span>
          <div className="chips">
            {profile.contacts.map((c) => (
              <a className="chip" href={c.href} key={c.href}>
                {c.label}
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
