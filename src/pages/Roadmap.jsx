import React, { useEffect, useState } from 'react';
import { getProblems } from '../storage';

const PHASES = [
  { week: 'Week 1', topics: ['Basics/Math', 'Recursion'], target: 12 },
  { week: 'Week 2', topics: ['Arrays'], target: 20 },
  { week: 'Week 3', topics: ['Binary Search'], target: 15 },
  { week: 'Week 4', topics: ['Strings'], target: 15 },
  { week: 'Week 5', topics: ['Linked List'], target: 15 },
  { week: 'Week 6', topics: ['Recursion', 'Backtracking'], target: 15 },
  { week: 'Week 7-8', topics: ['Sliding Window', 'Two Pointers'], target: 18 },
  { week: 'Week 9', topics: ['Stack & Queue'], target: 15 },
  { week: 'Week 10-11', topics: ['Trees'], target: 25 },
  { week: 'Week 12', topics: ['Heaps'], target: 12 },
  { week: 'Week 13-14', topics: ['Graphs'], target: 25 },
  { week: 'Week 15-16', topics: ['DP'], target: 30 },
  { week: 'Week 17', topics: ['Greedy'], target: 12 },
  { week: 'Week 18', topics: ['Tries'], target: 8 },
  { week: 'Week 19', topics: ['Bit Manipulation'], target: 10 },
  { week: 'Week 20', topics: ['Advanced Graphs'], target: 10 },
  { week: 'Week 21', topics: ['Revision (Mixed)'], target: 15 },
  { week: 'Week 22', topics: ['Contests/Mock Tests'], target: 15 },
];

const Roadmap = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    getProblems().then(setProblems);
  }, []);

  const getStatus = (target, actual) => {
    if (actual === 0) return { label: 'Not Started', color: 'var(--text-secondary)' };
    if (actual >= target) return { label: 'Done', color: 'var(--success)' };
    return { label: 'In Progress', color: 'var(--warning)' };
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">22-Week Roadmap</h2>
      
      {/* Milestones Summary */}
      <div className="glass-panel mb-8 flex gap-4" style={{ overflowX: 'auto', padding: '16px 24px' }}>
        {[['Month 1 (Wk4)', '~60'], ['Month 2 (Wk8)', '~110'], ['Month 3 (Wk13)', '~160'], ['Month 4 (Wk17)', '~210'], ['Month 5 (Wk22)', '~260-270']].map((m, i) => (
          <div key={m[0]} style={{ flex: 1, minWidth: '140px', textAlign: 'center', borderRight: i === 4 ? 'none' : '1px solid var(--border-color)' }}>
            <div className="font-bold text-sm text-muted mb-1">{m[0]}</div>
            <div className="text-xl font-bold text-gradient">{m[1]}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-8">
        {PHASES.map(phase => {
          let actual = 0;
          if (phase.week === 'Week 21' || phase.week === 'Week 22') {
            actual = 0; 
          } else {
            actual = problems.filter(p => phase.topics.includes(p.topic)).length;
          }
          
          const status = getStatus(phase.target, actual);

          return (
            <div key={phase.week} className="glass-panel flex items-center justify-between py-4">
              <div style={{ flex: 1 }}>
                <div className="font-bold text-lg mb-1">{phase.week}</div>
                <div className="text-muted text-sm">{phase.topics.join(' + ')}</div>
              </div>
              
              <div style={{ width: '150px', textAlign: 'center' }}>
                <div className="text-2xl font-bold">{actual} <span className="text-sm text-muted">/ {phase.target}</span></div>
                <div className="text-xs text-muted mt-1 uppercase tracking-wider">Problems</div>
              </div>
              
              <div style={{ width: '120px', textAlign: 'right' }}>
                <span style={{ 
                  display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                  background: 'rgba(0,0,0,0.2)', border: `1px solid ${status.color}`, color: status.color 
                }}>
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
