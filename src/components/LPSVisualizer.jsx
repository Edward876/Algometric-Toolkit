import React, { useState, useEffect, useRef } from 'react';
import './LPSVisualizer.css';

const LPSVisualizer = () => {
  const [sequence, setSequence] = useState('character');
  const [dpTable, setDpTable] = useState([]);
  const [lps, setLPS] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [error, setError] = useState('');
  const stepsContainerRef = useRef(null);

  // Reset the LPS computation
  const resetLPS = () => {
    setDpTable([]);
    setLPS('');
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsRunning(false);
    setError('');
  };

  // Initialize the DP table
  const initializeDP = (seq) => {
    const n = seq.length;
    const table = Array(n).fill().map(() => Array(n).fill({
      value: 0,
      calculated: false,
      current: false,
      comparing: false,
      inLPS: false,
    }));

    // Fill diagonal with 1 (single characters are palindromes)
    for (let i = 0; i < n; i++) {
      table[i][i] = {
        value: 1,
        calculated: true,
        current: false,
        comparing: false,
        inLPS: false,
      };
    }

    return table;
  };

  // Generate LPS steps
  const generateLPSSteps = (seq) => {
    if (!seq || seq.trim() === '') {
      setError('Please enter a sequence');
      return;
    }
    resetLPS();
    setError('');

    const n = seq.length;
    let dp = initializeDP(seq);
    const stepsArray = [];

    // Initial step - explaining the problem
    stepsArray.push({
      message: `Finding the Longest Palindromic Subsequence (LPS) for "${seq}"`,
      tableState: JSON.parse(JSON.stringify(dp)),
      comparison: null,
      lpsResult: '',
      progress: 0,
    });

    // Initialize the diagonal with 1s (base case)
    stepsArray.push({
      message: `Initializing the DP table. Every single character is a palindrome, so diagonal values are set to 1.`,
      tableState: JSON.parse(JSON.stringify(dp)),
      comparison: null,
      lpsResult: '',
      progress: 5,
    });

    // Fill the dp table (bottom-up)
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i < n - len + 1; i++) {
        const j = i + len - 1;

        // Mark cells being compared
        dp[i][j] = { ...dp[i][j], comparing: true };
        
        // Add comparison step
        stepsArray.push({
          message: `Comparing characters at positions ${i} (${seq[i]}) and ${j} (${seq[j]})`,
          tableState: JSON.parse(JSON.stringify(dp)),
          comparison: { i, j },
          lpsResult: '',
          progress: 5 + (((len - 2) * n + i) / (n * n)) * 95,
        });

        // Update DP table and mark the current cell
        dp[i][j] = {
          ...dp[i][j],
          comparing: false,
          current: true,
        };

        if (seq[i] === seq[j]) {
          // If characters match, LPS = LPS of substring without these chars + 2
          const newValue = dp[i+1][j-1].value + 2;
          
          dp[i][j] = {
            ...dp[i][j],
            value: newValue,
            calculated: true,
            formula: `dp[${i+1}][${j-1}] + 2 = ${dp[i+1][j-1].value} + 2 = ${newValue}`,
          };
          
          stepsArray.push({
            message: `Characters ${seq[i]} and ${seq[j]} match. LPS length increases by 2. dp[${i}][${j}] = dp[${i+1}][${j-1}] + 2 = ${dp[i+1][j-1].value} + 2 = ${newValue}`,
            tableState: JSON.parse(JSON.stringify(dp)),
            comparison: { i, j },
            lpsResult: '',
            progress: 5 + (((len - 2) * n + i) / (n * n)) * 95,
          });
        } else {
          // If characters don't match, take max of (removing first char, removing last char)
          const newValue = Math.max(dp[i+1][j].value, dp[i][j-1].value);
          
          dp[i][j] = {
            ...dp[i][j],
            value: newValue,
            calculated: true,
            formula: `max(dp[${i+1}][${j}], dp[${i}][${j-1}]) = max(${dp[i+1][j].value}, ${dp[i][j-1].value}) = ${newValue}`,
          };
          
          stepsArray.push({
            message: `Characters ${seq[i]} and ${seq[j]} don't match. Taking maximum of dp[${i+1}][${j}] = ${dp[i+1][j].value} and dp[${i}][${j-1}] = ${dp[i][j-1].value}`,
            tableState: JSON.parse(JSON.stringify(dp)),
            comparison: { i, j },
            lpsResult: '',
            progress: 5 + (((len - 2) * n + i) / (n * n)) * 95,
          });
        }

        // Clean up current marker from cell
        dp[i][j] = { ...dp[i][j], current: false };
      }
    }

    // Trace back to find the actual LPS
    let i = 0;
    let j = n - 1;
    let lpsResult = '';
    const traceTable = JSON.parse(JSON.stringify(dp));

    const traceLPS = (i, j, table, seq) => {
      if (i > j) return '';
      
      if (i === j) {
        table[i][j].inLPS = true;
        return seq[i];
      }
      
      if (seq[i] === seq[j]) {
        table[i][j].inLPS = true;
        table[i+1][j-1].inLPS = true;
        return seq[i] + traceLPS(i+1, j-1, table, seq) + seq[j];
      }
      
      if (table[i+1][j].value > table[i][j-1].value) {
        return traceLPS(i+1, j, table, seq);
      } else {
        return traceLPS(i, j-1, table, seq);
      }
    };

    lpsResult = traceLPS(i, j, traceTable, seq);

    // Add final result step
    stepsArray.push({
      message: `Computation complete! The Longest Palindromic Subsequence is "${lpsResult}" with length ${lpsResult.length}`,
      tableState: traceTable,
      comparison: null,
      lpsResult: lpsResult,
      progress: 100,
    });

    setDpTable(traceTable);
    setLPS(lpsResult);
    setSteps(stepsArray);
    return stepsArray;
  };

  // Validate input sequence
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 15) {
      setError('For visualization purposes, please limit the sequence to 15 characters');
    } else {
      setError('');
    }
    setSequence(value);
    resetLPS();
  };

  // Compute the LPS and set up the steps
  const computeLPS = () => {
    if (!sequence || sequence.trim() === '') {
      setError('Please enter a sequence');
      return;
    }
    if (sequence.length > 15) {
      setError('For visualization purposes, please limit the sequence to 15 characters');
      return;
    }
    setError('');
    
    const stepsArray = generateLPSSteps(sequence);
    if (stepsArray) {
      setCurrentStepIndex(0);
    }
  };

  // Visualize the steps
  const visualizeSteps = () => {
    if (steps.length === 0) {
      computeLPS();
      return;
    }

    setIsRunning(true);
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const gotoStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  // Auto-play steps
  useEffect(() => {
    let timer;
    if (isRunning && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        nextStep();
      }, speed);
    } else if (currentStepIndex === steps.length - 1) {
      setIsRunning(false);
    }

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, steps.length, speed]);

  // Scroll to current step in history
  useEffect(() => {
    if (stepsContainerRef.current && currentStepIndex >= 0) {
      const stepElements = stepsContainerRef.current.getElementsByClassName('step-entry');
      if (stepElements[currentStepIndex]) {
        stepElements[currentStepIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [currentStepIndex]);

  // Render the table for visualization
  const renderTable = () => {
    if (!steps[currentStepIndex]) return null;

    const currentState = steps[currentStepIndex].tableState;
    const n = sequence.length;

    return (
      <table className="dp-table">
        <thead>
          <tr>
            <th></th>
            {sequence.split('').map((char, idx) => (
              <th key={idx} className="char-cell">{char}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentState.map((row, i) => (
            <tr key={i}>
              <th className="char-cell">{sequence[i]}</th>
              {row.map((cell, j) => {
                let cellClasses = 'dp-cell';
                if (cell.current) cellClasses += ' current';
                if (cell.comparing) cellClasses += ' comparing';
                if (cell.calculated) cellClasses += ' calculated';
                if (cell.inLPS) cellClasses += ' in-lps';
                
                return (
                  <td key={j} className={cellClasses}>
                    {cell.value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render string comparison and LPS result
  const renderStringComparison = () => {
    if (currentStepIndex < 0 || !steps[currentStepIndex]) return null;
    
    const currentStep = steps[currentStepIndex];
    const comparison = currentStep.comparison;
    const lpsResult = currentStep.lpsResult;

    return (
      <div className="string-comparison">
        <div className="string-display">
          <h3>String:</h3>
          <div className="string-characters">
            {sequence.split('').map((char, idx) => {
              let charClass = 'character';
              if (comparison && (idx === comparison.i || idx === comparison.j)) {
                charClass += ' current-comparison';
              }
              if (currentStep.tableState[0] && currentStep.tableState[0][sequence.length-1] && 
                  currentStep.tableState[0][sequence.length-1].inLPS) {
                // Check if this character is part of the LPS
                // This is a simplified check - for a real implementation you'd need to trace the LPS
                const lpsChars = new Set(lpsResult.split(''));
                if (lpsResult && lpsChars.has(char)) {
                  charClass += ' in-lps';
                }
              }
              return <div key={idx} className={charClass}>{char}</div>;
            })}
          </div>
        </div>
        
        {lpsResult && (
          <div className="string-display result">
            <h3>LPS:</h3>
            <div className="string-characters">
              {lpsResult.split('').map((char, idx) => (
                <div key={idx} className="character in-lps">{char}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render code examples section with multiple languages
  const renderCodeExamples = () => {
    const [activeTab, setActiveTab] = useState('cpp');

    const codeExamples = {
      c: `// C program to find Longest Palindromic Subsequence
#include <stdio.h>
#include <string.h>

// Returns length of LPS for str[0..n-1]
int lps(char *str) {
    int n = strlen(str);
    int i, j, cl;
    int L[n][n];  // Create a table to store results of subproblems
    
    // Strings of length 1 are palindromes of length 1
    for (i = 0; i < n; i++)
        L[i][i] = 1;
    
    // Build the table in bottom-up manner
    // cl is length of substring
    for (cl = 2; cl <= n; cl++) {
        for (i = 0; i < n-cl+1; i++) {
            j = i+cl-1; // ending index
            
            if (str[i] == str[j] && cl == 2)
                L[i][j] = 2;
            else if (str[i] == str[j])
                L[i][j] = L[i+1][j-1] + 2;
            else
                L[i][j] = (L[i+1][j] > L[i][j-1]) ? L[i+1][j] : L[i][j-1];
        }
    }
    
    return L[0][n-1];
}

// Driver program
int main() {
    char seq[] = "GEEKSFORGEEKS";
    int n = strlen(seq);
    printf("The length of the LPS is %d\\n", lps(seq));
    return 0;
}`,

      cpp: `// C++ program to find Longest Palindromic Subsequence
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// Returns length of LPS for string
int lps(string &s) {
    int n = s.length();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    // Strings of length 1 are palindromes of length 1
    for (int i = 0; i < n; i++)
        dp[i][i] = 1;
    
    // Build the table in bottom-up manner
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            
            if (s[i] == s[j]) {
                dp[i][j] = (len == 2) ? 2 : dp[i+1][j-1] + 2;
            } else {
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    
    return dp[0][n-1];
}

// Function to print the actual LPS
string printLPS(string &s) {
    int n = s.length();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    
    // Initialize for length 1
    for (int i = 0; i < n; i++)
        dp[i][i] = 1;
    
    // Fill dp table
    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            
            if (s[i] == s[j]) {
                dp[i][j] = (len == 2) ? 2 : dp[i+1][j-1] + 2;
            } else {
                dp[i][j] = max(dp[i+1][j], dp[i][j-1]);
            }
        }
    }
    
    // Reconstruct LPS
    string lps = "";
    int i = 0, j = n - 1;
    
    while (i <= j) {
        if (i == j) {
            lps += s[i]; // Add the middle character
            break;
        }
        
        if (s[i] == s[j]) {
            lps += s[i]; // Add character to result
            i++;
            j--;
        } else if (dp[i+1][j] > dp[i][j-1]) {
            i++;
        } else {
            j--;
        }
    }
    
    // Add reverse of first half to complete the palindrome
    string temp = lps;
    if (n % 2 == 0 || i != j)
        reverse(temp.begin(), temp.end());
    else
        reverse(temp.begin(), temp.end() - 1);
        
    lps += temp;
    
    return lps;
}

int main() {
    string s = "GEEKSFORGEEKS";
    cout << "The length of the LPS is " << lps(s) << endl;
    cout << "The LPS is " << printLPS(s) << endl;
    return 0;
}`,

      python: `# Python program to find Longest Palindromic Subsequence

def lps(sequence):
    n = len(sequence)
    
    # Create a table to store results of subproblems
    L = [[0 for x in range(n)] for x in range(n)]
    
    # Strings of length 1 are palindromes of length 1
    for i in range(n):
        L[i][i] = 1
    
    # Build the table in bottom-up fashion
    # cl is the length of substring
    for cl in range(2, n + 1):
        for i in range(n - cl + 1):
            j = i + cl - 1
            if sequence[i] == sequence[j] and cl == 2:
                L[i][j] = 2
            elif sequence[i] == sequence[j]:
                L[i][j] = L[i + 1][j - 1] + 2
            else:
                L[i][j] = max(L[i + 1][j], L[i][j - 1])
    
    return L[0][n - 1]

# Function to print the actual LPS
def print_lps(sequence):
    n = len(sequence)
    
    # Create DP table
    L = [[0 for x in range(n)] for x in range(n)]
    
    # Initialize for length 1
    for i in range(n):
        L[i][i] = 1
    
    # Fill DP table
    for cl in range(2, n + 1):
        for i in range(n - cl + 1):
            j = i + cl - 1
            if sequence[i] == sequence[j] and cl == 2:
                L[i][j] = 2
            elif sequence[i] == sequence[j]:
                L[i][j] = L[i + 1][j - 1] + 2
            else:
                L[i][j] = max(L[i + 1][j], L[i][j - 1])
    
    # Reconstruct the LPS
    result = []
    i, j = 0, n - 1
    
    while i <= j:
        if i == j:
            result.append(sequence[i])
            break
        if sequence[i] == sequence[j]:
            result.append(sequence[i])
            i += 1
            j -= 1
        elif L[i + 1][j] > L[i][j - 1]:
            i += 1
        else:
            j -= 1
    
    # Complete the palindrome
    lps_result = ''.join(result)
    reverse_part = result[:(n//2)]
    reverse_part.reverse()
    
    if n % 2 == 0 or i != j:
        lps_result += ''.join(reverse_part)
    else:
        lps_result += ''.join(reverse_part)
    
    return lps_result

# Driver code
if __name__ == "__main__":
    seq = "GEEKSFORGEEKS"
    print(f"The length of the LPS is {lps(seq)}")
    print(f"The LPS is {print_lps(seq)}")`,

      java: `// Java program to find Longest Palindromic Subsequence
class LPS {
    // Returns the length of the longest palindromic subsequence
    static int lps(String seq) {
        int n = seq.length();
        int[][] dp = new int[n][n];
        
        // Strings of length 1 are palindromes of length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }
        
        // Build the table in bottom-up manner
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                
                if (seq.charAt(i) == seq.charAt(j) && len == 2) {
                    dp[i][j] = 2;
                } else if (seq.charAt(i) == seq.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        
        return dp[0][n - 1];
    }
    
    // Function to print the actual LPS
    static String printLPS(String seq) {
        int n = seq.length();
        int[][] dp = new int[n][n];
        
        // Initialize for length 1
        for (int i = 0; i < n; i++) {
            dp[i][i] = 1;
        }
        
        // Fill dp table
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                
                if (seq.charAt(i) == seq.charAt(j) && len == 2) {
                    dp[i][j] = 2;
                } else if (seq.charAt(i) == seq.charAt(j)) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Reconstruct LPS
        StringBuilder lps = new StringBuilder();
        int i = 0, j = n - 1;
        
        while (i <= j) {
            if (i == j) {
                lps.append(seq.charAt(i)); // Add middle character
                break;
            }
            
            if (seq.charAt(i) == seq.charAt(j)) {
                lps.append(seq.charAt(i));
                i++;
                j--;
            } else if (dp[i + 1][j] > dp[i][j - 1]) {
                i++;
            } else {
                j--;
            }
        }
        
        // Complete the palindrome
        StringBuilder temp = new StringBuilder(lps);
        if (n % 2 == 0 || i != j) {
            return lps.toString() + temp.reverse().toString();
        } else {
            return lps.toString() + temp.reverse().deleteCharAt(0).toString();
        }
    }
    
    // Driver code
    public static void main(String[] args) {
        String seq = "GEEKSFORGEEKS";
        System.out.println("The length of the LPS is " + lps(seq));
        System.out.println("The LPS is " + printLPS(seq));
    }
}`
    };

    return (
      <div className="code-examples">
        <h2>Longest Palindromic Subsequence Implementations</h2>
        <div className="code-tabs">
          <div 
            className={`code-tab ${activeTab === 'cpp' ? 'active' : ''}`}
            onClick={() => setActiveTab('cpp')}
          >
            C++
          </div>
          <div 
            className={`code-tab ${activeTab === 'c' ? 'active' : ''}`}
            onClick={() => setActiveTab('c')}
          >
            C
          </div>
          <div 
            className={`code-tab ${activeTab === 'python' ? 'active' : ''}`}
            onClick={() => setActiveTab('python')}
          >
            Python
          </div>
          <div 
            className={`code-tab ${activeTab === 'java' ? 'active' : ''}`}
            onClick={() => setActiveTab('java')}
          >
            Java
          </div>
        </div>
        <div className={`code-snippet ${activeTab === 'c' ? 'active' : ''}`}>
          {codeExamples.c}
        </div>
        <div className={`code-snippet ${activeTab === 'cpp' ? 'active' : ''}`}>
          {codeExamples.cpp}
        </div>
        <div className={`code-snippet ${activeTab === 'python' ? 'active' : ''}`}>
          {codeExamples.python}
        </div>
        <div className={`code-snippet ${activeTab === 'java' ? 'active' : ''}`}>
          {codeExamples.java}
        </div>
      </div>
    );
  };

  return (
    <div className="lps-visualizer">
      <h1 className="lps-title" data-text="Longest Palindromic Subsequence Visualizer">
        Longest Palindromic Subsequence Visualizer
      </h1>
      <p className="lps-description">
        The Longest Palindromic Subsequence (LPS) is the longest subsequence of a string that is also a palindrome. 
        Unlike substrings, subsequences are not required to occupy consecutive positions in the original string.
      </p>

      <div className="lps-card">
        <div className="lps-input-group">
          <label className="lps-label">Enter Sequence:</label>
          <input
            className="lps-input"
            type="text"
            value={sequence}
            onChange={handleInputChange}
            placeholder="Enter your sequence"
            disabled={isRunning}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group">
          <button
            className="lps-button primary"
            onClick={visualizeSteps}
            disabled={isRunning || !sequence}>
            {steps.length === 0 ? "Compute & Visualize" : "Visualize"}
          </button>
          
          <button
            className="lps-button"
            onClick={computeLPS}
            disabled={isRunning || !sequence}>
            Compute LPS
          </button>

          <button
            className="lps-button"
            onClick={resetLPS}
            disabled={isRunning}>
            Reset
          </button>
        </div>

        <div className="slider-container">
          <label className="lps-label">Speed:</label>
          <input
            type="range"
            min="100"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
            className="slider"
            disabled={isRunning}
          />
          <span>{(2100 - speed) / 1000}x</span>
        </div>

        {steps.length > 0 && currentStepIndex >= 0 && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${steps[currentStepIndex].progress}%` }}
              ></div>
            </div>

            <div className="step-details">
              {steps[currentStepIndex].message}
            </div>

            <div className="button-group">
              <button
                className="lps-button"
                onClick={prevStep}
                disabled={currentStepIndex <= 0}>
                Previous Step
              </button>

              <button
                className="lps-button"
                onClick={() => setIsRunning(!isRunning)}
                disabled={currentStepIndex === steps.length - 1}>
                {isRunning ? "Pause" : "Play"}
              </button>

              <button
                className="lps-button"
                onClick={nextStep}
                disabled={currentStepIndex >= steps.length - 1}>
                Next Step
              </button>
            </div>

            <h3>Steps History:</h3>
            <div className="steps-history-container" ref={stepsContainerRef}>
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-entry ${idx === currentStepIndex ? 'current' : ''}`}
                  onClick={() => gotoStep(idx)}
                >
                  Step {idx + 1}: {step.message.substring(0, 60)}...
                </div>
              ))}
            </div>

            {renderStringComparison()}
            {renderTable()}
          </>
        )}
      </div>

      {renderCodeExamples()}
    </div>
  );
};

export default LPSVisualizer;