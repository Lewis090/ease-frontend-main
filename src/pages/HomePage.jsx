import { useState } from "react";
import { AnimatedCard, Footer } from "../components";
import { useViewportFlags } from "../hooks";
import { C } from "../styles";

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

function FAQItemDark({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#1E2A38", borderRadius: 18, marginBottom: 12, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, background: "transparent", border: "none", cursor: "pointer", fontFamily: "Inter", textAlign: "left" }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
        <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: C.light, lineHeight: 1.4 }}>{item.q}</span>
        <span style={{ fontSize: 22, color: C.primary, flexShrink: 0, fontWeight: 300, transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform .3s" }}>+</span>
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
      <input placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1 }} />
      <button className="btn-o" style={{ whiteSpace: "nowrap", width: isMobile ? "100%" : "auto" }} onClick={() => email && setOk(true)}>Quero receber</button>
    </div>
  );
}

export default function HomePage({ setPage }) {
  const { isMobile, isTablet } = useViewportFlags();

  return (
    <div>
      <section style={{ minHeight: isMobile ? "auto" : "100vh", background: `linear-gradient(145deg, ${C.navy} 0%, #1a2535 60%, #0f1a28 100%)`, display: "flex", alignItems: "center", padding: isMobile ? "0 5% 24px" : "0 8%", position: "relative", overflow: "hidden" }}>
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
            ].map((item) => (
              <div key={item.title} style={{ background: "#1E2A38", borderRadius: 20, padding: 32, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.light, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: "rgba(253,250,245,0.42)", lineHeight: 1.7, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <div key={i} style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 64, alignItems: "center", marginBottom: 80, direction: f.inv ? "rtl" : "ltr" }}>
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
                    <p style={{ fontSize: 15, fontWeight: 700, color: f.cor, lineHeight: 1.5 }}>
                      "{f.msg}"
                    </p>
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
