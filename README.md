# ПИКС

Образовательный ресурс для студентов СПО: конспект → игра-проверка → следующая
тема. Первая дисциплина — гражданское право.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Где что править

| Что | Файл |
|---|---|
| Темы и конспекты | `src/content/books.ts` |
| Вопросы игры | `src/content/quiz.ts` |
| Дисциплины | `src/content/subjects.ts` |
| Цвет тем | `src/design/palette.ts` |
| Размеры экранов | `src/lib/layout.ts` |
| Прогресс и гейтинг | `src/lib/progress.ts` |

Как устроен проект, что решено и что дальше — в [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).
