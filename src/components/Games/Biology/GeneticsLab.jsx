import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, Trophy, RotateCcw, Check, Shuffle } from 'lucide-react';

const GeneticsLab = () => {
  const [score, setScore] = useState(0);
  const [currentCross, setCurrentCross] = useState(null);
  const [selectedOffspring, setSelectedOffspring] = useState([]);
  const [userPrediction, setUserPrediction] = useState('');
  const [crossType, setCrossType] = useState('monohybrid');
  const [showPunnettSquare, setShowPunnettSquare] = useState(true);

  const traits = {
    height: {
      dominant: { allele: 'T', trait: 'Tall', color: '#10b981' },
      recessive: { allele: 't', trait: 'Short', color: '#ef4444' }
    },
    color: {
      dominant: { allele: 'P', trait: 'Purple', color: '#8b5cf6' },
      recessive: { allele: 'p', trait: 'White', color: '#f3f4f6' }
    },
    seed: {
      dominant: { allele: 'R', trait: 'Round', color: '#f59e0b' },
      recessive: { allele: 'r', trait: 'Wrinkled', color: '#6b7280' }
    }
  };

  const crosses = {
    monohybrid: [
      {
        id: 1,
        parent1: { genotype: 'TT', phenotype: 'Tall' },
        parent2: { genotype: 'tt', phenotype: 'Short' },
        trait: 'height',
        expectedRatio: '4:0',
        expectedPhenotypes: ['Tall', 'Tall', 'Tall', 'Tall'],
        description: 'Homozygous dominant × Homozygous recessive'
      },
      {
        id: 2,
        parent1: { genotype: 'Tt', phenotype: 'Tall' },
        parent2: { genotype: 'Tt', phenotype: 'Tall' },
        trait: 'height',
        expectedRatio: '3:1',
        expectedPhenotypes: ['Tall', 'Tall', 'Tall', 'Short'],
        description: 'Heterozygous × Heterozygous'
      },
      {
        id: 3,
        parent1: { genotype: 'Tt', phenotype: 'Tall' },
        parent2: { genotype: 'tt', phenotype: 'Short' },
        trait: 'height',
        expectedRatio: '1:1',
        expectedPhenotypes: ['Tall', 'Tall', 'Short', 'Short'],
        description: 'Heterozygous × Homozygous recessive'
      }
    ],
    dihybrid: [
      {
        id: 4,
        parent1: { genotype: 'TTPP', phenotype: 'Tall Purple' },
        parent2: { genotype: 'ttpp', phenotype: 'Short White' },
        traits: ['height', 'color'],
        expectedRatio: '16:0',
        expectedPhenotypes: Array(16).fill('Tall Purple'),
        description: 'Homozygous dominant × Homozygous recessive'
      },
      {
        id: 5,
        parent1: { genotype: 'TtPp', phenotype: 'Tall Purple' },
        parent2: { genotype: 'TtPp', phenotype: 'Tall Purple' },
        traits: ['height', 'color'],
        expectedRatio: '9:3:3:1',
        expectedPhenotypes: [
          'Tall Purple', 'Tall Purple', 'Tall Purple', 'Tall Purple',
          'Tall Purple', 'Tall Purple', 'Tall Purple', 'Tall Purple',
          'Tall Purple', 'Tall White', 'Tall White', 'Tall White',
          'Short Purple', 'Short Purple', 'Short Purple', 'Short White'
        ],
        description: 'Dihybrid cross (TtPp × TtPp)'
      }
    ]
  };

  useEffect(() => {
    generateNewCross();
  }, [crossType]);

  const generateNewCross = () => {
    const availableCrosses = crosses[crossType];
    const randomCross = availableCrosses[Math.floor(Math.random() * availableCrosses.length)];
    setCurrentCross(randomCross);
    setSelectedOffspring([]);
    setUserPrediction('');
  };

  const generateGametes = (genotype) => {
    if (genotype.length === 2) {
      // Monohybrid
      return [genotype[0], genotype[1]];
    } else if (genotype.length === 4) {
      // Dihybrid
      const allele1a = genotype[0]; // First allele of first trait
      const allele1b = genotype[1]; // Second allele of first trait
      const allele2a = genotype[2]; // First allele of second trait
      const allele2b = genotype[3]; // Second allele of second trait
      
      return [
        allele1a + allele2a, // Combination 1
        allele1a + allele2b, // Combination 2
        allele1b + allele2a, // Combination 3
        allele1b + allele2b  // Combination 4
      ];
    }
  };

  const performCross = () => {
    if (!currentCross) return [];

    const gametes1 = generateGametes(currentCross.parent1.genotype);
    const gametes2 = generateGametes(currentCross.parent2.genotype);
    
    const offspring = [];
    
    gametes1.forEach(g1 => {
      gametes2.forEach(g2 => {
        let genotype;
        if (crossType === 'monohybrid') {
          genotype = g1 + g2;
        } else {
          // Dihybrid - combine alleles for each trait
          const trait1 = [g1[0], g2[0]].sort().join('');
          const trait2 = [g1[1], g2[1]].sort().join('');
          genotype = trait1 + trait2;
        }
        
        const phenotype = determinePhenotype(genotype);
        offspring.push({ genotype, phenotype });
      });
    });
    
    return offspring;
  };

  const determinePhenotype = (genotype) => {
    if (crossType === 'monohybrid') {
      const trait = currentCross.trait;
      const hasDominant = genotype.includes(traits[trait].dominant.allele.toUpperCase());
      return hasDominant ? traits[trait].dominant.trait : traits[trait].recessive.trait;
    } else {
      // Dihybrid - determine phenotype for each trait
      const heightGenotype = genotype.substring(0, 2);
      const colorGenotype = genotype.substring(2, 4);
      
      const heightTrait = traits.height;
      const colorTrait = traits.color;
      
      const heightPhenotype = heightGenotype.includes('T') ? heightTrait.dominant.trait : heightTrait.recessive.trait;
      const colorPhenotype = colorGenotype.includes('P') ? colorTrait.dominant.trait : colorTrait.recessive.trait;
      
      return `${heightPhenotype} ${colorPhenotype}`;
    }
  };

  const checkPrediction = () => {
    const actualOffspring = performCross();
    const actualRatio = calculatePhenotypeRatio(actualOffspring);
    
    if (userPrediction === currentCross.expectedRatio) {
      const points = crossType === 'monohybrid' ? 20 : 40;
      setScore(prev => prev + points);
      alert(`Correct! The ratio is ${actualRatio}. +${points} points!`);
    } else {
      alert(`Incorrect. The correct ratio is ${currentCross.expectedRatio}, you predicted ${userPrediction}`);
    }
  };

  const calculatePhenotypeRatio = (offspring) => {
    const counts = {};
    offspring.forEach(child => {
      counts[child.phenotype] = (counts[child.phenotype] || 0) + 1;
    });
    
    return Object.values(counts).join(':');
  };

  const renderPunnettSquare = () => {
    if (!currentCross || !showPunnettSquare) return null;

    const offspring = performCross();
    const gametes1 = generateGametes(currentCross.parent1.genotype);
    const gametes2 = generateGametes(currentCross.parent2.genotype);

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Punnett Square
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `40px repeat(${gametes2.length}, 80px)`,
          gridTemplateRows: `40px repeat(${gametes1.length}, 80px)`,
          gap: '2px',
          backgroundColor: 'var(--border-light)',
          padding: '2px',
          borderRadius: '8px',
          maxWidth: 'fit-content'
        }}>
          {/* Empty corner */}
          <div style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
          
          {/* Top gametes */}
          {gametes2.map((gamete, index) => (
            <div key={index} style={{
              backgroundColor: 'var(--biology-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: 'var(--biology-text)',
              fontSize: '0.875rem'
            }}>
              {gamete}
            </div>
          ))}
          
          {/* Left gametes and offspring */}
          {gametes1.map((gamete1, i) => (
            <React.Fragment key={i}>
              <div style={{
                backgroundColor: 'var(--biology-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                color: 'var(--biology-text)',
                fontSize: '0.875rem'
              }}>
                {gamete1}
              </div>
              
              {gametes2.map((gamete2, j) => {
                const childIndex = i * gametes2.length + j;
                const child = offspring[childIndex];
                const isSelected = selectedOffspring.includes(childIndex);
                
                return (
                  <div
                    key={j}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedOffspring(prev => prev.filter(idx => idx !== childIndex));
                      } else {
                        setSelectedOffspring(prev => [...prev, childIndex]);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? 'var(--success-bg)' : 'var(--bg-card)',
                      border: isSelected ? '2px solid var(--success-text)' : '1px solid var(--border-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      padding: '0.25rem'
                    }}
                  >
                    <div style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {child.genotype}
                    </div>
                    <div style={{ 
                      fontSize: '0.625rem',
                      color: 'var(--text-secondary)',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}>
                      {child.phenotype}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  if (!currentCross) return <div>Loading...</div>;

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
              Genetics Laboratory
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
              Explore Mendelian genetics through interactive crosses and Punnett squares
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
              Mendelian Genetics
            </h3>
            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Dominant Alleles:</strong> Expressed when present (represented by capital letters). 
                Only one copy needed to show the trait.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                <strong>Recessive Alleles:</strong> Only expressed when two copies are present (lowercase letters). 
                Masked by dominant alleles.
              </p>
              <p>
                <strong>Punnett Squares:</strong> Diagrams that predict the probability of offspring genotypes and phenotypes from a genetic cross.
              </p>
            </div>
          </div>

          <div>
            <h3 style={{ color: 'var(--biology-text)', marginBottom: '1rem', fontSize: '1.25rem' }}>
              Key Terms
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--biology-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--biology-accent)'
              }}>
                <strong style={{ color: 'var(--biology-text)' }}>Genotype:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Genetic makeup (TT, Tt, tt)</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--biology-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--biology-accent)'
              }}>
                <strong style={{ color: 'var(--biology-text)' }}>Phenotype:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Observable trait (Tall, Short)</div>
              </div>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: 'var(--biology-bg)', 
                borderRadius: '8px',
                border: '1px solid var(--biology-accent)'
              }}>
                <strong style={{ color: 'var(--biology-text)' }}>Ratio:</strong>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Proportion of phenotypes (3:1, 9:3:3:1)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Interface */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
        {/* Genetics Cross */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Activity size={20} />
              Genetic Cross
            </h3>
            <select
              value={crossType}
              onChange={(e) => setCrossType(e.target.value)}
              className="form-input"
            >
              <option value="monohybrid">Monohybrid Cross</option>
              <option value="dihybrid">Dihybrid Cross</option>
            </select>
          </div>

          {/* Cross Description */}
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {currentCross.description}
            </h4>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
              {/* Parent 1 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--biology-bg)',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  border: '2px solid var(--biology-accent)'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--biology-text)' }}>
                    {currentCross.parent1.genotype}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {currentCross.parent1.phenotype}
                </div>
              </div>

              <div style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>×</div>

              {/* Parent 2 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'var(--biology-bg)',
                  borderRadius: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  border: '2px solid var(--biology-accent)'
                }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--biology-text)' }}>
                    {currentCross.parent2.genotype}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {currentCross.parent2.phenotype}
                </div>
              </div>
            </div>
          </div>

          {/* Punnett Square */}
          {renderPunnettSquare()}

          {/* Prediction Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">
              Predict the phenotype ratio:
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input
                type="text"
                value={userPrediction}
                onChange={(e) => setUserPrediction(e.target.value)}
                placeholder="e.g., 3:1 or 9:3:3:1"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button className="btn primary" onClick={checkPrediction}>
                <Check size={20} />
                Check
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className={`btn ${showPunnettSquare ? 'primary' : ''}`}
              onClick={() => setShowPunnettSquare(!showPunnettSquare)}
            >
              {showPunnettSquare ? 'Hide' : 'Show'} Punnett Square
            </button>
            
            <button className="btn" onClick={generateNewCross}>
              <Shuffle size={20} />
              New Cross
            </button>
            
            <button className="btn" onClick={() => setScore(0)}>
              <RotateCcw size={20} />
              Reset Score
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Cross Information
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--biology-bg)',
              borderRadius: '8px',
              border: '1px solid var(--biology-accent)'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--biology-text)', marginBottom: '0.5rem' }}>
                Expected Ratio:
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--biology-text)' }}>
                {currentCross.expectedRatio}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
              Selected Offspring:
            </h4>
            {selectedOffspring.length === 0 ? (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Click on squares in the Punnett square to select offspring
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOffspring.map(index => {
                  const offspring = performCross();
                  const child = offspring[index];
                  return (
                    <div key={index} style={{
                      padding: '0.5rem',
                      backgroundColor: 'var(--success-bg)',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: 'var(--success-text)'
                    }}>
                      {child.genotype} → {child.phenotype}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'var(--warning-bg)',
            borderRadius: '8px',
            border: '1px solid var(--warning-text)'
          }}>
            <h4 style={{ color: 'var(--warning-text)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              How to Play:
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--warning-text)', opacity: 0.9, lineHeight: 1.4 }}>
              • Study the parent genotypes<br/>
              • Examine the Punnett square<br/>
              • Predict the phenotype ratio<br/>
              • Click offspring squares to analyze<br/>
              • Try different cross types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticsLab;