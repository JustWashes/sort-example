// Reusable filter + multi-sort table toolbar.
// Lets users:
//   • free-text search
//   • build faceted filter chips (Status, Plan tier, ZIP, etc.) with type-aware editors
//     - text/multiselect for enums and ZIPs
//     - range for numerics (Bookings, Credits, Lifetime, Days as customer)
//     - date range for joined / renewal
//   • multi-sort: shift-click headers to add secondary/tertiary sorts; chip strip shows order

const FilterBarStyles = `
.fbar{display:flex;flex-direction:column;gap:10px;padding:14px 14px 12px;border-bottom:1px solid var(--line-2)}
.fbar-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.fbar-row .grow{flex:1;min-width:240px;max-width:420px}
.facet-add{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border-radius:99px;border:1px dashed #C5CFE0;background:#fff;font-size:12.5px;font-weight:600;color:var(--ink-2);cursor:pointer}
.facet-add:hover{border-color:var(--primary);color:var(--primary)}
.facet-chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 4px 0 10px;border-radius:99px;background:#fff;border:1px solid var(--line);font-size:12.5px;font-weight:600;color:var(--ink-2);cursor:pointer;position:relative}
.facet-chip:hover{border-color:#C5CFE0}
.facet-chip .label{color:var(--muted);font-weight:600}
.facet-chip .val{color:var(--ink);font-weight:700}
.facet-chip .val.empty{color:var(--muted);font-weight:500;font-style:italic}
.facet-chip .x{width:20px;height:20px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;background:#EEF1F6;color:var(--ink-2)}
.facet-chip .x:hover{background:#E0E5EE}
.facet-chip.live{border-color:var(--primary);background:var(--primary-50);color:var(--primary)}
.facet-chip.live .label{color:var(--primary)}
.facet-chip.live .val{color:var(--primary)}

.pop{position:absolute;top:36px;left:0;background:#fff;border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow-lg);min-width:240px;z-index:50;padding:8px}
.pop-search{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#F4F6FB;border-radius:8px;font-size:12.5px;color:var(--muted);margin-bottom:6px}
.pop-search input{border:0;outline:0;background:transparent;flex:1;font:inherit;color:var(--ink)}
.pop-list{max-height:240px;overflow:auto}
.pop-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:7px;font-size:13px;cursor:pointer}
.pop-item:hover{background:#F4F6FB}
.pop-item .cb{width:14px;height:14px;border-radius:4px;border:1.5px solid #C5CFE0;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.pop-item.checked .cb{background:var(--primary);border-color:var(--primary);color:#fff}
.pop-item .count{margin-left:auto;font-size:11px;color:var(--muted);font-weight:600}
.pop-foot{display:flex;justify-content:space-between;padding:6px 4px 0;margin-top:4px;border-top:1px solid var(--line-2)}
.pop-foot button{font-size:11.5px;font-weight:600;color:var(--muted);background:transparent;border:0;cursor:pointer;padding:6px 6px}
.pop-foot button:hover{color:var(--ink)}
.pop-foot button.apply{color:var(--primary)}
.range-inputs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.range-inputs input{height:32px;padding:0 10px;border:1px solid var(--line);border-radius:8px;font:inherit;color:var(--ink);font-size:12.5px;width:100%}
.range-inputs input:focus{outline:0;border-color:var(--primary)}
.range-inputs label{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;display:block;margin-bottom:4px}

/* Filter / rank row labels: small uppercase tag on the left of each
   composing row so users can see at-a-glance that *narrow* and *rank* are
   different operations. */
.fbar-tag{display:inline-flex;align-items:center;height:26px;padding:0 8px;border-radius:6px;background:#EEF1F6;color:var(--ink-2);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;flex-shrink:0;margin-right:4px}
.fbar-tag.rank{background:var(--primary-50);color:var(--primary)}

/* Preset (Quick view) chips. Sit above the filter rows; each one applies a
   pre-baked combination of filters + sort. */
.preset-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.preset-chip{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:99px;background:#fff;border:1px solid var(--line);font-size:12px;font-weight:600;color:var(--ink-2);cursor:pointer}
.preset-chip:hover{border-color:var(--primary);color:var(--primary);background:#F8FAFD}
.preset-chip svg{width:12px;height:12px}

/* Sort chip strip */
.sort-strip{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.sort-strip .label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.07em;text-transform:uppercase;margin-right:2px}
.sort-chip{display:inline-flex;align-items:center;gap:5px;height:26px;padding:0 4px 0 8px;border-radius:7px;background:#fff;border:1px solid var(--line);font-size:11.5px;font-weight:700;color:var(--ink-2);cursor:pointer}
.sort-chip:hover{border-color:#C5CFE0;background:#F8FAFD}
.sort-chip.primary{background:var(--primary-50);border-color:#cfdcfb;color:var(--primary)}
.sort-chip.primary:hover{background:var(--primary-50)}
.sort-chip.primary .ord{background:var(--primary);color:#fff}
.sort-chip .ord{width:14px;height:14px;border-radius:99px;background:#EEF1F6;color:var(--ink-2);font-size:9px;font-weight:800;display:inline-flex;align-items:center;justify-content:center}
.sort-chip .arr{font-size:11px}
.sort-chip .x{width:18px;height:18px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;color:var(--muted)}
.sort-chip .x:hover{background:#EEF1F6}

/* Sortable header */
th.sort{cursor:pointer;user-select:none;position:relative;white-space:nowrap}
th.sort:hover{color:var(--ink-2)}
th.sort .sort-label{display:inline-flex;align-items:center;gap:4px}
th.sort .sort-ind{display:inline-flex;align-items:center;gap:3px;margin-left:6px;color:var(--muted);font-size:9px}
th.sort.active{color:var(--primary)}
th.sort.active .sort-ind{color:var(--primary)}
th.sort .ord{display:inline-block;width:12px;height:12px;border-radius:99px;background:var(--primary);color:#fff;font-size:8px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;margin-left:3px}
th.sort .sort-add{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;margin-left:4px;border-radius:99px;background:#fff;border:1px dashed #C5CFE0;color:var(--muted);font-size:11px;font-weight:700;line-height:1;opacity:0;transition:opacity .12s,background .1s,color .1s,border-color .1s}
th.sort:hover .sort-add{opacity:1}
th.sort .sort-add:hover{background:var(--primary-50);color:var(--primary);border-color:var(--primary);border-style:solid}

.empty-state{padding:48px 20px;text-align:center;color:var(--muted)}
.empty-state .em{font-size:14px;font-weight:600;color:var(--ink-2);margin-bottom:4px}
`;

// Compare two values for sort
function compareVal(a, b, type){
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (type === "num") return a - b;
  if (type === "date") return new Date(a) - new Date(b);
  return String(a).localeCompare(String(b));
}

// Apply chained sort
function applySort(rows, sorts){
  if (!sorts.length) return rows;
  return [...rows].sort((ra, rb) => {
    for (const s of sorts){
      const c = compareVal(s.get(ra), s.get(rb), s.type);
      if (c !== 0) return s.dir === "desc" ? -c : c;
    }
    return 0;
  });
}

// Apply filters — every chip is conjunctive (AND-ed). A chip is "active" when
// its value is non-empty; an empty chip is a no-op so users can drop one in,
// see all rows, then dial it in without it freezing the table to nothing.
function applyFilters(rows, filters, search, searchFields){
  let out = rows;
  if (search && search.trim()){
    const q = search.toLowerCase();
    out = out.filter(r => searchFields.some(k => String(r[k]||"").toLowerCase().includes(q)));
  }
  for (const f of filters){
    if (f.kind === "set"){
      if (!f.value || !f.value.length) continue;
      out = out.filter(r => {
        const v = f.get(r);
        // Array-valued getters (e.g. a customer's set of plan products) match
        // when ANY held value is in the user's selection. This is what makes
        // "show me anyone with a Sedan Bi-monthly subscription" Just Work for
        // customers who hold combo plans.
        if (Array.isArray(v)) return v.some(x => f.value.includes(x));
        return f.value.includes(v);
      });
    } else if (f.kind === "range"){
      const {min, max} = (f.value || {});
      if (min == null && max == null) continue;
      out = out.filter(r => {
        const v = f.get(r);
        if (v == null) return false;
        if (min != null && v < min) return false;
        if (max != null && v > max) return false;
        return true;
      });
    } else if (f.kind === "dateRange"){
      const {from, to} = (f.value || {});
      if (!from && !to) continue;
      out = out.filter(r => {
        const v = f.get(r);
        if (!v) return false;
        const d = new Date(v).getTime();
        if (from && d < new Date(from).getTime()) return false;
        if (to && d > new Date(to).getTime()) return false;
        return true;
      });
    }
  }
  return out;
}

// SetFilterPopover — checkbox list with search
function SetPopover({ facet, rows, onChange, onClose }){
  const [q, setQ] = React.useState("");
  const [draft, setDraft] = React.useState(facet.value || []);
  const counts = React.useMemo(() => {
    const m = {};
    for (const r of rows){
      const v = facet.get(r);
      if (v == null) continue;
      // Array-valued getters tally each held value once per row.
      if (Array.isArray(v)) for (const x of v) m[x] = (m[x]||0)+1;
      else m[v] = (m[v]||0)+1;
    }
    return m;
  }, [rows]);
  // Hide options that match zero rows -- they have no effect on the filter
  // and reading 'Monthly (0)' alongside real choices was misleading users
  // into picking dead options. A user-selected option is always kept visible
  // so they can deselect it even if their other filters dropped its count
  // to zero.
  const opts = (facet.options || Object.keys(counts))
    .filter(o => (counts[o] || 0) > 0 || (facet.value || []).includes(o))
    .filter(o => o.toLowerCase().includes(q.toLowerCase()));
  const toggle = (o) => setDraft(d => d.includes(o) ? d.filter(x=>x!==o) : [...d, o]);
  return (
    <div className="pop" onClick={e=>e.stopPropagation()}>
      <div className="pop-search"><I.search /><input autoFocus placeholder={`Search ${facet.label.toLowerCase()}…`} value={q} onChange={e=>setQ(e.target.value)} /></div>
      <div className="pop-list">
        {opts.map(o => (
          <div key={o} className={"pop-item"+(draft.includes(o)?" checked":"")} onClick={()=>toggle(o)}>
            <span className="cb">{draft.includes(o) && <I.check />}</span>
            <span>{o}</span>
            <span className="count">{counts[o]||0}</span>
          </div>
        ))}
        {!opts.length && <div className="muted" style={{padding:8,fontSize:12}}>No matches</div>}
      </div>
      <div className="pop-foot">
        <button onClick={()=>{onChange([]); onClose();}}>Clear</button>
        <button className="apply" onClick={()=>{onChange(draft); onClose();}}>Apply ({draft.length})</button>
      </div>
    </div>
  );
}

function RangePopover({ facet, onChange, onClose }){
  const [v, setV] = React.useState(facet.value || {});
  return (
    <div className="pop" onClick={e=>e.stopPropagation()} style={{minWidth:240}}>
      <div className="range-inputs">
        <div><label>Min</label><input type="number" value={v.min ?? ""} onChange={e=>setV(s=>({...s,min:e.target.value===""?undefined:Number(e.target.value)}))} placeholder={facet.minHint||"any"} /></div>
        <div><label>Max</label><input type="number" value={v.max ?? ""} onChange={e=>setV(s=>({...s,max:e.target.value===""?undefined:Number(e.target.value)}))} placeholder={facet.maxHint||"any"} /></div>
      </div>
      <div className="pop-foot">
        <button onClick={()=>{onChange({}); onClose();}}>Clear</button>
        <button className="apply" onClick={()=>{onChange(v); onClose();}}>Apply</button>
      </div>
    </div>
  );
}

function DateRangePopover({ facet, onChange, onClose }){
  const [v, setV] = React.useState(facet.value || {});
  return (
    <div className="pop" onClick={e=>e.stopPropagation()} style={{minWidth:260}}>
      <div className="range-inputs">
        <div><label>From</label><input type="date" value={v.from || ""} onChange={e=>setV(s=>({...s,from:e.target.value||undefined}))} /></div>
        <div><label>To</label><input type="date" value={v.to || ""} onChange={e=>setV(s=>({...s,to:e.target.value||undefined}))} /></div>
      </div>
      <div style={{display:"flex",gap:6,padding:"4px 0 8px",flexWrap:"wrap"}}>
        {[
          ["Last 30d", () => { const d=new Date(); const f=new Date(); f.setDate(d.getDate()-30); setV({from:f.toISOString().slice(0,10), to:d.toISOString().slice(0,10)}); }],
          ["Last 90d", () => { const d=new Date(); const f=new Date(); f.setDate(d.getDate()-90); setV({from:f.toISOString().slice(0,10), to:d.toISOString().slice(0,10)}); }],
          ["Year to date", () => { const d=new Date(); setV({from:`${d.getFullYear()}-01-01`, to:d.toISOString().slice(0,10)}); }],
          ["All-time before 2025", () => setV({to:"2024-12-31"})],
        ].map(([l,f]) => <button key={l} className="btn btn-ghost btn-xs" onClick={f}>{l}</button>)}
      </div>
      <div className="pop-foot">
        <button onClick={()=>{onChange({}); onClose();}}>Clear</button>
        <button className="apply" onClick={()=>{onChange(v); onClose();}}>Apply</button>
      </div>
    </div>
  );
}

function FacetChip({ facet, rows, onUpdate, onRemove }){
  const [open, setOpen] = React.useState(false);
  const live = facet.kind === "set" ? (facet.value && facet.value.length) :
               facet.kind === "range" ? (facet.value && (facet.value.min!=null || facet.value.max!=null)) :
               facet.kind === "dateRange" ? (facet.value && (facet.value.from || facet.value.to)) : false;
  const renderVal = () => {
    if (facet.kind === "set"){
      if (!facet.value?.length) return <span className="val empty">any</span>;
      if (facet.value.length === 1) return <span className="val">is {facet.value[0]}</span>;
      return <span className="val">is any of {facet.value.length}</span>;
    }
    if (facet.kind === "range"){
      const v = facet.value || {};
      if (v.min == null && v.max == null) return <span className="val empty">any</span>;
      if (v.min != null && v.max != null) return <span className="val">{v.min}–{v.max}</span>;
      if (v.min != null) return <span className="val">≥ {v.min}</span>;
      return <span className="val">≤ {v.max}</span>;
    }
    if (facet.kind === "dateRange"){
      const v = facet.value || {};
      if (!v.from && !v.to) return <span className="val empty">any</span>;
      if (v.from && v.to) return <span className="val">{v.from} → {v.to}</span>;
      if (v.from) return <span className="val">after {v.from}</span>;
      return <span className="val">before {v.to}</span>;
    }
    return null;
  };
  return (
    <div className={"facet-chip"+(live?" live":"")} onClick={()=>setOpen(true)} style={{position:"relative"}}>
      <span className="label">{facet.label}</span>
      {renderVal()}
      <span className="x" onClick={e=>{e.stopPropagation();onRemove();}}><I.close /></span>
      {open && (
        <>
          <div style={{position:"fixed",inset:0,zIndex:49}} onClick={()=>setOpen(false)} />
          {facet.kind === "set" && <SetPopover facet={facet} rows={rows} onChange={v=>onUpdate({value:v})} onClose={()=>setOpen(false)} />}
          {facet.kind === "range" && <RangePopover facet={facet} onChange={v=>onUpdate({value:v})} onClose={()=>setOpen(false)} />}
          {facet.kind === "dateRange" && <DateRangePopover facet={facet} onChange={v=>onUpdate({value:v})} onClose={()=>setOpen(false)} />}
        </>
      )}
    </div>
  );
}

// Each facet may declare a `group` so the Add filter menu can section them
// instead of presenting one flat ten-item list. Facets without a group
// fall under "Other".
function AddFacetMenu({ available, onAdd }){
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const opts = available.filter(f => f.label.toLowerCase().includes(q.toLowerCase()));
  // Preserve the group order facets were declared in (FACETS array order),
  // and also preserve facet order within each group.
  const groups = [];
  const byGroup = new Map();
  for (const f of opts){
    const g = f.group || "Other";
    if (!byGroup.has(g)){ byGroup.set(g, []); groups.push(g); }
    byGroup.get(g).push(f);
  }
  return (
    <div style={{position:"relative"}}>
      <div className="facet-add" onClick={()=>setOpen(o=>!o)}><I.plus /> Add filter</div>
      {open && (
        <>
          <div style={{position:"fixed",inset:0,zIndex:49}} onClick={()=>setOpen(false)} />
          <div className="pop" style={{minWidth:240}}>
            <div className="pop-search"><I.search /><input autoFocus placeholder="Find filter…" value={q} onChange={e=>setQ(e.target.value)} /></div>
            <div className="pop-list">
              {groups.map(g => (
                <React.Fragment key={g}>
                  <div style={{padding:"8px 8px 4px",fontSize:10,fontWeight:700,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase"}}>{g}</div>
                  {byGroup.get(g).map(f => (
                    <div key={f.id} className="pop-item" onClick={()=>{onAdd(f); setOpen(false);}}>
                      <span style={{color:"var(--muted)"}}>{f.kind==="set"?<I.check />:f.kind==="range"?<I.zap />:<I.cal />}</span>
                      <span>{f.label}</span>
                      <span className="count" style={{color:"var(--muted)",fontSize:10,fontWeight:500}}>{f.kind==="dateRange"?"date":f.kind}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              {!opts.length && <div className="muted" style={{padding:8,fontSize:12}}>No filters match</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Sort header — every click chains. Click an inactive header to append it as
// the next sort key, click an active header to flip its direction, click ×
// on the chip strip to remove it.
function SortHeader({ id, label, sorts, onSort, align }){
  const idx = sorts.findIndex(s => s.id === id);
  const active = idx >= 0;
  const dir = active ? sorts[idx].dir : null;
  const handle = () => onSort(id);
  const titleHint = active
    ? "Click to flip direction · use × in sort strip to remove"
    : sorts.length > 0
      ? `Click to add as sort #${sorts.length+1}`
      : "Click to sort";
  return (
    <th className={"sort"+(active?" active":"")} onClick={handle} title={titleHint} style={align==="right"?{textAlign:"right"}:undefined}>
      <span className="sort-label">
        {label}
        <span className="sort-ind">
          {active ? (dir==="asc"?"▲":"▼") : "↕"}
          {sorts.length > 1 && active && <span className="ord">{idx+1}</span>}
        </span>
      </span>
    </th>
  );
}

// URL state ─────────────────────────────────────────────────────────────────
// Encode a roster's filter+sort+tab+search as a URL hash so an admin can
// bookmark a query and share it with the team. Functions live on the page,
// so we reconstruct filter/sort objects by looking up the static defs (FACETS
// for filters, SORT_DEFS for sorts) on decode -- only ids and primitive
// values cross the wire.

function encodeRosterState({ view, tab, search, filters, sorts }){
  const p = new URLSearchParams();
  p.set("view", view);
  if (tab && tab !== "All") p.set("tab", tab);
  if (search) p.set("q", search);
  for (const f of filters){
    if (f.kind === "set" && f.value?.length){
      p.set(`f.${f.id}`, f.value.join(","));
    } else if (f.kind === "range" && f.value && (f.value.min!=null || f.value.max!=null)){
      p.set(`f.${f.id}`, `${f.value.min ?? ""}:${f.value.max ?? ""}`);
    } else if (f.kind === "dateRange" && f.value && (f.value.from || f.value.to)){
      p.set(`f.${f.id}`, `${f.value.from || ""}:${f.value.to || ""}`);
    }
  }
  if (sorts.length) p.set("s", sorts.map(s => `${s.id}:${s.dir}`).join(","));
  return "#" + p.toString();
}

function decodeRosterState(hash, FACETS, SORT_DEFS){
  const p = new URLSearchParams((hash || "").replace(/^#/, ""));
  const view = p.get("view") || null;
  const tab = p.get("tab") || "All";
  const search = p.get("q") || "";
  const filters = [];
  for (const [k,v] of p.entries()){
    if (!k.startsWith("f.")) continue;
    const id = k.slice(2);
    const def = (FACETS || []).find(f => f.id === id);
    if (!def) continue;
    if (def.kind === "set"){
      filters.push({...def, value: v.split(",").filter(Boolean)});
    } else if (def.kind === "range"){
      const [min,max] = v.split(":");
      filters.push({...def, value: {min: min===""?undefined:Number(min), max: max===""?undefined:Number(max)}});
    } else if (def.kind === "dateRange"){
      const [from,to] = v.split(":");
      filters.push({...def, value: {from: from || undefined, to: to || undefined}});
    }
  }
  const sortStr = p.get("s") || "";
  const sorts = sortStr ? sortStr.split(",").map(part => {
    const [id, dir] = part.split(":");
    const def = (SORT_DEFS || {})[id];
    if (!def) return null;
    return {id, ...def, dir: dir === "desc" ? "desc" : "asc"};
  }).filter(Boolean) : null;
  return { view, tab, search, filters, sorts };
}

window.FilterBarStyles = FilterBarStyles;
window.applyFilters = applyFilters;
window.applySort = applySort;
window.FacetChip = FacetChip;
window.AddFacetMenu = AddFacetMenu;
window.SortHeader = SortHeader;
window.encodeRosterState = encodeRosterState;
window.decodeRosterState = decodeRosterState;
