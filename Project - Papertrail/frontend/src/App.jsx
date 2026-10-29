import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/AdminUsers";
import Unauthorized from "./pages/Unauthorized";
import {
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignupPage,
} from "./pages/AuthPages";

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? (
    <Navigate to={location.state?.from || "/"} replace />
  ) : (
    children
  );
}

function LibraryLayout() {
  const { initializationError } = useAuth();
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
          {initializationError && (
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {initializationError}
            </p>
          )}
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
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnly>
            <SignupPage />
          </GuestOnly>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<LibraryLayout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:bookId" element={<BookDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="admin/users"
          element={
            <RequireAuth role="admin">
              <AdminUsers />
            </RequireAuth>
          }
        />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
