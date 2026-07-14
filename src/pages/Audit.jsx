import React, { useState, useEffect } from 'react';
import { getAudits, saveAudit } from '../storage';

const Audit = () => {
  const [audits, setAudits] = useState([]);
  const [formData, setFormData] = useState({
    weekNumber: '',
    hitTarget: true,
    strugglePattern: '',
    notes: ''
  });

  useEffect(() => {
    const fetchAudits = async () => {
      const saved = await getAudits();
      setAudits(saved.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
      setFormData(prev => ({ ...prev, weekNumber: `Week ${saved.length + 1}` }));
    };
    fetchAudits();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.weekNumber) return alert('Week number is required');
    
    await saveAudit(formData);
    const updatedAudits = await getAudits();
    setAudits(updatedAudits.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
    setFormData({
      weekNumber: `Week ${updatedAudits.length + 1}`,
      hitTarget: true,
      strugglePattern: '',
      notes: ''
    });
    alert('Weekly audit saved!');
  };

  return (
    <div className="animate-fade-in flex gap-8 max-w-5xl">
      {/* Form */}
      <div style={{ flex: 1 }}>
        <h2 className="text-2xl font-bold mb-6">Weekly Audit</h2>
        
        <form onSubmit={handleSubmit} className="glass-panel sticky top-8">
          <div className="form-group">
            <label className="form-label">Week Reference</label>
            <input 
              type="text" 
              name="weekNumber" 
              className="form-input" 
              value={formData.weekNumber} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group flex items-center gap-2 mb-6">
            <input 
              type="checkbox" 
              id="hitTarget" 
              name="hitTarget" 
              checked={formData.hitTarget} 
              onChange={handleChange} 
              style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor="hitTarget" className="form-label mb-0" style={{ marginBottom: 0 }}>
              Did I hit this week's target?
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">Pattern/Topic I struggled with most:</label>
            <textarea 
              name="strugglePattern" 
              className="form-textarea" 
              rows="3" 
              value={formData.strugglePattern} 
              onChange={handleChange} 
              placeholder="e.g. DP state transitions were confusing..."
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Notes for adjusting next week:</label>
            <textarea 
              name="notes" 
              className="form-textarea" 
              rows="3" 
              value={formData.notes} 
              onChange={handleChange} 
              placeholder="e.g. Spend an extra hour on Trees..."
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
            Save Audit
          </button>
        </form>
      </div>

      {/* History */}
      <div style={{ flex: 1 }}>
        <h3 className="text-xl font-bold mb-6 text-muted">Audit History</h3>
        <div className="flex flex-col gap-4">
          {audits.length === 0 ? (
            <p className="text-muted italic">No audits recorded yet.</p>
          ) : audits.map(audit => (
            <div key={audit.id} className="glass-panel">
              <div className="flex justify-between items-center mb-4 pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h4 className="font-bold text-lg">{audit.weekNumber}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {new Date(audit.dateCreated).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-2">
                <span className="text-muted font-bold mr-2 text-sm">Target Hit:</span>
                <span style={{ color: audit.hitTarget ? 'var(--success)' : 'var(--danger)', fontWeight: 'bold' }}>
                  {audit.hitTarget ? 'Yes' : 'No'}
                </span>
              </div>
              
              {audit.strugglePattern && (
                <div className="mb-2">
                  <span className="text-muted font-bold block text-sm mb-1">Struggled With:</span>
                  <p className="text-sm bg-[rgba(0,0,0,0.2)] p-2 rounded">{audit.strugglePattern}</p>
                </div>
              )}
              
              {audit.notes && (
                <div>
                  <span className="text-muted font-bold block text-sm mb-1">Adjustments:</span>
                  <p className="text-sm bg-[rgba(0,0,0,0.2)] p-2 rounded">{audit.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Audit;
