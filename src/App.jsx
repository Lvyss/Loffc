import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PertemuanIndex from "./components/PertemuanIndex";
import Footer from "./components/Footer";

import Pertemuan1 from "./pages/pertemuan/Pertemuan1";
import Pertemuan2 from "./pages/pertemuan/Pertemuan2";
import Pertemuan3 from "./pages/pertemuan/Pertemuan3";
import Pertemuan4 from "./pages/pertemuan/Pertemuan4";
import Pertemuan5 from "./pages/pertemuan/Pertemuan5";
import Pertemuan6 from "./pages/pertemuan/Pertemuan6";
import Praktikum1P6 from "./pages/pertemuan/p6/Praktikum1";
import Praktikum2P6 from "./pages/pertemuan/p6/Praktikum2";
import TugasP6 from "./pages/pertemuan/p6/Tugas";
import NotFound from "./pages/pertemuan/NotFound";
import Praktikum1P5 from "./pages/pertemuan/p5/Praktikum1";
import TugasP5 from "./pages/pertemuan/p5/Tugas";
import TugasPhpP6 from "./pages/pertemuan/p6/TugasPhp";
function HomePage() {
  return (
    <>
      <Hero />
      <PertemuanIndex />
    </>
  );
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pertemuan/1" element={<Pertemuan1 />} />
          <Route path="/pertemuan/2" element={<Pertemuan2 />} />
          <Route path="/pertemuan/3" element={<Pertemuan3 />} />
          <Route path="/pertemuan/4" element={<Pertemuan4 />} />
          <Route path="/pertemuan/5" element={<Pertemuan5 />} />
<Route path="/pertemuan/5/praktikum-1" element={<Praktikum1P5 />} />
<Route path="/pertemuan/5/tugas" element={<TugasP5 />} />
          <Route path="/pertemuan/6" element={<Pertemuan6 />} />
          <Route path="/pertemuan/6/praktikum-1" element={<Praktikum1P6 />} />
          <Route path="/pertemuan/6/praktikum-2" element={<Praktikum2P6 />} />
          <Route path="/pertemuan/6/tugas" element={<TugasP6 />} />
          <Route path="/pertemuan/6/tugas-php" element={<TugasPhpP6 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}