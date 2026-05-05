// Top-level app. Routes between roster and profile, controls quick-glance + public profile modal.
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "view":"customer-roster",
  "heroStyle":"gradient",
  "density":"comfortable",
  "showPublicProfile":false
}/*EDITMODE-END*/;

function App(){
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  // Initial view honors a `view=` param in the URL hash so a shared link
  // lands on the right roster instead of the prototype's default.
  const initialView = (() => {
    const hashView = new URLSearchParams((window.location.hash||"").replace(/^#/, "")).get("view");
    return hashView || tweaks.view || "customer-roster";
  })();
  const [view, setView] = React.useState(initialView); // technician-roster, technician-profile, customer-roster, customer-profile
  const [activeTech, setActiveTech] = React.useState(TECHS[0]);
  const [activeCust, setActiveCust] = React.useState(CUSTOMERS[0]);
  const [quick, setQuick] = React.useState(null); // {kind,entity}
  const [publicTech, setPublicTech] = React.useState(null);

  React.useEffect(()=>{ setView(tweaks.view); }, [tweaks.view]);

  const isTech = view.startsWith("technician");
  const sub = view==="technician-roster" ? "TECHNICIAN ROSTER" : view==="technician-profile" ? "TECHNICIAN PROFILE" : view==="customer-roster" ? "CUSTOMER MANAGEMENT" : "CUSTOMER PROFILE";

  return (
    <>
      <style>{`${PrimStyles}\n${ShellStyles}\n${RosterStyles}\n${TPStyles}\n${CRosterStyles}\n${CPStyles}\n${QGStyles}\n${PPStyles}\n${FilterBarStyles}`}</style>
      <Shell activeNav={isTech?"technicians":"customers"} subbarRight={sub}>
        {view==="technician-roster" && (
          <TechRoster
            onQuick={t => setQuick({kind:"tech",entity:t})}
            onOpen={t => { setActiveTech(t); setView("technician-profile"); setTweak("view","technician-profile"); }}
          />
        )}
        {view==="technician-profile" && (
          <TechProfile
            tech={activeTech}
            onBack={() => { setView("technician-roster"); setTweak("view","technician-roster"); }}
            onPublic={() => setPublicTech(activeTech)}
          />
        )}
        {view==="customer-roster" && (
          <CustRoster
            onQuick={c => setQuick({kind:"cust",entity:c})}
            onOpen={c => { setActiveCust(c); setView("customer-profile"); setTweak("view","customer-profile"); }}
          />
        )}
        {view==="customer-profile" && (
          <CustProfile cust={activeCust} onBack={() => { setView("customer-roster"); setTweak("view","customer-roster"); }} />
        )}
      </Shell>

      {quick && (
        <QuickGlance
          kind={quick.kind}
          entity={quick.entity}
          onClose={()=>setQuick(null)}
          onOpenFull={()=>{
            if (quick.kind==="tech"){ setActiveTech(quick.entity); setView("technician-profile"); setTweak("view","technician-profile"); }
            else { setActiveCust(quick.entity); setView("customer-profile"); setTweak("view","customer-profile"); }
            setQuick(null);
          }}
          onPublicProfile={()=>{ setPublicTech(quick.entity); }}
        />
      )}

      {publicTech && <PublicProfileModal tech={publicTech} onClose={()=>setPublicTech(null)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection title="View">
          <TweakSelect
            label="Active screen"
            value={tweaks.view}
            onChange={v=>{ setTweak("view",v); setView(v); }}
            options={[
              {value:"technician-roster",label:"Technician roster"},
              {value:"technician-profile",label:"Technician profile (full)"},
              {value:"customer-roster",label:"Customer roster"},
              {value:"customer-profile",label:"Customer profile (full)"},
            ]}
          />
          <TweakButton onClick={()=>setQuick({kind:"tech",entity:TECHS[0]})}>Open quick-glance · Tech</TweakButton>
          <TweakButton onClick={()=>setQuick({kind:"cust",entity:CUSTOMERS[0]})}>Open quick-glance · Customer</TweakButton>
          <TweakButton onClick={()=>setPublicTech(TECHS[0])}>Open public profile preview</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
