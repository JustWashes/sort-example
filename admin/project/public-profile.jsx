// Public profile preview modal — what a customer sees when browsing a technician
const PPStyles = `
.pp-frame{width:380px;border-radius:28px;background:#0B2147;padding:10px;box-shadow:0 30px 80px rgba(11,33,71,.4),0 0 0 1px rgba(255,255,255,.06)}
.pp-screen{background:#F4F6FB;border-radius:22px;overflow:hidden;height:720px;display:flex;flex-direction:column}
.pp-status{display:flex;justify-content:space-between;align-items:center;padding:12px 22px 6px;font-size:13px;font-weight:700}
.pp-hero{position:relative;height:160px;background:linear-gradient(135deg,#0B2147 0%,#1F66E5 60%,#5C92F0 100%);overflow:hidden}
.pp-hero::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 80% 30%,rgba(255,255,255,.15),transparent 50%)}
.pp-id{position:absolute;left:18px;bottom:-32px;display:flex;gap:12px;align-items:flex-end;z-index:2}
.pp-pic{width:78px;height:78px;border-radius:18px;background:linear-gradient(135deg,#0EA5BF,#075061);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:28px;border:3px solid #fff;box-shadow:0 4px 18px rgba(0,0,0,.25)}
.pp-name{color:#fff;font-weight:700;font-size:18px;letter-spacing:-.01em;line-height:1.1;text-shadow:0 1px 2px rgba(0,0,0,.2)}
.pp-name small{display:block;font-weight:500;color:rgba(255,255,255,.85);font-size:11px;margin-top:3px}
.pp-body{padding:46px 18px 18px;flex:1;overflow:auto}
.pp-card{background:#fff;border-radius:14px;padding:14px;margin-bottom:10px;box-shadow:0 1px 0 rgba(11,33,71,.04)}
.pp-stat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--line-2);border-radius:14px;overflow:hidden}
.pp-stat-grid > div{background:#fff;padding:12px 8px;text-align:center}
.pp-stat-grid .v{font-size:18px;font-weight:700;color:var(--ink)}
.pp-stat-grid .l{font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.05em;margin-top:2px}
.pp-cta{height:48px;border-radius:14px;background:#0B2147;color:#fff;font-weight:700;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;border:0}
.pp-skill{display:inline-block;padding:5px 10px;border-radius:99px;background:#EAF1FE;color:#13499F;font-size:11px;font-weight:600;margin:0 4px 4px 0}
.pp-rev{font-size:12.5px;line-height:1.45;color:var(--ink-2);margin-top:6px}
`;

function PublicProfileModal({ tech, onClose }){
  if (!tech) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:520,width:"100%",position:"relative"}}>
        <div style={{position:"absolute",top:-44,right:0,display:"flex",alignItems:"center",gap:10}}>
          <span style={{color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",opacity:.85}}>Customer-facing public profile · preview</span>
          <button className="icon-btn" style={{background:"rgba(255,255,255,.12)",color:"#fff"}} onClick={onClose}><I.close /></button>
        </div>
        <div className="pp-frame fadein">
          <div className="pp-screen">
            <div className="pp-status">
              <span>9:41</span>
              <span style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{display:"inline-block",width:18,height:8,background:"#0B2147",borderRadius:2}}></span>
                <span style={{display:"inline-block",width:14,height:8,background:"#0B2147",borderRadius:2}}></span>
                <span style={{display:"inline-block",width:22,height:10,border:"1.5px solid #0B2147",borderRadius:3,position:"relative"}}>
                  <span style={{position:"absolute",inset:1,background:"#0B2147",borderRadius:1,width:"75%"}}></span>
                </span>
              </span>
            </div>
            <div className="pp-hero">
              <div className="pp-id">
                <div className="pp-pic" style={{background:`linear-gradient(135deg,${tech.color||"#0EA5BF"},${shade(tech.color||"#0EA5BF",-30)})`}}>{tech.initials}</div>
                <div style={{paddingBottom:8}}>
                  <div className="pp-name">{tech.name}<small>{tech.handle}</small></div>
                </div>
              </div>
            </div>
            <div className="pp-body">
              <div className="pp-card">
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                  <span className="pill pill-cyan">CERTIFIED PRO</span>
                  <span className="pill pill-green">BACKGROUND CHECKED</span>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:13,fontWeight:700,color:"#E29411"}}>
                    <I.star /> {(tech.rating||0).toFixed(1)} <span style={{color:"var(--muted)",fontWeight:500}}>({tech.reviews||0})</span>
                  </span>
                </div>
                <div className="pp-stat-grid">
                  <div><div className="v">{tech.lifetimeJobs||0}</div><div className="l">Washes</div></div>
                  <div><div className="v">6 yrs</div><div className="l">Experience</div></div>
                  <div><div className="v">98%</div><div className="l">On-time</div></div>
                </div>
              </div>

              <div className="pp-card">
                <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>About</div>
                <div style={{fontSize:13,lineHeight:1.5,color:"var(--ink-2)"}}>
                  {tech.bio || "Certified detailer specializing in mobile washes for sedans and SUVs. Eco-friendly products, low-water rinse."}
                </div>
                <div style={{marginTop:10}}>
                  {(tech.skills || ["Hand wash","Interior detail","Ceramic prep","Pet hair"]).map(s => <span key={s} className="pp-skill">{s}</span>)}
                </div>
              </div>

              <div className="pp-card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",letterSpacing:".06em",textTransform:"uppercase"}}>Recent reviews</div>
                  <div style={{fontSize:11,color:"var(--primary)",fontWeight:600}}>See all</div>
                </div>
                {(tech.reviewItems || []).slice(0,2).map((r,i)=>(
                  <div key={i} style={{padding:"8px 0",borderTop:i?"1px solid var(--line-2)":"0"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12.5,fontWeight:700}}>{r.by}</span>
                      <span style={{fontSize:11,color:"#E29411",letterSpacing:1}}>{"★".repeat(r.rating)}</span>
                    </div>
                    <div className="pp-rev">{r.text}</div>
                  </div>
                ))}
              </div>

              <button className="pp-cta">Book {tech.name.split(" ")[0]} <I.chev /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PPStyles = PPStyles;
window.PublicProfileModal = PublicProfileModal;
