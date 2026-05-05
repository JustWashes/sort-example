// Admin shell: sidebar + topbar + breadcrumb header
const ShellStyles = `
.shell{display:grid;grid-template-columns:232px 1fr;min-height:100vh}
.sidebar{background:#fff;border-right:1px solid var(--line);display:flex;flex-direction:column;height:100vh;position:sticky;top:0}
.brand{display:flex;align-items:center;gap:10px;padding:18px 18px 14px;border-bottom:1px solid var(--line-2)}
.brand-mark{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#6FB1FF,#0B2147 70%);position:relative;overflow:hidden}
.brand-mark::after{content:"";position:absolute;left:-2px;top:6px;width:34px;height:8px;background:rgba(255,255,255,.4);border-radius:99px;transform:rotate(-15deg)}
.brand-name{font-weight:700;font-size:16px;letter-spacing:-.01em}
.nav{padding:10px 10px;flex:1;overflow:auto}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#3D4A63;cursor:pointer;margin-bottom:1px}
.nav-item:hover{background:#F5F7FB}
.nav-item.active{background:var(--primary-50);color:var(--primary);font-weight:600}
.nav-item .badge{margin-left:auto;background:#FF3B53;color:#fff;font-size:10px;padding:2px 6px;border-radius:99px;font-weight:700;line-height:1}
.nav-item.active svg{color:var(--primary)}
.nav-item svg{color:#7B8AA3}
.nav-section{padding:14px 14px 6px;font-size:10.5px;font-weight:700;color:#94A1BB;text-transform:uppercase;letter-spacing:.08em}
.user-card{display:flex;align-items:center;gap:10px;padding:14px;border-top:1px solid var(--line-2);background:#FAFBFD}
.user-card .meta{font-size:12.5px;font-weight:700;line-height:1.1}
.user-card .meta .role{font-size:10.5px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
.signout{padding:10px 14px;font-size:11px;font-weight:700;color:#94A1BB;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-align:center}

.topbar{height:56px;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 22px;position:sticky;top:0;z-index:20}
.topbar .topbar-search{max-width:420px;flex:1}
.topbar .right{margin-left:auto;display:flex;align-items:center;gap:14px}
.bell-wrap{position:relative;color:var(--ink-2);cursor:pointer}
.bell-wrap .ind{position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:99px;background:var(--primary);border:2px solid #fff}
.user-trig{display:flex;align-items:center;gap:8px;border:1px solid var(--line);padding:4px 10px 4px 4px;border-radius:99px;cursor:pointer}

.subbar{height:42px;background:var(--navy);color:#cdd9ec;display:flex;align-items:center;gap:10px;padding:0 24px;font-size:12px;font-weight:600;letter-spacing:.04em}
.subbar a{color:#5E9DFF}
.subbar .right-cap{margin-left:auto;color:#fff;letter-spacing:.18em;font-size:11.5px;font-weight:700}

.page{padding:24px 28px 80px;max-width:1320px;margin:0 auto}
.crumb{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;margin-bottom:14px}
.crumb:hover{color:var(--ink-2)}
`;

function Shell({ activeNav="technicians", subbarRight="TECHNICIAN PROFILE", children }){
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-name">JustWashes</div>
        </div>
        <div className="nav">
          {NAV.map(n => (
            <div key={n.key} className={"nav-item" + (n.key===activeNav?" active":"")}>
              <n.icon />
              <span>{n.label}</span>
              {n.badge ? <span className="badge">{n.badge}</span> : null}
            </div>
          ))}
        </div>
        <div className="user-card">
          <div className="avatar avatar-md" style={{background:"linear-gradient(135deg,#1F66E5,#0B2147)"}}>SA</div>
          <div className="meta">Super Admin<div className="role">Admin</div></div>
        </div>
        <div className="signout">SIGN OUT</div>
      </aside>

      <main>
        <div className="topbar">
          <div className="topbar-search">
            <div className="search">
              <I.search />
              <input placeholder="Search technicians, customers, bookings…" />
            </div>
          </div>
          <div className="right">
            <div className="bell-wrap"><I.bell /><div className="ind" /></div>
            <div className="user-trig">
              <div className="avatar avatar-sm" style={{background:"#E4E8F0",color:"#0B2147"}}>👤</div>
              <span style={{fontSize:13,fontWeight:600}}>Management</span>
              <I.chev />
            </div>
          </div>
        </div>
        <div className="subbar">
          <span style={{color:"#5E9DFF"}}>JUSTWASHES</span>
          <span style={{color:"#3a557e"}}>|</span>
          <span>Admin Panel</span>
          <span className="right-cap">{subbarRight}</span>
        </div>
        <div className="page">{children}</div>
      </main>
    </div>
  );
}

window.ShellStyles = ShellStyles;
window.Shell = Shell;
