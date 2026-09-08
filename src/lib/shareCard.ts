import type { Book } from "../content/types";
import { pad } from "./format";

/* Карточка результата на canvas 1080×1350 — тем же градиентом, что и в вёрстке.
   На бэкенде это станет серверным рендером OG-картинки по ссылке на результат. */

const W = 1080;
const H = 1350;
const S = 2.7;
const FAM = '"Unbounded", "Helvetica Neue", Arial, sans-serif';

export const rankFor = (score: number, total: number, pass: number) =>
  score >= total ? "Безупречно" : score >= pass ? "Тема сдана" : "Ещё не сдано";

export async function renderCardBlob(opts: {
  book: Book;
  hue: number;
  score: number;
  total: number;
  pass: number;
  name: string;
  subjectLabel: string;
}): Promise<Blob | null> {
  const { book, hue: h, score, total, pass, name, subjectLabel } = opts;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d");
  if (!g) return null;

  const lin = g.createLinearGradient(0, H, W, 0);
  (
    [
      [0, h - 34, 0.085],
      [0.34, h, 0.11],
      [0.5, h + 26, 0.102],
      [0.75, h + 62, 0.115],
      [1, h - 34, 0.085],
    ] as const
  ).forEach(([p, hh, cc]) => lin.addColorStop(p, `oklch(0.875 ${cc} ${hh})`));
  g.fillStyle = lin;
  g.fillRect(0, 0, W, H);

  const glow = g.createRadialGradient(W * 0.22, H * 0.14, 0, W * 0.22, H * 0.14, W * 0.55);
  glow.addColorStop(0, "rgba(255,255,255,0.72)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);

  const P = 34 * S;
  g.textBaseline = "alphabetic";

  g.fillStyle = "#14140F";
  g.font = `500 ${26 * S}px ${FAM}`;
  g.fillText("ПИКС", P, P + 26 * S);

  g.fillStyle = "rgba(20,20,15,0.72)";
  g.font = `400 ${16 * S}px ${FAM}`;
  const no = pad(book.no);
  g.fillText(no, W - P - g.measureText(no).width, P + 22 * S);

  g.fillStyle = "#14140F";
  g.font = `500 ${116 * S}px ${FAM}`;
  const scoreText = String(score);
  g.fillText(scoreText, P, H * 0.62);
  const sw = g.measureText(scoreText).width;
  g.globalAlpha = 0.42;
  g.fillText(`/${total}`, P + sw, H * 0.62);
  g.globalAlpha = 1;

  g.font = `500 ${28 * S}px ${FAM}`;
  let line = "";
  let y = H * 0.62 + 44 * S;
  book.title.split(" ").forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (g.measureText(test).width > W - P * 2) {
      g.fillText(line, P, y);
      line = word;
      y += 34 * S;
    } else {
      line = test;
    }
  });
  if (line) g.fillText(line, P, y);

  g.font = `500 ${16 * S}px ${FAM}`;
  g.fillText(name || "Студент", P, H - P - 22 * S);
  g.fillStyle = "rgba(20,20,15,0.72)";
  g.font = `400 ${16 * S}px ${FAM}`;
  g.fillText(subjectLabel, P, H - P);
  const rank = rankFor(score, total, pass);
  g.fillText(rank, W - P - g.measureText(rank).width, H - P);

  return new Promise((res) => c.toBlob(res, "image/png"));
}
