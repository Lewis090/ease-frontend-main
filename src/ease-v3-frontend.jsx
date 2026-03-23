import { useState, useEffect } from "react";
import DashboardModule from "./dashboard-module";

const C = {
  bg: "#EDEAE4", bgL: "#F5F2EC",
  primary: "#EC8A3F", navy: "#2D3A49",
  text: "#2D3A49", muted: "#8A98A5", light: "#FDFAF5",
  green: "#3DB88A", red: "#E05C5C", yellow: "#F5C518",
  sdark: "rgba(45,58,73,0.16)", slight: "rgba(255,255,255,0.85)",
};

const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8080").replace(/\/$/, "");

async function parseApiResponse(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensagem: text };
    }
  }
  if (!res.ok) {
    const message = data?.mensagem || `Erro HTTP ${res.status}`;
    throw new Error(message);
  }
  return data;
}

function buildHeaders(extra = {}, options = {}) {
  const { skipAuth = false } = options;
  const token = localStorage.getItem("token");
  return {
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

const api = {
  get: (url, options = {}) => fetch(`${API_BASE}${url}`, {
    headers: buildHeaders({}, options),
  }).then(parseApiResponse),

  post: (url, data, options = {}) => fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }, options),
    body: JSON.stringify(data),
  }).then(parseApiResponse),

  put: (url, data, options = {}) => fetch(`${API_BASE}${url}`, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }, options),
    body: JSON.stringify(data),
  }).then(parseApiResponse),

  delete: (url, options = {}) => fetch(`${API_BASE}${url}`, {
    method: "DELETE",
    headers: buildHeaders({}, options),
  }).then(parseApiResponse),

  upload: (url, file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: buildHeaders({}, options),
      body: formData,
    }).then(parseApiResponse);
  },
};

const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;}
.nf{background:${C.bg};box-shadow:7px 7px 16px ${C.sdark},-7px -7px 16px ${C.slight};border-radius:18px;}
.nc{background:${C.bgL};box-shadow:9px 9px 22px ${C.sdark},-9px -9px 22px ${C.slight};border-radius:22px;}
.np{box-shadow:inset 4px 4px 10px ${C.sdark},inset -4px -4px 10px ${C.slight};border-radius:14px;}
.btn-o{background:linear-gradient(135deg,${C.primary},#d96e2a);color:${C.light};border:none;border-radius:14px;padding:15px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 14px rgba(236,138,63,0.38),-2px -2px 8px rgba(255,255,255,0.5);transition:all .2s;}
.btn-o:hover{transform:translateY(-2px);}
.btn-n{background:${C.bg};color:${C.navy};border:none;border-radius:14px;padding:15px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:5px 5px 14px ${C.sdark},-5px -5px 14px ${C.slight};transition:all .2s;}
.btn-n:hover{transform:translateY(-2px);}
.btn-g{background:transparent;color:${C.navy};border:none;padding:10px 18px;font-size:14px;font-weight:500;cursor:pointer;border-radius:10px;transition:all .2s;font-family:'Inter',sans-serif;}
.btn-g:hover{background:rgba(45,58,73,0.07);}
.btn-g.act{color:${C.primary};font-weight:700;}
.btn-inv{background:rgba(255,255,255,0.1);color:${C.light};border:2px solid rgba(255,255,255,0.2);border-radius:14px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;}
.btn-inv:hover{background:rgba(255,255,255,0.18);}
input,textarea,select{background:${C.bg};border:none;border-radius:12px;padding:14px 18px;font-size:14px;color:${C.text};font-family:'Inter',sans-serif;width:100%;box-shadow:inset 3px 3px 8px ${C.sdark},inset -3px -3px 8px ${C.slight};outline:none;transition:all .2s;}
input::placeholder,textarea::placeholder{color:${C.muted};}
input:focus,textarea:focus,select:focus{box-shadow:inset 4px 4px 10px ${C.sdark},inset -4px -4px 10px ${C.slight},0 0 0 2px rgba(236,138,63,0.3);}
.tag{display:inline-block;background:rgba(236,138,63,0.13);color:${C.primary};border-radius:20px;padding:6px 16px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:18px;}
.tag-inv{display:inline-block;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:20px;padding:6px 16px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:18px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
.fu{animation:fadeUp .55s ease both;}
section{scroll-margin-top:76px;}
.dash-top-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);gap:20px;margin-bottom:20px;}
.dash-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px;}
.dash-body-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,1fr);gap:20px;margin-bottom:20px;}
.dash-quick-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;}
.dash-doc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;}
@media (max-width:1100px){.dash-top-grid,.dash-body-grid{grid-template-columns:1fr;}}
@media (max-width:720px){.dash-stats-grid,.dash-quick-grid,.dash-doc-grid{grid-template-columns:1fr;}}
@media (max-width:720px){.btn-o,.btn-n,.btn-inv{padding:13px 18px;font-size:14px;}input,textarea,select{padding:13px 14px;font-size:14px;}}
`;

// ─── LOGO ──────────────────────────────────────────────────────────
function Logo({ inv = false, size = 1 }) {
  const ink = inv ? C.light : C.navy;
  return (
    <svg width={100 * size} height={36 * size} viewBox="0 0 100 36" fill="none">
      <circle cx="18" cy="20" r="12" stroke={ink} strokeWidth="2.4" />
      <line x1="9" y1="20" x2="27" y2="20" stroke={ink} strokeWidth="2" />
      <line x1="11.5" y1="26" x2="24.5" y2="26" stroke={ink} strokeWidth="2" />
      <path d="M16.5 8 C18.5 3,27 1,31 5 C27 4,21 7,19 11 Z" fill={C.primary} />
      <text x="35" y="27" fontFamily="Inter" fontWeight="800" fontSize="20" fill={ink}>Ease</text>
    </svg>
  );
}

function useViewportFlags() {
  const [width, setWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1280));

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width <= 720,
    isTablet: width <= 1100,
  };
}

// ─── NAV ───────────────────────────────────────────────────────────
function Nav({ page, setPage, darkMode }) {
  const [sc, setSc] = useState(false);
  const { isMobile } = useViewportFlags();
  useEffect(() => {
    const h = () => setSc(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const dark = darkMode && !sc;
  // eslint-disable-next-line no-unused-vars
  const navLinks = [["home", "InÃ­cio"], ["features", "Produto"], ["about", "Sobre"], ["contact", "Contato"]];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: isMobile ? "0 4.5%" : "0 6%", height: isMobile ? 68 : 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: sc ? (darkMode ? "rgba(20,28,38,0.93)" : "rgba(237,234,228,0.93)") : "transparent",
      backdropFilter: sc ? "blur(18px)" : "none",
      borderBottom: sc ? `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(45,58,73,0.07)"}` : "none",
      transition: "all .3s",
    }}>
      <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}><Logo inv={dark} size={isMobile ? 0.78 : 0.88} /></div>
      <div style={{ display: isMobile ? "none" : "flex", gap: 2 }}>
        {[["home", "Início"], ["features", "Produto"], ["about", "Sobre"], ["contact", "Contato"]].map(([id, lbl]) => (
          <button key={id} className={`btn-g${page === id ? " act" : ""}`}
            style={{ color: dark ? "rgba(253,250,245,0.72)" : undefined, fontWeight: page === id ? 700 : 500 }}
            onClick={() => setPage(id)}>{lbl}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: isMobile ? 6 : 10 }}>
        <button className="btn-g" style={{ color: dark ? "rgba(253,250,245,0.72)" : undefined, padding: isMobile ? "8px 10px" : undefined }} onClick={() => setPage("login")}>Entrar</button>
        <button className="btn-o" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => setPage("signup")}>Criar conta grátis</button>
      </div>
    </nav>
  );
}

// ─── ANIMATED HERO CARD ────────────────────────────────────────────
function AnimatedCard({ setPage }) {
  const stages = [
    { notif: null, faturado: 3480, projetado: 5840, retirada: 1218, saldo: 1740, crescimento: 18, pct: 43 },
    { notif: { icon: "💵", txt: "Receita lançada: +R$ 820 via PIX" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
    { notif: { icon: "📈", txt: "Você está 22% acima do mês anterior!" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
    { notif: { icon: "⚠️", txt: "Lembrete: pague o DAS de março!" }, faturado: 4300, projetado: 6180, retirada: 1450, saldo: 2070, crescimento: 22, pct: 53 },
  ];
  const [si, setSi] = useState(0);
  const d = stages[si];

  useEffect(() => {
    const t = setInterval(() => setSi(p => (p + 1) % stages.length), 2800);
    return () => clearInterval(t);
  }, [stages.length]);

  const fmt = n => `R$ ${n.toLocaleString("pt-BR")}`;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340 }}>
      <div style={{
        position: "absolute", top: -52, left: 0, right: 0,
        background: C.navy, borderRadius: 14, padding: "12px 16px",
        display: "flex", gap: 10, alignItems: "center",
        opacity: d.notif ? 1 : 0,
        transform: d.notif ? "translateY(0)" : "translateY(-10px)",
        transition: "all .4s cubic-bezier(.34,1.2,.64,1)",
        boxShadow: "0 8px 24px rgba(45,58,73,0.25)", zIndex: 10,
      }}>
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

// ─── FAQ ACCORDION ─────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "O EASE é realmente gratuito? Tem pegadinha?",
    a: "Sim, 100% gratuito — sem cartão de crédito, sem versão limitada, sem prazo de validade. O plano base do EASE é gratuito para sempre para qualquer MEI. No futuro, vamos oferecer serviços opcionais como consultoria financeira personalizada, auditoria de negócio e análise estratégica — tudo contratado por sua escolha, nunca imposto. Também estamos desenvolvendo parceria com o Sebrae para ampliar o suporte disponível.",
    icon: "💰",
  },
  {
    q: "Preciso ter contador para usar o EASE?",
    a: "Não. O EASE foi construído exatamente para quem não tem contador. Você não precisa de conhecimento técnico, de um profissional de contabilidade, nem de nenhuma formação financeira. Se você tiver um contador, ótimo — vale muito a pena mostrar os dados do EASE pra ele, vão ser reuniões muito mais produtivas. Mas para usar o sistema do dia a dia, você não precisa de ninguém além de você mesmo.",
    icon: "🧾",
  },
  {
    q: "Meus dados financeiros ficam seguros?",
    a: "Sim. O EASE segue rigorosamente a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018). Seus dados são armazenados com criptografia, nunca são vendidos ou compartilhados com terceiros, e você tem total controle sobre eles — podendo exportar ou excluir sua conta a qualquer momento. Levamos a privacidade do empreendedor a sério porque entendemos que os dados do seu negócio são tão pessoais quanto seus dados pessoais.",
    icon: "🔒",
  },
  {
    q: "O que é o teto de faturamento do MEI e por que isso importa?",
    a: "O MEI tem um limite anual de faturamento estabelecido por lei — em 2026, esse limite é R$ 81.000. Se você ultrapassar esse valor, pode ser desenquadrado da categoria MEI no ano seguinte, perdendo os benefícios fiscais. O EASE monitora isso automaticamente e te avisa antes que seja tarde, com alertas em 80%, 100% e 120% do limite.",
    icon: "🎯",
  },
  {
    q: "O EASE funciona para qualquer tipo de negócio MEI?",
    a: "Sim. O EASE é independente do segmento: funciona para comerciante de bairro, artesão, produtor rural, prestador de serviços, revendedora, freelancer, dono de lava-jato — qualquer pessoa formalizada como MEI. O sistema não precisa saber o que você vende; ele trabalha com os valores que você registra.",
    icon: "🏪",
  },
  {
    q: "O que acontece com meus dados se eu parar de usar o EASE?",
    a: "Seus dados ficam armazenados por até 10 anos no plano gratuito, conforme o prazo recomendado para guarda de documentos fiscais. Você pode voltar quando quiser. Se preferir encerrar sua conta, basta solicitar a exclusão completa dos dados — todos serão removidos permanentemente em até 30 dias, conforme a LGPD.",
    icon: "📁",
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="nf"
          style={{ overflow: "hidden", transition: "all .3s" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%", padding: "22px 28px",
              display: "flex", alignItems: "center", gap: 16,
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: "Inter", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>{item.q}</span>
            <span style={{
              fontSize: 20, color: C.primary, flexShrink: 0, fontWeight: 300,
              transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform .3s",
            }}>+</span>
          </button>
          <div style={{
            maxHeight: open === i ? 300 : 0,
            overflow: "hidden",
            transition: "max-height .4s ease",
          }}>
            <p style={{
              padding: "0 28px 24px 68px",
              fontSize: 14, color: C.muted, lineHeight: 1.8,
            }}>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TERMS OF SERVICE PAGE ─────────────────────────────────────────
function TermsPage({ setPage }) {
  const { isMobile } = useViewportFlags();
  return (
    <div style={{ paddingTop: 72 }}>
      <div style={{ background: `linear-gradient(145deg, ${C.navy}, #1a2535)`, padding: isMobile ? "72px 5% 48px" : "80px 8% 60px" }}>
        <span className="tag-inv">Legal</span>
        <h1 style={{ fontSize: "clamp(30px,4vw,48px)", fontWeight: 900, color: C.light, letterSpacing: "-0.5px", marginBottom: 14 }}>
          Termos de Uso e Política de Privacidade
        </h1>
        <p style={{ color: "rgba(253,250,245,0.5)", fontSize: 15, lineHeight: 1.7 }}>
          Versão 1.0 · Vigência a partir de janeiro de 2026 · Em conformidade com a LGPD (Lei nº 13.709/2018)
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: isMobile ? "40px 5%" : "60px 8%" }}>
        {[
          {
            titulo: "1. Identificação do Controlador de Dados",
            corpo: `O EASE é uma plataforma de gestão financeira desenvolvida como projeto educacional pela Escola Técnica Estadual Cícero Dias — NAVE, Recife/PE, no âmbito do Curso Técnico em Desenvolvimento de Sistemas.\n\nPara fins desta política, o Controlador de Dados é a equipe responsável pelo projeto EASE, identificada pelo e-mail: contato@ease.com.br.`,
          },
          {
            titulo: "2. Dados Coletados e Finalidade",
            corpo: `O EASE coleta exclusivamente os dados necessários para o funcionamento da plataforma:\n\n• Dados de identificação: nome completo, endereço de e-mail e CNPJ do MEI — para criação de conta e autenticação.\n• Dados do negócio: nome fantasia, dados de funcionário (se aplicável), despesas fixas mensais — para personalização dos cálculos de projeção.\n• Dados financeiros: lançamentos de receita e despesa registrados pelo próprio usuário — para geração de projeções e indicadores.\n• Documentos fiscais: arquivos de DAS-MEI e DASN-SIMEI enviados voluntariamente pelo usuário — para organização documental.\n\nNenhum dado é coletado de forma automática, passiva ou sem o conhecimento e consentimento expresso do usuário.`,
          },
          {
            titulo: "3. Base Legal do Tratamento (LGPD)",
            corpo: `O tratamento de dados no EASE é fundamentado nas seguintes bases legais previstas pela Lei nº 13.709/2018 (LGPD):\n\n• Consentimento (Art. 7º, I): o usuário concorda expressamente com esta política ao criar sua conta.\n• Execução de contrato (Art. 7º, V): o tratamento é necessário para prestar o serviço de gestão financeira contratado.\n• Legítimo interesse (Art. 7º, IX): para envio de notificações de alertas fiscais relevantes ao usuário.\n\nO EASE não realiza tratamento de dados para fins de publicidade, perfilamento comercial ou compartilhamento com anunciantes.`,
          },
          {
            titulo: "4. Compartilhamento de Dados",
            corpo: `O EASE não vende, aluga, cede ou compartilha seus dados pessoais ou financeiros com terceiros para fins comerciais.\n\nPoderá haver compartilhamento apenas nas seguintes situações:\n• Por determinação legal ou judicial, quando exigido por autoridade competente.\n• Com prestadores de serviços técnicos essenciais (ex: infraestrutura de armazenamento em nuvem), mediante contratos que garantam a proteção dos dados conforme a LGPD.\n• Mediante solicitação expressa e autorização do próprio usuário (ex: ao contratar serviço de consultoria parceiro do EASE).`,
          },
          {
            titulo: "5. Armazenamento e Segurança",
            corpo: `Os dados são armazenados em servidores protegidos com:\n• Criptografia em trânsito (HTTPS/TLS) e em repouso.\n• Autenticação por token JWT com expiração controlada.\n• Senhas armazenadas exclusivamente em formato hash bcrypt — nunca em texto puro.\n• Acesso restrito a dados de usuários por equipe autorizada, sob registro de auditoria.\n\nO histórico financeiro é mantido gratuitamente por até 10 anos, conforme recomendação para guarda de documentos fiscais do Simples Nacional.`,
          },
          {
            titulo: "6. Direitos do Titular (LGPD — Art. 18)",
            corpo: `Como titular dos seus dados, você tem direito a:\n\n• Confirmação e acesso: saber quais dados o EASE possui sobre você.\n• Correção: atualizar dados incompletos, inexatos ou desatualizados.\n• Anonimização ou eliminação: solicitar a anonimização ou exclusão de dados desnecessários.\n• Portabilidade: receber seus dados financeiros em formato exportável.\n• Revogação do consentimento: cancelar sua conta e excluir todos os dados a qualquer momento.\n• Oposição: opor-se ao tratamento de dados em casos que julgar inadequados.\n\nPara exercer qualquer um desses direitos, entre em contato por: contato@ease.com.br. Prazo de resposta: até 15 dias úteis.`,
          },
          {
            titulo: "7. Cookies e Rastreamento",
            corpo: `O EASE utiliza apenas cookies técnicos essenciais ao funcionamento da plataforma (ex: manutenção de sessão autenticada). Não utilizamos cookies de rastreamento, publicidade comportamental ou analytics de terceiros.`,
          },
          {
            titulo: "8. Menores de Idade",
            corpo: `O EASE é destinado exclusivamente a pessoas maiores de 18 anos formalizadas como Microempreendedoras Individuais. Não coletamos intencionalmente dados de menores. Caso identificada coleta não intencional, os dados serão excluídos imediatamente.`,
          },
          {
            titulo: "9. Alterações nesta Política",
            corpo: `Esta política pode ser atualizada para refletir mudanças legais, regulatórias ou no serviço. Alterações relevantes serão comunicadas a todos os usuários cadastrados por e-mail e notificação dentro da plataforma, com antecedência mínima de 30 dias. A continuidade de uso após a comunicação implica aceite das novas condições.`,
          },
          {
            titulo: "10. Foro e Legislação Aplicável",
            corpo: `Esta política é regida pelas leis brasileiras, em especial pela Lei nº 13.709/2018 (LGPD) e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990). Fica eleito o foro da Comarca de Recife/PE para dirimir quaisquer controvérsias.`,
          },
        ].map((sec, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 16, letterSpacing: "-0.2px" }}>{sec.titulo}</h2>
            {sec.corpo.split("\n\n").map((par, j) => (
              <p key={j} style={{ fontSize: 14, color: C.muted, lineHeight: 1.85, marginBottom: 12, whiteSpace: "pre-line" }}>{par}</p>
            ))}
            <div style={{ height: 1, background: `${C.navy}08`, marginTop: 32 }} />
          </div>
        ))}

        <div className="nf" style={{ padding: isMobile ? 20 : 28, marginTop: 16, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>📋</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Dúvidas sobre esta política?</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
              Entre em contato com nossa equipe pelo e-mail <strong style={{ color: C.primary }}>contato@ease.com.br</strong>. Respondemos em até 48 horas úteis.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 40, textAlign: "center", display: "flex", justifyContent: "center", gap: 14, flexDirection: isMobile ? "column" : "row" }}>
          <button className="btn-o" onClick={() => setPage("signup")} style={{ marginRight: 14 }}>Criar conta grátis →</button>
          <button className="btn-n" onClick={() => setPage("home")}>← Voltar ao início</button>
        </div>
      </div>
    </div>
  );
}

// ─── HOME ──────────────────────────────────────────────────────────
function HomePage({ setPage }) {
  const { isMobile, isTablet } = useViewportFlags();
  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: isMobile ? "auto" : "100vh",
        background: `linear-gradient(145deg, ${C.navy} 0%, #1a2535 60%, #0f1a28 100%)`,
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 5% 24px" : "0 8%", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-20%", right: isMobile ? "-45%" : "-10%", width: isMobile ? 320 : 600, height: isMobile ? 320 : 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(236,138,63,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isMobile ? 34 : 80, alignItems: "center", width: "100%", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "108px 0 36px" : "120px 0 80px" }}>
          <div className="fu">
            <span className="tag-inv">🇧🇷 Para os 15 milhões de MEIs do Brasil</span>
            <h1 style={{ fontSize: "clamp(38px,5vw,62px)", fontWeight: 900, lineHeight: 1.1, color: C.light, marginBottom: 24, letterSpacing: "-1px" }}>
              Seu negócio merece<br /><span style={{ color: C.primary }}>mais do que um</span><br />caderninho.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, color: "rgba(253,250,245,0.6)", lineHeight: 1.75, marginBottom: isMobile ? 28 : 40, maxWidth: 470 }}>
              O EASE transforma lançamentos simples em clareza de decisão — sem planilha, sem contador, sem jargão.
            </p>
            <div style={{ display: "flex", gap: 14, flexDirection: isMobile ? "column" : "row" }}>
              <button className="btn-o" style={{ fontSize: 16, padding: "17px 34px" }} onClick={() => setPage("signup")}>Começar agora — é grátis</button>
              <button className="btn-inv" onClick={() => setPage("dashboard")}>Ver demonstração →</button>
            </div>
            <div style={{ display: "flex", gap: isMobile ? 18 : 32, marginTop: isMobile ? 30 : 44, flexWrap: "wrap" }}>
              {[["15M+", "MEIs no Brasil"], ["R$ 0", "Para sempre"], ["< 3min", "Para começar"]].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: C.primary }}>{v}</div>
                  <div style={{ fontSize: 12, color: "rgba(253,250,245,0.4)", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: isTablet ? 0 : 50 }}>
            <AnimatedCard setPage={setPage} />
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ background: "#141C26", padding: isMobile ? "72px 5%" : "100px 8%" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ maxWidth: 620, marginBottom: 64 }}>
            <span className="tag-inv">O problema</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,50px)", fontWeight: 900, color: C.light, lineHeight: 1.15, letterSpacing: "-0.5px" }}>
              Mais de 15 milhões de MEIs gerenciam o negócio assim:
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 20 }}>
            {[
              { icon: "📒", title: "No caderninho", desc: "Sem cálculo, sem projeção, sem histórico. Quando acaba o caderno, acaba a informação." },
              { icon: "💬", title: "No WhatsApp", desc: "Rápido e familiar. Mas não é gestão — é improviso bem-intencionado." },
              { icon: "🤔", title: "Na memória", desc: "\"Acho que tá bem.\" Decisões financeiras não podem depender de sensação." },
            ].map(item => (
              <div key={item.title} style={{ background: "#1E2A38", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.light, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "rgba(253,250,245,0.42)", lineHeight: 1.7, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO — feature rows */}
      <section style={{ padding: isMobile ? "76px 5%" : "110px 8%", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="tag">A solução</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,50px)", fontWeight: 900, color: C.navy, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              O EASE responde as perguntas<br />que você faz todo dia.
            </h2>
          </div>
          {[
            { icon: "📈", tag: "Projeção automática", title: "Quanto você vai faturar este mês?", desc: "Com base no seu ritmo de lançamentos, o EASE projeta o fechamento do mês automaticamente. Sem fórmula, sem planilha. A resposta aparece em linguagem simples, atualizada a cada novo lançamento.", msg: "Mantendo seu ritmo atual, você deve fechar o mês com R$ 5.840.", cor: C.green, inv: false },
            { icon: "💰", tag: "Retirada segura", title: "Posso retirar dinheiro agora?", desc: "A pergunta mais comum do microempreendedor — e a que mais fica sem resposta. O EASE calcula o saldo projetado e sugere o valor máximo que você pode retirar sem comprometer o mês.", msg: "Você pode retirar até R$ 1.218 sem comprometer o fechamento do mês.", cor: C.primary, inv: true },
            { icon: "🎯", tag: "Indicador de crescimento", title: "Estou crescendo ou estagnado?", desc: "Comparativo mês a mês em linguagem humana. Sem gráfico complexo, sem terminologia técnica. Uma seta pra cima ou pra baixo — e uma frase que você entende de verdade.", msg: "Você está crescendo! Este mês está 18% acima do anterior. 🎉", cor: C.green, inv: false },
            { icon: "⚠️", tag: "Alertas de teto", title: "Quando vou atingir o limite do MEI?", desc: "O teto de R$ 81.000 é o limite legal do MEI. O EASE monitora automaticamente e dispara alertas em 80%, 100% e 120% do limite — com explicação clara do que fazer em cada caso.", msg: "Atenção: você já usou 80% do seu teto anual. Cuidado com os próximos meses.", cor: C.yellow, inv: true },
          ].map((f, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64,
              alignItems: "center", marginBottom: 80,
              direction: f.inv ? "rtl" : "ltr",
            }}>
              <div style={{ direction: "ltr" }}>
                <span className="tag">{f.icon} {f.tag}</span>
                <h3 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 900, color: C.navy, lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>{f.desc}</p>
              </div>
              <div style={{ direction: "ltr" }}>
                <div className="nc" style={{ padding: 30 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: `${f.cor}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{f.icon}</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>EASE · Agora</div>
                  </div>
                  <div style={{ background: `${f.cor}10`, borderLeft: `3px solid ${f.cor}`, borderRadius: "0 12px 12px 0", padding: "14px 18px", marginBottom: 18 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: f.cor, lineHeight: 1.5 }}>"{f.msg}"</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div className="np" style={{ flex: 1, padding: 12, textAlign: "center", borderRadius: 12 }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Faturado</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>R$ 4.300</div>
                    </div>
                    <div className="np" style={{ flex: 1, padding: 12, textAlign: "center", borderRadius: 12 }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 3 }}>Projetado</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: f.cor }}>R$ 5.840</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: C.navy, padding: isMobile ? "72px 5%" : "100px 8%" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span className="tag-inv">Como funciona</span>
          <h2 style={{ fontSize: "clamp(32px,4vw,50px)", fontWeight: 900, color: C.light, marginBottom: 16, letterSpacing: "-0.5px" }}>3 passos. Menos de 3 minutos.</h2>
          <p style={{ fontSize: 17, color: "rgba(253,250,245,0.45)", marginBottom: 60, lineHeight: 1.7 }}>Construído para quem não tem tempo de aprender um sistema novo.</p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 24 }}>
            {[
              { n: "01", icon: "✍️", title: "Você lança o que recebeu", desc: "Valor, data e forma de pagamento. 10 segundos. Sem categorias obrigatórias." },
              { n: "02", icon: "⚡", title: "O EASE calcula tudo", desc: "Projeção do mês, saldo esperado e indicador de crescimento — automático." },
              { n: "03", icon: "✅", title: "Você decide com clareza", desc: "\"Posso retirar R$ 800 sem comprometer o mês.\" A decisão é sua. A clareza, a gente dá." },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.08)", position: "relative" }}>
                <div style={{ position: "absolute", top: 16, right: 20, fontSize: 11, fontWeight: 900, color: "rgba(236,138,63,0.28)", letterSpacing: 2 }}>{s.n}</div>
                <div style={{ fontSize: 38, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: C.light, marginBottom: 12 }}>{s.title}</h3>
                <p style={{ color: "rgba(253,250,245,0.42)", lineHeight: 1.7, fontSize: 14 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEM/COM */}
      <section style={{ padding: isMobile ? "72px 5%" : "100px 8%", background: C.bg }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span className="tag">Por que o EASE é diferente</span>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, color: C.navy, marginBottom: 56, letterSpacing: "-0.5px" }}>
            Não é mais um software de gestão.<br />É uma ferramenta de decisão.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 20, textAlign: "left" }}>
            {[
              { sem: "Não sabe quanto vai faturar no mês", com: "Projeção automática baseada no seu ritmo atual" },
              { sem: "Decide às cegas se pode retirar dinheiro", com: "Sugestão de retirada segura baseada em dados reais" },
              { sem: "Não sabe se está crescendo", com: "Indicador de crescimento mês a mês em linguagem simples" },
              { sem: "Risco silencioso de desenquadramento do MEI", com: "Alertas progressivos do teto antes que seja tarde" },
              { sem: "Documentos fiscais perdidos ou desorganizados", com: "DAS e DASN organizados por ano, acessíveis sempre" },
              { sem: "Confusão entre CPF e CNPJ no controle financeiro", com: "Tudo registrado sob o CNPJ, separado e organizado" },
            ].map((item, i) => (
              <div key={i} className="nf" style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: C.red, fontSize: 16, flexShrink: 0, marginTop: 2 }}>✗</span>
                  <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{item.sem}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: C.green, fontSize: 16, flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.navy, fontWeight: 600, lineHeight: 1.6 }}>{item.com}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section style={{ background: "#141C26", padding: isMobile ? "72px 5%" : "100px 8%" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span className="tag-inv">Dúvidas frequentes</span>
            <h2 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, color: C.light, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              Respostas diretas,<br />sem rodeio.
            </h2>
          </div>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItemDark key={i} item={item} />
          ))}
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ color: "rgba(253,250,245,0.35)", fontSize: 14, marginBottom: 20 }}>
              Ainda tem dúvida? Fala com a gente.
            </p>
            <button className="btn-o" onClick={() => setPage("contact")}>Entrar em contato →</button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: isMobile ? "72px 5%" : "90px 8%", background: C.bg }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="nc" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: "-0.3px" }}>
              Dicas de gestão para MEI.<br />Toda semana.
            </h2>
            <p style={{ color: C.muted, marginBottom: 28, lineHeight: 1.7 }}>
              Conteúdo prático sobre finanças, teto de faturamento e crescimento. Em linguagem humana.
            </p>
            <NewsletterForm />
            <p style={{ color: C.muted, fontSize: 11, marginTop: 14 }}>Sem spam. Cancele quando quiser.</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: isMobile ? "88px 5%" : "120px 8%", textAlign: "center", background: `linear-gradient(135deg, ${C.primary}, #c96020)` }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,54px)", fontWeight: 900, color: C.light, marginBottom: 18, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
            Pronto para parar de adivinhar?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(253,250,245,0.7)", marginBottom: 42, lineHeight: 1.6 }}>
            Crie sua conta em menos de 3 minutos. Sem cartão. Sem pegadinha. Gratuito para sempre na base.
          </p>
          <button className="btn-n" style={{ fontSize: 17, padding: "18px 44px" }} onClick={() => setPage("signup")}>
            Criar minha conta grátis →
          </button>
          <p style={{ color: "rgba(253,250,245,0.4)", fontSize: 13, marginTop: 18 }}>
            Já são mais de 15 milhões de MEIs no Brasil que merecem essa clareza.
          </p>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

function FAQItemDark({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "#1E2A38", borderRadius: 18, marginBottom: 12,
      border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "22px 28px",
        display: "flex", alignItems: "center", gap: 16,
        background: "transparent", border: "none", cursor: "pointer",
        fontFamily: "Inter", textAlign: "left",
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: C.light, lineHeight: 1.4 }}>{item.q}</span>
        <span style={{
          fontSize: 22, color: C.primary, flexShrink: 0, fontWeight: 300,
          transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .3s",
        }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 320 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
        <p style={{ padding: "0 28px 24px 66px", fontSize: 14, color: "rgba(253,250,245,0.5)", lineHeight: 1.85 }}>{item.a}</p>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const { isMobile } = useViewportFlags();
  return ok ? (
    <div style={{ color: C.green, fontWeight: 700, fontSize: 16 }}>✓ Cadastrado! Até a próxima edição 🎉</div>
  ) : (
    <div style={{ display: "flex", gap: 12, maxWidth: 420, margin: "0 auto", flexDirection: isMobile ? "column" : "row" }}>
      <input placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1 }} />
      <button className="btn-o" style={{ whiteSpace: "nowrap", width: isMobile ? "100%" : "auto" }} onClick={() => email && setOk(true)}>Quero receber</button>
    </div>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────
function AboutPage({ setPage }) {
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
          ].map(item => (
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

// ─── CONTACT ───────────────────────────────────────────────────────
function ContactPage({ setPage }) {
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
            ].map(item => (
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
                    <input placeholder="Seu nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>E-mail</label>
                    <input placeholder="seu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Tipo de contato</label>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {[["duvida", "Dúvida"], ["sugestao", "Sugestão"], ["outro", "Outro"]].map(([v, l]) => (
                      <button key={v} onClick={() => setForm({ ...form, tipo: v })} style={{
                        flex: isMobile ? "1 1 100%" : 1, padding: "11px 0", borderRadius: 11, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter",
                        background: form.tipo === v ? C.primary : C.bg,
                        color: form.tipo === v ? C.light : C.muted,
                        boxShadow: form.tipo === v ? `4px 4px 12px rgba(236,138,63,0.3)` : `4px 4px 10px ${C.sdark},-4px -4px 10px ${C.slight}`,
                        transition: "all .2s",
                      }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Mensagem</label>
                  <textarea rows={5} placeholder="Conta o que está precisando..." value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} style={{ resize: "vertical" }} />
                </div>
                <button className="btn-o" style={{ padding: "16px 0", fontSize: 15 }}
                  onClick={() => form.nome && form.email && form.msg && setSent(true)}>Enviar mensagem</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────
function LoginPage({ setPage }) {
  const [f, setF] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  const { isMobile } = useViewportFlags();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", f, { skipAuth: true });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify({ id: res.id, nome: res.nome }));
        setPage("dashboard");
      } else {
        alert(res.mensagem || "Erro ao entrar");
      }
    } catch (error) {
      alert(error.message || "Erro na conexão com a API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "22px 4%" : "40px 5%", background: C.bg }}>
      <div className="nc" style={{ width: "100%", maxWidth: 420, padding: isMobile ? 24 : 46 }}>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 18 }}>
          <button className="btn-g" style={{ color: C.primary, padding: "8px 0" }} onClick={() => setPage("home")}>
            ← Voltar ao menu principal
          </button>
        </div>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 36 }}>
          <Logo size={0.8} />
          <h2 style={{ fontSize: 24, fontWeight: 900, color: C.navy, marginTop: 20, letterSpacing: "-0.3px" }}>Entrar na sua conta</h2>
          <p style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>Bem-vindo de volta! 👋</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>E-mail</label>
            <input type="email" placeholder="seu@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Senha</label>
            <input type="password" placeholder="••••••••" value={f.senha} onChange={e => setF({ ...f, senha: e.target.value })} />
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 13, color: C.primary, cursor: "pointer", fontWeight: 700 }}>Esqueci minha senha</span>
          </div>
          <button className="btn-o" style={{ padding: "16px 0", fontSize: 15 }} onClick={handleLogin} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: C.muted }}>
          Não tem conta?{" "}
          <span style={{ color: C.primary, fontWeight: 700, cursor: "pointer" }} onClick={() => setPage("signup")}>Criar agora — é grátis</span>
        </p>
      </div>
    </div>
  );
}

// ─── SIGNUP ────────────────────────────────────────────────────────
function SignupPage({ setPage }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ nome: "", email: "", cnpj: "", empresa: "", senha: "" });
  const [aceitou, setAceitou] = useState(false);
  const [erroTermos, setErroTermos] = useState(false);
  const { isMobile } = useViewportFlags();

  const [loading, setLoading] = useState(false);

  const finalizarCadastro = async () => {
    if (!aceitou) { setErroTermos(true); return; }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        nome: f.nome,
        email: f.email,
        senha: f.senha,
      }, { skipAuth: true });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify({ id: res.id, nome: res.nome }));
        setPage("dashboard");
      } else {
        alert(res.mensagem || "Erro ao cadastrar");
      }
    } catch (error) {
      alert(error.message || "Erro na conexão com a API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "22px 4%" : "40px 5%", background: C.bg }}>
      <div className="nc" style={{ width: "100%", maxWidth: 480, padding: isMobile ? 24 : 46 }}>
        <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 18 }}>
          <button className="btn-g" style={{ color: C.primary, padding: "8px 0" }} onClick={() => setPage("home")}>
            ← Voltar ao menu principal
          </button>
        </div>
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <Logo size={0.8} />
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.navy, marginTop: 20, letterSpacing: "-0.3px" }}>
            {step === 1 ? "Criar sua conta gratuita" : "Dados do negócio"}
          </h2>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
            {[1, 2].map(s => (
              <div key={s} style={{ width: s === step ? 30 : 10, height: 10, borderRadius: 8, background: s <= step ? C.primary : `${C.primary}25`, transition: "all .35s" }} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nome completo</label>
              <input placeholder="Como você se chama?" value={f.nome} onChange={e => setF({ ...f, nome: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>E-mail</label>
              <input type="email" placeholder="seu@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Senha</label>
              <input type="password" placeholder="Mínimo 8 caracteres" value={f.senha} onChange={e => setF({ ...f, senha: e.target.value })} />
            </div>
            <button className="btn-o" style={{ padding: "16px 0", fontSize: 15, marginTop: 6 }} onClick={() => f.nome && f.email && f.senha && setStep(2)}>
              Continuar →
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>CNPJ do MEI</label>
              <input placeholder="00.000.000/0001-00" value={f.cnpj} onChange={e => setF({ ...f, cnpj: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.navy, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nome do negócio</label>
              <input placeholder="Nome fantasia ou razão social" value={f.empresa} onChange={e => setF({ ...f, empresa: e.target.value })} />
            </div>

            {/* ── ACEITE DE TERMOS ───────────── */}
            <div style={{
              padding: isMobile ? "14px 14px" : "16px 18px", borderRadius: 14,
              background: erroTermos ? `${C.red}10` : `${C.navy}06`,
              border: `1px solid ${erroTermos ? C.red : "transparent"}`,
              transition: "all .2s",
            }}>
              <label style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                <div
                  onClick={() => { setAceitou(!aceitou); setErroTermos(false); }}
                  style={{
                    width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                    background: aceitou ? C.primary : C.bg,
                    boxShadow: aceitou ? `3px 3px 8px rgba(236,138,63,0.4)` : `3px 3px 8px ${C.sdark},-3px -3px 8px ${C.slight}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all .2s", cursor: "pointer",
                  }}
                >
                  {aceitou && <span style={{ color: C.light, fontSize: 13, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  Li e concordo com os{" "}
                  <span
                    style={{ color: C.primary, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                    onClick={(e) => { e.stopPropagation(); setPage("terms"); }}
                  >
                    Termos de Uso e Política de Privacidade
                  </span>
                  {" "}do EASE, incluindo o tratamento de dados conforme a{" "}
                  <strong style={{ color: C.navy }}>LGPD (Lei nº 13.709/2018)</strong>.
                </span>
              </label>
              {erroTermos && (
                <p style={{ fontSize: 12, color: C.red, marginTop: 10, fontWeight: 600 }}>
                  ⚠ Você precisa aceitar os termos para criar sua conta.
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 4, flexDirection: isMobile ? "column-reverse" : "row" }}>
              <button className="btn-n" style={{ flex: 1, padding: "14px 0" }} onClick={() => setStep(1)}>← Voltar</button>
              <button className="btn-o" style={{ flex: 2, padding: "14px 0" }} onClick={finalizarCadastro} disabled={loading}>
                Criar conta grátis 🚀
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: C.muted }}>
          Já tem conta?{" "}
          <span style={{ color: C.primary, fontWeight: 700, cursor: "pointer" }} onClick={() => setPage("login")}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────
function DashboardPage({ setPage }) {
  const [tab, setTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [lancamentos, setLancamentos] = useState([]);
  const [stats, setStats] = useState({
    faturado: 0, projetado: 0, retirada: 0, saldo: 0, crescimento: "0%"
  });

  const user = JSON.parse(localStorage.getItem("user") || '{"id":1, "nome":"Usuário"}');

  useEffect(() => {
    if (tab === "overview") {
      api.get(`/dashboard?userId=${user.id}`).then(setStats);
      api.get(`/transacoes?userId=${user.id}`).then(res => setLancamentos(res.slice(0, 3)));
    } else if (tab === "lancamentos") {
      api.get(`/transacoes?userId=${user.id}`).then(setLancamentos);
    }
  }, [tab, user.id]);

  const tabs = [
    { id: "overview", icon: "📊", label: "Visão Geral" },
    { id: "lancamentos", icon: "📝", label: "Lançamentos" },
    { id: "documentos", icon: "📁", label: "Documentos" },
    { id: "notificacoes", icon: "🔔", label: "Notificações" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <aside style={{ width: 240, flexShrink: 0, padding: "24px 14px", background: C.navy, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "8px 10px 28px", cursor: "pointer" }} onClick={() => setPage("home")}>
          <Logo inv size={0.78} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
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

        {/* USER CARD COM CAPA */}
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
            <div style={{ fontSize: 14, fontWeight: 700, color: C.light }}>{user.nome || "Usuário"}</div>
            <div style={{ fontSize: 11, color: "rgba(253,250,245,0.38)", marginTop: 2 }}>MEI · Perfil Ativo</div>
            <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.primary }}>{Math.min(100, (stats.faturado / 81000 * 100)).toFixed(0)}%</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>do teto</div>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.green }}>↑{stats.crescimento}</div>
                <div style={{ fontSize: 9, color: "rgba(253,250,245,0.32)", marginTop: 1 }}>crescimento</div>
              </div>
            </div>
          </div>
        </div>

        <button onClick={() => setPage("home")} style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 10, padding: "10px 14px", color: "rgba(253,250,245,0.32)", fontSize: 12, cursor: "pointer", textAlign: "left", fontFamily: "Inter" }}>← Voltar ao site</button>
      </aside>

      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: C.navy, letterSpacing: "-0.3px" }}>{tabs.find(t => t.id === tab)?.label}</h1>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Março 2026 · Ano fiscal aberto</p>
          </div>
          {tab === "lancamentos" && <button className="btn-o" onClick={() => setShowModal(true)}>+ Adicionar receita</button>}
        </div>

        {tab === "overview" && <EnhancedDashOverview setTab={setTab} stats={stats} lancamentos={lancamentos} />}
        {tab === "lancamentos" && <DashLancamentos lancamentos={lancamentos} setLancamentos={setLancamentos} show={showModal} setShow={setShowModal} user={user} />}
        {tab === "documentos" && <DashDocumentos />}
        {tab === "notificacoes" && <DashNotificacoes />}
      </main>
    </div>
  );
}

function DashOverview({ setTab, stats, lancamentos }) {
  const fmt = n => `R$ ${Number(n).toLocaleString("pt-BR")}`;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 22 }}>
        {[
          { label: "Faturado no mês", val: fmt(stats.faturado), icon: "💵", color: C.navy },
          { label: "Projetado até o fim", val: fmt(stats.projetado), icon: "📈", color: C.green },
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
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
        <div className="nc" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>📊 Projeção do Mês</h3>
          <div style={{ background: `${C.green}10`, borderRadius: 16, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Mantendo seu ritmo atual, você deve fechar o mês com</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: C.navy }}>{fmt(stats.projetado)}</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700, marginTop: 4 }}>↑ {stats.crescimento} vs. mês anterior</div>
          </div>
          <div style={{ background: `${C.primary}10`, borderRadius: 16, padding: "16px 20px", marginBottom: 18 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Com base no seu ritmo, você pode retirar até</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>{fmt(stats.retirada)}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>sem comprometer o fechamento do mês</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
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
              <span style={{ fontSize: 12, fontWeight: 900, color: C.green }}>{Math.min(100, (stats.faturado / 81000 * 100)).toFixed(1)}%</span>
            </div>
            <div className="np" style={{ height: 13, overflow: "hidden", borderRadius: 20 }}>
              <div style={{ width: `${Math.min(100, (stats.faturado / 81000 * 100))}%`, height: "100%", borderRadius: 20, background: `linear-gradient(90deg,${C.green},${C.primary})` }} />
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 12, background: `${C.green}10`, textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>Status do teto</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Seguro</div>
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: C.green, fontWeight: 700 }}>✅ Zona Verde — Continue assim!</div>
        </div>
      </div>
      <div className="nc" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>📋 Últimos lançamentos</h3>
          <button className="btn-g" style={{ color: C.primary, fontSize: 13 }} onClick={() => setTab("lancamentos")}>Ver todos →</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
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

function EnhancedDashOverview({ setTab, stats, lancamentos }) {
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
            <button
              key={item.title}
              onClick={item.action}
              style={{
                textAlign: "left",
                border: "none",
                cursor: "pointer",
                borderRadius: 18,
                padding: "18px 18px 16px",
                background: `${item.accent}12`,
                fontFamily: "Inter",
              }}
            >
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>📋 Ultimos lancamentos</h3>
          <button className="btn-g" style={{ color: C.primary, fontSize: 13 }} onClick={() => setTab("lancamentos")}>Ver todos →</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
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

function DashLancamentos({ lancamentos, setLancamentos, show, setShow, user }) {
  const [novo, setNovo] = useState({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!novo.valor || !novo.desc) return;
    setLoading(true);
    try {
      const payload = {
        descricao: novo.desc,
        tipo: novo.tipo,
        valor: novo.valor,
        data: novo.data
      };
      const res = await api.post(`/transacao?userId=${user.id}`, payload);
      if (res.id) {
        setLancamentos([res, ...lancamentos]);
        setShow(false);
        setNovo({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split('T')[0] });
      }
    } catch {
      alert("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {show && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,38,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="nc" style={{ width: 430, padding: 38 }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>+ Novo lançamento</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {[["RECEITA", "💵 Receita"], ["DESPESA_VARIAVEL", "📤 Despesa"]].map(([v, l]) => (
                  <button key={v} onClick={() => setNovo({ ...novo, tipo: v })} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12, border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter",
                    background: novo.tipo === v ? (v === "RECEITA" ? C.green : C.red) : "#E8E4DE",
                    color: novo.tipo === v ? C.light : C.muted, transition: "all .2s",
                  }}>{l}</button>
                ))}
              </div>
              <input placeholder="Valor (R$)" type="number" value={novo.valor} onChange={e => setNovo({ ...novo, valor: e.target.value })} />
              <input placeholder="Descrição (ex: venda de sábado)" value={novo.desc} onChange={e => setNovo({ ...novo, desc: e.target.value })} />
              {novo.tipo === "RECEITA" && (
                <div style={{ display: "flex", gap: 8 }}>
                  {["PIX", "Cartão", "Dinheiro"].map(f => (
                    <button key={f} onClick={() => setNovo({ ...novo, forma: f })} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Inter",
                      background: novo.forma === f ? C.primary : "#E8E4DE",
                      color: novo.forma === f ? C.light : C.muted, transition: "all .2s",
                    }}>{f}</button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <button className="btn-n" style={{ flex: 1, padding: "13px 0" }} onClick={() => setShow(false)}>Cancelar</button>
                <button className="btn-o" style={{ flex: 2, padding: "14px 0" }} onClick={add} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar lançamento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="nc" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: C.muted }}>{lancamentos.length} lançamentos registrados</span>
          <button className="btn-o" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setShow(true)}>+ Adicionar</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                {l.tipo === "RECEITA" ? "💵" : "📤"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{l.data}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red }}>
              {l.tipo === "RECEITA" ? "+" : "-"} R$ {Number(l.valor).toLocaleString("pt-BR")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashDocumentos() {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/documentos").then(setDocs);
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.upload("/upload", file);
      alert(res.mensagem);
      // Refresh docs
      api.get("/documentos").then(setDocs);
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
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>PDF ou imagem · Máx. 5MB por arquivo</div>
          <div className="btn-o" style={{ display: "inline-block" }}>Selecionar arquivo</div>
        </label>
      </div>
      <div className="nc" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Documentos fiscais</h3>
        {docs.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < docs.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{d.tipo}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.mes}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: d.status === "Pago" || d.status === "ok" ? `${C.green}15` : `${C.red}12`, color: d.status === "Pago" || d.status === "ok" ? C.green : C.red }}>
              {d.status === "Pago" || d.status === "ok" ? "✓ Anexado" : "⚠ Pendente"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashNotificacoes() {
  const ns = [
    { tipo: "info", icon: "💬", titulo: "Projeção atualizada", msg: "Mantendo seu ritmo, você vai fechar março com R$ 5.840.", hora: "Agora mesmo", lida: false },
    { tipo: "success", icon: "✅", titulo: "Você está crescendo! 🎉", msg: "Este mês está 18% acima do mês anterior. Continue assim!", hora: "2h atrás", lida: false },
    { tipo: "warning", icon: "⚠️", titulo: "DAS de março pendente", msg: "Lembre-se de pagar o DAS de março. Vencimento: dia 20.", hora: "1 dia atrás", lida: true },
    { tipo: "info", icon: "💬", titulo: "Boas-vindas ao EASE!", msg: "Conta criada com sucesso. Comece lançando sua primeira receita.", hora: "3 dias atrás", lida: true },
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

// ─── FOOTER ────────────────────────────────────────────────────────
function Footer({ setPage }) {
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
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.light, marginBottom: 18, textTransform: "uppercase", letterSpacing: 1.5 }}>{col.title}</div>
              {col.links.map(([label, pg]) => (
                <div key={label} style={{ marginBottom: 11 }}>
                  <span style={{ color: "rgba(253,250,245,0.38)", fontSize: 14, cursor: "pointer", transition: "color .2s" }}
                    onClick={() => setPage(pg)}
                    onMouseEnter={e => e.target.style.color = C.light}
                    onMouseLeave={e => e.target.style.color = "rgba(253,250,245,0.38)"}
                  >{label}</span>
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

// ─── APP ROOT ───────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const isApp = page === "dashboard";
  const isAuth = ["login", "signup"].includes(page);
  const darkHero = page === "home" || page === "features";

  return (
    <>
      <style>{G}</style>
      {!isApp && !isAuth && <Nav page={page} setPage={setPage} darkMode={darkHero} />}
      {(page === "home" || page === "features") && <HomePage setPage={setPage} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "contact" && <ContactPage setPage={setPage} />}
      {page === "terms" && <TermsPage setPage={setPage} />}
      {page === "login" && <LoginPage setPage={setPage} />}
      {page === "signup" && <SignupPage setPage={setPage} />}
      {page === "dashboard" && <DashboardModule setPage={setPage} C={C} api={api} Logo={Logo} />}
    </>
  );
}
