import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogProblem from './pages/LogProblem';
import ReviewQueue from './pages/ReviewQueue';
import AllProblems from './pages/AllProblems';
import Roadmap from './pages/Roadmap';
import Audit from './pages/Audit';
import AuthPage from './pages/AuthPage';
import { supabase } from './supabaseClient';
const App = () => {
  const [session, setSession] = useState(undefined); // undefined = loading
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    // Listen for auth state changes (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  // Still checking auth state
  if (session === undefined) return null;
  // Not logged in — show auth page
  if (!session) return <AuthPage />;
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="log" element={<LogProblem />} />
          <Route path="review" element={<ReviewQueue />} />
          <Route path="all" element={<AllProblems />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="audit" element={<Audit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
