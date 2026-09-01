import { NavLink } from "react-router-dom";
import { profile } from "../content/profile";
import "./Nav.css";

const links = [
  { to: "/", label: "Полка", short: "Полка", end: true },
  { to: "/schedule", label: "Расписание", short: "Пары" },
  { to: "/about", label: "О преподавателе", short: "Обо мне" },
  { to: "/cabinet", label: "Кабинет", short: "Кабинет" },
];

export function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav__mark" aria-label="На полку">
        <span className="nav__spines" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="nav__name mono mono--tight">
          {profile.name}
          {profile.lastName ? ` ${profile.lastName}` : ""} · гражданское право
        </span>
      </NavLink>

      <ul className="nav__list">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                isActive ? "nav__link nav__link--on mono" : "nav__link mono"
              }
            >
              <span className="nav__full">{l.label}</span>
              <span className="nav__short">{l.short}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
