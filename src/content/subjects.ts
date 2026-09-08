import type { Subject } from "./types";
import { books } from "./books";
import { HUE_START, HUE_STEP } from "../design/palette";

/* Дисциплины ресурса. Каждая — сфера на главной.
   Вторая дисциплина добавляется сюда и получает свою дугу тона. */
export const subjects: Subject[] = [
  {
    id: "law",
    label: "Гражданское право",
    note: `СПО · ${books.length} тем`,
    title: "Гражданское право",
    hue: HUE_START,
    hueStep: HUE_STEP,
  },
];

export const subjectById = (id: string) => subjects.find((s) => s.id === id);

export const totalHours = books.reduce((sum, b) => sum + b.hours, 0);
