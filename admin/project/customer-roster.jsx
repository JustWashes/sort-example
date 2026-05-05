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

  // Build the Plan type options dynamically from real customer data so we
  // never list a product nobody holds. The full taxonomy is Vehicle ×
  // Cadence; in the seed data only Bi-monthly + Quarterly variants exist.
  const PLAN_TYPE_OPTIONS = React.useMemo(() => {
    const seen = new Set();
    for (const c of CUSTOMERS) for (const t of planTypesOf(c.plan)) seen.add(t);
    return [...seen].sort();
  }, []);

  const FACETS = [
    // Subscription
    {group:"Subscription",id:"planType",label:"Plan type",kind:"set",get:r=>planTypesOf(r.plan),options:PLAN_TYPE_OPTIONS},
    {group:"Subscription",id:"vehicleClass",label:"Vehicle class",kind:"set",get:r=>vehicleClassOf(r.plan),options:["Sedan","Large SUV","Both","None"]},
    {group:"Subscription",id:"cadence",label:"Cadence",kind:"set",get:r=>r.plan==="No Plan"?"No plan":r.plan.includes("Monthly")&&!r.plan.includes("Bi-")?"Monthly":r.plan.includes("Bi-Monthly")?"Bi-monthly":r.plan.includes("Quarterly")?"Quarterly":"Other",options:["No plan","Quarterly","Bi-monthly","Monthly"]},
    {group:"Subscription",id:"hasCredits",label:"Has credits",kind:"set",get:r=>r.credits>0?"Yes":"No",options:["Yes","No"]},
    // Status & activity
    {group:"Status & activity",id:"status",label:"Status",kind:"set",get:r=>r.status,options:["Active","Suspended","Inactive"]},
    {group:"Status & activity",id:"hasDisputes",label:"Has disputes",kind:"set",get:r=>(r.disputesLog?.length||r.disputes||0)>0?"Yes":"No",options:["Yes","No"]},
    {group:"Status & activity",id:"daysSinceBooking",label:"Days since last booking",kind:"range",get:r=>daysSinceLastBooking(r),minHint:"0",maxHint:"365"},
    {group:"Status & activity",id:"bookings",label:"Bookings",kind:"range",get:r=>r.bookings,minHint:"0",maxHint:"100"},
    // Money
    {group:"Money",id:"lifetime",label:"Lifetime spend",kind:"range",get:r=>r.lifetime,minHint:"$0",maxHint:"$10k"},
    {group:"Money",id:"credits",label:"Credits",kind:"range",get:r=>r.credits,minHint:"0",maxHint:"20"},
    // Geography
    {group:"Geography",id:"zip",label:"ZIP",kind:"set",get:r=>r.zip,options:[...new Set(CUSTOMERS.map(c=>c.zip))].sort()},
    {group:"Geography",id:"city",label:"City",kind:"set",get:r=>r.city,options:[...new Set(CUSTOMERS.map(c=>c.city))].sort()},
    // Time
    {group:"Time",id:"customerSince",label:"Joined date",kind:"dateRange",get:r=>r.customerSince},
    {group:"Time",id:"nextRenewalDate",label:"Renewal date",kind:"dateRange",get:r=>r.nextRenewal==="—"?null:r.nextRenewal},
  ];

  const SORT_DEFS = {
    name:{get:r=>r.name,type:"str",label:"Name"},
    status:{get:r=>r.status,type:"str",label:"Status"},
    cadence:{get:r=>planTier(r.plan),type:"num",label:"Cadence"},
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
  const SEARCH_FIELDS = ["name","email","handle","zip","city","plan"];
  const tabFiltered = statusTab==="All" ? CUSTOMERS : CUSTOMERS.filter(c => c.status===statusTab);
  const filtered = applyFilters(tabFiltered, filters, search, SEARCH_FIELDS);
  const sorted = applySort(filtered, sorts);

  // When the user has filtered themselves into an empty result, find the
  // single filter whose removal would unblock the most rows. Cheap because
  // we only compute it when the table is empty.
  // URL hash sync. Read once on mount so a shared link hydrates the table;
  // write on every state change so the URL always reflects what the user is
  // looking at and they can copy-paste at any moment.
  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    const decoded = decodeRosterState(window.location.hash, FACETS, SORT_DEFS);
    if (decoded.view && decoded.view !== "customer-roster"){ hydratedRef.current = true; return; }
    if (decoded.tab) setStatusTab(decoded.tab);
    if (decoded.search) setSearch(decoded.search);
    if (decoded.filters?.length) setFilters(decoded.filters);
    if (decoded.sorts) setSorts(decoded.sorts);
    hydratedRef.current = true;
  }, []);
  React.useEffect(() => {
    if (!hydratedRef.current) return;
    const h = encodeRosterState({view:"customer-roster", tab:statusTab, search, filters, sorts});
    if (h !== window.location.hash) window.history.replaceState(null, "", h);
  }, [statusTab, search, filters, sorts]);

  const suggestion = React.useMemo(() => {
    if (sorted.length > 0) return null;
    const candidates = [];
    if (statusTab !== "All") candidates.push({label:`status tab "${statusTab}"`, action:()=>setStatusTab("All"), count: applyFilters(CUSTOMERS, filters, search, SEARCH_FIELDS).length});
    if (search.trim()) candidates.push({label:`search "${search}"`, action:()=>setSearch(""), count: applyFilters(tabFiltered, filters, "", SEARCH_FIELDS).length});
    for (const f of filters){
      const without = filters.filter(x => x.id !== f.id);
      candidates.push({label:f.label, action:()=>setFilters(prev=>prev.filter(x=>x.id!==f.id)), count: applyFilters(tabFiltered, without, search, SEARCH_FIELDS).length});
    }
    candidates.sort((a,b) => b.count - a.count);
    return candidates[0]?.count > 0 ? candidates[0] : null;
  }, [sorted.length, filters, search, statusTab]);

  const updateFacet = (id, patch) => setFilters(prev => prev.map(f => f.id===id ? {...f, ...patch} : f));
  const removeFacet = (id) => setFilters(prev => prev.filter(f => f.id !== id));
  const addFacet = (def) => {
    if (filters.find(f=>f.id===def.id)) return;
    setFilters(prev => [...prev, {...def, value: def.kind==="set"?[]: def.kind==="range"?{}:{}}]);
  };
  const availableToAdd = FACETS.filter(f => !filters.find(x=>x.id===f.id));

  const removeSort = (id) => setSorts(prev => prev.filter(s => s.id !== id));
  const flipSort = (id) => setSorts(prev => prev.map(s => s.id===id ? {...s, dir: s.dir==="asc"?"desc":"asc"} : s));
  // Move a sort key to position 1 so the user can re-rank without rebuilding
  // the whole stack from scratch.
  const promoteSort = (id) => setSorts(prev => {
    const i = prev.findIndex(s => s.id === id);
    if (i <= 0) return prev;
    return [prev[i], ...prev.slice(0,i), ...prev.slice(i+1)];
  });

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
            <span className="fbar-tag">Narrow</span>
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
              <span className="fbar-tag rank">Rank</span>
              <div className="sort-strip">
                {sorts.map((s,i) => (
                  <div key={s.id} className={"sort-chip"+(i===0?" primary":"")} onClick={()=>promoteSort(s.id)} title={i===0?"Primary sort":"Click to make primary"} style={{cursor:i===0?"default":"pointer"}}>
                    <span className="ord">{i+1}</span>
                    <span>{s.label}</span>
                    <span className="arr" onClick={e=>{e.stopPropagation();flipSort(s.id);}} style={{cursor:"pointer"}} title={`Flip to ${s.dir==="asc"?"desc":"asc"}`}>{s.dir==="asc"?"▲":"▼"}</span>
                    <span className="x" onClick={e=>{e.stopPropagation();removeSort(s.id);}} style={{cursor:"pointer"}} title="Remove"><I.close /></span>
                  </div>
                ))}
                <button className="btn btn-ghost btn-xs" onClick={()=>setSorts([])} style={{color:"var(--muted)"}}>Clear sort</button>
                <span style={{fontSize:11,color:"var(--muted)",marginLeft:6}}>Click header to chain · click chip to make primary · ▲▼ flip · × remove</span>
              </div>
            </div>
          )}
        </div>

        <table className="tbl">
          <thead><tr>
            <SortHeader id="name" label="Customer" sorts={sorts} onSort={onSort} />
            <SortHeader id="status" label="Status" sorts={sorts} onSort={onSort} />
            <th>Plan</th>
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
                <td className="muted" style={{fontSize:12.5}}>{c.plan==="No Plan"?"No plan":c.plan.includes("Bi-Monthly")?"Bi-monthly":c.plan.includes("Monthly")?"Monthly":c.plan.includes("Quarterly")?"Quarterly":"—"}</td>
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
            {suggestion ? (
              <div style={{fontSize:12.5}}>
                Try removing <b>{suggestion.label}</b> · would show <b>{suggestion.count}</b> customer{suggestion.count===1?"":"s"}{" "}
                <button className="btn btn-ghost btn-xs" onClick={suggestion.action} style={{marginLeft:6}}>Remove</button>
              </div>
            ) : (
              <div style={{fontSize:12.5}}>Try clearing a filter or adjusting the date range.</div>
            )}
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
