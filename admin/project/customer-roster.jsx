// Customer roster — with filter bar + multi-sort + plan-tier-aware sorting
const CRosterStyles = `
.kpi-row5{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:18px}
.results-meta{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-top:1px solid var(--line-2);background:#FAFBFD;font-size:12px;color:var(--muted)}
.results-meta b{color:var(--ink)}

/* Hero answer card. Surfaces when filters narrow the table to a small set
   so admins doing "find me THE X" queries don't have to scroll to row 1. */
.answer-card{display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--line-2);background:linear-gradient(90deg,#EAF1FE,#F8FAFD)}
.answer-card .ac-eyebrow{font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--primary)}
.answer-card .ac-name{font-size:16px;font-weight:700;letter-spacing:-.01em;line-height:1.15;margin-top:2px}
.answer-card .ac-meta{font-size:12.5px;color:var(--muted);margin-top:2px}
.answer-card .ac-stats{display:flex;gap:14px;margin-left:auto;align-items:center}
.answer-card .ac-stat{display:flex;flex-direction:column;align-items:flex-end}
.answer-card .ac-stat .v{font-size:14px;font-weight:700;color:var(--ink);line-height:1.1}
.answer-card .ac-stat .l{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-top:2px}
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
  const [hiddenCols, setHiddenCols] = React.useState([]);
  const [copied, setCopied] = React.useState(false);

  // Toggleable columns. Order matches the table; the action cell at the
  // far right (Quick / Profile buttons) is always visible.
  const COLUMNS = [
    {id:"name",label:"Customer"},
    {id:"status",label:"Status"},
    {id:"plan",label:"Plan"},
    {id:"cadence",label:"Cadence"},
    {id:"credits",label:"Credits"},
    {id:"nextRenewal",label:"Renewal"},
    {id:"bookings",label:"Bookings"},
    {id:"lifetime",label:"LTV"},
    {id:"zip",label:"ZIP"},
    {id:"customerSince",label:"Joined"},
    {id:"actions",label:"Actions"},
  ];
  const showCol = (id) => !hiddenCols.includes(id);

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
  // Pre-baked common queries. Each preset writes the full state at once so
  // a single click takes the user from "blank table" to "the answer to a
  // specific business question". The list is intentionally short -- if you
  // catch yourself adding a sixth, ask whether the existing facets cover
  // the variation instead.
  const today = () => new Date().toISOString().slice(0,10);
  const offsetDays = (n) => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); };
  const facet = (id, value) => ({...FACETS.find(f=>f.id===id), value});
  const sort = (id, dir) => ({id, ...SORT_DEFS[id], dir});
  const PRESETS = [
    {name:"Oldest active sedan VIPs", apply:()=>{
      setStatusTab("Active"); setSearch("");
      setFilters([facet("vehicleClass", ["Sedan","Both"])]);
      setSorts([sort("customerSince","asc"), sort("lifetime","desc")]);
    }},
    {name:"Renewals this week", apply:()=>{
      setStatusTab("All"); setSearch("");
      setFilters([facet("nextRenewalDate", {from: today(), to: offsetDays(7)})]);
      setSorts([sort("nextRenewal","asc")]);
    }},
    {name:"VIPs at risk", apply:()=>{
      setStatusTab("Active"); setSearch("");
      setFilters([
        facet("lifetime", {min: 1000}),
        facet("daysSinceBooking", {min: 30}),
      ]);
      setSorts([sort("lifetime","desc")]);
    }},
    {name:"Reactivation candidates", apply:()=>{
      setStatusTab("Suspended"); setSearch("");
      setFilters([
        facet("lifetime", {min: 500}),
        facet("hasCredits", ["Yes"]),
      ]);
      setSorts([sort("customerSince","asc")]);
    }},
    {name:"New this month", apply:()=>{
      setStatusTab("All"); setSearch("");
      setFilters([facet("customerSince", {from: offsetDays(-30), to: today()})]);
      setSorts([sort("customerSince","desc")]);
    }},
  ];

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
    if (decoded.hiddenCols?.length) setHiddenCols(decoded.hiddenCols);
    hydratedRef.current = true;
  }, []);
  React.useEffect(() => {
    if (!hydratedRef.current) return;
    const h = encodeRosterState({view:"customer-roster", tab:statusTab, search, filters, sorts, hiddenCols});
    if (h !== window.location.hash) window.history.replaceState(null, "", h);
  }, [statusTab, search, filters, sorts, hiddenCols]);

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
          <div className="fbar-row preset-row">
            <span className="fbar-tag" style={{background:"transparent",color:"var(--muted)"}}>Quick views</span>
            {PRESETS.map(p => (
              <button key={p.name} className="preset-chip" onClick={p.apply}><I.zap />{p.name}</button>
            ))}
          </div>
          <div className="fbar-row">
            <div className="search grow"><I.search /><input placeholder="Search by name, email, ZIP, city…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
            <div className="seg" style={{marginLeft:"auto"}}>
              {["All","Active","Suspended","Inactive"].map(t => (
                <button key={t} className={statusTab===t?"on":""} onClick={()=>setStatusTab(t)}>{t}</button>
              ))}
            </div>
            <ColumnsMenu columns={COLUMNS} hidden={hiddenCols} onChange={setHiddenCols} />
            <button className="btn btn-ghost btn-sm" onClick={async()=>{
              await navigator.clipboard.writeText(window.location.href);
              setCopied(true); setTimeout(()=>setCopied(false), 1500);
            }} title="Copy a link that reproduces this exact view"><I.copy /> {copied ? "Copied!" : "Copy link"}</button>
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

        {sorted.length > 0 && sorted.length <= 5 && (filters.length > 0 || statusTab !== "All" || search.trim()) && (
          <div className="answer-card">
            <div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${sorted[0].color},${shade(sorted[0].color,-22)})`}}>{sorted[0].initials}</div>
            <div style={{minWidth:0}}>
              <div className="ac-eyebrow">{sorted.length === 1 ? "Your match" : `Top of ${sorted.length} matches`}{sorts.length ? ` · ranked by ${sorts[0].label}` : ""}</div>
              <div className="ac-name">{sorted[0].name}</div>
              <div className="ac-meta">{sorted[0].plan === "No Plan" ? "No plan" : sorted[0].plan} · joined {sorted[0].customerSince}</div>
            </div>
            <div className="ac-stats">
              <div className="ac-stat"><span className="v">${(sorted[0].lifetime||0).toLocaleString()}</span><span className="l">LTV</span></div>
              <div className="ac-stat"><span className="v">{sorted[0].bookings}</span><span className="l">Bookings</span></div>
              <div className="ac-stat"><span className="v">{sorted[0].credits}</span><span className="l">Credits</span></div>
              <button className="btn btn-primary btn-sm" onClick={()=>onOpen(sorted[0])}>Open profile <I.chev /></button>
            </div>
          </div>
        )}

        <table className="tbl">
          <thead><tr>
            {showCol("name") && <SortHeader id="name" label="Customer" sorts={sorts} onSort={onSort} />}
            {showCol("status") && <SortHeader id="status" label="Status" sorts={sorts} onSort={onSort} />}
            {showCol("plan") && <th>Plan</th>}
            {showCol("cadence") && <SortHeader id="cadence" label="Cadence" sorts={sorts} onSort={onSort} />}
            {showCol("credits") && <SortHeader id="credits" label="Credits" sorts={sorts} onSort={onSort} align="right" />}
            {showCol("nextRenewal") && <SortHeader id="nextRenewal" label="Renewal" sorts={sorts} onSort={onSort} />}
            {showCol("bookings") && <SortHeader id="bookings" label="Bookings" sorts={sorts} onSort={onSort} align="right" />}
            {showCol("lifetime") && <SortHeader id="lifetime" label="LTV" sorts={sorts} onSort={onSort} align="right" />}
            {showCol("zip") && <SortHeader id="zip" label="ZIP" sorts={sorts} onSort={onSort} />}
            {showCol("customerSince") && <SortHeader id="customerSince" label="Joined" sorts={sorts} onSort={onSort} />}
            {showCol("actions") && <th></th>}
          </tr></thead>
          <tbody>
            {sorted.map(c => (
              <tr key={c.id} onClick={()=>onQuick(c)}>
                {showCol("name") && <td><div className="who"><div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${c.color},${shade(c.color,-22)})`}}>{c.initials}</div><div className="meta"><span className="n">{c.name}</span><span className="e">{c.email}</span></div></div></td>}
                {showCol("status") && <td><span className={"pill "+(c.status==="Active"?"pill-green":c.status==="Suspended"?"pill-amber":"pill-grey")+" pill-soft"}><span className={"dot "+(c.status==="Active"?"dot-green":c.status==="Suspended"?"dot-amber":"")} />{c.status}</span></td>}
                {showCol("plan") && <td>{c.plan === "No Plan" ? <span className="muted" style={{fontSize:12}}>No plan</span> : <span className="pill pill-blue pill-soft">{c.plan.length>32?c.plan.slice(0,30)+"…":c.plan}</span>}</td>}
                {showCol("cadence") && <td className="muted" style={{fontSize:12.5}}>{c.plan==="No Plan"?"No plan":c.plan.includes("Bi-Monthly")?"Bi-monthly":c.plan.includes("Monthly")?"Monthly":c.plan.includes("Quarterly")?"Quarterly":"—"}</td>}
                {showCol("credits") && <td style={{textAlign:"right"}}><span style={{fontWeight:700,color: c.credits>0?"var(--violet)":"var(--muted)"}}>{c.credits}</span></td>}
                {showCol("nextRenewal") && <td className="muted" style={{fontSize:12.5}}>{c.nextRenewal}</td>}
                {showCol("bookings") && <td style={{textAlign:"right",fontWeight:700}}>{c.bookings}</td>}
                {showCol("lifetime") && <td style={{textAlign:"right",fontWeight:700}}>${(c.lifetime||0).toLocaleString()}</td>}
                {showCol("zip") && <td className="mono" style={{fontSize:12}}>{c.zip}</td>}
                {showCol("customerSince") && <td className="muted" style={{fontSize:12}}>{c.customerSince}<div style={{fontSize:10.5,color:"var(--muted)",marginTop:1}}>{daysSince(c.customerSince)}d ago</div></td>}
                {showCol("actions") && <td><div className="actcell" onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>onQuick(c)}><I.eye /> Quick</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>onOpen(c)}>Profile <I.chev /></button>
                </div></td>}
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
