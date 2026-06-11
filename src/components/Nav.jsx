import { useEffect, useState } from "react";
import { useViewportFlags } from "../hooks";
import { C } from "../styles";
import Logo from "./Logo";

function isLoggedIn() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return !!(token && user?.id);
  } catch {
    return false;
  }
}

export default function Nav({ page, setPage, darkMode, onLogout }) {
  const [sc, setSc] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const { isMobile } = useViewportFlags();

  useEffect(() => {
    const handleScroll = () => setSc(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Atualiza o estado de login sempre que a página mudar
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [page]);

  const dark = darkMode && !sc;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        padding: isMobile ? "0 4.5%" : "0 6%",
        height: isMobile ? 68 : 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: sc ? (darkMode ? "rgba(20,28,38,0.93)" : "rgba(237,234,228,0.93)") : "transparent",
        backdropFilter: sc ? "blur(18px)" : "none",
        borderBottom: sc ? `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(45,58,73,0.07)"}` : "none",
        transition: "all .3s",
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
        <Logo inv={dark} size={isMobile ? 0.78 : 0.88} />
      </div>
      <div style={{ display: isMobile ? "none" : "flex", gap: 2 }}>
        {[["home", "Início"], ["features", "Produto"], ["about", "Sobre"], ["contact", "Contato"]].map(([id, lbl]) => (
          <button
            key={id}
            className={`btn-g${page === id ? " act" : ""}`}
            style={{ color: dark ? "rgba(253,250,245,0.72)" : undefined, fontWeight: page === id ? 700 : 500 }}
            onClick={() => setPage(id)}
          >
            {lbl}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
        {loggedIn ? (
          <>
            <button
              className="btn-o"
              style={{ padding: "10px 22px", fontSize: 14 }}
              onClick={() => setPage("dashboard")}
            >
              Meu Dashboard →
            </button>
            <button
              className="btn-g"
              style={{ color: dark ? "rgba(253,250,245,0.72)" : C.red, padding: isMobile ? "8px 10px" : undefined, fontWeight: 600 }}
              onClick={onLogout}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-g"
              style={{ color: dark ? "rgba(253,250,245,0.72)" : undefined, padding: isMobile ? "8px 10px" : undefined }}
              onClick={() => setPage("login")}
            >
              Entrar
            </button>
            <button className="btn-o" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => setPage("signup")}>
              Criar conta grátis
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
