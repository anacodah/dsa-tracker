import React, { useEffect, useState } from 'react';
import { getProblems, deleteProblem } from '../storage';
import { Search, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

const TOPICS = [
  'All', 'Basics/Math', 'Recursion', 'Arrays', 'Binary Search', 'Strings', 'Linked List',
  'Backtracking', 'Sliding Window', 'Two Pointers', 'Stack & Queue', 'Trees',
  'Heaps', 'Graphs', 'DP', 'Greedy', 'Tries', 'Bit Manipulation', 'Advanced Graphs'
];

const DiffBadge = ({ d }) => {
  const cls = d === 'Easy' ? 'badge badge-easy' : d === 'Medium' ? 'badge badge-medium' : 'badge badge-hard';
  return <span className={cls}>{d}</span>;
};

const AllProblems = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterBucket, setFilterBucket] = useState('All');
  const [sortKey, setSortKey] = useState('dateSolved');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => { getProblems().then(setProblems); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this problem?')) {
      await deleteProblem(id);
      getProblems().then(setProblems);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} style={{ opacity: 0.2 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const filtered = problems
    .filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTopic !== 'All' && p.topic !== filterTopic) return false;
      if (filterDifficulty !== 'All' && p.difficulty !== filterDifficulty) return false;
      if (filterBucket !== 'All' && p.reviewBucket !== filterBucket && !(filterBucket === 'Mastered' && p.mastered)) return false;
      return true;
    })
    .sort((a, b) => {
      let av = a[sortKey] ?? '', bv = b[sortKey] ?? '';
      if (sortKey === 'dateSolved') { av = new Date(av); bv = new Date(bv); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">All Problems</h1>
        <p className="page-desc">{problems.length} problems logged · {filtered.length} shown</p>
      </div>

      {/* Filters */}
      <div className="glass-panel" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search problems..."
              className="form-input"
              style={{ paddingLeft: 32, height: 36, fontSize: 13 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 'auto', height: 36, fontSize: 13 }} value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
            {TOPICS.map(t => <option key={t} value={t}>{t === 'All' ? 'All Topics' : t}</option>)}
          </select>
          <select className="form-select" style={{ width: 'auto', height: 36, fontSize: 13 }} value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)}>
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select className="form-select" style={{ width: 'auto', height: 36, fontSize: 13 }} value={filterBucket} onChange={e => setFilterBucket(e.target.value)}>
            <option value="All">All Buckets</option>
            <option value="A">Bucket A</option>
            <option value="B">Bucket B</option>
            <option value="C">Bucket C</option>
            <option value="Mastered">Mastered</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{ paddingLeft: 20 }}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>Problem <SortIcon col="name" /></span>
              </th>
              <th onClick={() => handleSort('dateSolved')}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>Date <SortIcon col="dateSolved" /></span>
              </th>
              <th onClick={() => handleSort('topic')}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>Topic <SortIcon col="topic" /></span>
              </th>
              <th onClick={() => handleSort('difficulty')}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}>Difficulty <SortIcon col="difficulty" /></span>
              </th>
              <th>Bucket</th>
              <th style={{ textAlign: 'right', paddingRight: 20 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? filtered.map(p => (
              <tr key={p.id}>
                <td style={{ paddingLeft: 20 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--text-primary)', marginBottom: 1 }}>{p.name}</div>
                  {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--accent-primary)' }}>↗ LeetCode</a>}
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.dateSolved}</td>
                <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.topic}</td>
                <td><DiffBadge d={p.difficulty} /></td>
                <td>
                  <span style={{ fontSize: 11, fontWeight: 600, color: p.mastered ? 'var(--success)' : 'var(--text-secondary)' }}>
                    {p.mastered ? '✓ Mastered' : `Bucket ${p.reviewBucket}`}
                  </span>
                </td>
                <td style={{ textAlign: 'right', paddingRight: 20 }}>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btn-sm"
                    style={{ color: 'var(--danger)', borderColor: 'transparent', background: 'transparent', padding: '4px 8px' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
                  No problems match your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProblems;
