import React, { useEffect, useState } from 'react';
import { getProblems, getRoadmapPhases, saveMultipleRoadmapPhases, updateRoadmapPhase, deleteRoadmapPhase, saveRoadmapPhase } from '../storage';
import { Edit2, Plus, Trash2, Save, X, GripVertical } from 'lucide-react';

const DEFAULT_PHASES = [
  { week_number: 1, title: 'Week 1', topics: ['Basics/Math', 'Recursion'], target: 12 },
  { week_number: 2, title: 'Week 2', topics: ['Arrays'], target: 20 },
  { week_number: 3, title: 'Week 3', topics: ['Binary Search'], target: 15 },
  { week_number: 4, title: 'Week 4', topics: ['Strings'], target: 15 },
  { week_number: 5, title: 'Week 5', topics: ['Linked List'], target: 15 },
  { week_number: 6, title: 'Week 6', topics: ['Recursion', 'Backtracking'], target: 15 },
  { week_number: 7, title: 'Week 7-8', topics: ['Sliding Window', 'Two Pointers'], target: 18 },
  { week_number: 8, title: 'Week 9', topics: ['Stack & Queue'], target: 15 },
  { week_number: 9, title: 'Week 10-11', topics: ['Trees'], target: 25 },
  { week_number: 10, title: 'Week 12', topics: ['Heaps'], target: 12 },
  { week_number: 11, title: 'Week 13-14', topics: ['Graphs'], target: 25 },
  { week_number: 12, title: 'Week 15-16', topics: ['DP'], target: 30 },
  { week_number: 13, title: 'Week 17', topics: ['Greedy'], target: 12 },
  { week_number: 14, title: 'Week 18', topics: ['Tries'], target: 8 },
  { week_number: 15, title: 'Week 19', topics: ['Bit Manipulation'], target: 10 },
  { week_number: 16, title: 'Week 20', topics: ['Advanced Graphs'], target: 10 },
  { week_number: 17, title: 'Week 21', topics: ['Revision (Mixed)'], target: 15 },
  { week_number: 18, title: 'Week 22', topics: ['Contests/Mock Tests'], target: 15 },
];

const Roadmap = () => {
  const [problems, setProblems] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPhases, setEditedPhases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [probs, fetchedPhases] = await Promise.all([getProblems(), getRoadmapPhases()]);
        setProblems(probs);
        
        if (fetchedPhases.length === 0) {
          // Auto-seed defaults if empty
          const newPhases = await saveMultipleRoadmapPhases(DEFAULT_PHASES);
          setPhases(newPhases || DEFAULT_PHASES);
        } else {
          setPhases(fetchedPhases);
        }
      } catch (error) {
        console.error("Failed to load roadmap data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatus = (target, actual) => {
    if (actual === 0) return { label: 'Not Started', color: 'var(--text-secondary)' };
    if (actual >= target) return { label: 'Done', color: 'var(--success)' };
    return { label: 'In Progress', color: 'var(--warning)' };
  };

  const handleEditClick = () => {
    setEditedPhases(JSON.parse(JSON.stringify(phases)));
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      // Basic diffing to save changes
      const currentIds = phases.map(p => p.id).filter(Boolean);
      const editedIds = editedPhases.map(p => p.id).filter(Boolean);
      
      // Delete removed
      const toDelete = currentIds.filter(id => !editedIds.includes(id));
      for (const id of toDelete) {
        await deleteRoadmapPhase(id);
      }

      // Update existing & Insert new
      const finalPhases = [];
      for (let i = 0; i < editedPhases.length; i++) {
        const p = editedPhases[i];
        p.week_number = i + 1; // fix ordering
        if (p.id) {
          const updated = await updateRoadmapPhase(p.id, { title: p.title, topics: p.topics, target: p.target, week_number: p.week_number });
          finalPhases.push(updated);
        } else {
          const inserted = await saveRoadmapPhase(p);
          finalPhases.push(inserted);
        }
      }

      setPhases(finalPhases.sort((a,b) => a.week_number - b.week_number));
      setIsEditMode(false);
    } catch (e) {
      console.error("Save failed", e);
      alert("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  const updateEditedPhase = (index, field, value) => {
    const newPhases = [...editedPhases];
    newPhases[index][field] = value;
    setEditedPhases(newPhases);
  };

  const addPhase = () => {
    setEditedPhases([...editedPhases, { title: 'New Phase', topics: [], target: 10 }]);
  };

  const removePhase = (index) => {
    const newPhases = [...editedPhases];
    newPhases.splice(index, 1);
    setEditedPhases(newPhases);
  };

  const movePhase = (index, dir) => {
    if (index + dir < 0 || index + dir >= editedPhases.length) return;
    const newPhases = [...editedPhases];
    const temp = newPhases[index];
    newPhases[index] = newPhases[index + dir];
    newPhases[index + dir] = temp;
    setEditedPhases(newPhases);
  };

  if (loading && phases.length === 0) return <div className="p-8 text-center text-muted">Loading Roadmap...</div>;

  return (
    <div className="animate-fade-in pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personalized Roadmap</h2>
        {!isEditMode ? (
          <button onClick={handleEditClick} className="btn btn-secondary flex items-center gap-2">
            <Edit2 size={16} /> Edit Roadmap
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancelEdit} className="btn btn-secondary flex items-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleSaveEdit} className="btn btn-primary flex items-center gap-2">
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      {!isEditMode && (
        <div className="glass-panel mb-8 flex gap-4" style={{ overflowX: 'auto', padding: '16px 24px' }}>
          {[['Month 1', '~60'], ['Month 2', '~110'], ['Month 3', '~160'], ['Month 4', '~210'], ['Month 5', '~260-270']].map((m, i) => (
            <div key={m[0]} style={{ flex: 1, minWidth: '140px', textAlign: 'center', borderRight: i === 4 ? 'none' : '1px solid var(--border-color)' }}>
              <div className="font-bold text-sm text-muted mb-1">{m[0]}</div>
              <div className="text-xl font-bold text-gradient">{m[1]}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {(isEditMode ? editedPhases : phases).map((phase, index) => {
          let actual = 0;
          if (!isEditMode && phase.topics) {
            actual = problems.filter(p => phase.topics.includes(p.topic)).length;
          }
          const status = getStatus(phase.target, actual);

          if (isEditMode) {
            return (
              <div key={index} className="glass-panel flex items-center gap-4 py-4 pr-4">
                <div className="flex flex-col gap-2 pl-4 cursor-ns-resize text-muted">
                  <button onClick={() => movePhase(index, -1)} disabled={index === 0}>▲</button>
                  <button onClick={() => movePhase(index, 1)} disabled={index === editedPhases.length - 1}>▼</button>
                </div>
                
                <div style={{ flex: 1 }} className="flex flex-col gap-3">
                  <input 
                    type="text" 
                    value={phase.title} 
                    onChange={e => updateEditedPhase(index, 'title', e.target.value)}
                    className="input w-full font-bold" 
                    placeholder="Phase Title (e.g. Week 1)"
                  />
                  <input 
                    type="text" 
                    value={(phase.topics || []).join(', ')} 
                    onChange={e => updateEditedPhase(index, 'topics', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    className="input w-full text-sm" 
                    placeholder="Topics (comma separated)"
                  />
                </div>
                
                <div style={{ width: '120px' }}>
                  <label className="text-xs text-muted block mb-1">Target</label>
                  <input 
                    type="number" 
                    value={phase.target} 
                    onChange={e => updateEditedPhase(index, 'target', parseInt(e.target.value) || 0)}
                    className="input w-full" 
                  />
                </div>

                <button onClick={() => removePhase(index)} className="btn btn-secondary text-danger ml-2 p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          }

          return (
            <div key={phase.id || index} className="glass-panel flex items-center justify-between py-4 transition-all hover:-translate-y-1">
              <div style={{ flex: 1 }}>
                <div className="font-bold text-lg mb-1">{phase.title}</div>
                <div className="text-muted text-sm">{(phase.topics || []).join(' + ')}</div>
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

      {isEditMode && (
        <button onClick={addPhase} className="btn glass-panel w-full mt-4 flex justify-center items-center gap-2 py-4 text-muted hover:text-white transition-colors">
          <Plus size={20} /> Add Phase
        </button>
      )}
    </div>
  );
};

export default Roadmap;
