"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, Atom, BookOpen, BookOpenCheck, BrainCircuit,
  Check, ChevronDown, CircleHelp, Clock3, Command, Download, FileText, Flame,
  GraduationCap, History, Layers3, Lightbulb, Menu, Moon, MoreHorizontal, PanelLeftClose,
  PlayCircle, Plus, Search, Settings2, Sparkles, Sun, Target, Upload, Youtube,
  X, ChartNoAxesCombined, Calculator, Network, Printer, Bookmark, ClipboardCheck
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { createStudyPack, extractStudySignals, type StudyPack } from "@/lib/study";
import { exportDocx } from "@/lib/export";

type Tab = "overview" | "notes" | "visuals" | "formula" | "practice" | "youtube" | "revision";
const navItems: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: Layers3 },
  { id: "notes", label: "Chapter notes", icon: BookOpen },
  { id: "visuals", label: "Visual studio", icon: ChartNoAxesCombined },
  { id: "formula", label: "Formula lab", icon: Calculator },
  { id: "practice", label: "Exam practice", icon: ClipboardCheck },
  { id: "youtube", label: "Video analyser", icon: Youtube },
  { id: "revision", label: "Quick revision", icon: Clock3 },
];
const chartData = [
  { topic: "Concepts", value: 85 }, { topic: "Definitions", value: 72 },
  { topic: "Examples", value: 66 }, { topic: "Practice", value: 48 },
  { topic: "Recall", value: 58 },
];

export default function Home() {
  const [dark, setDark] = useState(true);
  const [font, setFont] = useState("Inter");
  const [fontScale, setFontScale] = useState("100");
  const [active, setActive] = useState<Tab>("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chapter, setChapter] = useState("Light — Reflection and Refraction");
  const [subject, setSubject] = useState("Science");
  const [className, setClassName] = useState("Class 10");
  const [board, setBoard] = useState("UP Board");
  const [language, setLanguage] = useState("English");
  const [pack, setPack] = useState<StudyPack>(() => createStudyPack("Light — Reflection and Refraction", "Science", "Class 10", "UP Board"));
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoResult, setVideoResult] = useState<{points:string[];questions:string[]}|null>(null);
  const [quizChoice, setQuizChoice] = useState<number|null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("studyforge-theme");
    if (savedTheme) setDark(savedTheme === "dark");
    const savedPack = localStorage.getItem("studyforge-pack");
    if (savedPack) {
      try { setPack(JSON.parse(savedPack)); setChapter(JSON.parse(savedPack).title); setSaved(true); } catch {}
    }
  }, []);
  useEffect(() => { localStorage.setItem("studyforge-theme", dark ? "dark" : "light"); }, [dark]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2800); };
  const generate = () => {
    const next = createStudyPack(chapter, subject, className, board);
    setPack(next); setGenerated(true); setActive("notes"); setSaved(false);
    notify("Your chapter workspace is ready");
  };
  const saveLocal = () => {
    localStorage.setItem("studyforge-pack", JSON.stringify(pack));
    setSaved(true); notify("Study pack saved on this device");
  };
  const analyseVideo = () => {
    const result = extractStudySignals(transcript);
    setVideoResult(result);
    if (!transcript.trim()) notify("Paste a transcript or your notes first");
    else if (!result.points.length) notify("Transcript loaded — try adding more spoken content");
    else notify("Transcript analysed locally");
  };
  const allText = useMemo(() => `${pack.title} ${pack.summary} ${pack.keyPoints.join(" ")} ${pack.questions.map(q=>q.question).join(" ")}`.toLowerCase(), [pack]);
  const filteredPoints = pack.keyPoints.filter(p => p.toLowerCase().includes(search.toLowerCase()));
  const activeLabel = navItems.find(n => n.id === active)?.label || "Overview";

  return (
    <main className="app-shell" style={{fontFamily: font === "Inter" ? "Inter, ui-sans-serif, system-ui, sans-serif" : font === "Serif" ? "Georgia, 'Times New Roman', serif" : "'Trebuchet MS', Arial, sans-serif", fontSize: `${fontScale}%`}}>
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><BrainCircuit size={22}/></div>
          <div><div className="brand-name">StudyForge <span>AI</span></div><div className="brand-caption">YOUR EXAM COPILOT</div></div>
          <button className="icon-button mobile-close" onClick={()=>setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <button className="workspace-switch"><div className="workspace-icon"><GraduationCap size={18}/></div><div className="workspace-copy"><strong>My study space</strong><small>{className} workspace</small></div><ChevronDown size={15}/></button>
        <div className="side-label">WORKSPACE</div>
        <nav className="nav-list">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${active===item.id?"active":""}`} onClick={()=>{setActive(item.id);setMobileMenu(false);}}>
              <Icon size={17}/><span>{item.label}</span>{item.id==="youtube" && <span className="new-dot"/>}
            </button>;
          })}
        </nav>
        <div className="side-label side-label-spaced">YOUR LIBRARY</div>
        <button className="nav-item" onClick={()=>{setActive("revision");notify("Showing your revision checklist");}}><Bookmark size={17}/><span>Saved study packs</span><span className="nav-count">{saved?"1":"0"}</span></button>
        <button className="nav-item" onClick={()=>notify("Upload support can be connected to your file pipeline")}><Upload size={17}/><span>Import materials</span></button>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={16}/></div><strong>Make every minute count</strong>
            <p>Build a focused revision plan around your next exam.</p>
            <button onClick={()=>setActive("revision")}>Open revision plan <ArrowRight size={14}/></button>
          </div>
          <div className="profile-row"><div className="avatar">S</div><div className="profile-copy"><strong>Student workspace</strong><small>Local device mode</small></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-scrim" aria-label="Close menu" onClick={()=>setMobileMenu(false)}/>}
      <section className="main-panel">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu-button" onClick={()=>setMobileMenu(true)} aria-label="Open menu"><Menu size={19}/></button><div className="breadcrumb">Workspace <span>/</span> <strong>{activeLabel}</strong></div></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={15}/><input aria-label="Search study pack" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search this chapter"/><kbd>⌘ K</kbd></div>
            <button className="icon-button" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
            <button className="avatar top-avatar" title="Student profile">S</button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR PERSONAL LEARNING SPACE</div><h1>{active==="overview"?"Your next chapter, mastered.":activeLabel}</h1><p className="page-subtitle">Turn tough topics into clear notes, visual explanations and exam-ready revision.</p></div>
            <div className="heading-actions"><button className="button button-secondary" onClick={saveLocal}><Bookmark size={15}/>{saved?"Saved locally":"Save pack"}</button><button className="button button-primary" onClick={()=>window.print()}><Printer size={15}/>Print / PDF</button></div>
          </div>

          {active==="overview" && <>
            <section className="hero-card">
              <div className="hero-glow glow-one"/><div className="hero-glow glow-two"/>
              <div className="hero-copy">
                <div className="hero-pill"><Sparkles size={13}/> CHAPTER-TO-STUDY-PACK <span>✦</span></div>
                <h2>Understand more.<br/><span>Memorise less.</span></h2>
                <p>Enter your chapter. Get a complete study workspace built for how exams actually work.</p>
                <div className="hero-meta"><span><Check size={13}/> Structured notes</span><span><Check size={13}/> Visual revision</span><span><Check size={13}/> Exam practice</span></div>
              </div>
              <div className="hero-art" aria-hidden="true"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="art-core"><BrainCircuit size={42}/></div><div className="float-card float-top"><Atom size={16}/><span>Learn</span><b>01</b></div><div className="float-card float-right"><ChartNoAxesCombined size={16}/><span>Visualise</span><b>02</b></div><div className="float-card float-bottom"><Target size={16}/><span>Revise</span><b>03</b></div></div>
            </section>

            <section className="generator-card">
              <div className="section-heading"><div><div className="section-kicker">START LEARNING</div><h3>Build your study pack</h3><p>Set your syllabus details to create a focused chapter workspace.</p></div><div className="step-tag"><span>✦</span> 01 / GENERATE</div></div>
              <div className="form-grid">
                <label className="field field-wide"><span>Chapter or topic</span><div className="input-wrap"><BookOpen size={17}/><input value={chapter} onChange={e=>setChapter(e.target.value)} placeholder="e.g. Nationalism in India"/></div></label>
                <label className="field"><span>Class / grade</span><select value={className} onChange={e=>setClassName(e.target.value)}><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option><option>Class 11</option><option>Class 12</option><option>College</option></select></label>
                <label className="field"><span>Subject</span><select value={subject} onChange={e=>setSubject(e.target.value)}><option>Science</option><option>Mathematics</option><option>History</option><option>Geography</option><option>Civics</option><option>English</option><option>Economics</option><option>Computer Science</option><option>General Studies</option></select></label>
                <label className="field"><span>Board / curriculum</span><select value={board} onChange={e=>setBoard(e.target.value)}><option>UP Board</option><option>CBSE</option><option>ICSE</option><option>State Board</option><option>Other</option></select></label>
                <label className="field"><span>Output language</span><select value={language} onChange={e=>setLanguage(e.target.value)}><option>English</option><option>Hindi</option><option>Hinglish</option></select></label>
              </div>
              <div className="generator-footer"><div className="privacy-note"><div className="privacy-icon"><Layers3 size={15}/></div><span><strong>One topic. A whole study system.</strong><small>Organised notes, practice and revision in one place.</small></span></div><button className="button button-primary generate-button" onClick={generate}><Sparkles size={16}/> Generate study pack <ArrowRight size={15}/></button></div>
            </section>

            <div className="section-heading compact-heading"><div><div className="section-kicker">YOUR STUDY TOOLKIT</div><h3>Everything you need to feel exam-ready</h3></div><button className="text-button" onClick={()=>setActive("notes")}>Explore tools <ArrowRight size={14}/></button></div>
            <div className="tool-grid">
              <button className="tool-card" onClick={()=>setActive("notes")}><div className="tool-icon violet"><BookOpenCheck size={20}/></div><div className="tool-copy"><strong>Smart notes</strong><p>Clear explanations, key terms and structured summaries.</p><span>OPEN NOTES <ArrowRight size={12}/></span></div></button>
              <button className="tool-card" onClick={()=>setActive("visuals")}><div className="tool-icon teal"><Network size={20}/></div><div className="tool-copy"><strong>Visual studio</strong><p>Turn complex ideas into charts, maps and timelines.</p><span>MAKE VISUALS <ArrowRight size={12}/></span></div></button>
              <button className="tool-card" onClick={()=>setActive("formula")}><div className="tool-icon amber"><Calculator size={20}/></div><div className="tool-copy"><strong>Formula lab</strong><p>Remember rules with easy steps and worked methods.</p><span>LEARN FORMULAS <ArrowRight size={12}/></span></div></button>
              <button className="tool-card" onClick={()=>setActive("practice")}><div className="tool-icon rose"><Target size={20}/></div><div className="tool-copy"><strong>Exam practice</strong><p>Test your recall with short and long-answer questions.</p><span>START PRACTICE <ArrowRight size={12}/></span></div></button>
            </div>
          </>}

          {active==="notes" && <section className="workspace-grid">
            <div className="primary-column">
              <div className="content-card">
                <div className="card-topline"><div><div className="section-kicker">CHAPTER OVERVIEW</div><h2>{pack.title}</h2><p>{pack.className} · {pack.subject} · {board}</p></div><span className="status-chip"><span/> Study pack</span></div>
                <div className="summary-panel"><div className="summary-icon"><Lightbulb size={18}/></div><div><strong>In simple words</strong><p>{pack.summary}</p></div></div>
                <h3 className="subheading">Key ideas to remember</h3>
                <div className="key-list">{filteredPoints.map((point,i)=><div className="key-row" key={point}><span className="key-number">{String(i+1).padStart(2,"0")}</span><p>{point}</p><Check size={15}/></div>)}{filteredPoints.length===0&&<p className="muted">No key points match your search.</p>}</div>
                <div className="note-footer"><span><BookOpen size={14}/> Built for {pack.className}</span><button className="text-button" onClick={()=>setActive("practice")}>Practise these ideas <ArrowRight size={14}/></button></div>
              </div>
            </div>
            <aside className="right-column"><div className="content-card compact-card"><div className="card-title-row"><h3>Study preferences</h3><Settings2 size={17}/></div><label className="field"><span>Reading font</span><select value={font} onChange={e=>setFont(e.target.value)}><option>Inter</option><option>Serif</option><option>Trebuchet</option></select></label><label className="field"><span>Text size</span><select value={fontScale} onChange={e=>setFontScale(e.target.value)}><option value="90">Small</option><option value="100">Default</option><option value="110">Large</option><option value="120">Extra large</option></select></label><button className="button button-secondary full-button" onClick={()=>window.print()}><Printer size={15}/> Print these notes</button></div><div className="tip-card"><div className="tip-symbol"><Sparkles size={17}/></div><strong>Active recall tip</strong><p>Hide your notes, explain each key point aloud, then check what you missed.</p></div></aside>
          </section>}

          {active==="visuals" && <section className="visual-layout">
            <div className="content-card chart-card"><div className="card-topline"><div><div className="section-kicker">VISUAL STUDY MAP</div><h2>Chapter mastery dashboard</h2><p>A sample view of skills to review — not a measured score.</p></div><span className="mini-badge"><ChartNoAxesCombined size={13}/> Visual</span></div><div className="chart-area"><ResponsiveContainer width="100%" height={280}><BarChart data={chartData} margin={{top:8,right:12,left:-18,bottom:4}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)"/><XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:12}}/><YAxis axisLine={false} tickLine={false} tick={{fill:"var(--muted)",fontSize:12}}/><Tooltip contentStyle={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:12,color:"var(--text)"}}/><Bar dataKey="value" fill="#8B78F6" radius={[7,7,0,0]} barSize={30}/></BarChart></ResponsiveContainer></div><div className="chart-caption"><span><i className="legend-dot violet-dot"/> Example revision priorities</span><span>Illustrative data</span></div></div>
            <div className="content-card"><div className="card-topline"><div><div className="section-kicker">BUILD A VISUAL</div><h2>Choose a visual format</h2><p>Use these as templates for your chapter.</p></div></div><div className="visual-options"><button onClick={()=>notify("Mind map template selected — add your chapter headings to expand it")}><div className="visual-thumb mindmap"><span>MAIN IDEA</span><i/><b/><em/></div><strong>Mind map</strong><small>Connect ideas and subtopics</small></button><button onClick={()=>notify("Timeline template selected — add textbook dates and events")}><div className="visual-thumb timeline"><i/><i/><i/><i/></div><strong>Timeline</strong><small>Dates, events and cause/effect</small></button><button onClick={()=>notify("Process chart template selected — add steps from your notes")}><div className="visual-thumb flow"><i>01</i><b>→</b><i>02</i><b>→</b><i>03</i></div><strong>Flowchart</strong><small>Explain a process step by step</small></button><button onClick={()=>notify("Comparison table template selected")}><div className="visual-thumb compare"><i/><i/><i/><i/><i/><i/></div><strong>Comparison chart</strong><small>Compare terms side by side</small></button></div></div>
          </section>}

          {active==="formula" && <section className="content-card"><div className="card-topline"><div><div className="section-kicker">REMEMBER THE METHOD</div><h2>Formula lab & easy steps</h2><p>Learn the method, not just the final line.</p></div><div className="tool-icon amber"><Calculator size={20}/></div></div><div className="formula-list">{pack.formulas.map((f,i)=><div className="formula-card" key={f.name}><div className="formula-index">{String(i+1).padStart(2,"0")}</div><div className="formula-body"><h3>{f.name}</h3><div className="formula-equation">{f.formula}</div><p>{f.explanation}</p><div className="worked-example"><Lightbulb size={15}/><span><strong>Easy example:</strong> {f.example}</span></div></div><button className="icon-button" onClick={()=>{navigator.clipboard?.writeText(`${f.name}\n${f.formula}\n${f.explanation}`);notify("Method copied")}} aria-label="Copy formula"><FileText size={16}/></button></div>)}</div><div className="notice-box"><CircleHelp size={17}/><p><strong>Subject-specific accuracy:</strong> These are study-method templates until you add the actual textbook content. Use the chapter text to create exact formulas and worked solutions.</p></div></section>}

          {active==="practice" && <section className="practice-layout"><div className="content-card practice-main"><div className="section-kicker">EXAM MODE</div><h2>Check what you know</h2><p className="muted">Practice questions for <strong>{pack.title}</strong>. Answers are hidden until you reveal them.</p><div className="question-progress"><span>QUESTION 01 / 04</span><div><i style={{width:"25%"}}/></div></div><h3 className="quiz-question">{pack.questions[0].question}</h3><div className="answer-options">{["Write a clear definition and explain its importance.","Skip definitions and write unrelated examples.","Write only the title of the chapter.","Memorise without understanding the topic."].map((option,i)=><button key={option} className={`answer-option ${quizChoice===i?(i===0?"correct":"incorrect"):""}`} onClick={()=>{setQuizChoice(i);setShowAnswer(false)}}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{quizChoice===i&&<Check size={16}/>}</button>)}</div>{quizChoice!==null&&<div className={`feedback ${quizChoice===0?"good":"try-again"}`}>{quizChoice===0?"Good approach!":"Try again. Think about what a complete answer should include."}</div>}<button className="button button-primary" onClick={()=>setShowAnswer(!showAnswer)}>{showAnswer?"Hide suggested answer":"Reveal suggested answer"} <ArrowRight size={15}/></button>{showAnswer&&<div className="answer-reveal"><strong>Suggested answer · {pack.questions[0].marks}</strong><p>{pack.questions[0].answer}</p></div>}</div><aside className="content-card score-card"><div className="tool-icon violet"><Target size={20}/></div><h3>Practice session</h3><p>Build confidence with a little practice every day.</p><div className="score-stat"><strong>04</strong><span>Practice prompts</span></div><div className="score-stat"><strong>{quizChoice===0?"01":"00"}</strong><span>Correct selection</span></div><button className="button button-secondary full-button" onClick={()=>{setQuizChoice(null);setShowAnswer(false)}}>Reset practice</button></aside></section>}

          {active==="youtube" && <section className="youtube-layout"><div className="content-card video-input-card"><div className="video-heading"><div className="youtube-icon"><Youtube size={22}/></div><div><div className="section-kicker">WATCH LESS. REVISE SMARTER.</div><h2>YouTube lesson analyser</h2><p>Turn a lesson transcript into revision points and practice prompts.</p></div></div><label className="field"><span>YouTube video URL (for your reference)</span><div className="input-wrap"><PlayCircle size={17}/><input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..."/></div></label><label className="field transcript-field"><span>Paste transcript, captions or your lesson notes</span><textarea rows={8} value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="Paste the available transcript here. Include the teacher's important questions, definitions, examples and explanations…"/></label><div className="transcript-note"><Lightbulb size={15}/><span>This demo analyses text locally in your browser. A URL alone does not provide video captions; paste an available transcript. A production version can connect to a permitted transcript service.</span></div><button className="button button-primary" onClick={analyseVideo}><Sparkles size={15}/> Analyse transcript <ArrowRight size={15}/></button></div><div className="content-card video-result-card"><div className="section-kicker">YOUR TAKEAWAYS</div><h3>High-value revision signals</h3>{videoResult ? <>{videoResult.points.length ? <><div className="result-list">{videoResult.points.map((p,i)=><div className="result-item" key={i}><span>{String(i+1).padStart(2,"0")}</span><p>{p}</p></div>)}</div><h4>Practice prompts</h4>{videoResult.questions.map((q,i)=><div className="mini-question" key={i}><CircleHelp size={15}/>{q}</div>)}</>:<p className="muted">No clear sentences found yet. Paste a longer transcript or caption text.</p>}</>:<div className="empty-analysis"><div className="empty-orbit"><Youtube size={27}/></div><strong>Your analysis will appear here</strong><p>Key ideas, revision signals and practice questions extracted from the text you provide.</p></div>}</div></section>}

          {active==="revision" && <section className="revision-layout"><div className="content-card revision-sheet"><div className="revision-header"><div><div className="section-kicker">THE FINAL 15 MINUTES</div><h2>Last-minute revision sheet</h2><p>{pack.title} · {pack.subject}</p></div><div className="revision-stamp">QUICK<br/>RECALL</div></div><div className="revision-summary"><strong>Chapter in a nutshell</strong><p>{pack.summary}</p></div><h3 className="subheading">Before you close the book</h3>{pack.revision.map((item,i)=><label className="check-row" key={item}><input type="checkbox"/><span>{item}</span></label>)}<div className="revision-bottom"><span>Keep it simple. Recall first, check second.</span><button className="button button-primary" onClick={()=>window.print()}><Printer size={15}/> Print revision sheet</button></div></div><aside className="content-card"><div className="section-kicker">QUICK SETTINGS</div><h3>Make it yours</h3><label className="field"><span>Reading font</span><select value={font} onChange={e=>setFont(e.target.value)}><option>Inter</option><option>Serif</option><option>Trebuchet</option></select></label><label className="field"><span>Text size</span><select value={fontScale} onChange={e=>setFontScale(e.target.value)}><option value="90">Small</option><option value="100">Default</option><option value="110">Large</option><option value="120">Extra large</option></select></label><button className="button button-secondary full-button" onClick={saveLocal}><Bookmark size={15}/> Save to this device</button><button className="button button-secondary full-button" onClick={()=>exportDocx(pack)}><Download size={15}/> Export Word document</button></aside></section>}

          <section className="export-strip"><div className="export-icon"><ArrowDownToLine size={18}/></div><div className="export-copy"><strong>Your notes. Your files. Your device.</strong><p>Export a clean Word document or use Print / PDF to save a portable copy.</p></div><div className="export-actions"><button className="button button-secondary" onClick={()=>exportDocx(pack)}><FileText size={15}/> Export Word</button><button className="button button-primary" onClick={()=>window.print()}><Download size={15}/> Save PDF</button></div></section>
          <footer className="page-footer"><span>✦ Made for focused learning</span><span>StudyForge AI <i/> Local-first prototype</span></footer>
        </div>
      </section>
      {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
    </main>
  );
}
