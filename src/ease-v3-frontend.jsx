import { useEffect, useRef, useState } from "react";
import { DashboardPage } from "./dashboard";
import { Nav, Toast } from "./components";
import { AboutPage, ContactPage, HomePage, LoginPage, SignupPage, TermsPage } from "./pages";
import { GLOBAL_STYLES } from "./styles";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutos

function getInitialPage() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user?.id) return "dashboard";
  } catch {
    // token inválido — começa na home
  }
  return "home";
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [toast, setToast] = useState(null);
  const idleTimerRef = useRef(null);

  const showToast = (message, type = "success") => {
    if (!message) return;
    setToast({ message, type });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearTimeout(idleTimerRef.current);
    setPage("home");
    showToast("Sessão encerrada. Até logo!", "success");
  };

  // ── Idle logout ──────────────────────────────────────────
  useEffect(() => {
    if (page !== "dashboard") {
      clearTimeout(idleTimerRef.current);
      return;
    }

    const resetTimer = () => {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setPage("home");
        setToast({ message: "Sessão encerrada por inatividade.", type: "error" });
      }, IDLE_TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer(); // inicia o timer ao entrar no dashboard

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(idleTimerRef.current);
    };
  }, [page]);

  // ── Scroll ao topo na troca de página ────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // ── Auto-fechar toast ─────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const isApp = page === "dashboard";
  const isAuth = ["login", "signup"].includes(page);
  const darkHero = page === "home" || page === "features";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {!isApp && !isAuth && <Nav page={page} setPage={setPage} darkMode={darkHero} onLogout={handleLogout} />}
      {(page === "home" || page === "features") && <HomePage setPage={setPage} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "contact" && <ContactPage setPage={setPage} />}
      {page === "terms" && <TermsPage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} onToast={showToast} />}
      {page === "signup" && <SignupPage setPage={setPage} onToast={showToast} />}
      {page === "dashboard" && <DashboardPage setPage={setPage} onToast={showToast} onLogout={handleLogout} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}
