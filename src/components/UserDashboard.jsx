import React, { useState, useEffect } from 'react';
import { User, Book, Trophy, Clock, Target, TrendingUp, LogOut, Settings } from 'lucide-react';

const UserDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isSignup, setIsSignup] = useState(false);

  // Mock user data - in real app, this would come from backend
  const mockUserData = {
    username: 'student123',
    email: 'student@example.com',
    avatar: null,
    joinDate: '2024-01-15',
    stats: {
      totalScore: 2847,
      level: 12,
      gamesPlayed: 45,
      videosWatched: 23,
      quizzesTaken: 31,
      streak: 7
    },
    recentActivity: [
      { type: 'game', name: 'Chemical Bonding', score: 150, time: '2 hours ago' },
      { type: 'quiz', name: 'Physics Quiz 1', score: 85, time: '1 day ago' },
      { type: 'video', name: 'DNA Replication', time: '2 days ago' },
      { type: 'game', name: 'Calculus Visualizer', score: 200, time: '3 days ago' }
    ],
    achievements: [
      { name: 'First Steps', desc: 'Complete your first game', earned: true },
      { name: 'Quiz Master', desc: 'Score 90%+ on 5 quizzes', earned: true },
      { name: 'Video Learner', desc: 'Watch 20 educational videos', earned: true },
      { name: 'Math Wizard', desc: 'Complete all math games', earned: false },
      { name: 'Science Explorer', desc: 'Try all science experiments', earned: false }
    ]
  };

  // Check for existing login on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('eduPlatformUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - in real app, validate with backend
    if (loginData.username && loginData.password) {
      const userData = { ...mockUserData, username: loginData.username };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('eduPlatformUser', JSON.stringify(userData));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (signupData.username && signupData.email && signupData.password) {
      const userData = { 
        ...mockUserData, 
        username: signupData.username,
        email: signupData.email,
        stats: { ...mockUserData.stats, totalScore: 0, level: 1, gamesPlayed: 0 },
        recentActivity: []
      };
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('eduPlatformUser', JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('eduPlatformUser');
    setLoginData({ username: '', password: '' });
  };

  // Login/Signup Form
  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📚✨
            </div>
            <h1 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
              {isSignup ? 'Join EduPlatform' : 'Welcome Back'}
            </h1>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              {isSignup ? 'Start your learning journey' : 'Continue your learning adventure'}
            </p>
          </div>

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                Username
              </label>
              <input
                type="text"
                value={isSignup ? signupData.username : loginData.username}
                onChange={(e) => isSignup 
                  ? setSignupData({...signupData, username: e.target.value})
                  : setLoginData({...loginData, username: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your username"
                required
              />
            </div>

            {isSignup && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            <div style={{ marginBottom: isSignup ? '1rem' : '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                Password
              </label>
              <input
                type="password"
                value={isSignup ? signupData.password : loginData.password}
                onChange={(e) => isSignup 
                  ? setSignupData({...signupData, password: e.target.value})
                  : setLoginData({...loginData, password: e.target.value})
                }
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {isSignup && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#333' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </button>
            </div>
          </form>

          {/* Demo credentials hint */}
          {!isSignup && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#f3f4f6',
              borderRadius: '10px',
              fontSize: '0.875rem',
              color: '#666'
            }}>
              <strong>Demo:</strong> Use any username/password to login and see the dashboard
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        background: 'white',
        padding: '1.5rem',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: 'white'
          }}>
            {user.avatar || <User size={24} />}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>
              Welcome, {user.username}!
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>
              Ready to continue learning?
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{
            padding: '0.5rem',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <Settings size={20} color="#666" />
          </button>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <Trophy size={32} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {user.stats.totalScore}
          </div>
          <div style={{ opacity: 0.9 }}>Total Score</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <Target size={32} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {user.stats.level}
          </div>
          <div style={{ opacity: 0.9 }}>Level</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <Book size={32} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {user.stats.gamesPlayed}
          </div>
          <div style={{ opacity: 0.9 }}>Games Played</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #fa709a, #fee140)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <TrendingUp size={32} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {user.stats.streak}
          </div>
          <div style={{ opacity: 0.9 }}>Day Streak</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Recent Activity */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user.recentActivity.map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: activity.type === 'game' ? '#667eea' : activity.type === 'quiz' ? '#10b981' : '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  {activity.type === 'game' ? '🎮' : activity.type === 'quiz' ? '❓' : '📹'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#333' }}>{activity.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>
                    {activity.score && `Score: ${activity.score} • `}{activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Achievements</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {user.achievements.map((achievement, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: achievement.earned ? '#f0fdf4' : '#f8fafc',
                borderRadius: '8px',
                opacity: achievement.earned ? 1 : 0.6
              }}>
                <div style={{ fontSize: '1.5rem' }}>
                  {achievement.earned ? '🏆' : '🔒'}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '500', 
                    color: achievement.earned ? '#16a34a' : '#666',
                    fontSize: '0.875rem'
                  }}>
                    {achievement.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    {achievement.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '2rem',
        background: 'white',
        padding: '2rem',
        borderRadius: '15px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#333' }}>Continue Learning</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Chemical Bonding', type: 'Game', color: '#667eea', progress: 75 },
            { name: 'Math Quiz', type: 'Quiz', color: '#10b981', progress: 0 },
            { name: 'Physics Videos', type: 'Video', color: '#f59e0b', progress: 40 },
            { name: 'Biology Lab', type: 'Game', color: '#ef4444', progress: 25 }
          ].map((item, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
              borderRadius: '12px',
              border: `2px solid ${item.color}20`,
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{ fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                {item.type}
              </div>
              <div style={{ 
                width: '100%',
                height: '4px',
                background: '#e5e7eb',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${item.progress}%`,
                  height: '100%',
                  background: item.color,
                  borderRadius: '2px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;