// Technician detailed profile — actionable, dense, useful
const TPStyles = `
.tp-hero{background:linear-gradient(135deg,#0B2147 0%,#13325E 50%,#1F66E5 110%);border-radius:18px;padding:22px 24px;color:#fff;margin-bottom:18px;position:relative;overflow:hidden;box-shadow:0 8px 30px rgba(11,33,71,.18)}
.tp-hero::after{content:"";position:absolute;right:-40px;top:-40px;width:280px;height:280px;background:radial-gradient(circle,rgba(95,156,255,.4),transparent 60%);pointer-events:none}
.tp-hero .row1{display:flex;align-items:flex-start;gap:18px;position:relative;z-index:1}
.tp-hero .id{flex:1;min-width:0}
.tp-hero .id h1{margin:0;font-size:26px;font-weight:700;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
.tp-hero .id .h-handle{display:flex;align-items:center;gap:8px;margin-top:4px;color:rgba(255,255,255,.75);font-size:12.5px}
.tp-hero .id .h-pills{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.tp-hero .id .h-pills .pill{background:rgba(255,255,255,.14);color:#fff}
.tp-hero .id .h-pills .pill.pill-active{background:#15A66B;color:#fff}
.tp-hero .id .h-pills .pill.pill-cert{background:#0EA5BF;color:#fff}
.tp-hero .actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;align-items:flex-start;position:relative;z-index:1}
.tp-hero .actions .btn{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.15);backdrop-filter:blur(2px)}
.tp-hero .actions .btn:hover{background:rgba(255,255,255,.22)}
.tp-hero .actions .btn-primary{background:#fff;color:var(--ink);border-color:#fff}
.tp-hero .actions .btn-primary:hover{background:#F4F6FB}
.tp-hero .actions .btn-warn{background:rgba(241,154,30,.18);border-color:rgba(241,154,30,.4);color:#FFCB73}
.tp-hero .actions .btn-warn:hover{background:rgba(241,154,30,.28)}
.tp-hero .actions .btn-danger{background:rgba(212,67,76,.16);border-color:rgba(212,67,76,.35);color:#FFB3B8}
.tp-hero .actions .btn-danger:hover{background:rgba(212,67,76,.28)}

.tp-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:18px;position:relative;z-index:1}
.tp-stat{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px}
.tp-stat .l{font-size:10px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.08em;text-transform:uppercase}
.tp-stat .v{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin-top:6px}
.tp-stat .v small{font-size:12px;font-weight:500;color:rgba(255,255,255,.65);margin-left:4px}
.tp-stat .delta{font-size:11px;color:#9DE3C0;margin-top:2px;font-weight:600}
.tp-stat .delta.down{color:#FFB3B8}

.tp-grid{display:grid;grid-template-columns:1fr 320px;gap:18px;align-items:flex-start}
.tp-rail{position:sticky;top:120px;display:flex;flex-direction:column;gap:14px}

.section h3{margin:0;font-size:14px;font-weight:700;letter-spacing:-.005em}
.section .sub{font-size:12px;color:var(--muted);margin-top:1px}
.section-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.section-head .ra{display:flex;gap:6px}

.kgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px 24px}

.zip-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:8px;background:#EAF1FE;color:#13499F;font-size:12px;font-weight:600;font-family:"JetBrains Mono",monospace}

.bk-card{display:grid;grid-template-columns:90px 1fr auto auto;gap:14px;align-items:center;padding:14px;border-radius:12px;border:1px solid var(--line-2);background:#fff;margin-bottom:8px}
.bk-card:hover{border-color:#cfdcfb;background:#FAFCFF}
.bk-card .when{font-size:12px}
.bk-card .when .d{font-weight:700;color:var(--ink)}
.bk-card .when .t{color:var(--muted);font-size:11.5px;margin-top:2px}
.bk-card .body .t{font-weight:600;font-size:13.5px}
.bk-card .body .s{font-size:12px;color:var(--muted);margin-top:2px}
.bk-card .pay{font-size:14px;font-weight:700}
.bk-card .actions{display:flex;gap:6px}

.review{padding:12px 0;border-top:1px solid var(--line-2)}
.review:first-child{border-top:0;padding-top:0}
.review .hd{display:flex;align-items:center;justify-content:space-between}
.review .hd .by{font-weight:700;font-size:13px}
.review .hd .when{font-size:11.5px;color:var(--muted)}
.review .stars{color:#E29411;font-size:13px;letter-spacing:1px}
.review .text{font-size:13px;color:var(--ink-2);line-height:1.5;margin-top:4px}

.doc-row{display:flex;align-items:center;gap:12px;padding:11px 0;border-top:1px solid var(--line-2)}
.doc-row:first-child{border-top:0}
.doc-row .di{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:#EEF1F6;color:var(--ink-2);flex-shrink:0}
.doc-row .body{flex:1;min-width:0}
.doc-row .name{font-weight:600;font-size:13px}
.doc-row .meta{font-size:11.5px;color:var(--muted);margin-top:2px}

.sched-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}
.sched-day{padding:10px 8px;border-radius:10px;background:#F8FAFD;border:1px solid var(--line-2);text-align:center}
.sched-day.off{background:#FAFBFD;color:var(--muted)}
.sched-day .day{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase}
.sched-day .hours{font-size:12px;font-weight:700;margin-top:4px;color:var(--ink)}
.sched-day .hrs-num{font-size:10px;color:var(--muted);margin-top:1px}

.timeline-item{display:flex;gap:12px;padding:8px 0}
.timeline-item .when{font-size:11px;color:var(--muted);min-width:96px;font-weight:600}
.timeline-item .text{font-size:12.5px;color:var(--ink-2)}

.note{display:flex;gap:10px;padding:10px;border-radius:10px;background:#FCF1DE;border:1px solid #F2E1B6}
.note .body{flex:1}
.note .body .t{font-weight:600;font-size:12.5px;color:#8A5407}
.note .body .b{font-size:12.5px;color:#6E4007;margin-top:2px;line-height:1.4}

.payout-row{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr 90px;gap:10px;padding:11px 0;border-top:1px solid var(--line-2);font-size:13px;align-items:center}
.payout-row:first-child{border-top:0}
.payout-row .period{font-weight:600}
`;

function TechProfile({ tech, onBack, onPublic }){
  const [tab, setTab] = React.useState("overview");
  const tabs = [
    {k:"overview",label:"Overview"},
    {k:"bookings",label:"Bookings",n:(tech.upcoming?.length||0)+(tech.history?.length||0)},
    {k:"earnings",label:"Earnings & Payouts"},
    {k:"onboarding",label:"Onboarding"},
    {k:"docs",label:"Documents",n:tech.docs?.length},
    {k:"reviews",label:"Reviews",n:tech.reviews},
    {k:"availability",label:"Availability"},
    {k:"activity",label:"Activity"},
  ];
  return (
    <div className="fadein">
      <div className="crumb" onClick={onBack}><I.back /> Back to Technicians</div>

      {/* HERO */}
      <div className="tp-hero">
        <div className="row1">
          <div className="avatar avatar-lg" style={{width:84,height:84,fontSize:30,background:`linear-gradient(135deg,${tech.color},${shade(tech.color,-30)})`,boxShadow:"0 8px 24px rgba(0,0,0,.25), inset 0 -10px 30px rgba(0,0,0,.1)"}}>{tech.initials}</div>
          <div className="id">
            <h1>{tech.name}</h1>
            <div className="h-handle">
              <span style={{fontWeight:600}}>{tech.handle}</span>
              <span style={{opacity:.4}}>·</span>
              <span className="mono" style={{opacity:.7}}>id-{tech.id}</span>
              <I.copy style={{opacity:.6,cursor:"pointer"}} />
            </div>
            <div className="h-pills">
              <span className="pill pill-active"><span className="dot dot-green" style={{background:"#fff"}} /> {tech.status}</span>
              <span className="pill pill-cert"><I.shield /> {tech.type}</span>
              <span className="pill"><I.shield /> BG {tech.bgCheck}</span>
              <span className="pill"><I.zap /> {tech.tier} · ${tech.payRate}/job</span>
              <span className="pill"><I.pin /> Base {tech.baseZip} · {(tech.serviceZips||[]).length} ZIPs</span>
              <span className="pill"><I.clock /> Last active {tech.lastActive}</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary"><I.pencil /> Edit profile</button>
            <button className="btn"><I.eye /> View public profile <I.external /></button>
            <button className="btn"><I.message /> Message</button>
            <button className="btn btn-warn"><I.pause /> Suspend</button>
            <button className="btn btn-warn"><I.power /> Deactivate</button>
            <button className="btn btn-danger"><I.flag /> Terminate</button>
            <button className="btn"><I.more /></button>
          </div>
        </div>
        <div className="tp-stats">
          <div className="tp-stat"><div className="l">★ Rating</div><div className="v">{tech.rating?.toFixed(1)}<small>/5</small></div><div className="delta">↑ 0.2 vs last mo</div></div>
          <div className="tp-stat"><div className="l">Reviews</div><div className="v">{tech.reviews}</div><div className="delta">+4 this week</div></div>
          <div className="tp-stat"><div className="l">Jobs · 30d</div><div className="v">{tech.monthlyJobs}</div><div className="delta">+33%</div></div>
          <div className="tp-stat"><div className="l">Lifetime</div><div className="v">{tech.lifetimeJobs}</div><div className="delta">since {tech.joined?.slice(0,7)}</div></div>
          <div className="tp-stat"><div className="l">Earnings · 30d</div><div className="v">${(tech.grossYTD/12|0).toLocaleString()}</div><div className="delta">↑ 18%</div></div>
          <div className="tp-stat"><div className="l">On-time</div><div className="v">98%</div><div className="delta">3 in row</div></div>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs" style={{background:"#fff",borderRadius:"14px 14px 0 0",border:"1px solid var(--line)",borderBottom:"1px solid var(--line)",padding:"4px 6px",marginBottom:0}}>
        {tabs.map(t => (
          <div key={t.k} className={"tab"+(tab===t.k?" active":"")} onClick={()=>setTab(t.k)}>
            {t.label}{t.n!=null && <span className="count">{t.n}</span>}
          </div>
        ))}
      </div>

      <div style={{background:"#fff",border:"1px solid var(--line)",borderTop:0,borderRadius:"0 0 14px 14px",padding:0,marginBottom:18}}>
        {tab === "overview" && <Overview tech={tech} onPublic={onPublic} />}
        {tab === "bookings" && <BookingsTab tech={tech} />}
        {tab === "earnings" && <EarningsTab tech={tech} />}
        {tab === "onboarding" && <OnboardingTab tech={tech} />}
        {tab === "docs" && <DocsTab tech={tech} />}
        {tab === "reviews" && <ReviewsTab tech={tech} />}
        {tab === "availability" && <AvailabilityTab tech={tech} />}
        {tab === "activity" && <ActivityTab tech={tech} />}
      </div>
    </div>
  );
}

function Overview({ tech, onPublic }){
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:0}}>
      <div style={{padding:"22px 24px",borderRight:"1px solid var(--line-2)"}}>
        <div className="section-head">
          <div><h3>Profile details</h3><div className="sub">Private information visible only to admins.</div></div>
          <div className="ra">
            <button className="btn btn-ghost btn-sm" onClick={onPublic}><I.eye /> View public profile</button>
            <button className="btn btn-ghost btn-sm"><I.pencil /> Edit</button>
          </div>
        </div>
        <div className="kgrid">
          <div className="kv"><span className="k">Email</span><span className="v">{tech.email}</span></div>
          <div className="kv"><span className="k">Phone</span><span className="v">{tech.phone}</span></div>
          <div className="kv"><span className="k">Address</span><span className="v">{tech.address}</span></div>
          <div className="kv"><span className="k">State / City</span><span className="v">{tech.state} · {tech.city}</span></div>
          <div className="kv"><span className="k">Joined</span><span className="v">{tech.joined}</span></div>
          <div className="kv"><span className="k">Technician ID</span><span className="v mono">{tech.id}</span></div>
          <div className="kv" style={{gridColumn:"1 / -1"}}>
            <span className="k">Bio · public</span>
            <span className="v" style={{lineHeight:1.5}}>{tech.bio}</span>
          </div>
          <div className="kv" style={{gridColumn:"1 / -1"}}>
            <span className="k">Service area</span>
            <span style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {(tech.serviceZips||[]).map(z => <span key={z} className="zip-chip"><I.pin />{z}</span>)}
              <button className="btn btn-ghost btn-xs"><I.plus /> Add ZIP</button>
            </span>
          </div>
          <div className="kv" style={{gridColumn:"1 / -1"}}>
            <span className="k">Skills · public</span>
            <span style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              {(tech.skills||[]).map(s => <span key={s} className="pill pill-blue pill-soft">{s}</span>)}
            </span>
          </div>
        </div>

        <hr className="hr" style={{margin:"22px 0"}} />

        <div className="section-head">
          <div><h3>Vehicle of record</h3><div className="sub">Service vehicle the technician operates from.</div></div>
          <button className="btn btn-ghost btn-sm"><I.plus /> Add vehicle</button>
        </div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <div className="placeholder-photo" style={{width:160,height:96}}>
            <div className="skeleton-img" style={{width:"100%",height:"100%",borderRadius:0,opacity:.5}} />
            <div className="pp-label">// service van</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>{tech.vehicles?.[0]?.label || "—"}</div>
            <div style={{fontSize:12.5,color:"var(--muted)",marginTop:3}}>Plate {tech.vehicles?.[0]?.plate}</div>
            <div style={{display:"flex",gap:6,marginTop:8}}>
              <span className="pill pill-grey pill-soft">Insured</span>
              <span className="pill pill-grey pill-soft">Inspection on file</span>
            </div>
          </div>
        </div>

        <hr className="hr" style={{margin:"22px 0"}} />

        <div className="section-head">
          <div><h3>Upcoming bookings</h3><div className="sub">Next jobs assigned to this technician.</div></div>
          <button className="btn btn-ghost btn-sm">View all <I.chev /></button>
        </div>
        {(tech.upcoming||[]).map(b => (
          <div className="bk-card" key={b.id}>
            <div className="when"><div className="d">{b.when.split("·")[0]}</div><div className="t">{b.when.split("·")[1]}</div></div>
            <div className="body"><div className="t">{b.customer} <span className="muted" style={{fontSize:11.5,fontWeight:500}}>· {b.vehicle}</span></div><div className="s">{b.svc} · {b.addr}</div></div>
            <div className="pay">${b.pay}<div style={{textAlign:"right"}}><span className={"pill "+(b.status==="En route"?"pill-blue":"pill-grey")+" pill-soft"} style={{marginTop:4}}>{b.status}</span></div></div>
            <div className="actions"><button className="btn btn-ghost btn-xs">Reassign</button><button className="btn btn-ghost btn-xs"><I.chev /></button></div>
          </div>
        ))}
      </div>

      {/* RAIL */}
      <div style={{padding:"22px 20px",background:"#FAFBFD"}}>
        <div className="section-head"><h3>At a glance</h3></div>
        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">Performance</div>
          <div style={{display:"flex",gap:14,marginTop:8,alignItems:"center"}}>
            <div style={{fontSize:32,fontWeight:700,color:"#15A66B",letterSpacing:"-.02em",lineHeight:1}}>A+</div>
            <div style={{fontSize:11.5,color:"var(--muted)",lineHeight:1.4}}>5★ rate 92% · Reschedule rate 1.2% · Refund rate 0%</div>
          </div>
        </div>
        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">Tier progress</div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:12.5}}><span>Tier 3 · $30/job</span><span className="muted">12 / 25 jobs</span></div>
          <div className="progress" style={{marginTop:6}}><div style={{width:"48%"}} /></div>
          <div style={{fontSize:11.5,color:"var(--muted)",marginTop:6}}>13 jobs to maintain Tier 3 next month</div>
        </div>
        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">Internal notes</div>
          <div className="note" style={{marginTop:8}}>
            <I.flag />
            <div className="body"><div className="t">Top performer · feature on landing</div><div className="b">5★ on every job for 3 weeks. Considered for trainer role.</div></div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{marginTop:10,width:"100%",justifyContent:"center"}}><I.plus /> Add note</button>
        </div>
        <div className="card card-pad">
          <div className="section-label">Linked teammates</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
            {[["JT","Janelle Tran","Same ZIP"],["TN","Tasha N.","Backup"]].map(([i,n,r])=>(
              <div key={n} style={{display:"flex",gap:8,alignItems:"center"}}>
                <div className="avatar avatar-sm" style={{background:"#1F66E5"}}>{i}</div>
                <div style={{flex:1,fontSize:12.5,fontWeight:600}}>{n}<div style={{fontWeight:500,color:"var(--muted)",fontSize:11}}>{r}</div></div>
                <I.chev style={{color:"var(--muted)"}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsTab({ tech }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Upcoming · {tech.upcoming?.length||0}</h3></div><div className="ra"><button className="btn btn-ghost btn-sm">Filter</button><button className="btn btn-ghost btn-sm">Export</button></div></div>
      {(tech.upcoming||[]).map(b => (
        <div className="bk-card" key={b.id}>
          <div className="when"><div className="d">{b.when.split("·")[0]}</div><div className="t">{b.when.split("·")[1]}</div></div>
          <div className="body"><div className="t">{b.customer} <span className="muted" style={{fontSize:11.5,fontWeight:500}}>· {b.vehicle}</span></div><div className="s">{b.svc} · {b.addr}</div></div>
          <div className="pay">${b.pay}</div>
          <div className="actions"><span className={"pill "+(b.status==="En route"?"pill-blue":"pill-grey")+" pill-soft"}>{b.status}</span><button className="btn btn-ghost btn-xs">Reassign</button></div>
        </div>
      ))}
      <hr className="hr" />
      <div className="section-head"><div><h3>History</h3></div></div>
      {(tech.history||[]).map(b => (
        <div className="bk-card" key={b.id}>
          <div className="when"><div className="d">{b.when.split("·")[0]}</div><div className="t">{b.when.split("·")[1]}</div></div>
          <div className="body"><div className="t">{b.customer}</div><div className="s">{b.svc} {b.note ? "· "+b.note : ""}</div></div>
          <div className="pay">${b.pay}</div>
          <div className="actions"><span style={{color:"#E29411",fontWeight:700,fontSize:12.5}}>{"★".repeat(b.rating)}</span></div>
        </div>
      ))}
    </div>
  );
}

function EarningsTab({ tech }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="grid-3" style={{marginBottom:18}}>
        <div className="card card-pad"><div className="section-label">Lifetime gross</div><div style={{fontSize:28,fontWeight:700,marginTop:6}}>${(tech.grossYTD||0).toLocaleString()}</div><div className="muted" style={{fontSize:12}}>Across {tech.lifetimeJobs} jobs</div></div>
        <div className="card card-pad"><div className="section-label">Pending payout</div><div style={{fontSize:28,fontWeight:700,marginTop:6,color:"var(--amber)"}}>$1,116</div><div className="muted" style={{fontSize:12}}>Apr 28 – May 4 · settles Tue</div></div>
        <div className="card card-pad"><div className="section-label">Avg per job</div><div style={{fontSize:28,fontWeight:700,marginTop:6}}>$68</div><div className="muted" style={{fontSize:12}}>Tier 3 · $30 base + $38 perf</div></div>
      </div>

      <div className="section-head"><div><h3>Recent payouts</h3><div className="sub">Weekly settlement schedule.</div></div><button className="btn btn-ghost btn-sm"><I.download /> Export CSV</button></div>
      <div className="payout-row" style={{fontWeight:700,fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--muted)"}}>
        <span>Period</span><span>Gross</span><span>Fees</span><span>Net</span><span>Status</span>
      </div>
      {(tech.payouts||[]).map(p => (
        <div key={p.period} className="payout-row">
          <span className="period">{p.period}</span>
          <span>${p.gross.toLocaleString()}</span>
          <span className="muted">−${p.fees}</span>
          <span style={{fontWeight:700}}>${p.net.toLocaleString()}</span>
          <span><span className={"pill "+(p.status==="Paid"?"pill-green":"pill-amber")+" pill-soft"}>{p.status}</span></span>
        </div>
      ))}
    </div>
  );
}

function OnboardingTab({ tech }){
  const steps = [
    {t:"Private Profile",done:true},{t:"Public Profile",done:true},{t:"Training Assessment",done:true},
    {t:"Policies & Service Agreements",done:true},{t:"Background Check",done:true},{t:"Payment Details",done:true},
    {t:"Manage Availability",done:true},{t:"Equipment Supplies",done:true,revoke:true},
  ];
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Onboarding progress</h3><div className="sub">Required steps before activation.</div></div>
        <span className="pill pill-green"><I.check /> 100% Complete</span>
      </div>
      <div className="progress" style={{height:8,marginBottom:14}}><div style={{width:"100%"}} /></div>
      {steps.map(s => (
        <div key={s.t} className="doc-row">
          <div className="di" style={{background:"#E5F7EE",color:"#0F7A4E"}}><I.check /></div>
          <div className="body"><div className="name">{s.t}</div><div className="meta">Completed · 2024-09-14</div></div>
          {s.revoke && <button className="btn btn-ghost btn-xs">Revoke approval</button>}
          <span className="pill pill-green pill-soft">Done</span>
        </div>
      ))}
    </div>
  );
}

function DocsTab({ tech }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Documents & verifications</h3><div className="sub">Identity, insurance, training certificates.</div></div><button className="btn btn-ghost btn-sm"><I.plus /> Upload</button></div>
      {(tech.docs||[]).map(d => (
        <div key={d.name} className="doc-row">
          <div className="di"><I.doc /></div>
          <div className="body"><div className="name">{d.name}</div><div className="meta">{d.exp ? "Expires "+d.exp : "No expiration"}</div></div>
          <span className="pill pill-green pill-soft"><I.check /> Verified</span>
          <button className="icon-btn"><I.download /></button>
          <button className="icon-btn"><I.more /></button>
        </div>
      ))}
    </div>
  );
}

function ReviewsTab({ tech }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Customer reviews</h3><div className="sub">{tech.rating?.toFixed(1)} avg · {tech.reviews} reviews</div></div></div>
      {(tech.reviewItems||[]).map((r,i)=>(
        <div className="review" key={i}>
          <div className="hd"><div className="by">{r.by}</div><div className="when">{r.when}</div></div>
          <div className="stars">{"★".repeat(r.rating)}</div>
          <div className="text">{r.text}</div>
          <div style={{marginTop:8,display:"flex",gap:6}}><button className="btn btn-ghost btn-xs">Reply</button><button className="btn btn-ghost btn-xs">Flag</button></div>
        </div>
      ))}
    </div>
  );
}

function AvailabilityTab({ tech }){
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Weekly availability</h3><div className="sub">{tech.weeklyAvail || 58}h/week available · 5h above 45h target.</div></div><button className="btn btn-ghost btn-sm"><I.pencil /> Edit hours</button></div>
      <div className="sched-grid">
        {days.map(d => {
          const sl = tech.schedule?.[d] || ["off","off"];
          const off = sl[0] === "off";
          return (
            <div key={d} className={"sched-day"+(off?" off":"")}>
              <div className="day">{d}</div>
              <div className="hours">{off ? "Off" : sl[0]+"–"+sl[1]}</div>
              <div className="hrs-num">{off?"0h":"9h"}</div>
            </div>
          );
        })}
      </div>
      <hr className="hr" />
      <div className="section-head"><div><h3>Time off & blocks</h3></div><button className="btn btn-ghost btn-sm"><I.plus /> Add block</button></div>
      <div className="muted" style={{fontSize:13}}>No upcoming time-off blocks.</div>
    </div>
  );
}

function ActivityTab({ tech }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Recent activity</h3></div></div>
      {(tech.activity||[]).map((a,i)=>(
        <div key={i} className="timeline-item">
          <div className="when">{a.when}</div>
          <div className="text">{a.text}</div>
        </div>
      ))}
    </div>
  );
}

window.TPStyles = TPStyles;
window.TechProfile = TechProfile;
