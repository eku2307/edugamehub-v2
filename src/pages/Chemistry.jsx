import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Atom, 
  Play, 
  Trophy, 
  Clock,
  Target,
  Beaker,
  FlaskConical,
  TestTube,
  Activity
} from 'lucide-react';

// Import your chemistry game components here
import MolecularBuilder from '../components/Games/Chemistry/MolecularBuilder';
import ReactionBalancer from '../components/Games/Chemistry/ReactionBalancer';
import pHLab from '../components/Games/Chemistry/pHLab';
import PeriodicTableGame from '../components/Games/Chemistry/PeriodicTableGame';
import ChemicalBonding from '../components/Games/Chemistry/ChemicalBonding';

const Chemistry = () => {
  const { gameId } = useParams();
  
  const [playerStats] = useState({
    level: 2,
    totalScore: 320,
    gamesCompleted: 1,
    averageScore: 92,
    timeSpent: 25
  });

  const chemistryGames = [
    {
      id: 'molecular-builder',
      title: 'Molecular Builder',
      description: 'Build 3D molecular structures and understand chemical bonding principles.',
      difficulty: 'Medium',
      duration: '20 min',
      icon: Atom,
      completed: true,
      score: 92,
      topics: ['Covalent Bonds', 'Molecular Geometry', 'VSEPR Theory'],
      component: MolecularBuilder
    },
    {
      id: 'reaction-balancer',
      title: 'Reaction Balancer',
      description: 'Balance chemical equations and predict reaction products.',
      difficulty: 'Medium',
      duration: '16 min',
      icon: Beaker,
      completed: false,
      score: null,
      topics: ['Chemical Equations', 'Conservation of Mass', 'Stoichiometry'],
      component: ReactionBalancer
    },
    {
      id: 'ph-lab',
      title: 'pH Laboratory',
      description: 'Explore acids, bases, and pH through interactive experiments.',
      difficulty: 'Easy',
      duration: '12 min',
      icon: FlaskConical,
      completed: false,
      score: null,
      topics: ['Acids & Bases', 'pH Scale', 'Indicators'],
      component: pHLab
    },
    {
      id: 'periodic-table',
      title: 'Periodic Table Game',
      description: 'Learn element properties and periodic trends through games.',
      difficulty: 'Easy',
      duration: '14 min',
      icon: TestTube,
      completed: false,
      score: null,
      topics: ['Element Properties', 'Periodic Trends', 'Atomic Structure'],
      component: PeriodicTableGame
    },
    {
      id: 'chemical-bonding',
      title: 'Chemical Bonding',
      description: 'Explore ionic and covalent bonding mechanisms.',
      difficulty: 'Hard',
      duration: '18 min',
      icon: Activity,
      completed: false,
      score: null,
      topics: ['Ionic Bonds', 'Covalent Bonds', 'Lewis Structures'],
      component: ChemicalBonding
    }
  ];

  // If a specific game is requested, render that game component
  if (gameId) {
    const game = chemistryGames.find(g => g.id === gameId);
    if (game) {
      const GameComponent = game.component;
      
      return (
        <div className="fade-in">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Link to="/chemistry" className="btn" style={{ padding: '0.5rem' }}>
                ← Back to Chemistry
              </Link>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
                  {game.title}
                </h1>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
                  {game.description}
                </p>
              </div>
            </div>
            
            <GameComponent />
          </div>
        </div>
      );
    }
  }

  // Main Chemistry hub view (unchanged from your original code)
  return (
    <div className="fade-in">
      {/* Header Stats */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--chemistry-bg)', border: '1px solid var(--chemistry-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--chemistry-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Level
              </h3>
              <p style={{ color: 'var(--chemistry-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.level}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--chemistry-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--chemistry-text)'
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
                {playerStats.gamesCompleted}/{chemistryGames.length}
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

      {/* Chemistry Games */}
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
          <Atom size={24} />
          Chemistry Games
        </h3>
        
        <div className="card-grid cols-2">
          {chemistryGames.map(game => (
            <Link
              key={game.id}
              to={`/chemistry/${game.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                background: 'var(--chemistry-bg)',
                border: '1px solid var(--chemistry-accent)',
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
                    backgroundColor: 'var(--chemistry-accent)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--chemistry-text)',
                    flexShrink: 0
                  }}>
                    <game.icon size={24} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700',
                      color: 'var(--chemistry-text)',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {game.title}
                    </h4>
                  </div>
                </div>

                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--chemistry-text)',
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
                      backgroundColor: 'var(--chemistry-text)',
                      color: 'var(--chemistry-bg)',
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
                      backgroundColor: 'var(--chemistry-accent)',
                      color: 'var(--chemistry-text)',
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
                  color: 'var(--chemistry-text)',
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
                    backgroundColor: 'var(--chemistry-text)',
                    color: 'var(--chemistry-bg)',
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

export default Chemistry;