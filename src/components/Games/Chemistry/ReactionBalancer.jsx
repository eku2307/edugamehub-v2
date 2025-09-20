import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Beaker, Trophy, RotateCcw, Check, HelpCircle, Shuffle } from 'lucide-react';

const ReactionBalancer = () => {
  const [score, setScore] = useState(0);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [userCoefficients, setUserCoefficients] = useState({});
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState('easy');

  const reactions = {
    easy: [
      {
        id: 1,
        reactants: ['H₂', 'O₂'],
        products: ['H₂O'],
        correct: { 'H₂': 2, 'O₂': 1, 'H₂O': 2 },
        name: 'Water Formation',
        hint: 'Count hydrogen and oxygen atoms on both sides'
      },
      {
        id: 2,
        reactants: ['Na', 'Cl₂'],
        products: ['NaCl'],
        correct: { 'Na': 2, 'Cl₂': 1, 'NaCl': 2 },
        name: 'Sodium Chloride Formation',
        hint: 'Chlorine is diatomic (Cl₂)'
      },
      {
        id: 3,
        reactants: ['Mg', 'O₂'],
        products: ['MgO'],
        correct: { 'Mg': 2, 'O₂': 1, 'MgO': 2 },
        name: 'Magnesium Oxide Formation',
        hint: 'Magnesium has a +2 charge, oxygen has a -2 charge'
      }
    ],
    medium: [
      {
        id: 4,
        reactants: ['CH₄', 'O₂'],
        products: ['CO₂', 'H₂O'],
        correct: { 'CH₄': 1, 'O₂': 2, 'CO₂': 1, 'H₂O': 2 },
        name: 'Methane Combustion',
        hint: 'Balance carbon first, then hydrogen, then oxygen'
      },
      {
        id: 5,
        reactants: ['Al', 'O₂'],
        products: ['Al₂O₃'],
        correct: { 'Al': 4, 'O₂': 3, 'Al₂O₃': 2 },
        name: 'Aluminum Oxide Formation',
        hint: 'Find the least common multiple of Al and O atoms'
      },
      {
        id: 6,
        reactants: ['Fe', 'O₂'],
        products: ['Fe₂O₃'],
        correct: { 'Fe': 4, 'O₂': 3, 'Fe₂O₃': 2 },
        name: 'Iron Oxide Formation (Rust)',
        hint: 'Iron forms Fe₂O₃ when it rusts'
      }
    ],
    hard: [
      {
        id: 7,
        reactants: ['C₂H₆', 'O₂'],
        products: ['CO₂', 'H₂O'],
        correct: { 'C₂H₆': 2, 'O₂': 7, 'CO₂': 4, 'H₂O': 6 },
        name: 'Ethane Combustion',
        hint: 'Start with carbon, then hydrogen, save oxygen for last'
      },
      {
        id: 8,
        reactants: ['Ca(OH)₂', 'HCl'],
        products: ['CaCl₂', 'H₂O'],
        correct: { 'Ca(OH)₂': 1, 'HCl': 2, 'CaCl₂': 1, 'H₂O': 2 },
        name: 'Acid-Base Neutralization',
        hint: 'Ca(OH)₂ provides 2 OH⁻ ions, each neutralizes one H⁺'
      }
    ]
  };

  useEffect(() => {
    generateNewReaction();
  }, [difficulty]);

  const generateNewReaction = () => {
    const availableReactions = reactions[difficulty];
    const randomReaction = availableReactions[Math.floor(Math.random() * availableReactions.length)];
    setCurrentReaction(randomReaction);
    
    // Initialize coefficients
    const initialCoeffs = {};
    [...randomReaction.reactants, ...randomReaction.products].forEach(compound => {
      initialCoeffs[compound] = 1;
    });
    setUserCoefficients(initialCoeffs);
    setShowHint(false);
    setAttempts(0);
  };

  const updateCoefficient = (compound, value) => {
    const numValue = parseInt(value) || 1;
    if (numValue > 0 && numValue <= 10) {
      setUserCoefficients(prev => ({
        ...prev,
        [compound]: numValue
      }));
    }
  };

  const checkBalance = () => {
    if (!currentReaction) return;

    setAttempts(prev => prev + 1);

    // Check if user coefficients match correct coefficients
    const isCorrect = Object.keys(currentReaction.correct).every(compound => 
      userCoefficients[compound] === currentReaction.correct[compound]
    );

    if (isCorrect) {
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
      const bonusPoints = attempts === 0 ? points : Math.max(1, points - attempts);
      setScore(prev => prev + bonusPoints);
      
      alert(`Correct! +${bonusPoints} points ${attempts === 0 ? '(First try bonus!)' : ''}`);
      generateNewReaction();
    } else {
      if (attempts >= 2) {
        setShowHint(true);
      }
      alert(`Not balanced yet. ${attempts >= 2 ? 'Hint is now available!' : 'Try again!'}`);
    }
  };

  const getAtomCount = (compound, element) => {
    // Simple atom counting for common compounds
    const atomCounts = {
      'H₂': { H: 2 },
      'O₂': { O: 2 },
      'H₂O': { H: 2, O: 1 },
      'Na': { Na: 1 },
      'Cl₂': { Cl: 2 },
      'NaCl': { Na: 1, Cl: 1 },
      'Mg': { Mg: 1 },
      'MgO': { Mg: 1, O: 1 },
      'CH₄': { C: 1, H: 4 },
      'CO₂': { C: 1, O: 2 },
      'Al': { Al: 1 },
      'Al₂O₃': { Al: 2, O: 3 },
      'Fe': { Fe: 1 },
      'Fe₂O₃': { Fe: 2, O: 3 },
      'C₂H₆': { C: 2, H: 6 },
      'Ca(OH)₂': { Ca: 1, O: 2, H: 2 },
      'HCl': { H: 1, Cl: 1 },
      'CaCl₂': { Ca: 1, Cl: 2 }
    };

    return atomCounts[compound]?.[element] || 0;
  };

  const getAllElements = () => {
    if (!currentReaction) return [];
    
    const elements = new Set();
    [...currentReaction.reactants, ...currentReaction.products].forEach(compound => {
      const atomCount = {
        'H₂': ['H'], 'O₂': ['O'], 'H₂O': ['H', 'O'],
        'Na': ['Na'], 'Cl₂': ['Cl'], 'NaCl': ['Na', 'Cl'],
        'Mg': ['Mg'], 'MgO': ['Mg', 'O'],
        'CH₄': ['C', 'H'], 'CO₂': ['C', 'O'],
        'Al': ['Al'], 'Al₂O₃': ['Al', 'O'],
        'Fe': ['Fe'], 'Fe₂O₃': ['Fe', 'O'],
        'C₂H₆': ['C', 'H'],
        'Ca(OH)₂': ['Ca', 'O', 'H'], 'HCl': ['H', 'Cl'], 'CaCl₂': ['Ca', 'Cl']
      }[compound] || [];
      
      atomCount.forEach(element => elements.add(element));
    });
    
    return Array.from(elements);
  };

  const getTotalAtoms = (side, element) => {
    if (!currentReaction) return 0;
    
    const compounds = side === 'reactants' ? currentReaction.reactants : currentReaction.products;
    return compounds.reduce((total, compound) => {
      const coefficient = userCoefficients[compound] || 1;
      const atomsInCompound = getAtomCount(compound, element);
      return total + (coefficient * atomsInCompound);
    }, 0);
  };

  if (!currentReaction) {
    return <div>Loading...</div>;
  }

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
              Chemical Equation Balancer
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Balance chemical equations using the law of conservation of mass
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
              Balancing Chemical Equations
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Law of Conservation of Mass:</strong> Matter cannot be created or destroyed in chemical reactions. 
                The number of atoms of each element must be equal on both sides.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Coefficients:</strong> Numbers placed in front of chemical formulas to balance equations. 
                They multiply the entire formula.
              </p>
              <p>
                <strong>Strategy:</strong> Balance one element at a time, usually starting with the most complex compound or metals.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Balancing Steps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--chemistry-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--chemistry-accent)'
              }}>
                <strong style={{ color: 'var(--chemistry-text)' }}>Step 1:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Count atoms of each element</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--chemistry-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--chemistry-accent)'
              }}>
                <strong style={{ color: 'var(--chemistry-text)' }}>Step 2:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Add coefficients to balance</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--chemistry-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--chemistry-accent)'
              }}>
                <strong style={{ color: 'var(--chemistry-text)' }}>Step 3:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Check all elements are balanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Equation Balancer */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Beaker size={20} />
              {currentReaction.name}
            </h3>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="form-input"
              style={{ minWidth: '100px' }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Chemical Equation */}
          <div style={{
            padding: '2rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              fontSize: '1.5rem',
              fontFamily: 'monospace'
            }}>
              {/* Reactants */}
              {currentReaction.reactants.map((reactant, index) => (
                <div key={reactant} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={userCoefficients[reactant] || 1}
                    onChange={(e) => updateCoefficient(reactant, e.target.value)}
                    style={{
                      width: '50px',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      textAlign: 'center',
                      fontSize: '1rem'
                    }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {reactant}
                  </span>
                  {index < currentReaction.reactants.length - 1 && (
                    <span style={{ color: 'var(--text-secondary)' }}>+</span>
                  )}
                </div>
              ))}

              <span style={{ 
                color: 'var(--text-primary)', 
                fontSize: '2rem', 
                fontWeight: '700',
                margin: '0 1rem'
              }}>
                →
              </span>

              {/* Products */}
              {currentReaction.products.map((product, index) => (
                <div key={product} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={userCoefficients[product] || 1}
                    onChange={(e) => updateCoefficient(product, e.target.value)}
                    style={{
                      width: '50px',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      textAlign: 'center',
                      fontSize: '1rem'
                    }}
                  />
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                    {product}
                  </span>
                  {index < currentReaction.products.length - 1 && (
                    <span style={{ color: 'var(--text-secondary)' }}>+</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Atom Count Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
              Atom Count Check:
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Element</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Reactants</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Products</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Balanced?</th>
                </tr>
              </thead>
              <tbody>
                {getAllElements().map(element => {
                  const reactantCount = getTotalAtoms('reactants', element);
                  const productCount = getTotalAtoms('products', element);
                  const isBalanced = reactantCount === productCount;
                  
                  return (
                    <tr key={element} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: '600' }}>{element}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>{reactantCount}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>{productCount}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                        <span style={{ 
                          color: isBalanced ? 'var(--success-text)' : 'var(--error-text)',
                          fontWeight: '600'
                        }}>
                          {isBalanced ? '✓' : '✗'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn primary" onClick={checkBalance}>
              <Check size={20} />
              Check Balance
            </button>
            
            <button className="btn" onClick={generateNewReaction}>
              <Shuffle size={20} />
              New Reaction
            </button>
            
            <button className="btn" onClick={() => setScore(0)}>
              <RotateCcw size={20} />
              Reset Score
            </button>
          </div>

          {showHint && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--warning-bg)',
              border: '1px solid var(--warning-text)',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem' }}>
                Hint:
              </h4>
              <p style={{ color: 'var(--warning-text)', margin: 0, fontSize: '0.875rem' }}>
                {currentReaction.hint}
              </p>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Game Info
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--chemistry-bg)',
              borderRadius: '8px',
              border: '1px solid var(--chemistry-accent)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--chemistry-text)', marginBottom: '0.5rem' }}>
                Current Difficulty
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--chemistry-text)' }}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--success-bg)',
              borderRadius: '8px',
              border: '1px solid var(--success-text)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--success-text)', marginBottom: '0.5rem' }}>
                Attempts on Current
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success-text)' }}>
                {attempts}
              </div>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--physics-bg)',
            borderRadius: '8px',
            border: '1px solid var(--physics-accent)'
          }}>
            <h4 style={{ color: 'var(--physics-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Scoring:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--physics-text)', lineHeight: 1.4 }}>
              • Easy: 10 points<br/>
              • Medium: 20 points<br/>
              • Hard: 30 points<br/>
              • First try bonus!<br/>
              • Hints after 2 attempts
            </div>
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Tips:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Start with the most complex molecule<br/>
              • Balance metals first, then non-metals<br/>
              • Leave hydrogen and oxygen for last<br/>
              • Use the atom count table to check your work
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionBalancer;