import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMessage('Check your email for the magic link!');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! You can now log in.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // User will be redirected automatically due to onAuthStateChange in App.jsx
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-orb orb-1"></div>
      <div className="auth-bg-orb orb-2"></div>
      
      <div className="glass-panel auth-panel animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">DSA Tracker</h1>
          <p className="text-muted text-sm">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 
             mode === 'signup' ? 'Create an account to start tracking.' : 
             'Sign in via magic link.'}
          </p>
        </div>

        {error && <div className="p-3 mb-4 text-sm text-danger bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}
        {message && <div className="p-3 mb-4 text-sm text-success bg-green-500/10 border border-green-500/20 rounded-md">{message}</div>}

        <form onSubmit={handleAuth} className="flex flex-col gap-4 mb-6">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} size={16} />
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '36px' }}
                placeholder="you@example.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {mode !== 'magic' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} size={16} />
                <input 
                  type="password" 
                  className="form-input" 
                  style={{ paddingLeft: '36px' }}
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }} disabled={loading}>
            {loading ? 'Processing...' : (
              <>
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '24px' }}>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            onMouseOver={e => e.target.style.color = 'var(--text-primary)'}
            onMouseOut={e => e.target.style.color = 'var(--text-secondary)'}
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setMessage('');
            }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
          
          {mode !== 'magic' ? (
             <button 
               style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
               onClick={() => setMode('magic')}
             >
               Use Magic Link
             </button>
          ) : (
            <button 
               style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}
               onClick={() => setMode('login')}
             >
               Use Password
             </button>
          )}
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0' }}>
          <div style={{ position: 'absolute', width: '100%', borderTop: '1px solid var(--border-color)' }}></div>
          <span style={{ position: 'relative', background: 'var(--bg-surface)', padding: '0 16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Or continue with
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn" style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={handleGoogle}>
            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="btn" style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', gap: '8px' }} onClick={handleGitHub}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
