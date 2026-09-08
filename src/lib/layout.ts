import { useEffect, useState } from "react";

const MOB = 780;
const NARROW = 1140;

/** Размеры всех экранов в одном месте: две раскладки, одинаковые единицы.
 *  Ширина корешка всегда в calc(), высота всегда в px — иначе браузер
 *  не интерполирует переход при смене выбранной темы. */
export function layoutFor(w: number) {
  const m = w < MOB;
  const narrow = w < NARROW;
  return {
    m,
    narrow,
    wide: !m,

    // шапка и контейнеры
    headPad: m ? "10px 20px" : "0 48px",
    pad: m ? "28px 20px 96px" : "48px 48px 120px",
    gamesPad: m ? "28px 20px 20px" : "48px 48px 28px",
    logo: m ? "32px" : "42px",
    nav: m ? "16px" : "17px",
    navPad: m ? "8px 14px" : "9px 18px",

    // главная
    homeLogo: m ? "clamp(34px, 11vh, 46px)" : "clamp(44px, 13vh, 76px)",
    homeNote: m ? "18px" : "21px",
    homePad: m ? "40px 24px" : "56px 48px",
    bubble: m ? "clamp(196px, 46vh, 268px)" : "clamp(232px, 52vh, 352px)",
    bubbleTitle: m ? "clamp(18px, 5.2vh, 23px)" : "clamp(19px, 5.4vh, 28px)",
    bubbleNote: m ? "15px" : "clamp(15px, 3.4vh, 18px)",

    // типографика
    h1: m ? "40px" : "68px",
    h2: m ? "30px" : "48px",
    h2s: m ? "26px" : "34px",
    readH1: m ? "34px" : "60px",
    sub: m ? "19px" : "24px",
    lead: m ? "20px" : "24px",
    body: m ? "18px" : "20px",
    quote: m ? "22px" : "26px",
    cardTitle: m ? "19px" : "21px",
    cardPad: m ? "24px 22px" : "32px 34px",
    quizPad: m ? "28px 24px" : "44px",
    btn: m ? "18px" : "20px",
    btnPad: m ? "16px 26px" : "20px 36px",

    // полка
    shelfDir: m ? ("column" as const) : ("row" as const),
    shelfH: m ? "auto" : "208px",
    shelfGap: m ? 6 : 7,
    shelfTop: m ? "32px" : "44px",
    flipTop: m ? "32px" : "40px",
    chipRadius: m ? "14px" : "10px",
    chipAlign: m ? ("center" as const) : ("flex-end" as const),
    chipJustify: m ? ("flex-start" as const) : ("center" as const),
    chipPad: m ? "0 20px" : "0 0 20px",
    chipFont: m ? "20px" : "24px",
    chipH: m ? 52 : 208,
    chipHSel: m ? 112 : 208,
    lockTop: m ? "17px" : "12px",
    lockRight: m ? "18px" : "10px",

    // конспект
    readerCols: m ? "minmax(0, 1fr)" : "minmax(0, 1fr) 260px",
    readerGap: m ? "56px" : "80px",
    railPos: m ? ("static" as const) : ("sticky" as const),
    stepGap: m ? "8px" : "12px",

    // игра
    qTop: m ? "36px" : "48px",
    qFont: m ? "28px" : "40px",
    optPad: m ? "20px 22px" : "24px 28px",

    // результат
    resultCols: m || narrow ? "minmax(0, 1fr)" : "minmax(0, 1fr) 380px",
    resultGap: m ? "48px" : "72px",
    resultH1: m ? "40px" : narrow ? "52px" : "68px",
    cardW: m ? "100%" : "380px",
    cardPadIn: m ? "28px" : "34px",
    cardBrand: m ? "22px" : "26px",
    cardMeta: m ? "15px" : "16px",
    cardScore: m ? "92px" : "116px",
    cardRank: m ? "24px" : "28px",

    // игровое поле
    stageH: m ? "70vh" : "calc(100vh - 220px)",
    stageMin: m ? "460px" : "560px",
    tile: m ? 76 : 112,
    tileRadius: m ? 20 : 28,
    tileFont: m ? 22 : 32,

    // прогресс
    barH: m ? "72px" : "120px",
    rowPad: m ? "16px 18px" : "20px 24px",
    rowTitle: m ? "19px" : "22px",
    meCols: m ? "28px minmax(0, 1fr)" : "26px minmax(0, 1fr) auto",
    meGap: m ? "14px" : "18px",
    meScoreCol: m ? "2" : "auto",
    meHeadDir: m ? ("column" as const) : ("row" as const),
    meHeadAlign: m ? ("stretch" as const) : ("flex-end" as const),
  };
}

export type L = ReturnType<typeof layoutFor>;

/** Ширина окна с дебаунсом 120ms. noAnim гасит переходы на кадр при смене
 *  раскладки — иначе корешки застревают в промежуточных размерах. */
export function useLayout() {
  const [w, setW] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const [noAnim, setNoAnim] = useState(false);

  useEffect(() => {
    let t: number | undefined;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const next = window.innerWidth;
        setW((prev) => {
          if (next < MOB !== prev < MOB) {
            setNoAnim(true);
            requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
          }
          return next;
        });
      }, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return { L: layoutFor(w), w, noAnim };
}
