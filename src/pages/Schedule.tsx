import "./Page.css";

/* Пока расписания нет — страница честно говорит, что здесь будет,
   и не притворяется заполненной. Формат данных согласуем, когда придёт файл. */
export function Schedule() {
  return (
    <div className="page">
      <header className="phead">
        <span className="mono">расписание</span>
        <h1 className="phead__title">Когда и где</h1>
        <p className="phead__sub">
          Сетка пар по группам, даты контрольных и дедлайны сдачи.
        </p>
      </header>

      <section className="pblock">
        <div className="empty">
          <span className="chip">ждём данные</span>
          <p className="pblock__lead">
            Расписание появится здесь, как только будет файл с сеткой пар.
          </p>
          <ul className="ticks">
            <li>группы и подгруппы</li>
            <li>дни, время, аудитории</li>
            <li>ближайшая пара выносится наверх</li>
            <li>дедлайны и даты контрольных — отдельной лентой</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
