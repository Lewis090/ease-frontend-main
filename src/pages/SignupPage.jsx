import { useState } from "react";
import { Logo } from "../components";
import { useViewportFlags } from "../hooks";
import { api } from "../services";

function normalizeAuthUser(res, typedName) {
  const id =
    res?.id ??
    res?.userId ??
    res?.usuarioId ??
    res?.idUsuario ??
    res?.usuario?.id ??
    1;
  const nome =
    res?.nome ??
    res?.name ??
    res?.usuarioNome ??
    res?.nomeCompleto ??
    res?.fullName ??
    res?.usuario?.nome ??
    res?.usuario?.name ??
    res?.username ??
    typedName ??
    "Usuário";

  return { id: Number(id) || 1, nome };
}

export default function SignupPage({ setPage, onToast }) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ nome: "", email: "", cnpj: "", empresa: "", senha: "" });
  const [aceitou, setAceitou] = useState(false);
  const [erroTermos, setErroTermos] = useState(false);
  const { isMobile } = useViewportFlags();
  const [loading, setLoading] = useState(false);

  const finalizarCadastro = async () => {
    if (!aceitou) {
      setErroTermos(true);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/auth/register",
        {
          nome: f.nome,
          email: f.email,
          senha: f.senha,
        },
        { skipAuth: true },
      );

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(normalizeAuthUser(res, f.nome)));
        onToast?.("Conta criada com sucesso.", "success");
        setPage("dashboard");
      } else {
        onToast?.(res.mensagem || "Erro ao cadastrar", "error");
      }
    } catch (error) {
      onToast?.(error.message || "Erro na conexão com a API", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="nc auth-card signup">
        <div className="auth-back-row">
          <button className="btn-g auth-back-btn" onClick={() => setPage("home")}>
            ← Voltar ao menu principal
          </button>
        </div>
        <div className="auth-header signup">
          <Logo size={0.8} />
          <h2 className="auth-title signup">
            {step === 1 ? "Criar sua conta gratuita" : "Dados do negócio"}
          </h2>
          <div className="auth-steps">
            {[1, 2].map((s) => (
              <div key={s} className={`auth-step-dot${s <= step ? " active" : ""}`} />
            ))}
          </div>
        </div>

        {step === 1 ? (
          <div className="auth-form-stack">
            <div>
              <label className="auth-label">Nome completo</label>
              <input placeholder="Como você se chama?" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
            </div>
            <div>
              <label className="auth-label">E-mail</label>
              <input type="email" placeholder="seu@email.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            </div>
            <div>
              <label className="auth-label">Senha</label>
              <input type="password" placeholder="Mínimo 8 caracteres" value={f.senha} onChange={(e) => setF({ ...f, senha: e.target.value })} />
            </div>
            <button className="btn-o auth-primary-btn" onClick={() => f.nome && f.email && f.senha && setStep(2)}>
              Continuar →
            </button>
          </div>
        ) : (
          <div className="auth-form-stack">
            <div>
              <label className="auth-label">CNPJ do MEI</label>
              <input placeholder="00.000.000/0001-00" value={f.cnpj} onChange={(e) => setF({ ...f, cnpj: e.target.value })} />
            </div>
            <div>
              <label className="auth-label">Nome do negócio</label>
              <input placeholder="Nome fantasia ou razão social" value={f.empresa} onChange={(e) => setF({ ...f, empresa: e.target.value })} />
            </div>

            <div className={`terms-box${erroTermos ? " error" : ""}`}>
              <label className="terms-label">
                <div
                  onClick={() => {
                    setAceitou(!aceitou);
                    setErroTermos(false);
                  }}
                  className={`terms-check${aceitou ? " checked" : ""}`}
                >
                  {aceitou && <span className="terms-check-icon">✓</span>}
                </div>
                <span className="terms-text">
                  Li e concordo com os{" "}
                  <span
                    className="terms-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPage("terms");
                    }}
                  >
                    Termos de Uso e Política de Privacidade
                  </span>
                  {" "}do EASE, incluindo o tratamento de dados conforme a <strong className="terms-strong">LGPD (Lei nº 13.709/2018)</strong>.
                </span>
              </label>
              {erroTermos && (
                <p className="terms-error">
                  ⚠ Você precisa aceitar os termos para criar sua conta.
                </p>
              )}
            </div>

            <div className="auth-actions-row">
              <button className="btn-n auth-btn-secondary" onClick={() => setStep(1)}>← Voltar</button>
              <button className="btn-o auth-btn-primary" onClick={finalizarCadastro} disabled={loading}>
                Criar conta grátis 🚀
              </button>
            </div>
          </div>
        )}

        <p className="auth-footer signup">
          Já tem conta?{" "}
          <span className="auth-footer-link" onClick={() => setPage("login")}>Fazer login</span>
        </p>
      </div>
    </div>
  );
}
