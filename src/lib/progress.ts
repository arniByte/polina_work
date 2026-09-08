import { useCallback, useEffect, useState } from "react";
import { books } from "../content/books";
import { passMark } from "../content/quiz";

/* Прогресс студента. Пока живёт в браузере; на этапе бэкенда этот модуль
   меняет реализацию на запросы к API, а его интерфейс остаётся тем же —
   экраны трогать не придётся. */

const KEY = "piks-progress";
const NAME_KEY = "piks-student";

/** slug → результат сданной игры. Тема попадает сюда только при 80% верных. */
export type Result = { score: number; total: number };
export type Passed = Record<string, Result>;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // «null» и мусор в ключе роняли бы Object.entries ниже по коду.
    return parsed === null || parsed === undefined ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* приватный режим — прогресс живёт до перезагрузки */
  }
};

/** Последняя тема ДО i, у которой есть конспект, а значит и проверка.
 *  Тема без конспекта не запирает следующую навсегда. */
export const prevGate = (i: number) => {
  for (let k = i - 1; k >= 0; k--) if (books[k].sections.length) return k;
  return -1;
};

export const isUnlockedWith = (passed: Passed, i: number) => {
  const g = prevGate(i);
  return g < 0 || passed[books[g].slug] !== undefined;
};

/** Ближайшая следующая тема с конспектом — цель кнопок «Дальше». */
export const nextTopicAfter = (i: number) => {
  for (let k = i + 1; k < books.length; k++) if (books[k].sections.length) return books[k];
  return undefined;
};

/** Прежние версии хранили просто счёт из пяти вопросов.
 *  Читаем их как {score, total: 5}, иначе у студента ломается строка результата. */
const migrate = (raw: Record<string, unknown>): Passed => {
  const out: Passed = {};
  if (!raw || typeof raw !== "object") return out;
  Object.entries(raw).forEach(([slug, value]) => {
    if (typeof value === "number") out[slug] = { score: value, total: 5 };
    else if (value && typeof value === "object" && "score" in value) out[slug] = value as Result;
  });
  return out;
};

export function useProgress() {
  const [passed, setPassed] = useState<Passed>(() => migrate(read<Record<string, unknown>>(KEY, {})));
  const [name, setNameState] = useState<string>(() => read<string>(NAME_KEY, ""));

  useEffect(() => write(KEY, passed), [passed]);
  useEffect(() => write(NAME_KEY, name), [name]);

  /** Записывает попытку. Тема открывается только при 80% верных,
   *  а уже набранный результат не понижается пересдачей. */
  const submit = useCallback((slug: string, score: number, total: number) => {
    if (score < passMark(total)) return false;
    setPassed((prev) => {
      const was = prev[slug];
      const better = !was || score / total > was.score / was.total;
      return better ? { ...prev, [slug]: { score, total } } : prev;
    });
    return true;
  }, []);

  const isUnlocked = useCallback((i: number) => isUnlockedWith(passed, i), [passed]);

  const doneCount = Object.keys(passed).length;
  const doneHours = books.reduce((sum, b) => sum + (passed[b.slug] !== undefined ? b.hours : 0), 0);

  return { passed, submit, isUnlocked, name, setName: setNameState, doneCount, doneHours };
}

export type ProgressApi = ReturnType<typeof useProgress>;
