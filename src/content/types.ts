export type BookStatus = "ready" | "soon";

export type BookLink = { label: string; href: string };

export type Block =
  | { kind: "lead"; text: string }
  | { kind: "text"; text: string }
  | { kind: "define"; term: string; article: string; text: string }
  | { kind: "list"; title?: string; items: string[] }
  | { kind: "callout"; tone: "note" | "trap" | "exam"; title: string; text: string }
  | { kind: "quote"; text: string; source: string };

export type Section = { title: string; blocks: Block[] };

export type Book = {
  slug: string;
  no: number;
  title: string;
  subtitle: string;
  hours: number;
  status: BookStatus;
  summary: string;
  links: BookLink[];
  sections: Section[];
};

/** Вопрос игры-проверки. correct — индекс верного варианта в a[]. */
export type Question = { q: string; a: string[]; correct: number; why: string };

export type Subject = {
  id: string;
  label: string;
  note: string;
  /** Заголовок на полке. */
  title: string;
  hue: number;
  hueStep: number;
};
