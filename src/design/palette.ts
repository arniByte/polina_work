/* Тон темы едет по дуге бирюза → синий → сирень → розовый.
   Светлота и насыщенность одинаковы у всех — ряд корешков читается как один объект. */

export type Palette = {
  hue: number;
  /** Плоская заливка корешка. */
  color: string;
  /** Приглушённая заливка запертой темы. */
  matte: string;
  /** Тёмный вариант тона. */
  deep: string;
  /** Голограмма: кнопки, плитки, шер-карточка. */
  holo: string;
  /** Объёмная заливка выбранного корешка. */
  grad: string;
};

export const HUE_START = 178;
export const HUE_STEP = 10.5;

export const paletteFor = (i: number, h0 = HUE_START, step = HUE_STEP): Palette => {
  const h = h0 + i * step;
  return {
    hue: h,
    color: `oklch(0.815 0.115 ${h})`,
    matte: `linear-gradient(160deg, oklch(0.902 0.020 ${h}) 0%, oklch(0.884 0.026 ${h}) 100%)`,
    deep: `oklch(0.46 0.145 ${h})`,
    holo:
      `linear-gradient(100deg, oklch(0.895 0.085 ${h - 34}) 0%, oklch(0.878 0.098 ${h - 12}) 17%, ` +
      `oklch(0.862 0.110 ${h}) 34%, oklch(0.874 0.102 ${h + 26}) 50%, oklch(0.858 0.112 ${h + 54}) 67%, ` +
      `oklch(0.876 0.096 ${h + 84}) 84%, oklch(0.895 0.085 ${h - 34}) 100%)`,
    grad:
      `linear-gradient(140deg, oklch(0.898 0.072 ${h - 28}) 0%, oklch(0.868 0.092 ${h - 12}) 24%, ` +
      `oklch(0.838 0.112 ${h}) 48%, oklch(0.806 0.128 ${h + 16}) 72%, oklch(0.778 0.138 ${h + 32}) 100%)`,
  };
};
