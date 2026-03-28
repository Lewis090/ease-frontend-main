import { useEffect, useState } from "react";
import { C } from "../styles";

export default function AnimatedCard({ setPage }) {
  const stages = [
    { notif: null, faturado: 3480, projetado: 5840, retirada: 1218, saldo: 1740, crescimento: 18, pct: 43 },
    { notif: { icon: "💵", txt: "Receita lançada: +R$ 820 via PIX" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
    { notif: { icon: "📈", txt: "Você está 22% acima do mês anterior!" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
    { notif: { icon: "⚠️", txt: "Lembrete: pague o DAS de março!" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
  ];

  const [si, setSi] = useState(0);
  const d = stages[si];

  useEffect(() => {
    const timer = setInterval(() => setSi((p) => (p + 1) % stages.length), 2800);
    return () => clearInterval(timer);
  }, [stages.length]);

  const fmt = (n) => `R$ ${n.toLocaleString("pt-BR")}`;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
      <div
        style={{
          position: "absolute",
          top: -52,
          left: 0,
          right: 0,
          background: C.navy,
          borderRadius: 14,
          padding: "12px 16px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          opacity: d.notif ? 1 : 0,
          transform: d.notif ? "translateY(0)" : "translateY(-10px)",
          transition: "all .4s cubic-bezier(.34,1.2,.64,1)",
          boxShadow: "0 8px 24px rgba(45,58,73,0.25)",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>{d.notif?.icon}</span>
        <span style={{ fontSize: 12, color: "rgba(253,250,245,0.88)", fontWeight: 500 }}>{d.notif?.txt}</span>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.primary, marginLeft: "auto", flexShrink: 0, animation: "pulse 1s infinite" }} />
      </div>

      <div className="nc" style={{ padding: 26, cursor: "pointer" }} onClick={() => setPage("dashboard")}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Faturamento projetado</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: C.navy, transition: "all .5s", fontVariantNumeric: "tabular-nums" }}>{fmt(d.projetado)}</div>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${C.green}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, transition: "all .5s" }}>↑</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 10, color: C.muted }}>Teto anual · R$ 81.000</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: C.primary, transition: "all .6s" }}>{d.pct}%</span>
          </div>
          <div className="np" style={{ height: 11, overflow: "hidden", borderRadius: 20 }}>
            <div style={{ width: `${d.pct}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg,${C.green},${C.primary})`, transition: "width .9s ease" }} />
          </div>
          <div style={{ fontSize: 10, color: C.green, fontWeight: 700, marginTop: 5 }}>Zona Verde ✅</div>
        </div>
        <div className="np" style={{ padding: 14, borderRadius: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Pode retirar com segurança</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.primary, transition: "all .6s" }}>{fmt(d.retirada)}</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="np" style={{ flex: 1, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>vs. mês anterior</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: C.green, transition: "all .5s" }}>+{d.crescimento}% ↑</div>
          </div>
          <div className="np" style={{ flex: 1, padding: 12, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Saldo projetado</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: C.navy, transition: "all .5s" }}>{fmt(d.saldo)}</div>
          </div>
        </div>
        <div style={{ marginTop: 14, padding: "9px 13px", borderRadius: 10, background: `${C.primary}12`, fontSize: 10, color: C.primary, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ animation: "pulse 1.5s infinite" }}>●</span>
          Demo ao vivo · Clique para explorar →
        </div>
      </div>
    </div>
  );
}
