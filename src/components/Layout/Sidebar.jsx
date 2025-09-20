import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Zap, 
  Atom, 
  Calculator, 
  Dna, 
  BarChart3, 
  BookOpen,
  Trophy,
  Settings,
  User,
  Video
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'physics', label: 'Physics', icon: Zap, path: '/physics' },
    { id: 'chemistry', label: 'Chemistry', icon: Atom, path: '/chemistry' },
    { id: 'math', label: 'Mathematics', icon: Calculator, path: '/math' },
    { id: 'biology', label: 'Biology', icon: Dna, path: '/biology' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'videos', label: 'Videos', icon: Video, path: '/videos' }, // ✅ simplified
  ];

  const secondaryItems = [
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, path: '/achievements' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: '2rem 1.5rem' }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-light)'
        }}>
          <div style={{
            background: 'var(--physics-accent)',
            padding: '12px',
            borderRadius: '12px',
            marginRight: '12px',
            color: 'var(--physics-text)'
          }}>
            <BookOpen size={24} />
          </div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            EduGameHub
          </h1>
        </div>

        {/* Main Navigation */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Learning
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.875rem',
                color: isActive ? 'var(--physics-text)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--physics-bg)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '0.5rem',
                border: isActive ? '1px solid var(--physics-accent)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <div style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <item.icon size={18} />
              </div>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Secondary Navigation */}
        <nav>
          <div style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Account
          </div>
          {secondaryItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.875rem',
                color: isActive ? 'var(--physics-text)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--physics-bg)' : 'transparent',
                textDecoration: 'none',
                marginBottom: '0.5rem',
                border: isActive ? '1px solid var(--physics-accent)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              })}
            >
              <div style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <item.icon size={18} />
              </div>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Stats Card */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--success-bg)',
          borderRadius: '16px',
          border: '1px solid var(--success-text)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'var(--success-text)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success-bg)',
            fontSize: '1.25rem',
            fontWeight: '700'
          }}>
            E
          </div>
          <h3 style={{ 
            color: 'var(--success-text)', 
            fontSize: '1rem', 
            fontWeight: '600',
            margin: '0 0 0.5rem 0'
          }}>
            Ekarna
          </h3>
          <p style={{ 
            color: 'var(--success-text)', 
            fontSize: '0.875rem',
            opacity: 0.8,
            margin: 0
          }}>
            Level 12 • 1,250 XP
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
