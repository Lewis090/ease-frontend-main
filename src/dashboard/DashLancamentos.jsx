import { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "../services";
import { C } from "../styles";
import { useViewportFlags } from "../hooks";

export default function DashLancamentos({ lancamentos, setLancamentos, show, setShow, user, onToast, apenasModal = false }) {
  const { isMobile } = useViewportFlags();
  const [novo, setNovo] = useState({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0], forma: "PIX" });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const add = async () => {
    if (!novo.valor || !novo.desc) return;
    setLoading(true);
    try {
      const payload = {
        descricao: novo.desc,
        tipo: novo.tipo,
        valor: novo.valor,
        data: novo.data,
        ...(novo.tipo === "RECEITA" ? { forma: novo.forma } : {})
      };
      const res = await api.post(`/transacoes?userId=${user.id}`, payload);
      if (res.id) {
        setLancamentos([{ ...res, tipo: novo.tipo }, ...lancamentos]);
        setShow(false);
        setNovo({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0], forma: "PIX" });
        onToast?.("Lançamento salvo com sucesso.", "success");
      }
    } catch {
      onToast?.("Erro ao salvar transação", "error");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (item) => {
    const id = item?.id;
    if (!id) return;
    const previous = lancamentos;
    setDeletingId(id);
    setLancamentos(lancamentos.filter((l) => l.id !== id));
    try {
      await api.delete(`/transacoes/${id}?userId=${user.id}`);
      onToast?.("Lançamento removido com sucesso.", "success");
    } catch {
      setLancamentos(previous);
    } finally {
      setDeletingId(null);
    }
  };

  // Empacotamos o modal em uma constante para desenhá-lo na raiz da página pelo Portal
  const modalUI = show ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(20,28,38,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 20 }}>
      <div className="nc" style={{ width: "min(430px, 100%)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", padding: isMobile ? 22 : 38 }}>
        <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>+ Novo lançamento</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["RECEITA", "💵 Receita"], ["DESPESA_VARIAVEL", "📤 Despesa"]].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setNovo({ ...novo, tipo: v })}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: 12,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: novo.tipo === v ? (v === "RECEITA" ? C.green : C.red) : "#E8E4DE",
                  color: novo.tipo === v ? C.light : C.muted,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <input placeholder="Valor (R$)" type="number" value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: e.target.value })} />
          <input placeholder="Descrição" value={novo.desc} onChange={(e) => setNovo({ ...novo, desc: e.target.value })} />
          <input type="date" value={novo.data} onChange={(e) => setNovo({ ...novo, data: e.target.value })} />
          
          {novo.tipo === "RECEITA" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {["PIX", "Cartão", "Dinheiro"].map((f) => (
                <button
                  key={f}
                  onClick={() => setNovo({ ...novo, forma: f })}
                  style={{
                    padding: "10px 0",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: novo.forma === f ? C.primary : "#E8E4DE",
                    color: novo.forma === f ? C.light : C.muted,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginTop: 6 }}>
            <button className="btn-n" style={{ padding: "13px 0" }} onClick={() => setShow(false)}>Cancelar</button>
            <button className="btn-o" style={{ padding: "14px 0" }} onClick={add} disabled={loading}>
              {loading ? "Salvando..." : "Salvar lançamento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div>
      {/* Garante que o Portal rode em ambientes onde o document está pronto */}
      {modalUI && typeof document !== "undefined" ? createPortal(modalUI, document.body) : modalUI}

      {!apenasModal && (
        <div className="nc" style={{ padding: isMobile ? 16 : 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: C.muted }}>{lancamentos.length} lançamentos registrados</span>
          </div>
          {lancamentos.map((l, i) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", padding: "14px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {l.tipo === "RECEITA" ? "💵" : "📤"}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{l.data}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, width: isMobile ? "100%" : "auto", justifyContent: "space-between", marginTop: isMobile ? 8 : 0 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red }}>
                  {l.tipo === "RECEITA" ? "+" : "-"} R$ {Number(l.valor).toLocaleString("pt-BR")}
                </div>
                <button className="btn-g" disabled={deletingId === l.id} onClick={() => remove(l)}>
                  {deletingId === l.id ? "Removendo..." : "Remover"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}