export type BookStatus = "ready" | "draft" | "soon";

export type LinkKind = "law" | "practice" | "video" | "article";

export type BookLink = {
  label: string;
  href: string;
  kind: LinkKind;
  note?: string;
};

export type Block =
  /** Первый абзац темы — крупнее остальных, задаёт тон. */
  | { kind: "lead"; text: string }
  | { kind: "text"; text: string }
  /** Определение из закона. article — номер статьи, без ссылки. */
  | { kind: "define"; term: string; text: string; article?: string }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "quote"; text: string; source: string }
  /** note — на заметку, trap — где все спотыкаются, exam — будет на зачёте. */
  | { kind: "callout"; tone: "note" | "trap" | "exam"; title: string; text: string }
  /** Картинка кладётся в /public/memes/, src — "/memes/имя.jpg". */
  | { kind: "meme"; caption: string; src?: string; alt?: string };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Book = {
  slug: string;
  /** Номер темы в программе — печатается на корешке. */
  no: number;
  title: string;
  /** Что печатается на корешке. Корешок узкий — длинное название не влезет. */
  short: string;
  subtitle: string;
  hours: number;
  status: BookStatus;
  /** Градиент корешка и обложки. */
  palette: [string, string];
  /** Толщина корешка в px: визуальный вес темы. 48–104 читается хорошо. */
  thickness: number;
  /** Высота корешка в px: разнобой делает полку живой. 260–360. */
  height: number;
  summary: string;
  /** Ключевые статьи ГК — печатаются на форзаце. */
  articles: string[];
  sections: Section[];
  links: BookLink[];
};
