import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Dna, 
  Play, 
  Trophy, 
  Clock,
  Target,
  Microscope,
  TreePine,
  Activity,
  Heart
} from 'lucide-react';

// Import your biology game components here
import CellStructure from '../components/Games/Biology/CellStructure';
import DNAReplication from '../components/Games/Biology/DNAReplication';
import EcosystemSimulator from '../components/Games/Biology/EcosystemSimulator';
import EvolutionTree from '../components/Games/Biology/EvolutionTree';
import GeneticsLab from '../components/Games/Biology/GeneticsLab';

const Biology = () => {
  const { gameId } = useParams();
  
  const [playerStats] = useState({
    level: 2,
    totalScore: 410,
    gamesCompleted: 1,
    averageScore: 88,
    timeSpent: 28
  });

  const biologyGames = [
    {
      id: 'dna-replication',
      title: 'DNA Replication',
      description: 'Learn about base pairing and the DNA replication process through interactive gameplay.',
      difficulty: 'Medium',
      duration: '16 min',
      icon: Dna,
      completed: true,
      score: 88,
      topics: ['DNA Structure', 'Base Pairing', 'Replication Process'],
      component: DNAReplication
    },
    {
      id: 'cell-structure',
      title: 'Cell Structure Explorer',
      description: 'Identify organelles and understand their functions in prokaryotic and eukaryotic cells.',
      difficulty: 'Easy',
      duration: '14 min',
      icon: Microscope,
      completed: false,
      score: null,
      topics: ['Cell Organelles', 'Cell Types', 'Cellular Functions'],
      component: CellStructure
    },
    {
      id: 'ecosystem-simulator',
      title: 'Ecosystem Simulator',
      description: 'Build food webs and explore ecological relationships in different biomes.',
      difficulty: 'Hard',
      duration: '22 min',
      icon: TreePine,
      completed: false,
      score: null,
      topics: ['Food Webs', 'Ecological Relationships', 'Biodiversity'],
      component: EcosystemSimulator
    },
    {
      id: 'genetics-lab',
      title: 'Genetics Laboratory',
      description: 'Explore inheritance patterns, genetic crosses, and Mendelian genetics.',
      difficulty: 'Hard',
      duration: '20 min',
      icon: Activity,
      completed: false,
      score: null,
      topics: ['Mendelian Genetics', 'Inheritance Patterns', 'Genetic Crosses'],
      component: GeneticsLab
    },
    {
      id: 'evolution-tree',
      title: 'Evolution Tree Builder',
      description: 'Construct phylogenetic trees and understand evolutionary relationships.',
      difficulty: 'Expert',
      duration: '25 min',
      icon: Heart,
      completed: false,
      score: null,
      topics: ['Phylogenetic Trees', 'Evolution', 'Species Relationships'],
      component: EvolutionTree
    }
  ];

  // If a specific game is requested, render that game component
  if (gameId) {
    const game = biologyGames.find(g => g.id === gameId);
    if (game && game.component) {
      return <game.component />;
    }
  }

  // Main Biology hub view
  return (
    <div className="fade-in">
      {/* Header Stats */}
      <div className="card-grid cols-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'var(--biology-bg)', border: '1px solid var(--biology-accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ color: 'var(--biology-text)', fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Level
              </h3>
              <p style={{ color: 'var(--biology-text)', fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                {playerStats.level}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--biology-accent)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--biology-text)'
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
                {playerStats.gamesCompleted}/{biologyGames.length}
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

      {/* Biology Games */}
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
          <Dna size={24} />
          Biology Games
        </h3>
        
        <div className="card-grid cols-2">
          {biologyGames.map(game => (
            <Link
              key={game.id}
              to={`/biology/${game.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{
                background: 'var(--biology-bg)',
                border: '1px solid var(--biology-accent)',
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
                    backgroundColor: 'var(--biology-accent)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--biology-text)',
                    flexShrink: 0
                  }}>
                    <game.icon size={24} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700',
                      color: 'var(--biology-text)',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {game.title}
                    </h4>
                  </div>
                </div>

                <p style={{ 
                  fontSize: '0.875rem',
                  color: 'var(--biology-text)',
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
                      backgroundColor: 'var(--biology-text)',
                      color: 'var(--biology-bg)',
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
                      backgroundColor: 'var(--biology-accent)',
                      color: 'var(--biology-text)',
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
                  color: 'var(--biology-text)',
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
                    backgroundColor: 'var(--biology-text)',
                    color: 'var(--biology-bg)',
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

export default Biology;