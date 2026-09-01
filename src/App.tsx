import { Route, Routes } from "react-router-dom";
import { Grain } from "./components/Grain";
import { Nav } from "./components/Nav";
import { Reader } from "./components/Reader";
import { Stamp } from "./components/Stamp";
import { About } from "./pages/About";
import { Cabinet } from "./pages/Cabinet";
import { NotFound } from "./pages/NotFound";
import { Schedule } from "./pages/Schedule";
import { Shelf } from "./pages/Shelf";

export default function App() {
  return (
    <div className="shell">
      <Grain />
      <Nav />

      <Routes>
        {/* Ридер — вложенный роут: полка остаётся под ним смонтированной,
            поэтому корешок и обложка делят один layoutId и книга открывается,
            а не появляется. */}
        <Route path="/" element={<Shelf />}>
          <Route path="book/:slug" element={<Reader />} />
        </Route>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/about" element={<About />} />
        <Route path="/cabinet" element={<Cabinet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Stamp />
    </div>
  );
}
