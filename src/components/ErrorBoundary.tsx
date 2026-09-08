import { Component, type ReactNode } from "react";

type State = { failed: boolean; detail: string };

/** Ошибки, пойманные вне рендера, тоже сохраняем: без текста ошибку
 *  приходится ловить вслепую. Читается как localStorage["piks-last-error"]. */
export function rememberError(where: string, error: unknown) {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  try {
    localStorage.setItem(
      "piks-last-error",
      JSON.stringify({ where, detail, at: new Date().toISOString(), url: location.href }),
    );
  } catch {
    /* хранилище недоступно — остаётся только консоль */
  }
  console.error(`ПИКС [${where}]`, error);
  return detail;
}

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => rememberError("window", e.error ?? e.message));
  window.addEventListener("unhandledrejection", (e) => rememberError("promise", e.reason));
}

/* Любая ошибка рендера роняла страницу в белый экран — студент не понимает,
   что произошло. Здесь она превращается в понятный экран с выходом и текстом. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false, detail: "" };

  static getDerivedStateFromError(error: unknown): State {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    return { failed: true, detail };
  }

  componentDidCatch(error: unknown, info: { componentStack?: string | null }) {
    rememberError("render", error);
    const where = (info.componentStack ?? "").trim().split("\n").slice(0, 4).join("\n");
    if (where) {
      this.setState((s) => ({ ...s, detail: `${s.detail}\n\n${where}` }));
      console.error("ПИКС: компонент", where);
    }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 48px 120px", width: "100%" }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 68px)", lineHeight: 1.02, letterSpacing: "-0.04em" }}>
          Что-то сломалось
        </h1>
        <p style={{ marginTop: 18, fontSize: 20, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 520 }}>
          Экран не открылся. Прогресс сохранён — вернитесь к темам и попробуйте снова.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
          <a
            href="/"
            style={{
              display: "inline-block", padding: "20px 36px", borderRadius: 999,
              fontSize: 20, fontWeight: 500, backgroundColor: "var(--ink)", color: "#FFFFFF",
            }}
          >
            К темам
          </a>
          <button
            onClick={() => {
              // Битые данные в хранилище — самый частый источник поломки,
              // с которой студент ничего не может сделать сам.
              try {
                localStorage.removeItem("piks-progress");
                localStorage.removeItem("piks-student");
              } catch {
                /* хранилище недоступно — просто перезагружаемся */
              }
              location.href = "/";
            }}
            style={{
              padding: "20px 36px", borderRadius: 999, fontSize: 20,
              color: "var(--ink-card)", boxShadow: "inset 0 0 0 1px rgba(20,20,15,0.12)",
            }}
          >
            Сбросить данные
          </button>
          <button
            onClick={() => navigator.clipboard?.writeText(this.state.detail)}
            style={{
              padding: "20px 36px", borderRadius: 999, fontSize: 20,
              color: "var(--ink-card)", boxShadow: "inset 0 0 0 1px rgba(20,20,15,0.12)",
            }}
          >
            Скопировать ошибку
          </button>
        </div>

        <pre
          style={{
            marginTop: 32, padding: "18px 20px", borderRadius: 16, background: "var(--surface)",
            fontSize: 14, lineHeight: 1.5, color: "var(--ink-2)", whiteSpace: "pre-wrap",
            wordBreak: "break-word", fontFamily: "ui-monospace, monospace", maxWidth: 720,
          }}
        >
          {this.state.detail}
        </pre>
      </div>
    );
  }
}
