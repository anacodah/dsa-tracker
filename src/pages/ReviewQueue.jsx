import React, { useEffect, useState } from 'react';
import { getProblems, updateReviewStatus } from '../storage';
import { ExternalLink, CheckCircle2 } from 'lucide-react';

const ReviewQueue = () => {
  const [dueProblems, setDueProblems] = useState([]);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    const allProblems = await getProblems();
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const due = allProblems.filter(p => {
      if (p.mastered) return false;
      const reviewDate = new Date(p.nextReviewDate);
      return reviewDate < tomorrowStart;
    });

    // Sort oldest review date first
    due.sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
    setDueProblems(due);
  };

  const handleAction = async (id, action) => {
    await updateReviewStatus(id, action);
    loadProblems(); // refresh list
  };

  if (dueProblems.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center" style={{ minHeight: '60vh' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0, 250, 154, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CheckCircle2 size={40} color="var(--success)" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're all caught up!</h2>
        <p className="text-muted">No problems due for review today. Great job staying on top of your practice.</p>
      </div>
    );
  }

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'var(--success)';
    if (diff === 'Medium') return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Review Queue</h2>
        <div style={{ background: 'var(--bg-secondary)', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', color: 'var(--accent-primary)', border: '1px solid var(--border-color)' }}>
          {dueProblems.length} Due Today
        </div>
      </div>
      
      <div className="flex-col gap-4">
        {dueProblems.map(p => (
          <div key={p.id} className="glass-panel flex justify-between items-center mb-4">
            <div style={{ flex: 1, paddingRight: '20px' }}>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">{p.name}</h3>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-muted" style={{ color: 'var(--text-secondary)' }}>
                    <ExternalLink size={16} />
                  </a>
                )}
                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${getDifficultyColor(p.difficulty)}`, color: getDifficultyColor(p.difficulty) }}>
                  {p.difficulty}
                </span>
              </div>
              <p className="text-muted text-sm mb-2">{p.topic} • Bucket: <span className="font-bold text-white" style={{ color: 'var(--accent-primary)' }}>{p.reviewBucket}</span></p>
              {p.note && <p className="text-sm italic" style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>"{p.note}"</p>}
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button className="btn" onClick={() => handleAction(p.id, 'Forgot')} style={{ borderColor: 'var(--danger)', color: 'var(--danger)', flex: 1 }}>Forgot</button>
                <button className="btn" onClick={() => handleAction(p.id, 'Hard')} style={{ borderColor: 'var(--warning)', color: 'var(--warning)', flex: 1 }}>Hard</button>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={() => handleAction(p.id, 'Good')} style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', flex: 1 }}>Good</button>
                <button className="btn" onClick={() => handleAction(p.id, 'Easy')} style={{ borderColor: 'var(--success)', color: 'var(--success)', flex: 1 }}>Easy</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewQueue;
