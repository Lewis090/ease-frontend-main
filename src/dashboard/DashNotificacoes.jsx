import { C } from "../styles";
import { useViewportFlags } from "../hooks";

export default function DashNotificacoes() {
  const { isMobile } = useViewportFlags();
  const ns = [
    { tipo: "info", icon: "💬", titulo: "Projeção atualizada", msg: "Mantendo seu ritmo, você vai fechar março com R$ 5.840.", hora: "Agora mesmo", lida: false },
    { tipo: "success", icon: "✅", titulo: "Você está crescendo! 🎉", msg: "Este mês está 18% acima do mês anterior. Continue assim!", hora: "2h atrás", lida: false },
    { tipo: "warning", icon: "⚠️", titulo: "DAS de março pendente", msg: "Lembre-se de pagar o DAS de março. Vencimento: dia 20.", hora: "1 dia atrás", lida: true },
    { tipo: "info", icon: "💬", titulo: "Boas-vindas ao EASE!", msg: "Conta criada com sucesso. Comece lançando sua primeira receita.", hora: "3 dias atrás", lida: true },
  ];

  const cm = { info: C.navy, success: C.green, warning: C.yellow };

  return (
    <div className="nc" style={{ padding: isMobile ? 16 : 24 }}>
      {ns.map((n, i) => (
        <div key={i} style={{ display: "flex", gap: isMobile ? 12 : 16, padding: "16px 0", borderBottom: i < ns.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none", opacity: n.lida ? 0.6 : 1 }}>
          <div style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius: 14, flexShrink: 0, background: `${cm[n.tipo]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 18 : 20 }}>{n.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.navy, paddingRight: 8 }}>{n.titulo}</div>
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
