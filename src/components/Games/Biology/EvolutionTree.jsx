import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, TreePine, Shuffle } from 'lucide-react';

const EvolutionTree = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Evolution tree state
  const [selectedOrganisms, setSelectedOrganisms] = useState([]);
  const [treeStructure, setTreeStructure] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [draggedOrganism, setDraggedOrganism] = useState(null);
  const [treeMode, setTreeMode] = useState('build'); // 'build' or 'challenge'
  
  // Available organisms with evolutionary data
  const organisms = [
    { 
      id: 'bacteria', 
      name: 'Bacteria', 
      emoji: '🦠', 
      era: 'Archean', 
      yearsBP: 3500000000,
      characteristics: ['Prokaryotic', 'Unicellular', 'No nucleus'],
      color: '#10b981'
    },
    { 
      id: 'algae', 
      name: 'Algae', 
      emoji: '🌿', 
      era: 'Proterozoic', 
      yearsBP: 2000000000,
      characteristics: ['Eukaryotic', 'Photosynthesis', 'Aquatic'],
      color: '#22c55e'
    },
    { 
      id: 'fish', 
      name: 'Fish', 
      emoji: '🐟', 
      era: 'Cambrian', 
      yearsBP: 500000000,
      characteristics: ['Vertebrate', 'Gills', 'Fins', 'Scales'],
      color: '#3b82f6'
    },
    { 
      id: 'amphibians', 
      name: 'Amphibians', 
      emoji: '🐸', 
      era: 'Devonian', 
      yearsBP: 350000000,
      characteristics: ['Four limbs', 'Metamorphosis', 'Moist skin'],
      color: '#059669'
    },
    { 
      id: 'reptiles', 
      name: 'Reptiles', 
      emoji: '🦎', 
      era: 'Carboniferous', 
      yearsBP: 300000000,
      characteristics: ['Scales', 'Cold-blooded', 'Eggs with shells'],
      color: '#dc2626'
    },
    { 
      id: 'birds', 
      name: 'Birds', 
      emoji: '🐦', 
      era: 'Jurassic', 
      yearsBP: 150000000,
      characteristics: ['Feathers', 'Warm-blooded', 'Flight'],
      color: '#7c3aed'
    },
    { 
      id: 'mammals', 
      name: 'Mammals', 
      emoji: '🦘', 
      era: 'Triassic', 
      yearsBP: 200000000,
      characteristics: ['Hair/fur', 'Warm-blooded', 'Milk production'],
      color: '#f59e0b'
    },
    { 
      id: 'primates', 
      name: 'Primates', 
      emoji: '🐵', 
      era: 'Paleocene', 
      yearsBP: 55000000,
      characteristics: ['Large brain', 'Opposable thumbs', 'Social'],
      color: '#8b5cf6'
    },
    { 
      id: 'humans', 
      name: 'Humans', 
      emoji: '👤', 
      era: 'Quaternary', 
      yearsBP: 300000,
      characteristics: ['Bipedal', 'Language', 'Tool use', 'Culture'],
      color: '#ec4899'
    }
  ];

  const challenges = [
    {
      id: 'vertebrate_evolution',
      name: 'Vertebrate Evolution',
      description: 'Build the evolutionary tree of vertebrates',
      correctOrder: ['fish', 'amphibians', 'reptiles', 'birds', 'mammals'],
      hint: 'Think about the transition from water to land and the development of different adaptations'
    },
    {
      id: 'primate_evolution',
      name: 'Primate Evolution', 
      description: 'Trace the evolution from early mammals to humans',
      correctOrder: ['mammals', 'primates', 'humans'],
      hint: 'Consider brain development and social behaviors'
    },
    {
      id: 'early_life',
      name: 'Early Life Evolution',
      description: 'Show the progression of early life forms',
      correctOrder: ['bacteria', 'algae', 'fish'],
      hint: 'Start with the simplest organisms and move to more complex ones'
    }
  ];

  useEffect(() => {
    if (treeMode === 'challenge' && !currentChallenge) {
      setCurrentChallenge(challenges[0]);
    }
  }, [treeMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawEvolutionVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw timeline background
      drawTimeline(ctx);
      
      // Draw evolutionary tree
      if (selectedOrganisms.length > 0) {
        drawEvolutionaryTree(ctx);
      }
      
      // Draw organisms
      drawOrganisms(ctx);
      
      // Animation effects
      if (isRunning) {
        drawEvolutionAnimation(ctx);
      }
      
      // Draw challenge info
      if (treeMode === 'challenge' && currentChallenge) {
        drawChallengeInfo(ctx);
      }
    };
    
    const drawTimeline = (ctx) => {
      const timelineY = canvas.height - 100;
      const timelineStart = 50;
      const timelineEnd = canvas.width - 50;
      
      // Main timeline
      ctx.strokeStyle = '#6b46c1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(timelineStart, timelineY);
      ctx.lineTo(timelineEnd, timelineY);
      ctx.stroke();
      
      // Timeline markers and labels
      const eras = [
        { name: 'Archean', start: 4000000000, color: '#dc2626' },
        { name: 'Proterozoic', start: 2500000000, color: '#f59e0b' },
        { name: 'Paleozoic', start: 541000000, color: '#22c55e' },
        { name: 'Mesozoic', start: 252000000, color: '#3b82f6' },
        { name: 'Cenozoic', start: 66000000, color: '#8b5cf6' }
      ];
      
      eras.forEach((era, index) => {
        const x = timelineStart + (index * (timelineEnd - timelineStart) / (eras.length - 1));
        
        ctx.strokeStyle = era.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, timelineY - 20);
        ctx.lineTo(x, timelineY + 20);
        ctx.stroke();
        
        ctx.fillStyle = era.color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(era.name, x, timelineY + 40);
      });
      
      // "Present" marker
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('Present', timelineEnd, timelineY - 30);
      
      // "Past" marker
      ctx.textAlign = 'left';
      ctx.fillText('4 Billion Years Ago', timelineStart, timelineY - 30);
    };
    
    const drawEvolutionaryTree = (ctx) => {
      if (selectedOrganisms.length < 2) return;
      
      const treeStartY = 200;
      const nodeSpacing = 100;
      const levelHeight = 60;
      
      // Sort organisms by evolutionary timeline
      const sortedOrganisms = [...selectedOrganisms].sort((a, b) => b.yearsBP - a.yearsBP);
      
      // Draw tree branches
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      
      sortedOrganisms.forEach((organism, index) => {
        const x = 100 + index * nodeSpacing;
        const y = treeStartY - index * levelHeight;
        
        // Draw node
        ctx.fillStyle = organism.color;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Draw emoji
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(organism.emoji, x, y + 8);
        
        // Draw branch to next organism
        if (index < sortedOrganisms.length - 1) {
          const nextX = 100 + (index + 1) * nodeSpacing;
          const nextY = treeStartY - (index + 1) * levelHeight;
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.stroke();
        }
        
        // Draw organism name and info
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(organism.name, x, y + 45);
        
        ctx.font = '10px Arial';
        ctx.fillText(`${(organism.yearsBP / 1000000).toFixed(0)}M years ago`, x, y + 60);
      });
    };
    
    const drawOrganisms = (ctx) => {
      // Draw available organisms panel
      const panelX = 50;
      const panelY = 350;
      const panelWidth = canvas.width - 100;
      const panelHeight = 150;
      
      // Panel background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
      
      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Available Organisms (drag to build tree):', panelX + 10, panelY - 10);
      
      // Draw organism buttons
      const buttonSize = 60;
      const buttonsPerRow = Math.floor((panelWidth - 20) / (buttonSize + 10));
      
      organisms.forEach((organism, index) => {
        if (treeMode === 'challenge' && currentChallenge && 
            !currentChallenge.correctOrder.includes(organism.id)) {
          return; // Skip organisms not in current challenge
        }
        
        const row = Math.floor(index / buttonsPerRow);
        const col = index % buttonsPerRow;
        const x = panelX + 15 + col * (buttonSize + 10);
        const y = panelY + 15 + row * (buttonSize + 10);
        
        // Button background
        const isSelected = selectedOrganisms.some(o => o.id === organism.id);
        ctx.fillStyle = isSelected ? organism.color : '#f3f4f6';
        ctx.fillRect(x, y, buttonSize, buttonSize);
        
        ctx.strokeStyle = isSelected ? '#1f2937' : '#d1d5db';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.strokeRect(x, y, buttonSize, buttonSize);
        
        // Organism emoji
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(organism.emoji, x + buttonSize/2, y + buttonSize/2 + 8);
        
        // Name
        ctx.fillStyle = '#1f2937';
        ctx.font = '10px Arial';
        ctx.fillText(organism.name, x + buttonSize/2, y + buttonSize + 15);
      });
    };
    
    const drawEvolutionAnimation = (ctx) => {
      const time = Date.now() * 0.003;
      
      // Animated DNA helix
      const helixCenterX = canvas.width - 100;
      const helixCenterY = 200;
      const helixRadius = 30;
      const helixHeight = 100;
      
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
      ctx.lineWidth = 2;
      
      for (let i = 0; i < 20; i++) {
        const y = helixCenterY - helixHeight/2 + (i * helixHeight/20);
        const x1 = helixCenterX + Math.sin(time + i * 0.5) * helixRadius;
        const x2 = helixCenterX - Math.sin(time + i * 0.5) * helixRadius;
        
        ctx.beginPath();
        ctx.arc(x1, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x2, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Connection line
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
      
      // Floating evolution symbols
      const symbols = ['🧬', '⚡', '🌍', '🔬'];
      symbols.forEach((symbol, index) => {
        const x = 200 + Math.sin(time + index) * 50;
        const y = 50 + Math.cos(time + index * 0.7) * 30;
        const alpha = 0.4 + Math.sin(time + index) * 0.3;
        
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
      });
    };
    
    const drawChallengeInfo = (ctx) => {
      if (!currentChallenge) return;
      
      const infoX = 50;
      const infoY = 50;
      const infoWidth = 300;
      const infoHeight = 120;
      
      // Background
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.fillRect(infoX, infoY, infoWidth, infoHeight);
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.strokeRect(infoX, infoY, infoWidth, infoHeight);
      
      // Challenge info
      ctx.fillStyle = '#6b46c1';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(currentChallenge.name, infoX + 10, infoY + 25);
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#4c1d95';
      
      // Wrap text for description
      const words = currentChallenge.description.split(' ');
      let line = '';
      let y = infoY + 50;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        if (ctx.measureText(testLine).width > infoWidth - 20 && line !== '') {
          ctx.fillText(line, infoX + 10, y);
          line = word + ' ';
          y += 16;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, infoX + 10, y);
      
      // Progress indicator
      const correctCount = selectedOrganisms.filter((org, index) => 
        currentChallenge.correctOrder[index] === org.id
      ).length;
      
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(
        `Progress: ${correctCount}/${currentChallenge.correctOrder.length}`, 
        infoX + 10, 
        infoY + infoHeight - 10
      );
    };
    
    drawEvolutionVisualization();
  }, [selectedOrganisms, isRunning, treeMode, currentChallenge]);

  const handleOrganismClick = (organism) => {
    if (treeMode === 'build') {
      // Free build mode - toggle organism
      setSelectedOrganisms(prev => {
        const isSelected = prev.some(o => o.id === organism.id);
        if (isSelected) {
          return prev.filter(o => o.id !== organism.id);
        } else {
          return [...prev, organism];
        }
      });
    } else if (treeMode === 'challenge') {
      // Challenge mode - add to sequence
      if (!selectedOrganisms.some(o => o.id === organism.id)) {
        const newSequence = [...selectedOrganisms, organism];
        setSelectedOrganisms(newSequence);
        
        // Check if sequence is correct
        if (currentChallenge) {
          const isCorrectSoFar = newSequence.every((org, index) => 
            currentChallenge.correctOrder[index] === org.id
          );
          
          if (isCorrectSoFar) {
            setScore(prev => prev + 20);
            
            // Check if challenge is complete
            if (newSequence.length === currentChallenge.correctOrder.length) {
              setScore(prev => prev + 100);
              setLevel(Math.floor(score / 500) + 1);
            }
          }
        }
      }
    }
  };

  const resetTree = () => {
    setSelectedOrganisms([]);
    setIsRunning(false);
  };

  const shuffleChallenge = () => {
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentChallenge(randomChallenge);
    setSelectedOrganisms([]);
  };

  const checkSolution = () => {
    if (!currentChallenge) return false;
    
    return selectedOrganisms.every((org, index) => 
      currentChallenge.correctOrder[index] === org.id
    ) && selectedOrganisms.length === currentChallenge.correctOrder.length;
  };

  const getOrganismFromCanvas = (x, y) => {
    // Convert canvas coordinates to organism selection
    const panelX = 50;
    const panelY = 350;
    const buttonSize = 60;
    const buttonsPerRow = Math.floor((canvasRef.current.width - 120) / (buttonSize + 10));
    
    if (y >= panelY + 15 && y <= panelY + 135) {
      const col = Math.floor((x - panelX - 15) / (buttonSize + 10));
      const row = Math.floor((y - panelY - 15) / (buttonSize + 10));
      const index = row * buttonsPerRow + col;
      
      if (index >= 0 && index < organisms.length) {
        return organisms[index];
      }
    }
    return null;
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const organism = getOrganismFromCanvas(x, y);
    if (organism) {
      handleOrganismClick(organism);
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/biology" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Evolution Tree Builder
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore evolutionary relationships and build phylogenetic trees
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--biology-bg)', 
          border: '1px solid var(--biology-accent)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <TreePine size={16} style={{ color: 'var(--biology-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--biology-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--biology-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Evolution Canvas */}
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
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop Animation' : 'Animate Evolution'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetTree}
            >
              <RotateCcw size={20} />
              Clear Tree
            </button>
            
            {treeMode === 'challenge' && (
              <button 
                className="btn success"
                onClick={shuffleChallenge}
              >
                <Shuffle size={20} />
                New Challenge
              </button>
            )}
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
            Evolution Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Mode
            </label>
            <select
              value={treeMode}
              onChange={(e) => {
                setTreeMode(e.target.value);
                resetTree();
              }}
              className="form-select"
            >
              <option value="build">Free Build</option>
              <option value="challenge">Challenge Mode</option>
            </select>
          </div>

          {/* Challenge Status */}
          {treeMode === 'challenge' && currentChallenge && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: checkSolution() ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
              borderRadius: '8px',
              border: checkSolution() ? '1px solid #10b981' : 'none'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Challenge Status:
              </h4>
              {checkSolution() ? (
                <div style={{ color: '#10b981', fontSize: '0.875rem' }}>
                  🎉 Challenge Complete!
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Progress: {selectedOrganisms.length}/{currentChallenge.correctOrder.length}<br/>
                  💡 {currentChallenge.hint}
                </div>
              )}
            </div>
          )}

          {/* Current Tree */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Current Tree ({selectedOrganisms.length} organisms):
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {selectedOrganisms.length === 0 ? (
                <div style={{ opacity: 0.6 }}>No organisms selected</div>
              ) : (
                selectedOrganisms.map((org, index) => (
                  <div key={org.id} style={{ 
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1rem' }}>{org.emoji}</span>
                    <span>{org.name}</span>
                    <span style={{ opacity: 0.6 }}>
                      ({(org.yearsBP / 1000000).toFixed(0)}M years)
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Evolutionary Concepts */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--biology-bg)',
            borderRadius: '8px',
            border: '1px solid var(--biology-accent)'
          }}>
            <h4 style={{ color: 'var(--biology-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Key Concepts:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--biology-text)', lineHeight: 1.4 }}>
              • Phylogenetic Trees<br/>
              • Common Ancestors<br/>
              • Evolutionary Timeline<br/>
              • Adaptive Radiation<br/>
              • Convergent Evolution
            </div>
          </div>

          {/* Organism Details */}
          {selectedOrganisms.length > 0 && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Organism Details:
              </h4>
              {selectedOrganisms.map(org => (
                <div key={org.id} style={{ 
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(168, 85, 247, 0.05)',
                  borderRadius: '4px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>{org.emoji}</span>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {org.name}
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                    <div>Era: {org.era}</div>
                    <div>Key traits: {org.characteristics.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvolutionTree;