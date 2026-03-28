import { useState } from "react";
import { Footer } from "../components";
import { useViewportFlags } from "../hooks";
import { C } from "../styles";

export default function ContactPage({ setPage }) {
  const [form, setForm] = useState({ nome: "", email: "", tipo: "duvida", msg: "" });
  const [sent, setSent] = useState(false);
  const { isMobile, isTablet } = useViewportFlags();

  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ background: `linear-gradient(145deg, ${C.navy}, #1a2535)`, padding: isMobile ? "76px 5% 52px" : "100px 8% 70px" }}>
        <span className="tag-inv">Fale com a gente</span>
        <h1 style={{ fontSize: "clamp(34px,5vw,52px)", fontWeight: 900, color: C.light, letterSpacing: "-0.8px", lineHeight: 1.1, marginBottom: 16 }}>
          A gente tá aqui<br /><span style={{ color: C.primary }}>para ajudar</span>
        </h1>
        <p style={{ fontSize: 17, color: "rgba(253,250,245,0.45)", maxWidth: 480, lineHeight: 1.7 }}>
          Dúvida, sugestão ou quer contar como o EASE ajudou? Manda mensagem.
        </p>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "44px 5%" : "70px 8%" }}>
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1.7fr", gap: isMobile ? 22 : 40 }}>
          <div>
            {[
              { icon: "📧", label: "E-mail", val: "contato@ease.com.br" },
              { icon: "📍", label: "Localização", val: "Recife, Pernambuco — BR" },
              { icon: "🕐", label: "Resposta em", val: "até 48 horas úteis" },
              { icon: "🏫", label: "Instituição", val: "ETEC Cícero Dias — NAVE" },
            ].map((item) => (
              <div key={item.label} className="nf" style={{ padding: isMobile ? 18 : 20, marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ fontSize: 24 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="nc" style={{ padding: isMobile ? 22 : 38 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: isMobile ? "26px 8px" : "40px 20px" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>✉️</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 10 }}>Mensagem enviada!</h3>
                <p style={{ color: C.muted, lineHeight: 1.6 }}>Vamos responder em breve. Obrigado pelo contato!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nome</label>
                    <input placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>E-mail</label>
                    <input placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Tipo de contato</label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[["duvida", "Dúvida"], ["sugestao", "Sugestão"], ["outro", "Outro"]].map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => setForm({ ...form, tipo: v })}
                        style={{
                          flex: isMobile ? "1 1 100%" : 1,
                          padding: "11px 0",
                          borderRadius: 11,
                          border: "none",
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Inter",
                          background: form.tipo === v ? C.primary : C.bg,
                          color: form.tipo === v ? C.light : C.muted,
                          boxShadow: form.tipo === v ? `4px 4px 12px rgba(236,138,63,0.3)` : `4px 4px 10px ${C.sdark},-4px -4px 10px ${C.slight}`,
                          transition: "all .2s",
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Mensagem</label>
                  <textarea rows={5} placeholder="Conta o que está precisando..." value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <button className="btn-o" style={{ padding: "16px 0", fontSize: 15 }} onClick={() => form.nome && form.email && form.msg && setSent(true)}>
                  Enviar mensagem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}
