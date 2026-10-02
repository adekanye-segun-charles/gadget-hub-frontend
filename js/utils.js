const ROOT = document.body?.dataset.root || "";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (v) => "₦" + Number(v || 0).toLocaleString("en-NG", { maximumFractionDigits: 2 });
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "-");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const params = () => Object.fromEntries(new URLSearchParams(location.search));
// Backends wrap lists differently; find the array whichever way it comes.
const listOf = (res, key) => { const d = res?.data ?? res; return Array.isArray(d) ? d : d?.[key] || d?.items || d?.results || []; };
const FALLBACK_IMG = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f0edfa"/><text x="200" y="210" fill="#8a87a8" font-family="sans-serif" font-size="18" text-anchor="middle">No image</text></svg>');
const imgOf = (p) => { const i = p.images?.[0] ?? p.image ?? p.imageUrl; return (typeof i === "string" ? i : i?.url) || FALLBACK_IMG; };
const debounce = (fn, ms = 350) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
