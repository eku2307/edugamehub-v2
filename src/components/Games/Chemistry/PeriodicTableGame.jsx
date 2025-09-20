import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TestTube, Trophy, RotateCcw, Check, Shuffle } from 'lucide-react';

const PeriodicTableGame = () => {
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState('identify');
  const [selectedElement, setSelectedElement] = useState(null);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHints, setShowHints] = useState(false);

  const elements = [
    { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, group: 1, period: 1, type: 'nonmetal', mass: 1.008 },
    { symbol: 'He', name: 'Helium', atomicNumber: 2, group: 18, period: 1, type: 'noble-gas', mass: 4.003 },
    { symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 1, period: 2, type: 'alkali-metal', mass: 6.94 },
    { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, group: 2, period: 2, type: 'alkaline-earth', mass: 9.012 },
    { symbol: 'B', name: 'Boron', atomicNumber: 5, group: 13, period: 2, type: 'metalloid', mass: 10.81 },
    { symbol: 'C', name: 'Carbon', atomicNumber: 6, group: 14, period: 2, type: 'nonmetal', mass: 12.01 },
    { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, group: 15, period: 2, type: 'nonmetal', mass: 14.01 },
    { symbol: 'O', name: 'Oxygen', atomicNumber: 8, group: 16, period: 2, type: 'nonmetal', mass: 16.00 },
    { symbol: 'F', name: 'Fluorine', atomicNumber: 9, group: 17, period: 2, type: 'halogen', mass: 19.00 },
    { symbol: 'Ne', name: 'Neon', atomicNumber: 10, group: 18, period: 2, type: 'noble-gas', mass: 20.18 },
    { symbol: 'Na', name: 'Sodium', atomicNumber: 11, group: 1, period: 3, type: 'alkali-metal', mass: 22.99 },
    { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, group: 2, period: 3, type: 'alkaline-earth', mass: 24.31 },
    { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, group: 13, period: 3, type: 'post-transition', mass: 26.98 },
    { symbol: 'Si', name: 'Silicon', atomicNumber: 14, group: 14, period: 3, type: 'metalloid', mass: 28.09 },
    { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, group: 15, period: 3, type: 'nonmetal', mass: 30.97 },
    { symbol: 'S', name: 'Sulfur', atomicNumber: 16, group: 16, period: 3, type: 'nonmetal', mass: 32.07 },
    { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, group: 17, period: 3, type: 'halogen', mass: 35.45 },
    { symbol: 'Ar', name: 'Argon', atomicNumber: 18, group: 18, period: 3, type: 'noble-gas', mass: 39.95 },
    { symbol: 'K', name: 'Potassium', atomicNumber: 19, group: 1, period: 4, type: 'alkali-metal', mass: 39.10 },
    { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, group: 2, period: 4, type: 'alkaline-earth', mass: 40.08 },
    { symbol: 'Fe', name: 'Iron', atomicNumber: 26, group: 8, period: 4, type: 'transition-metal', mass: 55.85 },
    { symbol: 'Cu', name: 'Copper', atomicNumber: 29, group: 11, period: 4, type: 'transition-metal', mass: 63.55 },
    { symbol: 'Zn', name: 'Zinc', atomicNumber: 30, group: 12, period: 4, type: 'transition-metal', mass: 65.38 },
    { symbol: 'Br', name: 'Bromine', atomicNumber: 35, group: 17, period: 4, type: 'halogen', mass: 79.90 },
    { symbol: 'Kr', name: 'Krypton', atomicNumber: 36, group: 18, period: 4, type: 'noble-gas', mass: 83.80 },
    { symbol: 'Ag', name: 'Silver', atomicNumber: 47, group: 11, period: 5, type: 'transition-metal', mass: 107.87 },
    { symbol: 'I', name: 'Iodine', atomicNumber: 53, group: 17, period: 5, type: 'halogen', mass: 126.90 },
    { symbol: 'Xe', name: 'Xenon', atomicNumber: 54, group: 18, period: 5, type: 'noble-gas', mass: 131.29 },
    { symbol: 'Au', name: 'Gold', atomicNumber: 79, group: 11, period: 6, type: 'transition-metal', mass: 196.97 },
    { symbol: 'Hg', name: 'Mercury', atomicNumber: 80, group: 12, period: 6, type: 'transition-metal', mass: 200.59 }
  ];

  const elementTypes = {
    'alkali-metal': { color: '#ff6b6b', name: 'Alkali Metal' },
    'alkaline-earth': { color: '#feca57', name: 'Alkaline Earth Metal' },
    'transition-metal': { color: '#48dbfb', name: 'Transition Metal' },
    'post-transition': { color: '#0abde3', name: 'Post-transition Metal' },
    'metalloid': { color: '#ff9ff3', name: 'Metalloid' },
    'nonmetal': { color: '#54a0ff', name: 'Nonmetal' },
    'halogen': { color: '#5f27cd', name: 'Halogen' },
    'noble-gas': { color: '#00d2d3', name: 'Noble Gas' }
  };

  useEffect(() => {
    generateChallenge();
  }, [gameMode]);

  const generateChallenge = () => {
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    
    const challengeTypes = [
      { type: 'symbol', question: `What is the chemical symbol for ${randomElement.name}?`, answer: randomElement.symbol },
      { type: 'name', question: `What element has the symbol "${randomElement.symbol}"?`, answer: randomElement.name },
      { type: 'atomic', question: `What is the atomic number of ${randomElement.name}?`, answer: randomElement.atomicNumber.toString() },
      { type: 'group', question: `What group is ${randomElement.name} in?`, answer: randomElement.group.toString() },
      { type: 'period', question: `What period is ${randomElement.name} in?`, answer: randomElement.period.toString() },
      { type: 'type', question: `What type of element is ${randomElement.name}?`, answer: elementTypes[randomElement.type]?.name || randomElement.type }
    ];

    const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    setCurrentChallenge({ ...randomChallenge, element: randomElement });
    setUserAnswer('');
  };

  const checkAnswer = () => {
    if (!currentChallenge) return;

    const correct = userAnswer.toLowerCase().trim() === currentChallenge.answer.toLowerCase().trim();
    
    if (correct) {
      const points = 10;
      setScore(prev => prev + points);
      alert(`Correct! +${points} points`);
      generateChallenge();
    } else {
      alert(`Incorrect. The answer is: ${currentChallenge.answer}`);
    }
  };

  const getElementPosition = (element) => {
    // Simplified positioning for a compact periodic table
    let row = element.period;
    let col = element.group;
    
    // Special positioning for better layout
    if (element.symbol === 'H') col = 1;
    if (element.symbol === 'He') col = 18;
    
    return { row, col };
  };

  const renderPeriodicTable = () => {
    const maxPeriod = Math.max(...elements.map(e => e.period));
    const maxGroup = Math.max(...elements.map(e => e.group));
    
    return (
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: `repeat(${maxGroup}, 40px)`,
        gridTemplateRows: `repeat(${maxPeriod}, 40px)`,
        gap: '2px',
        justifyContent: 'center',
        margin: '2rem 0'
      }}>
        {elements.map(element => {
          const position = getElementPosition(element);
          const isSelected = selectedElement?.symbol === element.symbol;
          const isChallenge = currentChallenge?.element?.symbol === element.symbol;
          
          return (
            <div
              key={element.symbol}
              onClick={() => setSelectedElement(element)}
              style={{
                gridColumn: position.col,
                gridRow: position.row,
                backgroundColor: isChallenge ? '#fbbf24' : isSelected ? elementTypes[element.type]?.color : 'var(--bg-card)',
                border: `2px solid ${isSelected ? '#374151' : 'var(--border-light)'}`,
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '600',
                color: isSelected || isChallenge ? '#ffffff' : 'var(--text-primary)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '8px', lineHeight: 1 }}>{element.atomicNumber}</div>
              <div style={{ fontSize: '12px', fontWeight: '700' }}>{element.symbol}</div>
              <div style={{ fontSize: '6px', lineHeight: 1, textAlign: 'center' }}>
                {element.name.length > 8 ? element.name.substring(0, 6) + '.' : element.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Theory Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/chemistry" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Periodic Table Explorer
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Learn element properties and periodic trends through interactive challenges
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Periodic Table Organization
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Periods:</strong> Horizontal rows indicating the number of electron shells. 
                Elements in the same period have the same number of electron shells.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Groups:</strong> Vertical columns indicating similar chemical properties. 
                Elements in the same group have the same number of valence electrons.
              </p>
              <p>
                <strong>Atomic Number:</strong> Number of protons in the nucleus, which determines the element's identity.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Element Types
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              {Object.entries(elementTypes).map(([key, type]) => (
                <div key={key} style={{
                  padding: '0.5rem',
                  backgroundColor: type.color,
                  borderRadius: '6px',
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  {type.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Periodic Table */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TestTube size={20} />
            Interactive Periodic Table
          </h3>
          
          {renderPeriodicTable()}
          
          {/* Legend */}
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Color Legend:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.entries(elementTypes).slice(0, 4).map(([key, type]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: type.color,
                    borderRadius: '2px'
                  }} />
                  <span style={{ fontSize: '0.75rem' }}>{type.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Panel */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
              Element Challenge
            </h3>
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="form-input"
              style={{ minWidth: '120px' }}
            >
              <option value="identify">Identify Elements</option>
              <option value="properties">Element Properties</option>
            </select>
          </div>

          {/* Current Challenge */}
          {currentChallenge && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--chemistry-bg)',
                borderRadius: '12px',
                border: '1px solid var(--chemistry-accent)',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1rem' }}>
                  {currentChallenge.question}
                </h4>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn primary" onClick={checkAnswer}>
                    <Check size={20} />
                  </button>
                </div>

                {showHints && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--chemistry-text)', opacity: 0.8 }}>
                    Hint: The highlighted element on the table is part of this question
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={generateChallenge}>
                  <Shuffle size={20} />
                  New Challenge
                </button>
                <button 
                  className={`btn ${showHints ? 'primary' : ''}`}
                  onClick={() => setShowHints(!showHints)}
                >
                  {showHints ? 'Hide' : 'Show'} Hints
                </button>
              </div>
            </div>
          )}

          {/* Selected Element Info */}
          {selectedElement && (
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Element Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
                <div><strong>Name:</strong> {selectedElement.name}</div>
                <div><strong>Symbol:</strong> {selectedElement.symbol}</div>
                <div><strong>Atomic #:</strong> {selectedElement.atomicNumber}</div>
                <div><strong>Mass:</strong> {selectedElement.mass}</div>
                <div><strong>Group:</strong> {selectedElement.group}</div>
                <div><strong>Period:</strong> {selectedElement.period}</div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Type:</strong> {elementTypes[selectedElement.type]?.name}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              How to Play:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Click elements to view their properties<br/>
              • Answer questions about highlighted elements<br/>
              • Learn periodic trends and patterns<br/>
              • Use the color coding to identify element types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicTableGame;