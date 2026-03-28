import { useViewportFlags } from "../hooks";
import { C } from "../styles";
import Logo from "./Logo";

export default function Footer({ setPage }) {
  const { isMobile, isTablet } = useViewportFlags();

  return (
    <footer style={{ background: C.navy, padding: isMobile ? "56px 5% 32px" : "70px 8% 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1.4fr 1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 28 : 48, marginBottom: 56 }}>
          <div>
            <Logo inv size={0.82} />
            <p style={{ color: "rgba(253,250,245,0.38)", fontSize: 14, lineHeight: 1.75, marginTop: 18, maxWidth: 260 }}>
              Gestão financeira para quem não tem tempo de errar. Gratuito para MEI.
            </p>
          </div>
          {[
            { title: "Produto", links: [["Funcionalidades", "features"], ["Como funciona", "home"], ["Demonstração", "dashboard"]] },
            { title: "Empresa", links: [["Sobre nós", "about"], ["Contato", "contact"]] },
            { title: "Legal", links: [["Termos de Uso", "terms"], ["Política de Privacidade", "terms"], ["LGPD", "terms"]] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.light, marginBottom: 18, textTransform: "uppercase", letterSpacing: 1.5 }}>{col.title}</div>
              {col.links.map(([label, pg]) => (
                <div key={label} style={{ marginBottom: 11 }}>
                  <span
                    style={{ color: "rgba(253,250,245,0.38)", fontSize: 14, cursor: "pointer", transition: "color .2s" }}
                    onClick={() => setPage(pg)}
                    onMouseEnter={(e) => {
                      e.target.style.color = C.light;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "rgba(253,250,245,0.38)";
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ paddingTop: 24, borderTop: "1px solid rgba(253,250,245,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "rgba(253,250,245,0.22)", fontSize: 13 }}>© 2026 Ease · ETEC Cícero Dias — NAVE · Em conformidade com a LGPD</div>
          <div style={{ color: "rgba(253,250,245,0.22)", fontSize: 13 }}>ODS 8 · ODS 9 · ODS 10 🌱</div>
        </div>
      </div>
    </footer>
  );
}
