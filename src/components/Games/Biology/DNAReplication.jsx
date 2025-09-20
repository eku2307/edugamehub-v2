import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Trophy, Timer, Target } from 'lucide-react';

// Moved static data outside component to prevent recreation on every render
const replicationSteps = [
  {
    id: 1,
    title: "DNA Unwinding",
    description: "Helicase unwinds the DNA double helix",
    template: "ATCGGATCCT",
    complement: "",
    enzyme: "Helicase",
    instruction: "Click on the bases to separate the DNA strands"
  },
  {
    id: 2,
    title: "Leading Strand Synthesis",
    description: "DNA Polymerase synthesizes continuously",
    template: "ATCGGATCCT",
    complement: "TAGCCTAGGA",
    enzyme: "DNA Polymerase III",
    instruction: "Build the complementary strand (A→T, T→A, C→G, G→C)"
  },
  {
    id: 3,
    title: "Lagging Strand Synthesis",
    description: "DNA Polymerase creates Okazaki fragments",
    template: "TAGCCTAGGA",
    complement: "ATCGGATCCT",
    enzyme: "DNA Polymerase I",
    instruction: "Complete the lagging strand in fragments"
  }
];

const baseComplements = {
  'A': 'T',
  'T': 'A',
  'C': 'G',
  'G': 'C'
};

const availableBases = ['A', 'T', 'C', 'G'];

const MenuScreen = ({ onStartGame }) => (
  <div className="fade-in">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <Link to="/biology" style={{ color: 'var(--biology-text)', textDecoration: 'none' }}>
        <ArrowLeft size={24} />
      </Link>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)', margin: 0 }}>
        DNA Replication Lab
      </h1>
    </div>

    <div className="card" style={{ background: 'var(--biology-bg)', border: '2px solid var(--biology-accent)', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--biology-accent)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Target size={40} style={{ color: 'var(--biology-text)' }} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)', marginBottom: '1rem' }}>
          Master DNA Replication
        </h2>
        
        <p style={{ fontSize: '1rem', color: 'var(--biology-text)', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.6 }}>
          Learn the step-by-step process of DNA replication. Help enzymes unwind the double helix, 
          synthesize leading and lagging strands, and create accurate copies of genetic material.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>3</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Replication Steps</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>120s</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Time Limit</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>10</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Points per Base</div>
          </div>
        </div>

        <button
          onClick={onStartGame}
          style={{
            backgroundColor: 'var(--biology-accent)',
            color: 'var(--biology-text)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          <Play size={20} />
          Start Replication
        </button>
      </div>
    </div>
  </div>
);

const GameScreen = ({ 
  currentStep, 
  selectedBases, 
  mistakes, 
  score, 
  timeLeft, 
  onAddBase, 
  onResetGame 
}) => {
  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/biology" style={{ color: 'var(--biology-text)', textDecoration: 'none' }}>
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)', margin: 0 }}>
            DNA Replication - Step {currentStep + 1}
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--biology-text)' }}>
            <Timer size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--biology-text)' }}>
            <Trophy size={16} />
            <span>{score}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--biology-bg)', border: '1px solid var(--biology-accent)', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--biology-text)', marginBottom: '0.5rem' }}>
            {replicationSteps[currentStep].title}
          </h3>
          <p style={{ color: 'var(--biology-text)', opacity: 0.8, marginBottom: '1rem' }}>
            {replicationSteps[currentStep].description}
          </p>
          <div style={{ 
            display: 'inline-block', 
            backgroundColor: 'var(--biology-accent)', 
            color: 'var(--biology-text)', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '6px', 
            fontSize: '0.875rem', 
            fontWeight: '600' 
          }}>
            Enzyme: {replicationSteps[currentStep].enzyme}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--biology-accent)', marginBottom: '2rem' }}>
        <div style={{ padding: '2rem' }}>
          <h4 style={{ color: 'var(--biology-text)', marginBottom: '1rem' }}>
            {replicationSteps[currentStep].instruction}
          </h4>
          
          {/* DNA Strands Visualization */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Template Strand (3' → 5')
              </div>
              <div style={{ display: 'flex', gap: '2px', fontFamily: 'monospace', fontSize: '1.25rem' }}>
                {replicationSteps[currentStep].template.split('').map((base, idx) => (
                  <div
                    key={`template-${idx}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: base === 'A' ? '#FF6B6B' : base === 'T' ? '#4ECDC4' : base === 'C' ? '#45B7D1' : '#96CEB4',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                  >
                    {base}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                New Strand (5' → 3')
              </div>
              <div style={{ display: 'flex', gap: '2px', fontFamily: 'monospace', fontSize: '1.25rem' }}>
                {replicationSteps[currentStep].template.split('').map((base, idx) => (
                  <div
                    key={`new-strand-${idx}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: idx < selectedBases.length ? 
                        (selectedBases[idx] === 'A' ? '#FF6B6B' : selectedBases[idx] === 'T' ? '#4ECDC4' : selectedBases[idx] === 'C' ? '#45B7D1' : '#96CEB4') : 
                        'var(--bg-secondary)',
                      color: idx < selectedBases.length ? 'white' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      border: idx === selectedBases.length ? '2px solid var(--biology-accent)' : '1px solid var(--border-color)'
                    }}
                  >
                    {idx < selectedBases.length ? selectedBases[idx] : '?'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Base Selection */}
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Select the complementary base:
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {availableBases.map(base => (
                <button
                  key={`base-${base}`}
                  onClick={() => onAddBase(base)}
                  disabled={selectedBases.length >= replicationSteps[currentStep].template.length}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: base === 'A' ? '#FF6B6B' : base === 'T' ? '#4ECDC4' : base === 'C' ? '#45B7D1' : '#96CEB4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    cursor: selectedBases.length >= replicationSteps[currentStep].template.length ? 'not-allowed' : 'pointer',
                    opacity: selectedBases.length >= replicationSteps[currentStep].template.length ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {base}
                </button>
              ))}
            </div>
          </div>

          {mistakes > 0 && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: 'rgba(255, 107, 107, 0.1)', 
              border: '1px solid #FF6B6B', 
              borderRadius: '8px',
              color: '#FF6B6B',
              fontSize: '0.875rem'
            }}>
              Mistakes: {mistakes} (-5 points each)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CompletedScreen = ({ score, mistakes, onResetGame }) => {
  const finalScore = Math.max(0, score - (mistakes * 5));
  const percentage = Math.round((finalScore / 460) * 100); // Max possible score: 460
  
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/biology" style={{ color: 'var(--biology-text)', textDecoration: 'none' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)', margin: 0 }}>
          Replication Complete!
        </h1>
      </div>

      <div className="card" style={{ background: 'var(--biology-bg)', border: '2px solid var(--biology-accent)' }}>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            backgroundColor: percentage >= 80 ? 'var(--success-text)' : percentage >= 60 ? 'var(--warning-text)' : '#FF6B6B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto'
          }}>
            <Trophy size={50} style={{ color: 'white' }} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)', marginBottom: '1rem' }}>
            Final Score: {finalScore}
          </h2>
          
          <div style={{ fontSize: '1.25rem', color: 'var(--biology-text)', marginBottom: '2rem' }}>
            Accuracy: {percentage}%
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-text)' }}>
                {replicationSteps.length}
              </div>
              <div style={{ color: 'var(--biology-text)', opacity: 0.8 }}>Steps Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: mistakes > 3 ? '#FF6B6B' : 'var(--success-text)' }}>
                {mistakes}
              </div>
              <div style={{ color: 'var(--biology-text)', opacity: 0.8 }}>Mistakes Made</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={onResetGame}
              style={{
                backgroundColor: 'var(--biology-accent)',
                color: 'var(--biology-text)',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RotateCcw size={20} />
              Play Again
            </button>
            
            <Link to="/biology">
              <button
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  padding: '1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Back to Biology
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DNAReplication = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBases, setSelectedBases] = useState([]);
  const [mistakes, setMistakes] = useState(0);

  // Use a ref to track the timer without causing re-renders
  const timerRef = React.useRef(null);

  useEffect(() => {
    // Clean up timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(120);
    setCurrentStep(0);
    setSelectedBases([]);
    setMistakes(0);
    
    // Start the timer with setInterval instead of setTimeout in a loop
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setGameState('completed');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState('menu');
    setScore(0);
    setTimeLeft(120);
    setCurrentStep(0);
    setSelectedBases([]);
    setMistakes(0);
  }, []);

  const addBase = useCallback((base) => {
    if (gameState !== 'playing') return;
    
    const currentTemplate = replicationSteps[currentStep].template;
    const expectedBase = baseComplements[currentTemplate[selectedBases.length]];
    
    if (base === expectedBase) {
      const newSelectedBases = [...selectedBases, base];
      setSelectedBases(newSelectedBases);
      setScore(prevScore => prevScore + 10);
      
      if (newSelectedBases.length === currentTemplate.length) {
        if (currentStep < replicationSteps.length - 1) {
          setCurrentStep(prevStep => prevStep + 1);
          setSelectedBases([]);
          setScore(prevScore => prevScore + 50); // Bonus for completing step
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setGameState('completed');
          setScore(prevScore => prevScore + 100); // Final bonus
        }
      }
    } else {
      setMistakes(prevMistakes => prevMistakes + 1);
      setScore(prevScore => Math.max(0, prevScore - 5));
    }
  }, [gameState, currentStep, selectedBases]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '2rem' }}>
      {gameState === 'menu' && <MenuScreen onStartGame={startGame} />}
      {gameState === 'playing' && (
        <GameScreen 
          currentStep={currentStep}
          selectedBases={selectedBases}
          mistakes={mistakes}
          score={score}
          timeLeft={timeLeft}
          onAddBase={addBase}
          onResetGame={resetGame}
        />
      )}
      {gameState === 'completed' && (
        <CompletedScreen 
          score={score}
          mistakes={mistakes}
          onResetGame={resetGame}
        />
      )}
    </div>
  );
};

export default DNAReplication;