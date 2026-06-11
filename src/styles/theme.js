export const C = {
  bg: "#EDEAE4",
  bgL: "#F5F2EC",
  primary: "#EC8A3F",
  navy: "#2D3A49",
  text: "#2D3A49",
  muted: "#8A98A5",
  light: "#FDFAF5",
  green: "#3DB88A",
  red: "#E05C5C",
  yellow: "#F5C518",
  sdark: "rgba(45,58,73,0.16)",
  slight: "rgba(255,255,255,0.85)",
};

export const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
body{font-family:'Inter',sans-serif;background:${C.bg};color:${C.text};overflow-x:hidden;}
.nf{background:${C.bg};box-shadow:7px 7px 16px ${C.sdark},-7px -7px 16px ${C.slight};border-radius:18px;}
.nc{background:${C.bgL};box-shadow:9px 9px 22px ${C.sdark},-9px -9px 22px ${C.slight};border-radius:22px;}
.np{box-shadow:inset 4px 4px 10px ${C.sdark},inset -4px -4px 10px ${C.slight};border-radius:14px;}
.btn-o{background:linear-gradient(135deg,${C.primary},#d96e2a);color:${C.light};border:none;border-radius:14px;padding:15px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:4px 4px 14px rgba(236,138,63,0.38),-2px -2px 8px rgba(255,255,255,0.5);transition:all .2s;}
.btn-o:hover{transform:translateY(-2px);}
.btn-n{background:${C.bg};color:${C.navy};border:none;border-radius:14px;padding:15px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:5px 5px 14px ${C.sdark},-5px -5px 14px ${C.slight};transition:all .2s;}
.btn-n:hover{transform:translateY(-2px);}
.btn-g{background:transparent;color:${C.navy};border:none;padding:10px 18px;font-size:14px;font-weight:500;cursor:pointer;border-radius:10px;transition:all .2s;font-family:'Inter',sans-serif;}
.btn-g:hover{background:rgba(45,58,73,0.07);}
.btn-g.act{color:${C.primary};font-weight:700;}
.btn-inv{background:rgba(255,255,255,0.1);color:${C.light};border:2px solid rgba(255,255,255,0.2);border-radius:14px;padding:14px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;transition:all .2s;}
.btn-inv:hover{background:rgba(255,255,255,0.18);}
input,textarea,select{background:${C.bg};border:none;border-radius:12px;padding:14px 18px;font-size:14px;color:${C.text};font-family:'Inter',sans-serif;width:100%;box-shadow:inset 3px 3px 8px ${C.sdark},inset -3px -3px 8px ${C.slight};outline:none;transition:all .2s;}
input::placeholder,textarea::placeholder{color:${C.muted};}
input:focus,textarea:focus,select:focus{box-shadow:inset 4px 4px 10px ${C.sdark},inset -4px -4px 10px ${C.slight},0 0 0 2px rgba(236,138,63,0.3);}
.tag{display:inline-block;background:rgba(236,138,63,0.13);color:${C.primary};border-radius:20px;padding:6px 16px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:18px;}
.tag-inv{display:inline-block;background:rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);border-radius:20px;padding:6px 16px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:18px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
.fu{animation:fadeUp .55s ease both;}
section{scroll-margin-top:76px;}
.dash-top-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(320px,1fr);gap:20px;margin-bottom:20px;}
.dash-stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin-bottom:22px;}
.dash-body-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,1fr);gap:20px;margin-bottom:20px;}
.dash-quick-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;}
.dash-doc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;}
@media (max-width:1100px){.dash-top-grid,.dash-body-grid{grid-template-columns:1fr;}}
@media (max-width:720px){.dash-stats-grid,.dash-quick-grid,.dash-doc-grid{grid-template-columns:1fr;}}
@media (max-width:720px){.btn-o,.btn-n,.btn-inv{padding:13px 18px;font-size:14px;}input,textarea,select{padding:13px 14px;font-size:14px;}}

/* ── Print / PDF export ── */
@media print {
  .no-print, aside, nav, header, footer, .btn-o, .btn-n, .btn-inv, .btn-g { display: none !important; }
  body { background: #fff !important; color: #1a2535 !important; font-family: 'Inter', sans-serif; }
  main { padding: 0 !important; }
  #relatorio-print-area { display: block !important; }
  .print-header { display: flex; align-items: center; gap: 20px; padding-bottom: 18px; border-bottom: 2px solid #2D3A49; margin-bottom: 22px; }
  .print-logo { font-size: 28px; font-weight: 900; color: #EC8A3F; letter-spacing: -1px; }
  .print-title { font-size: 17px; font-weight: 800; color: #2D3A49; }
  .print-sub { font-size: 12px; color: #8A98A5; margin-top: 3px; }
  .print-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 22px; }
  .print-card { padding: 16px 18px; border-radius: 10px; border: 1px solid #e0ddd8; }
  .print-card.green { border-left: 4px solid #3DB88A; }
  .print-card.red { border-left: 4px solid #E05C5C; }
  .print-card.navy { border-left: 4px solid #2D3A49; }
  .print-card-label { font-size: 10px; color: #8A98A5; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 5px; }
  .print-card-value { font-size: 20px; font-weight: 900; color: #2D3A49; }
  .print-card.green .print-card-value { color: #3DB88A; }
  .print-card.red .print-card-value { color: #E05C5C; }
  .print-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 18px; }
  .print-table th { background: #f5f2ec; color: #2D3A49; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.7px; padding: 9px 12px; text-align: left; border-bottom: 2px solid #e0ddd8; }
  .print-table td { padding: 9px 12px; border-bottom: 1px solid #edeae4; color: #2D3A49; vertical-align: middle; }
  .print-table tfoot td { font-weight: 800; border-top: 2px solid #2D3A49; border-bottom: none; font-size: 13px; padding-top: 10px; }
  .print-badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-green { background: #3DB88A18; color: #3DB88A; }
  .badge-red { background: #E05C5C18; color: #E05C5C; }
  .val-green { color: #3DB88A; font-weight: 800; }
  .val-red { color: #E05C5C; font-weight: 800; }
  .print-total-row td { background: #f5f2ec; }
  .print-footer { font-size: 10px; color: #8A98A5; text-align: center; border-top: 1px solid #e0ddd8; padding-top: 12px; margin-top: 8px; }
}
`;