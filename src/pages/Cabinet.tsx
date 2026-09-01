import "./Page.css";

/* Кабинет ждёт двух вещей: данных студентов после опроса и решения по бэкенду.
   Пока держим место и описываем контур, чтобы было что обсуждать. */
export function Cabinet() {
  return (
    <div className="page">
      <header className="phead">
        <span className="mono">личный кабинет</span>
        <h1 className="phead__title">Успеваемость</h1>
        <p className="phead__sub">
          Оценки, посещаемость, сданные работы. Закрытая часть — только для
          преподавателя.
        </p>
      </header>

      <section className="pblock">
        <div className="empty">
          <span className="chip">в разработке</span>
          <p className="pblock__lead">
            Соберём после опроса студентов: без реальных списков групп это
            гадание.
          </p>
          <ul className="ticks">
            <li>журнал: группа → студент → тема → оценка</li>
            <li>посещаемость с отметкой причины</li>
            <li>статус работ: сдано / на проверке / долг</li>
            <li>выгрузка в таблицу для отчётности</li>
            <li>вход по паролю, данные студентов не публичны</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
