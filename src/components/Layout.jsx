import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  CalendarSync,
  List,
  Map,
  ShieldCheck,
  Download,
  Upload,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { exportData, importData } from '../storage';
import { supabase } from '../supabaseClient';
import LogModal from './LogModal';

const Layout = () => {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('dsa_tracker_theme') || 'dark');

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('dsa_tracker_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsLogModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsLogModalOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        if (await importData(ev.target.result)) {
          alert('Imported successfully!');
          window.location.reload();
        } else {
          alert('Invalid format.');
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          height: '100vh',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 12px',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 8px',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {'</>'}
          </div>

          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            DSA Tracker
          </span>
        </div>

        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            padding: '0 10px',
            marginBottom: 6,
          }}
        >
          Navigation
        </p>

        <nav
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <SidebarLink
            to="/"
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
          />

          <button
            onClick={() => setIsLogModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              background: 'transparent',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <PlusCircle size={16} />
            <span style={{ flex: 1 }}>Log Problem</span>

            <kbd
              style={{
                fontSize: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-color)',
                borderRadius: 4,
                padding: '1px 5px',
                color: 'var(--text-secondary)',
                fontFamily: 'inherit',
              }}
            >
              ⌘K
            </kbd>
          </button>

          <SidebarLink
            to="/review"
            icon={<CalendarSync size={16} />}
            label="Review Queue"
          />
          <SidebarLink
            to="/all"
            icon={<List size={16} />}
            label="All Problems"
          />
          <SidebarLink
            to="/roadmap"
            icon={<Map size={16} />}
            label="Roadmap"
          />
          <SidebarLink
            to="/audit"
            icon={<ShieldCheck size={16} />}
            label="Weekly Audit"
          />
        </nav>

        {/* Bottom actions */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              padding: '0 10px',
              marginBottom: 4,
            }}
          >
            Settings
          </p>

          <SidebarAction
            icon={theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onClick={() =>
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
          />

          <SidebarAction
            icon={<Download size={16} />}
            label="Export JSON"
            onClick={exportData}
          />

          <SidebarAction
            icon={<Upload size={16} />}
            label="Import JSON"
            onClick={handleImport}
          />

          <SidebarAction
            icon={<LogOut size={16} />}
            label="Sign Out"
            onClick={handleSignOut}
          />
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
          padding: '40px 44px',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <LogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    end={to === '/'}
    style={({ isActive }) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 6,
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: isActive
        ? 'rgba(255,255,255,0.07)'
        : 'transparent',
      fontWeight: isActive ? 600 : 400,
      textDecoration: 'none',
      fontSize: 13,
      transition: 'color 0.15s, background 0.15s',
      borderLeft: isActive
        ? '2px solid var(--accent-primary)'
        : '2px solid transparent',
    })}
    onMouseEnter={(e) => {
      if (!e.currentTarget.style.borderLeft.includes('accent')) {
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
      }
    }}
    onMouseLeave={(e) => {
      if (!e.currentTarget.style.borderLeft.includes('accent')) {
        e.currentTarget.style.color = 'var(--text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

const SidebarAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 6,
      color: 'var(--text-secondary)',
      background: 'transparent',
      fontWeight: 400,
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      fontFamily: 'inherit',
      width: '100%',
      textAlign: 'left',
      transition: 'color 0.15s, background 0.15s',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = 'var(--text-primary)';
      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = 'var(--text-secondary)';
      e.currentTarget.style.background = 'transparent';
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Layout;