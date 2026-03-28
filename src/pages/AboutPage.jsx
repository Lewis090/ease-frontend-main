import { Footer } from "../components";
import { useViewportFlags } from "../hooks";
import { C } from "../styles";

export default function AboutPage({ setPage }) {
  const { isMobile, isTablet } = useViewportFlags();

  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ background: `linear-gradient(145deg, ${C.navy}, #1a2535)`, padding: isMobile ? "76px 5% 56px" : "100px 8% 80px", textAlign: "center" }}>
        <span className="tag-inv">Sobre o EASE</span>
        <h1 style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 900, color: C.light, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: 20 }}>
          Feito por quem entende<br /><span style={{ color: C.primary }}>a realidade do MEI</span>
        </h1>
        <p style={{ fontSize: 18, color: "rgba(253,250,245,0.5)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
          O EASE nasceu de uma frustração simples: por que o microempreendedor brasileiro ainda gerencia o negócio no caderninho?
        </p>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "48px 5%" : "80px 8%" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 24, marginBottom: 56 }}>
          {[
            { icon: "🎯", title: "Missão", desc: "Democratizar o acesso à inteligência financeira, colocando nas mãos de qualquer microempreendedor a clareza que antes só grandes empresas possuíam." },
            { icon: "🌟", title: "Visão", desc: "Ser a ferramenta de decisão financeira mais usada pelos MEIs brasileiros — simples, gratuita e construída com a linguagem deles." },
            { icon: "📐", title: "Princípio central", desc: "Simplicidade radical. Nenhuma funcionalidade entra no produto se ela complicar a vida do usuário. O MEI precisa de respostas, não de relatórios." },
            { icon: "🌱", title: "Impacto social", desc: "Alinhado aos ODS 8, 9 e 10 da ONU — trabalho decente, inovação e redução das desigualdades. Cada MEI que cresce com clareza é impacto real." },
          ].map((item) => (
            <div key={item.title} className="nc" style={{ padding: isMobile ? 22 : 32 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: C.navy, marginBottom: 12 }}>{item.title}</h3>
              <p style={{ color: C.muted, lineHeight: 1.75, fontSize: 14 }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="nf" style={{ padding: isMobile ? 24 : 40, borderLeft: `4px solid ${C.primary}`, marginBottom: 48 }}>
          <p style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: C.navy, lineHeight: 1.55, fontStyle: "italic" }}>
            "O EASE não é apenas um sistema de gestão. É uma ferramenta de decisão para o MEI que quer crescer com segurança. Não é mais registro. É orientação."
          </p>
        </div>
        <div style={{ textAlign: "center" }}>
          <div className="nf" style={{ display: "inline-block", maxWidth: isTablet ? "100%" : "auto", padding: isMobile ? "20px 22px" : "24px 40px" }}>
            <div style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Projeto desenvolvido na</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>Escola Técnica Estadual Cícero Dias — NAVE</div>
            <div style={{ color: C.muted, fontSize: 14, marginTop: 6 }}>Curso Técnico em Desenvolvimento de Sistemas · 2026</div>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}
