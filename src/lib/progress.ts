import { useCallback, useEffect, useState } from "react";
import { books } from "../content/books";
import { PASS } from "../content/quiz";

/* Прогресс студента. Пока живёт в браузере; на этапе бэкенда этот модуль
   меняет реализацию на запросы к API, а его интерфейс остаётся тем же —
   экраны трогать не придётся. */

const KEY = "piks-progress";
const NAME_KEY = "piks-student";

/** slug → счёт сданной игры. Тема попадает сюда только при score >= PASS. */
export type Passed = Record<string, number>;

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
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

export function useProgress() {
  const [passed, setPassed] = useState<Passed>(() => read<Passed>(KEY, {}));
  const [name, setNameState] = useState<string>(() => read<string>(NAME_KEY, ""));

  useEffect(() => write(KEY, passed), [passed]);
  useEffect(() => write(NAME_KEY, name), [name]);

  /** Записывает попытку. Тема открывается только при score >= PASS,
   *  а уже набранный результат не понижается пересдачей. */
  const submit = useCallback((slug: string, score: number) => {
    if (score < PASS) return false;
    setPassed((prev) => ({ ...prev, [slug]: Math.max(prev[slug] ?? 0, score) }));
    return true;
  }, []);

  const isUnlocked = useCallback((i: number) => isUnlockedWith(passed, i), [passed]);

  const doneCount = Object.keys(passed).length;
  const doneHours = books.reduce((sum, b) => sum + (passed[b.slug] !== undefined ? b.hours : 0), 0);

  return { passed, submit, isUnlocked, name, setName: setNameState, doneCount, doneHours };
}

export type ProgressApi = ReturnType<typeof useProgress>;
