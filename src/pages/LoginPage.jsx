import { useState } from "react";
import { Logo } from "../components";
import { useViewportFlags } from "../hooks";
import { api } from "../services";

function normalizeAuthUser(res) {
  const id =
    res?.id ??
    res?.userId ??
    res?.usuarioId ??
    res?.idUsuario ??
    res?.usuario?.id ??
    1;
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const storedNome = stored?.nome || stored?.name;
  const nome =
    res?.nome ??
    res?.name ??
    res?.usuarioNome ??
    res?.nomeCompleto ??
    res?.fullName ??
    res?.usuario?.nome ??
    res?.usuario?.name ??
    (storedNome && !String(storedNome).includes("@") ? storedNome : undefined) ??
    "Usuário";

  return { id: Number(id) || 1, nome };
}

export default function LoginPage({ setPage, onToast }) {
  const [f, setF] = useState({ email: "", senha: "" });
  const [loading, setLoading] = useState(false);
  useViewportFlags();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", f, { skipAuth: true });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(normalizeAuthUser(res)));
        onToast?.("Login realizado com sucesso.", "success");
        setPage("dashboard");
      } else {
        onToast?.(res.mensagem || "Erro ao entrar", "error");
      }
    } catch (error) {
      onToast?.(error.message || "Erro na conexão com a API", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="nc auth-card">
        <div className="auth-back-row">
          <button className="btn-g auth-back-btn" onClick={() => setPage("home")}>
            ← Voltar ao menu principal
          </button>
        </div>
        <div className="auth-header">
          <Logo size={0.8} />
          <h2 className="auth-title">Entrar na sua conta</h2>
          <p className="auth-subtitle">Bem-vindo de volta! 👋</p>
        </div>
        <div className="auth-form-stack">
          <div>
            <label className="auth-label">E-mail</label>
            <input type="email" placeholder="seu@email.com" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </div>
          <div>
            <label className="auth-label">Senha</label>
            <input type="password" placeholder="••••••••" value={f.senha} onChange={(e) => setF({ ...f, senha: e.target.value })} />
          </div>
          <div className="auth-forgot">
            <span className="auth-forgot-link">Esqueci minha senha</span>
          </div>
          <button className="btn-o auth-primary-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <p className="auth-footer">
          Não tem conta?{" "}
          <span className="auth-footer-link" onClick={() => setPage("signup")}>Criar agora — é grátis</span>
        </p>
      </div>
    </div>
  );
}
