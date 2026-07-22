// src/storage.js — Supabase version
import { supabase } from './supabaseClient';

// Helper: get the logged-in user's ID
const getUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
};

// ── PROBLEMS ─────────────────────────────────────────────

export const getProblems = async () => {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .order('date_solved', { ascending: false });
  if (error) throw error;
  return data;
};

export const saveProblem = async (problemData) => {
  const user_id = await getUserId();
  const nextReview = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('problems')
    .insert([{
      user_id,
      name: problemData.name,
      url: problemData.url,
      date_solved: problemData.dateSolved,
      topic: problemData.topic,
      difficulty: problemData.difficulty,
      time_taken: Number(problemData.timeTaken) || null,
      solved_independently: problemData.solvedIndependently,
      note: problemData.note,
      review_bucket: 'A',
      next_review_date: nextReview,
      mastered: false,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProblem = async (id, updates) => {
  const { data, error } = await supabase
    .from('problems')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProblem = async (id) => {
  const { error } = await supabase
    .from('problems')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

export const updateReviewStatus = async (id, action) => {
  // Fetch current problem first
  const { data: problem, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;

  const now = new Date();
  let updates = {};

  if (action === 'Forgot') {
    updates = { review_bucket: 'A', next_review_date: new Date(now.getTime() + 86400000).toISOString() };
  } else if (action === 'Hard') {
    updates = { next_review_date: new Date(now.getTime() + 3 * 86400000).toISOString() };
  } else if (action === 'Good') {
    if (problem.review_bucket === 'A') updates = { review_bucket: 'B', next_review_date: new Date(now.getTime() + 10 * 86400000).toISOString() };
    else if (problem.review_bucket === 'B') updates = { review_bucket: 'C', next_review_date: new Date(now.getTime() + 30 * 86400000).toISOString() };
    else updates = { mastered: true };
  } else if (action === 'Easy') {
    updates = { mastered: true };
  }

  return updateProblem(id, updates);
};

// ── AUDITS ────────────────────────────────────────────────

export const getAudits = async () => {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .order('date_created', { ascending: false });
  if (error) throw error;
  return data;
};

export const saveAudit = async (auditData) => {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from('audits')
    .insert([{ user_id, data: auditData }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ── ROADMAP ───────────────────────────────────────────────

export const getRoadmapPhases = async () => {
  const { data, error } = await supabase
    .from('roadmap_phases')
    .select('*')
    .order('week_number', { ascending: true });
  if (error) throw error;
  return data;
};

export const saveRoadmapPhase = async (phaseData) => {
  const user_id = await getUserId();
  const { data, error } = await supabase
    .from('roadmap_phases')
    .insert([{
      user_id,
      week_number: phaseData.week_number,
      title: phaseData.title,
      topics: phaseData.topics,
      target: phaseData.target
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const saveMultipleRoadmapPhases = async (phasesData) => {
  const user_id = await getUserId();
  const rows = phasesData.map(p => ({
    user_id,
    week_number: p.week_number,
    title: p.title,
    topics: p.topics,
    target: p.target
  }));
  const { data, error } = await supabase
    .from('roadmap_phases')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
};

export const updateRoadmapPhase = async (id, updates) => {
  const { data, error } = await supabase
    .from('roadmap_phases')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteRoadmapPhase = async (id) => {
  const { error } = await supabase
    .from('roadmap_phases')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// ── EXPORT / IMPORT ───────────────────────────────────────

export const exportData = async () => {
  const problems = await getProblems();
  const audits   = await getAudits();
  const blob = new Blob([JSON.stringify({ problems, audits, exportDate: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `dsa_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};

export const importData = async (jsonString) => {
  try {
    const { problems } = JSON.parse(jsonString);
    if (problems?.length) {
      const user_id = await getUserId();
      const rows = problems.map(p => ({ ...p, user_id, id: undefined }));
      const { error } = await supabase.from('problems').insert(rows);
      if (error) throw error;
    }
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
};
