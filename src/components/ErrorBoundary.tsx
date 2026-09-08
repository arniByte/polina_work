import { Component, type ReactNode } from "react";

/* Любая ошибка рендера роняла страницу в белый экран — студент не понимает,
   что произошло, и уходит. Здесь она превращается в понятный экран с выходом. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ПИКС: ошибка экрана", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 48px 120px", width: "100%" }}>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 68px)", lineHeight: 1.02, letterSpacing: "-0.04em" }}>
          Что-то сломалось
        </h1>
        <p style={{ marginTop: 18, fontSize: 20, lineHeight: 1.5, color: "var(--ink-2)", maxWidth: 460 }}>
          Экран не открылся. Прогресс сохранён — вернитесь к темам и попробуйте снова.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block", marginTop: 36, padding: "20px 36px", borderRadius: 999,
            fontSize: 20, fontWeight: 500, backgroundColor: "var(--ink)", color: "#FFFFFF",
          }}
        >
          К темам
        </a>
      </div>
    );
  }
}
