import React, { useEffect, useState } from 'react';
import { getProblems } from '../storage';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Flame, Calendar, Target } from 'lucide-react';

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const TARGET_GOAL = 300;

  useEffect(() => { getProblems().then(setProblems); }, []);

  const totalSolved = problems.length;
  const progressPercent = Math.min((totalSolved / TARGET_GOAL) * 100, 100);

  // Streak
  const getStreak = () => {
    if (!problems.length) return 0;
    const dates = [...new Set(problems.map(p => new Date(p.dateSolved).toDateString()))]
      .sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    let cur = new Date(); cur.setHours(0,0,0,0);
    const first = new Date(dates[0]); first.setHours(0,0,0,0);
    if (cur - first > 86400000) return 0;
    let check = new Date(first);
    for (const d of dates) {
      const obj = new Date(d); obj.setHours(0,0,0,0);
      if (check.getTime() === obj.getTime()) { streak++; check.setDate(check.getDate()-1); }
      else break;
    }
    return streak;
  };
  const streak = getStreak();

  // Due Today
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const tmr = new Date(todayStart); tmr.setDate(tmr.getDate()+1);
  const dueToday = problems.filter(p => !p.mastered && new Date(p.nextReviewDate) < tmr).length;

  // Chart
  const sortedProblems = [...problems].sort((a,b) => new Date(a.dateSolved)-new Date(b.dateSolved));
  let cumulative = 0; const dataMap = {};
  sortedProblems.forEach(p => {
    const k = new Date(p.dateSolved).toLocaleDateString('en-US',{month:'short',day:'numeric'});
    dataMap[k] = (dataMap[k]||0)+1;
  });
  const chartData = Object.entries(dataMap).map(([date,n]) => { cumulative+=n; return {date,solved:cumulative}; });

  // Heatmap
  const numDays = 140;
  const todayHeat = new Date(); todayHeat.setHours(0,0,0,0);
  const dailyCounts = {};
  problems.forEach(p => { const k = new Date(p.dateSolved).toDateString(); dailyCounts[k]=(dailyCounts[k]||0)+1; });
  const heatMapData = [];
  for (let i=numDays-1; i>=0; i--) {
    const d = new Date(todayHeat); d.setDate(d.getDate()-i);
    const dStr = d.toDateString(); const count = dailyCounts[dStr]||0;
    let level = count===0?0:count===1?1:count===2?2:3;
    heatMapData.push({date:d,count,level,dStr});
  }
  const startDay = new Date(todayHeat); startDay.setDate(todayHeat.getDate()-(numDays-1));
  const paddedHeatMap = Array(startDay.getDay()).fill({empty:true}).concat(heatMapData);

  // SVG ring
  const radius = 38;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progressPercent/100)*circ;

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <p className="page-desc">Track your DSA prep — {totalSolved} of {TARGET_GOAL} problems solved</p>
      </div>

      {/* ── Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Progress card */}
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p className="stat-label"><Target size={13} /> Target Progress</p>
            <div className="stat-value">
              {totalSolved}
              <span style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: 6 }}>/ {TARGET_GOAL}</span>
            </div>
            <p className="stat-sub" style={{ color: 'var(--success)', fontWeight: 600 }}>{progressPercent.toFixed(1)}% completed</p>
          </div>

          {/* SVG ring */}
          <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
            <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="48" cy="48" r={radius} fill="none"
                stroke="var(--accent-primary)" strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
              />
            </svg>
            <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'1rem' }}>
              {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="glass-panel">
          <p className="stat-label"><Flame size={13} color="var(--warning)" /> Current Streak</p>
          <div className="stat-value">{streak}</div>
          <p className="stat-sub">days in a row</p>
        </div>

        {/* Due today */}
        <div className="glass-panel">
          <p className="stat-label"><Calendar size={13} color="var(--accent-primary)" /> Due for Review</p>
          <div className="stat-value" style={{ color: dueToday > 0 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{dueToday}</div>
          <p className="stat-sub">problems today</p>
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="glass-panel" style={{ marginBottom: 24 }}>
        <div className="section-header" style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <span className="section-title">Activity</span>
          <span className="section-subtitle">Last 20 weeks</span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateRows: 'repeat(7, 13px)',
          gridAutoFlow: 'column',
          gridAutoColumns: '13px',
          gap: 3,
          width: 'fit-content',
        }}>
          {paddedHeatMap.map((day, i) => {
            if (day.empty) return <div key={`e-${i}`} style={{ width:13,height:13,borderRadius:3,background:'rgba(255,255,255,0.04)' }} />;
            const alpha = day.level===0?0.06:day.level===1?0.3:day.level===2?0.65:1;
            const bg = day.level===0?'rgba(255,255,255,0.06)':`rgba(255,46,147,${alpha})`;
            return (
              <div key={i} title={`${day.count} problem${day.count!==1?'s':''} · ${day.dStr}`}
                style={{ width:13,height:13,borderRadius:3,background:bg,cursor:day.level>0?'pointer':'default',transition:'transform 0.1s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.3)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:14 }}>
          <span style={{ fontSize:11, color:'var(--text-secondary)' }}>Less</span>
          {[0.06, 0.3, 0.65, 1].map((a,i) => (
            <div key={i} style={{ width:11,height:11,borderRadius:3,background:a===0.06?'rgba(255,255,255,0.06)':`rgba(255,46,147,${a})` }} />
          ))}
          <span style={{ fontSize:11, color:'var(--text-secondary)' }}>More</span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="glass-panel">
        <div className="section-header">
          <span className="section-title">Cumulative Progress</span>
          <p className="section-subtitle">Problems solved over time vs. milestones</p>
        </div>
        <div style={{ width:'100%', height:280 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{top:10,right:20,left:0,bottom:0}}>
                <XAxis dataKey="date" stroke="var(--border-color)" tick={{fill:'var(--text-secondary)',fontSize:11}} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis stroke="var(--border-color)" tick={{fill:'var(--text-secondary)',fontSize:11}} tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip
                  contentStyle={{ background:'var(--bg-surface)',border:'1px solid var(--border-color)',borderRadius:8,fontSize:12 }}
                  itemStyle={{ color:'var(--accent-primary)',fontWeight:600 }}
                  labelStyle={{ color:'var(--text-secondary)',marginBottom:4 }}
                  cursor={{ stroke:'var(--border-light)',strokeWidth:1 }}
                />
                <ReferenceLine y={60}  stroke="var(--border-color)" strokeDasharray="4 4" label={{value:'Month 1',fill:'var(--text-secondary)',fontSize:10,position:'insideTopRight'}} />
                <ReferenceLine y={160} stroke="var(--border-color)" strokeDasharray="4 4" label={{value:'Month 3',fill:'var(--text-secondary)',fontSize:10,position:'insideTopRight'}} />
                <Line type="monotone" dataKey="solved" stroke="var(--accent-primary)" strokeWidth={2.5}
                  dot={false} activeDot={{r:5,fill:'var(--accent-primary)',stroke:'var(--bg-surface)',strokeWidth:2}} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,color:'var(--text-secondary)',border:'1px dashed var(--border-color)',borderRadius:10 }}>
              <Target size={32} opacity={0.4} />
              <p style={{ fontSize:13 }}>Log problems to see your chart</p>
              <p style={{ fontSize:12, opacity:0.6 }}>Press <kbd style={{padding:'2px 6px',background:'rgba(255,255,255,0.06)',borderRadius:4,border:'1px solid var(--border-color)'}}>⌘K</kbd> to log your first problem</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
