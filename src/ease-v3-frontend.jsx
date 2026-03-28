import { useEffect, useState } from "react";
import { DashboardPage } from "./dashboard";
import { Nav, Toast } from "./components";
import { AboutPage, ContactPage, HomePage, LoginPage, SignupPage, TermsPage } from "./pages";
import { GLOBAL_STYLES } from "./styles";

export default function App() {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const showToast = (message, type = "success") => {
    if (!message) return;
    setToast({ message, type });
  };

  const isApp = page === "dashboard";
  const isAuth = ["login", "signup"].includes(page);
  const darkHero = page === "home" || page === "features";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {!isApp && !isAuth && <Nav page={page} setPage={setPage} darkMode={darkHero} />}
      {(page === "home" || page === "features") && <HomePage setPage={setPage} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "contact" && <ContactPage setPage={setPage} />}
      {page === "terms" && <TermsPage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} onToast={showToast} />}
      {page === "signup" && <SignupPage setPage={setPage} onToast={showToast} />}
      {page === "dashboard" && <DashboardPage setPage={setPage} onToast={showToast} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
