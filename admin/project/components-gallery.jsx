// Components gallery — render each table-related component in isolation with
// placeholder data. Lets reviewers evaluate the pieces on their own merits
// without the JustWashes domain on top of them.

const GalleryStyles = `
.gal-page{padding:24px 28px 80px;max-width:1200px;margin:0 auto}
.gal-banner{background:linear-gradient(90deg,#EAF1FE,#F8FAFD);border:1px solid #cfdcfb;border-radius:14px;padding:18px 22px;margin-bottom:22px}
.gal-banner h1{margin:0;font-size:20px;font-weight:700;letter-spacing:-.01em}
.gal-banner p{margin:4px 0 0;color:var(--ink-2);font-size:13px;line-height:1.5}
.gal-section{background:#fff;border:1px solid var(--line);border-radius:14px;margin-bottom:18px;overflow:hidden;box-shadow:var(--shadow-sm)}
.gal-section-head{padding:14px 18px;border-bottom:1px solid var(--line-2);background:#FAFBFD}
.gal-section-head h2{margin:0;font-size:14px;font-weight:700;letter-spacing:-.005em}
.gal-section-head p{margin:2px 0 0;color:var(--muted);font-size:12px;line-height:1.5}
.gal-section-body{padding:20px}
.gal-section-body.flush{padding:0}
.gal-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.gal-grid > div{padding:16px;border:1px dashed var(--line);border-radius:10px;background:#FAFBFD}
.gal-label{font-size:10.5px;font-weight:800;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px}

/* Library landscape cards */
.lib-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.lib-card{border:1px solid var(--line);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px;background:#fff}
.lib-card.headless{background:linear-gradient(180deg,#F8FAFD,#fff)}
.lib-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.lib-head h3{margin:0;font-size:14px;font-weight:700;letter-spacing:-.005em}
.lib-head h3 small{font-weight:500;color:var(--muted);font-size:11px;margin-left:4px}
.lib-license{font-size:10px;font-weight:800;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;background:#EEF1F6;padding:2px 8px;border-radius:99px}
.lib-license.mit{background:var(--green-50);color:#0F7A4E}
.lib-license.commercial{background:#FCF1DE;color:#8A5407}
.lib-tag{margin:0;font-size:12.5px;color:var(--ink-2);line-height:1.5}
.lib-cols{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.lib-h{font-size:10.5px;font-weight:800;color:var(--muted);letter-spacing:.07em;text-transform:uppercase;margin-bottom:6px}
.lib-cols ul{margin:0;padding-left:16px;font-size:12px;line-height:1.55;color:var(--ink-2)}
.lib-cols ul li{margin-bottom:2px}
.lib-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:8px;border-top:1px solid var(--line-2)}
.lib-foot a{color:var(--primary);font-weight:600;font-size:12.5px;display:inline-flex;align-items:center;gap:4px}
.lib-foot a:hover{text-decoration:underline}
.lib-foot code{font-family:"JetBrains Mono",monospace;font-size:11px;background:#F4F6FB;padding:3px 8px;border-radius:6px;color:var(--ink-2)}

/* Feature matrix */
.matrix-wrap{overflow-x:auto;margin:0 -20px}
.matrix{width:100%;border-collapse:collapse;font-size:12px}
.matrix th, .matrix td{padding:8px 10px;border-bottom:1px solid var(--line-2);text-align:left;vertical-align:middle}
.matrix thead th{font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;background:#FAFBFD}
.matrix tbody th{font-weight:600;color:var(--ink);text-align:left;background:#FAFBFD;width:240px}
.matrix .yes{color:#0F7A4E;font-weight:700}
.matrix .partial{color:#8A5407;font-weight:700}
.matrix .no{color:var(--muted)}
.matrix td.cell{text-align:center}
`;

// Placeholder dataset — abstract, deliberately not domain-specific so the
// component is judged on shape, not on JustWashes context.
const PLACEHOLDER_ROWS = [
  {id:"a", name:"Item Alpha",   category:"Books", priority:"High",   count:42,  spend:1240, tags:["red","new"],     joined:"2024-01-15"},
  {id:"b", name:"Item Beta",    category:"Tools", priority:"Medium", count:18,  spend:540,  tags:["green"],         joined:"2024-04-22"},
  {id:"c", name:"Item Gamma",   category:"Books", priority:"Low",    count:7,   spend:120,  tags:[],                joined:"2025-08-09"},
  {id:"d", name:"Item Delta",   category:"Music", priority:"High",   count:91,  spend:3210, tags:["red","vip"],     joined:"2023-11-30"},
  {id:"e", name:"Item Epsilon", category:"Tools", priority:"Medium", count:33,  spend:790,  tags:["green","new"],   joined:"2025-02-14"},
  {id:"f", name:"Item Zeta",    category:"Music", priority:"Low",    count:4,   spend:60,   tags:[],                joined:"2026-01-03"},
  {id:"g", name:"Item Eta",     category:"Books", priority:"High",   count:55,  spend:1680, tags:["red","vip"],     joined:"2024-07-19"},
  {id:"h", name:"Item Theta",   category:"Tools", priority:"Medium", count:22,  spend:480,  tags:["green"],         joined:"2025-05-04"},
  {id:"i", name:"Item Iota",    category:"Music", priority:"High",   count:71,  spend:2240, tags:["red","new"],     joined:"2024-10-11"},
  {id:"j", name:"Item Kappa",   category:"Books", priority:"Low",    count:11,  spend:180,  tags:[],                joined:"2026-03-22"},
];

const ROW_COLORS = ["#1F66E5","#15A66B","#0EA5BF","#6E46D6","#F59E0B"];
const colorFor = (id) => ROW_COLORS[id.charCodeAt(0) % ROW_COLORS.length];

function PlaceholderRoster(){
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState([]);
  const [sorts, setSorts] = React.useState([{id:"joined", get:r=>r.joined, type:"date", dir:"asc", label:"Joined"}]);
  const [hiddenCols, setHiddenCols] = React.useState([]);

  const FACETS = [
    {group:"Attributes",id:"category",label:"Category",kind:"set",get:r=>r.category,options:["Books","Tools","Music"]},
    {group:"Attributes",id:"priority",label:"Priority",kind:"set",get:r=>r.priority,options:["High","Medium","Low"]},
    {group:"Attributes",id:"tags",label:"Tags",kind:"set",get:r=>r.tags,options:["red","green","new","vip"]},
    {group:"Numeric",id:"count",label:"Count",kind:"range",get:r=>r.count,minHint:"0",maxHint:"100"},
    {group:"Numeric",id:"spend",label:"Spend",kind:"range",get:r=>r.spend,minHint:"$0",maxHint:"$5k"},
    {group:"Time",id:"joined",label:"Joined date",kind:"dateRange",get:r=>r.joined},
  ];

  const SORT_DEFS = {
    name:{get:r=>r.name,type:"str",label:"Name"},
    category:{get:r=>r.category,type:"str",label:"Category"},
    priority:{get:r=>({High:3,Medium:2,Low:1})[r.priority]||0,type:"num",label:"Priority"},
    count:{get:r=>r.count,type:"num",label:"Count"},
    spend:{get:r=>r.spend,type:"num",label:"Spend"},
    joined:{get:r=>r.joined,type:"date",label:"Joined"},
  };

  const onSort = (id) => setSorts(prev => {
    const def = SORT_DEFS[id];
    const idx = prev.findIndex(s=>s.id===id);
    if (idx >= 0){
      const next = [...prev];
      next[idx] = {...next[idx], dir: next[idx].dir==="asc"?"desc":"asc"};
      return next;
    }
    return [...prev, {id, ...def, dir:"asc"}];
  });
  const removeSort = (id) => setSorts(prev => prev.filter(s => s.id !== id));
  const flipSort   = (id) => setSorts(prev => prev.map(s => s.id===id ? {...s, dir: s.dir==="asc"?"desc":"asc"} : s));
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

  const filtered = applyFilters(PLACEHOLDER_ROWS, filters, search, ["name","category","priority"]);
  const sorted   = applySort(filtered, sorts);

  const COLUMNS = [
    {id:"name",label:"Name"},
    {id:"category",label:"Category"},
    {id:"priority",label:"Priority"},
    {id:"tags",label:"Tags"},
    {id:"count",label:"Count"},
    {id:"spend",label:"Spend"},
    {id:"joined",label:"Joined"},
  ];
  const showCol = (id) => !hiddenCols.includes(id);

  return (
    <div className="table-wrap">
      <div className="fbar">
        <div className="fbar-row">
          <div className="search grow"><I.search /><input placeholder="Search name / category / priority…" value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <ColumnsMenu columns={COLUMNS} hidden={hiddenCols} onChange={setHiddenCols} />
        </div>
        <div className="fbar-row">
          <span className="fbar-tag">Narrow</span>
          {filters.map(f => (
            <FacetChip key={f.id} facet={f} rows={PLACEHOLDER_ROWS}
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
                  <span className="arr" onClick={e=>{e.stopPropagation();flipSort(s.id);}} style={{cursor:"pointer"}}>{s.dir==="asc"?"▲":"▼"}</span>
                  <span className="x" onClick={e=>{e.stopPropagation();removeSort(s.id);}} style={{cursor:"pointer"}}><I.close /></span>
                </div>
              ))}
              <button className="btn btn-ghost btn-xs" onClick={()=>setSorts([])} style={{color:"var(--muted)"}}>Clear sort</button>
            </div>
          </div>
        )}
      </div>

      <table className="tbl">
        <thead><tr>
          {showCol("name") && <SortHeader id="name" label="Name" sorts={sorts} onSort={onSort} />}
          {showCol("category") && <SortHeader id="category" label="Category" sorts={sorts} onSort={onSort} />}
          {showCol("priority") && <SortHeader id="priority" label="Priority" sorts={sorts} onSort={onSort} />}
          {showCol("tags") && <th>Tags</th>}
          {showCol("count") && <SortHeader id="count" label="Count" sorts={sorts} onSort={onSort} align="right" />}
          {showCol("spend") && <SortHeader id="spend" label="Spend" sorts={sorts} onSort={onSort} align="right" />}
          {showCol("joined") && <SortHeader id="joined" label="Joined" sorts={sorts} onSort={onSort} />}
        </tr></thead>
        <tbody>
          {sorted.map(r => (
            <tr key={r.id}>
              {showCol("name") && <td>
                <div className="who">
                  <div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${colorFor(r.id)},${shade(colorFor(r.id),-22)})`}}>{r.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
                  <div className="meta"><span className="n">{r.name}</span><span className="e">id-{r.id}</span></div>
                </div>
              </td>}
              {showCol("category") && <td><span className="pill pill-grey">{r.category}</span></td>}
              {showCol("priority") && <td><span className={"pill "+(r.priority==="High"?"pill-red":r.priority==="Medium"?"pill-amber":"pill-grey")}>{r.priority}</span></td>}
              {showCol("tags") && <td>{r.tags.length ? r.tags.map(t => <span key={t} className="pill pill-blue pill-soft" style={{marginRight:4}}>{t}</span>) : <span className="muted" style={{fontSize:11}}>—</span>}</td>}
              {showCol("count") && <td style={{textAlign:"right",fontWeight:700}}>{r.count}</td>}
              {showCol("spend") && <td style={{textAlign:"right",fontWeight:700}}>${r.spend.toLocaleString()}</td>}
              {showCol("joined") && <td className="muted" style={{fontSize:12}}>{r.joined}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <div className="empty-state">
          <div className="em">No items match this view</div>
          <div style={{fontSize:12.5}}>Try clearing a filter or adjusting the date range.</div>
        </div>
      )}

      <div className="results-meta">
        <span>Showing <b>{sorted.length}</b> of <b>{PLACEHOLDER_ROWS.length}</b> items</span>
        <span>{sorts.length>1 ? `Sorted by ${sorts.length} columns` : sorts.length===1 ? `Sorted by ${sorts[0].label}` : "Default order"}</span>
      </div>
    </div>
  );
}

// Standalone exhibits ------------------------------------------------------

function FacetChipExhibit(){
  const [setVal, setSetVal] = React.useState(["High"]);
  const [rangeVal, setRangeVal] = React.useState({min: 10});
  const [dateVal, setDateVal] = React.useState({from:"2024-01-01"});
  return (
    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
      <FacetChip
        facet={{id:"priority",label:"Priority",kind:"set",get:r=>r.priority,options:["High","Medium","Low"],value:setVal}}
        rows={PLACEHOLDER_ROWS}
        onUpdate={p=>setSetVal(p.value)}
        onRemove={()=>setSetVal([])}
      />
      <FacetChip
        facet={{id:"count",label:"Count",kind:"range",get:r=>r.count,value:rangeVal}}
        rows={PLACEHOLDER_ROWS}
        onUpdate={p=>setRangeVal(p.value)}
        onRemove={()=>setRangeVal({})}
      />
      <FacetChip
        facet={{id:"joined",label:"Joined",kind:"dateRange",get:r=>r.joined,value:dateVal}}
        rows={PLACEHOLDER_ROWS}
        onUpdate={p=>setDateVal(p.value)}
        onRemove={()=>setDateVal({})}
      />
    </div>
  );
}

function SortStripExhibit(){
  const [sorts, setSorts] = React.useState([
    {id:"a", label:"Priority", dir:"desc"},
    {id:"b", label:"Spend", dir:"desc"},
    {id:"c", label:"Joined", dir:"asc"},
  ]);
  const flip = id => setSorts(p => p.map(s => s.id===id ? {...s, dir: s.dir==="asc"?"desc":"asc"} : s));
  const drop = id => setSorts(p => p.filter(s => s.id!==id));
  const promote = id => setSorts(p => {
    const i = p.findIndex(s => s.id===id);
    if (i <= 0) return p;
    return [p[i], ...p.slice(0,i), ...p.slice(i+1)];
  });
  return (
    <div className="sort-strip">
      {sorts.map((s,i) => (
        <div key={s.id} className={"sort-chip"+(i===0?" primary":"")} onClick={()=>promote(s.id)} style={{cursor:i===0?"default":"pointer"}}>
          <span className="ord">{i+1}</span>
          <span>{s.label}</span>
          <span className="arr" onClick={e=>{e.stopPropagation();flip(s.id);}} style={{cursor:"pointer"}}>{s.dir==="asc"?"▲":"▼"}</span>
          <span className="x" onClick={e=>{e.stopPropagation();drop(s.id);}} style={{cursor:"pointer"}}><I.close /></span>
        </div>
      ))}
      {sorts.length === 0 && <span className="muted" style={{fontSize:12}}>No sort applied</span>}
    </div>
  );
}

function AnswerCardExhibit(){
  const r = PLACEHOLDER_ROWS[3];
  return (
    <div className="answer-card" style={{borderRadius:12,border:"1px solid var(--line-2)"}}>
      <div className="avatar avatar-md" style={{background:`linear-gradient(135deg,${colorFor(r.id)},${shade(colorFor(r.id),-22)})`}}>{r.name.split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
      <div style={{minWidth:0}}>
        <div className="ac-eyebrow">Your match · ranked by Spend</div>
        <div className="ac-name">{r.name}</div>
        <div className="ac-meta">{r.category} · {r.priority} priority · joined {r.joined}</div>
      </div>
      <div className="ac-stats">
        <div className="ac-stat"><span className="v">${r.spend.toLocaleString()}</span><span className="l">Spend</span></div>
        <div className="ac-stat"><span className="v">{r.count}</span><span className="l">Count</span></div>
        <button className="btn btn-primary btn-sm">Open <I.chev /></button>
      </div>
    </div>
  );
}

function EmptyStateExhibit(){
  return (
    <div className="empty-state" style={{padding:"32px 20px"}}>
      <div className="em">No items match this view</div>
      <div style={{fontSize:12.5}}>
        Try removing <b>Priority</b> · would show <b>7</b> items
        <button className="btn btn-ghost btn-xs" style={{marginLeft:6}}>Remove</button>
      </div>
    </div>
  );
}

function PresetsExhibit(){
  return (
    <div className="preset-row">
      <span className="fbar-tag" style={{background:"transparent",color:"var(--muted)"}}>Quick views</span>
      {["High-priority new","Top spend Books","Recent additions","Untagged backlog","Low priority"].map(name => (
        <button key={name} className="preset-chip"><I.zap />{name}</button>
      ))}
    </div>
  );
}

function NarrowRankTagExhibit(){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div className="fbar-row" style={{padding:0}}>
        <span className="fbar-tag">Narrow</span>
        <span className="muted" style={{fontSize:12}}>Filters compose with AND</span>
      </div>
      <div className="fbar-row" style={{padding:0}}>
        <span className="fbar-tag rank">Rank</span>
        <span className="muted" style={{fontSize:12}}>Sort keys compose in chained order</span>
      </div>
    </div>
  );
}

// Library landscape ------------------------------------------------------

function LibraryCard({ name, version, license, licenseClass, tagline, headless, covers, gaps, demoUrl, install }){
  return (
    <div className={"lib-card"+(headless?" headless":"")}>
      <div className="lib-head">
        <h3>{name}<small>{version}</small></h3>
        <span className={"lib-license "+(licenseClass||"mit")}>{license}</span>
      </div>
      <p className="lib-tag">{tagline}</p>
      <div className="lib-cols">
        <div>
          <div className="lib-h">Covers</div>
          <ul>{covers.map((c,i) => <li key={i}>{c}</li>)}</ul>
        </div>
        <div>
          <div className="lib-h">Gaps for our spec</div>
          <ul>{gaps.map((g,i) => <li key={i}>{g}</li>)}</ul>
        </div>
      </div>
      <div className="lib-foot">
        <a href={demoUrl} target="_blank" rel="noreferrer">View live demo <I.external /></a>
        <code>{install}</code>
      </div>
    </div>
  );
}

const LIBRARIES = [
  {
    name: "TanStack Table", version: "v8", license: "MIT", licenseClass:"mit",
    headless: true,
    tagline: "Headless toolkit. You own all rendering; the library owns sort, filter, column visibility, pagination, grouping state.",
    covers: [
      "Multi-column sort (shift-click default)",
      "Column visibility, ordering, pinning",
      "Global + per-column filter primitives",
      "Faceted unique-values + min/max helpers",
      "Server-side or client-side modes",
    ],
    gaps: [
      "No chip / popover UI — bring your own",
      "No URL state sync — wire it yourself",
      "No preset views — your component layer",
      "Empty-state suggestions — custom",
    ],
    demoUrl: "https://tanstack.com/table/v8/docs/framework/react/examples/filters-faceted",
    install: "npm i @tanstack/react-table",
  },
  {
    name: "AG Grid Community", version: "v31+", license: "MIT", licenseClass:"mit",
    tagline: "Full-featured grid with built-in filter rows, multi-sort, column tool panel, virtualized rows. Heavyweight default look.",
    covers: [
      "Multi-column sort (shift-click)",
      "Built-in column filter rows + filter menus",
      "Column visibility tool panel",
      "Pagination + virtualization",
      "CSV export built-in",
    ],
    gaps: [
      "Chip-style facets need custom UI",
      "URL state sync is custom",
      "Preset views are custom",
      "Default styling is dense / not your brand",
      "Excel export, range select, master/detail are Enterprise (paid)",
    ],
    demoUrl: "https://www.ag-grid.com/example/",
    install: "npm i ag-grid-community ag-grid-react",
  },
  {
    name: "MUI X DataGrid", version: "v7 (free tier)", license: "MIT", licenseClass:"mit",
    tagline: "Material-styled grid with filter panel, single-column sort, and column visibility. Multi-sort and advanced filters require Pro/Premium.",
    covers: [
      "Single-column sort (free)",
      "Filter panel with operators per type",
      "Column visibility menu",
      "Pagination",
      "CSV export",
    ],
    gaps: [
      "Multi-column sort is Pro (paid)",
      "Tree data, master/detail are Pro/Premium",
      "Chip-style faceted UI is custom",
      "URL sync is custom",
      "Theming is Material-Design-first",
    ],
    demoUrl: "https://mui.com/x/react-data-grid/",
    install: "npm i @mui/x-data-grid",
  },
  {
    name: "Mantine DataTable", version: "v7+", license: "MIT", licenseClass:"mit",
    tagline: "Built on Mantine. Sort + pagination via props, optional row selection / inline editing. Filters are a thin layer on top of column defs.",
    covers: [
      "Sort by column (single)",
      "Row selection, expandable rows",
      "Sticky header, infinite scroll",
      "Pagination",
    ],
    gaps: [
      "Multi-column sort needs custom logic",
      "No built-in faceted filter UI",
      "Requires Mantine ecosystem (theme provider)",
      "URL sync, presets are custom",
    ],
    demoUrl: "https://icflorescu.github.io/mantine-datatable/",
    install: "npm i mantine-datatable @mantine/core",
  },
  {
    name: "react-data-grid", version: "v7+ (Adazzle)", license: "MIT", licenseClass:"mit",
    tagline: "Performance-focused grid with frozen columns and inline editing. Filters and sorting are opt-in via column callbacks.",
    covers: [
      "Sortable column headers",
      "Frozen / pinned columns",
      "Cell editing",
      "Row grouping",
    ],
    gaps: [
      "No built-in filter UI",
      "Multi-sort is custom",
      "Faceted chips, presets, URL sync all custom",
      "Default styling is utilitarian",
    ],
    demoUrl: "https://adazzle.github.io/react-data-grid/",
    install: "npm i react-data-grid",
  },
  {
    name: "glide-data-grid", version: "v6+", license: "MIT", licenseClass:"mit",
    tagline: "Canvas-rendered grid optimized for millions of rows. Best when raw scale matters; UX is closer to a spreadsheet than a CRM list.",
    covers: [
      "Massive datasets via canvas",
      "Cell editing + custom cells",
      "Column resize, freeze, group",
      "Copy / paste",
    ],
    gaps: [
      "No built-in filter UX",
      "Sort chips, facets, presets all custom",
      "Theming requires canvas-aware styling",
      "Cells aren't accessible HTML by default",
    ],
    demoUrl: "https://grid.glideapps.com/",
    install: "npm i @glideapps/glide-data-grid",
  },
  {
    name: "Refine.dev", version: "v4+", license: "MIT", licenseClass:"mit",
    tagline: "Framework, not just a table. Plugs your data layer into list / show / edit pages with URL sync and CRUD scaffolding. Brings its own table via headless integration with another lib.",
    covers: [
      "URL state sync (filters, sorts, pagination)",
      "List / show / edit page primitives",
      "Auth, audit, access control hooks",
      "Pluggable UI: Mantine, MUI, Antd, Chakra",
    ],
    gaps: [
      "Opinionated about app architecture",
      "Table itself is whichever UI kit you pick",
      "Faceted-chip UX is still on you",
      "Heavier buy-in than a single component",
    ],
    demoUrl: "https://refine.dev/demo/",
    install: "npm create refine-app@latest",
  },
  {
    name: "Algolia InstantSearch React", version: "v7+", license: "MIT (lib)", licenseClass:"mit",
    tagline: "Faceted-search components (chips, refinement lists, range filters, URL sync) — but designed around a search backend, not an in-memory rows array.",
    covers: [
      "Refinement chips out of the box",
      "Multi-faceted filtering",
      "URL state sync first-class",
      "Hits / pagination / sort widgets",
    ],
    gaps: [
      "Requires Algolia, Meilisearch, or Typesense backend",
      "Not a table — rows render however you choose",
      "Multi-column table sort patterns aren't first-class",
      "Algolia hosting itself is paid above a free tier",
    ],
    demoUrl: "https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/",
    install: "npm i react-instantsearch algoliasearch",
  },
];

function LibraryLandscape(){
  return (
    <div className="lib-grid">
      {LIBRARIES.map(l => <LibraryCard key={l.name} {...l} />)}
    </div>
  );
}

const SPEC_ROWS = [
  ["Free-text search",                "partial","yes","yes","yes","partial","no","yes","yes"],
  ["Multi-select facet popover",      "no","no","no","no","no","no","no","yes"],
  ["Range / date-range filters",      "yes","yes","yes","partial","no","no","yes","yes"],
  ["Conjunctive (AND) composition",   "yes","yes","yes","yes","yes","yes","yes","yes"],
  ["Multi-column sort",               "yes","yes","no*","no","no","no","yes","partial"],
  ["Sort chip strip / promote-primary","no","no","no","no","no","no","no","partial"],
  ["Column visibility menu",          "yes","yes","yes","no","no","yes","yes","no"],
  ["URL state sync",                  "no","no","no","no","no","no","yes","yes"],
  ["Preset / saved views",            "no","no","no","no","no","no","yes","no"],
  ["Empty-state suggestion",          "no","no","no","no","no","no","no","no"],
  ["Server-side mode",                "yes","yes","yes","partial","yes","yes","yes","yes"],
  ["Theming via CSS vars",            "yes","partial","no","no","yes","partial","partial","yes"],
];

function FeatureMatrix(){
  const cell = (v) => v === "yes" ? <span className="yes">✓</span>
    : v === "partial" ? <span className="partial">~</span>
    : <span className="no">—</span>;
  return (
    <div className="matrix-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th>Capability</th>
            {LIBRARIES.map(l => <th key={l.name}>{l.name.replace("InstantSearch ","").replace("Community","").replace(" Table","").replace(" DataGrid","")}</th>)}
          </tr>
        </thead>
        <tbody>
          {SPEC_ROWS.map(([label, ...vals]) => (
            <tr key={label}>
              <th>{label}</th>
              {vals.map((v,i) => <td key={i} className="cell">{cell(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{padding:"10px 14px",fontSize:11.5,color:"var(--muted)",lineHeight:1.5}}>
        ✓ built-in · ~ partial / requires light glue · — not built-in (custom or unsupported).<br/>
        <i>* MUI X DataGrid free tier is single-column sort; multi-column sort is a Pro/Premium feature.</i>
      </div>
    </div>
  );
}

function ComponentsGallery(){
  return (
    <div className="gal-page">
      <div className="gal-banner">
        <h1>Components gallery</h1>
        <p>Each piece of the roster table rendered with abstract placeholder data so reviewers can evaluate the components on their own merits, separate from the JustWashes domain.</p>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>1 · Roster table (full)</h2>
          <p>Search · facet chips · multi-sort · column visibility · empty state · result-count footer.</p>
        </div>
        <div className="gal-section-body flush"><PlaceholderRoster /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>2 · Filter chips (set / range / date range)</h2>
          <p>Click any chip to open its type-aware popover. Counts in the set popover reflect placeholder data.</p>
        </div>
        <div className="gal-section-body"><FacetChipExhibit /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>3 · Sort chip strip</h2>
          <p>Click a chip to promote it to primary; click ▲▼ to flip direction; click × to remove. The first chip is the primary sort.</p>
        </div>
        <div className="gal-section-body"><SortStripExhibit /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>4 · NARROW / RANK row tags</h2>
          <p>Visual labels that distinguish filtering from sorting in the toolbar.</p>
        </div>
        <div className="gal-section-body"><NarrowRankTagExhibit /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>5 · Quick views (presets)</h2>
          <p>Each chip applies a complete state (filters + sort) for a common saved query.</p>
        </div>
        <div className="gal-section-body"><PresetsExhibit /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>6 · Answer card</h2>
          <p>Surfaces above the table when filters narrow results to ≤5 rows. Highlights the top match.</p>
        </div>
        <div className="gal-section-body"><AnswerCardExhibit /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>7 · Empty state with suggestion</h2>
          <p>When 0 rows match, identifies the single filter whose removal would unblock the most rows.</p>
        </div>
        <div className="gal-section-body"><EmptyStateExhibit /></div>
      </div>

      <div className="gal-banner" style={{marginTop:32}}>
        <h1>Library landscape — free options</h1>
        <p>Each free table / data-grid library evaluated against the spec. Click <i>View live demo</i> on any card to see it running on the project's own docs site (live demos for these aren't embedded here because each library expects its own bundle setup, theme provider, or backend).</p>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>8 · Library cards</h2>
          <p>License + one-line summary + what it covers / what it lacks against this spec.</p>
        </div>
        <div className="gal-section-body"><LibraryLandscape /></div>
      </div>

      <div className="gal-section">
        <div className="gal-section-head">
          <h2>9 · Feature matrix</h2>
          <p>Spec capability vs. each library, at-a-glance.</p>
        </div>
        <div className="gal-section-body flush"><FeatureMatrix /></div>
      </div>
    </div>
  );
}

window.GalleryStyles = GalleryStyles;
window.ComponentsGallery = ComponentsGallery;
