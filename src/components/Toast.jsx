export default function Toast({ toast, onClose }) {
  if (!toast?.message) return null;

  const isError = toast.type === "error";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 999,
        minWidth: 280,
        maxWidth: 420,
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: isError ? "#e05c5c" : "#3db88a",
        color: "#fdfaf5",
        boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>{isError ? "!" : "✓"}</span>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Fechar notificação"
        style={{
          border: "none",
          background: "transparent",
          color: "#fdfaf5",
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
