import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Triangle, CheckCircle } from 'lucide-react';

const GeometryProofs = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Proof game state
  const [currentTheorem, setCurrentTheorem] = useState(null);
  const [proofSteps, setProofSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState('');
  const [completedProofs, setCompletedProofs] = useState([]);
  const [theoremType, setTheoremType] = useState('triangles');
  const [showHint, setShowHint] = useState(false);
  
  // Geometry elements for visualization
  const [geometryElements, setGeometryElements] = useState([]);
  const [animationPhase, setAnimationPhase] = useState(0);

  const theorems = {
    triangles: [
      {
        id: 'isosceles',
        name: 'Isosceles Triangle Theorem',
        given: 'Triangle ABC with AB = AC',
        prove: 'Angle B = Angle C',
        steps: [
          'Given: AB = AC',
          'Draw angle bisector AD from A to BC',
          'In triangles ABD and ACD: AB = AC (given)',
          'AD = AD (reflexive property)',
          'Angle BAD = Angle CAD (angle bisector)',
          'Triangle ABD ≅ Triangle ACD (SAS)',
          'Therefore, Angle B = Angle C (CPCTC)'
        ],
        hint: 'Use the angle bisector and congruent triangles',
        elements: [
          { type: 'triangle', points: [{x: 400, y: 100}, {x: 300, y: 300}, {x: 500, y: 300}], labels: ['A', 'B', 'C'] },
          { type: 'line', points: [{x: 400, y: 100}, {x: 400, y: 300}], label: 'AD', dashed: true }
        ]
      },
      {
        id: 'pythagorean',
        name: 'Pythagorean Theorem',
        given: 'Right triangle ABC with right angle at C',
        prove: 'a² + b² = c²',
        steps: [
          'Given: Right triangle ABC with ∠C = 90°',
          'Draw altitude CD to hypotenuse AB',
          'Triangles ABC, ACD, and CBD are similar',
          'From similarity: a²/c = c/b and b²/c = c/a',
          'Therefore: a² = c × (c/b) and b² = c × (c/a)',
          'Adding: a² + b² = c × (c/b + c/a)',
          'Simplifying: a² + b² = c²'
        ],
        hint: 'Use similar triangles formed by the altitude',
        elements: [
          { type: 'triangle', points: [{x: 300, y: 100}, {x: 300, y: 300}, {x: 500, y: 300}], labels: ['A', 'C', 'B'] },
          { type: 'line', points: [{x: 300, y: 300}, {x: 380, y: 220}], label: 'CD', dashed: true }
        ]
      }
    ],
    circles: [
      {
        id: 'inscribed_angle',
        name: 'Inscribed Angle Theorem',
        given: 'Angle ABC inscribed in circle O',
        prove: 'Angle ABC = (1/2) × Arc AC',
        steps: [
          'Given: Angle ABC inscribed in circle O',
          'Draw radius OA and OC',
          'Triangle OAC is isosceles (OA = OC = radius)',
          'Angle OAC = Angle OCA (base angles)',
          'Central angle AOC = 180° - 2 × Angle OAC',
          'Angle ABC = Angle OAC (inscribed angle)',
          'Therefore: Angle ABC = (1/2) × Central angle AOC'
        ],
        hint: 'Use the relationship between central and inscribed angles',
        elements: [
          { type: 'circle', center: {x: 400, y: 250}, radius: 150 },
          { type: 'points', coords: [{x: 320, y: 180}, {x: 280, y: 320}, {x: 480, y: 180}], labels: ['A', 'B', 'C'] }
        ]
      }
    ]
  };

  useEffect(() => {
    if (!currentTheorem) {
      const availableTheorems = theorems[theoremType];
      setCurrentTheorem(availableTheorems[Math.floor(Math.random() * availableTheorems.length)]);
    }
  }, [theoremType, currentTheorem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawGeometryVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      drawGrid(ctx);
      
      // Draw current theorem's geometric elements
      if (currentTheorem) {
        drawGeometricElements(ctx, currentTheorem.elements);
        
        // Draw proof progress
        if (proofSteps.length > 0) {
          drawProofProgress(ctx);
        }
      }
      
      // Animation effects
      if (isRunning) {
        drawAnimationEffects(ctx);
      }
    };
    
    const drawGrid = (ctx) => {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };
    
    const drawGeometricElements = (ctx, elements) => {
      if (!elements) return;
      
      elements.forEach(element => {
        switch (element.type) {
          case 'triangle':
            drawTriangle(ctx, element);
            break;
          case 'circle':
            drawCircle(ctx, element);
            break;
          case 'line':
            drawLine(ctx, element);
            break;
          case 'points':
            drawPoints(ctx, element);
            break;
        }
      });
    };
    
    const drawTriangle = (ctx, triangle) => {
      ctx.strokeStyle = '#6b46c1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      const points = triangle.points;
      ctx.moveTo(points[0].x, points[0].y);
      ctx.lineTo(points[1].x, points[1].y);
      ctx.lineTo(points[2].x, points[2].y);
      ctx.closePath();
      ctx.stroke();
      
      // Draw labels
      if (triangle.labels) {
        ctx.fillStyle = '#6b46c1';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        triangle.labels.forEach((label, index) => {
          const point = points[index];
          ctx.fillText(label, point.x, point.y - 15);
        });
      }
      
      // Highlight equal sides if applicable
      if (currentTheorem && currentTheorem.id === 'isosceles') {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 5;
        
        // AB
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();
        
        // AC
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.stroke();
      }
    };
    
    const drawCircle = (ctx, circle) => {
      ctx.strokeStyle = '#6b46c1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(circle.center.x, circle.center.y, circle.radius, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw center point
      ctx.fillStyle = '#6b46c1';
      ctx.beginPath();
      ctx.arc(circle.center.x, circle.center.y, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#6b46c1';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('O', circle.center.x, circle.center.y - 15);
    };
    
    const drawLine = (ctx, line) => {
      ctx.strokeStyle = line.dashed ? '#ec4899' : '#6b46c1';
      ctx.lineWidth = 2;
      
      if (line.dashed) {
        ctx.setLineDash([5, 5]);
      }
      
      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      ctx.lineTo(line.points[1].x, line.points[1].y);
      ctx.stroke();
      
      if (line.dashed) {
        ctx.setLineDash([]);
      }
      
      // Draw label
      if (line.label) {
        const midX = (line.points[0].x + line.points[1].x) / 2;
        const midY = (line.points[0].y + line.points[1].y) / 2;
        
        ctx.fillStyle = '#ec4899';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(line.label, midX + 15, midY - 10);
      }
    };
    
    const drawPoints = (ctx, pointsData) => {
      ctx.fillStyle = '#6b46c1';
      
      pointsData.coords.forEach((coord, index) => {
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        if (pointsData.labels && pointsData.labels[index]) {
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(pointsData.labels[index], coord.x, coord.y - 15);
        }
      });
    };
    
    const drawProofProgress = (ctx) => {
      const progressY = 50;
      const barWidth = 400;
      const barHeight = 20;
      const progress = proofSteps.length / (currentTheorem.steps.length || 1);
      
      // Progress bar background
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(200, progressY, barWidth, barHeight);
      
      // Progress bar fill
      ctx.fillStyle = '#10b981';
      ctx.fillRect(200, progressY, barWidth * progress, barHeight);
      
      // Progress text
      ctx.fillStyle = '#6b46c1';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Proof Progress: ${Math.round(progress * 100)}%`, 400, progressY + 35);
    };
    
    const drawAnimationEffects = (ctx) => {
      const time = Date.now() * 0.003;
      
      // Animated geometric symbols
      const symbols = ['∠', '△', '≅', '∴', '⊥', '||'];
      symbols.forEach((symbol, index) => {
        const x = 100 + Math.sin(time + index) * 50;
        const y = 100 + Math.cos(time + index * 0.7) * 30;
        const alpha = 0.3 + Math.sin(time + index) * 0.2;
        
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
      });
    };
    
    drawGeometryVisualization();
  }, [currentTheorem, proofSteps, isRunning, animationPhase]);

  const addProofStep = () => {
    if (!selectedStep || !currentTheorem) return;
    
    const stepIndex = currentTheorem.steps.indexOf(selectedStep);
    if (stepIndex === proofSteps.length) {
      // Correct next step
      setProofSteps([...proofSteps, selectedStep]);
      setScore(score + 15);
      
      if (proofSteps.length + 1 === currentTheorem.steps.length) {
        // Proof completed
        setScore(score + 50);
        setCompletedProofs([...completedProofs, currentTheorem.id]);
        setLevel(Math.floor(score / 200) + 1);
      }
    }
    
    setSelectedStep('');
  };

  const resetProof = () => {
    setProofSteps([]);
    setSelectedStep('');
    setShowHint(false);
    setIsRunning(false);
  };

  const getNewTheorem = () => {
    const availableTheorems = theorems[theoremType];
    const uncompletedTheorems = availableTheorems.filter(t => !completedProofs.includes(t.id));
    
    if (uncompletedTheorems.length > 0) {
      setCurrentTheorem(uncompletedTheorems[Math.floor(Math.random() * uncompletedTheorems.length)]);
    } else {
      setCurrentTheorem(availableTheorems[Math.floor(Math.random() * availableTheorems.length)]);
    }
    
    resetProof();
  };

  const getAvailableSteps = () => {
    if (!currentTheorem) return [];
    
    // Return steps that can be selected next
    const nextStepIndex = proofSteps.length;
    const availableSteps = currentTheorem.steps.slice(nextStepIndex);
    
    // Add some incorrect options for challenge
    const distractors = [
      'Therefore, all angles are equal',
      'The triangle is equilateral',
      'Apply the quadratic formula',
      'Use the distributive property',
      'Therefore, AB = BC = AC'
    ];
    
    return [...availableSteps, ...distractors.slice(0, 2)];
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/math" className="btn" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Geometry Proofs
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Learn geometric reasoning through interactive proof construction
            </p>
          </div>
        </div>
        
        <div className="card" style={{ 
          padding: '1rem 1.5rem', 
          background: 'var(--math-bg)', 
          border: '1px solid var(--math-accent)',
          minWidth: '120px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Triangle size={16} style={{ color: 'var(--math-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--math-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        {/* Visualization Canvas */}
        <div className="card">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="game-canvas"
            style={{ 
              width: '100%', 
              height: 'auto',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop Animation' : 'Animate'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetProof}
            >
              <RotateCcw size={20} />
              Reset Proof
            </button>
            
            <button 
              className="btn success"
              onClick={getNewTheorem}
            >
              New Theorem
            </button>
          </div>
        </div>

        {/* Proof Construction Panel */}
        <div className="card">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}>
            Proof Construction
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Theorem Category
            </label>
            <select
              value={theoremType}
              onChange={(e) => {
                setTheoremType(e.target.value);
                setCurrentTheorem(null);
                resetProof();
              }}
              className="form-select"
            >
              <option value="triangles">Triangle Theorems</option>
              <option value="circles">Circle Theorems</option>
            </select>
          </div>

          {/* Current Theorem */}
          {currentTheorem && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                {currentTheorem.name}
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <div><strong>Given:</strong> {currentTheorem.given}</div>
                <div><strong>Prove:</strong> {currentTheorem.prove}</div>
              </div>
              
              {showHint && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.5rem',
                  backgroundColor: 'var(--math-bg)',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--math-text)'
                }}>
                  💡 Hint: {currentTheorem.hint}
                </div>
              )}
            </div>
          )}

          {/* Proof Steps */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Proof Steps ({proofSteps.length}/{currentTheorem?.steps.length || 0}):
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {proofSteps.map((step, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.25rem',
                  padding: '0.25rem',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px'
                }}>
                  {index + 1}. {step}
                </div>
              ))}
              {proofSteps.length === 0 && (
                <div style={{ opacity: 0.6 }}>Start building your proof...</div>
              )}
            </div>
          </div>

          {/* Next Step Selection */}
          {currentTheorem && proofSteps.length < currentTheorem.steps.length && (
            <div style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Select Next Step:
                </label>
                <select
                  value={selectedStep}
                  onChange={(e) => setSelectedStep(e.target.value)}
                  className="form-select"
                >
                  <option value="">Choose a step...</option>
                  {getAvailableSteps().map((step, index) => (
                    <option key={index} value={step}>{step}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btn primary"
                onClick={addProofStep}
                disabled={!selectedStep}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                <CheckCircle size={20} />
                Add Step
              </button>
            </div>
          )}

          {/* Proof Complete */}
          {currentTheorem && proofSteps.length === currentTheorem.steps.length && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.2rem', color: '#10b981', marginBottom: '0.5rem' }}>
                🎉 Proof Complete!
              </div>
              <div style={{ fontSize: '0.875rem', color: '#065f46' }}>
                You've successfully constructed the proof!
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn"
              onClick={() => setShowHint(!showHint)}
              style={{ flex: 1 }}
            >
                            {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            <button 
              className="btn primary"
              onClick={getNewTheorem}
              style={{ flex: 1 }}
            >
              Next Theorem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometryProofs;
