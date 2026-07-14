import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthPage = () => {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (!error) setSent(true);
    else alert(error.message);
    setLoading(false);
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  if (sent) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:12 }}>
      <h2>Check your email ✉️</h2>
      <p style={{ color: 'var(--text-secondary)' }}>We sent a magic link to <strong>{email}</strong></p>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="glass-panel" style={{ width: 380 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>DSA Tracker</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 28 }}>
          Sign in to track your progress across devices
        </p>

        <form onSubmit={handleMagicLink}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div style={{ textAlign:'center', color:'var(--text-secondary)', fontSize:12, margin:'16px 0' }}>or</div>

        <button className="btn" onClick={handleGitHub} style={{ width: '100%' }}>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
