import { useEffect, useState } from "react";
import { Logo } from "../components";
import { api } from "../services";
import { C } from "../styles";
import DashCalendario from "./DashCalendario";
import DashDocumentos from "./DashDocumentos";
import DashLancamentos from "./DashLancamentos";
import DashNotificacoes from "./DashNotificacoes";
import EnhancedDashOverview from "./DashOverview";
import DashRelatorio from "./DashRelatorio";
import { useViewportFlags } from "../hooks";

function getStoredUser() {
  try {
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    const id =
      parsed?.id ??
      parsed?.userId ??
      parsed?.usuarioId ??
      parsed?.idUsuario ??
      parsed?.usuario?.id ??
      1;

    let nome =
      parsed?.nome ??
      parsed?.name ??
      parsed?.usuarioNome ??
      parsed?.nomeCompleto ??
      parsed?.fullName ??
      parsed?.usuario?.nome ??
      parsed?.usuario?.name ??
      parsed?.username ??
      "Usuário";

    if (String(nome).includes("@")) {
      nome = "Usuário";
    }

    return {
      id: Number(id) || 1,
      nome,
    };
  } catch {
    return { id: 1, nome: "Usuário" };
  }
}

export default function DashboardPage({ setPage, onToast, onLogout }) {
  const { isMobile, isTablet } = useViewportFlags();
  const [tab, setTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [lancamentos, setLancamentos] = useState([]);
  const [stats, setStats] = useState({
    faturado: 0,
    projetado: 0,
    retirada: 0,
    saldo: 0,
    crescimento: "0%",
  });

  const user = getStoredUser();
  const userId = Number(user?.id);

  useEffect(() => {
    if (!Number.isFinite(userId) || userId <= 0) {
      return;
    }

    if (tab === "overview") {
      api
        .get(`/dashboard?userId=${userId}`)
        .then(setStats)
        .catch(() => setStats({ faturado: 0, projetado: 0, retirada: 0, saldo: 0, crescimento: "0%" }));
      api
        .get(`/transacoes?userId=${userId}`)
        .then((res) => setLancamentos(res.slice(0, 3)))
        .catch(() => setLancamentos([]));
    } else if (tab === "lancamentos" || tab === "calendario") {
      api.get(`/transacoes?userId=${userId}`).then(setLancamentos).catch(() => setLancamentos([]));
    }
  }, [tab, userId]);

  const tabs = [
    { id: "overview", icon: "📊", label: "Visão Geral" },
    { id: "lancamentos", icon: "📝", label: "Lançamentos" },
    { id: "calendario", icon: "📅", label: "Calendário" },
    { id: "documentos", icon: "📁", label: "Documentos" },
    { id: "notificacoes", icon: "🔔", label: "Notificações" },
    { id: "relatorio", icon: "📄", label: "Relatório" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: isTablet ? "column" : "row", minHeight: "100vh", background: C.bg }}>
      <aside
        style={{
          width: isTablet ? "100%" : 240,
          flexShrink: 0,
          padding: isTablet ? "14px 12px" : "24px 14px",
          background: C.navy,
          display: "flex",
          flexDirection: "column",
          position: isTablet ? "relative" : "sticky",
          top: 0,
          height: isTablet ? "auto" : "100vh",
        }}
      >
        <div style={{ padding: "8px 10px 28px", cursor: "pointer" }} onClick={() => setPage("home")}>
          <Logo inv size={0.78} />
        </div>
        {isTablet && (
          <p id="dashboard-nav-hint" style={{ fontSize: 11, color: "rgba(253,250,245,0.52)", margin: "0 6px 8px" }}>
            Acessibilidade mobile: deslize para os lados para ver todas as abas.
          </p>
        )}
        <div
          role="tablist"
          aria-label="Navegação do dashboard"
          aria-describedby={isTablet ? "dashboard-nav-hint" : undefined}
          style={{ display: "flex", flexDirection: isTablet ? "row" : "column", gap: 4, flex: 1, overflowX: isTablet ? "auto" : "visible", paddingBottom: isTablet ? 2 : 0 }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              aria-label={`Abrir ${t.label}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                minHeight: 44,
                borderRadius: 13,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                whiteSpace: "nowrap",
                background: tab === t.id ? "rgba(236,138,63,0.15)" : "transparent",
                color: tab === t.id ? C.primary : "rgba(253,250,245,0.5)",
                fontSize: 14,
                fontWeight: tab === t.id ? 700 : 500,
                fontFamily: "Inter",
                transition: "all .2s",
                flex: isTablet ? "0 0 auto" : "initial",
                borderLeft: tab === t.id ? `3px solid ${C.primary}` : "3px solid transparent",
              }}
            >
              <span aria-hidden="true">{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 10, marginTop: isTablet ? 12 : 0 }}>
          <div style={{ height: 64, background: `linear-gradient(135deg, ${C.primary} 0%, #c96020 50%, ${C.navy}88 100%)`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
            <div style={{ position: "absolute", bottom: -20, left: 14, width: 44, height: 44, borderRadius: 14, background: `linear-gradient(135deg, ${C.primary}, #d96e2a)`, border: "3px solid #1a2535", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 900, color: C.light }}>
              {user.nome ? user.nome.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", padding: "28px 14px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.light }}>{user.nome || "Usuário"}</div>
            <div style={{ fontSize: 11, color: "rgba(253,250,245,0.38)", marginTop: 2 }}>MEI · Perfil Ativo</div>
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>{Math.min(100, (stats.faturado / 81000) * 100).toFixed(0)}%</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>do teto</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>↑{stats.crescimento}</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>crescimento</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 10, padding: "10px 14px", color: "rgba(253,250,245,0.32)", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "Inter" }}>
          🚪 Sair
        </button>
      </aside>

      <main style={{ flex: 1, padding: isMobile ? 16 : isTablet ? 24 : 32, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexWrap: "wrap", marginBottom: isMobile ? 18 : 30 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, letterSpacing: "-0.3px" }}>{tabs.find((t) => t.id === tab)?.label}</h1>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
              {(() => {
                const data = new Date();
                const mes = data.toLocaleDateString("pt-BR", { month: "long" });
                const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
                return `${mesCapitalizado} ${data.getFullYear()}`;
              })()} · Ano fiscal aberto
            </p>
          </div>
          {tab === "lancamentos" && <button className="btn-o" onClick={() => setShowModal(true)}>+ Add Receita/Despesa</button>}
        </div>

        <section id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
          {tab === "overview" && <EnhancedDashOverview setTab={setTab} stats={stats} lancamentos={lancamentos} />}
          {tab === "lancamentos" && <DashLancamentos lancamentos={lancamentos} setLancamentos={setLancamentos} show={showModal} setShow={setShowModal} user={user} onToast={onToast} />}
          {tab === "calendario" && <DashCalendario lancamentos={lancamentos} setLancamentos={setLancamentos} user={user} onToast={onToast} setShow={setShowModal} />}
          {tab === "documentos" && <DashDocumentos onToast={onToast} />}
          {tab === "notificacoes" && <DashNotificacoes />}
          {tab === "relatorio" && <DashRelatorio user={user} onToast={onToast} />}
        </section>
      </main>
    </div>
  );
}
