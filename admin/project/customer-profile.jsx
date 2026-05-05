// Customer detailed profile
const CPStyles = `
.cp-hero{background:linear-gradient(135deg,#3B1F86 0%,#6E46D6 60%,#9479F0 110%);border-radius:18px;padding:22px 24px;color:#fff;margin-bottom:18px;position:relative;overflow:hidden;box-shadow:0 8px 30px rgba(58,18,134,.18)}
.cp-hero::after{content:"";position:absolute;right:-40px;top:-40px;width:280px;height:280px;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 60%);pointer-events:none}
.cp-hero .row1{display:flex;align-items:flex-start;gap:18px;position:relative;z-index:1}
.cp-hero .id{flex:1;min-width:0}
.cp-hero .id h1{margin:0;font-size:26px;font-weight:700;letter-spacing:-.02em}
.cp-hero .id .h-handle{display:flex;align-items:center;gap:8px;margin-top:4px;color:rgba(255,255,255,.78);font-size:12.5px}
.cp-hero .id .h-pills{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.cp-hero .id .h-pills .pill{background:rgba(255,255,255,.16);color:#fff}
.cp-hero .actions{display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;align-items:flex-start;position:relative;z-index:1}
.cp-hero .actions .btn{background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.18)}
.cp-hero .actions .btn:hover{background:rgba(255,255,255,.22)}
.cp-hero .actions .btn-primary{background:#fff;color:var(--ink);border-color:#fff}
.cp-hero .actions .btn-warn{background:rgba(241,154,30,.18);border-color:rgba(241,154,30,.4);color:#FFCB73}
.cp-hero .actions .btn-danger{background:rgba(212,67,76,.16);border-color:rgba(212,67,76,.35);color:#FFB3B8}
.cp-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-top:18px;position:relative;z-index:1}
.cp-stat{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:12px}
.cp-stat .l{font-size:10px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.08em;text-transform:uppercase}
.cp-stat .v{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin-top:6px}
.cp-stat .v small{font-size:12px;font-weight:500;color:rgba(255,255,255,.65);margin-left:4px}

.veh-card{display:grid;grid-template-columns:140px 1fr auto;gap:14px;align-items:center;padding:14px;border-radius:14px;border:1px solid var(--line-2);background:#fff;margin-bottom:10px}
.veh-card .ph{height:88px;border-radius:10px;background:linear-gradient(135deg,#1F66E5,#0B2147);position:relative;overflow:hidden;color:#fff}
.veh-card .ph .lbl{position:absolute;left:8px;bottom:6px;font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.04em;opacity:.85}
.veh-card .body .t{font-weight:700;font-size:15px}
.veh-card .body .s{font-size:12px;color:var(--muted);margin-top:2px}

.pm-card{display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1px solid var(--line-2);background:#fff;margin-bottom:8px}
.pm-card .brand{width:42px;height:28px;border-radius:6px;background:linear-gradient(135deg,#0B2147,#1F66E5);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;letter-spacing:.04em}

.invoice-row{display:grid;grid-template-columns:1.1fr 1fr 1fr 1fr;gap:10px;padding:11px 0;border-top:1px solid var(--line-2);font-size:13px;align-items:center}
.invoice-row:first-child{border-top:0}
`;

function CustProfile({ cust, onBack }){
  const [tab,setTab] = React.useState("overview");
  const tabs = [
    {k:"overview",label:"Overview"},
    {k:"vehicles",label:"Vehicles & plan",n:cust.vehicles?.length},
    {k:"bookings",label:"Bookings",n:(cust.upcomingBookings?.length||0)+(cust.pastBookings?.length||0)},
    {k:"billing",label:"Billing & credits"},
    {k:"renewals",label:"Renewals"},
    {k:"disputes",label:"Disputes",n:cust.disputesLog?.length||0},
    {k:"activity",label:"Activity"},
  ];
  return (
    <div className="fadein">
      <div className="crumb" onClick={onBack}><I.back /> Back to Customers</div>

      <div className="cp-hero">
        <div className="row1">
          <div className="avatar avatar-lg" style={{width:84,height:84,fontSize:30,background:`linear-gradient(135deg,${cust.color},${shade(cust.color,-30)})`,boxShadow:"0 8px 24px rgba(0,0,0,.25)"}}>{cust.initials}</div>
          <div className="id">
            <h1>{cust.name}</h1>
            <div className="h-handle"><span style={{fontWeight:600}}>{cust.email}</span><span style={{opacity:.4}}>·</span><span className="mono" style={{opacity:.7}}>id-{cust.id}</span><I.copy style={{opacity:.6,cursor:"pointer"}} /></div>
            <div className="h-pills">
              <span className="pill"><span className="dot dot-green" style={{background:"#fff"}} /> {cust.status}</span>
              <span className="pill"><I.cal /> Customer since {cust.customerSince}</span>
              <span className="pill"><I.car /> {(cust.vehicles||[]).length} vehicles</span>
              <span className="pill"><I.zap /> {cust.plan?.length>40?cust.plan.slice(0,38)+"…":cust.plan}</span>
              <span className="pill"><I.pin /> {cust.zip} · {cust.city}</span>
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary"><I.pencil /> Edit profile</button>
            <button className="btn"><I.plus /> New booking</button>
            <button className="btn"><I.message /> Message</button>
            <button className="btn"><I.plus /> Add credit</button>
            <button className="btn"><I.card /> Refund</button>
            <button className="btn btn-warn"><I.pause /> Suspend</button>
            <button className="btn btn-danger"><I.trash /> Terminate</button>
          </div>
        </div>
        <div className="cp-stats">
          <div className="cp-stat"><div className="l">Lifetime spend</div><div className="v">${cust.lifetime?.toLocaleString()}</div></div>
          <div className="cp-stat"><div className="l">Bookings</div><div className="v">{cust.bookings}<small>/{cust.completed} done</small></div></div>
          <div className="cp-stat"><div className="l">Credits</div><div className="v">{cust.credits}</div></div>
          <div className="cp-stat"><div className="l">Cancel rate</div><div className="v">5.5%</div></div>
          <div className="cp-stat"><div className="l">Avg rating given</div><div className="v">4.8<small>/5</small></div></div>
          <div className="cp-stat"><div className="l">Next renewal</div><div className="v" style={{fontSize:14,marginTop:10}}>{cust.nextRenewal}</div></div>
        </div>
      </div>

      <div className="tabs" style={{background:"#fff",borderRadius:"14px 14px 0 0",border:"1px solid var(--line)",borderBottom:"1px solid var(--line)",padding:"4px 6px",marginBottom:0}}>
        {tabs.map(t => (
          <div key={t.k} className={"tab"+(tab===t.k?" active":"")} onClick={()=>setTab(t.k)}>
            {t.label}{t.n!=null && <span className="count">{t.n}</span>}
          </div>
        ))}
      </div>

      <div style={{background:"#fff",border:"1px solid var(--line)",borderTop:0,borderRadius:"0 0 14px 14px",marginBottom:18}}>
        {tab==="overview" && <COverview cust={cust} />}
        {tab==="vehicles" && <VehiclesTab cust={cust} />}
        {tab==="bookings" && <CBookingsTab cust={cust} />}
        {tab==="billing" && <BillingTab cust={cust} />}
        {tab==="renewals" && <RenewalsTab cust={cust} />}
        {tab==="disputes" && <DisputesTab cust={cust} />}
        {tab==="activity" && <CActivityTab cust={cust} />}
      </div>
    </div>
  );
}

function COverview({ cust }){
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:0}}>
      <div style={{padding:"22px 24px",borderRight:"1px solid var(--line-2)"}}>
        <div className="section-head"><div><h3>Profile details</h3><div className="sub">Contact & address.</div></div><button className="btn btn-ghost btn-sm"><I.pencil /> Edit</button></div>
        <div className="kgrid">
          <div className="kv"><span className="k">Email</span><span className="v">{cust.email}</span></div>
          <div className="kv"><span className="k">Phone</span><span className="v">{cust.phone}</span></div>
          <div className="kv" style={{gridColumn:"1 / -1"}}><span className="k">Address</span><span className="v">{cust.addr || "—"}</span></div>
          <div className="kv"><span className="k">City / State</span><span className="v">{cust.city}, {cust.state}</span></div>
          <div className="kv"><span className="k">ZIP</span><span className="v mono">{cust.zip}</span></div>
        </div>

        <hr className="hr" style={{margin:"22px 0"}} />

        <div className="section-head"><div><h3>Vehicles ({(cust.vehicles||[]).length})</h3></div><button className="btn btn-ghost btn-sm"><I.plus /> Add vehicle</button></div>
        {(cust.vehicles||[]).map(v => (
          <div className="veh-card" key={v.id}>
            <div className="ph"><div className="skeleton-img" style={{width:"100%",height:"100%",borderRadius:0,opacity:.4}} /><div className="lbl">// {v.year} {v.model}</div></div>
            <div className="body">
              <div className="t">{v.year} {v.make} {v.model}</div>
              <div className="s">{v.color} · {v.size} · Plate {v.plate}</div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                <span className="pill pill-blue pill-soft">{v.plan}</span>
                {v.ceramic && <span className="pill pill-cyan pill-soft">Ceramic coated</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:6}}><button className="btn btn-ghost btn-xs"><I.pencil /> Edit</button><button className="btn btn-ghost btn-xs">Book</button></div>
          </div>
        ))}

        <hr className="hr" style={{margin:"22px 0"}} />

        <div className="section-head"><div><h3>Upcoming bookings</h3></div><button className="btn btn-ghost btn-sm">View all <I.chev /></button></div>
        {(cust.upcomingBookings||[]).map(b => (
          <div className="bk-card" key={b.id}>
            <div className="when"><div className="d">{b.when.split("·")[0]}</div><div className="t">{b.when.split("·")[1]}</div></div>
            <div className="body"><div className="t">{b.svc}</div><div className="s">{b.vehicle} · {b.tech}</div></div>
            <div className="pay">${b.total}</div>
            <div className="actions"><span className={"pill "+(b.status==="En route"?"pill-blue":"pill-grey")+" pill-soft"}>{b.status}</span></div>
          </div>
        ))}
      </div>

      <div style={{padding:"22px 20px",background:"#FAFBFD"}}>
        <div className="section-head"><h3>At a glance</h3></div>

        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">Subscription health</div>
          <div style={{fontSize:22,fontWeight:700,marginTop:8,color:"#15A66B",letterSpacing:"-.02em"}}>Healthy</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>On-time payments · No disputes · Renews {cust.nextRenewal}</div>
        </div>

        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">Payment methods</div>
          {(cust.paymentMethods||[]).map(p => (
            <div className="pm-card" key={p.last4} style={{marginTop:8,marginBottom:0,borderRadius:10,padding:"10px"}}>
              <div className="brand">{p.brand.slice(0,4).toUpperCase()}</div>
              <div style={{flex:1,fontSize:12.5,fontWeight:600}}>•••• {p.last4}<div style={{fontSize:11,color:"var(--muted)",fontWeight:500}}>Exp {p.exp}</div></div>
              {p.default && <span className="pill pill-blue pill-soft">Default</span>}
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:8,width:"100%",justifyContent:"center"}}><I.plus /> Add card</button>
        </div>

        <div className="card card-pad" style={{marginBottom:14}}>
          <div className="section-label">CS notes</div>
          {(cust.notes||[]).map((n,i) => (
            <div key={i} className="note" style={{marginTop:8}}>
              <I.flag />
              <div className="body"><div className="t">{n.by} · {n.when}</div><div className="b">{n.text}</div></div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:10,width:"100%",justifyContent:"center"}}><I.plus /> Add note</button>
        </div>

        <div className="card card-pad">
          <div className="section-label">Preferred technician</div>
          <div style={{display:"flex",gap:10,alignItems:"center",marginTop:8}}>
            <div className="avatar avatar-md" style={{background:"linear-gradient(135deg,#0EA5BF,#075061)"}}>JT</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>Jamal Thompson</div><div style={{fontSize:11.5,color:"var(--muted)"}}>11 of 17 jobs · 5★ avg</div></div>
            <button className="btn btn-ghost btn-xs">Lock</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehiclesTab({ cust }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Vehicles & plan</h3><div className="sub">Active subscription details for each vehicle.</div></div><button className="btn btn-primary btn-sm"><I.plus /> Add vehicle</button></div>
      {(cust.vehicles||[]).map(v => (
        <div className="card card-pad" key={v.id} style={{marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"160px 1fr auto",gap:16,alignItems:"flex-start"}}>
            <div className="placeholder-photo" style={{height:100}}><div className="skeleton-img" style={{width:"100%",height:"100%",borderRadius:0,opacity:.4}} /><div className="pp-label">// {v.year} {v.model}</div></div>
            <div>
              <div style={{fontWeight:700,fontSize:16}}>{v.year} {v.make} {v.model}</div>
              <div className="kgrid" style={{marginTop:12}}>
                <div className="kv"><span className="k">Size</span><span className="v">{v.size}</span></div>
                <div className="kv"><span className="k">Color</span><span className="v">{v.color}</span></div>
                <div className="kv"><span className="k">Plate</span><span className="v mono">{v.plate}</span></div>
                <div className="kv"><span className="k">Ceramic coating</span><span className="v">{v.ceramic?"Yes · applied 2025-09":"No"}</span></div>
                <div className="kv" style={{gridColumn:"1 / -1"}}><span className="k">Plan</span><span className="v"><span className="pill pill-blue">{v.plan}</span></span></div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <button className="btn btn-ghost btn-sm"><I.pencil /> Edit</button>
              <button className="btn btn-ghost btn-sm">Change plan</button>
              <button className="btn btn-ghost btn-sm">Pause</button>
              <button className="btn btn-ghost btn-sm" style={{color:"#B22833",borderColor:"#F2C2C7"}}>Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CBookingsTab({ cust }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Upcoming · {cust.upcomingBookings?.length||0}</h3></div></div>
      {(cust.upcomingBookings||[]).map(b => (
        <div className="bk-card" key={b.id}>
          <div className="when"><div className="d">{b.when.split("·")[0]}</div><div className="t">{b.when.split("·")[1]}</div></div>
          <div className="body"><div className="t">{b.svc}</div><div className="s">{b.vehicle} · {b.tech}</div></div>
          <div className="pay">${b.total}</div>
          <div className="actions"><span className={"pill "+(b.status==="En route"?"pill-blue":"pill-grey")+" pill-soft"}>{b.status}</span><button className="btn btn-ghost btn-xs">Reassign</button></div>
        </div>
      ))}
      <hr className="hr" />
      <div className="section-head"><div><h3>Past bookings</h3></div></div>
      {(cust.pastBookings||[]).map(b => (
        <div className="bk-card" key={b.id}>
          <div className="when"><div className="d">{b.when}</div><div className="t">2025</div></div>
          <div className="body"><div className="t">{b.svc}</div><div className="s">{b.vehicle} · {b.tech}</div></div>
          <div className="pay">${b.total}</div>
          <div className="actions"><span style={{color:"#E29411",fontWeight:700,fontSize:12.5}}>{"★".repeat(b.rating)}</span></div>
        </div>
      ))}
    </div>
  );
}

function BillingTab({ cust }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="grid-3" style={{marginBottom:18}}>
        <div className="card card-pad"><div className="section-label">Lifetime</div><div style={{fontSize:28,fontWeight:700,marginTop:6}}>${cust.lifetime?.toLocaleString()}</div></div>
        <div className="card card-pad"><div className="section-label">Outstanding</div><div style={{fontSize:28,fontWeight:700,marginTop:6,color:"var(--amber)"}}>$135</div><div className="muted" style={{fontSize:12}}>1 invoice pending</div></div>
        <div className="card card-pad"><div className="section-label">Available credits</div><div style={{fontSize:28,fontWeight:700,marginTop:6,color:"var(--violet)"}}>{cust.credits}</div><div className="muted" style={{fontSize:12}}>≈ $230 value</div></div>
      </div>

      <div className="section-head"><div><h3>Invoices</h3></div><button className="btn btn-ghost btn-sm"><I.download /> Export</button></div>
      <div className="invoice-row" style={{fontWeight:700,fontSize:11,letterSpacing:".06em",textTransform:"uppercase",color:"var(--muted)"}}>
        <span>Invoice</span><span>Date</span><span>Amount</span><span>Status</span>
      </div>
      {(cust.invoices||[]).map(i => (
        <div className="invoice-row" key={i.id}>
          <span style={{fontWeight:600}}>{i.id}</span><span className="muted">{i.date}</span><span style={{fontWeight:700}}>${i.amount}</span>
          <span><span className={"pill "+(i.status==="Paid"?"pill-green":"pill-amber")+" pill-soft"}>{i.status}</span></span>
        </div>
      ))}

      <hr className="hr" />
      <div className="section-head"><div><h3>Credit log</h3></div><button className="btn btn-ghost btn-sm"><I.plus /> Adjust credits</button></div>
      {(cust.creditLog||[]).map((c,i) => (
        <div key={i} style={{display:"flex",alignItems:"center",padding:"10px 0",borderTop:i?"1px solid var(--line-2)":"0"}}>
          <span style={{flex:1,fontSize:13}}>{c.note}</span>
          <span className="muted" style={{fontSize:12,minWidth:80}}>{c.when}</span>
          <span style={{minWidth:50,textAlign:"right",fontWeight:700,color:c.delta>0?"var(--green)":"var(--red)"}}>{c.delta>0?"+":""}{c.delta}</span>
        </div>
      ))}
    </div>
  );
}

function RenewalsTab({ cust }){
  return (
    <div style={{padding:"22px 24px"}}>
      <div className="section-head"><div><h3>Upcoming renewals</h3><div className="sub">Auto-charge schedule per vehicle plan.</div></div></div>
      {(cust.vehicles||[]).map(v => (
        <div className="bk-card" key={v.id}>
          <div className="when"><div className="d">{cust.nextRenewal}</div><div className="t">9:00 AM</div></div>
          <div className="body"><div className="t">{v.plan}</div><div className="s">{v.year} {v.make} {v.model} · auto-charge Visa •••• 4242</div></div>
          <div className="pay">$165</div>
          <div className="actions"><button className="btn btn-ghost btn-xs">Reschedule</button><button className="btn btn-ghost btn-xs">Skip</button></div>
        </div>
      ))}
    </div>
  );
}

function DisputesTab({ cust }){
  return (
    <div style={{padding:"22px 24px",textAlign:"center",color:"var(--muted)"}}>
      <div style={{fontSize:13,padding:"40px 0"}}>No disputes filed by this customer.</div>
    </div>
  );
}

function CActivityTab({ cust }){
  return (
    <div style={{padding:"22px 24px"}}>
      {(cust.activity||[]).map((a,i) => (
        <div key={i} className="timeline-item">
          <div className="when">{a.when}</div>
          <div className="text">{a.text}</div>
        </div>
      ))}
    </div>
  );
}

window.CPStyles = CPStyles;
window.CustProfile = CustProfile;
