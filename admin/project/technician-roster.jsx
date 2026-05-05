// Technician roster (list view) — entrypoint for quick-glance + full profile
const RosterStyles = `
.kpi-row{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:18px}
.kpi{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px 16px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden}
.kpi .l{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;display:flex;align-items:center;gap:6px}
.kpi .v{font-size:30px;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin-top:8px;color:var(--ink)}
.kpi .v.blue{color:var(--primary)}
.kpi .v.amber{color:var(--amber)}
.kpi .v.green{color:var(--green)}
.kpi .v.violet{color:var(--violet)}
.kpi .s{font-size:12px;color:var(--muted);margin-top:4px}
.kpi .accent{position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--primary)}
.kpi.green .accent{background:var(--green)}
.kpi.amber .accent{background:var(--amber)}
.kpi.violet .accent{background:var(--violet)}
.kpi.red .accent{background:var(--red)}

.tab-row{display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap}
.tab-chip{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:99px;border:1px solid var(--line);background:#fff;font-size:12.5px;font-weight:600;color:var(--ink-2);cursor:pointer}
.tab-chip.active{background:var(--primary-50);color:var(--primary);border-color:#cfdcfb}
.tab-chip .n{background:#EEF1F6;color:#4B5A75;font-size:10.5px;padding:1px 6px;border-radius:99px}
.tab-chip.active .n{background:#fff;color:var(--primary)}

.table-wrap{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm)}
.table-tools{display:flex;align-items:center;gap:10px;padding:14px}
.table-tools .filters{margin-left:auto;display:flex;gap:6px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.seg button{height:30px;padding:0 12px;border:0;background:#fff;font-size:12.5px;font-weight:600;color:var(--ink-2);cursor:pointer}
.seg button.on{background:var(--primary-50);color:var(--primary)}

.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl thead th{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.07em;text-transform:uppercase;padding:10px 14px;background:#FAFBFD;border-top:1px solid var(--line-2);border-bottom:1px solid var(--line-2);text-align:left;white-space:nowrap}
.tbl tbody td{padding:12px 14px;border-bottom:1px solid var(--line-2);vertical-align:middle}
.tbl tbody tr{cursor:pointer;transition:background .1s}
.tbl tbody tr:hover{background:#F8FAFD}
.tbl .who{display:flex;align-items:center;gap:10px}
.tbl .who .meta{display:flex;flex-direction:column;line-height:1.2}
.tbl .who .meta .n{font-weight:600;color:var(--primary)}
.tbl .who .meta .e{font-size:11.5px;color:var(--muted)}
.tbl .ob{display:flex;align-items:center;gap:8px;min-width:130px}
.tbl .ob .bar{flex:1;height:5px;background:#EEF1F6;border-radius:99px;overflow:hidden}
.tbl .ob .bar > div{height:100%;background:var(--primary);border-radius:99px}
.tbl .ob .pct{font-size:11px;color:var(--ink-2);font-weight:700;min-width:34px;text-align:right}
.tbl .actcell{display:flex;gap:6px;justify-content:flex-end;align-items:center}
.tbl .pay-tier{font-size:11px;font-weight:700;letter-spacing:.05em}
.tbl .pay-tier .next{display:block;font-size:10px;font-weight:500;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-top:1px}
`;

function TechRoster({ onQuick, onOpen }){
  const [filter, setFilter] = React.useState("All");
  const [tab, setTab] = React.useState("Roster");
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState([]);
  const [sorts, setSorts] = React.useState([{id:"joined", get:r=>r.joined, type:"date", dir:"desc", label:"Joined"}]);

  const FACETS = [
    // Status & onboarding
    {group:"Status & onboarding",id:"status",label:"Status",kind:"set",get:r=>r.status,options:["Active","Pending","Inactive"]},
    {group:"Status & onboarding",id:"type",label:"Type",kind:"set",get:r=>r.type,options:["Certified","Independent"]},
    {group:"Status & onboarding",id:"bgCheck",label:"BG check",kind:"set",get:r=>r.bgCheck,options:["Confirmed","Incomplete"]},
    {group:"Status & onboarding",id:"onboarding",label:"Onboarding %",kind:"range",get:r=>r.onboarding,minHint:"0",maxHint:"100"},
    // Performance
    {group:"Performance",id:"rating",label:"Rating",kind:"range",get:r=>r.rating,minHint:"0",maxHint:"5"},
    {group:"Performance",id:"monthlyJobs",label:"Monthly jobs",kind:"range",get:r=>r.monthlyJobs,minHint:"0",maxHint:"50"},
    {group:"Performance",id:"lifetimeJobs",label:"Lifetime jobs",kind:"range",get:r=>r.lifetimeJobs,minHint:"0",maxHint:"500"},
    // Pay & geography
    {group:"Pay & geography",id:"tier",label:"Pay tier",kind:"set",get:r=>r.tier,options:[...new Set(TECHS.map(t=>t.tier))]},
    {group:"Pay & geography",id:"baseZip",label:"Base ZIP",kind:"set",get:r=>r.baseZip,options:[...new Set(TECHS.map(t=>t.baseZip))].sort()},
    // Time
    {group:"Time",id:"joined",label:"Joined date",kind:"dateRange",get:r=>r.joined},
  ];

  const SORT_DEFS = {
    handle:{get:r=>r.handle,type:"str",label:"Technician"},
    type:{get:r=>r.type,type:"str",label:"Type"},
    onboarding:{get:r=>r.onboarding,type:"num",label:"Onboarding"},
    status:{get:r=>r.status,type:"str",label:"Status"},
    bgCheck:{get:r=>r.bgCheck,type:"str",label:"BG check"},
    monthlyJobs:{get:r=>r.monthlyJobs,type:"num",label:"Monthly"},
    lifetimeJobs:{get:r=>r.lifetimeJobs,type:"num",label:"Lifetime"},
    tier:{get:r=>r.tier,type:"str",label:"Pay tier"},
    joined:{get:r=>r.joined,type:"date",label:"Joined"},
    rating:{get:r=>r.rating||0,type:"num",label:"Rating"},
  };

  // Plain click chains by default; see customer-roster for the full rationale.
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
  const removeSort = (id) => setSorts(prev => prev.filter(s => s.id !== id));
  const flipSort = (id) => setSorts(prev => prev.map(s => s.id===id ? {...s, dir: s.dir==="asc"?"desc":"asc"} : s));
  const promoteSort = (id) => setSorts(prev => {
    const i = prev.findIndex(s => s.id === id);
    if (i <= 0) return prev;
    return [prev[i], ...prev.slice(0,i), ...prev.slice(i+1)];
  });

  const updateFacet = (id, patch) => setFilters(prev => prev.map(f => f.id===id ? {...f, ...patch} : f));
  const removeFacet = (id) => setFilters(prev => prev.filter(f => f.id !== id));
  const addFacet = (def) => {
    if (filters.find(f=>f.id===def.id)) return;
    setFilters(prev => [...prev, {...def, value: def.kind==="set"?[]: def.kind==="range"?{}:{}}]);
  };
  const availableToAdd = FACETS.filter(f => !filters.find(x=>x.id===f.id));

  const SEARCH_FIELDS = ["name","email","handle","baseZip","tier"];
  const segFiltered = TECHS.filter(t => filter==="All" || t.type === filter);
  const filtered = applyFilters(segFiltered, filters, search, SEARCH_FIELDS);
  const techs = applySort(filtered, sorts);

  const hydratedRef = React.useRef(false);
  React.useEffect(() => {
    const decoded = decodeRosterState(window.location.hash, FACETS, SORT_DEFS);
    if (decoded.view && decoded.view !== "technician-roster"){ hydratedRef.current = true; return; }
    if (decoded.tab && decoded.tab !== "All") setFilter(decoded.tab);
    if (decoded.search) setSearch(decoded.search);
    if (decoded.filters?.length) setFilters(decoded.filters);
    if (decoded.sorts) setSorts(decoded.sorts);
    hydratedRef.current = true;
  }, []);
  React.useEffect(() => {
    if (!hydratedRef.current) return;
    const h = encodeRosterState({view:"technician-roster", tab:filter, search, filters, sorts});
    if (h !== window.location.hash) window.history.replaceState(null, "", h);
  }, [filter, search, filters, sorts]);

  const suggestion = React.useMemo(() => {
    if (techs.length > 0) return null;
    const candidates = [];
    if (filter !== "All") candidates.push({label:`type "${filter}"`, action:()=>setFilter("All"), count: applyFilters(TECHS, filters, search, SEARCH_FIELDS).length});
    if (search.trim()) candidates.push({label:`search "${search}"`, action:()=>setSearch(""), count: applyFilters(segFiltered, filters, "", SEARCH_FIELDS).length});
    for (const f of filters){
      const without = filters.filter(x => x.id !== f.id);
      candidates.push({label:f.label, action:()=>setFilters(prev=>prev.filter(x=>x.id!==f.id)), count: applyFilters(segFiltered, without, search, SEARCH_FIELDS).length});
    }
    candidates.sort((a,b) => b.count - a.count);
    return candidates[0]?.count > 0 ? candidates[0] : null;
  }, [techs.length, filters, search, filter]);
  return (
    <>
      <div className="kpi-row">
        <div className="kpi"><span className="accent"></span><div className="l">Total Technicians</div><div className="v">38</div><div className="s">16 certified · 22 independent</div></div>
        <div className="kpi"><span className="accent"></span><div className="l">Scheduled bookings</div><div className="v blue">25</div><div className="s">Platform total</div></div>
        <div className="kpi green"><span className="accent"></span><div className="l">Open flags</div><div className="v green">0</div><div className="s">All clear</div></div>
        <div className="kpi amber"><span className="accent"></span><div className="l">Below 45h peak hours</div><div className="v amber">1</div><div className="s">Low-availability alert</div></div>
        <div className="kpi violet"><span className="accent"></span><div className="l">Supply requests</div><div className="v violet">1</div><div className="s">Pending approval</div></div>
      </div>

      <div className="tab-row">
        {[["Roster",18],["Flagged Washes",2],["Supply Requests",1],["Availability Monitor",4],["ZIP Coverage",31],["Peak Hours",null]].map(([k,n]) => (
          <div key={k} className={"tab-chip"+(tab===k?" active":"")} onClick={()=>setTab(k)}>
            {k}{n!=null && <span className="n">{n}</span>}
          </div>
        ))}
      </div>

      <div className="table-wrap">
        <div className="fbar">
          <div className="fbar-row">
            <div className="search grow"><I.search /><input placeholder="Search by name, email, handle, ZIP, tier…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
            <div className="seg" style={{marginLeft:"auto"}}>
              {["All","Certified","Independent"].map(f => (
                <button key={f} className={filter===f?"on":""} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm"><I.download /> Export ({techs.length})</button>
            <button className="btn btn-ghost btn-sm"><I.car /> Show Vehicles</button>
          </div>

          <div className="fbar-row">
            <span className="fbar-tag">Narrow</span>
            {filters.map(f => (
              <FacetChip key={f.id} facet={f} rows={TECHS}
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
          <thead>
            <tr>
              <SortHeader id="handle" label="Technician" sorts={sorts} onSort={onSort} />
              <SortHeader id="type" label="Type" sorts={sorts} onSort={onSort} />
              <SortHeader id="onboarding" label="Onboarding" sorts={sorts} onSort={onSort} />
              <SortHeader id="status" label="Status" sorts={sorts} onSort={onSort} />
              <th>Activation</th>
              <SortHeader id="bgCheck" label="BG check" sorts={sorts} onSort={onSort} />
              <SortHeader id="monthlyJobs" label="Monthly" sorts={sorts} onSort={onSort} align="right" />
              <SortHeader id="lifetimeJobs" label="Lifetime" sorts={sorts} onSort={onSort} align="right" />
              <SortHeader id="tier" label="Pay tier" sorts={sorts} onSort={onSort} />
              <SortHeader id="joined" label="Joined" sorts={sorts} onSort={onSort} />
              <SortHeader id="rating" label="Rating" sorts={sorts} onSort={onSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {techs.map(t => (
              <tr key={t.id} onClick={()=>onQuick(t)}>
                <td>
                  <div className="who">
                    <div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${t.color},${shade(t.color,-22)})`}}>{t.initials}</div>
                    <div className="meta"><span className="n">{t.handle}</span><span className="e">{t.email} · {t.baseZip}</span></div>
                  </div>
                </td>
                <td><span className={"pill "+(t.type==="Certified"?"pill-cyan":"pill-grey")}>{t.type}</span></td>
                <td>
                  <div className="ob">
                    <div className="pct">{t.onboarding}%</div>
                    <div className="bar"><div style={{width:`${t.onboarding}%`}} /></div>
                  </div>
                </td>
                <td><span className={"pill "+(t.status==="Active"?"pill-green":t.status==="Pending"?"pill-amber":"pill-grey")}><span className={"dot "+(t.status==="Active"?"dot-green":t.status==="Pending"?"dot-amber":"")} />{t.status}</span></td>
                <td>{t.status==="Active" ? <button className="btn btn-ghost btn-xs" onClick={e=>e.stopPropagation()}>Deactivate</button> : <button className="btn btn-ghost btn-xs" onClick={e=>e.stopPropagation()}>Activate</button>}</td>
                <td><span className={"pill "+(t.bgCheck==="Confirmed"?"pill-green":"pill-grey")}>{t.bgCheck}</span></td>
                <td style={{textAlign:"right",fontWeight:700}}>{t.monthlyJobs}</td>
                <td style={{textAlign:"right",fontWeight:700}}>{t.lifetimeJobs}</td>
                <td>
                  <div className="pay-tier" style={{color: t.tier==="Tier 3"?"#0F7A4E": t.tier==="Tier 1"?"#13499F":"var(--muted)"}}>
                    {t.tier} · ${t.payRate}<span className="next">{t.tier==="Tier 3"?"Top tier":"Promo to next"}</span>
                  </div>
                </td>
                <td className="muted" style={{fontSize:12}}>{t.joined}</td>
                <td>{t.rating ? <span style={{display:"inline-flex",alignItems:"center",gap:4,fontWeight:700,color:"#E29411"}}><I.star /> {t.rating.toFixed(1)}</span> : <span className="muted" style={{fontSize:11}}>No reviews</span>}</td>
                <td>
                  <div className="actcell" onClick={e=>e.stopPropagation()}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>onQuick(t)}><I.eye /> Quick</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>onOpen(t)}>Profile <I.chev /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {techs.length === 0 && (
          <div className="empty-state">
            <div className="em">No technicians match this view</div>
            {suggestion ? (
              <div style={{fontSize:12.5}}>
                Try removing <b>{suggestion.label}</b> · would show <b>{suggestion.count}</b> technician{suggestion.count===1?"":"s"}{" "}
                <button className="btn btn-ghost btn-xs" onClick={suggestion.action} style={{marginLeft:6}}>Remove</button>
              </div>
            ) : (
              <div style={{fontSize:12.5}}>Try clearing a filter or adjusting the date range.</div>
            )}
          </div>
        )}

        <div className="results-meta">
          <span>Showing <b>{techs.length}</b> of <b>{TECHS.length}</b> technicians</span>
          <span>{sorts.length>1 ? `Sorted by ${sorts.length} columns` : sorts.length===1 ? `Sorted by ${sorts[0].label}` : "Default order"}</span>
        </div>
      </div>
    </>
  );
}

window.RosterStyles = RosterStyles;
window.TechRoster = TechRoster;
