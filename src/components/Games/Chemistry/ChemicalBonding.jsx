import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Atom, Zap } from 'lucide-react';

const ChemicalBondingGame = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Game state
  const [selectedAtom, setSelectedAtom] = useState(null);
  const [bondedMolecules, setBondedMolecules] = useState([]);
  const [availableAtoms, setAvailableAtoms] = useState([
    { id: 'na', symbol: 'Na⁺', x: 100, y: 100, charge: 1, electrons: 10 },
    { id: 'cl', symbol: 'Cl⁻', x: 200, y: 100, charge: -1, electrons: 18 },
    { id: 'h', symbol: 'H', x: 300, y: 100, charge: 0, electrons: 1 },
    { id: 'o', symbol: 'O', x: 400, y: 100, charge: 0, electrons: 8 },
    { id: 'c', symbol: 'C', x: 500, y: 100, charge: 0, electrons: 6 },
    { id: 'n', symbol: 'N', x: 600, y: 100, charge: 0, electrons: 7 }
  ]);
  
  const [bondStrength, setBondStrength] = useState(50);
  const [bondType, setBondType] = useState('ionic');
  const [electronegativity, setElectronegativity] = useState(2.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawMolecularScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw available atoms
      availableAtoms.forEach(atom => {
        drawAtom(ctx, atom);
      });
      
      // Draw bonds between bonded molecules
      bondedMolecules.forEach(molecule => {
        drawMolecule(ctx, molecule);
      });
      
      // Draw selected atom highlight
      if (selectedAtom) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(selectedAtom.x, selectedAtom.y, 35, 0, 2 * Math.PI);
        ctx.stroke();
      }
    };
    
    const drawAtom = (ctx, atom) => {
      // Atom color based on element
      const colors = {
        'Na⁺': '#fbbf24', 'Cl⁻': '#22c55e', 'H': '#f3f4f6',
        'O': '#ef4444', 'C': '#6b7280', 'N': '#3b82f6'
      };
      
      ctx.fillStyle = colors[atom.symbol] || '#8b5cf6';
      ctx.shadowColor = colors[atom.symbol] || '#8b5cf6';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(atom.x, atom.y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw symbol
      ctx.fillStyle = atom.symbol === 'H' ? '#000' : '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(atom.symbol, atom.x, atom.y + 5);
      
      // Draw electron cloud if running
      if (isRunning) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 0; i < atom.electrons / 2; i++) {
          const radius = 40 + i * 10;
          ctx.beginPath();
          ctx.arc(atom.x, atom.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    };
    
    const drawMolecule = (ctx, molecule) => {
      const { atom1, atom2, bondType } = molecule;
      
      // Draw bond line
      ctx.strokeStyle = bondType === 'ionic' ? '#f59e0b' : '#10b981';
      ctx.lineWidth = bondType === 'covalent' ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(atom1.x, atom1.y);
      ctx.lineTo(atom2.x, atom2.y);
      ctx.stroke();
      
      // Draw bond label
      const midX = (atom1.x + atom2.x) / 2;
      const midY = (atom1.y + atom2.y) / 2;
      ctx.fillStyle = '#6b46c1';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(bondType.toUpperCase(), midX, midY - 10);
      
      // Animation for bond energy
      if (isRunning) {
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.5)';
        ctx.lineWidth = 1;
        const time = Date.now() * 0.01;
        const oscillation = Math.sin(time) * 5;
        ctx.beginPath();
        ctx.arc(midX, midY, 15 + oscillation, 0, 2 * Math.PI);
        ctx.stroke();
      }
    };
    
    drawMolecularScene();
  }, [isRunning, availableAtoms, bondedMolecules, selectedAtom]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked atom
    const clickedAtom = availableAtoms.find(atom => {
      const distance = Math.sqrt((x - atom.x) ** 2 + (y - atom.y) ** 2);
      return distance <= 30;
    });
    
    if (clickedAtom) {
      if (!selectedAtom) {
        setSelectedAtom(clickedAtom);
      } else if (selectedAtom.id !== clickedAtom.id) {
        // Create bond
        const newMolecule = createBond(selectedAtom, clickedAtom);
        if (newMolecule) {
          setBondedMolecules([...bondedMolecules, newMolecule]);
          setScore(score + 25);
        }
        setSelectedAtom(null);
      }
    } else {
      setSelectedAtom(null);
    }
  };

  const createBond = (atom1, atom2) => {
    // Determine bond type based on electronegativity difference
    const electronegativityDiff = Math.abs(getElectronegativity(atom1) - getElectronegativity(atom2));
    const bondType = electronegativityDiff > 1.7 ? 'ionic' : 'covalent';
    
    return {
      atom1,
      atom2,
      bondType,
      strength: bondStrength,
      id: `${atom1.id}-${atom2.id}-${Date.now()}`
    };
  };

  const getElectronegativity = (atom) => {
    const values = {
      'Na⁺': 0.9, 'Cl⁻': 3.0, 'H': 2.1,
      'O': 3.5, 'C': 2.5, 'N': 3.0
    };
    return values[atom.symbol] || 2.0;
  };

  const startSimulation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setScore(score + 10);
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setBondedMolecules([]);
    setSelectedAtom(null);
    setScore(0);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/chemistry" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Chemical Bonding Lab
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore ionic and covalent bonds by combining different atoms
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--chemistry-bg)', 
          border: '1px solid var(--chemistry-accent)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Atom size={16} style={{ color: 'var(--chemistry-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--chemistry-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--chemistry-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Game Canvas */}
        <div className="card">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
            onClick={handleCanvasClick}
            style={{ 
              width: '100%', 
              height: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              cursor: 'pointer'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={startSimulation}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop' : 'Start'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetSimulation}
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}>
            Bonding Parameters
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Bond Strength: {bondStrength}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={bondStrength}
              onChange={(e) => setBondStrength(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Electronegativity: {electronegativity}
            </label>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={electronegativity}
              onChange={(e) => setElectronegativity(parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* Bond Information */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            fontSize: '0.875rem'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Bond Types:
            </h4>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div><span style={{color: '#f59e0b'}}>●</span> Ionic: ΔEN {'>'} 1.7</div>
              <div><span style={{color: '#10b981'}}>●</span> Covalent: ΔEN {'<'} 1.7</div>
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--chemistry-bg)',
            borderRadius: '8px',
            border: '1px solid var(--chemistry-accent)'
          }}>
            <h4 style={{ color: 'var(--chemistry-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              How to Play:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--chemistry-text)', lineHeight: 1.4 }}>
              1. Click an atom to select it<br/>
              2. Click another atom to form a bond<br/>
              3. Watch the bond type determination<br/>
              4. Start simulation to see electron movement
            </div>
          </div>

          {/* Molecules formed */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Molecules Formed: {bondedMolecules.length}
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {bondedMolecules.map(molecule => (
                <div key={molecule.id}>
                  {molecule.atom1.symbol}-{molecule.atom2.symbol} ({molecule.bondType})
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChemicalBondingGame;