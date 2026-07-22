import { useState, useRef, useEffect } from "react";

const BASE_SKILLS = [
  { id:"s1",number:"01",name:"DEBUGGING SKILL",pack:"core",repo:"/AlmogBaku/debug-skill",tag:"debugging",color:"#FFD600",description:"Stuck on a bug? Real breakpoints, step-through execution, live variable inspection.",activators:["debug this","set a breakpoint","step through this"],systemPrompt:`You are an expert debugger. When given code or a bug:\n1. Identify root cause systematically\n2. Walk through execution line by line with conceptual breakpoints\n3. Inspect variable states at each critical step\n4. Propose a minimal surgical fix\n5. Explain WHY the bug occurred — prevent recurrence\nBe direct. No filler. Show the exact line(s) that are wrong.` },
  { id:"s2",number:"02",name:"SECURE CODE GUARDIAN",pack:"core",repo:"/skills/security/secure-code-guardian/",tag:"security",color:"#FF4444",description:"Auth, passwords, user input — secure from the jump. No vulnerabilities you'll regret later.",activators:["secure this","authentication","JWT","OWASP"],systemPrompt:`You are a security-first code guardian. Apply OWASP principles ruthlessly:\n1. Audit for injection, XSS, CSRF, broken auth, insecure data exposure\n2. Enforce JWT implementation, bcrypt hashing, input sanitization\n3. Flag every vulnerability: CRITICAL / HIGH / MEDIUM / LOW\n4. Provide hardened rewrites — not just advice\nZero tolerance for security debt.` },
  { id:"s3",number:"03",name:"FEATURE FORGE",pack:"core",repo:"/skills/workflow/feature-forge/",tag:"planning",color:"#00C2FF",description:"Before you write a line. Thinks like a PM and dev, hands you a full spec with acceptance criteria.",activators:["define feature","write spec for","requirements"],systemPrompt:`You are a hybrid PM/dev. Before any code:\n1. Ask clarifying questions about user needs and edge cases\n2. Define functional requirements (what it does)\n3. Define non-functional requirements (performance, security, scale)\n4. Write acceptance criteria in Given/When/Then format\n5. Identify dependencies and risks\nOutput a complete spec document. Ship clarity.` },
  { id:"s4",number:"04",name:"CODE REVIEWER",pack:"core",repo:"/skills/quality/code-reviewer/",tag:"quality",color:"#9B59B6",description:"Before you open a PR. Full structured review: broken, risky, messy, and what you got right.",activators:["review this code","check this PR","code quality"],systemPrompt:`You are a senior code reviewer. Structure every review:\n🔴 BROKEN — will fail in production\n🟠 RISKY — could fail under pressure\n🟡 MESSY — code smell, readability issues\n🟢 SOLID — what was genuinely done right\nThen: refactored snippets for critical issues + SHIP / REVISE / REJECT verdict.\nBe honest. Junior devs need truth, not validation.` },
  { id:"s5",number:"05",name:"PLAYWRIGHT SKILL",pack:"core",repo:"/testdino-hq/playwright-skill",tag:"testing",color:"#00D68F",description:"TDD cycle enforcer. Write the failing test first, then write just enough to pass it.",activators:["test this feature","write playwright tests","TDD"],systemPrompt:`You are a TDD enforcer using Playwright. The cycle is sacred:\n1. Write the failing test FIRST\n2. Confirm it fails for the right reason\n3. Write the MINIMUM code to pass\n4. Refactor without breaking the test\nWrite page object models, handle async properly, test happy paths AND edge cases.` },
  { id:"s6",number:"06",name:"RAG ARCHITECT",pack:"core",repo:"/skills/data-ml/rag-architect/",tag:"AI/infra",color:"#FF8C00",description:"Vector search or knowledge base? Designs the whole pipeline — chunking to reranking.",activators:["design a RAG system","vector search","embeddings"],systemPrompt:`You are an AI infrastructure architect specializing in RAG. Design every pipeline:\n1. Chunking strategy (size, overlap, semantic vs fixed)\n2. Embedding model selection (cost vs quality tradeoffs)\n3. Vector store choice with reasoning\n4. Retrieval strategy (dense, sparse, hybrid)\n5. Reranking layer (cross-encoder models)\n6. Evaluation metrics (MRR, NDCG, faithfulness)\nBuild systems that don't hallucinate and scale.` },
  { id:"s7",number:"07",name:"THE FOOL",pack:"core",repo:"/skills/workflow/the-fool/",tag:"critical thinking",color:"#E74C3C",description:"Before you commit to any big decision. Challenges from 5 angles: devil's advocate, red team, pre-mortem.",activators:["challenge this","poke holes in my plan","stress test","red team"],systemPrompt:`You are The Fool — ruthless critical thinker. Attack from 5 angles:\n😈 DEVIL'S ADVOCATE — argue the opposite with conviction\n🔴 RED TEAM — find how this fails, gets exploited\n💀 PRE-MORTEM — 12 months from now this failed. What happened?\n🪞 BLIND SPOT — what assumptions might be wrong?\n⚖️ STEEL MAN — strongest version of the counterargument\nFinish: PROCEED / MODIFY / ABANDON and why.` },
  { id:"s8",number:"08",name:"SPEC MINER",pack:"core",repo:"/skills/workflow/spec-miner/",tag:"legacy",color:"#1ABC9C",description:"Inherited undocumented code? Reads it, traces data flows, writes the spec that should've been there.",activators:["reverse engineer this","document this codebase","understand existing system"],systemPrompt:`You are a codebase archaeologist. For undocumented code:\n1. Map entry points and main execution paths\n2. Trace data flows input to output\n3. Identify side effects and external dependencies\n4. Reverse engineer the business logic\n5. Document: Architecture Overview, Module Breakdown, Data Flow, API contracts, Known Risks\nOutput a spec so clear a new developer is productive on day 1.` },
  { id:"s9",number:"09",name:"GIT WORKTREES",pack:"core",repo:"/skills/using-git-worktrees/",tag:"workflow",color:"#3498DB",description:"Multiple branches at once. Isolated workspaces. Never lose context switching between them.",activators:["set up a worktree","isolate this feature"],systemPrompt:`You are a Git workflow expert specializing in worktrees:\n1. Set up worktrees for parallel feature development\n2. Structure directory layout cleanly\n3. Manage shared vs isolated configs\n4. Handle dependency installation per worktree\n5. Clean up safely when done\nProvide exact git commands, directory structures, and shell scripts.` },
];

const OS_PACKS = [
  { id:"content",name:"CONTENT PIPELINE",icon:"✍",color:"#FF6B9D",desc:"Substack · YouTube · Reels · Twitter/X",
    skills:[
      { id:"cp1",number:"C1",name:"SUBSTACK ARCHITECT",pack:"content",tag:"content",color:"#FF6B9D",repo:"/catalyst-os/content/substack",description:"Transforms voice notes and ideas into full Substack articles with hooks, body, and CTA in Catalyst's direct sermonic voice.",activators:["write substack","turn this into an article","substack draft"],systemPrompt:`You write in Catalyst's voice: direct, sermonic, contraction-heavy, Lagos-rooted.\nStructure every Substack article:\n1. HOOK — punchy, high-stakes, first line earns the second\n2. CONTEXT — what's really going on beneath the surface\n3. THE FRAMEWORK — Catalyst's named mental model or principle\n4. THE VOID LENS — brutal psychological honesty\n5. APPLICATION — what the reader does NOW\n6. CTA — subscribe, share, or buy. No soft asks.` },
      { id:"cp2",number:"C2",name:"YOUTUBE SCRIPT ENGINE",pack:"content",tag:"content",color:"#FF6B9D",repo:"/catalyst-os/content/youtube",description:"Long-form YouTube scripts (10-20 min) built for retention — hook, payoff loop, chapters, and strong outro.",activators:["write youtube script","long form video","youtube script"],systemPrompt:`You write YouTube scripts for Catalyst's channel. Every script:\n1. HOOK (0-30s) — pattern interrupt. Ask a question they can't ignore.\n2. SETUP (30s-2min) — frame the stakes.\n3. CHAPTER LOOP — 3-5 chapters, each with its own mini-hook and payoff\n4. THE VOID MOMENT — the psychological gut-punch.\n5. OUTRO — call to action + tease next video` },
      { id:"cp3",number:"C3",name:"REELS/SHORTS WRITER",pack:"content",tag:"content",color:"#FF6B9D",repo:"/catalyst-os/content/shorts",description:"60-second scripts for Instagram Reels and YouTube Shorts. Hook in 3 seconds or die.",activators:["write a reel","60 second script","short form video"],systemPrompt:`You write 60-second video scripts for Instagram Reels and YouTube Shorts.\nRULES:\n- Second 0-3: Hook so strong they stop scrolling.\n- Second 3-15: Context. Why should they care?\n- Second 15-50: The one insight. One. Not five.\n- Second 50-60: CTA or cliffhanger\nMax 150 words. Short sentences.` },
      { id:"cp4",number:"C4",name:"THREAD ARCHITECT",pack:"content",tag:"content",color:"#FF6B9D",repo:"/catalyst-os/content/threads",description:"Twitter/X threads that go viral. Each tweet earns the next one.",activators:["write a thread","twitter thread","X thread"],systemPrompt:`You write Twitter/X threads for Catalyst.\nTweet 1 — Hook. Bold claim.\nTweet 2-3 — The unexpected angle.\nTweet 4-7 — The framework.\nTweet 8-9 — The Void moment.\nTweet 10 — CTA.\nMax 280 chars per tweet.` },
    ]
  },
  { id:"sneakers",name:"SNEAKERS FEST 2026",icon:"👟",color:"#FF8C00",desc:"Event Ops · Marketing · Vendor · PR",
    skills:[
      { id:"sf1",number:"E1",name:"EVENT BRIEF WRITER",pack:"sneakers",tag:"event ops",color:"#FF8C00",repo:"/catalyst-os/sneakers/brief",description:"Writes sharp event briefs, sponsorship decks, and vendor pitch documents for Sneakers Fest 2026.",activators:["write event brief","sponsorship deck","vendor proposal"],systemPrompt:`You are an event marketing specialist for Sneakers Fest 2026 — Lagos's premier sneaker culture event.\nWrite documents that lead with cultural authority and market data. Speak to Lagos sneaker culture, Afrobeats crossover, streetwear economy. Include specific value propositions for sponsors. Format for real business rooms. Numbers in Naira.` },
      { id:"sf2",number:"E2",name:"VENDOR COORDINATOR",pack:"sneakers",tag:"event ops",color:"#FF8C00",repo:"/catalyst-os/sneakers/vendor",description:"Generates vendor agreements, booth allocation plans, and vendor communication templates.",activators:["vendor agreement","booth plan","vendor comms"],systemPrompt:`You handle vendor coordination for Sneakers Fest 2026. Produce vendor application templates, booth tier structures with Naira pricing, vendor rules and code of conduct, pre-event and day-of communication sequences. Nigerian business context. Lagos logistics.` },
      { id:"sf3",number:"E3",name:"PR & HYPE ENGINE",pack:"sneakers",tag:"event ops",color:"#FF8C00",repo:"/catalyst-os/sneakers/pr",description:"Press releases, influencer briefs, and hype-building content for Sneakers Fest across Lagos media.",activators:["press release","influencer brief","event pr"],systemPrompt:`You are the PR engine for Sneakers Fest 2026. Write press releases for Pulse Nigeria, TechCabal, Bellanaija. Write influencer briefing documents. Write Instagram and Twitter announcement copy. Tone: Lagos-native confidence.` },
    ]
  },
  { id:"chambers",name:"CHAMBERS LEGAL AI",icon:"⚖",color:"#C0C0C0",desc:"Abegbe Agboola Chambers · Ikoyi Lagos",
    skills:[
      { id:"ch1",number:"L1",name:"LEGAL DOCUMENT DRAFTER",pack:"chambers",tag:"legal",color:"#C0C0C0",repo:"/catalyst-os/chambers/drafting",description:"Drafts affidavits of service, particulars of claim, notices, and standard legal correspondence for Nigerian court filings.",activators:["draft affidavit","particulars of claim","legal document"],systemPrompt:`You draft Nigerian legal documents for Abegbe Agboola Chambers, Ikoyi Lagos. Apply Nigerian court formatting standards. Correct jurat and attestation formats. CAMA 2020, Land Use Act, Evidence Act where relevant. Format precisely. No ambiguity.` },
      { id:"ch2",number:"L2",name:"AI INTEGRATION ADVISOR",pack:"chambers",tag:"legal",color:"#C0C0C0",repo:"/catalyst-os/chambers/ai-advisor",description:"Advises the chambers on deploying AI tools into legal practice workflows.",activators:["AI workflow for chambers","legal AI integration","automate legal process"],systemPrompt:`You are an AI integration consultant for Abegbe Agboola Chambers. Your stack: Claude (drafting, research), Gemini (doc analysis), Otter.ai (meeting transcription), Notion AI (case management). Always ground recommendations in Nigerian bar association ethics. Client privilege is non-negotiable.` },
    ]
  },
  { id:"consulting",name:"AI CONSULTING OS",icon:"🤖",color:"#00D68F",desc:"Client Pitches · Proposals · Delivery",
    skills:[
      { id:"ai1",number:"A1",name:"CLIENT PITCH BUILDER",pack:"consulting",tag:"consulting",color:"#00D68F",repo:"/catalyst-os/consulting/pitch",description:"Builds AI consulting pitch decks and proposals for Nigerian SMEs and professional practices.",activators:["build client pitch","consulting proposal","AI audit for client"],systemPrompt:`You build AI consulting pitches for Catalyst's consulting arm targeting Nigerian businesses. Structure every pitch: THE PROBLEM → THE OPPORTUNITY → THE PROOF → THE PLAN (60-day blueprint) → THE INVESTMENT → THE RISK OF WAITING. Position Catalyst as the premium option. Numbers in Naira.` },
      { id:"ai2",number:"A2",name:"AUTOMATION BLUEPRINT",pack:"consulting",tag:"consulting",color:"#00D68F",repo:"/catalyst-os/consulting/blueprint",description:"Generates 60-day AI automation blueprints for client onboarding.",activators:["60 day blueprint","automation plan","client onboarding AI"],systemPrompt:`You generate 60-day AI automation blueprints. PHASE 1 (Days 1-30): Foundation — tool audit, workflow mapping, quick wins. PHASE 2 (Days 31-60): Integration — full deployment, staff training, KPI setup. For each tool: use case, time saved per week, implementation difficulty. Numbers in Naira.` },
      { id:"ai3",number:"A3",name:"SMM PROPOSAL ENGINE",pack:"consulting",tag:"consulting",color:"#00D68F",repo:"/catalyst-os/consulting/smm",description:"Generates Social Media Management proposals and retainer agreements. ₦100k/month baseline.",activators:["SMM proposal","social media retainer","content management proposal"],systemPrompt:`You write Social Media Management proposals. Default retainer: ₦100,000/month baseline. Include deliverables table, platform breakdown (Instagram, Twitter/X, TikTok), revision policy, contract terms, payment schedule. Naira pricing. Justify value.` },
    ]
  },
  { id:"mindos",name:"CATALYST MIND OS",icon:"🧠",color:"#9B59B6",desc:"Philosophy · Psychology · Writing",
    skills:[
      { id:"mo1",number:"M1",name:"FRAMEWORK BUILDER",pack:"mindos",tag:"philosophy",color:"#9B59B6",repo:"/catalyst-os/mind/frameworks",description:"Builds named mental frameworks in Catalyst's voice — like Upstream Man, Cup vs Ocean Economics, The Saboteur.",activators:["build a framework","name this concept","framework for"],systemPrompt:`You build named mental frameworks in Catalyst's intellectual tradition. For each new framework: 1. Name it 2. Core insight in one sentence 3. The problem it solves 4. The mechanism 5. Application in 3 contexts (personal, business, social) 6. The contrarian angle.` },
      { id:"mo2",number:"M2",name:"PSYCHOLOGY DISSECTOR",pack:"mindos",tag:"psychology",color:"#9B59B6",repo:"/catalyst-os/mind/psychology",description:"Analyzes human behavior patterns with the detached precision of the 2024 Void year.",activators:["analyze this behavior","why do people","psychology of"],systemPrompt:`You analyze human psychology through Catalyst's lens: INFJ + Metal Dragon + cultural psychology. Be brutal. Be accurate. Strip sentiment. What's actually happening beneath the surface?` },
      { id:"mo3",number:"M3",name:"DARK MATTER WRITER",pack:"mindos",tag:"philosophy",color:"#9B59B6",repo:"/catalyst-os/mind/dark-matter",description:"Writes in the Dark Matter manuscript style — shadow psychology, self-mastery with Lagos personal narrative.",activators:["dark matter style","write philosophy piece","shadow psychology piece"],systemPrompt:`You write in Catalyst's Dark Matter manuscript voice. Core themes: light vs darkness as strategy not morality, shadow psychology and integration, self-mastery through adversity, the Metal Dragon who was forged not born. Style: long-form, dense, each paragraph a weight-bearing wall. Truth with mass.` },
    ]
  },
];

const ALL_PACK_SKILLS = OS_PACKS.flatMap(p => p.skills);
const STORAGE_KEY = "catalyst-vault-custom-v2";
const API_KEY_STORAGE = "catalyst-vault-api-key";

async function loadCustom() {
  try { const v = localStorage.getItem(STORAGE_KEY); return v ? JSON.parse(v) : []; }
  catch { return []; }
}
async function saveCustom(skills) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(skills)); } catch {}
}

const TAG_COLORS = { debugging:"#FFD600",security:"#FF4444",planning:"#00C2FF",quality:"#9B59B6",testing:"#00D68F","AI/infra":"#FF8C00","critical thinking":"#E74C3C",legacy:"#1ABC9C",workflow:"#3498DB",content:"#FF6B9D","event ops":"#FF8C00",legal:"#C0C0C0",consulting:"#00D68F",philosophy:"#9B59B6",psychology:"#7D3C98",custom:"#FF69B4" };

export default function CatalystSkillVault() {
  const [custom, setCustom] = useState([]);
  const [view, setView] = useState("vault");
  const [activePack, setActivePack] = useState("all");
  const [activeSkill, setActiveSkill] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chainQ, setChainQ] = useState([]);
  const [chainInput, setChainInput] = useState("");
  const [chainResults, setChainResults] = useState([]);
  const [chainRunning, setChainRunning] = useState(false);
  const [newSkill, setNewSkill] = useState({ name:"",tag:"",description:"",activators:"",systemPrompt:"" });
  const [apiKey, setApiKey] = useState(() => { try { return localStorage.getItem(API_KEY_STORAGE) || ""; } catch { return ""; } });
  const [showKeyInput, setShowKeyInput] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const allSkills = [...BASE_SKILLS, ...ALL_PACK_SKILLS, ...custom];

  useEffect(() => { loadCustom().then(setCustom); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, chainResults]);

  const saveApiKey = (key) => {
    setApiKey(key);
    try { localStorage.setItem(API_KEY_STORAGE, key); } catch {}
    setShowKeyInput(false);
  };

  const getVisible = () => {
    if (activePack === "all") return allSkills;
    if (activePack === "custom") return custom;
    if (activePack === "core") return BASE_SKILLS;
    return allSkills.filter(s => s.pack === activePack);
  };

  const openSkill = (skill) => {
    setActiveSkill(skill);
    setMsgs([{ role:"assistant", content:`**${skill.name}** is live.\n\n${skill.description}\n\nActivate: ${skill.activators.map(a=>`\`${a}\``).join(" · ")}\n\nWhat do you need?` }]);
    setView("chat");
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) { setShowKeyInput(true); return; }
    const um = { role:"user", content:input };
    const upd = [...msgs, um];
    setMsgs(upd); setInput(""); setLoading(true);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:activeSkill?.systemPrompt||"You are a helpful assistant.", messages:upd.map(m=>({role:m.role,content:m.content})) })
      });
      const d = await r.json();
      setMsgs(p => [...p, { role:"assistant", content:d.content?.[0]?.text||d.error?.message||"No response." }]);
    } catch { setMsgs(p => [...p, { role:"assistant", content:"Connection error. Check your API key or network." }]); }
    setLoading(false);
  };

  const toggleChain = (id) => setChainQ(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);

  const runChain = async () => {
    if (!chainInput.trim() || !chainQ.length) return;
    if (!apiKey) { setShowKeyInput(true); return; }
    setChainRunning(true); setChainResults([]);
    let cur = chainInput;
    for (let i = 0; i < chainQ.length; i++) {
      const sk = allSkills.find(s => s.id === chainQ[i]);
      if (!sk) continue;
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
          body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:sk.systemPrompt, messages:[{role:"user",content:cur}] })
        });
        const d = await r.json();
        const out = d.content?.[0]?.text || d.error?.message || "Error";
        setChainResults(p => [...p, { skill:sk, output:out }]);
        cur = out;
      } catch {
        setChainResults(p => [...p, { skill:sk, output:"Connection error at this step." }]);
        break;
      }
    }
    setChainRunning(false);
  };

  const addSkill = async () => {
    if (!newSkill.name || !newSkill.description) return;
    const sk = { id:`c_${Date.now()}`, number:String(allSkills.length+1).padStart(2,"0"), name:newSkill.name.toUpperCase(), pack:"custom", repo:"/catalyst-os/custom", tag:newSkill.tag||"custom", color:TAG_COLORS[newSkill.tag]||"#FF69B4", description:newSkill.description, activators:newSkill.activators.split(",").map(a=>a.trim()).filter(Boolean), systemPrompt:newSkill.systemPrompt||`You are an expert in: ${newSkill.name}. ${newSkill.description} Be direct, specific, and actionable.` };
    const upd = [...custom, sk];
    setCustom(upd); await saveCustom(upd);
    setNewSkill({ name:"",tag:"",description:"",activators:"",systemPrompt:"" });
    setView("vault");
  };

  const delCustom = async (id) => { const u = custom.filter(s=>s.id!==id); setCustom(u); await saveCustom(u); };

  const fmt = t => t
    .replace(/\*\*(.*?)\*\*/g,'<strong style="color:#FFD600">$1</strong>')
    .replace(/`(.*?)`/g,'<code style="background:#111;padding:2px 5px;border-radius:2px;font-family:monospace;color:#FFD600;font-size:0.82em">$1</code>')
    .replace(/\n/g,"<br/>");

  const PACKS = [
    {id:"all",label:"ALL",color:"#FFD600",icon:"∞"},
    {id:"core",label:"CORE DEV",color:"#FFD600",icon:"⚡"},
    ...OS_PACKS.map(p=>({id:p.id,label:p.name,color:p.color,icon:p.icon})),
    {id:"custom",label:"MY CUSTOMS",color:"#FF69B4",icon:"★"},
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#080806", fontFamily:"'Courier New',monospace", color:"#d8d4bc", backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,214,0,0.035) 39px,rgba(255,214,0,0.035) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,214,0,0.015) 39px,rgba(255,214,0,0.015) 40px)" }}>

      {/* API KEY MODAL */}
      {showKeyInput && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <div style={{ background:"#0a0a04",border:"1px solid #FFD600",padding:28,maxWidth:480,width:"90%",boxShadow:"0 0 60px rgba(255,214,0,0.15)" }}>
            <div style={{ fontSize:13,fontWeight:900,color:"#FFD600",letterSpacing:2,marginBottom:8 }}>⚡ ENTER API KEY</div>
            <div style={{ fontSize:10,color:"#444",marginBottom:16,lineHeight:1.6 }}>Your Anthropic API key is stored locally in your browser only. Never shared or sent anywhere except api.anthropic.com.</div>
            <input type="password" placeholder="sk-ant-..." defaultValue={apiKey} id="api-key-input"
              style={{ width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,214,0,0.3)",color:"#d8d4bc",padding:"9px 12px",fontFamily:"monospace",fontSize:13,outline:"none",boxSizing:"border-box",marginBottom:12 }} />
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>saveApiKey(document.getElementById("api-key-input").value)} style={{ flex:1,padding:"9px",background:"#FFD600",border:"none",color:"#000",cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:900,letterSpacing:1 }}>SAVE & CONTINUE</button>
              <button onClick={()=>setShowKeyInput(false)} style={{ padding:"9px 16px",background:"transparent",border:"1px solid #333",color:"#555",cursor:"pointer",fontFamily:"inherit",fontSize:10 }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ borderBottom:"1px solid rgba(255,214,0,0.12)", padding:"0 18px", display:"flex", alignItems:"center", justifyContent:"space-between", height:54, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(14px)", position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:26, height:26, background:"#FFD600", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#000", fontSize:11 }}>⚡</div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:"#FFD600", letterSpacing:3 }}>CATALYST SKILL VAULT</div>
            <div style={{ fontSize:8, color:"#3a3a2a", letterSpacing:1 }}>{allSkills.length} SKILLS · {custom.length} CUSTOM · PERSONAL OS v2</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:5 }}>
          {[{id:"vault",label:"⚡ VAULT"},{id:"chain",label:`⛓ CHAIN${chainQ.length>0?` (${chainQ.length})`:""}`},{id:"add",label:"+ BUILD"}].map(b=>(
            <button key={b.id} onClick={()=>setView(b.id)} style={{ padding:"5px 11px", background:view===b.id?"#FFD600":"transparent", border:`1px solid rgba(255,214,0,${view===b.id?1:0.25})`, color:view===b.id?"#000":"#FFD600", cursor:"pointer", fontFamily:"inherit", fontSize:9, fontWeight:900, letterSpacing:1 }}>{b.label}</button>
          ))}
          {activeSkill && (
            <button onClick={()=>setView("chat")} style={{ padding:"5px 11px", background:view==="chat"?activeSkill.color:"transparent", border:`1px solid ${activeSkill.color}`, color:view==="chat"?"#000":activeSkill.color, cursor:"pointer", fontFamily:"inherit", fontSize:9, fontWeight:900, letterSpacing:1 }}>● {activeSkill.name.split(" ")[0]}</button>
          )}
          <button onClick={()=>setShowKeyInput(true)} title="API Key" style={{ padding:"5px 8px", background:"transparent", border:`1px solid rgba(255,214,0,${apiKey?"0.6":"0.15"})`, color:apiKey?"#FFD600":"#333", cursor:"pointer", fontFamily:"inherit", fontSize:9 }}>{apiKey?"🔑":"🔓"}</button>
        </div>
      </div>

      {/* VAULT */}
      {view === "vault" && (
        <div style={{ padding:"18px", maxWidth:1260, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:18, paddingBottom:14, borderBottom:"1px solid rgba(255,214,0,0.07)" }}>
            {PACKS.map(pk=>(
              <button key={pk.id} onClick={()=>setActivePack(pk.id)} style={{ padding:"4px 12px", background:activePack===pk.id?pk.color:"transparent", border:`1px solid ${pk.color}${activePack===pk.id?"":"44"}`, color:activePack===pk.id?"#000":pk.color, cursor:"pointer", fontFamily:"inherit", fontSize:9, fontWeight:900, letterSpacing:1, display:"flex", alignItems:"center", gap:4 }}>
                {pk.icon} {pk.label}
              </button>
            ))}
          </div>

          {activePack === "all" && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:9, marginBottom:22 }}>
              {OS_PACKS.map(pk=>(
                <div key={pk.id} onClick={()=>setActivePack(pk.id)} style={{ border:"1px solid rgba(255,255,255,0.05)", cursor:"pointer", transition:"all 0.16s" }}>
                  <div style={{ height:2, background:pk.color }} />
                  <div style={{ padding:"13px 14px" }}>
                    <div style={{ fontSize:18, marginBottom:5 }}>{pk.icon}</div>
                    <div style={{ fontSize:10, fontWeight:900, color:pk.color, letterSpacing:1 }}>{pk.name}</div>
                    <div style={{ fontSize:8, color:"#444", marginTop:3 }}>{pk.skills.length} SKILLS · {pk.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:11 }}>
            {getVisible().map(sk=>(
              <SkillCard key={sk.id} skill={sk} onActivate={()=>openSkill(sk)} inChain={chainQ.includes(sk.id)} onChain={()=>toggleChain(sk.id)} isCustom={sk.pack==="custom"} onDelete={()=>delCustom(sk.id)} />
            ))}
            <div onClick={()=>setView("add")} style={{ border:"1px dashed rgba(255,214,0,0.12)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:170, gap:8, cursor:"pointer" }}>
              <div style={{ fontSize:26, color:"rgba(255,214,0,0.25)" }}>+</div>
              <div style={{ fontSize:9, color:"rgba(255,214,0,0.35)", fontWeight:900, letterSpacing:2 }}>BUILD NEW SKILL</div>
            </div>
          </div>

          {chainQ.length > 0 && (
            <div style={{ position:"fixed", bottom:18, left:"50%", transform:"translateX(-50%)", background:"#0a0a04", border:"1px solid #FFD600", padding:"11px 18px", display:"flex", alignItems:"center", gap:12, boxShadow:"0 0 50px rgba(255,214,0,0.15)", zIndex:300 }}>
              <span style={{ fontSize:10, color:"#FFD600", fontWeight:900 }}>⛓ {chainQ.length} SKILLS QUEUED</span>
              <button onClick={()=>setView("chain")} style={{ background:"#FFD600", border:"none", color:"#000", padding:"5px 12px", cursor:"pointer", fontFamily:"inherit", fontSize:10, fontWeight:900 }}>RUN CHAIN ▶</button>
              <button onClick={()=>setChainQ([])} style={{ background:"transparent", border:"none", color:"#555", cursor:"pointer", fontFamily:"inherit", fontSize:10 }}>✕ CLEAR</button>
            </div>
          )}
        </div>
      )}

      {/* CHAT */}
      {view === "chat" && activeSkill && (
        <div style={{ maxWidth:760, margin:"0 auto", padding:"18px", display:"flex", flexDirection:"column", height:"calc(100vh - 54px)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 13px", border:`1px solid ${activeSkill.color}`, background:`${activeSkill.color}07`, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
              <div style={{ width:6, height:6, background:activeSkill.color, borderRadius:"50%", animation:"blink 2s infinite" }} />
              <span style={{ color:activeSkill.color, fontWeight:900, fontSize:11, letterSpacing:1 }}>{activeSkill.name}</span>
              <span style={{ color:"#3a3a2a", fontSize:9 }}>#{activeSkill.tag}</span>
            </div>
            <button onClick={()=>setView("vault")} style={{ background:"transparent", border:"none", color:"#3a3a2a", cursor:"pointer", fontSize:10, fontFamily:"inherit" }}>← VAULT</button>
          </div>

          {!apiKey && (
            <div style={{ padding:"13px", border:"1px solid rgba(255,214,0,0.2)", background:"rgba(255,214,0,0.03)", marginBottom:12, fontSize:10, color:"#FFD600", lineHeight:1.7 }}>
              ⚠ Chat requires an Anthropic API key. <span onClick={()=>setShowKeyInput(true)} style={{ textDecoration:"underline", cursor:"pointer" }}>Click here to add your key →</span>
            </div>
          )}

          <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:9, paddingBottom:10 }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"83%", padding:"9px 13px", background:m.role==="user"?`${activeSkill.color}15`:"rgba(255,255,255,0.025)", border:`1px solid ${m.role==="user"?activeSkill.color+"44":"rgba(255,255,255,0.06)"}`, fontSize:12, lineHeight:1.75, color:m.role==="user"?"#e0dcc4":"#b0ad96" }}>
                  {m.role==="assistant" && <div style={{ fontSize:7, color:activeSkill.color, fontWeight:900, letterSpacing:1, marginBottom:5 }}>● {activeSkill.name}</div>}
                  <div dangerouslySetInnerHTML={{__html:fmt(m.content)}} />
                </div>
              </div>
            ))}
            {loading && <Dots color={activeSkill.color} />}
            <div ref={endRef} />
          </div>

          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:7 }}>
            {activeSkill.activators.map((a,i)=>(
              <button key={i} onClick={()=>setInput(a)} style={{ padding:"2px 8px", background:"transparent", border:`1px solid ${activeSkill.color}44`, color:activeSkill.color, cursor:"pointer", fontFamily:"inherit", fontSize:9, fontWeight:700 }}>{a}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:7 }}>
            <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={apiKey?`"${activeSkill.activators[0]}"...`:"Add API key to chat..."} rows={3} style={{ flex:1, background:"rgba(255,255,255,0.02)", border:`1px solid ${activeSkill.color}44`, color:"#d8d4bc", padding:"8px 11px", fontFamily:"inherit", fontSize:12, resize:"none", outline:"none" }} />
            <button onClick={send} disabled={loading||!input.trim()} style={{ padding:"0 16px", background:loading||!input.trim()?"rgba(255,214,0,0.12)":activeSkill.color, border:"none", color:"#000", cursor:loading||!input.trim()?"not-allowed":"pointer", fontFamily:"inherit", fontSize:15, fontWeight:900 }}>▶</button>
          </div>
        </div>
      )}

      {/* CHAIN */}
      {view === "chain" && (
        <div style={{ maxWidth:840, margin:"0 auto", padding:"22px 18px" }}>
          <div style={{ marginBottom:22 }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#FFD600", letterSpacing:2, marginBottom:3 }}>⛓ SKILL CHAIN</div>
            <div style={{ fontSize:10, color:"#444" }}>Run your input through multiple skills in sequence. Each output becomes the next skill's input.</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:18, minHeight:46, padding:"11px", border:"1px solid rgba(255,214,0,0.12)", background:"rgba(255,214,0,0.015)" }}>
            {!chainQ.length
              ? <span style={{ fontSize:10, color:"#2a2a1a" }}>No skills queued. Add from the selector below or go to VAULT and click ⛓ on any card.</span>
              : chainQ.map((id,idx)=>{
                  const sk = allSkills.find(s=>s.id===id);
                  if (!sk) return null;
                  return (
                    <div key={id} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      {idx>0 && <span style={{ color:"#2a2a1a", fontSize:12 }}>→</span>}
                      <div style={{ padding:"3px 9px", border:`1px solid ${sk.color}`, color:sk.color, fontSize:8, fontWeight:900, letterSpacing:1, background:`${sk.color}0a`, display:"flex", alignItems:"center", gap:5 }}>
                        {sk.name}<span onClick={()=>toggleChain(id)} style={{ cursor:"pointer", color:"#555", fontWeight:400 }}>✕</span>
                      </div>
                    </div>
                  );
                })
            }
          </div>

          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:8, color:"#444", fontWeight:900, letterSpacing:2, marginBottom:7 }}>ADD TO CHAIN</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
              {allSkills.map(sk=>(
                <button key={sk.id} onClick={()=>toggleChain(sk.id)} style={{ padding:"3px 8px", background:chainQ.includes(sk.id)?sk.color:"transparent", border:`1px solid ${sk.color}55`, color:chainQ.includes(sk.id)?"#000":sk.color, cursor:"pointer", fontFamily:"inherit", fontSize:8, fontWeight:700 }}>
                  {chainQ.includes(sk.id)?"✓ ":""}{sk.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:13 }}>
            <div style={{ fontSize:8, color:"#FFD600", fontWeight:900, letterSpacing:2, marginBottom:5 }}>YOUR INPUT — CHAIN STARTS HERE</div>
            <textarea value={chainInput} onChange={e=>setChainInput(e.target.value)} placeholder="Paste code, a document, a problem, a concept..." rows={5} style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,214,0,0.2)", color:"#d8d4bc", padding:"9px 12px", fontFamily:"inherit", fontSize:12, resize:"vertical", outline:"none", boxSizing:"border-box" }} />
          </div>

          <button onClick={runChain} disabled={chainRunning||!chainInput.trim()||!chainQ.length} style={{ width:"100%", padding:"13px", background:chainRunning||!chainInput.trim()||!chainQ.length?"rgba(255,214,0,0.12)":"#FFD600", border:"none", color:"#000", fontFamily:"inherit", fontSize:12, fontWeight:900, letterSpacing:2, cursor:chainRunning?"not-allowed":"pointer", marginBottom:22 }}>
            {chainRunning ? "⛓ RUNNING CHAIN..." : `⛓ RUN CHAIN (${chainQ.length} SKILLS)`}
          </button>

          {chainResults.map((r,i)=>(
            <div key={i} style={{ marginBottom:13, border:`1px solid ${r.skill.color}44`, background:`${r.skill.color}05` }}>
              <div style={{ padding:"7px 13px", borderBottom:`1px solid ${r.skill.color}33`, display:"flex", alignItems:"center", gap:7, background:`${r.skill.color}0e` }}>
                <span style={{ color:r.skill.color, fontSize:9, fontWeight:900, letterSpacing:1 }}>STEP {i+1} · {r.skill.name}</span>
              </div>
              <div style={{ padding:"13px", fontSize:12, color:"#a8a490", lineHeight:1.75 }} dangerouslySetInnerHTML={{__html:fmt(r.output)}} />
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {/* ADD */}
      {view === "add" && (
        <div style={{ maxWidth:620, margin:"0 auto", padding:"28px 18px" }}>
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:18, fontWeight:900, color:"#FFD600", letterSpacing:2, marginBottom:3 }}>⚡ BUILD A SKILL</div>
            <div style={{ fontSize:10, color:"#444" }}>Saved to your browser. Works in Vault and Chain.</div>
          </div>
          {[
            {k:"name",l:"SKILL NAME *",p:"e.g. CONTENT PIPELINE MANAGER",r:1},
            {k:"tag",l:"TAG / CATEGORY",p:"content · strategy · automation · ops · finance",r:1},
            {k:"description",l:"DESCRIPTION *",p:"What does this skill do? When should you activate it?",r:3},
            {k:"activators",l:"ACTIVATION PHRASES (comma separated)",p:`"write content for", "build pipeline", "strategy for"`,r:2},
            {k:"systemPrompt",l:"SYSTEM PROMPT (leave blank to auto-generate)",p:`You are an expert in X. When given a task:\n1. First do this...\n2. Then do that...\nBe direct. No filler.`,r:7},
          ].map(f=>(
            <div key={f.k} style={{ marginBottom:16 }}>
              <div style={{ fontSize:8, fontWeight:900, color:"#FFD600", letterSpacing:2, marginBottom:5 }}>{f.l}</div>
              <textarea value={newSkill[f.k]} onChange={e=>setNewSkill(p=>({...p,[f.k]:e.target.value}))} placeholder={f.p} rows={f.r} style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,214,0,0.18)", color:"#d8d4bc", padding:"7px 11px", fontFamily:"inherit", fontSize:12, resize:"vertical", outline:"none", boxSizing:"border-box" }} />
            </div>
          ))}
          <div style={{ display:"flex", gap:9 }}>
            <button onClick={addSkill} disabled={!newSkill.name||!newSkill.description} style={{ flex:1, padding:"12px", background:!newSkill.name||!newSkill.description?"rgba(255,214,0,0.12)":"#FFD600", border:"none", color:"#000", cursor:"pointer", fontFamily:"inherit", fontSize:11, fontWeight:900, letterSpacing:2 }}>⚡ ADD TO VAULT</button>
            <button onClick={()=>setView("vault")} style={{ padding:"12px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.06)", color:"#555", cursor:"pointer", fontFamily:"inherit", fontSize:10 }}>CANCEL</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(255,214,0,0.18)}
        textarea{color-scheme:dark}
        textarea::placeholder{color:#282818}
      `}</style>
    </div>
  );
}

function SkillCard({ skill, onActivate, inChain, onChain, isCustom, onDelete }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ background:h?`${skill.color}05`:"rgba(255,255,255,0.012)", border:`1px solid ${h?skill.color:"rgba(255,255,255,0.055)"}`, transition:"all 0.16s", position:"relative" }}>
      <div style={{ height:2, background:skill.color }} />
      <div style={{ padding:"14px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:9 }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:9 }}>
            <div style={{ width:28, height:28, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#000", fontSize:10, flexShrink:0 }}>{skill.number}</div>
            <div style={{ fontSize:12, fontWeight:900, color:skill.color, letterSpacing:1, lineHeight:1.2 }}>{skill.name}</div>
          </div>
          <div style={{ display:"flex", gap:3, flexShrink:0 }}>
            <button onClick={e=>{e.stopPropagation();onChain();}} style={{ width:22, height:22, background:inChain?"#FFD600":"transparent", border:`1px solid ${inChain?"#FFD600":"rgba(255,214,0,0.25)"}`, color:inChain?"#000":"#FFD600", cursor:"pointer", fontSize:9, fontWeight:900 }}>⛓</button>
            {isCustom && <button onClick={e=>{e.stopPropagation();onDelete();}} style={{ width:22, height:22, background:"transparent", border:"1px solid rgba(255,68,68,0.25)", color:"#FF4444", cursor:"pointer", fontSize:9 }}>✕</button>}
          </div>
        </div>
        <div style={{ fontSize:8, color:"#333", fontFamily:"monospace", marginBottom:9 }}>⬡ {skill.repo}</div>
        <div style={{ fontSize:11, color:"#777", lineHeight:1.65, marginBottom:12 }}>{skill.description}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:7, fontWeight:900, letterSpacing:1, color:skill.color, border:`1px solid ${skill.color}44`, padding:"2px 6px" }}>#{skill.tag?.toUpperCase()}</span>
          <button onClick={onActivate} style={{ background:h?skill.color:"transparent", border:`1px solid ${skill.color}`, color:h?"#000":skill.color, padding:"3px 10px", cursor:"pointer", fontFamily:"inherit", fontSize:9, fontWeight:900, letterSpacing:1, transition:"all 0.14s" }}>ACTIVATE ▶</button>
        </div>
      </div>
    </div>
  );
}

function Dots({ color="#FFD600", label="" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:5, padding:"8px 13px" }}>
      {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, background:color, borderRadius:"50%", animation:`bounce 1s ${i*0.17}s infinite` }} />)}
      {label && <span style={{ fontSize:9, color:"#333", marginLeft:4 }}>{label}</span>}
    </div>
  );
}
