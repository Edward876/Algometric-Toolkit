import React, { useState, useEffect, useRef } from 'react';
import './LCSVisualizer.css';

const LCSVisualizer = () => {
  // States for LCS problem
  const [string1, setString1] = useState('ALGORITHM');
  const [string2, setString2] = useState('RHYTHM');
  const [error, setError] = useState('');
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [allSteps, setAllSteps] = useState([]);
  const [stepHistory, setStepHistory] = useState([]);
  const [dpTable, setDpTable] = useState([]);
  const [lcsResult, setLcsResult] = useState('');
  const [backtrackArrows, setBacktrackArrows] = useState([]);
  
  // Refs
  const animationRef = useRef(null);
  const stepHistoryRef = useRef(null);
  const currentStepRef = useRef(currentStep);
  
  // Generate random strings for the LCS problem
  const generateRandomStrings = () => {
    if (isRunning) return;
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let str1 = '';
    let str2 = '';
    
    // Generate first string (length 5-10)
    const len1 = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < len1; i++) {
      str1 += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Generate second string (length 4-8)
    const len2 = Math.floor(Math.random() * 5) + 4;
    for (let i = 0; i < len2; i++) {
      str2 += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    setString1(str1);
    setString2(str2);
    setIsComplete(false);
    resetVisualization();
  };
  
  // Reset visualization states
  const resetVisualization = () => {
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStep(0);
    setAllSteps([]);
    setStepHistory([]);
    setDpTable([]);
    setLcsResult('');
    setBacktrackArrows([]);
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Solve LCS using dynamic programming
  const solveLCS = () => {
    if (!string1 || !string2) {
      setError('Please provide two strings to find LCS.');
      return;
    }
    
    resetVisualization();
    setIsRunning(true);
    setError('');
    
    const m = string1.length;
    const n = string2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    const steps = [];
    
    // Initialize steps for building the DP table
    steps.push({
      description: 'Initializing the dynamic programming table. dp[i][j] will represent the length of LCS of the first i characters of string1 and first j characters of string2.',
      dpTable: JSON.parse(JSON.stringify(dp)),
      currentCell: { i: 0, j: 0 },
      lcsCharacters: {}
    });
    
    // Fill the DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        // Add a step for each cell calculation
        const char1 = string1[i - 1];
        const char2 = string2[j - 1];
        
        if (char1 === char2) {
          // If characters match, add 1 to the diagonal value
          steps.push({
            description: `At position (${i}, ${j}): Characters match! '${char1}' is present in both strings.`,
            formula: `dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i-1][j-1] + 1}`,
            dpTable: JSON.parse(JSON.stringify(dp)),
            currentCell: { i, j },
            comparing: [{ row: i - 1, col: j - 1 }],
            matchingChar: char1,
            lcsCharacters: {}
          });
          
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          // If characters don't match, take maximum of the left or top cell
          const above = dp[i-1][j];
          const left = dp[i][j-1];
          
          steps.push({
            description: `At position (${i}, ${j}): Characters don't match. '${char1}' ≠ '${char2}'`,
            formula: `dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${above}, ${left}) = ${Math.max(above, left)}`,
            dpTable: JSON.parse(JSON.stringify(dp)),
            currentCell: { i, j },
            comparing: [
              { row: i - 1, col: j },
              { row: i, col: j - 1 }
            ],
            lcsCharacters: {}
          });
          
          dp[i][j] = Math.max(above, left);
        }
        
        // Update the DP table after the calculation
        if (char1 === char2) {
          dp[i][j] = dp[i-1][j-1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
      }
    }
    
    // Backtrack to find the LCS
    steps.push({
      description: 'Finding the Longest Common Subsequence by backtracking through the DP table.',
      dpTable: JSON.parse(JSON.stringify(dp)),
      currentCell: { i: m, j: n },
      lcsCharacters: {},
      backtrackArrows: []
    });
    
    let i = m;
    let j = n;
    let lcs = '';
    const lcsChars = {};
    const arrows = [];
    
    while (i > 0 && j > 0) {
      if (string1[i - 1] === string2[j - 1]) {
        // Current characters are part of LCS
        lcs = string1[i - 1] + lcs;
        lcsChars[`${i-1}-${j-1}`] = string1[i - 1];
        
        // Store the diagonal arrow
        const newArrow = { 
          from: { i, j },
          to: { i: i - 1, j: j - 1 },
          type: 'diagonal'
        };
        arrows.push(newArrow);
        
        steps.push({
          description: `At position (${i}, ${j}): Characters match! '${string1[i-1]}' is added to the LCS.`,
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentCell: { i, j },
          backtrackArrow: { i: i - 1, j: j - 1 },
          lcsCharacters: { ...lcsChars },
          backtrackArrows: [...arrows]
        });
        
        i--;
        j--;
      } else if (dp[i - 1][j] >= dp[i][j - 1]) {
        // Go up
        const newArrow = { 
          from: { i, j },
          to: { i, j: j - 1 },
          type: 'up'
        };
        arrows.push(newArrow);
        
        steps.push({
          description: `At position (${i}, ${j}): Moving up in the table.`,
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentCell: { i, j },
          backtrackArrow: { i: i - 1, j },
          lcsCharacters: { ...lcsChars },
          backtrackArrows: [...arrows]
        });
        
        i--;
      } else {
        // Go left
        const newArrow = { 
          from: { i, j },
          to: { i: i - 1, j },
          type: 'left'
        };
        arrows.push(newArrow);
        
        steps.push({
          description: `At position (${i}, ${j}): Moving left in the table.`,
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentCell: { i, j },
          backtrackArrow: { i, j: j - 1 },
          lcsCharacters: { ...lcsChars },
          backtrackArrows: [...arrows]
        });
        
        j--;
      }
    }
    
    // Add final result step
    steps.push({
      description: `Longest Common Subsequence found: "${lcs}"`,
      dpTable: JSON.parse(JSON.stringify(dp)),
      lcsCharacters: { ...lcsChars },
      lcsResult: lcs,
      backtrackArrows: [...arrows],
      isComplete: true
    });
    
    setDpTable(dp);
    setAllSteps(steps);
    setLcsResult(lcs);
    startAnimation(steps);
  };
  
  // Start animation for steps
  const startAnimation = (steps) => {
    if (allSteps.length > 0 && currentStep > 0 && !isComplete && !isRunning) {
      // Ask for confirmation when continuing from middle of animation
      if (!window.confirm("Continue to iterate?")) {
        return;
      }
    }
    
    let stepIndex = currentStep;
    
    const animate = () => {
      if (stepIndex >= steps.length) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      
      const step = steps[stepIndex];
      setCurrentStep(stepIndex);
      
      // Add step to history
      setStepHistory(prev => {
        // If we're continuing from a previous step, keep all steps up to current
        const newHistory = stepIndex === 0 ? [] : prev.slice(0, stepIndex);
        return [...newHistory, {
          step: stepIndex,
          description: step.description,
          formula: step.formula
        }];
      });
      
      if (step.dpTable) setDpTable(step.dpTable);
      if (step.lcsResult) setLcsResult(step.lcsResult);
      
      // Keep track of backtrack arrows
      if (step.backtrackArrows) {
        setBacktrackArrows(step.backtrackArrows);
      }
      
      if (step.isComplete) {
        setIsComplete(true);
        setIsRunning(false);
      } else {
        stepIndex++;
        animationRef.current = setTimeout(animate, 1000 - animationSpeed * 9);
      }
    };
    
    animate();
  };
  
  // Stop the animation
  const stopAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    setIsRunning(false);
  };
  
  // Play one step forward
  const stepForward = () => {
    if (currentStep < allSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const step = allSteps[nextStep];
      
      // Add step to history
      setStepHistory(prev => [...prev, {
        step: nextStep,
        description: step.description,
        formula: step.formula
      }]);
      
      if (step.dpTable) setDpTable(step.dpTable);
      if (step.lcsResult) setLcsResult(step.lcsResult);
      
      // Keep track of backtrack arrows
      if (step.backtrackArrows) {
        setBacktrackArrows(step.backtrackArrows);
      }
      
      if (step.isComplete) {
        setIsComplete(true);
      }
    }
  };
  
  // Play one step backward
  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      const step = allSteps[prevStep];
      if (step.dpTable) setDpTable(step.dpTable);
      
      // Update the backtrack arrows based on the previous step
      if (step.backtrackArrows) {
        setBacktrackArrows(step.backtrackArrows);
      } else {
        setBacktrackArrows([]);
      }
      
      setIsComplete(false);
    }
  };
  
  // Scroll to bottom of step history when new step is added
  useEffect(() => {
    if (stepHistoryRef.current) {
      stepHistoryRef.current.scrollTop = stepHistoryRef.current.scrollHeight;
    }
  }, [stepHistory]);
  
  // Initialize with some example strings when component mounts
  useEffect(() => {
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);
  
  // Render the DP table
  const renderDPTable = () => {
    if (!dpTable.length) return null;
    
    const currentCell = allSteps[currentStep]?.currentCell;
    const comparing = allSteps[currentStep]?.comparing || [];
    const lcsCharactersMap = allSteps[currentStep]?.lcsCharacters || {};
    
    // We don't need to rely just on the current step's backtrackArrow
    // Instead, we use the accumulated backtrackArrows from all previous steps
    
    return (
      <div className="lcs-table-container">
        <table className="dp-table">
          <thead>
            <tr>
              <th></th>
              <th></th>
              {string2.split('').map((char, j) => (
                <th key={j} className="char-cell">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th></th>
              {Array(string2.length + 1).fill(0).map((_, j) => (
                <td key={j} className={`dp-cell ${currentCell?.i === 0 && currentCell?.j === j ? 'current' : ''}`}>
                  {dpTable[0]?.[j] || 0}
                </td>
              ))}
            </tr>
            {string1.split('').map((char, i) => (
              <tr key={i}>
                <th className="char-cell">{char}</th>
                {Array(string2.length + 1).fill(0).map((_, j) => {
                  const isCurrentCell = currentCell?.i === i + 1 && currentCell?.j === j;
                  const isComparing = comparing.some(comp => comp.row === i + 1 && comp.col === j);
                  const isInLcs = lcsCharactersMap[`${i}-${j}`];
                  
                  // Check if this cell has a backtrack arrow from any of the accumulated arrows
                  let arrowClass = '';
                  let isPersistentArrow = false;
                  
                  // Check the current backtrackArrows state which contains all arrows from previous steps
                  backtrackArrows.forEach(arrow => {
                    // Check destination of the arrow
                    if (arrow.to.i === i + 1 && arrow.to.j === j) {
                      if (arrow.type === 'diagonal') {
                        arrowClass = 'arrow-diagonal';
                      } else if (arrow.type === 'up') {
                        arrowClass = 'arrow-up';
                      } else if (arrow.type === 'left') {
                        arrowClass = 'arrow-left';
                      }
                      isPersistentArrow = true;
                    }
                  });
                  
                  const cellClass = `dp-cell 
                    ${isCurrentCell ? 'current' : ''} 
                    ${isComparing ? 'comparing' : ''} 
                    ${isInLcs ? 'in-lcs' : ''} 
                    ${dpTable[i + 1]?.[j] !== undefined && !isCurrentCell && !isComparing ? 'calculated' : ''} 
                    ${arrowClass} 
                    ${isPersistentArrow ? 'persistent-arrow' : ''}`;
                  
                  return (
                    <td key={j} className={cellClass}>
                      {dpTable[i + 1]?.[j] !== undefined ? dpTable[i + 1][j] : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  const renderStringComparison = () => {
    const lcsCharacters = allSteps[currentStep]?.lcsCharacters || {};
    const matchingChar = allSteps[currentStep]?.matchingChar;
    const currentCell = allSteps[currentStep]?.currentCell;
    
    return (
      <div className="string-comparison">
        <div className="string-display">
          <h3>String 1:</h3>
          <div className="string-characters">
            {[...string1].map((char, index) => {
              const isInLCS = Object.entries(lcsCharacters).some(
                ([key]) => key.split('-')[0] === index.toString()
              );
              const isCurrentComparison = 
                currentCell && currentCell.i - 1 === index && matchingChar === char;
              
              return (
                <div 
                  key={index} 
                  className={`character ${isInLCS ? 'in-lcs' : ''} ${isCurrentComparison ? 'current-comparison' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="string-display">
          <h3>String 2:</h3>
          <div className="string-characters">
            {[...string2].map((char, index) => {
              const isInLCS = Object.entries(lcsCharacters).some(
                ([key]) => key.split('-')[1] === index.toString()
              );
              const isCurrentComparison = 
                currentCell && currentCell.j - 1 === index && matchingChar === char;
              
              return (
                <div 
                  key={index} 
                  className={`character ${isInLCS ? 'in-lcs' : ''} ${isCurrentComparison ? 'current-comparison' : ''}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>
        
        {lcsResult && (
          <div className="string-display result">
            <h3>LCS:</h3>
            <div className="string-characters">
              {[...lcsResult].map((char, index) => (
                <div key={index} className="character in-lcs">
                  {char}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="lcs-visualizer">
      <h1 className="lcs-title">Longest Common Subsequence</h1>
      <p className="lcs-description">
        Visualize how the Longest Common Subsequence (LCS) algorithm works step by step. Find the longest common subsequence between two strings.
      </p>
      
      <div className="lcs-card">
        <div className="lcs-input-group">
          <label className="lcs-label">String 1:</label>
          <input
            className="lcs-input"
            type="text"
            value={string1}
            onChange={(e) => setString1(e.target.value.toUpperCase())}
            disabled={isRunning}
          />
        </div>
        
        <div className="lcs-input-group">
          <label className="lcs-label">String 2:</label>
          <input
            className="lcs-input"
            type="text"
            value={string2}
            onChange={(e) => setString2(e.target.value.toUpperCase())}
            disabled={isRunning}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="button-group">
          <button
            className="lcs-button primary"
            onClick={generateRandomStrings}
            disabled={isRunning}
          >
            Generate Random Strings
          </button>
          <button
            className="lcs-button primary"
            onClick={solveLCS}
            disabled={isRunning || !string1 || !string2}
          >
            Start Visualization
          </button>
        </div>
        
        <div className="slider-container">
          <label>Animation Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            className="slider"
            disabled={isRunning}
          />
          <span>{animationSpeed}%</span>
        </div>
      </div>
      
      {allSteps.length > 0 && (
        <div className="lcs-card fade-in">
          <h3>LCS Visualization</h3>
          
          {renderStringComparison()}
          {renderDPTable()}
          
          <div className="step-details">
            <h3>Algorithm Steps</h3>
            <div className="button-group">
              <button
                className="lcs-button"
                onClick={stepBackward}
                disabled={isRunning || currentStep === 0}
              >
                Previous Step
              </button>
              {isRunning ? (
                <button
                  className="lcs-button"
                  onClick={stopAnimation}
                >
                  Stop Animation
                </button>
              ) : (
                <button
                  className="lcs-button"
                  onClick={() => startAnimation(allSteps)}
                  disabled={isComplete}
                >
                  {currentStep > 0 ? "Continue Animation" : "Start Animation"}
                </button>
              )}
              <button
                className="lcs-button"
                onClick={stepForward}
                disabled={isRunning || currentStep === allSteps.length - 1}
              >
                Next Step
              </button>
            </div>
            
            {/* Step History Scrollable Container */}
            <h3>Step History</h3>
            <div className="steps-history-container" ref={stepHistoryRef}>
              {stepHistory.map((step, index) => (
                <div 
                  key={index} 
                  className={`step-entry ${index === stepHistory.length - 1 ? 'current' : ''}`}
                >
                  <p><strong>Step {step.step + 1}:</strong> {step.description}</p>
                  {step.formula && (
                    <p>Formula: <span className="formula">{step.formula}</span></p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / (allSteps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <p>
              Step {currentStep + 1} of {allSteps.length}: {allSteps[currentStep]?.description}
            </p>
            {allSteps[currentStep]?.formula && (
              <p>Formula: <span className="formula">{allSteps[currentStep].formula}</span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LCSVisualizer;