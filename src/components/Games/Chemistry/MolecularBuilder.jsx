import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Atom, Trophy, RotateCcw, Check } from 'lucide-react';

const MolecularBuilder = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [selectedAtom, setSelectedAtom] = useState('C');
  const [atoms, setAtoms] = useState([]);
  const [bonds, setBonds] = useState([]);
  const [targetMolecule, setTargetMolecule] = useState('CH4');
  const [draggedAtom, setDraggedAtom] = useState(null);

  const atomTypes = {
    'C': { color: '#374151', radius: 15, bonds: 4, name: 'Carbon' },
    'H': { color: '#f3f4f6', radius: 8, bonds: 1, name: 'Hydrogen' },
    'O': { color: '#ef4444', radius: 12, bonds: 2, name: 'Oxygen' },
    'N': { color: '#3b82f6', radius: 11, bonds: 3, name: 'Nitrogen' },
    'S': { color: '#f59e0b', radius: 14, bonds: 2, name: 'Sulfur' },
    'P': { color: '#8b5cf6', radius: 13, bonds: 3, name: 'Phosphorus' }
  };

  const targetMolecules = {
    'CH4': { name: 'Methane', points: 50, formula: 'CH₄' },
    'H2O': { name: 'Water', points: 30, formula: 'H₂O' },
    'NH3': { name: 'Ammonia', points: 40, formula: 'NH₃' },
    'CO2': { name: 'Carbon Dioxide', points: 60, formula: 'CO₂' },
    'C2H6': { name: 'Ethane', points: 80, formula: 'C₂H₆' },
    'H2SO4': { name: 'Sulfuric Acid', points: 100, formula: 'H₂SO₄' }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 600; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 400);
        ctx.stroke();
      }
      for (let y = 0; y < 400; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(600, y);
        ctx.stroke();
      }
      
      // Draw bonds
      bonds.forEach(bond => {
        const atom1 = atoms[bond.atom1];
        const atom2 = atoms[bond.atom2];
        if (atom1 && atom2) {
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = bond.order * 2;
          ctx.beginPath();
          ctx.moveTo(atom1.x, atom1.y);
          ctx.lineTo(atom2.x, atom2.y);
          ctx.stroke();
        }
      });
      
      // Draw atoms
      atoms.forEach((atom, index) => {
        const atomType = atomTypes[atom.type];
        
        // Atom circle
        ctx.fillStyle = atomType.color;
        ctx.strokeStyle = atom.selected ? '#3b82f6' : '#374151';
        ctx.lineWidth = atom.selected ? 3 : 1;
        ctx.beginPath();
        ctx.arc(atom.x, atom.y, atomType.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Atom label
        ctx.fillStyle = atom.type === 'H' ? '#000000' : '#ffffff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(atom.type, atom.x, atom.y + 4);
        
        // Bond count indicator
        if (atom.bondCount !== undefined) {
          ctx.fillStyle = atom.bondCount === atomType.bonds ? '#10b981' : '#ef4444';
          ctx.font = '10px Inter';
          ctx.fillText(atom.bondCount, atom.x + atomType.radius + 5, atom.y - atomType.radius + 5);
        }
      });
      
      // Draw target molecule info
      drawTargetInfo(ctx);
    };

    draw();
  }, [atoms, bonds, selectedAtom, targetMolecule]);

  const drawTargetInfo = (ctx) => {
    const target = targetMolecules[targetMolecule];
    ctx.fillStyle = 'var(--chemistry-text)';
    ctx.font = '16px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Target: ${target.name} (${target.formula})`, 10, 25);
    ctx.fillText(`Points: ${target.points}`, 10, 45);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicking on existing atom
    const clickedAtomIndex = atoms.findIndex(atom => {
      const atomType = atomTypes[atom.type];
      const distance = Math.sqrt((x - atom.x) ** 2 + (y - atom.y) ** 2);
      return distance <= atomType.radius;
    });
    
    if (clickedAtomIndex !== -1) {
      // Select/deselect atom for bonding
      setAtoms(prev => prev.map((atom, index) => ({
        ...atom,
        selected: index === clickedAtomIndex ? !atom.selected : false
      })));
    } else if (selectedAtom) {
      // Add new atom
      const newAtom = {
        x, y,
        type: selectedAtom,
        bondCount: 0,
        selected: false
      };
      setAtoms(prev => [...prev, newAtom]);
    }
  };

  const createBond = () => {
    const selectedAtoms = atoms.map((atom, index) => ({ ...atom, index }))
                               .filter(atom => atom.selected);
    
    if (selectedAtoms.length === 2) {
      const atom1 = selectedAtoms[0];
      const atom2 = selectedAtoms[1];
      const atom1Type = atomTypes[atom1.type];
      const atom2Type = atomTypes[atom2.type];
      
      // Check if atoms can form more bonds
      if (atom1.bondCount < atom1Type.bonds && atom2.bondCount < atom2Type.bonds) {
        // Check if bond already exists
        const bondExists = bonds.some(bond => 
          (bond.atom1 === atom1.index && bond.atom2 === atom2.index) ||
          (bond.atom1 === atom2.index && bond.atom2 === atom1.index)
        );
        
        if (!bondExists) {
          setBonds(prev => [...prev, { 
            atom1: atom1.index, 
            atom2: atom2.index, 
            order: 1 
          }]);
          
          // Update bond counts
          setAtoms(prev => prev.map((atom, index) => ({
            ...atom,
            bondCount: index === atom1.index || index === atom2.index ? 
                      atom.bondCount + 1 : atom.bondCount,
            selected: false
          })));
          
          setScore(prev => prev + 10);
        }
      }
    }
  };

  const checkMolecule = () => {
    const moleculeComposition = {};
    atoms.forEach(atom => {
      moleculeComposition[atom.type] = (moleculeComposition[atom.type] || 0) + 1;
    });
    
    const target = getTargetComposition(targetMolecule);
    const isCorrect = Object.keys(target).every(element => 
      moleculeComposition[element] === target[element]
    ) && Object.keys(moleculeComposition).length === Object.keys(target).length;
    
    // Check if all atoms have correct number of bonds
    const allBondsCorrect = atoms.every(atom => {
      const atomType = atomTypes[atom.type];
      return atom.bondCount === atomType.bonds;
    });
    
    if (isCorrect && allBondsCorrect) {
      const points = targetMolecules[targetMolecule].points;
      setScore(prev => prev + points);
      alert(`Correct! You built ${targetMolecules[targetMolecule].name}! +${points} points`);
      resetMolecule();
      // Set next target
      const molecules = Object.keys(targetMolecules);
      const nextIndex = (molecules.indexOf(targetMolecule) + 1) % molecules.length;
      setTargetMolecule(molecules[nextIndex]);
    } else {
      alert('Not quite right. Check your atom composition and bond counts!');
    }
  };

  const getTargetComposition = (molecule) => {
    const compositions = {
      'CH4': { 'C': 1, 'H': 4 },
      'H2O': { 'H': 2, 'O': 1 },
      'NH3': { 'N': 1, 'H': 3 },
      'CO2': { 'C': 1, 'O': 2 },
      'C2H6': { 'C': 2, 'H': 6 },
      'H2SO4': { 'H': 2, 'S': 1, 'O': 4 }
    };
    return compositions[molecule] || {};
  };

  const resetMolecule = () => {
    setAtoms([]);
    setBonds([]);
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
              Molecular Builder
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Build 3D molecular structures and understand chemical bonding
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
              Chemical Bonding Theory
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Covalent Bonds:</strong> Atoms share electrons to achieve stable electron configurations. Each atom contributes electrons to form electron pairs.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Valence:</strong> The number of bonds an atom can form. Carbon forms 4 bonds, oxygen 2, hydrogen 1, nitrogen 3.
              </p>
              <p>
                <strong>Molecular Geometry:</strong> The 3D arrangement of atoms in a molecule, determined by electron pair repulsion (VSEPR theory).
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--chemistry-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Atom Properties
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
              {Object.entries(atomTypes).map(([symbol, props]) => (
                <div key={symbol} style={{
                  padding: '0.5rem',
                  backgroundColor: 'var(--chemistry-bg)',
                  borderRadius: '6px',
                  border: '1px solid var(--chemistry-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: props.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: symbol === 'H' ? '#000' : '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {symbol}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--chemistry-text)' }}>
                      {props.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--chemistry-text)', opacity: 0.8 }}>
                      {props.bonds} bonds
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '600px 1fr', gap: '2rem' }}>
        {/* Molecular Canvas */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Atom size={20} />
            Molecule Builder
          </h3>
          
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onClick={handleCanvasClick}
            className="game-canvas"
            style={{ 
              cursor: 'crosshair',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="btn primary" onClick={createBond}>
              Create Bond
            </button>
            
            <button className="btn success" onClick={checkMolecule}>
              <Check size={20} />
              Check Molecule
            </button>
            
            <button className="btn" onClick={resetMolecule}>
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Atom Palette
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
            {Object.entries(atomTypes).map(([symbol, props]) => (
              <button
                key={symbol}
                className={`btn ${selectedAtom === symbol ? 'primary' : ''}`}
                onClick={() => setSelectedAtom(symbol)}
                style={{
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: props.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: symbol === 'H' ? '#000' : '#fff',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {symbol}
                </div>
                <span style={{ fontSize: '0.875rem' }}>{props.name}</span>
              </button>
            ))}
          </div>

          {/* Target Molecules */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
              Target Molecules
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(targetMolecules).map(([molecule, info]) => (
                <button
                  key={molecule}
                  className={`btn ${targetMolecule === molecule ? 'primary' : ''}`}
                  onClick={() => setTargetMolecule(molecule)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {info.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {info.formula}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                    {info.points} pts
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              How to Build:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              1. Select an atom type from the palette<br/>
              2. Click on canvas to place atoms<br/>
              3. Click two atoms to select them<br/>
              4. Click "Create Bond" to connect them<br/>
              5. Check if your molecule matches the target!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MolecularBuilder;