import { useMemo, useState, useRef, useCallback } from "react";
import { api } from "../services";
import { C } from "../styles";
import { useViewportFlags } from "../hooks";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

// Formata Date → "YYYY-MM-DD" em fuso local
function toLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Agrupa lançamentos por data (chave "YYYY-MM-DD")
function agruparPorData(lancamentos) {
  const mapa = {};
  for (const l of lancamentos) {
    const chave = (l.data || "").split("T")[0];
    if (!chave) continue;
    if (!mapa[chave]) mapa[chave] = [];
    mapa[chave].push(l);
  }
  return mapa;
}

// Gera todas as células do calendário (inclui dias de meses adjacentes para completar semanas)
function gerarCelulas(ano, mes) {
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const celulas = [];

  // Preenche dias anteriores
  for (let i = 0; i < primeiroDia.getDay(); i++) {
    const d = new Date(ano, mes, 1 - (primeiroDia.getDay() - i));
    celulas.push({ date: d, currentMonth: false });
  }

  // Dias do mês atual
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    celulas.push({ date: new Date(ano, mes, d), currentMonth: true });
  }

  // Preenche dias posteriores para completar a última semana
  const restante = (7 - (celulas.length % 7)) % 7;
  for (let i = 1; i <= restante; i++) {
    celulas.push({ date: new Date(ano, mes + 1, i), currentMonth: false });
  }

  return celulas;
}

// ── Card de lançamento dentro de cada dia ──
function LancamentoCard({ lancamento, onDragStart, onRemove, deletingId }) {
  const isReceita = lancamento.tipo === "RECEITA";
  const cor = isReceita ? C.green : C.red;
  const bg = isReceita ? `${C.green}18` : `${C.red}18`;

  return (
    <div
      draggable
      onDragStart={(e) => {
        // stopPropagation garante que apenas este card inicia o drag,
        // evitando que o evento borbulhe para cards vizinhos e sobrescreva o dragItemRef
        e.stopPropagation();
        onDragStart(e, lancamento);
      }}
      title={`${lancamento.descricao} — R$ ${Number(lancamento.valor).toLocaleString("pt-BR")}`}
      style={{
        background: bg,
        borderLeft: `3px solid ${cor}`,
        borderRadius: 7,
        padding: "4px 7px",
        marginBottom: 4,
        cursor: "grab",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 4,
        transition: "opacity .15s, transform .15s",
        opacity: deletingId === lancamento.id ? 0.4 : 1,
        userSelect: "none",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 10,
          fontWeight: 700,
          color: cor,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 100,
        }}>
          {isReceita ? "+" : "-"} R$ {Number(lancamento.valor).toLocaleString("pt-BR")}
        </div>
        <div style={{
          fontSize: 9,
          color: C.muted,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 100,
        }}>
          {lancamento.descricao}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(lancamento); }}
        disabled={deletingId === lancamento.id}
        title="Remover lançamento"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: C.muted,
          fontSize: 11,
          padding: "1px 3px",
          borderRadius: 4,
          lineHeight: 1,
          flexShrink: 0,
          transition: "color .15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = C.red)}
        onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
      >
        ×
      </button>
    </div>
  );
}

// ── Célula de um dia no calendário ──
function DiaCell({ celula, lancamentosDia, dragOverDate, onDragStart, onDragOver, onDragLeave, onDrop, onRemove, deletingId, hoje }) {
  const chave = toLocalISO(celula.date);
  const isHoje = chave === hoje;
  const isDragOver = dragOverDate === chave;
  const isCurrentMonth = celula.currentMonth;

  const totalReceita = lancamentosDia.filter(l => l.tipo === "RECEITA").reduce((s, l) => s + Number(l.valor), 0);
  const totalDespesa = lancamentosDia.filter(l => l.tipo !== "RECEITA").reduce((s, l) => s + Number(l.valor), 0);

  return (
    <div
      onDragOver={(e) => onDragOver(e, chave)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, chave)}
      style={{
        minHeight: 100,
        borderRadius: 12,
        padding: "8px 8px 6px",
        background: isDragOver
          ? `${C.primary}12`
          : isHoje
          ? `${C.primary}0A`
          : isCurrentMonth
          ? C.bgL
          : `${C.bg}88`,
        border: isDragOver
          ? `2px dashed ${C.primary}`
          : isHoje
          ? `2px solid ${C.primary}55`
          : "2px solid transparent",
        boxShadow: isCurrentMonth
          ? `4px 4px 12px ${C.sdark}, -4px -4px 12px rgba(255,255,255,0.7)`
          : "none",
        opacity: isCurrentMonth ? 1 : 0.45,
        transition: "all .15s",
        position: "relative",
        cursor: "default",
      }}
    >
      {/* Número do dia */}
      <div style={{
        fontSize: 12,
        fontWeight: isHoje ? 900 : 600,
        color: isHoje ? C.primary : isCurrentMonth ? C.navy : C.muted,
        marginBottom: 5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isHoje ? C.primary : "transparent",
          color: isHoje ? C.light : "inherit",
          fontSize: isHoje ? 11 : 12,
        }}>
          {celula.date.getDate()}
        </span>
        {/* Mini totais */}
        {lancamentosDia.length > 0 && (
          <div style={{ display: "flex", gap: 3, fontSize: 8, fontWeight: 700 }}>
            {totalReceita > 0 && <span style={{ color: C.green }}>+{totalReceita.toLocaleString("pt-BR", { notation: "compact" })}</span>}
            {totalDespesa > 0 && <span style={{ color: C.red }}>-{totalDespesa.toLocaleString("pt-BR", { notation: "compact" })}</span>}
          </div>
        )}
      </div>

      {/* Cards dos lançamentos */}
      <div>
        {lancamentosDia.slice(0, 3).map((l) => (
          <LancamentoCard
            key={l.id}
            lancamento={l}
            onDragStart={onDragStart}
            onRemove={onRemove}
            deletingId={deletingId}
          />
        ))}
        {lancamentosDia.length > 3 && (
          <div style={{ fontSize: 9, color: C.muted, fontWeight: 700, paddingLeft: 4 }}>
            +{lancamentosDia.length - 3} mais
          </div>
        )}
      </div>

      {/* Indicador visual de drop */}
      {isDragOver && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}>
          <span style={{ fontSize: 20, opacity: 0.4 }}>📌</span>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──
export default function DashCalendario({ lancamentos, setLancamentos, user, onToast }) {
  const { isMobile } = useViewportFlags();
  const hoje = toLocalISO(new Date());
  const now = new Date();

  const [mes, setMes] = useState(now.getMonth());
  const [ano, setAno] = useState(now.getFullYear());
  const [dragOverDate, setDragOverDate] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const dragItemRef = useRef(null);

  // Agrupa lançamentos por data
  const lancamentosPorData = useMemo(() => agruparPorData(lancamentos), [lancamentos]);

  // Células do calendário (grid completo)
  const celulas = useMemo(() => gerarCelulas(ano, mes), [ano, mes]);

  // Navegação de mês
  const irMesAnterior = () => {
    if (mes === 0) { setMes(11); setAno(a => a - 1); }
    else setMes(m => m - 1);
  };
  const irProximoMes = () => {
    if (mes === 11) { setMes(0); setAno(a => a + 1); }
    else setMes(m => m + 1);
  };
  const irHoje = () => { setMes(now.getMonth()); setAno(now.getFullYear()); };

  // ── Drag handlers ──
  const handleDragStart = useCallback((e, lancamento) => {
    dragItemRef.current = lancamento;
    e.dataTransfer.effectAllowed = "move";
    // Armazena o ID como string no dataTransfer — usado como fonte de verdade no drop
    // para garantir que o item correto seja identificado mesmo com múltiplos cards no mesmo dia
    e.dataTransfer.setData("text/plain", String(lancamento.id));
    // Feedback visual
    e.currentTarget.style.opacity = "0.5";
    const el = e.currentTarget;
    requestAnimationFrame(() => { if (el) el.style.opacity = "1"; });
  }, []);

  const handleDragOver = useCallback((e, dataAlvo) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(dataAlvo);
  }, []);

  const handleDragLeave = useCallback((e) => {
    // Só limpa se realmente saiu da célula (não de filhos)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDate(null);
    }
  }, []);

  const handleDrop = useCallback(async (e, dataAlvo) => {
    e.preventDefault();
    setDragOverDate(null);

    // Resolve o item pelo ID gravado no dataTransfer (fonte de verdade)
    // Isso evita o bug de mover o item errado quando há múltiplos cards no mesmo dia,
    // pois o dragItemRef pode ser sobrescrito por eventos que borbulham entre cards
    const idTransfer = e.dataTransfer.getData("text/plain");
    const item = idTransfer
      ? lancamentos.find(l => String(l.id) === idTransfer) ?? dragItemRef.current
      : dragItemRef.current;

    if (!item) return;

    const dataOrigem = (item.data || "").split("T")[0];
    if (dataOrigem === dataAlvo) return; // mesma data, nada a fazer

    // Atualização otimista
    const anterior = lancamentos;
    setLancamentos(prev =>
      prev.map(l => l.id === item.id ? { ...l, data: dataAlvo } : l)
    );

    try {
      // Tenta diferentes endpoints (mesmo padrão do DashLancamentos)
      const payload = { ...item, data: dataAlvo };
      const endpoints = [
        `/transacoes/${item.id}?userId=${user.id}`,
        `/transacoes/${item.id}`,
      ];

      let ok = false;
      for (const ep of endpoints) {
        try {
          await api.put(ep, payload);
          ok = true;
          break;
        } catch {
          // tenta próximo
        }
      }

      // Se nenhum endpoint funcionou, tenta PATCH
      if (!ok) {
        for (const ep of endpoints) {
          try {
            await api.patch(ep, { data: dataAlvo });
            ok = true;
            break;
          } catch {
            // tenta próximo
          }
        }
      }

      if (!ok) throw new Error("Não foi possível atualizar no servidor");

      onToast?.(`Lançamento movido para ${new Date(dataAlvo + "T12:00:00").toLocaleDateString("pt-BR")}.`, "success");
    } catch {
      // Reverte estado
      setLancamentos(anterior);
      onToast?.("Erro ao mover lançamento. Tente novamente.", "error");
    } finally {
      dragItemRef.current = null;
    }
  }, [lancamentos, setLancamentos, user, onToast]);

  // Remover lançamento
  const handleRemove = useCallback(async (item) => {
    const id = item?.id;
    if (!id) return;

    const anterior = lancamentos;
    setDeletingId(id);
    setLancamentos(prev => prev.filter(l => l.id !== id));

    try {
      const endpoints = [
        `/transacoes/${id}?userId=${user.id}`,
        `/transacoes/${id}`,
        `/transacoes?userId=${user.id}&transacaoId=${id}`,
      ];

      let deleted = false;
      for (const ep of endpoints) {
        try {
          await api.delete(ep);
          deleted = true;
          break;
        } catch {
          // tenta próximo
        }
      }

      if (!deleted) throw new Error("Falha ao remover no servidor");
      onToast?.("Lançamento removido com sucesso.", "success");
    } catch {
      setLancamentos(anterior);
      onToast?.("Erro ao remover lançamento.", "error");
    } finally {
      setDeletingId(null);
    }
  }, [lancamentos, setLancamentos, user, onToast]);

  // ── Totais do mês ──
  const lancamentosDoMes = useMemo(() => {
    return lancamentos.filter(l => {
      const d = (l.data || "").split("T")[0];
      const [y, m] = d.split("-").map(Number);
      return y === ano && (m - 1) === mes;
    });
  }, [lancamentos, ano, mes]);

  const totalReceitaMes = lancamentosDoMes.filter(l => l.tipo === "RECEITA").reduce((s, l) => s + Number(l.valor), 0);
  const totalDespesaMes = lancamentosDoMes.filter(l => l.tipo !== "RECEITA").reduce((s, l) => s + Number(l.valor), 0);
  const saldoMes = totalReceitaMes - totalDespesaMes;

  // ── Vista mobile: lista por dia ──
  if (isMobile) {
    const diasComLancamentos = Object.entries(lancamentosPorData)
      .filter(([chave]) => {
        const [y, m] = chave.split("-").map(Number);
        return y === ano && (m - 1) === mes;
      })
      .sort(([a], [b]) => a.localeCompare(b));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <CalendarioHeader
          mes={mes} ano={ano}
          irMesAnterior={irMesAnterior} irProximoMes={irProximoMes} irHoje={irHoje}
          totalReceitaMes={totalReceitaMes} totalDespesaMes={totalDespesaMes} saldoMes={saldoMes}
          isMobile
        />
        {diasComLancamentos.length === 0 ? (
          <div className="nc" style={{ padding: 32, textAlign: "center", color: C.muted, fontSize: 13 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            Nenhum lançamento em {MESES[mes]} {ano}
          </div>
        ) : (
          diasComLancamentos.map(([chave, items]) => (
            <div key={chave} className="nc" style={{ padding: "14px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.navy, marginBottom: 10 }}>
                {new Date(chave + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
              {items.map(l => (
                <LancamentoCard
                  key={l.id} lancamento={l}
                  onDragStart={handleDragStart}
                  onRemove={handleRemove}
                  deletingId={deletingId}
                />
              ))}
            </div>
          ))
        )}
      </div>
    );
  }

  // ── Vista desktop: grid calendário ──
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <CalendarioHeader
        mes={mes} ano={ano}
        irMesAnterior={irMesAnterior} irProximoMes={irProximoMes} irHoje={irHoje}
        totalReceitaMes={totalReceitaMes} totalDespesaMes={totalDespesaMes} saldoMes={saldoMes}
      />

      {/* Grid */}
      <div className="nc" style={{ padding: 20 }}>
        {/* Cabeçalho dos dias da semana */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
          {DIAS_SEMANA.map(d => (
            <div key={d} style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 700,
              color: C.muted,
              padding: "4px 0",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Células dos dias */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {celulas.map((celula, i) => {
            const chave = toLocalISO(celula.date);
            return (
              <DiaCell
                key={i}
                celula={celula}
                lancamentosDia={lancamentosPorData[chave] || []}
                dragOverDate={dragOverDate}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onRemove={handleRemove}
                deletingId={deletingId}
                hoje={hoje}
              />
            );
          })}
        </div>

        {/* Legenda */}
        <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.sdark}`, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Legenda:</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.green}25`, borderLeft: `3px solid ${C.green}` }} />
            <span style={{ fontSize: 11, color: C.muted }}>Receita</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: `${C.red}25`, borderLeft: `3px solid ${C.red}` }} />
            <span style={{ fontSize: 11, color: C.muted }}>Despesa</span>
          </div>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>
            💡 Arraste um lançamento para outro dia para alterar a data
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componente: Header do calendário ──
function CalendarioHeader({ mes, ano, irMesAnterior, irProximoMes, irHoje, totalReceitaMes, totalDespesaMes, saldoMes, isMobile }) {
  const saldoPositivo = saldoMes >= 0;

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16, alignItems: isMobile ? "stretch" : "center", flexWrap: "wrap" }}>
      {/* Navegação do mês */}
      <div className="nc" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", flex: isMobile ? "none" : "0 0 auto" }}>
        <button
          onClick={irMesAnterior}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: C.navy, padding: "4px 8px", borderRadius: 8,
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${C.sdark}`}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          title="Mês anterior"
        >
          ◀
        </button>
        <div style={{ textAlign: "center", minWidth: 140 }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: C.navy }}>
            {MESES[mes]}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{ano}</div>
        </div>
        <button
          onClick={irProximoMes}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: C.navy, padding: "4px 8px", borderRadius: 8,
            transition: "background .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = `${C.sdark}`}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
          title="Próximo mês"
        >
          ▶
        </button>
        <button
          onClick={irHoje}
          style={{
            background: C.bg,
            border: "none",
            borderRadius: 8,
            padding: "5px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: C.primary,
            cursor: "pointer",
            fontFamily: "Inter",
            boxShadow: `2px 2px 6px ${C.sdark}, -2px -2px 6px rgba(255,255,255,0.8)`,
            transition: "all .15s",
          }}
        >
          Hoje
        </button>
      </div>

      {/* Cards de totais do mês */}
      <div style={{ display: "flex", gap: 12, flex: 1, flexWrap: "wrap" }}>
        <TotalCard label="Receitas" valor={totalReceitaMes} cor={C.green} emoji="💵" />
        <TotalCard label="Despesas" valor={totalDespesaMes} cor={C.red} emoji="📤" />
        <TotalCard
          label="Saldo do Mês"
          valor={saldoMes}
          cor={saldoPositivo ? C.green : C.red}
          emoji={saldoPositivo ? "✅" : "⚠️"}
          destaque
        />
      </div>
    </div>
  );
}

function TotalCard({ label, valor, cor, emoji, destaque }) {
  return (
    <div className="nc" style={{
      flex: 1,
      minWidth: 120,
      padding: "12px 16px",
      borderLeft: `3px solid ${cor}`,
      background: destaque ? `${cor}08` : undefined,
    }}>
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 4 }}>
        {emoji} {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 900, color: cor }}>
        R$ {Math.abs(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
}
