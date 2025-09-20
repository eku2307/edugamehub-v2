import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { 
  Zap, 
  Play, 
  Trophy, 
  Clock,
  Target,
  RotateCcw,
  Magnet,
  Waves,
  Sun,
  Atom
} from 'lucide-react';

// Import game components (you'll create these)
import ProjectileMotion from '../components/Games/Physics/ProjectileMotion';
import MagnetismGame from '../components/Games/Physics/MagnetismGame';
import WaveSimulator from '../components/Games/Physics/WaveSimulator';
import OpticsLab from '../components/Games/Physics/OpticsLab';
import ElectricCircuits from '../components/Games/Physics/ElectricCircuits';

const Physics = () => {
  const location = useLocation();
  const params = useParams();
  const isGameView = params.gameId !== undefined;
  
  const [playerStats] = useState({
    level: 3,
    totalScore: 420,
    gamesCompleted: 5,
    averageScore: 84,
    timeSpent: 45 // hours
  });

  const physicsGames = [
    {
      id: 'projectile-motion',
      title: 'Projectile Motion',
      description: 'Learn about trajectory, velocity, and gravity effects on moving objects.',
      difficulty: 'Medium',
      duration: '15-20 min',
      icon: Target,
      completed: true,
      score: 85,
      topics: ['Kinematics', 'Gravity', 'Velocity'],
      component: ProjectileMotion
    },
    {
      id: 'magnetism',
      title: 'Magnetism Explorer',
      description: 'Explore magnetic fields, poles, and electromagnetic interactions.',
      difficulty: 'Medium',
      duration: '12-18 min',
      icon: Magnet,
      completed: true,
      score: 78,
      topics: ['Magnetic Fields', 'Poles', 'Electromagnetic Induction'],
      component: MagnetismGame
    },
    {
      id: 'waves',
      title: 'Wave Simulator',
      description: 'Study wave properties: frequency, amplitude, wavelength, and interference.',
      difficulty: 'Hard',
      duration: '20-25 min',
      icon: Waves,
      completed: false,
      score: null,
      topics: ['Wave Properties', 'Interference', 'Standing Waves'],
      component: WaveSimulator
    },
    {
      id: 'optics',
      title: 'Optics Lab',
      description: 'Experiment with light reflection, refraction, and lens systems.',
      difficulty: 'Hard',
      duration: '18-22 min',
      icon: Sun,
      completed: false,
      score: null,
      topics: ['Reflection', 'Refraction', 'Lenses', 'Mirrors'],
      component: OpticsLab
    },
    {
      id: 'circuits',
      title: 'Electric Circuits',
      description: 'Build and analyze electrical circuits with resistors, capacitors, and more.',
      difficulty: 'Expert',
      duration: '25-30 min',
      icon: Zap,
      completed: false,
      score: null,
      topics: ['Ohm\'s Law', 'Current', 'Voltage', 'Resistance'],
      component: ElectricCircuits
    }
  ];

  // Game View Component
  const GameView = () => {
    const { gameId } = useParams();
    const game = physicsGames.find(g => g.id === gameId);
    
    if (!game) {
      return (
        <div className="fade-in">
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Game Not Found</h2>
            <p>The requested physics game could not be found.</p>
            <Link to="/physics">
              <button className="btn btn-primary">Back to Physics</button>
            </Link>
          </div>
        </div>
      );
    }
    
    const GameComponent = game.component;
    return <GameComponent />;
  };

  const PhysicsOverview = () => (
    <div className="fade-in">
      {/* Header Stats */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--physics-bg)', border: '1px solid var(--physics-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--physics-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Level
              </h3>
              <p style={{ color: 'var(--physics-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.level}
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
              <Trophy size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--success-bg)', border: '1px solid var(--success-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--success-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Total Score
              </h3>
              <p style={{ color: 'var(--success-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.totalScore}
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
              <Target size={24} />
            </div>
          </div>
        </div>

        <div className="card" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-text)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--warning-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Completed
              </h3>
              <p style={{ color: 'var(--warning-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.gamesCompleted}/{physicsGames.length}
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
              <Play size={24} />
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
                {playerStats.timeSpent}h
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

      {/* Games Grid */}
      <div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Zap size={20} />
          Physics Games
        </h3>
        
        <div className="card-grid cols-2">
          {physicsGames.map(game => (
            <Link
              key={game.id}
              to={`/physics/${game.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                background: 'var(--physics-bg)',
                border: '1px solid var(--physics-accent)',
                position: 'relative'
              }}>
                {game.completed && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
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
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--physics-accent)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--physics-text)',
                    flexShrink: 0
                  }}>
                    <game.icon size={24} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700',
                      color: 'var(--physics-text)',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {game.title}
                    </h4>
                    <p style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--physics-text)',
                      opacity: 0.8,
                      margin: '0 0 1rem 0',
                      lineHeight: 1.4
                    }}>
                      {game.description}
                    </p>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {game.topics.map(topic => (
                    <span key={topic} style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--physics-text)',
                      color: 'var(--physics-bg)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--physics-text)',
                  opacity: 0.8
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span>⏱️ {game.duration}</span>
                    <span>📊 {game.difficulty}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: 'var(--physics-text)',
                    color: 'var(--physics-bg)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    <Play size={14} />
                    {game.completed ? 'Play Again' : 'Start Game'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  // If we have a gameId parameter, show the game
  if (isGameView) {
    return <GameView />;
  }

  // Otherwise show the physics overview
  return <PhysicsOverview />;
};

export default Physics;
