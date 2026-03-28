import { C } from "../styles";
import { useViewportFlags } from "../hooks";

export function DashOverview({ setTab, stats, lancamentos }) {
  const { isMobile, isTablet } = useViewportFlags();
  const fmt = (n) => `R$ ${Number(n).toLocaleString("pt-BR")}`;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
        {[
          { label: "Faturado no mês", val: fmt(stats.faturado), icon: "💵", color: C.navy },
          { label: "Projetado até o fim", val: fmt(stats.projetado), icon: "📈", color: C.green },
          { label: "Saldo projetado", val: fmt(stats.saldo), icon: "💰", color: C.primary },
          { label: "Retirada segura", val: fmt(stats.retirada), icon: "📤", color: C.green },
        ].map((k) => (
          <div key={k.label} className="nf" style={{ padding: 20 }}>
            <div style={{ fontSize: 22, marginBottom: 10 }}>{k.icon}</div>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="nc" style={{ padding: isMobile ? 18 : 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>📊 Projeção do Mês</h3>
          <div style={{ background: `${C.green}10`, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Mantendo seu ritmo atual, você deve fechar o mês com</div>
            <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 900, color: C.navy }}>{fmt(stats.projetado)}</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginTop: 4 }}>↑ {stats.crescimento} vs. mês anterior</div>
          </div>
          <div style={{ background: `${C.primary}10`, borderRadius: 16, padding: "16px 20px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Com base no seu ritmo, você pode retirar até</div>
            <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 900, color: C.primary }}>{fmt(stats.retirada)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>sem comprometer o fechamento do mês</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <div className="np" style={{ flex: 1, padding: 13, textAlign: "center", borderRadius: 13 }}>
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Crescimento</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.green }}>{stats.crescimento} ↑</div>
            </div>
            <div className="np" style={{ flex: 1, padding: 13, textAlign: "center", borderRadius: 13 }}>
              <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Saldo</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>{fmt(stats.saldo)}</div>
            </div>
          </div>
        </div>
        <div className="nc" style={{ padding: isMobile ? 18 : 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>🎯 Teto Anual MEI</h3>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>Faturamento acumulado 2026</div>
            <div style={{ fontSize: isMobile ? 28 : 34, fontWeight: 900, color: C.navy }}>{fmt(stats.faturado)}</div>
            <div style={{ fontSize: 13, color: C.green, fontWeight: 700, marginTop: 4 }}>de R$ 81.000 permitidos</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.muted }}>Utilizado</span>
              <span style={{ fontSize: 12, fontWeight: 900, color: C.green }}>{Math.min(100, (stats.faturado / 81000) * 100).toFixed(1)}%</span>
            </div>
            <div className="np" style={{ height: 13, overflow: "hidden", borderRadius: 20 }}>
              <div style={{ width: `${Math.min(100, (stats.faturado / 81000) * 100)}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg,${C.green},${C.primary})` }} />
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: `${C.green}10`, textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Status do teto</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Seguro</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: C.green, fontWeight: 700 }}>✅ Zona Verde — Continue assim!</div>
        </div>
      </div>
      <div className="nc" style={{ padding: isMobile ? 16 : 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>📋 Últimos lançamentos</h3>
          <button className="btn-g" style={{ color: C.primary, fontSize: 13 }} onClick={() => setTab("lancamentos")}>Ver todos →</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0, padding: "13px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                {l.tipo === "RECEITA" ? "💵" : "📤"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{l.data}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red, paddingLeft: isMobile ? 52 : 0 }}>
              {l.tipo === "RECEITA" ? "+" : "-"} {fmt(l.valor)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EnhancedDashOverview({ setTab, stats, lancamentos }) {
  return <DashOverview setTab={setTab} stats={stats} lancamentos={lancamentos} />;
}
