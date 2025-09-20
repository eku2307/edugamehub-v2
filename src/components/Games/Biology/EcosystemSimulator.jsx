import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Trophy, Timer, Trees, Fish, Rabbit, Wheat } from 'lucide-react';

// Moved static data outside component to prevent recreation on every render
const ecosystemActions = [
  {
    id: 'add_plants',
    name: 'Add Plants',
    icon: Wheat,
    effect: { producers: +20 },
    cost: 10,
    description: 'Increase producer population'
  },
  {
    id: 'add_herbivores',
    name: 'Add Herbivores',
    icon: Rabbit,
    effect: { primaryConsumers: +15 },
    cost: 15,
    description: 'Increase primary consumer population'
  },
  {
    id: 'add_carnivores',
    name: 'Add Carnivores',
    icon: Fish,
    effect: { secondaryConsumers: +10 },
    cost: 20,
    description: 'Increase secondary consumer population'
  },
  {
    id: 'forest_protection',
    name: 'Forest Protection',
    icon: Trees,
    effect: { producers: +30, decomposers: +10 },
    cost: 25,
    description: 'Protect habitat and boost decomposers'
  }
];

const randomEvents = [
  {
    name: "Drought",
    effect: { producers: -30, primaryConsumers: -20 },
    description: "A severe drought affects plant life and herbivores"
  },
  {
    name: "Disease Outbreak",
    effect: { primaryConsumers: -40 },
    description: "Disease spreads among primary consumers"
  },
  {
    name: "Good Weather",
    effect: { producers: +25, primaryConsumers: +15 },
    description: "Favorable conditions boost ecosystem growth"
  },
  {
    name: "Predator Migration",
    effect: { secondaryConsumers: +20, primaryConsumers: -15 },
    description: "New predators arrive in the ecosystem"
  }
];

const MenuScreen = ({ onStartGame }) => (
  <div className="fade-in">
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
      <Link to="/biology" style={{ color: 'var(--biology-text)', textDecoration: 'none' }}>
        <ArrowLeft size={24} />
      </Link>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)', margin: 0 }}>
        Ecosystem Simulator
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
          <Trees size={40} style={{ color: 'var(--biology-text)' }} />
        </div>
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)', marginBottom: '1rem' }}>
          Balance the Ecosystem
        </h2>
        
        <p style={{ fontSize: '1rem', color: 'var(--biology-text)', opacity: 0.8, marginBottom: '2rem', lineHeight: 1.6 }}>
          Manage a complex ecosystem by controlling populations of producers, consumers, and decomposers. 
          Make strategic decisions to maintain ecological balance while dealing with random environmental events.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>4</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Trophic Levels</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>180s</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Game Duration</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)' }}>∞</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Random Events</div>
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
          Start Simulation
        </button>
      </div>
    </div>
  </div>
);

const GameScreen = ({ 
  ecosystem, 
  events, 
  round, 
  score, 
  timeLeft, 
  onApplyAction 
}) => {
  const balance = calculateEcosystemBalance(ecosystem);
  
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
            Ecosystem Simulator - Round {round}
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

      {/* Ecosystem Status */}
      <div className="card" style={{ background: 'var(--biology-bg)', border: '1px solid var(--biology-accent)', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--biology-text)', margin: 0 }}>Ecosystem Status</h3>
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              backgroundColor: balance > 0.8 ? 'var(--success-text)' : balance > 0.5 ? 'var(--warning-text)' : '#FF6B6B',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Balance: {Math.round(balance * 100)}%
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <Wheat size={32} style={{ color: 'var(--success-text)', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {ecosystem.producers}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Producers</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Rabbit size={32} style={{ color: 'var(--warning-text)', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {ecosystem.primaryConsumers}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Primary Consumers</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Fish size={32} style={{ color: '#FF6B6B', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {ecosystem.secondaryConsumers}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Secondary Consumers</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <Trees size={32} style={{ color: 'var(--biology-accent)', margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {ecosystem.decomposers}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>Decomposers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      {events.length > 0 && (
        <div className="card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Recent Events</h4>
            {events.slice(-2).map((event, idx) => (
              <div key={idx} style={{ 
                padding: '0.75rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                borderLeft: '4px solid var(--warning-text)'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {event.name}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {event.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Selection */}
      <div className="card" style={{ background: 'var(--bg-primary)', border: '1px solid var(--biology-accent)' }}>
        <div style={{ padding: '2rem' }}>
          <h4 style={{ color: 'var(--biology-text)', marginBottom: '1.5rem' }}>Management Actions</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {ecosystemActions.map(action => (
              <div
                key={action.id}
                onClick={() => score >= action.cost && onApplyAction(action)}
                style={{
                  padding: '1.5rem',
                  backgroundColor: score >= action.cost ? 'var(--biology-bg)' : 'var(--bg-secondary)',
                  border: `1px solid ${score >= action.cost ? 'var(--biology-accent)' : 'var(--border-color)'}`,
                  borderRadius: '12px',
                  cursor: score >= action.cost ? 'pointer' : 'not-allowed',
                  opacity: score >= action.cost ? 1 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <action.icon size={24} style={{ color: 'var(--biology-text)' }} />
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--biology-text)' }}>
                      {action.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>
                      Cost: {action.cost} points
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', opacity: 0.8 }}>
                  {action.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompletedScreen = ({ ecosystem, events, round, score, onResetGame }) => {
  const finalBalance = calculateEcosystemBalance(ecosystem);
  const percentage = Math.round(finalBalance * 100);
  
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/biology" style={{ color: 'var(--biology-text)', textDecoration: 'none' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--biology-text)', margin: 0 }}>
          Simulation Complete!
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
            Final Score: {score}
          </h2>
          
          <div style={{ fontSize: '1.25rem', color: 'var(--biology-text)', marginBottom: '2rem' }}>
            Ecosystem Balance: {percentage}%
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success-text)' }}>
                {round - 1}
              </div>
              <div style={{ color: 'var(--biology-text)', opacity: 0.8 }}>Rounds Survived</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {events.length}
              </div>
              <div style={{ color: 'var(--biology-text)', opacity: 0.8 }}>Events Handled</div>
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

// Helper function to calculate ecosystem balance
const calculateEcosystemBalance = (ecosystem) => {
  const { producers, primaryConsumers, secondaryConsumers, decomposers } = ecosystem;
  const total = producers + primaryConsumers + secondaryConsumers + decomposers;
  
  const idealRatios = {
    producers: 0.4,
    primaryConsumers: 0.3,
    secondaryConsumers: 0.2,
    decomposers: 0.1
  };
  
  let balance = 0;
  Object.keys(idealRatios).forEach(key => {
    const actualRatio = ecosystem[key] / total;
    const difference = Math.abs(actualRatio - idealRatios[key]);
    balance += (1 - difference) * 0.25;
  });
  
  return Math.max(0, balance);
};

const EcosystemSimulator = () => {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [ecosystem, setEcosystem] = useState({
    producers: 100,
    primaryConsumers: 50,
    secondaryConsumers: 25,
    decomposers: 30
  });
  const [events, setEvents] = useState([]);
  const [round, setRound] = useState(1);

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
    setScore(1000);
    setTimeLeft(180);
    setEcosystem({
      producers: 100,
      primaryConsumers: 50,
      secondaryConsumers: 25,
      decomposers: 30
    });
    setEvents([]);
    setRound(1);
    
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
        
        // Simulate ecosystem every 30 seconds
        if ((180 - prevTime + 1) % 30 === 0) {
          simulateEcosystem();
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
    setTimeLeft(180);
    setEcosystem({
      producers: 100,
      primaryConsumers: 50,
      secondaryConsumers: 25,
      decomposers: 30
    });
    setEvents([]);
    setRound(1);
  }, []);

  const simulateEcosystem = useCallback(() => {
    setEcosystem(prev => {
      let newEcosystem = { ...prev };
      
      // Natural population dynamics
      if (newEcosystem.producers < newEcosystem.primaryConsumers * 1.5) {
        newEcosystem.primaryConsumers = Math.max(10, newEcosystem.primaryConsumers - 10);
      }
      if (newEcosystem.primaryConsumers < newEcosystem.secondaryConsumers * 1.5) {
        newEcosystem.secondaryConsumers = Math.max(5, newEcosystem.secondaryConsumers - 5);
      }
      
      // Random events
      if (Math.random() < 0.3) {
        const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
        
        Object.keys(randomEvent.effect).forEach(key => {
          newEcosystem[key] = Math.max(5, newEcosystem[key] + randomEvent.effect[key]);
        });
        
        setEvents(prev => [...prev.slice(-2), randomEvent]);
      }
      
      return newEcosystem;
    });
    
    setRound(prev => prev + 1);
    
    // Calculate balance score
    const balance = calculateEcosystemBalance(ecosystem);
    if (balance > 0.8) {
      setScore(prev => prev + 50);
    } else if (balance < 0.4) {
      setScore(prev => Math.max(0, prev - 25));
    }
  }, [ecosystem]);

  const applyAction = useCallback((action) => {
    if (score >= action.cost) {
      setScore(prevScore => prevScore - action.cost);
      setEcosystem(prev => {
        const newEcosystem = { ...prev };
        Object.keys(action.effect).forEach(key => {
          newEcosystem[key] = Math.max(0, newEcosystem[key] + action.effect[key]);
        });
        return newEcosystem;
      });
    }
  }, [score]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '2rem' }}>
      {gameState === 'menu' && <MenuScreen onStartGame={startGame} />}
      {gameState === 'playing' && (
        <GameScreen 
          ecosystem={ecosystem}
          events={events}
          round={round}
          score={score}
          timeLeft={timeLeft}
          onApplyAction={applyAction}
        />
      )}
      {gameState === 'completed' && (
        <CompletedScreen 
          ecosystem={ecosystem}
          events={events}
          round={round}
          score={score}
          onResetGame={resetGame}
        />
      )}
    </div>
  );
};

export default EcosystemSimulator;