import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/physics': 'Physics Lab',
      '/chemistry': 'Chemistry Lab',
      '/math': 'Mathematics',
      '/biology': 'Biology Lab',
      '/analytics': 'Teacher Analytics'
    };
    return titles[path] || 'EduGameHub';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Left Section */}
      <div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: '0 0 0.25rem 0'
        }}>
          {getPageTitle()}
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          margin: 0
        }}>
          {getGreeting()}, Ekarna! Ready to learn something new?
        </p>
      </div>

      {/* Right Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Search */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search 
            size={18} 
            style={{
              position: 'absolute',
              left: '12px',
              color: 'var(--text-muted)'
            }} 
          />
          <input
            type="text"
            placeholder="Search games..."
            style={{
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              width: '200px',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Notifications */}
        <button style={{
          position: 'relative',
          padding: '0.75rem',
          borderRadius: '12px',
          border: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--error-text)',
            borderRadius: '50%'
          }} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: '0.75rem',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            backgroundColor: darkMode ? 'var(--warning-bg)' : 'var(--physics-bg)',
            color: darkMode ? 'var(--warning-text)' : 'var(--physics-text)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'var(--physics-accent)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--physics-text)',
          fontWeight: '700',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: '2px solid var(--physics-accent)'
        }}>
          E
        </div>
      </div>
    </header>
  );
};

export default Header;