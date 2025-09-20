import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Zap, 
  Target, 
  Clock, 
  TrendingUp,
  Play,
  Star,
  Calendar,
  Award,
  BookOpen,
  Atom,
  Calculator,
  Dna,
  Magnet,
  Waves,
  Sun,
  Beaker,
  FlaskConical,
  TestTube,
  Activity,
  BarChart3,
  PieChart,
  Microscope,
  TreePine,
  Heart
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScore: 1250,
    streak: 7,
    gamesPlayed: 43,
    timeSpent: 127 // hours
  });

  const [recentActivities] = useState([
    { subject: 'Physics', game: 'Projectile Motion', score: 85, time: '2 hours ago', icon: Target },
    { subject: 'Chemistry', game: 'Molecular Builder', score: 92, time: '1 day ago', icon: Atom },
    { subject: 'Math', game: 'Algebra Challenge', score: 78, time: '2 days ago', icon: Calculator },
    { subject: 'Biology', game: 'DNA Replication', score: 88, time: '3 days ago', icon: Dna },
    { subject: 'Physics', game: 'Wave Simulator', score: 91, time: '4 days ago', icon: Waves },
  ]);

  // All available games organized by subject
  const allGames = {
    physics: [
      { 
        id: 'projectile-motion', 
        name: 'Projectile Motion', 
        description: 'Learn trajectory and gravity effects',
        icon: Target,
        difficulty: 'Medium',
        duration: '15 min',
        completed: true,
        score: 85
      },
      { 
        id: 'magnetism', 
        name: 'Magnetism Explorer', 
        description: 'Explore magnetic fields and poles',
        icon: Magnet,
        difficulty: 'Medium',
        duration: '18 min',
        completed: true,
        score: 78
      },
      { 
        id: 'waves', 
        name: 'Wave Simulator', 
        description: 'Study wave properties and interference',
        icon: Waves,
        difficulty: 'Hard',
        duration: '20 min',
        completed: false,
        score: null
      },
      { 
        id: 'optics', 
        name: 'Optics Lab', 
        description: 'Light reflection and refraction',
        icon: Sun,
        difficulty: 'Hard',
        duration: '22 min',
        completed: false,
        score: null
      },
      { 
        id: 'circuits', 
        name: 'Electric Circuits', 
        description: 'Build and analyze circuits',
        icon: Zap,
        difficulty: 'Expert',
        duration: '25 min',
        completed: false,
        score: null
      }
    ],
    chemistry: [
      { 
        id: 'molecular-builder', 
        name: 'Molecular Builder', 
        description: 'Build 3D molecular structures',
        icon: Atom,
        difficulty: 'Medium',
        duration: '20 min',
        completed: true,
        score: 92
      },
      { 
        id: 'reaction-balancer', 
        name: 'Reaction Balancer', 
        description: 'Balance chemical equations',
        icon: Beaker,
        difficulty: 'Medium',
        duration: '16 min',
        completed: false,
        score: null
      },
      { 
        id: 'ph-lab', 
        name: 'pH Laboratory', 
        description: 'Explore acids and bases',
        icon: FlaskConical,
        difficulty: 'Easy',
        duration: '12 min',
        completed: false,
        score: null
      },
      { 
        id: 'periodic-table', 
        name: 'Periodic Table Game', 
        description: 'Learn element properties',
        icon: TestTube,
        difficulty: 'Easy',
        duration: '14 min',
        completed: false,
        score: null
      },
      { 
        id: 'bonding', 
        name: 'Chemical Bonding', 
        description: 'Ionic and covalent bonds',
        icon: Activity,
        difficulty: 'Hard',
        duration: '18 min',
        completed: false,
        score: null
      }
    ],
    math: [
      { 
        id: 'algebra-challenge', 
        name: 'Algebra Challenge', 
        description: 'Solve equations with visual aid',
        icon: Calculator,
        difficulty: 'Medium',
        duration: '15 min',
        completed: true,
        score: 78
      },
      { 
        id: 'geometry-proofs', 
        name: 'Geometry Proofs', 
        description: 'Interactive geometric proofs',
        icon: Target,
        difficulty: 'Hard',
        duration: '25 min',
        completed: false,
        score: null
      },
      { 
        id: 'graphing-calculator', 
        name: 'Graphing Calculator', 
        description: 'Plot and analyze functions',
        icon: BarChart3,
        difficulty: 'Medium',
        duration: '18 min',
        completed: false,
        score: null
      },
      { 
        id: 'probability-lab', 
        name: 'Probability Lab', 
        description: 'Statistics and probability',
        icon: PieChart,
        difficulty: 'Easy',
        duration: '12 min',
        completed: false,
        score: null
      },
      { 
        id: 'calculus-visualizer', 
        name: 'Calculus Visualizer', 
        description: 'Derivatives and integrals',
        icon: TrendingUp,
        difficulty: 'Expert',
        duration: '30 min',
        completed: false,
        score: null
      }
    ],
    biology: [
      { 
        id: 'dna-replication', 
        name: 'DNA Replication', 
        description: 'Base pairing and replication',
        icon: Dna,
        difficulty: 'Medium',
        duration: '16 min',
        completed: true,
        score: 88
      },
      { 
        id: 'cell-structure', 
        name: 'Cell Structure', 
        description: 'Identify organelles and functions',
        icon: Microscope,
        difficulty: 'Easy',
        duration: '14 min',
        completed: false,
        score: null
      },
      { 
        id: 'ecosystem-simulator', 
        name: 'Ecosystem Simulator', 
        description: 'Build food webs and chains',
        icon: TreePine,
        difficulty: 'Hard',
        duration: '22 min',
        completed: false,
        score: null
      },
      { 
        id: 'genetics-lab', 
        name: 'Genetics Lab', 
        description: 'Inheritance patterns',
        icon: Activity,
        difficulty: 'Hard',
        duration: '20 min',
        completed: false,
        score: null
      },
      { 
        id: 'human-body', 
        name: 'Human Body Systems', 
        description: 'Explore body systems',
        icon: Heart,
        difficulty: 'Medium',
        duration: '18 min',
        completed: false,
        score: null
      }
    ]
  };

  const subjects = [
    {
      id: 'physics',
      name: 'Physics',
      level: 3,
      progress: 40, // 2/5 completed
      description: 'Forces, Energy & Motion',
      icon: '⚡',
      games: allGames.physics
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      level: 2,
      progress: 20, // 1/5 completed
      description: 'Atoms, Molecules & Reactions',
      icon: '⚗️',
      games: allGames.chemistry
    },
    {
      id: 'math',
      name: 'Mathematics',
      level: 2,
      progress: 20, // 1/5 completed
      description: 'Algebra, Geometry & Calculus',
      icon: '📊',
      games: allGames.math
    },
    {
      id: 'biology',
      name: 'Biology',
      level: 2,
      progress: 20, // 1/5 completed
      description: 'Life Sciences & Genetics',
      icon: '🧬',
      games: allGames.biology
    }
  ];

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'var(--success-bg)',
      'Medium': 'var(--warning-bg)', 
      'Hard': 'var(--error-bg)',
      'Expert': 'var(--analytics-bg)'
    };
    return colors[difficulty] || colors['Medium'];
  };

  const getDifficultyTextColor = (difficulty) => {
    const colors = {
      'Easy': 'var(--success-text)',
      'Medium': 'var(--warning-text)', 
      'Hard': 'var(--error-text)',
      'Expert': 'var(--analytics-text)'
    };
    return colors[difficulty] || colors['Medium'];
  };

  return (
    <div className="fade-in">
      {/* Stats Overview */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--success-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Total Score
              </h3>
              <p style={{ color: 'var(--success-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.totalScore.toLocaleString()}
              </p>
              <p style={{ color: 'var(--success-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                +125 this week
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--success-text)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success-bg)'
            }}>
              <Trophy size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--warning-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Study Streak
              </h3>
              <p style={{ color: 'var(--warning-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.streak} days
              </p>
              <p style={{ color: 'var(--warning-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Keep it up!
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--warning-text)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning-bg)'
            }}>
              <Zap size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--physics-bg)', border: '1px solid var(--physics-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--physics-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Games Played
              </h3>
              <p style={{ color: 'var(--physics-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.gamesPlayed}
              </p>
              <p style={{ color: 'var(--physics-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                Across all subjects
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--physics-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--physics-text)'
            }}>
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--analytics-bg)', border: '1px solid var(--analytics-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--analytics-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Time Spent
              </h3>
              <p style={{ color: 'var(--analytics-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {stats.timeSpent}h
              </p>
              <p style={{ color: 'var(--analytics-text)', fontSize: '0.75rem', opacity: 0.8, margin: '0.25rem 0 0 0' }}>
                This month
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--analytics-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--analytics-text)'
            }}>
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <BookOpen size={24} />
          Learning Subjects
        </h2>
        
        <div className="card-grid cols-2">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              to={`/${subject.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className={`card subject-card ${subject.id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700',
                      color: `var(--${subject.id}-text)`,
                      margin: '0 0 0.25rem 0'
                    }}>
                      {subject.name}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: `var(--${subject.id}-text)`,
                      opacity: 0.8,
                      margin: '0 0 0.5rem 0'
                    }}>
                      Level {subject.level} • {subject.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.75rem',
                      color: `var(--${subject.id}-text)`,
                      opacity: 0.7
                    }}>
                      <span>{subject.games.filter(g => g.completed).length}/{subject.games.length} completed</span>
                      <span>{subject.games.filter(g => g.completed).reduce((sum, g) => sum + (g.score || 0), 0) / subject.games.filter(g => g.completed).length || 0}% avg</span>
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '2rem',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}>
                    {subject.icon}
                  </div>
                </div>

                <div className="progress-container">
                  <div 
                    className={`progress-bar ${subject.id}`}
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem'
                }}>
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: `var(--${subject.id}-text)`,
                    opacity: 0.8
                  }}>
                    {subject.progress}% complete
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: `var(--${subject.id}-text)`,
                    color: `var(--${subject.id}-bg)`,
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    <Play size={12} />
                    Explore
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Games Overview */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem'
        }}>
          All Available Games ({Object.values(allGames).flat().length} total)
        </h2>
        
        {Object.entries(allGames).map(([subjectKey, games]) => (
          <div key={subjectKey} style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600',
              color: `var(--${subjectKey}-text)`,
              marginBottom: '1rem',
              textTransform: 'capitalize'
            }}>
              {subjectKey} Games
            </h3>
            
            <div className="card-grid cols-3">
              {games.map(game => (
                <Link
                  key={game.id}
                  to={`/${subjectKey}/${game.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card" style={{
                    background: `var(--${subjectKey}-bg)`,
                    border: `1px solid var(--${subjectKey}-accent)`,
                    position: 'relative',
                    minHeight: '180px'
                  }}>
                    {game.completed && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: 'var(--success-text)',
                        color: 'var(--success-bg)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Trophy size={12} />
                        {game.score}%
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: `var(--${subjectKey}-accent)`,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: `var(--${subjectKey}-text)`,
                        flexShrink: 0
                      }}>
                        <game.icon size={20} />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600',
                          color: `var(--${subjectKey}-text)`,
                          margin: '0 0 0.25rem 0'
                        }}>
                          {game.name}
                        </h4>
                      </div>
                    </div>

                    <p style={{ 
                      fontSize: '0.875rem',
                      color: `var(--${subjectKey}-text)`,
                      opacity: 0.8,
                      margin: '0 0 1rem 0',
                      lineHeight: 1.4
                    }}>
                      {game.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      marginTop: 'auto'
                    }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <span style={{ color: `var(--${subjectKey}-text)`, opacity: 0.7 }}>
                          {game.duration}
                        </span>
                        <span 
                          style={{ 
                            padding: '0.125rem 0.375rem',
                            backgroundColor: getDifficultyColor(game.difficulty),
                            color: getDifficultyTextColor(game.difficulty),
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: '600'
                          }}
                        >
                          {game.difficulty}
                        </span>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        color: `var(--${subjectKey}-text)`,
                        fontWeight: '600'
                      }}>
                        <Play size={12} />
                        {game.completed ? 'Replay' : 'Play'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <TrendingUp size={20} />
          Recent Activity
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentActivities.map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `var(--${activity.subject.toLowerCase()}-bg)`,
                  border: `1px solid var(--${activity.subject.toLowerCase()}-accent)`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(--${activity.subject.toLowerCase()}-text)`
                }}>
                  <activity.icon size={20} />
                </div>
                <div>
                  <h4 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.25rem 0'
                  }}>
                    {activity.game}
                  </h4>
                  <p style={{ 
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    {activity.subject} • {activity.time}
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activity.score >= 80 ? 'var(--success-bg)' : 'var(--warning-bg)',
                color: activity.score >= 80 ? 'var(--success-text)' : 'var(--warning-text)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                <Star size={14} />
                {activity.score}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;