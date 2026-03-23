import { useEffect, useState } from "react";

function normalizeDateForUi(value) {
  if (!value) return new Date().toISOString().split("T")[0];
  const asString = String(value);
  if (asString.includes("T")) return asString.split("T")[0];
  return asString;
}

function toBackendDate(value) {
  return `${normalizeDateForUi(value)}T00:00:00`;
}

function mapTransactions(receitas, despesas) {
  const receitaItems = receitas.map((item) => ({
    id: `receita-${item.id}`,
    backendId: item.id,
    backendType: "receita",
    tipo: "RECEITA",
    descricao: item.descricao,
    valor: Number(item.valor || 0),
    data: normalizeDateForUi(item.data),
  }));

  const despesaItems = despesas.map((item) => ({
    id: `despesa-${item.id}`,
    backendId: item.id,
    backendType: "despesa",
    tipo: "DESPESA",
    descricao: item.descricao,
    valor: Number(item.valor || 0),
    data: normalizeDateForUi(item.data),
  }));

  return [...receitaItems, ...despesaItems].sort((a, b) => b.data.localeCompare(a.data));
}

function buildStatsFromTransactions(receitas, despesas) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const elapsedDays = Math.max(1, now.getDate());

  const isCurrentMonth = (item) => {
    const d = new Date(item.data);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  };

  const faturado = receitas.filter(isCurrentMonth).reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const totalDespesas = despesas.filter(isCurrentMonth).reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const saldo = faturado - totalDespesas;
  const projetado = (faturado / elapsedDays) * daysInMonth;
  const retirada = Math.max(0, saldo * 0.3);
  const crescimento = faturado > 0 ? `${Math.round(((projetado - faturado) / faturado) * 100)}%` : "0%";

  return {
    faturado,
    projetado,
    retirada,
    saldo,
    crescimento,
  };
}

function buildInitialPlanningItems() {
  return [];
}

function buildInitialMeiChecklist() {
  return [];
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { id: null, nome: "Usuario" };
    const parsed = JSON.parse(raw);
    return {
      id: parsed?.id ?? null,
      nome: parsed?.nome || "Usuario",
    };
  } catch {
    return { id: null, nome: "Usuario" };
  }
}

export default function DashboardPage({ setPage, C, api, Logo }) {
  const BrandLogo = Logo;
  const user = getStoredUser();
  const isAuthenticated = Boolean(localStorage.getItem("token") && user.id);
  const planningStorageKey = `ease-planning-${user.id}`;
  const meiStorageKey = `ease-mei-${user.id}`;
  const [tab, setTab] = useState("overview");
  const [tabHistory, setTabHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));
  const [lancamentos, setLancamentos] = useState([]);
  const [planningItems, setPlanningItems] = useState(() => {
    const savedPlanning = localStorage.getItem(planningStorageKey);
    return savedPlanning ? JSON.parse(savedPlanning) : buildInitialPlanningItems();
  });
  const [meiChecklist, setMeiChecklist] = useState(() => {
    const savedMei = localStorage.getItem(meiStorageKey);
    return savedMei ? JSON.parse(savedMei) : buildInitialMeiChecklist();
  });
  const [stats, setStats] = useState({
    faturado: 0, projetado: 0, retirada: 0, saldo: 0, crescimento: "0%"
  });

  useEffect(() => {
    if (planningItems.length) {
      localStorage.setItem(planningStorageKey, JSON.stringify(planningItems));
    }
  }, [planningItems, planningStorageKey]);

  useEffect(() => {
    if (meiChecklist.length) {
      localStorage.setItem(meiStorageKey, JSON.stringify(meiChecklist));
    }
  }, [meiChecklist, meiStorageKey]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Planning e checklist ainda não possuem endpoints no backend atual.
  }, [api, user.id, planningStorageKey, meiStorageKey]);

  useEffect(() => {
    const loadFinancialData = async () => {
      if (!isAuthenticated) {
        setStats({ faturado: 0, projetado: 0, retirada: 0, saldo: 0, crescimento: "0%" });
        setLancamentos([]);
        return;
      }

      try {
        const [receitas, despesas] = await Promise.all([
          api.get(`/usuarios/${user.id}/receitas`),
          api.get(`/usuarios/${user.id}/despesas`),
        ]);

        const mapped = mapTransactions(receitas || [], despesas || []);
        const calculatedStats = buildStatsFromTransactions(receitas || [], despesas || []);

        setStats(calculatedStats);
        setLancamentos(tab === "overview" ? mapped.slice(0, 3) : mapped);
      } catch {
        setStats({ faturado: 0, projetado: 0, retirada: 0, saldo: 0, crescimento: "0%" });
        setLancamentos([]);
      }
    };

    if (tab === "overview" || tab === "lancamentos") {
      loadFinancialData();
    }
  }, [tab, user.id, api, isAuthenticated]);

  const tabs = [
    { id: "overview", icon: "📊", label: "Visao Geral" },
    { id: "lancamentos", icon: "📝", label: "Lancamentos" },
    { id: "planejamento", icon: "📆", label: "Planejamento" },
    { id: "mei", icon: "🎯", label: "Central MEI" },
    { id: "documentos", icon: "📁", label: "Documentos" },
    { id: "notificacoes", icon: "🔔", label: "Notificacoes" },
  ];

  const navigateToTab = (nextTab) => {
    if (nextTab === tab) return;
    setTabHistory(prev => [...prev, tab]);
    setTab(nextTab);
    setMobileNavOpen(false);
  };

  const goBackTab = () => {
    if (!tabHistory.length) {
      setTab("overview");
      setMobileNavOpen(false);
      return;
    }
    const previousTab = tabHistory[tabHistory.length - 1];
    setTabHistory(prev => prev.slice(0, -1));
    setTab(previousTab);
    setMobileNavOpen(false);
  };

  const isTablet = viewportWidth <= 1100;
  const isMobile = viewportWidth <= 720;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, position: "relative" }}>
      {isTablet && mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(20,28,38,0.42)", zIndex: 340 }}
        />
      )}
      <aside style={{
        width: isTablet ? Math.min(320, Math.max(280, viewportWidth * 0.78)) : 240,
        flexShrink: 0,
        padding: "24px 14px",
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        position: isTablet ? "fixed" : "sticky",
        top: 0,
        left: isTablet ? 0 : "auto",
        height: "100vh",
        zIndex: 360,
        transform: isTablet ? (mobileNavOpen ? "translateX(0)" : "translateX(-108%)") : "none",
        transition: "transform .28s ease",
        boxShadow: isTablet ? "0 20px 40px rgba(20,28,38,0.24)" : "none",
      }}>
        <div style={{ padding: "8px 10px 28px", cursor: "pointer" }} onClick={() => setPage("home")}>
          <BrandLogo inv size={0.78} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => navigateToTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              borderRadius: 13, border: "none", cursor: "pointer", textAlign: "left",
              background: tab === t.id ? "rgba(236,138,63,0.15)" : "transparent",
              color: tab === t.id ? C.primary : "rgba(253,250,245,0.5)",
              fontSize: 14, fontWeight: tab === t.id ? 700 : 500,
              fontFamily: "Inter", transition: "all .2s",
              borderLeft: tab === t.id ? `3px solid ${C.primary}` : "3px solid transparent",
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 10 }}>
          <div style={{
            height: 64,
            background: `linear-gradient(135deg, ${C.primary} 0%, #c96020 50%, ${C.navy}88 100%)`,
            position: "relative",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }} />
            <div style={{
              position: "absolute", bottom: -20, left: 14,
              width: 44, height: 44, borderRadius: 14,
              background: `linear-gradient(135deg, ${C.primary}, #d96e2a)`,
              border: "3px solid #1a2535",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 17, fontWeight: 900, color: C.light,
            }}>{user.nome ? user.nome.charAt(0).toUpperCase() : "U"}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", padding: "28px 14px 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.light }}>{user.nome || "Usuario"}</div>
            <div style={{ fontSize: 11, color: "rgba(253,250,245,0.38)", marginTop: 2 }}>MEI · Perfil Ativo</div>
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>{Math.min(100, (stats.faturado / 81000 * 100)).toFixed(0)}%</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>do teto</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>{stats.crescimento}</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>crescimento</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setPage("home")} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 10, padding: "10px 14px", color: "rgba(253,250,245,0.32)", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "Inter" }}>← Voltar ao site</button>
      </aside>

      <main style={{ flex: 1, padding: isMobile ? "18px 14px 24px" : isTablet ? "24px 20px 32px" : 32, overflowY: "auto", width: "100%" }}>
        {isTablet && (
          <div className="nc" style={{ padding: isMobile ? "12px 14px" : "14px 18px", marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <button className="btn-n" style={{ padding: isMobile ? "10px 14px" : "12px 18px", minWidth: isMobile ? "auto" : 120 }} onClick={() => setMobileNavOpen(true)}>
              Menu
            </button>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Painel Ease</div>
              <div style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {tabs.find(t => t.id === tab)?.label}
              </div>
            </div>
            <button className="btn-g" style={{ color: C.primary, padding: "8px 10px" }} onClick={() => setPage("home")}>
              Site
            </button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 16, marginBottom: 30 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>
              Painel / {tab !== "overview" ? "Visao Geral / " : ""}{tabs.find(t => t.id === tab)?.label}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, letterSpacing: "-0.3px" }}>{tabs.find(t => t.id === tab)?.label}</h1>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Marco 2026 · Ano fiscal aberto</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
            {tabHistory.length > 0 && <button className="btn-n" style={{ padding: "12px 18px", width: isMobile ? "100%" : "auto" }} onClick={goBackTab}>Voltar</button>}
            {tab !== "overview" && <button className="btn-n" style={{ padding: "12px 18px", width: isMobile ? "100%" : "auto" }} onClick={() => { setTab("overview"); setMobileNavOpen(false); }}>Voltar para visao geral</button>}
            {tab === "lancamentos" && <button className="btn-o" style={{ width: isMobile ? "100%" : "auto" }} onClick={() => setShowModal(true)}>+ Adicionar receita</button>}
          </div>
        </div>

        {toast && (
          <div style={{
            position: "fixed",
            top: isTablet ? 16 : 24,
            right: isTablet ? 16 : 24,
            left: isMobile ? 16 : "auto",
            zIndex: 500,
            padding: "14px 18px",
            borderRadius: 14,
            background: toast.type === "error" ? C.red : C.green,
            color: C.light,
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 14px 30px rgba(20,28,38,0.18)",
            maxWidth: isMobile ? "calc(100vw - 32px)" : 360,
          }}>
            {toast.message}
          </div>
        )}

        {confirmDialog && (
          <div style={{ position: "fixed", inset: 0, zIndex: 550, background: "rgba(20,28,38,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 14 : 24 }}>
            <div className="nc" style={{ width: "100%", maxWidth: 420, padding: isMobile ? 20 : 28 }}>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 10 }}>{confirmDialog.title}</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 22 }}>{confirmDialog.message}</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexDirection: isMobile ? "column-reverse" : "row" }}>
                <button className="btn-n" style={{ padding: "12px 18px", width: isMobile ? "100%" : "auto" }} onClick={() => setConfirmDialog(null)}>Cancelar</button>
                <button className="btn-o" style={{ padding: "12px 18px", width: isMobile ? "100%" : "auto", background: `linear-gradient(135deg, ${C.red}, #c94b4b)` }} onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}>Confirmar</button>
              </div>
            </div>
          </div>
        )}

        {tab === "overview" && <EnhancedDashOverview setTab={navigateToTab} stats={stats} lancamentos={lancamentos} C={C} />}
        {tab === "lancamentos" && <DashLancamentos isAuthenticated={isAuthenticated} lancamentos={lancamentos} setLancamentos={setLancamentos} show={showModal} setShow={setShowModal} user={user} C={C} api={api} onToast={setToast} onConfirm={setConfirmDialog} />}
        {tab === "planejamento" && <CashPlanningPage C={C} stats={stats} planningItems={planningItems} setPlanningItems={setPlanningItems} onToast={setToast} onConfirm={setConfirmDialog} />}
        {tab === "mei" && <MeiCenterPage C={C} stats={stats} meiChecklist={meiChecklist} setMeiChecklist={setMeiChecklist} setTab={navigateToTab} onToast={setToast} />}
        {tab === "documentos" && <DashDocumentos C={C} api={api} />}
        {tab === "notificacoes" && <DashNotificacoes C={C} />}
      </main>
    </div>
  );
}

function EnhancedDashOverview({ setTab, stats, lancamentos, C }) {
  const fmt = n => `R$ ${Number(n).toLocaleString("pt-BR")}`;
  const faturamentoPct = Math.min(100, (Number(stats.faturado) / 81000) * 100 || 0);
  const restanteTeto = Math.max(0, 81000 - Number(stats.faturado || 0));
  const projectedWeek = Math.max(0, Number(stats.projetado || 0) * 0.24);
  const projectedMonth = Math.max(0, Number(stats.projetado || 0) - Number(stats.faturado || 0));
  const upcomingDocs = [
    { tipo: "DAS de marco", prazo: "20 mar", status: "Pendente", tone: "warn" },
    { tipo: "Relatorio mensal", prazo: "31 mar", status: "Organizar comprovantes", tone: "info" },
    { tipo: "DASN-SIMEI", prazo: "31 mai", status: "Planejar envio", tone: "ok" },
  ];
  const quickActions = [
    { title: "Nova receita", desc: "Registre vendas, PIX e recebimentos do dia.", action: () => setTab("lancamentos"), accent: C.green },
    { title: "Nova despesa", desc: "Anote custos variaveis antes de perder o controle.", action: () => setTab("lancamentos"), accent: C.red },
    { title: "Enviar DAS", desc: "Anexe guia ou comprovante para manter o fiscal em ordem.", action: () => setTab("documentos"), accent: C.primary },
    { title: "Ver alertas", desc: "Abra lembretes de teto, vencimentos e crescimento.", action: () => setTab("notificacoes"), accent: C.navy },
  ];
  const meiAlerts = [
    faturamentoPct >= 80
      ? { tone: "warn", title: "Teto MEI em atencao", body: `Voce ja consumiu ${faturamentoPct.toFixed(1)}% do limite anual. Vale revisar ritmo e proximos recebimentos.` }
      : { tone: "ok", title: "Teto MEI sob controle", body: `Restam ${fmt(restanteTeto)} ate o limite anual. O acompanhamento esta saudavel.` },
    Number(stats.saldo || 0) <= 0
      ? { tone: "danger", title: "Saldo projetado apertado", body: "Segure retiradas e revise despesas fixas para evitar fechamento negativo." }
      : { tone: "info", title: "Caixa com folga projetada", body: `Seu saldo estimado para fechar o periodo e ${fmt(stats.saldo)}.` },
    { tone: "warn", title: "Fiscal desta semana", body: "Deixe o DAS e os comprovantes separados para evitar correria no vencimento." },
  ];
  const toneMap = {
    ok: { bg: `${C.green}14`, color: C.green, badge: "Seguro" },
    info: { bg: `${C.navy}10`, color: C.navy, badge: "Monitorar" },
    warn: { bg: `${C.yellow}20`, color: "#9B6A00", badge: "Atencao" },
    danger: { bg: `${C.red}14`, color: C.red, badge: "Urgente" },
  };

  return (
    <div>
      <div className="dash-top-grid">
        <div className="nc" style={{ padding: 28, background: `linear-gradient(135deg, ${C.navy} 0%, #233447 58%, #304558 100%)`, color: C.light, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at top right, rgba(236,138,63,0.34), transparent 34%), radial-gradient(circle at bottom left, rgba(61,184,138,0.18), transparent 28%)" }} />
          <div style={{ position: "relative" }}>
            <div className="tag-inv" style={{ marginBottom: 14 }}>Painel operacional do MEI</div>
            <h3 style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.1, maxWidth: 520, marginBottom: 12 }}>Seu negocio em uma tela: caixa, teto MEI e proximas acoes.</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(253,250,245,0.74)", maxWidth: 560, marginBottom: 22 }}>
              O foco agora e decidir rapido: quanto entrou, quanto ainda cabe no teto, o que pagar e qual a proxima acao segura para manter o mes organizado.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
              <button className="btn-o" onClick={() => setTab("lancamentos")}>Lancar movimentacao</button>
              <button className="btn-inv" onClick={() => setTab("documentos")}>Organizar documentos</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
              {[
                { label: "Proximos 7 dias", value: fmt(projectedWeek) },
                { label: "Folga no teto", value: fmt(restanteTeto) },
                { label: "Retirada segura", value: fmt(stats.retirada) },
              ].map((item) => (
                <div key={item.label} style={{ borderRadius: 16, padding: "14px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 11, color: "rgba(253,250,245,0.58)", marginBottom: 5 }}>{item.label}</div>
                  <div style={{ fontSize: 21, fontWeight: 900 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nc" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>Alertas inteligentes</h3>
            <button className="btn-g" style={{ color: C.primary, fontSize: 13 }} onClick={() => setTab("notificacoes")}>Abrir central</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {meiAlerts.map((alert) => {
              const tone = toneMap[alert.tone];
              return (
                <div key={alert.title} style={{ padding: 16, borderRadius: 16, background: tone.bg }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{alert.title}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: tone.color, textTransform: "uppercase", letterSpacing: 1 }}>{tone.badge}</div>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, color: C.muted }}>{alert.body}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="dash-stats-grid">
        {[
          { label: "Faturado no mes", val: fmt(stats.faturado), icon: "💵", color: C.navy },
          { label: "Projetado ate o fim", val: fmt(stats.projetado), icon: "📈", color: C.green },
          { label: "Saldo projetado", val: fmt(stats.saldo), icon: "💰", color: C.primary },
          { label: "Retirada segura", val: fmt(stats.retirada), icon: "📤", color: C.green },
        ].map(k => (
          <div key={k.label} className="nf" style={{ padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{k.icon}</div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      <div className="nc" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Acoes rapidas</h3>
            <div style={{ fontSize: 12, color: C.muted }}>Atalhos para as tarefas que mais destravam o dia a dia.</div>
          </div>
          <div style={{ fontSize: 12, color: C.primary, fontWeight: 700 }}>Inspirado em operacao real, nao so em relatorio</div>
        </div>
        <div className="dash-quick-grid">
          {quickActions.map((item) => (
            <button key={item.title} onClick={item.action} style={{ textAlign: "left", border: "none", cursor: "pointer", borderRadius: 18, padding: "18px 18px 16px", background: `${item.accent}12`, fontFamily: "Inter" }}>
              <div style={{ width: 40, height: 40, borderRadius: 14, background: `${item.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", color: item.accent, fontSize: 18, marginBottom: 14 }}>+</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="dash-body-grid">
        <div className="nc" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 0 }}>📊 Projecao do Mes</h3>
            <div style={{ fontSize: 11, color: C.muted }}>Atualizado a partir do ritmo das suas movimentacoes</div>
          </div>
          <div style={{ background: `${C.green}10`, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Mantendo seu ritmo atual, voce deve fechar o mes com</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>{fmt(stats.projetado)}</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginTop: 4 }}>{stats.crescimento} vs. mes anterior</div>
          </div>
          <div style={{ background: `${C.primary}10`, borderRadius: 16, padding: "16px 20px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Com base no seu ritmo, voce pode retirar ate</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>{fmt(stats.retirada)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>sem comprometer o fechamento do mes</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="np" style={{ flex: 1, padding: 13, textAlign: "center", borderRadius: 13 }}>
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Crescimento</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.green }}>{stats.crescimento}</div>
            </div>
            <div className="np" style={{ flex: 1, padding: 13, textAlign: "center", borderRadius: 13 }}>
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Saldo</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>{fmt(stats.saldo)}</div>
            </div>
          </div>
          <div style={{ marginTop: 18, borderRadius: 16, background: `${C.navy}08`, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>Fluxo previsto em 30 dias</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: C.navy }}>{fmt(projectedMonth)}</div>
              </div>
              <div style={{ fontSize: 11, color: C.muted, textAlign: "right" }}>
                Meta sugerida
                <div style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginTop: 2 }}>{fmt(Number(stats.projetado || 0) * 1.1)}</div>
              </div>
            </div>
            <div className="np" style={{ height: 12, overflow: "hidden", borderRadius: 20, marginBottom: 8 }}>
              <div style={{ width: `${Math.min(100, Math.max(14, (Number(stats.projetado || 0) / 7000) * 100))}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg, ${C.navy}, ${C.primary})` }} />
            </div>
            <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>Se mantiver o ritmo atual, voce fecha o periodo com caixa suficiente para operar e ainda preservar uma retirada segura.</div>
          </div>
        </div>

        <div className="nc" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>🎯 Teto Anual MEI</h3>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Faturamento acumulado 2026</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: C.navy }}>{fmt(stats.faturado)}</div>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginTop: 4 }}>de R$ 81.000 permitidos</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.muted }}>Utilizado</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: faturamentoPct >= 80 ? "#9B6A00" : C.green }}>{faturamentoPct.toFixed(1)}%</span>
            </div>
            <div className="np" style={{ height: 13, overflow: "hidden", borderRadius: 20 }}>
              <div style={{ width: `${faturamentoPct}%`, height: "100%", borderRadius: 20, background: faturamentoPct >= 80 ? `linear-gradient(90deg, ${C.yellow}, ${C.red})` : `linear-gradient(90deg,${C.green},${C.primary})` }} />
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: faturamentoPct >= 80 ? `${C.yellow}20` : `${C.green}10`, textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Status do teto</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{faturamentoPct >= 80 ? "Em atencao" : "Seguro"}</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: faturamentoPct >= 80 ? "#9B6A00" : C.green, fontWeight: 700, marginBottom: 16 }}>
            {faturamentoPct >= 80 ? "Zona de atencao - revise proximos recebimentos." : "Zona verde - continue assim!"}
          </div>
          <div className="dash-doc-grid">
            {upcomingDocs.map((doc) => {
              const tone = doc.tone === "warn" ? { bg: `${C.yellow}20`, color: "#9B6A00" } : doc.tone === "ok" ? { bg: `${C.green}12`, color: C.green } : { bg: `${C.navy}10`, color: C.navy };
              return (
                <div key={doc.tipo} style={{ borderRadius: 14, padding: 14, background: tone.bg }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{doc.prazo}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{doc.tipo}</div>
                  <div style={{ fontSize: 11, color: tone.color, fontWeight: 700 }}>{doc.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="nc" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>📋 Ultimos lancamentos</h3>
          <button className="btn-g" style={{ color: C.primary, fontSize: 13 }} onClick={() => setTab("lancamentos")}>Ver todos →</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {l.tipo === "RECEITA" ? "💵" : "📤"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{l.data}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red }}>
              {l.tipo === "RECEITA" ? "+" : "-"} {fmt(l.valor)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CashPlanningPage({ C, stats, planningItems, setPlanningItems, onToast, onConfirm }) {
  const [form, setForm] = useState({
    titulo: "",
    tipo: "RECEBER",
    categoria: "Vendas",
    valor: "",
    data: "2026-03-28",
  });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ tipo: "todos", status: "todos" });
  const [search, setSearch] = useState("");
  const fmt = n => `R$ ${Number(n).toLocaleString("pt-BR")}`;
  const totalReceber = planningItems.filter(item => item.tipo === "RECEBER").reduce((sum, item) => sum + Number(item.valor), 0);
  const totalPagar = planningItems.filter(item => item.tipo === "PAGAR").reduce((sum, item) => sum + Number(item.valor), 0);
  const projectedBalance = Number(stats.saldo || 0) + totalReceber - totalPagar;
  const sortedItems = [...planningItems]
    .filter((item) => filters.tipo === "todos" || item.tipo === filters.tipo)
    .filter((item) => filters.status === "todos" || item.status === filters.status)
    .filter((item) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return item.titulo.toLowerCase().includes(term) || item.categoria.toLowerCase().includes(term);
    })
    .sort((a, b) => a.data.localeCompare(b.data));

  const addItem = async () => {
    if (!form.titulo || !form.valor || !form.data) return;
    const payload = {
      ...form,
      valor: Number(form.valor),
      status: form.status || "previsto",
    };
    if (editingId) {
      const updatedItems = planningItems.map(item => item.id === editingId ? { ...item, ...payload } : item);
      setPlanningItems(updatedItems);
      setEditingId(null);
      setForm({ titulo: "", tipo: "RECEBER", categoria: "Vendas", valor: "", data: form.data });
      onToast?.({ type: "success", message: "Item atualizado localmente." });
      return;
    }
    setPlanningItems([{ id: Date.now(), ...payload, localOnly: true }, ...planningItems]);
    setForm({ titulo: "", tipo: "RECEBER", categoria: "Vendas", valor: "", data: form.data });
    onToast?.({ type: "success", message: "Item salvo localmente." });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      titulo: item.titulo,
      tipo: item.tipo,
      categoria: item.categoria,
      valor: String(item.valor),
      data: item.data,
      status: item.status,
    });
  };

  const toggleStatus = async (id) => {
    const currentItem = planningItems.find(item => item.id === id);
    if (!currentItem) return;
    const nextStatus = currentItem.status === "confirmado" ? "previsto" : "confirmado";
    setPlanningItems(planningItems.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    onToast?.({ type: "success", message: "Status atualizado localmente." });
  };

  const removeItem = async (id) => {
    onConfirm?.({
      title: "Remover item do planejamento?",
      message: "Essa acao nao pode ser desfeita. O item sera excluido da sua agenda de caixa.",
      onConfirm: () => {
        setPlanningItems(planningItems.filter(item => item.id !== id));
        onToast?.({ type: "success", message: "Item removido." });
      },
    });
  };

  return (
    <div>
      <div className="dash-top-grid">
        <div className="nc" style={{ padding: 28 }}>
          <div className="tag" style={{ marginBottom: 12 }}>Planejamento de Caixa</div>
          <h3 style={{ fontSize: 28, fontWeight: 900, color: C.navy, marginBottom: 10 }}>Antecipe o que entra, o que sai e como isso afeta seu caixa.</h3>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            Inspirado no fluxo de caixa projetado de ferramentas como Conta Azul e Nibo: voce monta seus proximos compromissos e testa o impacto no saldo antes do vencimento.
          </p>
          <div className="dash-stats-grid" style={{ marginBottom: 0 }}>
            {[
              { label: "A receber", value: fmt(totalReceber), color: C.green },
              { label: "A pagar", value: fmt(totalPagar), color: C.red },
              { label: "Saldo projetado", value: fmt(projectedBalance), color: projectedBalance >= 0 ? C.primary : C.red },
            ].map((item) => (
              <div key={item.label} className="nf" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="nc" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 16 }}>Novo item futuro</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input placeholder="Descricao da movimentacao" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["RECEBER", "PAGAR"].map((tipo) => (
                <button key={tipo} onClick={() => setForm({ ...form, tipo })} style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "none",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: form.tipo === tipo ? (tipo === "RECEBER" ? C.green : C.red) : "#E8E4DE",
                  color: form.tipo === tipo ? C.light : C.muted,
                }}>{tipo === "RECEBER" ? "Receber" : "Pagar"}</button>
              ))}
            </div>
            <input placeholder="Categoria" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input type="number" placeholder="Valor" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
              <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-o" style={{ flex: 1 }} onClick={addItem}>{editingId ? "Salvar edicao" : "Adicionar ao planejamento"}</button>
              {editingId && <button className="btn-n" style={{ flex: 1 }} onClick={() => {
                setEditingId(null);
                setForm({ titulo: "", tipo: "RECEBER", categoria: "Vendas", valor: "", data: "2026-03-28" });
              }}>Cancelar</button>}
            </div>
          </div>
        </div>
      </div>

      <div className="nc" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>Agenda de caixa</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", width: "100%" }}>
            <input placeholder="Buscar por descricao ou categoria" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", maxWidth: 320, flex: "1 1 220px" }} />
            <select value={filters.tipo} onChange={(e) => setFilters({ ...filters, tipo: e.target.value })} style={{ background: C.bg, border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "Inter", color: C.navy }}>
              <option value="todos">Todos</option>
              <option value="RECEBER">A receber</option>
              <option value="PAGAR">A pagar</option>
            </select>
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={{ background: C.bg, border: "none", borderRadius: 12, padding: "12px 14px", fontFamily: "Inter", color: C.navy }}>
              <option value="todos">Todos os status</option>
              <option value="previsto">Previsto</option>
              <option value="confirmado">Confirmado</option>
            </select>
            <div style={{ fontSize: 12, color: C.muted }}>{sortedItems.length} itens planejados</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sortedItems.map((item) => (
            <div key={item.id} className="nf" style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{item.titulo}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{item.categoria} · {item.data}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", width: "100%" }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: item.tipo === "RECEBER" ? C.green : C.red }}>
                  {item.tipo === "RECEBER" ? "+" : "-"} {fmt(item.valor)}
                </div>
                <button className="btn-g" style={{ background: item.status === "confirmado" ? `${C.green}18` : `${C.navy}08`, color: item.status === "confirmado" ? C.green : C.navy }} onClick={() => toggleStatus(item.id)}>
                  {item.status === "confirmado" ? "Confirmado" : "Marcar confirmado"}
                </button>
                <button className="btn-g" style={{ color: C.primary }} onClick={() => startEdit(item)}>Editar</button>
                <button className="btn-g" style={{ color: C.red }} onClick={() => removeItem(item.id)}>Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MeiCenterPage({ C, stats, meiChecklist, setMeiChecklist, setTab, onToast }) {
  const fmt = n => `R$ ${Number(n).toLocaleString("pt-BR")}`;
  const progress = Math.min(100, (Number(stats.faturado) / 81000) * 100 || 0);
  const completedCount = meiChecklist.filter(item => item.concluido).length;

  const toggleChecklist = async (id) => {
    const currentItem = meiChecklist.find(item => item.id === id);
    if (!currentItem) return;
    const nextValue = !currentItem.concluido;
    setMeiChecklist(meiChecklist.map(item => item.id === id ? { ...item, concluido: nextValue } : item));
    onToast?.({ type: "success", message: "Checklist atualizado localmente." });
  };

  const fiscalCards = [
    { titulo: "Limite anual do MEI", detalhe: `${progress.toFixed(1)}% utilizado`, destaque: fmt(81000 - Number(stats.faturado || 0)), legenda: "de folga restante" },
    { titulo: "DAS do mes", detalhe: "Vencimento dia 20", destaque: "Pendente", legenda: "organize o pagamento" },
    { titulo: "Declaracao anual", detalhe: "Prazo ate 31/05", destaque: "Em preparacao", legenda: "deixe os dados fechados" },
  ];

  return (
    <div>
      <div className="dash-top-grid">
        <div className="nc" style={{ padding: 28 }}>
          <div className="tag" style={{ marginBottom: 12 }}>Central MEI</div>
          <h3 style={{ fontSize: 28, fontWeight: 900, color: C.navy, marginBottom: 10 }}>Tudo que voce precisa acompanhar no fiscal sem sair do painel.</h3>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
            Inspirado em ferramentas como MaisMei: vencimentos, teto anual, documentos e checklist operacional em uma mesma rotina.
          </p>
          <div className="dash-doc-grid">
            {fiscalCards.map((card) => (
              <div key={card.titulo} className="nf" style={{ padding: 18 }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{card.titulo}</div>
                <div style={{ fontSize: 13, color: C.navy, fontWeight: 700, marginBottom: 8 }}>{card.detalhe}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>{card.destaque}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{card.legenda}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="nc" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 14 }}>Rotina da semana</h3>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.green, marginBottom: 4 }}>{completedCount}/{meiChecklist.length}</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>itens concluidos no checklist</div>
          <div className="np" style={{ height: 12, overflow: "hidden", borderRadius: 20, marginBottom: 12 }}>
            <div style={{ width: `${meiChecklist.length ? (completedCount / meiChecklist.length) * 100 : 0}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg, ${C.green}, ${C.primary})` }} />
          </div>
          <button className="btn-n" style={{ width: "100%" }} onClick={() => setTab("documentos")}>Abrir documentos fiscais</button>
        </div>
      </div>

      <div className="dash-body-grid">
        <div className="nc" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>Checklist operacional</h3>
            <div style={{ fontSize: 12, color: C.muted }}>marque o que ja ficou em dia</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {meiChecklist.map((item) => (
              <button key={item.id} onClick={() => toggleChecklist(item.id)} style={{ border: "none", cursor: "pointer", textAlign: "left", fontFamily: "Inter", borderRadius: 16, padding: 16, background: item.concluido ? `${C.green}14` : C.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{item.titulo}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{item.grupo} · prazo {item.prazo}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: item.concluido ? C.green : C.primary }}>
                    {item.concluido ? "Concluido" : "Pendente"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="nc" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 18 }}>Agenda fiscal</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { prazo: "20 mar", titulo: "Pagar DAS", detalhe: "Deixe a guia anexada e o comprovante salvo.", tone: C.red },
              { prazo: "31 mar", titulo: "Fechar relatorio mensal", detalhe: "Conferir receitas, despesas e documentos do periodo.", tone: C.primary },
              { prazo: "31 mai", titulo: "Enviar DASN-SIMEI", detalhe: "Usar os dados acumulados do ano anterior.", tone: C.green },
            ].map((item) => (
              <div key={item.titulo} className="nf" style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: item.tone, fontWeight: 800, marginBottom: 4 }}>{item.prazo}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 5 }}>{item.titulo}</div>
                <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{item.detalhe}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashLancamentos({ isAuthenticated, lancamentos, setLancamentos, show, setShow, user, C, api, onToast, onConfirm }) {
  const [novo, setNovo] = useState({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0] });
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!novo.valor || !novo.desc) return;
    setLoading(true);
    try {
      if (!isAuthenticated) {
        const localItem = {
          id: `local-${Date.now()}`,
          backendId: null,
          backendType: "local",
          tipo: novo.tipo,
          descricao: novo.desc,
          valor: Number(novo.valor || 0),
          data: normalizeDateForUi(novo.data),
        };
        setLancamentos([localItem, ...lancamentos]);
        setShow(false);
        setNovo({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0] });
        onToast?.({ type: "success", message: "Lancamento salvo localmente (modo demonstracao)." });
        return;
      }

      const payload = {
        descricao: novo.desc,
        valor: Number(novo.valor),
        data: toBackendDate(novo.data),
      };
      const route = novo.tipo === "RECEITA"
        ? `/usuarios/${user.id}/receitas`
        : `/usuarios/${user.id}/despesas`;
      const res = await api.post(route, payload);

      if (res?.id) {
        const mapped = {
          id: `${novo.tipo === "RECEITA" ? "receita" : "despesa"}-${res.id}`,
          backendId: res.id,
          backendType: novo.tipo === "RECEITA" ? "receita" : "despesa",
          tipo: novo.tipo,
          descricao: res.descricao,
          valor: Number(res.valor || 0),
          data: normalizeDateForUi(res.data),
        };
        setLancamentos([mapped, ...lancamentos]);
        setShow(false);
        setNovo({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0] });
        onToast?.({ type: "success", message: "Lancamento salvo com sucesso." });
      }
    } catch (error) {
      onToast?.({ type: "error", message: error.message || "Erro ao salvar lancamento." });
    } finally {
      setLoading(false);
    }
  };

  const removeLancamento = (item) => {
    onConfirm?.({
      title: "Remover lancamento?",
      message: "Essa acao exclui o lancamento do seu historico financeiro.",
      onConfirm: async () => {
        const previous = lancamentos;
        setLancamentos(lancamentos.filter(current => current.id !== item.id));
        try {
          if (!isAuthenticated || item.backendType === "local" || !item.backendId) {
            onToast?.({ type: "success", message: "Lancamento removido localmente." });
            return;
          }

          const route = item.backendType === "receita"
            ? `/usuarios/${user.id}/receitas/${item.backendId}`
            : `/usuarios/${user.id}/despesas/${item.backendId}`;
          await api.delete(route);
          onToast?.({ type: "success", message: "Lancamento removido com sucesso." });
        } catch {
          setLancamentos(previous);
          onToast?.({ type: "error", message: "Nao foi possivel remover o lancamento." });
        }
      },
    });
  };

  return (
    <div>
      {show && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,38,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
          <div className="nc" style={{ width: "100%", maxWidth: 430, padding: 38 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>+ Novo lancamento</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[["RECEITA", "💵 Receita"], ["DESPESA", "📤 Despesa"]].map(([v, l]) => (
                  <button key={v} onClick={() => setNovo({ ...novo, tipo: v })} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter",
                    background: novo.tipo === v ? (v === "RECEITA" ? C.green : C.red) : "#E8E4DE",
                    color: novo.tipo === v ? C.light : C.muted, transition: "all .2s",
                  }}>{l}</button>
                ))}
              </div>
              <input placeholder="Valor (R$)" type="number" value={novo.valor} onChange={e => setNovo({ ...novo, valor: e.target.value })} />
              <input placeholder="Descricao (ex: venda de sabado)" value={novo.desc} onChange={e => setNovo({ ...novo, desc: e.target.value })} />
              {novo.tipo === "RECEITA" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["PIX", "Cartao", "Dinheiro"].map(f => (
                    <button key={f} onClick={() => setNovo({ ...novo, forma: f })} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter",
                      background: novo.forma === f ? C.primary : "#E8E4DE",
                      color: novo.forma === f ? C.light : C.muted, transition: "all .2s",
                    }}>{f}</button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                <button className="btn-n" style={{ flex: 1, padding: "13px 0" }} onClick={() => setShow(false)}>Cancelar</button>
                <button className="btn-o" style={{ flex: 2, padding: "14px 0" }} onClick={add} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar lancamento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="nc" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: C.muted }}>{lancamentos.length} lancamentos registrados</span>
          <button className="btn-o" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setShow(true)}>+ Adicionar</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                {l.tipo === "RECEITA" ? "💵" : "📤"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{l.data}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", width: "100%" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red }}>
                {l.tipo === "RECEITA" ? "+" : "-"} R$ {Number(l.valor).toLocaleString("pt-BR")}
              </div>
              <button className="btn-g" style={{ color: C.red, padding: "8px 12px" }} onClick={() => removeLancamento(l)}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashDocumentos({ C, api }) {
  const [docs, setDocs] = useState(() => {
    const saved = localStorage.getItem("ease-docs");
    return saved ? JSON.parse(saved) : [];
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    localStorage.setItem("ease-docs", JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    api.get("/documentos").then(setDocs).catch(() => {});
  }, [api]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      try {
        const res = await api.upload("/upload", file);
        alert(res?.mensagem || "Arquivo enviado com sucesso.");
        const remoteDocs = await api.get("/documentos");
        if (Array.isArray(remoteDocs)) {
          setDocs(remoteDocs);
          return;
        }
      } catch {
        const localDoc = {
          tipo: file.name,
          mes: new Date().toLocaleDateString("pt-BR"),
          status: "ok",
        };
        setDocs((prev) => [localDoc, ...prev]);
        alert("Arquivo salvo localmente.");
      }
    } catch {
      alert("Erro no upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="nc" style={{ padding: 28, marginBottom: 20 }}>
        <label style={{ border: `2px dashed ${C.primary}40`, borderRadius: 18, padding: 36, textAlign: "center", cursor: "pointer", display: "block" }}>
          <input type="file" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          <div style={{ fontSize: 38, marginBottom: 12 }}>📎</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 6 }}>{uploading ? "Enviando..." : "Anexar DAS ou DASN"}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>PDF ou imagem · Max. 5MB por arquivo</div>
          <div className="btn-o" style={{ display: "inline-block" }}>Selecionar arquivo</div>
        </label>
      </div>
      <div className="nc" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Documentos fiscais</h3>
        {docs.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < docs.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{d.tipo}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.mes}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: d.status === "Pago" || d.status === "ok" ? `${C.green}15` : `${C.red}12`, color: d.status === "Pago" || d.status === "ok" ? C.green : C.red }}>
              {d.status === "Pago" || d.status === "ok" ? "Anexado" : "Pendente"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashNotificacoes({ C }) {
  const ns = [
    { tipo: "info", icon: "💬", titulo: "Projecao atualizada", msg: "Mantendo seu ritmo, voce vai fechar marco com R$ 5.840.", hora: "Agora mesmo", lida: false },
    { tipo: "success", icon: "✅", titulo: "Voce esta crescendo!", msg: "Este mes esta 18% acima do mes anterior. Continue assim!", hora: "2h atras", lida: false },
    { tipo: "warning", icon: "⚠", titulo: "DAS de marco pendente", msg: "Lembre-se de pagar o DAS de marco. Vencimento: dia 20.", hora: "1 dia atras", lida: true },
    { tipo: "info", icon: "💬", titulo: "Boas-vindas ao EASE!", msg: "Conta criada com sucesso. Comece lancando sua primeira receita.", hora: "3 dias atras", lida: true },
  ];
  const cm = { info: C.navy, success: C.green, warning: C.yellow };

  return (
    <div className="nc" style={{ padding: 24 }}>
      {ns.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < ns.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none", opacity: n.lida ? 0.6 : 1 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: `${cm[n.tipo]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{n.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{n.titulo}</div>
              {!n.lida && <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary, flexShrink: 0, marginTop: 4 }} />}
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 5, lineHeight: 1.55 }}>{n.msg}</div>
            <div style={{ fontSize: 11, color: `${C.muted}70`, marginTop: 6 }}>{n.hora}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
