import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Calculator, Target } from 'lucide-react';

const AlgebraChallenge = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Algebra game state
  const [currentEquation, setCurrentEquation] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [equationHistory, setEquationHistory] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  
  // Animation states
  const [animationStep, setAnimationStep] = useState(0);
  const [solutionSteps, setSolutionSteps] = useState([]);

  const generateEquation = (difficulty) => {
    let equation, solution, steps;
    
    switch (difficulty) {
      case 'easy':
        // Linear equations: ax + b = c
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 20) - 10;
        const x = Math.floor(Math.random() * 10) + 1;
        const c = a * x + b;
        
        equation = `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`;
        solution = x;
        steps = [
          `${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
          `${a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)}`,
          `${a}x = ${c - b}`,
          `x = ${c - b}/${a}`,
          `x = ${solution}`
        ];
        break;
        
      case 'medium':
        // Quadratic equations: ax² + bx + c = 0 (simplified)
        const roots = [Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 5) + 1];
        const coefA = 1;
        const coefB = -(roots[0] + roots[1]);
        const coefC = roots[0] * roots[1];
        
        equation = `x² ${coefB >= 0 ? '+' : ''} ${coefB}x ${coefC >= 0 ? '+' : ''} ${coefC} = 0`;
        solution = roots[0]; // Taking first root
        steps = [
          equation,
          `(x - ${roots[0]})(x - ${roots[1]}) = 0`,
          `x = ${roots[0]} or x = ${roots[1]}`
        ];
        break;
        
      case 'hard':
        // System of equations
        const x1 = Math.floor(Math.random() * 10) + 1;
        const y1 = Math.floor(Math.random() * 10) + 1;
        const a1 = Math.floor(Math.random() * 3) + 1;
        const b1 = Math.floor(Math.random() * 3) + 1;
        const a2 = Math.floor(Math.random() * 3) + 1;
        const b2 = Math.floor(Math.random() * 3) + 1;
        
        equation = `${a1}x + ${b1}y = ${a1 * x1 + b1 * y1} and ${a2}x + ${b2}y = ${a2 * x1 + b2 * y1}`;
        solution = x1;
        steps = [
          `${a1}x + ${b1}y = ${a1 * x1 + b1 * y1}`,
          `${a2}x + ${b2}y = ${a2 * x1 + b2 * y1}`,
          `x = ${solution}, y = ${y1}`
        ];
        break;
        
      default:
        return generateEquation('easy');
    }
    
    return { equation, solution, steps, difficulty };
  };

  useEffect(() => {
    if (!currentEquation) {
      setCurrentEquation(generateEquation(difficulty));
    }
  }, [difficulty, currentEquation]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawAlgebraVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw coordinate system
      drawCoordinateSystem(ctx);
      
      // Draw current equation
      if (currentEquation) {
        drawEquation(ctx, currentEquation.equation, 50, 50);
        
        if (showSolution) {
          drawSolutionSteps(ctx);
        }
        
        // Draw graph representation if applicable
        if (currentEquation.difficulty === 'easy') {
          drawLinearGraph(ctx, currentEquation);
        }
      }
      
      // Animation effects
      if (isRunning && animationStep > 0) {
        drawAnimationEffects(ctx);
      }
    };
    
    const drawCoordinateSystem = (ctx) => {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 1;
      
      // Grid
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Axes
      ctx.strokeStyle = '#6b46c1';
      ctx.lineWidth = 2;
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
    };
    
    const drawEquation = (ctx, equation, x, y) => {
      ctx.fillStyle = '#6b46c1';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(equation, x, y);
    };
    
    const drawSolutionSteps = (ctx) => {
      if (!solutionSteps.length) return;
      
      ctx.fillStyle = '#10b981';
      ctx.font = '18px Arial';
      
      solutionSteps.slice(0, animationStep).forEach((step, index) => {
        ctx.fillText(step, 50, 120 + index * 40);
      });
    };
    
    const drawLinearGraph = (ctx, equation) => {
      if (equation.difficulty !== 'easy') return;
      
      // Parse equation to get slope and intercept
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      // Draw line representing the equation
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let x = -10; x <= 10; x += 0.1) {
        // For visualization, assume y = mx + b format
        const y = -x + equation.solution; // Simplified representation
        const pixelX = centerX + x * 20;
        const pixelY = centerY - y * 20;
        
        if (x === -10) {
          ctx.moveTo(pixelX, pixelY);
        } else {
          ctx.lineTo(pixelX, pixelY);
        }
      }
      ctx.stroke();
      
      // Mark solution point
      if (showSolution) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(centerX + equation.solution * 20, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#6b46c1';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`x = ${equation.solution}`, centerX + equation.solution * 20 + 15, centerY - 15);
      }
    };
    
    const drawAnimationEffects = (ctx) => {
      const time = Date.now() * 0.005;
      
      // Floating mathematical symbols
      const symbols = ['x', 'y', '=', '+', '-', '²'];
      symbols.forEach((symbol, index) => {
        const x = 200 + Math.sin(time + index) * 100;
        const y = 200 + Math.cos(time + index * 0.7) * 50;
        const alpha = 0.3 + Math.sin(time + index) * 0.2;
        
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(symbol, x, y);
      });
    };
    
    drawAlgebraVisualization();
  }, [currentEquation, showSolution, animationStep, isRunning, solutionSteps]);

  const checkAnswer = () => {
    if (!currentEquation) return;
    
    const userValue = parseFloat(userAnswer);
    const correct = Math.abs(userValue - currentEquation.solution) < 0.01;
    
    if (correct) {
      setScore(score + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30));
      setLevel(Math.floor(score / 100) + 1);
    }
    
    setEquationHistory([...equationHistory, {
      equation: currentEquation.equation,
      userAnswer: userValue,
      correctAnswer: currentEquation.solution,
      correct,
      timestamp: new Date()
    }]);
    
    // Generate new equation
    setCurrentEquation(generateEquation(difficulty));
    setUserAnswer('');
    setShowSolution(false);
    setAnimationStep(0);
  };

  const showSolutionSteps = () => {
    if (!currentEquation) return;
    
    setShowSolution(true);
    setSolutionSteps(currentEquation.steps);
    setAnimationStep(0);
    
    // Animate solution steps
    const interval = setInterval(() => {
      setAnimationStep(step => {
        if (step >= currentEquation.steps.length - 1) {
          clearInterval(interval);
          return step;
        }
        return step + 1;
      });
    }, 1000);
  };

  const startSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetGame = () => {
    setIsRunning(false);
    setCurrentEquation(generateEquation(difficulty));
    setUserAnswer('');
    setShowSolution(false);
    setEquationHistory([]);
    setScore(0);
    setLevel(1);
    setAnimationStep(0);
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
              Algebra Challenge
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Solve equations and visualize mathematical concepts
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
            <Calculator size={16} style={{ color: 'var(--math-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--math-text)' }}>
              {score}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', opacity: 0.8 }}>
            Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
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
          
          {/* Answer Input */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <input
              type="number"
              step="0.01"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '1.1rem',
                width: '200px'
              }}
            />
            <button 
              className="btn primary"
              onClick={checkAnswer}
              disabled={!userAnswer.trim()}
            >
              <Target size={20} />
              Check Answer
            </button>
            
            <button 
              className="btn"
              onClick={showSolutionSteps}
            >
              Show Solution
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className={`btn ${isRunning ? 'danger' : 'primary'}`}
              onClick={startSimulation}
            >
              {isRunning ? <Pause size={20} /> : <Play size={20} />}
              {isRunning ? 'Stop Animation' : 'Start Animation'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetGame}
            >
              <RotateCcw size={20} />
              New Problem
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
            Challenge Settings
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setCurrentEquation(null);
              }}
              className="form-select"
            >
              <option value="easy">Easy - Linear Equations</option>
              <option value="medium">Medium - Quadratics</option>
              <option value="hard">Hard - Systems</option>
            </select>
          </div>

          {/* Current Equation Display */}
          {currentEquation && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Current Problem:
              </h4>
              <div style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: 1.4,
                fontFamily: 'monospace',
                fontSize: '1rem',
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '4px'
              }}>
                {currentEquation.equation}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--math-bg)',
            borderRadius: '8px',
            border: '1px solid var(--math-accent)'
          }}>
            <h4 style={{ color: 'var(--math-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Statistics:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', lineHeight: 1.4 }}>
              <div>Problems Solved: {equationHistory.length}</div>
              <div>Correct: {equationHistory.filter(h => h.correct).length}</div>
              <div>Accuracy: {equationHistory.length > 0 ? 
                Math.round((equationHistory.filter(h => h.correct).length / equationHistory.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Recent History */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Recent Problems:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {equationHistory.slice(-5).reverse().map((problem, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.5rem',
                  padding: '0.25rem',
                  backgroundColor: problem.correct ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '4px'
                }}>
                  <div>{problem.equation}</div>
                  <div style={{ opacity: 0.8 }}>
                    Your answer: {problem.userAnswer} | Correct: {problem.correctAnswer}
                    {problem.correct ? ' ✓' : ' ✗'}
                  </div>
                </div>
              ))}
              {equationHistory.length === 0 && (
                <div style={{ opacity: 0.6 }}>No problems solved yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgebraChallenge;