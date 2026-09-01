import { stamp } from "../content/profile";
import "./Stamp.css";

/** Нижняя техническая строка — как подпись FRANCE 3 / SENEGAL 1 · #17 на постере.
 *  Ничего не делает, держит композицию. */
export function Stamp({ index }: { index?: string }) {
  return (
    <footer className="stamp">
      <span className="mono">{stamp.left}</span>
      <span className="stamp__dash" />
      <span className="mono">{stamp.mid}</span>
      <span className="stamp__box">
        {index ? <span className="chip">{index}</span> : null}
        <span className="chip">{stamp.right}</span>
      </span>
    </footer>
  );
}
