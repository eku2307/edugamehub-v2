import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Dice6, TrendingUp } from 'lucide-react';

const ProbabilityLab = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Probability experiment state
  const [experimentType, setExperimentType] = useState('dice');
  const [trialCount, setTrialCount] = useState(0);
  const [results, setResults] = useState({});
  const [expectedProbabilities, setExpectedProbabilities] = useState({});
  const [currentResult, setCurrentResult] = useState(null);
  
  // Animation and visualization
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [showStatistics, setShowStatistics] = useState(true);
  const [autoRun, setAutoRun] = useState(false);
  
  // Chart data for visualization
  const [chartData, setChartData] = useState([]);

  const experiments = {
    dice: {
      name: 'Dice Roll',
      outcomes: [1, 2, 3, 4, 5, 6],
      expectedProb: 1/6,
      simulate: () => Math.floor(Math.random() * 6) + 1,
      color: '#3b82f6'
    },
    coin: {
      name: 'Coin Flip',
      outcomes: ['Heads', 'Tails'],
      expectedProb: 0.5,
      simulate: () => Math.random() < 0.5 ? 'Heads' : 'Tails',
      color: '#f59e0b'
    },
    cards: {
      name: 'Card Draw',
      outcomes: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
      expectedProb: 0.25,
      simulate: () => {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        return suits[Math.floor(Math.random() * 4)];
      },
      color: '#ef4444'
    },
    spinner: {
      name: '8-Section Spinner',
      outcomes: [1, 2, 3, 4, 5, 6, 7, 8],
      expectedProb: 1/8,
      simulate: () => Math.floor(Math.random() * 8) + 1,
      color: '#10b981'
    }
  };

  useEffect(() => {
    // Initialize expected probabilities when experiment changes
    const experiment = experiments[experimentType];
    const expectedProbs = {};
    experiment.outcomes.forEach(outcome => {
      expectedProbs[outcome] = experiment.expectedProb;
    });
    setExpectedProbabilities(expectedProbs);
    
    // Reset results
    setResults({});
    setTrialCount(0);
    setChartData([]);
  }, [experimentType]);

  useEffect(() => {
    let interval;
    if (autoRun && isRunning) {
      interval = setInterval(runSingleTrial, animationSpeed);
    }
    return () => clearInterval(interval);
  }, [autoRun, isRunning, animationSpeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const drawProbabilityVisualization = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background grid
      drawGrid(ctx);
      
      // Draw current experiment visualization
      drawExperimentVisual(ctx);
      
      // Draw probability chart
      if (showStatistics && Object.keys(results).length > 0) {
        drawProbabilityChart(ctx);
      }
      
      // Draw current result animation
      if (currentResult && isRunning) {
        drawCurrentResult(ctx);
      }
    };
    
    const drawGrid = (ctx) => {
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
    };
    
    const drawExperimentVisual = (ctx) => {
      const experiment = experiments[experimentType];
      const centerX = 200;
      const centerY = 200;
      
      switch (experimentType) {
        case 'dice':
          drawDice(ctx, centerX, centerY, currentResult);
          break;
        case 'coin':
          drawCoin(ctx, centerX, centerY, currentResult);
          break;
        case 'cards':
          drawCard(ctx, centerX, centerY, currentResult);
          break;
        case 'spinner':
          drawSpinner(ctx, centerX, centerY, currentResult);
          break;
      }
    };
    
    const drawDice = (ctx, x, y, result) => {
      const size = 80;
      
      // Draw dice body
      ctx.fillStyle = '#f3f4f6';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      ctx.fillRect(x - size/2, y - size/2, size, size);
      ctx.strokeRect(x - size/2, y - size/2, size, size);
      
      // Draw dots based on result
      if (result) {
        ctx.fillStyle = '#1f2937';
        const dotPositions = {
          1: [[0, 0]],
          2: [[-20, -20], [20, 20]],
          3: [[-20, -20], [0, 0], [20, 20]],
          4: [[-20, -20], [20, -20], [-20, 20], [20, 20]],
          5: [[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]],
          6: [[-20, -20], [20, -20], [-20, 0], [20, 0], [-20, 20], [20, 20]]
        };
        
        dotPositions[result]?.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.arc(x + dx, y + dy, 6, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    };
    
    const drawCoin = (ctx, x, y, result) => {
      const radius = 40;
      
      // Draw coin
      ctx.fillStyle = result === 'Heads' ? '#f59e0b' : '#6b7280';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw text
      if (result) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(result === 'Heads' ? 'H' : 'T', x, y + 5);
      }
    };
    
    const drawCard = (ctx, x, y, result) => {
      const width = 60;
      const height = 80;
      
      // Draw card
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.fillRect(x - width/2, y - height/2, width, height);
      ctx.strokeRect(x - width/2, y - height/2, width, height);
      
      // Draw suit symbol
      if (result) {
        ctx.fillStyle = result === 'Hearts' || result === 'Diamonds' ? '#ef4444' : '#1f2937';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        
        const symbols = {
          'Hearts': '♥',
          'Diamonds': '♦',
          'Clubs': '♣',
          'Spades': '♠'
        };
        
        ctx.fillText(symbols[result], x, y + 7);
      }
    };
    
    const drawSpinner = (ctx, x, y, result) => {
      const radius = 50;
      const sections = 8;
      
      // Draw spinner sections
      for (let i = 0; i < sections; i++) {
        const startAngle = (i * 2 * Math.PI) / sections;
        const endAngle = ((i + 1) * 2 * Math.PI) / sections;
        
        ctx.fillStyle = result === (i + 1) ? '#10b981' : '#e5e7eb';
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngle, endAngle);
        ctx.lineTo(x, y);
        ctx.fill();
        
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw numbers
        const textAngle = startAngle + (endAngle - startAngle) / 2;
        const textX = x + Math.cos(textAngle) * (radius * 0.7);
        const textY = y + Math.sin(textAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((i + 1).toString(), textX, textY + 5);
      }
      
      // Draw center dot
      ctx.fillStyle = '#374151';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    };
    
    const drawProbabilityChart = (ctx) => {
      const chartX = 450;
      const chartY = 50;
      const chartWidth = 300;
      const chartHeight = 200;
      
      // Draw chart background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(chartX, chartY, chartWidth, chartHeight);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(chartX, chartY, chartWidth, chartHeight);
      
      // Draw title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Probability Distribution', chartX + chartWidth/2, chartY - 10);
      
      const experiment = experiments[experimentType];
      const outcomes = experiment.outcomes;
      const barWidth = chartWidth / outcomes.length;
      
      outcomes.forEach((outcome, index) => {
        const observedFreq = results[outcome] || 0;
        const observedProb = trialCount > 0 ? observedFreq / trialCount : 0;
        const expectedProb = expectedProbabilities[outcome];
        
        const barHeight = (observedProb / Math.max(expectedProb * 2, 0.5)) * chartHeight;
        const barX = chartX + index * barWidth;
        const barY = chartY + chartHeight - barHeight;
        
        // Draw observed probability bar
        ctx.fillStyle = experiment.color;
        ctx.fillRect(barX + 5, barY, barWidth - 10, barHeight);
        
        // Draw expected probability line
        const expectedHeight = (expectedProb / Math.max(expectedProb * 2, 0.5)) * chartHeight;
        const expectedY = chartY + chartHeight - expectedHeight;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(barX + 5, expectedY);
        ctx.lineTo(barX + barWidth - 5, expectedY);
        ctx.stroke();
        
        // Draw outcome label
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          outcome.toString().substring(0, 3), 
          barX + barWidth/2, 
          chartY + chartHeight + 15
        );
        
        // Draw probability value
        ctx.fillText(
          observedProb.toFixed(3), 
          barX + barWidth/2, 
          chartY + chartHeight + 30
        );
      });
      
      // Draw legend
      ctx.fillStyle = experiment.color;
      ctx.fillRect(chartX + 10, chartY + 10, 15, 10);
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Observed', chartX + 30, chartY + 20);
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(chartX + 10, chartY + 35);
      ctx.lineTo(chartX + 25, chartY + 35);
      ctx.stroke();
      ctx.fillText('Expected', chartX + 30, chartY + 40);
    };
    
    const drawCurrentResult = (ctx) => {
      if (!currentResult) return;
      
      // Flash effect for new result
      const time = Date.now() % 1000;
      const alpha = 0.3 + 0.7 * Math.sin(time * 0.01);
      
      ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(currentResult.toString(), 100, 100);
    };
    
    drawProbabilityVisualization();
  }, [experimentType, results, trialCount, currentResult, isRunning, showStatistics, expectedProbabilities]);

  const runSingleTrial = () => {
    const experiment = experiments[experimentType];
    const result = experiment.simulate();
    
    setCurrentResult(result);
    setResults(prev => ({
      ...prev,
      [result]: (prev[result] || 0) + 1
    }));
    setTrialCount(prev => prev + 1);
    setScore(prev => prev + 1);
    
    // Clear current result after animation
    setTimeout(() => setCurrentResult(null), animationSpeed);
  };

  const runMultipleTrials = (count) => {
    const experiment = experiments[experimentType];
    const newResults = {...results};
    
    for (let i = 0; i < count; i++) {
      const result = experiment.simulate();
      newResults[result] = (newResults[result] || 0) + 1;
    }
    
    setResults(newResults);
    setTrialCount(prev => prev + count);
    setScore(prev => prev + count);
    setLevel(Math.floor(score / 1000) + 1);
  };

  const resetExperiment = () => {
    setResults({});
    setTrialCount(0);
    setCurrentResult(null);
    setIsRunning(false);
    setAutoRun(false);
    setChartData([]);
  };

  const calculateChiSquare = () => {
    const experiment = experiments[experimentType];
    let chiSquare = 0;
    
    experiment.outcomes.forEach(outcome => {
      const observed = results[outcome] || 0;
      const expected = trialCount * expectedProbabilities[outcome];
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    });
    
    return chiSquare;
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
              Probability Lab
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore probability through interactive experiments and statistical analysis
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
            <Dice6 size={16} style={{ color: 'var(--math-text)' }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--math-text)' }}>
              {trialCount}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', opacity: 0.8 }}>
            Trials | Level {level}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Visualization Canvas */}
        <div className="card">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="game-canvas"
            style={{ 
              width: '100%', 
              height: 'auto',
              backgroundColor: 'var(--bg-secondary)'
            }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button 
              className="btn primary"
              onClick={runSingleTrial}
              disabled={autoRun}
            >
              Run Single Trial
            </button>
            
            <button 
              className="btn"
              onClick={() => runMultipleTrials(100)}
              disabled={autoRun}
            >
              Run 100 Trials
            </button>
            
            <button 
              className={`btn ${autoRun ? 'danger' : 'success'}`}
              onClick={() => {
                setAutoRun(!autoRun);
                setIsRunning(!autoRun);
              }}
            >
              {autoRun ? <Pause size={20} /> : <Play size={20} />}
              {autoRun ? 'Stop Auto' : 'Auto Run'}
            </button>
            
            <button 
              className="btn" 
              onClick={resetExperiment}
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
            Experiment Controls
          </h3>
          
          <div className="form-group">
            <label className="form-label">
              Experiment Type
            </label>
            <select
              value={experimentType}
              onChange={(e) => setExperimentType(e.target.value)}
              className="form-select"
              disabled={autoRun}
            >
              <option value="dice">Dice Roll (6 sides)</option>
              <option value="coin">Coin Flip</option>
              <option value="cards">Card Suit Draw</option>
              <option value="spinner">Spinner (8 sections)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Animation Speed: {animationSpeed}ms
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="slider"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={showStatistics}
                onChange={(e) => setShowStatistics(e.target.checked)}
              />
              Show Statistics Chart
            </label>
          </div>

          {/* Results Summary */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Results Summary:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              <div>Total Trials: {trialCount}</div>
              {Object.entries(results).map(([outcome, count]) => (
                <div key={outcome}>
                  {outcome}: {count} ({trialCount > 0 ? ((count/trialCount) * 100).toFixed(1) : 0}%)
                </div>
              ))}
            </div>
          </div>

          {/* Statistical Analysis */}
          {trialCount > 10 && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--math-bg)',
              borderRadius: '8px',
              border: '1px solid var(--math-accent)'
            }}>
              <h4 style={{ color: 'var(--math-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Statistical Analysis:
              </h4>
              <div style={{ fontSize: '0.75rem', color: 'var(--math-text)', lineHeight: 1.4 }}>
                <div>Chi-Square: {calculateChiSquare().toFixed(3)}</div>
                <div>Expected Probability: {(experiments[experimentType].expectedProb * 100).toFixed(1)}%</div>
                <div>Sample Size: {trialCount >= 30 ? 'Good' : 'Small'}</div>
              </div>
            </div>
          )}

          {/* Learning Notes */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              Key Concepts:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              • Law of Large Numbers<br/>
              • Theoretical vs Experimental Probability<br/>
              • Chi-Square Goodness of Fit<br/>
              • Sample Size Effect on Accuracy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityLab;