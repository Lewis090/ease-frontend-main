import { useState, useMemo } from "react";
import { api } from "../services";
import { C } from "../styles";
import { useViewportFlags } from "../hooks";

const fmt = (n) => `R$ ${Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const today = () => new Date().toISOString().split("T")[0];
const firstOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

export default function DashRelatorio({ user, onToast }) {
  const { isMobile } = useViewportFlags();
  const [dataInicio, setDataInicio] = useState(firstOfMonth());
  const [dataFim, setDataFim] = useState(today());
  const [lancamentos, setLancamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gerado, setGerado] = useState(false);

  const gerar = async () => {
    if (!dataInicio || !dataFim) {
      onToast?.("Selecione o período completo.", "error");
      return;
    }
    if (dataInicio > dataFim) {
      onToast?.("A data inicial não pode ser maior que a data final.", "error");
      return;
    }
    setLoading(true);
    setGerado(false);
    try {
      const res = await api.get(`/transacoes?userId=${user.id}`);
      const filtered = (Array.isArray(res) ? res : []).filter((l) => {
        const d = l.data?.split("T")[0] ?? l.data ?? "";
        return d >= dataInicio && d <= dataFim;
      });
      filtered.sort((a, b) => (a.data > b.data ? 1 : -1));
      setLancamentos(filtered);
      setGerado(true);
    } catch {
      onToast?.("Erro ao buscar lançamentos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const { receitas, despesas, saldo } = useMemo(() => {
    const receitas = lancamentos
      .filter((l) => l.tipo === "RECEITA")
      .reduce((acc, l) => acc + Number(l.valor), 0);
    const despesas = lancamentos
      .filter((l) => l.tipo !== "RECEITA")
      .reduce((acc, l) => acc + Number(l.valor), 0);
    return { receitas, despesas, saldo: receitas - despesas };
  }, [lancamentos]);

  const exportarPDF = () => {
    window.print();
  };

  const fmtDate = (iso) => {
    if (!iso) return "-";
    const [y, m, d] = (iso.split("T")[0] ?? iso).split("-");
    return `${d}/${m}/${y}`;
  };

  const labelPeriodo = `${fmtDate(dataInicio)} a ${fmtDate(dataFim)}`;

  return (
    <>
      {/* ── Área visível apenas na impressão ── */}
      <div id="relatorio-print-area" style={{ display: "none" }}>
        <div className="print-header">
          <div className="print-logo">ease</div>
          <div>
            <div className="print-title">Relatório Financeiro — {user.nome}</div>
            <div className="print-sub">Período: {labelPeriodo}</div>
          </div>
        </div>

        <div className="print-cards">
          <div className="print-card green">
            <div className="print-card-label">Total de Receitas</div>
            <div className="print-card-value">{fmt(receitas)}</div>
          </div>
          <div className="print-card red">
            <div className="print-card-label">Total de Despesas</div>
            <div className="print-card-value">{fmt(despesas)}</div>
          </div>
          <div className={`print-card ${saldo >= 0 ? "navy" : "red"}`}>
            <div className="print-card-label">Saldo do Período</div>
            <div className="print-card-value">{fmt(saldo)}</div>
          </div>
        </div>

        <table className="print-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l, i) => (
              <tr key={l.id ?? i}>
                <td>
                  <span className={`print-badge ${l.tipo === "RECEITA" ? "badge-green" : "badge-red"}`}>
                    {l.tipo === "RECEITA" ? "Receita" : "Despesa"}
                  </span>
                </td>
                <td>{l.descricao}</td>
                <td>{fmtDate(l.data)}</td>
                <td className={l.tipo === "RECEITA" ? "val-green" : "val-red"}>
                  {l.tipo === "RECEITA" ? "+" : "-"} {fmt(l.valor)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="print-total-row">
              <td colSpan={3}>Saldo do período</td>
              <td className={saldo >= 0 ? "val-green" : "val-red"}>{fmt(saldo)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="print-footer">
          Gerado em {new Date().toLocaleString("pt-BR")} · ease — Gestão para MEI
        </div>
      </div>

      {/* ── Interface do dashboard ── */}
      <div className="no-print">
        {/* Filtros */}
        <div className="nc" style={{ padding: isMobile ? 18 : 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 18 }}>
            📅 Selecione o Período
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto",
              gap: 14,
              alignItems: "end",
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                Data Inicial
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => { setDataInicio(e.target.value); setGerado(false); }}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 6, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                Data Final
              </label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => { setDataFim(e.target.value); setGerado(false); }}
                style={{ width: "100%" }}
              />
            </div>
            <button
              className="btn-o"
              onClick={gerar}
              disabled={loading}
              style={{ padding: "14px 28px", whiteSpace: "nowrap" }}
            >
              {loading ? "Buscando..." : "🔍 Gerar Relatório"}
            </button>
          </div>
        </div>

        {/* Resultado */}
        {gerado && (
          <div style={{ animation: "fadeUp .45s ease both" }}>
            {/* Cards de resumo */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: 16,
                marginBottom: 22,
              }}
            >
              {[
                { label: "Total de Receitas", value: fmt(receitas), icon: "💵", color: C.green, bg: `${C.green}12` },
                { label: "Total de Despesas", value: fmt(despesas), icon: "📤", color: C.red, bg: `${C.red}12` },
                {
                  label: "Saldo do Período",
                  value: fmt(saldo),
                  icon: saldo >= 0 ? "💰" : "⚠️",
                  color: saldo >= 0 ? C.navy : C.red,
                  bg: saldo >= 0 ? `${C.navy}08` : `${C.red}12`,
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="nf"
                  style={{ padding: isMobile ? 18 : 24, borderLeft: `4px solid ${card.color}` }}
                >
                  <div style={{ fontSize: 26, marginBottom: 10 }}>{card.icon}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.7px" }}>
                    {card.label}
                  </div>
                  <div style={{ fontSize: isMobile ? 22 : 26, fontWeight: 900, color: card.color }}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Período e botão exportar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>
                  📋 Lançamentos do período
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                  {labelPeriodo} · {lancamentos.length} {lancamentos.length === 1 ? "lançamento" : "lançamentos"}
                </div>
              </div>
              <button
                className="btn-n"
                onClick={exportarPDF}
                style={{ padding: "12px 22px", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}
              >
                <span>📥</span> Exportar PDF
              </button>
            </div>

            {/* Tabela */}
            {lancamentos.length === 0 ? (
              <div
                className="nc"
                style={{
                  padding: isMobile ? 32 : 48,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
                  Nenhum lançamento encontrado
                </div>
                <div style={{ fontSize: 13, color: C.muted }}>
                  Não há receitas nem despesas no período selecionado.
                </div>
              </div>
            ) : (
              <div className="nc" style={{ padding: 0, overflow: "hidden" }}>
                {/* Cabeçalho da tabela */}
                {!isMobile && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "100px 1fr 120px 140px",
                      gap: 0,
                      padding: "12px 24px",
                      background: `${C.navy}06`,
                      borderBottom: `1px solid ${C.navy}10`,
                    }}
                  >
                    {["Tipo", "Descrição", "Data", "Valor"].map((h) => (
                      <div key={h} style={{ fontSize: 10, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                        {h}
                      </div>
                    ))}
                  </div>
                )}

                {/* Linhas */}
                {lancamentos.map((l, i) => (
                  <div
                    key={l.id ?? i}
                    style={{
                      display: isMobile ? "flex" : "grid",
                      gridTemplateColumns: isMobile ? undefined : "100px 1fr 120px 140px",
                      flexDirection: isMobile ? "column" : undefined,
                      gap: isMobile ? 8 : 0,
                      padding: isMobile ? "16px 18px" : "15px 24px",
                      borderBottom: i < lancamentos.length - 1 ? `1px solid ${C.navy}08` : "none",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = `${C.navy}04`)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Tipo */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                          background: l.tipo === "RECEITA" ? `${C.green}18` : `${C.red}18`,
                          color: l.tipo === "RECEITA" ? C.green : C.red,
                        }}
                      >
                        {l.tipo === "RECEITA" ? "Receita" : "Despesa"}
                      </span>
                    </div>

                    {/* Descrição */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: l.tipo === "RECEITA" ? `${C.green}15` : `${C.red}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {l.tipo === "RECEITA" ? "💵" : "📤"}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{l.descricao}</div>
                    </div>

                    {/* Data */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: C.muted }}>{fmtDate(l.data)}</span>
                    </div>

                    {/* Valor */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          color: l.tipo === "RECEITA" ? C.green : C.red,
                        }}
                      >
                        {l.tipo === "RECEITA" ? "+" : "-"} {fmt(l.valor)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Rodapé de totais */}
                <div
                  style={{
                    display: isMobile ? "flex" : "grid",
                    gridTemplateColumns: isMobile ? undefined : "100px 1fr 120px 140px",
                    flexDirection: isMobile ? "row" : undefined,
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: isMobile ? 0 : 0,
                    padding: isMobile ? "16px 18px" : "16px 24px",
                    background: `${C.navy}06`,
                    borderTop: `2px solid ${C.navy}15`,
                  }}
                >
                  {!isMobile && (
                    <>
                      <div />
                      <div style={{ fontSize: 12, fontWeight: 800, color: C.navy, textTransform: "uppercase", letterSpacing: "0.7px" }}>
                        Saldo do período
                      </div>
                      <div />
                    </>
                  )}
                  {isMobile && (
                    <div style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>Saldo do período</div>
                  )}
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 900,
                      color: saldo >= 0 ? C.green : C.red,
                    }}
                  >
                    {saldo >= 0 ? "+" : ""}{fmt(saldo)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estado vazio inicial */}
        {!gerado && !loading && (
          <div
            className="nc"
            style={{ padding: isMobile ? 40 : 60, textAlign: "center", opacity: 0.75 }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>📊</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
              Selecione um período
            </div>
            <div style={{ fontSize: 13, color: C.muted, maxWidth: 360, margin: "0 auto" }}>
              Escolha as datas de início e fim acima e clique em{" "}
              <strong style={{ color: C.primary }}>Gerar Relatório</strong> para visualizar e exportar seus lançamentos.
            </div>
          </div>
        )}
      </div>
    </>
  );
}
