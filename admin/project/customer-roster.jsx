// Customer roster — with filter bar + multi-sort + plan-tier-aware sorting
const CRosterStyles = `
.kpi-row5{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:18px}
.results-meta{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-top:1px solid var(--line-2);background:#FAFBFD;font-size:12px;color:var(--muted)}
.results-meta b{color:var(--ink)}
`;

// Plan tier ranking (no plan < quarterly < bi-monthly < monthly)
const PLAN_RANK = {
  "No Plan": 0,
};
function planTier(p){
  if (!p || p === "No Plan") return 0;
  const s = p.toLowerCase();
  if (s.includes("monthly") && !s.includes("bi-")) return 30;
  if (s.includes("bi-monthly")) return 20;
  if (s.includes("quarterly")) return 10;
  return 5;
}
function planLabel(p){ return p === "No Plan" ? "No plan" : p; }
function daysSince(d){ return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }

function CustRoster({ onQuick, onOpen }){
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState([]);
  const [sorts, setSorts] = React.useState([{id:"customerSince", get:r=>r.customerSince, type:"date", dir:"asc", label:"Joined"}]);
  const [statusTab, setStatusTab] = React.useState("All");

  const FACETS = [
    {id:"status",label:"Status",kind:"set",get:r=>r.status,options:["Active","Suspended","Inactive"]},
    {id:"plan",label:"Plan tier",kind:"set",get:r=>r.plan==="No Plan"?"No plan":r.plan.includes("Monthly")&&!r.plan.includes("Bi-")?"Monthly":r.plan.includes("Bi-Monthly")?"Bi-monthly":r.plan.includes("Quarterly")?"Quarterly":"Other",options:["No plan","Quarterly","Bi-monthly","Monthly"]},
    {id:"zip",label:"ZIP",kind:"set",get:r=>r.zip,options:[...new Set(CUSTOMERS.map(c=>c.zip))].sort()},
    {id:"city",label:"City",kind:"set",get:r=>r.city,options:[...new Set(CUSTOMERS.map(c=>c.city))].sort()},
    {id:"cadence",label:"Cadence",kind:"set",get:r=>r.cadence,options:[...new Set(CUSTOMERS.map(c=>c.cadence))]},
    {id:"bookings",label:"Bookings",kind:"range",get:r=>r.bookings,minHint:"0",maxHint:"100"},
    {id:"credits",label:"Credits",kind:"range",get:r=>r.credits,minHint:"0",maxHint:"20"},
    {id:"lifetime",label:"Lifetime spend",kind:"range",get:r=>r.lifetime,minHint:"$0",maxHint:"$10k"},
    {id:"customerSince",label:"Joined date",kind:"dateRange",get:r=>r.customerSince},
  ];

  const SORT_DEFS = {
    name:{get:r=>r.name,type:"str",label:"Name"},
    status:{get:r=>r.status,type:"str",label:"Status"},
    plan:{get:r=>planTier(r.plan),type:"num",label:"Plan tier"},
    cadence:{get:r=>r.cadence,type:"str",label:"Cadence"},
    credits:{get:r=>r.credits,type:"num",label:"Credits"},
    nextRenewal:{get:r=>r.nextRenewal==="—"?null:r.nextRenewal,type:"date",label:"Renewal"},
    bookings:{get:r=>r.bookings,type:"num",label:"Bookings"},
    lifetime:{get:r=>r.lifetime,type:"num",label:"LTV"},
    customerSince:{get:r=>r.customerSince,type:"date",label:"Joined"},
    zip:{get:r=>r.zip,type:"str",label:"ZIP"},
  };

  // Plain click chains by default: clicking a new header appends it as a
  // secondary sort, clicking an active header flips its direction. Removal
  // is via the × on each chip in the sort strip. Shift / ⌘ / Ctrl is still
  // accepted for consistency but no longer required to compose sorts.
  const onSort = (id, _additive) => {
    setSorts(prev => {
      const def = SORT_DEFS[id];
      const idx = prev.findIndex(s=>s.id===id);
      if (idx >= 0){
        const next = [...prev];
        next[idx] = {...next[idx], dir: next[idx].dir==="asc"?"desc":"asc"};
        return next;
      }
      return [...prev, {id, ...def, dir:"asc"}];
    });
  };

  // Apply tab as an implicit filter
  const tabFiltered = statusTab==="All" ? CUSTOMERS : CUSTOMERS.filter(c => c.status===statusTab);
  const filtered = applyFilters(tabFiltered, filters, search, ["name","email","handle","zip","city","plan"]);
  const sorted = applySort(filtered, sorts);

  const updateFacet = (id, patch) => setFilters(prev => prev.map(f => f.id===id ? {...f, ...patch} : f));
  const removeFacet = (id) => setFilters(prev => prev.filter(f => f.id !== id));
  const addFacet = (def) => {
    if (filters.find(f=>f.id===def.id)) return;
    setFilters(prev => [...prev, {...def, value: def.kind==="set"?[]: def.kind==="range"?{}:{}}]);
  };
  const availableToAdd = FACETS.filter(f => !filters.find(x=>x.id===f.id));

  const removeSort = (id) => setSorts(prev => prev.filter(s => s.id !== id));
  const flipSort = (id) => setSorts(prev => prev.map(s => s.id===id ? {...s, dir: s.dir==="asc"?"desc":"asc"} : s));

  return (
    <>
      <div className="kpi-row">
        <div className="kpi"><span className="accent"></span><div className="l">Total customers</div><div className="v">{CUSTOMERS.length}</div><div className="s">{sorted.length} match current view</div></div>
        <div className="kpi"><span className="accent"></span><div className="l">Active subscriptions</div><div className="v blue">{CUSTOMERS.filter(c=>c.plan!=="No Plan"&&c.status==="Active").length}</div><div className="s">On recurring plans</div></div>
        <div className="kpi green"><span className="accent"></span><div className="l">New this month</div><div className="v green">12</div><div className="s">+8 vs last month</div></div>
        <div className="kpi violet"><span className="accent"></span><div className="l">Average LTV</div><div className="v violet">${Math.round(CUSTOMERS.reduce((s,c)=>s+(c.lifetime||0),0)/CUSTOMERS.length).toLocaleString()}</div><div className="s">Across all customers</div></div>
        <div className="kpi amber"><span className="accent"></span><div className="l">Waitlist leads</div><div className="v amber">21</div><div className="s">Potential in queue</div></div>
      </div>

      <div className="table-wrap">
        <div className="fbar">
          <div className="fbar-row">
            <div className="search grow"><I.search /><input placeholder="Search by name, email, ZIP, city…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
            <div className="seg" style={{marginLeft:"auto"}}>
              {["All","Active","Suspended","Inactive"].map(t => (
                <button key={t} className={statusTab===t?"on":""} onClick={()=>setStatusTab(t)}>{t}</button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm"><I.download /> Export ({sorted.length})</button>
          </div>

          <div className="fbar-row">
            {filters.map(f => (
              <FacetChip key={f.id} facet={f} rows={CUSTOMERS}
                onUpdate={patch=>updateFacet(f.id, patch)}
                onRemove={()=>removeFacet(f.id)} />
            ))}
            <AddFacetMenu available={availableToAdd} onAdd={addFacet} />
            {filters.length > 0 && <button className="btn btn-ghost btn-xs" onClick={()=>setFilters([])} style={{color:"var(--muted)"}}>Clear all</button>}
          </div>

          {sorts.length > 0 && (
            <div className="fbar-row">
              <div className="sort-strip">
                <span className="label">Sorted by</span>
                {sorts.map((s,i) => (
                  <div key={s.id} className="sort-chip">
                    <span className="ord">{i+1}</span>
                    <span>{s.label}</span>
                    <span className="arr" onClick={()=>flipSort(s.id)} style={{cursor:"pointer"}}>{s.dir==="asc"?"▲":"▼"}</span>
                    <span className="x" onClick={()=>removeSort(s.id)} style={{cursor:"pointer"}}><I.close /></span>
                  </div>
                ))}
                <button className="btn btn-ghost btn-xs" onClick={()=>setSorts([])} style={{color:"var(--muted)"}}>Clear sort</button>
                <span style={{fontSize:11,color:"var(--muted)",marginLeft:6}}>Click any header to chain · click again to flip · × to remove</span>
              </div>
            </div>
          )}
        </div>

        <table className="tbl">
          <thead><tr>
            <SortHeader id="name" label="Customer" sorts={sorts} onSort={onSort} />
            <SortHeader id="status" label="Status" sorts={sorts} onSort={onSort} />
            <SortHeader id="plan" label="Plan" sorts={sorts} onSort={onSort} />
            <SortHeader id="cadence" label="Cadence" sorts={sorts} onSort={onSort} />
            <SortHeader id="credits" label="Credits" sorts={sorts} onSort={onSort} align="right" />
            <SortHeader id="nextRenewal" label="Renewal" sorts={sorts} onSort={onSort} />
            <SortHeader id="bookings" label="Bookings" sorts={sorts} onSort={onSort} align="right" />
            <SortHeader id="lifetime" label="LTV" sorts={sorts} onSort={onSort} align="right" />
            <SortHeader id="zip" label="ZIP" sorts={sorts} onSort={onSort} />
            <SortHeader id="customerSince" label="Joined" sorts={sorts} onSort={onSort} />
            <th></th>
          </tr></thead>
          <tbody>
            {sorted.map(c => (
              <tr key={c.id} onClick={()=>onQuick(c)}>
                <td><div className="who"><div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${c.color},${shade(c.color,-22)})`}}>{c.initials}</div><div className="meta"><span className="n">{c.name}</span><span className="e">{c.email}</span></div></div></td>
                <td><span className={"pill "+(c.status==="Active"?"pill-green":c.status==="Suspended"?"pill-amber":"pill-grey")+" pill-soft"}><span className={"dot "+(c.status==="Active"?"dot-green":c.status==="Suspended"?"dot-amber":"")} />{c.status}</span></td>
                <td>{c.plan === "No Plan" ? <span className="muted" style={{fontSize:12}}>No plan</span> : <span className="pill pill-blue pill-soft">{c.plan.length>32?c.plan.slice(0,30)+"…":c.plan}</span>}</td>
                <td className="muted" style={{fontSize:12.5}}>{c.cadence}</td>
                <td style={{textAlign:"right"}}><span style={{fontWeight:700,color: c.credits>0?"var(--violet)":"var(--muted)"}}>{c.credits}</span></td>
                <td className="muted" style={{fontSize:12.5}}>{c.nextRenewal}</td>
                <td style={{textAlign:"right",fontWeight:700}}>{c.bookings}</td>
                <td style={{textAlign:"right",fontWeight:700}}>${(c.lifetime||0).toLocaleString()}</td>
                <td className="mono" style={{fontSize:12}}>{c.zip}</td>
                <td className="muted" style={{fontSize:12}}>{c.customerSince}<div style={{fontSize:10.5,color:"var(--muted)",marginTop:1}}>{daysSince(c.customerSince)}d ago</div></td>
                <td><div className="actcell" onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>onQuick(c)}><I.eye /> Quick</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>onOpen(c)}>Profile <I.chev /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="empty-state">
            <div className="em">No customers match this view</div>
            <div style={{fontSize:12.5}}>Try clearing a filter or adjusting the date range.</div>
          </div>
        )}

        <div className="results-meta">
          <span>Showing <b>{sorted.length}</b> of <b>{CUSTOMERS.length}</b> customers</span>
          <span>{sorts.length>1 ? `Sorted by ${sorts.length} columns` : sorts.length===1 ? `Sorted by ${sorts[0].label}` : "Default order"}</span>
        </div>
      </div>
    </>
  );
}

window.CRosterStyles = CRosterStyles;
window.CustRoster = CustRoster;
