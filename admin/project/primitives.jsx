// Reusable visual primitives
const PrimStyles = `
.btn{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:8px;font-size:13.5px;font-weight:600;border:1px solid transparent;cursor:pointer;transition:all .12s ease;white-space:nowrap;letter-spacing:-0.005em}
.btn:focus{outline:2px solid #b9d0ff;outline-offset:1px}
.btn-primary{background:var(--primary);color:#fff;box-shadow:0 1px 0 rgba(11,33,71,.15),0 1px 2px rgba(31,102,229,.25)}
.btn-primary:hover{background:var(--primary-700)}
.btn-ghost{background:#fff;border-color:var(--line);color:var(--ink)}
.btn-ghost:hover{background:#F8FAFD;border-color:#D6DEEB}
.btn-warn{background:#fff;border-color:#F2D49E;color:#9C5E00}
.btn-warn:hover{background:#FCF6E9}
.btn-danger{background:#fff;border-color:#F2C2C7;color:#B22833}
.btn-danger:hover{background:#FCEEEF}
.btn-sm{height:30px;padding:0 10px;font-size:12.5px;border-radius:7px}
.btn-xs{height:26px;padding:0 9px;font-size:11.5px;border-radius:6px;font-weight:600}
.btn-icon{width:36px;padding:0;justify-content:center}

.pill{display:inline-flex;align-items:center;gap:6px;padding:3px 8px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;line-height:1}
.pill-green{background:var(--green-50);color:#0F7A4E}
.pill-amber{background:var(--amber-50);color:#8A5407}
.pill-red{background:var(--red-50);color:#9A2A33}
.pill-blue{background:var(--primary-50);color:#13499F}
.pill-violet{background:var(--violet-50);color:#4B2BA0}
.pill-cyan{background:var(--cyan-50);color:#0A6E8A}
.pill-grey{background:#EEF1F6;color:#4B5A75}
.pill-soft{padding:3px 9px;font-size:11px;font-weight:600;text-transform:none;letter-spacing:0}

.dot{display:inline-block;width:6px;height:6px;border-radius:99px;background:#9CA8BD}
.dot-green{background:#15A66B}
.dot-amber{background:#E29411}
.dot-red{background:#D4434C}

.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow-sm)}
.card-pad{padding:18px 20px}
.card-title{font-size:13px;font-weight:700;color:var(--ink);letter-spacing:-.005em;margin:0}
.card-sub{font-size:12px;color:var(--muted);margin:2px 0 0}
.section-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.kv{display:flex;flex-direction:column;gap:3px}
.kv .k{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.kv .v{font-size:13.5px;color:var(--ink);font-weight:500}
.kv .v.mono{font-size:12.5px}

.hr{height:1px;background:var(--line-2);border:0;margin:12px 0}
.hairline{border-top:1px solid var(--line-2)}

.avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:14px;color:#fff;font-weight:700;letter-spacing:.02em;flex-shrink:0;background-size:cover}
.avatar-lg{width:72px;height:72px;border-radius:18px;font-size:24px;box-shadow:inset 0 -10px 30px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.5)}
.avatar-md{width:36px;height:36px;border-radius:10px;font-size:13px}
.avatar-sm{width:28px;height:28px;border-radius:8px;font-size:11px}

.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);padding:0 4px}
.tab{padding:10px 14px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;display:inline-flex;align-items:center;gap:8px}
.tab:hover{color:var(--ink-2)}
.tab.active{color:var(--primary);border-bottom-color:var(--primary)}
.tab .count{background:#EEF1F6;color:#4B5A75;font-size:10.5px;padding:1px 6px;border-radius:99px;font-weight:700}
.tab.active .count{background:var(--primary-50);color:var(--primary)}

.icon-btn{width:30px;height:30px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink-2);background:transparent;border:1px solid transparent}
.icon-btn:hover{background:#EEF1F6}

.row{display:flex;align-items:center;gap:10px}
.between{justify-content:space-between}

.skeleton-img{background:repeating-linear-gradient(135deg,#EEF1F6 0 8px,#E4E8F0 8px 16px);border-radius:10px}
.placeholder-photo{position:relative;border-radius:10px;overflow:hidden;background:#0B2147;color:#fff}
.placeholder-photo .pp-label{position:absolute;left:8px;bottom:6px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.04em;color:rgba(255,255,255,.85);text-shadow:0 1px 2px rgba(0,0,0,.3)}

.search{display:flex;align-items:center;gap:8px;height:36px;padding:0 12px;background:#fff;border:1px solid var(--line);border-radius:10px;color:var(--muted);font-size:13.5px;width:100%;max-width:380px}
.search input{border:0;outline:0;flex:1;font:inherit;color:var(--ink);background:transparent}

.toggle{position:relative;width:34px;height:20px;background:#D6DEEB;border-radius:99px;cursor:pointer;transition:background .15s}
.toggle.on{background:var(--green)}
.toggle .knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:99px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:left .15s}
.toggle.on .knob{left:16px}

.progress{height:6px;background:#EEF1F6;border-radius:99px;overflow:hidden}
.progress > div{height:100%;background:linear-gradient(90deg,#1F66E5,#5C92F0);border-radius:99px}

.stack{display:flex;flex-direction:column}
.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.gap-5{gap:20px}.gap-6{gap:24px}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}

.muted{color:var(--muted)}
.ink2{color:var(--ink-2)}

.fadein{animation:fadein .18s ease-out both}
@keyframes fadein{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

.modal-backdrop{position:fixed;inset:0;background:rgba(11,27,59,.45);backdrop-filter:blur(2px);z-index:80;display:flex;align-items:center;justify-content:center;animation:fadein .15s}
.modal{background:#fff;border-radius:18px;box-shadow:var(--shadow-lg);max-width:480px;width:92%;max-height:88vh;overflow:auto}
`;

// SVG icons
const I = {
  search:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  bell:(p)=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 8a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6"/></svg>,
  chev:(p)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back:(p)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close:(p)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  more:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>,
  pencil:(p)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.8"/></svg>,
  pause:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><rect x="6" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.8"/></svg>,
  power:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M7 7a7 7 0 1010 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  trash:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 7h14M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M7 7l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  check:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  external:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 4h6v6M20 4l-8 8M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  message:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  phone:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  mail:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.8"/></svg>,
  pin:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 21s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>,
  car:(p)=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 13l1.5-4.5A2 2 0 017.4 7h9.2a2 2 0 011.9 1.5L20 13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><rect x="3" y="13" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="7.5" cy="19" r="1.5" fill="currentColor"/><circle cx="16.5" cy="19" r="1.5" fill="currentColor"/></svg>,
  star:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/></svg>,
  cal:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  doc:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 3h8l4 4v14H6V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 3v4h4M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  shield:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  download:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  flag:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 3v18M5 4h11l-2 4 2 4H5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  copy:(p)=><svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...p}><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  eye:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  card:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18M7 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  clock:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  zap:(p)=><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>,
};

// Sidebar nav data
const NAV = [
  {key:"dashboard",label:"Dashboard",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="13" y="3" width="8" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="13" y="10" width="8" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.7"/><rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.7"/></svg>},
  {key:"technicians",label:"Technicians",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.7"/><circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M15 20c0-2 2-4 4-4s2 1 2 2" stroke="currentColor" strokeWidth="1.7"/></svg>},
  {key:"customers",label:"Customers",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.7"/></svg>},
  {key:"bookings",label:"Bookings",icon:I.cal},
  {key:"training",label:"Training",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><polygon points="6,4 20,12 6,20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>},
  {key:"policies",label:"Policies",icon:I.doc},
  {key:"payouts",label:"Payouts",icon:I.card},
  {key:"wallet",label:"Wallet & Ledger",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M16 13h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>},
  {key:"subs",label:"Subscriptions",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>},
  {key:"analytics",label:"Analytics",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 20V8M10 20V4M16 20v-9M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>},
  {key:"notifications",label:"Notifications",badge:"96",icon:I.bell},
  {key:"reviews",label:"Reviews",icon:I.star},
  {key:"marketing",label:"Marketing",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 11l16-7v16L3 13v-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/></svg>},
  {key:"waitlist",label:"Waitlist",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>},
  {key:"profile",label:"Profile",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7"/><path d="M5 20c0-3 3-5 7-5s7 2 7 5" stroke="currentColor" strokeWidth="1.7"/></svg>},
  {key:"settings",label:"Settings",icon:(p)=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2 2M16.4 16.4l2 2M5.6 18.4l2-2M16.4 7.6l2-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>},
];

window.PrimStyles = PrimStyles;
window.I = I;
window.NAV = NAV;
