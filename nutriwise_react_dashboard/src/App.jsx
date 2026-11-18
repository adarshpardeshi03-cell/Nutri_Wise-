import { useEffect, useMemo, useState } from "react";
import {
  Activity, Apple, BarChart3, Bell, BookOpen, Check, ChevronDown,
  CircleHelp, Droplets, Flame, Heart, Home, Leaf, Menu, Moon,
  Plus, Salad, Settings, Sparkles, Target, TrendingUp, Utensils,
  X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis
} from "recharts";

const defaultHabits = [
  { id: "water", title: "Drink water regularly", detail: "Hydration", icon: "water", done: true },
  { id: "produce", title: "Eat fruit or vegetables", detail: "Nutrition", icon: "produce", done: true },
  { id: "move", title: "Move your body for 20 minutes", detail: "Activity", icon: "move", done: true },
  { id: "break", title: "Take a mindful screen break", detail: "Mindfulness", icon: "break", done: false },
  { id: "sleep", title: "Keep a consistent bedtime", detail: "Sleep", icon: "sleep", done: false }
];

const foodAdvice = {
  balanced: {
    title: "A balanced choice — nice work!",
    text: "Build your plate with a mix of vegetables or fruit, a protein food such as dal, beans, eggs or paneer, and a grain such as roti or rice. Choose portions that suit your appetite."
  },
  fast: {
    title: "You can enjoy it mindfully.",
    text: "Fast food does not need to be forbidden. Consider a moderate portion, add vegetables if available, and choose water more often. Balance your overall eating pattern rather than judging one meal."
  },
  sweet: {
    title: "A treat can fit into balance.",
    text: "Enjoy a portion you like, slowly and without guilt. Keep regular meals and a variety of nourishing foods in your routine too."
  },
  snack: {
    title: "Choose a snack that satisfies you.",
    text: "Fruit, curd, roasted chana, nuts, sprouts or a simple homemade sandwich can be convenient options. Consider allergies and your own dietary needs."
  }
};

const mealIdeas = [
  { time: "BREAKFAST", name: "Vegetable poha + curd", note: "Add peas, peanuts or a side of fruit", emoji: "🥣", tag: "Balanced idea" },
  { time: "LUNCH", name: "Dal, roti, sabzi + salad", note: "A familiar mix of protein, grains and vegetables", emoji: "🍛", tag: "Balanced idea" },
  { time: "SNACK", name: "Banana + handful of nuts", note: "Adjust portions to your appetite", emoji: "🍌", tag: "Quick snack" },
  { time: "DINNER", name: "Vegetable khichdi + curd", note: "A simple, comforting meal option", emoji: "🥘", tag: "Balanced idea" }
];

const initialWeek = [
  { day: "Mon", score: 55 }, { day: "Tue", score: 64 }, { day: "Wed", score: 61 },
  { day: "Thu", score: 72 }, { day: "Fri", score: 68 }, { day: "Sat", score: 82 },
  { day: "Sun", score: 76 }
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function IconTile({ children, tint = "mint" }) {
  return <span className={`icon-tile ${tint}`}>{children}</span>;
}

function Sidebar({ active, setActive, mobileOpen, closeMobile }) {
  const links = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "food-advisor", label: "Food advisor", icon: Salad },
    { id: "habits", label: "Daily habits", icon: Check },
    { id: "meal-ideas", label: "Meal ideas", icon: Utensils },
    { id: "insights", label: "Wellness guide", icon: BookOpen }
  ];
  return <>
    {mobileOpen && <button className="mobile-scrim" onClick={closeMobile} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-symbol"><Leaf size={21} /></div>
        <div><strong>nutriwise</strong><small>WELLNESS DASHBOARD</small></div>
        <button className="close-menu" onClick={closeMobile}><X size={19}/></button>
      </div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav">
        {links.map(({ id, label, icon: Icon }) => (
          <a key={id} href={`#${id}`} className={active === id ? "active" : ""}
            onClick={() => { setActive(id); closeMobile(); }}>
            <Icon size={18} strokeWidth={1.8}/><span>{label}</span>
          </a>
        ))}
      </nav>
      <div className="nav-caption resources-caption">PREFERENCES</div>
      <div className="side-note">
        <div className="note-icon"><Sparkles size={17}/></div>
        <strong>Small steps matter</strong>
        <p>Build a routine that works for your life. Consistency is more useful than perfection.</p>
        <a href="#habits" onClick={() => { setActive("habits"); closeMobile(); }}>View today's habits <span>→</span></a>
      </div>
      <div className="sidebar-footer"><span className="online-dot"/> Your wellness space <span>v1.0</span></div>
    </aside>
  </>;
}

function App() {
  const [habits, setHabits] = useState(() => readStorage("nutriwise-habits", defaultHabits));
  const [water, setWater] = useState(() => readStorage("nutriwise-water", 5));
  const [foodLog, setFoodLog] = useState(() => readStorage("nutriwise-foodlog", []));
  const [active, setActive] = useState("overview");
  const [selectedFood, setSelectedFood] = useState("");
  const [adviceOpen, setAdviceOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [chartRange, setChartRange] = useState("7 days");

  useEffect(() => localStorage.setItem("nutriwise-habits", JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem("nutriwise-water", JSON.stringify(water)), [water]);
  useEffect(() => localStorage.setItem("nutriwise-foodlog", JSON.stringify(foodLog)), [foodLog]);

  const completed = habits.filter(h => h.done).length;
  const habitPercent = Math.round(completed / habits.length * 100);
  const score = Math.min(100, 48 + Math.round(habitPercent * 0.42) + Math.min(foodLog.length * 2, 10));
  const today = new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const weeklyData = useMemo(() => chartRange === "7 days" ? initialWeek : [
    {day:"W1",score:58},{day:"W2",score:64},{day:"W3",score:69},{day:"W4",score:score}
  ], [chartRange, score]);

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => setToast(""), 2600);
  }
  function toggleHabit(id) {
    setHabits(current => current.map(h => h.id === id ? { ...h, done: !h.done } : h));
  }
  function addFoodLog() {
    if (!selectedFood) return;
    const label = { balanced: "Balanced meal", fast: "Fast food", sweet: "Sweet treat", snack: "Quick snack" }[selectedFood];
    setFoodLog(current => [{ id: Date.now(), label, type: selectedFood, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }, ...current].slice(0, 12));
    setAdviceOpen(true);
    notify("Food choice added to today's log.");
  }

  return <div className="app-shell">
    <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
    <main className="main-content">
      <header className="topbar">
        <div className="topbar-left">
          <button className="menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu/></button>
          <div className="breadcrumb">Workspace <span>/</span> <b>Overview</b></div>
        </div>
        <div className="topbar-right">
          <div className="date-chip">{today}</div>
          <button className="notification-button" onClick={() => notify("You're all caught up!")} aria-label="Notifications"><Bell size={17}/><i/></button>
          <div className="user-chip"><div className="avatar">G</div><span>Guest user</span><ChevronDown size={14}/></div>
        </div>
      </header>

      <section id="overview" className="page-heading">
        <div><div className="eyebrow">YOUR PERSONAL WELLNESS SPACE</div><h1>Good day. Make it a healthy one.</h1><p>Simple guidance for better food choices and everyday habits.</p></div>
        <button className="button-primary" onClick={() => { setActive("habits"); document.getElementById("habits")?.scrollIntoView({behavior:"smooth"}); }}><Plus size={17}/> Daily check-in</button>
      </section>

      <section className="hero-banner">
        <div className="hero-copy">
          <div className="hero-kicker"><Sparkles size={14}/> YOUR DAILY REMINDER</div>
          <h2>Progress over perfection.</h2>
          <p>You don't have to give up every favourite food. Build a balanced routine, choose nourishing meals more often, and enjoy treats mindfully.</p>
          <a className="hero-link" href="#food-advisor">Explore food advisor <span>↗</span></a>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="hero-circle circle-one"/><div className="hero-circle circle-two"/><span>🥑</span></div>
      </section>

      <section className="metric-grid" aria-label="Wellness statistics">
        <article className="metric-card"><div className="metric-label">Wellness score <IconTile><Sparkles size={16}/></IconTile></div><div className="metric-value">{score}<small>/100</small></div><div className="metric-foot"><span className="positive"><TrendingUp size={13}/> Live demo score</span><span>Based on your activity</span></div></article>
        <article className="metric-card"><div className="metric-label">Water goal <IconTile tint="blue"><Droplets size={16}/></IconTile></div><div className="metric-value">{water}<small>/ 8 glasses</small></div><div className="water-controls"><button onClick={() => setWater(v => Math.max(0, v - 1))} aria-label="Remove glass">−</button><div className="water-track"><span style={{width:`${Math.min(100,water/8*100)}%`}}/></div><button onClick={() => setWater(v => Math.min(8, v + 1))} aria-label="Add glass">+</button></div></article>
        <article className="metric-card"><div className="metric-label">Daily habits <IconTile tint="orange"><Target size={16}/></IconTile></div><div className="metric-value">{completed}<small>/ {habits.length} done</small></div><div className="metric-foot"><span className="positive"><Check size={13}/> {habitPercent}% complete</span><span>Keep going</span></div></article>
        <article className="metric-card"><div className="metric-label">Food entries <IconTile tint="pink"><Heart size={16}/></IconTile></div><div className="metric-value">{foodLog.length}<small> today</small></div><div className="metric-foot"><span className="positive"><Activity size={13}/> Personal log</span><span>Saved on this device</span></div></article>
      </section>

      <section className="main-grid">
        <article className="surface chart-panel">
          <div className="panel-heading"><div><h3>Wellness progress</h3><p>A sample trend based on your healthy routine</p></div><select value={chartRange} onChange={e => setChartRange(e.target.value)} aria-label="Chart period"><option>7 days</option><option>4 weeks</option></select></div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{top:12,right:10,left:-22,bottom:0}}>
                <defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24865c" stopOpacity={0.22}/><stop offset="95%" stopColor="#24865c" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid stroke="#edf1ed" vertical={false} strokeDasharray="3 4"/>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill:"#8a968e",fontSize:11}} dy={9}/>
                <YAxis domain={[0,100]} axisLine={false} tickLine={false} tick={{fill:"#8a968e",fontSize:10}} ticks={[0,25,50,75,100]}/>
                <Tooltip contentStyle={{border:"1px solid #e7ece7",borderRadius:12,fontSize:12,boxShadow:"0 8px 25px #183c2912"}}/>
                <Area type="monotone" dataKey="score" stroke="#23865b" strokeWidth={3} fill="url(#scoreFill)" activeDot={{r:5,strokeWidth:3,stroke:"#fff"}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-caption"><span><i className="legend-dot"/> Wellness score</span><span className="chart-note">Illustrative data, not a medical measurement</span></div>
        </article>

        <article className="surface snapshot-panel">
          <div className="panel-heading"><div><h3>Your wellness snapshot</h3><p>Today's habit summary</p></div><span className="status-pill">In progress</span></div>
          <div className="score-content">
            <div className="score-ring" style={{"--score":`${score}%`}}><div><strong>{score}</strong><span>OUT OF 100</span></div></div>
            <div className="score-description"><b>You're building momentum</b><p>Small actions add up. Keep focusing on hydration, regular meals, movement and sleep.</p><span><TrendingUp size={13}/> Your activity updates this score</span></div>
          </div>
          <div className="snapshot-divider"/>
          <div className="snapshot-row"><span><Droplets size={15}/> Water goal</span><b>{Math.round(water/8*100)}%</b></div>
          <div className="mini-progress"><span style={{width:`${water/8*100}%`}}/></div>
          <div className="snapshot-row"><span><Check size={15}/> Habit completion</span><b>{habitPercent}%</b></div>
          <div className="mini-progress"><span style={{width:`${habitPercent}%`}}/></div>
        </article>
      </section>

      <section className="lower-grid">
        <article className="surface meal-panel" id="meal-ideas">
          <div className="panel-heading"><div><h3>Meal inspiration</h3><p>Simple, familiar ideas for a balanced day</p></div><span className="subtle-label">SAMPLE IDEAS</span></div>
          <div className="meal-list">{mealIdeas.map(meal => <div className="meal-row" key={meal.time}><div className="meal-emoji">{meal.emoji}</div><div className="meal-details"><span>{meal.time}</span><b>{meal.name}</b><small>{meal.note}</small></div><span className="meal-tag">{meal.tag}</span></div>)}</div>
        </article>

        <article className="surface habit-panel" id="habits">
          <div className="panel-heading"><div><h3>Today's habit tracker</h3><p>Check off what you've completed</p></div><span className="count-pill">{completed}/{habits.length}</span></div>
          <div className="habit-list">{habits.map(habit => <label className={`habit-row ${habit.done ? "is-done" : ""}`} key={habit.id}><input type="checkbox" checked={habit.done} onChange={() => toggleHabit(habit.id)}/><span className="custom-check"><Check size={12}/></span><span className="habit-text"><b>{habit.title}</b><small>{habit.detail}</small></span></label>)}</div>
          <div className="habit-progress-label"><span>Daily completion</span><b>{habitPercent}%</b></div><div className="mini-progress habit-progress"><span style={{width:`${habitPercent}%`}}/></div>
        </article>
      </section>

      <section className="advisor-section" id="food-advisor">
        <div className="section-heading"><div><div className="eyebrow">MAKE AN INFORMED CHOICE</div><h2>Food choice advisor</h2><p>What are you planning to eat? Choose an option for a practical suggestion.</p></div><div className="advisor-badge"><Zap size={15}/> Instant guidance</div></div>
        <div className="advisor-layout">
          <article className="surface advisor-card">
            <div className="food-choice-grid">
              {[
                {id:"balanced",emoji:"🥗",name:"Balanced meal",desc:"Dal, roti, vegetables"},
                {id:"fast",emoji:"🍔",name:"Fast food",desc:"Burger, pizza, fries"},
                {id:"sweet",emoji:"🍰",name:"Sweet treat",desc:"Cake, chocolate"},
                {id:"snack",emoji:"🥜",name:"Quick snack",desc:"Between-meal bites"}
              ].map(item => <button key={item.id} className={`food-choice ${selectedFood===item.id?"selected":""}`} onClick={() => {setSelectedFood(item.id);setAdviceOpen(false);}}><span className="food-choice-emoji">{item.emoji}</span><span><b>{item.name}</b><small>{item.desc}</small></span><span className="choice-radio"/></button>)}
            </div>
            <button className="button-primary get-advice" disabled={!selectedFood} onClick={() => setAdviceOpen(true)}>Get my suggestion <span>→</span></button>
            {adviceOpen && selectedFood && <div className="advice-result"><div className="advice-icon"><Sparkles size={17}/></div><div><b>{foodAdvice[selectedFood].title}</b><p>{foodAdvice[selectedFood].text}</p><button onClick={addFoodLog}>＋ Add to today's food log</button></div></div>}
          </article>
          <article className="surface plate-card" id="insights">
            <div className="panel-heading"><div><h3>The balanced plate</h3><p>A simple guide to food variety</p></div><CircleHelp size={17} color="#849188"/></div>
            <div className="plate-layout">
              <div className="plate-visual"><div className="plate-top"><span>🥦</span><span>🥕</span></div><div className="plate-bottom"><span>🌾</span><span>🫘</span></div></div>
              <div className="plate-legend"><div><i className="plate-dot green-dot"/><span><b>Vegetables & fruit</b><small>Add colour and variety</small></span></div><div><i className="plate-dot gold-dot"/><span><b>Whole grains</b><small>Roti, rice, oats or millets</small></span></div><div><i className="plate-dot blue-dot"/><span><b>Protein foods</b><small>Dal, beans, eggs, paneer</small></span></div></div>
            </div>
            <p className="plate-footnote">This is a flexible visual guide, not a strict portion prescription. Individual needs vary.</p>
          </article>
        </div>
      </section>

      <section className="food-log-section">
        <div className="section-heading compact-heading"><div><div className="eyebrow">YOUR PERSONAL RECORD</div><h2>Today's food log</h2><p>Entries are saved locally in this browser.</p></div><button className="text-button" onClick={() => {setFoodLog([]);notify("Today's food log cleared.");}}>Clear log</button></div>
        <div className="surface log-card">
          {foodLog.length === 0 ? <div className="empty-log"><div><Apple size={22}/></div><b>No food entries yet</b><p>Use the food advisor above to add your first choice.</p></div> : foodLog.map(entry => <div className="log-row" key={entry.id}><span className="log-symbol">{entry.type==="balanced"?"🥗":entry.type==="fast"?"🍔":entry.type==="sweet"?"🍰":"🥜"}</span><b>{entry.label}</b><span className="log-time">{entry.time}</span></div>)}
        </div>
      </section>

      <section className="tips-grid">
        <div className="tip-card"><div className="tip-icon green"><Heart size={18}/></div><div><b>Balance, not restriction</b><p>Enjoy favourite foods sometimes. Your overall routine matters more than one meal.</p></div></div>
        <div className="tip-card"><div className="tip-icon orange"><Moon size={18}/></div><div><b>Protect your sleep</b><p>A consistent sleep schedule can support energy and concentration.</p></div></div>
        <div className="tip-card"><div className="tip-icon blue"><Droplets size={18}/></div><div><b>Keep water nearby</b><p>Drink regularly throughout the day and adjust to your activity and needs.</p></div></div>
      </section>
      <footer className="app-footer">NUTRIWISE <span>•</span> WELLNESS DASHBOARD <span>•</span> Demo data is illustrative. General education only, not medical advice.</footer>
    </main>
    {toast && <div className="toast-message"><Check size={16}/>{toast}</div>}
  </div>;
}

export default App;