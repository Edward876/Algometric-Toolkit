import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components - reusing styles from BubbleSortVisualizer with different color theme
const VisualizerContainer = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 1rem 0 1.5rem;
  background: linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* Standard syntax for Firefox */
  text-align: center;
  position: relative;
  line-height: 1.2;
  padding: 0.5rem;
  text-shadow: 0 0 30px rgba(142, 45, 226, 0.3);
  letter-spacing: -1px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 25%;
    width: 50%;
    height: 4px;
    background: linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(142, 45, 226, 0.5);
  }
  
  /* Add a subtle glow around the title */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
    background: radial-gradient(ellipse at center, rgba(142, 45, 226, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
    z-index: -1;
    border-radius: 50%;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #94a3b8;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ControlsWrapper = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  background: ${props => props.primary ? 'linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)' : '#334155'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  text-align: center;
`;

const Slider = styled.input`
  width: 100%;
`;

const VisualizationContainer = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(142, 45, 226, 0.05) 0%, rgba(74, 0, 224, 0.05) 100%);
    pointer-events: none;
  }
`;

const ArrayContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 300px;
  gap: 4px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const ArrayBar = styled(motion.div)`
  width: ${props => props.width}px;
  height: ${props => `${props.value * 3}px`};
  background: ${props => {
    if (props.pivot) return '#8B5CF6';
    if (props.comparing) return '#FBBF24';
    if (props.swapping) return '#EC4899';
    if (props.sorted) return '#34D399';
    return '#60A5FA';
  }};
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 4px;
  color: ${props => props.value * 3 < 50 ? '#fff' : '#1e293b'};
  font-weight: bold;
  font-size: 0.8rem;
  position: relative;
  box-shadow: ${props => (props.comparing || props.swapping || props.pivot) ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none'};
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    bottom: 4px;
  }
`;

const ExplanationCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const StepsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #334155 #1e293b;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1e293b;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #334155;
    border-radius: 4px;
    
    &:hover {
      background: #475569;
    }
  }
`;

const StepCard = styled(motion.div)`
  background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)' : 'rgba(51, 65, 85, 0.8)'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border-radius: 8px;
  padding: 1rem;
  min-width: 200px;
  max-width: 200px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 10px 20px rgba(142, 45, 226, 0.2)' : 'none'};
  border: 1px solid ${props => props.active ? 'rgba(142, 45, 226, 0.5)' : 'rgba(255, 255, 255, 0.05)'};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.active ? 'white' : '#e2e8f0'};
    background: ${props => props.active ? 'linear-gradient(90deg, #8E2DE2 0%, #4A00E0 100%)' : 'rgba(51, 65, 85, 0.3)'};
  }
`;

const CodeBlock = styled.pre`
  background: rgba(15, 23, 42, 0.8);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const TabContent = styled(motion.div)`
  padding: 1rem 0;
`;

// Code implementation in multiple languages
const codeImplementations = {
  c: `#include <stdio.h>

// Function to swap elements
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Partition the array and return the partition index
int partition(int arr[], int low, int high) {
    // Select the rightmost element as pivot
    int pivot = arr[high];
    
    // Index of smaller element
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++;    // increment index of smaller element
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

// The main function that implements QuickSort
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        // pi is partitioning index
        int pi = partition(arr, low, high);
        
        // Separately sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Function to print the array
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    quickSort(arr, 0, n - 1);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>

// Function to swap elements
void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

// Partition the array and return the partition index
int partition(std::vector<int>& arr, int low, int high) {
    // Select the rightmost element as pivot
    int pivot = arr[high];
    
    // Index of smaller element
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        // If current element is smaller than the pivot
        if (arr[j] < pivot) {
            i++;    // increment index of smaller element
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return (i + 1);
}

// The main function that implements QuickSort
void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        // pi is partitioning index
        int pi = partition(arr, low, high);
        
        // Separately sort elements before and after partition
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Example usage
int main() {
    std::vector<int> arr = {10, 7, 8, 9, 1, 5};
    
    std::cout << "Original array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    quickSort(arr, 0, arr.size() - 1);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,

  java: `import java.util.Arrays;

public class QuickSort {
    // Function to swap elements
    static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    // Partition the array and return the partition index
    static int partition(int[] arr, int low, int high) {
        // Select the rightmost element as pivot
        int pivot = arr[high];
        
        // Index of smaller element
        int i = (low - 1);
        
        for (int j = low; j <= high - 1; j++) {
            // If current element is smaller than the pivot
            if (arr[j] < pivot) {
                i++;    // increment index of smaller element
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return (i + 1);
    }
    
    // The main function that implements QuickSort
    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // pi is partitioning index
            int pi = partition(arr, low, high);
            
            // Separately sort elements before and after partition
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        int[] arr = {10, 7, 8, 9, 1, 5};
        
        System.out.println("Original array: " + Arrays.toString(arr));
        
        quickSort(arr, 0, arr.length - 1);
        
        System.out.println("Sorted array: " + Arrays.toString(arr));
    }
}`,

  python: `def quick_sort(arr):
    # Wrapper function to call the recursive implementation
    quick_sort_recursive(arr, 0, len(arr) - 1)
    return arr

def quick_sort_recursive(arr, low, high):
    if low < high:
        # pi is partitioning index
        pi = partition(arr, low, high)
        
        # Separately sort elements before and after partition
        quick_sort_recursive(arr, low, pi - 1)
        quick_sort_recursive(arr, pi + 1, high)

def partition(arr, low, high):
    # Select the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element
    i = low - 1
    
    for j in range(low, high):
        # If current element is smaller than the pivot
        if arr[j] < pivot:
            i += 1  # increment index of smaller element
            arr[i], arr[j] = arr[j], arr[i]  # swap
    
    arr[i + 1], arr[high] = arr[high], arr[i + 1]  # place pivot in correct position
    return i + 1

# Example usage
if __name__ == "__main__":
    arr = [10, 7, 8, 9, 1, 5]
    
    print("Original array:", arr)
    
    quick_sort(arr)
    
    print("Sorted array:", arr)
`
};

// QuickSort algorithm with steps tracking
const quickSort = (inputArr) => {
  const arr = [...inputArr];
  const steps = [];
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    pivot: null,
    sorted: [],
    description: "Initial array state. We'll start the Quick Sort algorithm."
  });

  const sortedIndices = new Set();
  
  // Recursive function to perform quick sort and track steps
  const quickSortRecursive = (low, high) => {
    if (low >= high) {
      if (low === high) {
        sortedIndices.add(low);
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          pivot: null,
          sorted: [...sortedIndices],
          description: `Element at index ${low} is in its correct position.`
        });
      }
      return;
    }
    
    // Choose pivot (using the last element)
    const pivotIndex = high;
    const pivotValue = arr[pivotIndex];
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      pivot: pivotIndex,
      sorted: [...sortedIndices],
      description: `Choosing pivot value ${pivotValue} at index ${pivotIndex}.`
    });
    
    let i = low - 1;
    
    // Partition the array
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, pivotIndex],
        swapping: [],
        pivot: pivotIndex,
        sorted: [...sortedIndices],
        description: `Comparing element ${arr[j]} at index ${j} with pivot ${pivotValue}.`
      });
      
      if (arr[j] <= pivotValue) {
        i++;
        
        if (i !== j) {
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [i, j],
            pivot: pivotIndex,
            sorted: [...sortedIndices],
            description: `Swapping ${arr[i]} and ${arr[j]} because ${arr[j]} <= pivot ${pivotValue}.`
          });
          
          // Swap arr[i] and arr[j]
          [arr[i], arr[j]] = [arr[j], arr[i]];
          
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            pivot: pivotIndex,
            sorted: [...sortedIndices],
            description: `Swapped elements.`
          });
        } else {
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [],
            pivot: pivotIndex,
            sorted: [...sortedIndices],
            description: `Element ${arr[j]} is already in the correct position.`
          });
        }
      }
    }
    
    // Place pivot in the correct position
    const newPivotIndex = i + 1;
    
    if (newPivotIndex !== high) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [newPivotIndex, high],
        pivot: high,
        sorted: [...sortedIndices],
        description: `Swapping pivot ${arr[high]} with element ${arr[newPivotIndex]} to place pivot in its correct position.`
      });
      
      // Swap arr[i+1] and arr[high]
      [arr[newPivotIndex], arr[high]] = [arr[high], arr[newPivotIndex]];
    }
    
    // Mark the pivot as sorted
    sortedIndices.add(newPivotIndex);
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      pivot: null,
      sorted: [...sortedIndices],
      description: `Pivot ${pivotValue} is now in its correct position at index ${newPivotIndex}.`
    });
    
    // Recursively sort subarrays
    quickSortRecursive(low, newPivotIndex - 1);
    quickSortRecursive(newPivotIndex + 1, high);
  };
  
  quickSortRecursive(0, arr.length - 1);
  
  // Final step showing the fully sorted array
  sortedIndices.clear();
  for (let i = 0; i < arr.length; i++) {
    sortedIndices.add(i);
  }
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    pivot: null,
    sorted: [...sortedIndices],
    description: "Array is now fully sorted!"
  });
  
  return steps;
};

function QuickSortVisualizer() {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(10);
  const [activeTab, setActiveTab] = useState('c');
  const sortingInterval = useRef(null);
  const stepsContainerRef = useRef(null);
  
  // Generate a new random array
  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 85) + 5);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  };
  
  // Initialize with a random array
  useEffect(() => {
    generateArray();
  }, [arraySize]);
  
  // Start the sorting animation
  const startSorting = () => {
    if (array.length === 0 || steps.length === 0) return;
    
    setSorting(true);
    setCurrentStep(0);
    
    sortingInterval.current = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= steps.length - 1) {
          clearInterval(sortingInterval.current);
          setSorting(false);
          return steps.length - 1;
        }
        return prevStep + 1;
      });
    }, speed);
  };
  
  // Stop the sorting animation
  const stopSorting = () => {
    clearInterval(sortingInterval.current);
    setSorting(false);
  };
  
  // Reset to the initial array
  const resetArray = () => {
    stopSorting();
    setCurrentStep(0);
  };

  // Go to previous step
  const previousStep = () => {
    stopSorting();
    setCurrentStep(prevStep => Math.max(0, prevStep - 1));
  };

  // Go to next step
  const nextStep = () => {
    stopSorting();
    setCurrentStep(prevStep => Math.min(steps.length - 1, prevStep + 1));
  };
  
  // Generate steps for quick sort
  const prepareSorting = () => {
    const sortSteps = quickSort(array);
    setSteps(sortSteps);
    setCurrentStep(0);
  };
  
  // Effect to prepare sorting steps when the array changes
  useEffect(() => {
    prepareSorting();
  }, [array]);
  
  // Handle step change manually
  const goToStep = (stepIndex) => {
    stopSorting();
    setCurrentStep(stepIndex);
  };
  
  // Effect to scroll the active step into view
  useEffect(() => {
    if (stepsContainerRef.current && steps.length > 0) {
      const stepCards = stepsContainerRef.current.querySelectorAll('div');
      if (stepCards.length > currentStep) {
        stepCards[currentStep].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStep, steps]);
  
  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (sortingInterval.current) {
        clearInterval(sortingInterval.current);
      }
    };
  }, []);
  
  // Calculate bar width based on array size
  const barWidth = Math.max(20, Math.min(80, 900 / arraySize));

  return (
    <VisualizerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Quick Sort Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of the Quick Sort algorithm with detailed animations and explanations
      </Description>
      
      <ControlsWrapper>
        <Controls>
          <Button 
            onClick={generateArray} 
            disabled={sorting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate New Array
          </Button>
          <Button 
            primary 
            onClick={startSorting} 
            disabled={sorting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Sorting
          </Button>
          <Button 
            onClick={stopSorting} 
            disabled={!sorting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pause
          </Button>
          <Button 
            onClick={resetArray} 
            disabled={sorting || currentStep === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </Button>
        </Controls>
        
        <Controls>
          <Button 
            onClick={previousStep} 
            disabled={sorting || currentStep === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous Step
          </Button>
          <Button 
            onClick={nextStep} 
            disabled={sorting || currentStep === steps.length - 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Step
          </Button>
        </Controls>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <SliderContainer>
            <Label htmlFor="array-size">Array Size: {arraySize}</Label>
            <Slider 
              id="array-size"
              type="range" 
              min="5" 
              max="20" 
              value={arraySize} 
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={sorting}
            />
          </SliderContainer>
          
          <SliderContainer>
            <Label htmlFor="speed">Animation Speed: {(1000/speed).toFixed(1)}x</Label>
            <Slider 
              id="speed"
              type="range" 
              min="50" 
              max="1000" 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
          </SliderContainer>
        </div>
      </ControlsWrapper>
      
      <VisualizationContainer>
        <ArrayContainer>
          <AnimatePresence>
            {steps.length > 0 && currentStep < steps.length && steps[currentStep].array.map((value, index) => (
              <ArrayBar
                key={index}
                width={barWidth}
                value={value}
                comparing={steps[currentStep].comparing?.includes(index)}
                swapping={steps[currentStep].swapping?.includes(index)}
                pivot={steps[currentStep].pivot === index}
                sorted={steps[currentStep].sorted?.includes(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  height: `${value * 3}px`,
                  transition: { duration: 0.3 } 
                }}
                layoutId={`bar-${index}`}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </AnimatePresence>
        </ArrayContainer>
        
        {steps.length > 0 && currentStep < steps.length && (
          <ExplanationCard>
            <h3>Current Step: {currentStep + 1}/{steps.length}</h3>
            <p>{steps[currentStep].description}</p>
          </ExplanationCard>
        )}
        
        <StepsContainer ref={stepsContainerRef}>
          {steps.map((step, index) => (
            <StepCard 
              key={index} 
              active={index === currentStep}
              onClick={() => goToStep(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h4>Step {index + 1}</h4>
              <p>{step.description.substring(0, 60)}...</p>
            </StepCard>
          ))}
        </StepsContainer>
      </VisualizationContainer>
      
      <ExplanationCard>
        <h2>How Quick Sort Works</h2>
        <p>Quick Sort is a divide-and-conquer algorithm that works by selecting a 'pivot' element and partitioning the array around the pivot so that elements smaller than the pivot are on the left, and elements greater than the pivot are on the right.</p>
        <h3>Time Complexity</h3>
        <p>- Best Case: O(n log n) - when the pivot chosen divides the array into two nearly equal halves</p>
        <p>- Average Case: O(n log n)</p>
        <p>- Worst Case: O(n²) - when the pivot chosen always results in unbalanced partitions</p>
        <h3>Space Complexity</h3>
        <p>- O(log n) - due to the recursive call stack</p>
      </ExplanationCard>
      
      <ExplanationCard>
        <h2>Code Implementation</h2>
        <TabsContainer>
          <Tab active={activeTab === 'c'} onClick={() => setActiveTab('c')}>C</Tab>
          <Tab active={activeTab === 'cpp'} onClick={() => setActiveTab('cpp')}>C++</Tab>
          <Tab active={activeTab === 'java'} onClick={() => setActiveTab('java')}>Java</Tab>
          <Tab active={activeTab === 'python'} onClick={() => setActiveTab('python')}>Python</Tab>
        </TabsContainer>
        
        <AnimatePresence mode="wait">
          <TabContent
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CodeBlock>{codeImplementations[activeTab]}</CodeBlock>
          </TabContent>
        </AnimatePresence>
      </ExplanationCard>
    </VisualizerContainer>
  );
}

export default QuickSortVisualizer;