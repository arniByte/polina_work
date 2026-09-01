import type { Block } from "../content/types";
import "./Blocks.css";

const calloutLabel = {
  note: "на заметку",
  trap: "здесь спотыкаются",
  exam: "будет на зачёте",
} as const;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "lead":
            return (
              <p className="b-lead" key={i}>
                {b.text}
              </p>
            );

          case "text":
            return (
              <p className="b-text" key={i}>
                {b.text}
              </p>
            );

          case "define":
            return (
              <div className="b-define" key={i}>
                <div className="b-define__head">
                  <h4 className="b-define__term">{b.term}</h4>
                  {b.article ? <span className="chip">{b.article}</span> : null}
                </div>
                <p className="b-text">{b.text}</p>
              </div>
            );

          case "list":
            return (
              <div className="b-list" key={i}>
                {b.title ? <h4 className="b-list__title">{b.title}</h4> : null}
                <ul>
                  {b.items.map((it, j) => (
                    <li key={j}>
                      <span className="b-list__num mono">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "quote":
            return (
              <figure className="b-quote" key={i}>
                <blockquote>{b.text}</blockquote>
                <figcaption className="mono">{b.source}</figcaption>
              </figure>
            );

          case "callout":
            return (
              <aside className={`b-callout b-callout--${b.tone}`} key={i}>
                <span className="b-callout__tag mono">{calloutLabel[b.tone]}</span>
                <h4 className="b-callout__title">{b.title}</h4>
                <p className="b-text">{b.text}</p>
              </aside>
            );

          case "meme":
            return (
              <figure className="b-meme" key={i}>
                {b.src ? (
                  <img src={b.src} alt={b.alt ?? b.caption} loading="lazy" />
                ) : (
                  /* Картинки ещё нет — держим место и не ломаем вёрстку. */
                  <div className="b-meme__hole">
                    <span className="mono">место под мем</span>
                  </div>
                )}
                <figcaption className="mono mono--tight">{b.caption}</figcaption>
              </figure>
            );
        }
      })}
    </>
  );
}
