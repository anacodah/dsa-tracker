import React, { useState, useEffect } from 'react';
import { saveProblem } from '../storage';

const TOPICS = [
  'Basics/Math', 'Recursion', 'Arrays', 'Binary Search', 'Strings', 'Linked List', 
  'Backtracking', 'Sliding Window', 'Two Pointers', 'Stack & Queue', 'Trees', 
  'Heaps', 'Graphs', 'DP', 'Greedy', 'Tries', 'Bit Manipulation', 'Advanced Graphs'
];

const LogModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    dateSolved: new Date().toISOString().split('T')[0],
    topic: TOPICS[0],
    difficulty: 'Easy',
    timeTaken: '',
    solvedIndependently: true,
    note: ''
  });

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        url: '',
        dateSolved: new Date().toISOString().split('T')[0],
        topic: TOPICS[0],
        difficulty: 'Easy',
        timeTaken: '',
        solvedIndependently: true,
        note: ''
      });
      // Focus the first input automatically
      setTimeout(() => {
        const input = document.getElementById('problem-name-input');
        if (input) input.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Problem name is required!");
      return;
    }
    
    // Save to database
    await saveProblem(formData);
    
    // Slight delay for UX, then close and reload to reflect data
    onClose();
    window.location.reload(); 
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel animate-fade-in" 
        style={{ width: '100%', maxWidth: '600px', margin: '20px', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">Log a New Problem</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Problem Name</label>
            <input 
              id="problem-name-input"
              type="text" 
              name="name" 
              className="form-input" 
              placeholder="e.g. Two Sum" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="flex gap-4 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Topic</label>
              <select name="topic" className="form-select" value={formData.topic} onChange={handleChange}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Difficulty</label>
              <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date Solved</label>
              <input 
                type="date" 
                name="dateSolved" 
                className="form-input" 
                value={formData.dateSolved} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">LeetCode URL</label>
              <input 
                type="url" 
                name="url" 
                className="form-input" 
                placeholder="https://leetcode.com/problems/..." 
                value={formData.url} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group flex items-center gap-2">
            <input 
              type="checkbox" 
              id="solvedIndependently" 
              name="solvedIndependently" 
              checked={formData.solvedIndependently} 
              onChange={handleChange} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor="solvedIndependently" className="form-label mb-0" style={{ marginBottom: 0 }}>
              Solved Independently
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Pattern / Notes</label>
            <textarea 
              name="note" 
              className="form-textarea" 
              rows="3" 
              placeholder="Key takeaways..."
              value={formData.note} 
              onChange={handleChange} 
            ></textarea>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" className="btn" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Log Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogModal;
