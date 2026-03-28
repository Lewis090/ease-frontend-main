import { useEffect, useState } from "react";
import { api } from "../services";
import { C } from "../styles";
import { useViewportFlags } from "../hooks";

export default function DashDocumentos({ onToast }) {
  const { isMobile } = useViewportFlags();
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get("/documentos").then(setDocs).catch(() => onToast?.("Não foi possível carregar os documentos.", "error"));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.upload("/upload", file);
      onToast?.(res.mensagem || "Documento enviado com sucesso.", "success");
      api.get("/documentos").then(setDocs).catch(() => onToast?.("Documento enviado, mas não foi possível atualizar a lista.", "error"));
    } catch {
      onToast?.("Erro no upload", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="nc" style={{ padding: isMobile ? 18 : 28, marginBottom: 20 }}>
        <label style={{ border: `2px dashed ${C.primary}40`, borderRadius: 18, padding: isMobile ? 20 : 36, textAlign: "center", cursor: "pointer", display: "block" }}>
          <input type="file" style={{ display: "none" }} onChange={handleUpload} disabled={uploading} />
          <div style={{ fontSize: 38, marginBottom: 12 }}>📎</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, marginBottom: 6 }}>{uploading ? "Enviando..." : "Anexar DAS ou DASN"}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>PDF ou imagem · Máx. 5MB por arquivo</div>
          <div className="btn-o" style={{ display: "inline-block" }}>Selecionar arquivo</div>
        </label>
      </div>
      <div className="nc" style={{ padding: isMobile ? 16 : 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 20 }}>Documentos fiscais</h3>
        {docs.map((d, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 8 : 0, padding: "14px 0", borderBottom: i < docs.length - 1 ? `1px solid rgba(45,58,73,0.07)` : "none" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${C.primary}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📄</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{d.tipo}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.mes}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 20, background: d.status === "Pago" || d.status === "ok" ? `${C.green}15` : `${C.red}12`, color: d.status === "Pago" || d.status === "ok" ? C.green : C.red, marginLeft: isMobile ? 54 : 0 }}>
              {d.status === "Pago" || d.status === "ok" ? "✓ Anexado" : "⚠ Pendente"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
