import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Microscope, Trophy, RotateCcw, Check, HelpCircle } from 'lucide-react';

const CellStructure = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [selectedOrganelle, setSelectedOrganelle] = useState(null);
  const [gameMode, setGameMode] = useState('identify');
  const [cellType, setCellType] = useState('animal');
  const [showLabels, setShowLabels] = useState(false);
  const [organellePositions, setOrganellePositions] = useState({});

  const organelles = {
    nucleus: {
      name: 'Nucleus',
      function: 'Controls cell activities and contains DNA',
      color: '#8b5cf6',
      size: 60,
      position: { x: 300, y: 200 },
      present: { animal: true, plant: true }
    },
    mitochondria: {
      name: 'Mitochondria',
      function: 'Produces energy (ATP) for the cell',
      color: '#ef4444',
      size: 30,
      position: { x: 180, y: 150 },
      present: { animal: true, plant: true }
    },
    ribosome: {
      name: 'Ribosomes',
      function: 'Synthesizes proteins',
      color: '#f59e0b',
      size: 15,
      position: { x: 250, y: 300 },
      present: { animal: true, plant: true }
    },
    vacuole: {
      name: 'Vacuole',
      function: 'Stores water and maintains turgor pressure',
      color: '#06b6d4',
      size: cellType === 'plant' ? 80 : 25,
      position: { x: cellType === 'plant' ? 450 : 400, y: 180 },
      present: { animal: true, plant: true }
    },
    chloroplast: {
      name: 'Chloroplast',
      function: 'Conducts photosynthesis',
      color: '#10b981',
      size: 40,
      position: { x: 380, y: 280 },
      present: { animal: false, plant: true }
    },
    cellWall: {
      name: 'Cell Wall',
      function: 'Provides structural support and protection',
      color: '#92400e',
      size: 0, // Special rendering
      position: { x: 0, y: 0 },
      present: { animal: false, plant: true }
    },
    er: {
      name: 'Endoplasmic Reticulum',
      function: 'Transports materials throughout the cell',
      color: '#7c3aed',
      size: 25,
      position: { x: 200, y: 250 },
      present: { animal: true, plant: true }
    },
    golgi: {
      name: 'Golgi Apparatus',
      function: 'Processes and packages proteins',
      color: '#ec4899',
      size: 35,
      position: { x: 350, y: 150 },
      present: { animal: true, plant: true }
    }
  };

  useEffect(() => {
    drawCell();
  }, [cellType, showLabels, selectedOrganelle]);

  const drawCell = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cell membrane
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (cellType === 'plant') {
      // Square cell wall
      ctx.strokeStyle = organelles.cellWall.color;
      ctx.lineWidth = 8;
      ctx.strokeRect(50, 50, 500, 350);
      
      // Cell membrane inside
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, 480, 330);
    } else {
      // Round animal cell
      ctx.ellipse(300, 225, 250, 175, 0, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw organelles
    Object.entries(organelles).forEach(([key, organelle]) => {
      if (!organelle.present[cellType] || key === 'cellWall') return;

      const pos = organelle.position;
      ctx.fillStyle = selectedOrganelle === key ? '#fbbf24' : organelle.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;

      if (key === 'nucleus') {
        // Draw nucleus with nucleolus
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, organelle.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Nucleolus
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
        ctx.fill();
      } else if (key === 'mitochondria') {
        // Draw bean-shaped mitochondria
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, organelle.size, organelle.size * 0.6, 0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Internal cristae
        ctx.strokeStyle = '#7f1d1d';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(pos.x - 15 + i * 8, pos.y - 10);
          ctx.lineTo(pos.x - 15 + i * 8, pos.y + 10);
          ctx.stroke();
        }
      } else if (key === 'chloroplast') {
        // Draw oval chloroplast
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, organelle.size, organelle.size * 0.7, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Thylakoids
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(pos.x - 10 + i * 7, pos.y, 3, 0, 2 * Math.PI);
          ctx.stroke();
        }
      } else if (key === 'er') {
        // Draw ER as connected tubes
        ctx.beginPath();
        ctx.moveTo(pos.x - 20, pos.y);
        ctx.lineTo(pos.x + 20, pos.y);
        ctx.moveTo(pos.x, pos.y - 15);
        ctx.lineTo(pos.x, pos.y + 15);
        ctx.lineWidth = 8;
        ctx.strokeStyle = organelle.color;
        ctx.stroke();
        
        // Ribosomes on rough ER
        ctx.fillStyle = '#f59e0b';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(pos.x - 15 + i * 8, pos.y - 4, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else if (key === 'golgi') {
        // Draw stacked Golgi apparatus
        ctx.fillStyle = organelle.color;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.ellipse(pos.x + i * 3, pos.y + i * 2, 25, 8, 0, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else {
        // Draw regular circular organelles
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, organelle.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }

      // Draw labels if enabled
      if (showLabels) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(organelle.name, pos.x, pos.y + organelle.size + 15);
      }
    });

    // Draw cell type label
    ctx.fillStyle = '#374151';
    ctx.font = 'bold 18px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`${cellType.charAt(0).toUpperCase() + cellType.slice(1)} Cell`, 20, 30);
  };

  const handleCanvasClick = (e) => {
    if (gameMode !== 'identify') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check which organelle was clicked
    Object.entries(organelles).forEach(([key, organelle]) => {
      if (!organelle.present[cellType] || key === 'cellWall') return;

      const pos = organelle.position;
      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);

      if (distance <= organelle.size) {
        setSelectedOrganelle(key);
      }
    });
  };

  const checkAnswer = (organelleKey) => {
    if (selectedOrganelle === organelleKey) {
      setScore(prev => prev + 10);
      setSelectedOrganelle(null);
      return true;
    }
    return false;
  };

  const resetGame = () => {
    setScore(0);
    setSelectedOrganelle(null);
  };

  return (
    <div className="fade-in">
      {/* Theory Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to="/biology" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Cell Structure Explorer
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Identify organelles and learn their functions in different cell types
            </p>
          </div>
          <div className="score-display" style={{ marginLeft: 'auto' }}>
            <Trophy size={16} style={{ marginRight: '0.5rem' }} />
            {score} points
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--biology-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Cell Biology Basics
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Cells:</strong> The basic unit of life. All living organisms are made of one or more cells that carry out life processes.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Animal vs Plant Cells:</strong> Both are eukaryotic but differ in structures. Plant cells have cell walls, large vacuoles, and chloroplasts.
              </p>
              <p>
                <strong>Organelles:</strong> Specialized structures within cells that perform specific functions, like organs in the human body.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--biology-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Key Differences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--biology-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--biology-accent)'
              }}>
                <strong style={{ color: 'var(--biology-text)' }}>Plant Cells:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Cell wall, large vacuole, chloroplasts</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--biology-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--biology-accent)'
              }}>
                <strong style={{ color: 'var(--biology-text)' }}>Animal Cells:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>No cell wall, small vacuoles, no chloroplasts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Cell Canvas */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Microscope size={20} />
            Interactive Cell Diagram
          </h3>
          
          <canvas
            ref={canvasRef}
            width={600}
            height={450}
            onClick={handleCanvasClick}
            className="game-canvas"
            style={{ 
              cursor: gameMode === 'identify' ? 'pointer' : 'default',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className={`btn ${cellType === 'animal' ? 'primary' : ''}`}
              onClick={() => setCellType('animal')}
            >
              Animal Cell
            </button>
            
            <button 
              className={`btn ${cellType === 'plant' ? 'primary' : ''}`}
              onClick={() => setCellType('plant')}
            >
              Plant Cell
            </button>
            
            <button className="btn" onClick={() => setShowLabels(!showLabels)}>
              {showLabels ? 'Hide' : 'Show'} Labels
            </button>
            
            <button className="btn" onClick={resetGame}>
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Organelle Functions
          </h3>
          
          {selectedOrganelle ? (
            <div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--biology-bg)',
                borderRadius: '12px',
                border: '1px solid var(--biology-accent)',
                marginBottom: '1rem'
              }}>
                <h4 style={{ 
                  color: 'var(--biology-text)', 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {organelles[selectedOrganelle].name}
                </h4>
                <p style={{ 
                  color: 'var(--biology-text)', 
                  fontSize: '0.875rem',
                  opacity: 0.9
                }}>
                  {organelles[selectedOrganelle].function}
                </p>
              </div>
              
              <button 
                className="btn success" 
                onClick={() => checkAnswer(selectedOrganelle)}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                <Check size={20} />
                Identify Selected
              </button>
            </div>
          ) : (
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem',
              textAlign: 'center',
              padding: '2rem 1rem'
            }}>
              Click on an organelle in the cell diagram to learn about its function
            </p>
          )}

          {/* Organelle List */}
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>
              Present in {cellType} cells:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(organelles)
                .filter(([key, organelle]) => organelle.present[cellType])
                .map(([key, organelle]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: key === selectedOrganelle ? 'var(--warning-bg)' : 'var(--bg-secondary)',
                      borderRadius: '6px',
                      border: `1px solid ${key === selectedOrganelle ? 'var(--warning-text)' : 'var(--border-light)'}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedOrganelle(key)}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        backgroundColor: organelle.color,
                        borderRadius: '50%'
                      }}
                    />
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: key === selectedOrganelle ? 'var(--warning-text)' : 'var(--text-primary)'
                    }}>
                      {organelle.name}
                    </span>
                  </div>
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
              How to Play:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Switch between animal and plant cells<br/>
              • Click organelles to learn their functions<br/>
              • Use "Show Labels" to study<br/>
              • Test yourself by identifying structures
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CellStructure;