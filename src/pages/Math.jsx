import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calculator, 
  Play, 
  Trophy, 
  Clock,
  Target,
  BarChart3,
  PieChart,
  TrendingUp
} from 'lucide-react';

// Import your math game components here
import AlgebraChallenge from '../components/Games/Math/AlgebraChallenge';
import CalculusVisualizer from '../components/Games/Math/CalculusVisualizer';
import GeometryProofs from '../components/Games/Math/GeometryProofs';
import GraphingCalculator from '../components/Games/Math/GraphingCalculator';
import ProbabilityLab from '../components/Games/Math/ProbabilityLab';

const Math = () => {
  const { gameId } = useParams();
  
  const [playerStats] = useState({
    level: 2,
    totalScore: 280,
    gamesCompleted: 1,
    averageScore: 78,
    timeSpent: 32
  });

  const mathGames = [
    {
      id: 'algebra-challenge',
      title: 'Algebra Challenge',
      description: 'Solve linear and quadratic equations with visual feedback and step-by-step guidance.',
      difficulty: 'Medium',
      duration: '15 min',
      icon: Calculator,
      completed: true,
      score: 78,
      topics: ['Linear Equations', 'Quadratic Equations', 'System of Equations'],
      component: AlgebraChallenge
    },
    {
      id: 'calculus-visualizer',
      title: 'Calculus Visualizer',
      description: 'Understand derivatives and integrals through interactive visualizations.',
      difficulty: 'Expert',
      duration: '30 min',
      icon: TrendingUp,
      completed: false,
      score: null,
      topics: ['Derivatives', 'Integrals', 'Limits', 'Optimization'],
      component: CalculusVisualizer
    },
    {
      id: 'geometry-proofs',
      title: 'Geometry Proofs',
      description: 'Interactive geometric proofs and constructions with dynamic diagrams.',
      difficulty: 'Hard',
      duration: '25 min',
      icon: Target,
      completed: false,
      score: null,
      topics: ['Geometric Proofs', 'Constructions', 'Theorems'],
      component: GeometryProofs
    },
    {
      id: 'graphing-calculator',
      title: 'Graphing Calculator',
      description: 'Plot functions, explore transformations, and analyze mathematical relationships.',
      difficulty: 'Medium',
      duration: '18 min',
      icon: BarChart3,
      completed: false,
      score: null,
      topics: ['Function Graphing', 'Transformations', 'Domain & Range'],
      component: GraphingCalculator
    },
    {
      id: 'probability-lab',
      title: 'Probability Lab',
      description: 'Explore probability concepts through simulations and interactive experiments.',
      difficulty: 'Easy',
      duration: '12 min',
      icon: PieChart,
      completed: false,
      score: null,
      topics: ['Probability', 'Statistics', 'Random Variables'],
      component: ProbabilityLab
    }
  ];

  // If a specific game is requested, render that game component
  if (gameId) {
    const game = mathGames.find(g => g.id === gameId);
    if (game && game.component) {
      return <game.component />;
    }
  }

  // Main Math hub view
  return (
    <div className="fade-in">
      {/* Header Stats */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--math-bg)', border: '1px solid var(--math-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--math-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Level
              </h3>
              <p style={{ color: 'var(--math-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.level}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--math-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--math-text)'
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
                {playerStats.gamesCompleted}/{mathGames.length}
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

      {/* Math Games */}
      <div>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Calculator size={24} />
          Mathematics Games
        </h3>
        
        <div className="card-grid cols-2">
          {mathGames.map(game => (
            <Link
              key={game.id}
              to={`/math/${game.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                background: 'var(--math-bg)',
                border: '1px solid var(--math-accent)',
                position: 'relative',
                minHeight: '200px'
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
                    backgroundColor: 'var(--math-accent)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--math-text)',
                    flexShrink: 0
                  }}>
                    <game.icon size={24} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700',
                      color: 'var(--math-text)',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {game.title}
                    </h4>
                  </div>
                </div>

                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--math-text)',
                  opacity: 0.8,
                  margin: '0 0 1rem 0',
                  lineHeight: 1.4
                }}>
                  {game.description}
                </p>

                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {game.topics.slice(0, 2).map(topic => (
                    <span key={topic} style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--math-text)',
                      color: 'var(--math-bg)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {topic}
                    </span>
                  ))}
                  {game.topics.length > 2 && (
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--math-accent)',
                      color: 'var(--math-text)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      +{game.topics.length - 2} more
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--math-text)',
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
                    backgroundColor: 'var(--math-text)',
                    color: 'var(--math-bg)',
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
};

export default Math;