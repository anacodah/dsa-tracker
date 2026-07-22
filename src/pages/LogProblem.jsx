import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveProblem } from '../storage';

const TOPICS = [
  'Basics/Math', 'Recursion', 'Arrays', 'Binary Search', 'Strings', 'Linked List', 
  'Backtracking', 'Sliding Window', 'Two Pointers', 'Stack & Queue', 'Trees', 
  'Heaps', 'Graphs', 'DP', 'Greedy', 'Tries', 'Bit Manipulation', 'Advanced Graphs'
];

const LogProblem = () => {
  const navigate = useNavigate();
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

  const location = useLocation();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const url = params.get('url');
    const difficulty = params.get('difficulty');
    
    if (name || url || difficulty) {
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        url: url || prev.url,
        difficulty: (difficulty === 'Easy' || difficulty === 'Medium' || difficulty === 'Hard') ? difficulty : prev.difficulty
      }));
    }
  }, [location.search]);

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
    alert('Problem logged successfully!');
    navigate('/review'); // or stay on page based on preference
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Log a New Problem</h2>
      
      <form onSubmit={handleSubmit} className="glass-panel">
        <div className="form-group">
          <label className="form-label">Problem Name</label>
          <input 
            type="text" 
            name="name" 
            className="form-input" 
            placeholder="e.g. Two Sum" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">LeetCode URL (optional)</label>
          <input 
            type="url" 
            name="url" 
            className="form-input" 
            placeholder="https://leetcode.com/problems/..." 
            value={formData.url} 
            onChange={handleChange} 
          />
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
            <label className="form-label">Time Taken (minutes)</label>
            <input 
              type="number" 
              name="timeTaken" 
              className="form-input" 
              placeholder="e.g. 30" 
              min="1"
              value={formData.timeTaken} 
              onChange={handleChange} 
            />
          </div>
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
            rows="4" 
            placeholder="Key takeaways, time/space complexity, etc..."
            value={formData.note} 
            onChange={handleChange} 
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
          Log Problem
        </button>
      </form>
    </div>
  );
};

export default LogProblem;
