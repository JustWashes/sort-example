// Quick-glance drawer — slides in from the right over the list
const QGStyles = `
.qg-overlay{position:fixed;inset:0;background:rgba(11,27,59,.35);z-index:60;animation:fadein .15s ease-out}
.qg-drawer{position:fixed;right:0;top:0;bottom:0;width:480px;background:#fff;border-left:1px solid var(--line);box-shadow:-30px 0 60px rgba(11,27,59,.18);z-index:61;display:flex;flex-direction:column;animation:qgIn .22s cubic-bezier(.2,.8,.2,1) both}
@keyframes qgIn{from{transform:translateX(40px);opacity:.6}to{transform:none;opacity:1}}
.qg-head{padding:14px 18px;border-bottom:1px solid var(--line-2);display:flex;align-items:center;gap:10px}
.qg-head .qg-title{font-size:11px;font-weight:700;letter-spacing:.1em;color:var(--muted);text-transform:uppercase}
.qg-body{flex:1;overflow:auto;padding:18px}
.qg-foot{padding:12px 18px;border-top:1px solid var(--line-2);display:flex;align-items:center;gap:8px;background:#FAFBFD}

.qg-hero{display:flex;gap:14px;align-items:flex-start}
.qg-stat{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:10px;background:#F8FAFD;border:1px solid var(--line-2)}
.qg-stat .v{font-size:18px;font-weight:700;color:var(--ink);line-height:1.1;letter-spacing:-.01em}
.qg-stat .l{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.05em;text-transform:uppercase}

.qg-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-top:1px solid var(--line-2);font-size:13px}
.qg-row:first-child{border-top:0}
.qg-row .l{display:inline-flex;align-items:center;gap:8px;color:var(--muted);font-weight:600;font-size:12px}
.qg-row .v{font-weight:600}

.qg-section{margin-top:18px}
.qg-section h4{margin:0 0 10px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:700}

.book-line{display:flex;align-items:center;gap:10px;padding:10px;border-radius:10px;border:1px solid var(--line-2);background:#fff;margin-bottom:8px}
.book-line .when{font-size:11.5px;font-weight:700;color:var(--ink-2);min-width:96px}
.book-line .body{flex:1;min-width:0}
.book-line .body .t{font-size:13px;font-weight:600;line-height:1.2}
.book-line .body .s{font-size:11.5px;color:var(--muted);margin-top:2px}
.book-line .pay{font-size:13px;font-weight:700}
`;

function QuickGlance({ kind, entity, onClose, onOpenFull, onPublicProfile }){
  if (!entity) return null;
  const isTech = kind === "tech";
  const statusPill = entity.status === "Active" ? "pill-green" : entity.status === "Pending" ? "pill-amber" : entity.status === "Inactive" ? "pill-grey" : "pill-grey";
  return (
    <>
      <div className="qg-overlay" onClick={onClose} />
      <aside className="qg-drawer" role="dialog">
        <div className="qg-head">
          <span className="qg-title">{isTech ? "Technician · Quick view" : "Customer · Quick view"}</span>
          <div style={{marginLeft:"auto",display:"flex",gap:6}}>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><I.close /></button>
          </div>
        </div>

        <div className="qg-body">
          <div className="qg-hero">
            <div className="avatar avatar-lg" style={{background:`linear-gradient(135deg,${entity.color},${shade(entity.color,-22)})`}}>
              {entity.initials}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:18,fontWeight:700,letterSpacing:"-.01em"}}>{entity.name}</div>
              <div style={{fontSize:12.5,color:"var(--muted)",marginTop:2}}>{entity.handle}</div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                <span className={"pill "+statusPill}><span className="dot dot-green" />{entity.status}</span>
                {isTech && entity.type === "Certified" && <span className="pill pill-cyan">Certified</span>}
                {isTech && entity.type === "Independent" && <span className="pill pill-grey">Independent</span>}
                {isTech && entity.bgCheck === "Confirmed" && <span className="pill pill-green"><I.shield /> BG Check</span>}
                {isTech && entity.bgCheck === "Incomplete" && <span className="pill pill-amber">BG Pending</span>}
                {!isTech && entity.plan && entity.plan !== "No Plan" && <span className="pill pill-blue">On plan</span>}
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16}}>
            {isTech ? (
              <>
                <div className="qg-stat"><div className="v">{entity.rating ? entity.rating.toFixed(1) : "—"}</div><div className="l">Rating · {entity.reviews} reviews</div></div>
                <div className="qg-stat"><div className="v">{entity.monthlyJobs}</div><div className="l">Jobs · this mo</div></div>
                <div className="qg-stat"><div className="v">{entity.lifetimeJobs}</div><div className="l">Lifetime jobs</div></div>
              </>
            ) : (
              <>
                <div className="qg-stat"><div className="v">{entity.bookings}</div><div className="l">Bookings</div></div>
                <div className="qg-stat"><div className="v">{entity.credits}</div><div className="l">Credits</div></div>
                <div className="qg-stat"><div className="v">${(entity.lifetime||0).toLocaleString(undefined,{minimumFractionDigits:0})}</div><div className="l">Lifetime</div></div>
              </>
            )}
          </div>

          {/* Contact / details */}
          <div className="qg-section">
            <h4>{isTech ? "Contact & coverage" : "Contact & address"}</h4>
            <div>
              <div className="qg-row"><span className="l"><I.mail /> Email</span><span className="v">{entity.email}</span></div>
              <div className="qg-row"><span className="l"><I.phone /> Phone</span><span className="v">{entity.phone || "—"}</span></div>
              {isTech ? (
                <>
                  <div className="qg-row"><span className="l"><I.pin /> Base ZIP</span><span className="v">{entity.baseZip}</span></div>
                  <div className="qg-row"><span className="l"><I.pin /> Service ZIPs</span><span className="v">{(entity.serviceZips||[]).join(", ") || "—"}</span></div>
                  <div className="qg-row"><span className="l"><I.zap /> Pay tier</span><span className="v">{entity.tier} · ${entity.payRate}</span></div>
                  <div className="qg-row"><span className="l"><I.clock /> Last active</span><span className="v">{entity.lastActive}</span></div>
                </>
              ) : (
                <>
                  <div className="qg-row"><span className="l"><I.pin /> Address</span><span className="v">{entity.zip}, {entity.city||"—"}</span></div>
                  <div className="qg-row"><span className="l"><I.cal /> Plan</span><span className="v" style={{maxWidth:240,textAlign:"right"}}>{entity.plan}</span></div>
                  <div className="qg-row"><span className="l"><I.clock /> Cadence</span><span className="v">{entity.cadence}</span></div>
                  <div className="qg-row"><span className="l"><I.cal /> Next renewal</span><span className="v">{entity.nextRenewal}</span></div>
                </>
              )}
            </div>
          </div>

          {/* Activity / upcoming */}
          {isTech && entity.upcoming && (
            <div className="qg-section">
              <h4>Next bookings</h4>
              {entity.upcoming.slice(0,2).map(b => (
                <div className="book-line" key={b.id}>
                  <div className="when">{b.when}</div>
                  <div className="body">
                    <div className="t">{b.customer}</div>
                    <div className="s">{b.svc} · {b.vehicle}</div>
                  </div>
                  <div className="pay">${b.pay}</div>
                </div>
              ))}
              {(!entity.upcoming || !entity.upcoming.length) && <div className="muted" style={{fontSize:12.5}}>No upcoming bookings</div>}
            </div>
          )}
          {!isTech && entity.upcomingBookings && (
            <div className="qg-section">
              <h4>Next bookings</h4>
              {entity.upcomingBookings.slice(0,2).map(b => (
                <div className="book-line" key={b.id}>
                  <div className="when">{b.when}</div>
                  <div className="body">
                    <div className="t">{b.svc}</div>
                    <div className="s">{b.vehicle} · {b.tech}</div>
                  </div>
                  <div className="pay">${b.total}</div>
                </div>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="qg-section">
            <h4>Quick actions</h4>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button className="btn btn-ghost btn-sm"><I.message /> Message</button>
              <button className="btn btn-ghost btn-sm"><I.phone /> Call</button>
              <button className="btn btn-ghost btn-sm"><I.mail /> Email</button>
              {isTech && <button className="btn btn-ghost btn-sm" onClick={onPublicProfile}><I.eye /> View public profile</button>}
              {isTech && <button className="btn btn-ghost btn-sm"><I.cal /> Adjust availability</button>}
              {!isTech && <button className="btn btn-ghost btn-sm"><I.plus /> Add credit</button>}
              {!isTech && <button className="btn btn-ghost btn-sm"><I.card /> Refund</button>}
              <button className="btn btn-ghost btn-sm"><I.flag /> Add note</button>
            </div>
          </div>
        </div>

        <div className="qg-foot">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            {isTech && <button className="btn btn-ghost btn-sm" onClick={onPublicProfile}><I.eye /> Public profile</button>}
            <button className="btn btn-primary btn-sm" onClick={onOpenFull}>Open full profile <I.chev /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

// utility — darken/lighten hex
function shade(hex, pct){
  const c = hex.replace("#","");
  const num = parseInt(c.length===3 ? c.split("").map(x=>x+x).join("") : c, 16);
  let r=(num>>16)&255, g=(num>>8)&255, b=num&255;
  const t = pct < 0 ? 0 : 255;
  const p = Math.abs(pct)/100;
  r = Math.round((t-r)*p + r);
  g = Math.round((t-g)*p + g);
  b = Math.round((t-b)*p + b);
  return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}

window.QGStyles = QGStyles;
window.QuickGlance = QuickGlance;
window.shade = shade;
