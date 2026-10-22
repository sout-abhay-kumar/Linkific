import { useCallback, useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { api } from "./services/api";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function LibraryLayout() {
  const [totalTitles, setTotalTitles] = useState(null);

  const refreshLibraryStats = useCallback(async () => {
    try {
      const stats = await api.getStats();
      setTotalTitles(stats.total_titles ?? 0);
    } catch {
      // Each page presents its own API error. The sidebar can remain usable.
      setTotalTitles(null);
    }
  }, []);

  useEffect(() => {
    refreshLibraryStats();
  }, [refreshLibraryStats]);

  return (
    <div className="min-h-screen md:flex">
      <Sidebar totalTitles={totalTitles} />
      <div className="min-w-0 flex-1">
        <Header />
        <div className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-7xl px-5 py-7 md:px-9 md:py-9">
          <Outlet context={{ refreshLibraryStats }} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<LibraryLayout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:bookId" element={<BookDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
