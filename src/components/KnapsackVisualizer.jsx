import React, { useState, useEffect, useRef } from 'react';
import './KnapsackVisualizer.css';

const KnapsackVisualizer = () => {
  // States for knapsack problem
  const [items, setItems] = useState([]);
  const [capacity, setCapacity] = useState(10);
  const [customInput, setCustomInput] = useState('');
  const [error, setError] = useState('');
  const [algorithm, setAlgorithm] = useState('dynamic'); // dynamic or greedy
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [allSteps, setAllSteps] = useState([]);
  const [stepHistory, setStepHistory] = useState([]); // Store history of displayed steps
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [dpTable, setDpTable] = useState([]);
  
  // Refs
  const animationRef = useRef(null);
  const stepHistoryRef = useRef(null); // Reference for steps history container to auto-scroll
  
  // Generate random items for the knapsack problem
  const generateRandomItems = () => {
    if (isRunning) return;
    
    const count = Math.floor(Math.random() * 5) + 5; // 5 to 10 items
    const newItems = [];
    
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: i + 1,
        value: Math.floor(Math.random() * 20) + 1, // 1 to 20 value
        weight: Math.floor(Math.random() * 5) + 1, // 1 to 5 weight
        color: `color-${(i % 10) + 1}`, // Cycle through 10 colors
      });
    }
    
    setItems(newItems);
    setIsComplete(false);
    resetVisualization();
  };
  
  // Parse custom input for items
  const parseCustomInput = () => {
    if (isRunning) return;
    
    try {
      const inputText = customInput.trim();
      if (!inputText) {
        setError('Please enter items in the format: value,weight;value,weight;...');
        return;
      }
      
      const itemPairs = inputText.split(';');
      const newItems = [];
      
      for (let i = 0; i < itemPairs.length; i++) {
        const [value, weight] = itemPairs[i].split(',').map(Number);
        
        if (isNaN(value) || isNaN(weight) || value <= 0 || weight <= 0) {
          setError('Invalid input. Each item should have a positive value and weight.');
          return;
        }
        
        newItems.push({
          id: i + 1,
          value,
          weight,
          color: `color-${(i % 10) + 1}`,
        });
      }
      
      setItems(newItems);
      setError('');
      setIsComplete(false);
      resetVisualization();
    } catch (err) {
      setError('Invalid input format. Please use the format: value,weight;value,weight;...');
    }
  };
  
  // Reset visualization states
  const resetVisualization = () => {
    setIsRunning(false);
    setIsComplete(false);
    setCurrentStep(0);
    setAllSteps([]);
    setStepHistory([]); // Reset step history
    setSelectedItems([]);
    setTotalValue(0);
    setTotalWeight(0);
    setDpTable([]);
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Dynamic Programming solution for 0/1 Knapsack
  const solveDynamicKnapsack = () => {
    if (items.length === 0) {
      setError('Please generate items or enter custom items first.');
      return;
    }
    
    resetVisualization();
    setIsRunning(true);
    
    const n = items.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    const steps = [];
    
    // Initialize steps for building the DP table
    steps.push({
      description: 'Initializing the dynamic programming table. dp[i][j] will represent the maximum value we can obtain using the first i items and a knapsack of capacity j.',
      dpTable: JSON.parse(JSON.stringify(dp)),
      currentCell: { i: 0, j: 0 },
      selectedItems: [],
      totalValue: 0,
      totalWeight: 0
    });
    
    // Fill the DP table
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j <= capacity; j++) {
        // Add a step for each cell calculation
        const currentItem = items[i - 1];
        
        if (currentItem.weight <= j) {
          // We have a choice: include the item or exclude it
          const includeValue = currentItem.value + dp[i - 1][j - currentItem.weight];
          const excludeValue = dp[i - 1][j];
          
          steps.push({
            description: `Considering item ${i} (value=${currentItem.value}, weight=${currentItem.weight}) for knapsack capacity ${j}.`,
            formula: `max(${dp[i - 1][j]}, ${currentItem.value} + dp[${i - 1}][${j - currentItem.weight}] = ${Math.max(excludeValue, includeValue)})`,
            dpTable: JSON.parse(JSON.stringify(dp)),
            currentCell: { i, j },
            currentItem: i - 1,
            comparing: [
              { row: i - 1, col: j },
              { row: i - 1, col: j - currentItem.weight }
            ],
            selectedItems: [],
            totalValue: 0,
            totalWeight: 0
          });
          
          dp[i][j] = Math.max(excludeValue, includeValue);
        } else {
          // Item is too heavy, can't include it
          steps.push({
            description: `Item ${i} (weight=${currentItem.weight}) is too heavy for the current capacity ${j}. Using the value from excluding this item.`,
            formula: `dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i - 1][j]}`,
            dpTable: JSON.parse(JSON.stringify(dp)),
            currentCell: { i, j },
            currentItem: i - 1,
            comparing: [{ row: i - 1, col: j }],
            selectedItems: [],
            totalValue: 0,
            totalWeight: 0
          });
          
          dp[i][j] = dp[i - 1][j];
        }
        
        // Update the DP table after the calculation
        dp[i][j] = currentItem.weight <= j
          ? Math.max(dp[i - 1][j], currentItem.value + dp[i - 1][j - currentItem.weight])
          : dp[i - 1][j];
      }
    }
    
    // Backtrack to find selected items
    let w = capacity;
    const selected = [];
    let totalVal = 0;
    let totalWt = 0;
    
    steps.push({
      description: 'Finding the selected items by backtracking through the DP table.',
      dpTable: JSON.parse(JSON.stringify(dp)),
      currentCell: { i: n, j: capacity },
      selectedItems: [],
      totalValue: 0,
      totalWeight: 0
    });
    
    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        // This item was included
        const itemIdx = i - 1;
        selected.push(itemIdx);
        totalVal += items[itemIdx].value;
        totalWt += items[itemIdx].weight;
        w -= items[itemIdx].weight;
        
        steps.push({
          description: `Item ${i} (value=${items[itemIdx].value}, weight=${items[itemIdx].weight}) is included in the optimal solution.`,
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentCell: { i, j: w + items[itemIdx].weight },
          selectedItems: [...selected],
          totalValue: totalVal,
          totalWeight: totalWt,
          backtracking: true
        });
      } else {
        steps.push({
          description: `Item ${i} is not included in the optimal solution.`,
          dpTable: JSON.parse(JSON.stringify(dp)),
          currentCell: { i, j: w },
          selectedItems: [...selected],
          totalValue: totalVal,
          totalWeight: totalWt,
          backtracking: true
        });
      }
    }
    
    // Add final result step
    steps.push({
      description: `Optimal solution found: Total value = ${totalVal}, Total weight = ${totalWt}`,
      dpTable: JSON.parse(JSON.stringify(dp)),
      selectedItems: [...selected],
      totalValue: totalVal,
      totalWeight: totalWt,
      isComplete: true
    });
    
    setDpTable(dp);
    setAllSteps(steps);
    startAnimation(steps);
  };
  
  // Greedy approach for fractional knapsack (not optimal for 0/1)
  const solveGreedyKnapsack = () => {
    if (items.length === 0) {
      setError('Please generate items or enter custom items first.');
      return;
    }
    
    resetVisualization();
    setIsRunning(true);
    
    const steps = [];
    const sortedItems = [...items]
      .map((item, idx) => ({ ...item, originalIndex: idx }))
      .sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
    
    steps.push({
      description: 'Greedy approach: Sort items by value-to-weight ratio (not optimal for 0/1 Knapsack but useful for comparison).',
      selectedItems: [],
      sortedItems: sortedItems.map(item => item.originalIndex),
      totalValue: 0,
      totalWeight: 0
    });
    
    let currentWeight = 0;
    let currentValue = 0;
    const selected = [];
    
    for (const item of sortedItems) {
      steps.push({
        description: `Considering item ${item.id} (value=${item.value}, weight=${item.weight}, ratio=${(item.value / item.weight).toFixed(2)}).`,
        currentItem: item.originalIndex,
        selectedItems: [...selected],
        totalValue: currentValue,
        totalWeight: currentWeight
      });
      
      if (currentWeight + item.weight <= capacity) {
        // Include the whole item
        selected.push(item.originalIndex);
        currentValue += item.value;
        currentWeight += item.weight;
        
        steps.push({
          description: `Added item ${item.id} completely. Current value: ${currentValue}, Current weight: ${currentWeight}`,
          currentItem: item.originalIndex,
          selectedItems: [...selected],
          totalValue: currentValue,
          totalWeight: currentWeight
        });
      }
    }
    
    // Add final result step
    steps.push({
      description: `Greedy solution found: Total value = ${currentValue}, Total weight = ${currentWeight} (Note: This may not be optimal for 0/1 Knapsack)`,
      selectedItems: [...selected],
      totalValue: currentValue,
      totalWeight: currentWeight,
      isComplete: true
    });
    
    setAllSteps(steps);
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
      if (step.selectedItems) setSelectedItems(step.selectedItems);
      if (step.totalValue !== undefined) setTotalValue(step.totalValue);
      if (step.totalWeight !== undefined) setTotalWeight(step.totalWeight);
      
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
      if (step.selectedItems) setSelectedItems(step.selectedItems);
      if (step.totalValue !== undefined) setTotalValue(step.totalValue);
      if (step.totalWeight !== undefined) setTotalWeight(step.totalWeight);
      
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
      if (step.selectedItems) setSelectedItems(step.selectedItems);
      if (step.totalValue !== undefined) setTotalValue(step.totalValue);
      if (step.totalWeight !== undefined) setTotalWeight(step.totalWeight);
      
      setIsComplete(false);
    }
  };
  
  // Handle algorithm change
  const handleAlgorithmChange = (algo) => {
    if (isRunning) return;
    setAlgorithm(algo);
    resetVisualization();
  };
  
  // Scroll to bottom of step history when new step is added
  useEffect(() => {
    if (stepHistoryRef.current) {
      stepHistoryRef.current.scrollTop = stepHistoryRef.current.scrollHeight;
    }
  }, [stepHistory]);
  
  // Initialize with some random items when component mounts
  useEffect(() => {
    generateRandomItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);
  
  // Render the DP table
  const renderDPTable = () => {
    if (!dpTable.length || algorithm !== 'dynamic') return null;
    
    const currentCell = allSteps[currentStep]?.currentCell;
    const comparingCells = allSteps[currentStep]?.comparing || [];
    
    return (
      <div className="knapsack-table-container">
        <h3>Dynamic Programming Table</h3>
        
        <div className="knapsack-colors">
          <div className="color-item">
            <div className="color-box color-not-calculated"></div>
            <span>Not calculated yet</span>
          </div>
          <div className="color-item">
            <div className="color-box color-current"></div>
            <span>Current cell</span>
          </div>
          <div className="color-item">
            <div className="color-box color-calculated"></div>
            <span>Calculated</span>
          </div>
        </div>
        
        <table className="dp-table">
          <thead>
            <tr>
              <th>Item / Capacity</th>
              {Array(capacity + 1).fill().map((_, i) => (
                <th key={i}>{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <th>{i === 0 ? '0 (no items)' : `Item ${i}`}</th>
                {row.map((cell, j) => {
                  let cellClass = 'dp-cell';
                  
                  if (currentCell && currentCell.i === i && currentCell.j === j) {
                    cellClass += ' current';
                  } else if (
                    comparingCells.some(
                      comp => comp.row === i && comp.col === j
                    )
                  ) {
                    cellClass += ' comparing';
                  } else if (cell > 0) {
                    cellClass += ' calculated';
                  }
                  
                  return (
                    <td key={j} className={cellClass}>
                      {cell}
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
  
  return (
    <div className="knapsack-visualizer">
      <h1 className="knapsack-title">Knapsack Problem Visualizer</h1>
      <p className="knapsack-description">
        Visualize how the Knapsack algorithm works step by step. See how to maximize value while keeping weight under capacity.
      </p>
      
      <div className="knapsack-card">
        <div className="knapsack-tabs">
          <button
            className={`knapsack-tab ${algorithm === 'dynamic' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('dynamic')}
            disabled={isRunning}
          >
            Dynamic Programming (0/1)
          </button>
          <button
            className={`knapsack-tab ${algorithm === 'greedy' ? 'active' : ''}`}
            onClick={() => handleAlgorithmChange('greedy')}
            disabled={isRunning}
          >
            Greedy Approach (Comparison)
          </button>
        </div>
        
        <div className="knapsack-input-group">
          <label className="knapsack-label">Knapsack Capacity:</label>
          <input
            className="knapsack-input"
            type="number"
            min="1"
            max="50"
            value={capacity}
            onChange={(e) => setCapacity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            disabled={isRunning}
          />
        </div>
        
        <div className="knapsack-input-group">
          <label className="knapsack-label">Custom Items (format: value,weight;value,weight;...):</label>
          <textarea
            className="knapsack-textarea"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Example: 10,2;5,3;15,5;7,1;6,4"
            disabled={isRunning}
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="button-group">
          <button
            className="knapsack-button primary"
            onClick={generateRandomItems}
            disabled={isRunning}
          >
            Generate Random Items
          </button>
          <button
            className="knapsack-button"
            onClick={parseCustomInput}
            disabled={isRunning}
          >
            Use Custom Items
          </button>
          <button
            className="knapsack-button primary"
            onClick={algorithm === 'dynamic' ? solveDynamicKnapsack : solveGreedyKnapsack}
            disabled={isRunning || items.length === 0}
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
      
      <div className="knapsack-card fade-in">
        <h3>Items & Knapsack</h3>
        
        <div className="knapsack-visualization">
          <div className="items-container">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`knapsack-item ${item.color} ${
                  allSteps[currentStep]?.currentItem === idx ? 'selected' : ''
                } ${selectedItems.includes(idx) ? 'in-bag' : ''}`}
                style={{
                  transform: selectedItems.includes(idx)
                    ? 'scale(0.8)'
                    : 'scale(1)'
                }}
              >
                <div className="knapsack-item-value">{item.value}</div>
                <div className="knapsack-item-weight">{item.weight}</div>
              </div>
            ))}
          </div>
          
          <div className="knapsack-bag">
            <div className="knapsack-capacity">
              Capacity: {capacity} | Used: {totalWeight} ({((totalWeight / capacity) * 100).toFixed(0)}%)
            </div>
            <div
              className="knapsack-fullness"
              style={{ height: `${Math.min(100, (totalWeight / capacity) * 100)}%` }}
            ></div>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '5px', 
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1,
              position: 'relative'
            }}>
              {selectedItems.map((itemIdx) => (
                <div
                  key={itemIdx}
                  className={`knapsack-item ${items[itemIdx].color} in-bag`}
                >
                  <div className="knapsack-item-value">{items[itemIdx].value}</div>
                  <div className="knapsack-item-weight">{items[itemIdx].weight}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {allSteps.length > 0 && (
          <div className="step-details">
            <h3>Step {currentStep + 1} of {allSteps.length}</h3>
            
            <div className="steps-history-container" ref={stepHistoryRef}>
              {stepHistory.map((historyStep, idx) => (
                <div 
                  key={idx} 
                  className={`step-entry ${historyStep.step === currentStep ? 'current' : ''}`}
                >
                  <p><strong>Step {historyStep.step + 1}:</strong> {historyStep.description}</p>
                  {historyStep.formula && (
                    <p>Formula: <span className="formula">{historyStep.formula}</span></p>
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
            
            <div className="button-group">
              <button
                className="knapsack-button"
                onClick={stepBackward}
                disabled={isRunning || currentStep === 0}
              >
                Previous Step
              </button>
              
              {isRunning ? (
                <button className="knapsack-button" onClick={stopAnimation}>
                  Pause
                </button>
              ) : (
                <button
                  className="knapsack-button primary"
                  onClick={
                    isComplete
                      ? resetVisualization
                      : allSteps.length > 0
                      ? () => startAnimation(allSteps.slice(currentStep))
                      : algorithm === 'dynamic'
                      ? solveDynamicKnapsack
                      : solveGreedyKnapsack
                  }
                >
                  {isComplete ? 'Reset' : allSteps.length > 0 ? 'Continue' : 'Start'}
                </button>
              )}
              
              <button
                className="knapsack-button"
                onClick={stepForward}
                disabled={isRunning || currentStep === allSteps.length - 1}
              >
                Next Step
              </button>
            </div>
          </div>
        )}
        
        {renderDPTable()}
      </div>
    </div>
  );
};

export default KnapsackVisualizer;