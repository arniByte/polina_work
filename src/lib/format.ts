export const pad = (n: number) => (n < 10 ? "0" + n : String(n));

/** Русское склонение: plural(4, "час", "часа", "часов") → "часа". */
export const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
};
