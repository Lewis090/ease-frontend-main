import { useViewportFlags } from "../hooks";
import { C } from "../styles";

export default function TermsPage({ setPage }) {
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
            corpo: "O EASE utiliza apenas cookies técnicos essenciais ao funcionamento da plataforma (ex: manutenção de sessão autenticada). Não utilizamos cookies de rastreamento, publicidade comportamental ou analytics de terceiros.",
          },
          {
            titulo: "8. Menores de Idade",
            corpo: "O EASE é destinado exclusivamente a pessoas maiores de 18 anos formalizadas como Microempreendedoras Individuais. Não coletamos intencionalmente dados de menores. Caso identificada coleta não intencional, os dados serão excluídos imediatamente.",
          },
          {
            titulo: "9. Alterações nesta Política",
            corpo: "Esta política pode ser atualizada para refletir mudanças legais, regulatórias ou no serviço. Alterações relevantes serão comunicadas a todos os usuários cadastrados por e-mail e notificação dentro da plataforma, com antecedência mínima de 30 dias. A continuidade de uso após a comunicação implica aceite das novas condições.",
          },
          {
            titulo: "10. Foro e Legislação Aplicável",
            corpo: "Esta política é regida pelas leis brasileiras, em especial pela Lei nº 13.709/2018 (LGPD) e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990). Fica eleito o foro da Comarca de Recife/PE para dirimir quaisquer controvérsias.",
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
