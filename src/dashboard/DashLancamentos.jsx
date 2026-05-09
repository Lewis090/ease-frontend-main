import { useState } from "react";
import { api } from "../services";
import { C } from "../styles";
import { useViewportFlags } from "../hooks";

export default function DashLancamentos({ lancamentos, setLancamentos, show, setShow, user, onToast }) {
  const { isMobile } = useViewportFlags();
  const [novo, setNovo] = useState({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0] });
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
      };
      const res = await api.post(`/transacoes?userId=${user.id}`, payload);
      if (res.id) {
        setLancamentos([res, ...lancamentos]);
        setShow(false);
        setNovo({ tipo: "RECEITA", valor: "", desc: "", data: new Date().toISOString().split("T")[0] });
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
    if (!id) {
      setLancamentos(lancamentos.filter((l) => l.id !== item.id));
      onToast?.("Lançamento removido.", "success");
      return;
    }

    const previous = lancamentos;
    setDeletingId(id);
    setLancamentos(lancamentos.filter((l) => l.id !== id));

    try {
      const endpoints = [
        `/transacoes/${id}?userId=${user.id}`,
        `/transacoes/${id}`,
        `/transacoes?userId=${user.id}&transacaoId=${id}`,
      ];

      let deleted = false;
      for (const endpoint of endpoints) {
        try {
          await api.delete(endpoint);
          deleted = true;
          break;
        } catch {
          // Tenta o próximo endpoint conhecido para manter compatibilidade.
        }
      }

      if (!deleted) {
        throw new Error("Não foi possível remover no servidor");
      }

      onToast?.("Lançamento removido com sucesso.", "success");
    } catch {
      setLancamentos(previous);
      onToast?.("Erro ao remover lançamento.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {show && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(20,28,38,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 12 : 20 }}>
          <div className="nc" style={{ width: "min(430px, 100%)", maxHeight: "calc(100vh - 24px)", overflowY: "auto", padding: isMobile ? 22 : 38 }}>
            <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: C.navy, marginBottom: 24 }}>+ Novo lançamento</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
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
                      fontFamily: "Inter",
                      background: novo.tipo === v ? (v === "RECEITA" ? C.green : C.red) : "#E8E4DE",
                      color: novo.tipo === v ? C.light : C.muted,
                      transition: "all .2s",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <input placeholder="Valor (R$)" type="number" value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: e.target.value })} />
              <input placeholder="Descrição (ex: venda de sábado)" value={novo.desc} onChange={(e) => setNovo({ ...novo, desc: e.target.value })} />
              {novo.tipo === "RECEITA" && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 8 }}>
                  {["PIX", "Cartão", "Dinheiro"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setNovo({ ...novo, forma: f })}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "none",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Inter",
                        background: novo.forma === f ? C.primary : "#E8E4DE",
                        color: novo.forma === f ? C.light : C.muted,
                        transition: "all .2s",
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr", gap: 12, marginTop: 6 }}>
                <button className="btn-n" style={{ flex: 1, padding: "13px 0" }} onClick={() => setShow(false)}>Cancelar</button>
                <button className="btn-o" style={{ flex: 2, padding: "14px 0" }} onClick={add} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar lançamento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="nc" style={{ padding: isMobile ? 16 : 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: C.muted }}>{lancamentos.length} lançamentos registrados</span>
          <button className="btn-o" style={{ padding: "10px 20px", fontSize: 13 }} onClick={() => setShow(true)}>+ Adicionar</button>
        </div>
        {lancamentos.map((l, i) => (
          <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 0, padding: "14px 0", borderBottom: i < lancamentos.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                {l.tipo === "RECEITA" ? "💵" : "📤"}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{l.data}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: isMobile ? "100%" : "auto", paddingLeft: isMobile ? 54 : 0, gap: 12 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: l.tipo === "RECEITA" ? C.green : C.red }}>
                {l.tipo === "RECEITA" ? "+" : "-"} R$ {Number(l.valor).toLocaleString("pt-BR")}
              </div>
              <button
                className="btn-g"
                style={{ color: C.red, padding: "6px 10px", fontSize: 12, fontWeight: 700 }}
                disabled={deletingId === l.id}
                onClick={() => remove(l)}
              >
                {deletingId === l.id ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
