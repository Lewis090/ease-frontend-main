import { useState } from "react";
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

export default function FAQAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="nf" style={{ overflow: "hidden", transition: "all .3s" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              padding: "22px 28px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>{item.q}</span>
            <span
              style={{
                fontSize: 20,
                color: C.primary,
                flexShrink: 0,
                fontWeight: 300,
                transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                transition: "transform .3s",
              }}
            >
              +
            </span>
          </button>
          <div style={{ maxHeight: open === i ? 300 : 0, overflow: "hidden", transition: "max-height .4s ease" }}>
            <p style={{ padding: "0 28px 24px 68px", fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
