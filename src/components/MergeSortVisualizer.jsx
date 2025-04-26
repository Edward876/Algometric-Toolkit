import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components - reusing styles with a unique color theme for merge sort
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
  background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; /* Standard syntax for Firefox */
  text-align: center;
  position: relative;
  line-height: 1.2;
  padding: 0.5rem;
  text-shadow: 0 0 30px rgba(17, 153, 142, 0.3);
  letter-spacing: -1px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 25%;
    width: 50%;
    height: 4px;
    background: linear-gradient(90deg, #11998e 0%, #38ef7d 100%);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(17, 153, 142, 0.5);
  }
  
  /* Add a subtle glow around the title */
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
    background: radial-gradient(ellipse at center, rgba(17, 153, 142, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
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
  background: ${props => props.primary ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)' : '#334155'};
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
    background: linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%);
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
    if (props.merging) return '#14B8A6';
    if (props.comparing) return '#FBBF24';
    if (props.auxiliary) return '#8B5CF6';
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
  box-shadow: ${props => (props.comparing || props.merging) ? '0 0 15px rgba(20, 184, 166, 0.5)' : 'none'};
  
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
  background: ${props => props.active ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)' : 'rgba(51, 65, 85, 0.8)'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border-radius: 8px;
  padding: 1rem;
  min-width: 200px;
  max-width: 200px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 10px 20px rgba(17, 153, 142, 0.2)' : 'none'};
  border: 1px solid ${props => props.active ? 'rgba(17, 153, 142, 0.5)' : 'rgba(255, 255, 255, 0.05)'};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${props => props.active ? 'white' : '#e2e8f0'};
    background: ${props => props.active ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)' : 'rgba(51, 65, 85, 0.3)'};
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

// Code implementations for Merge Sort in multiple languages
const codeImplementations = {
  c: `#include <stdio.h>
#include <stdlib.h>

// Merge two subarrays of arr[]
// First subarray is arr[left..mid]
// Second subarray is arr[mid+1..right]
void merge(int arr[], int left, int mid, int right) {
    int i, j, k;
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    int* L = (int*)malloc(n1 * sizeof(int));
    int* R = (int*)malloc(n2 * sizeof(int));
    
    // Copy data to temporary arrays
    for (i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temporary arrays back into arr[left..right]
    i = 0; // Initial index of first subarray
    j = 0; // Initial index of second subarray
    k = left; // Initial index of merged subarray
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    // Free the allocated memory
    free(L);
    free(R);
}

// Main function to implement merge sort
void mergeSort(int arr[], int left, int right) {
    if (left < right) {
        // Same as (left+right)/2, but avoids overflow
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

// Function to print the array
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int arr_size = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, arr_size);
    
    mergeSort(arr, 0, arr_size - 1);
    
    printf("Sorted array: \\n");
    printArray(arr, arr_size);
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>

// Merge two subarrays of arr[]
// First subarray is arr[left..mid]
// Second subarray is arr[mid+1..right]
void merge(std::vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    // Create temporary arrays
    std::vector<int> L(n1), R(n2);
    
    // Copy data to temporary arrays
    for (int i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (int j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];
    
    // Merge the temporary arrays back into arr[left..right]
    int i = 0; // Initial index of first subarray
    int j = 0; // Initial index of second subarray
    int k = left; // Initial index of merged subarray
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

// Main function to implement merge sort
void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left < right) {
        // Same as (left+right)/2, but avoids overflow
        int mid = left + (right - left) / 2;
        
        // Sort first and second halves
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        
        // Merge the sorted halves
        merge(arr, left, mid, right);
    }
}

// Example usage
int main() {
    std::vector<int> arr = {12, 11, 13, 5, 6, 7};
    
    std::cout << "Original array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    mergeSort(arr, 0, arr.size() - 1);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,

  java: `import java.util.Arrays;

public class MergeSort {
    // Merge two subarrays of arr[]
    // First subarray is arr[left..mid]
    // Second subarray is arr[mid+1..right]
    static void merge(int[] arr, int left, int mid, int right) {
        // Find sizes of two subarrays to be merged
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        // Create temporary arrays
        int[] L = new int[n1];
        int[] R = new int[n2];
        
        // Copy data to temporary arrays
        for (int i = 0; i < n1; ++i)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; ++j)
            R[j] = arr[mid + 1 + j];
        
        // Merge the temporary arrays
        int i = 0, j = 0;
        int k = left;
        
        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        
        // Copy remaining elements of L[] if any
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }
        
        // Copy remaining elements of R[] if any
        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }
    }
    
    // Main function that sorts arr[left..right] using merge()
    static void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            // Find the middle point
            int mid = left + (right - left) / 2;
            
            // Sort first and second halves
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            
            // Merge the sorted halves
            merge(arr, left, mid, right);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        
        System.out.println("Original array: " + Arrays.toString(arr));
        
        mergeSort(arr, 0, arr.length - 1);
        
        System.out.println("Sorted array: " + Arrays.toString(arr));
    }
}`,

  python: `def merge_sort(arr):
    if len(arr) > 1:
        # Finding the middle of the array
        mid = len(arr) // 2
        
        # Dividing the array elements into 2 halves
        left_half = arr[:mid]
        right_half = arr[mid:]
        
        # Recursive call on each half
        merge_sort(left_half)
        merge_sort(right_half)
        
        # Merge the two halves
        merge(arr, left_half, right_half)
    
    return arr

def merge(arr, left_half, right_half):
    i = j = k = 0
    
    # Copy data to temporary arrays left_half[] and right_half[]
    while i < len(left_half) and j < len(right_half):
        if left_half[i] <= right_half[j]:
            arr[k] = left_half[i]
            i += 1
        else:
            arr[k] = right_half[j]
            j += 1
        k += 1
    
    # Check if any elements were left
    while i < len(left_half):
        arr[k] = left_half[i]
        i += 1
        k += 1
    
    while j < len(right_half):
        arr[k] = right_half[j]
        j += 1
        k += 1

# Example usage
if __name__ == "__main__":
    arr = [12, 11, 13, 5, 6, 7]
    
    print("Original array:", arr)
    
    merge_sort(arr)
    
    print("Sorted array:", arr)
`
};

// Merge sort algorithm with steps tracking
const mergeSort = (inputArr) => {
  const arr = [...inputArr];
  const steps = [];
  const auxiliaryArray = [...arr];
  
  steps.push({
    array: [...arr],
    auxiliary: [...auxiliaryArray],
    comparing: [],
    merging: [],
    sorted: [],
    description: "Initial array state. We'll start the Merge Sort algorithm."
  });

  const mergeSortHelper = (mainArray, startIdx, endIdx) => {
    // Base case: subarray has only one element or is empty
    if (startIdx >= endIdx) {
      if (startIdx === endIdx) {
        steps.push({
          array: [...mainArray],
          auxiliary: [...auxiliaryArray],
          comparing: [],
          merging: [],
          sorted: [startIdx],
          description: `Subarray of length 1 at index ${startIdx} is inherently sorted.`
        });
      }
      return;
    }
    
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    
    steps.push({
      array: [...mainArray],
      auxiliary: [...auxiliaryArray],
      comparing: [],
      merging: [],
      sorted: [],
      description: `Splitting array from index ${startIdx} to ${endIdx} at midpoint ${middleIdx}.`
    });
    
    // Recursively sort left half
    mergeSortHelper(mainArray, startIdx, middleIdx);
    
    // Recursively sort right half
    mergeSortHelper(mainArray, middleIdx + 1, endIdx);
    
    // Merge the two halves
    doMerge(mainArray, startIdx, middleIdx, endIdx);
  };
  
  const doMerge = (mainArray, startIdx, middleIdx, endIdx) => {
    steps.push({
      array: [...mainArray],
      auxiliary: [...auxiliaryArray],
      comparing: [],
      merging: Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i),
      sorted: [],
      description: `Merging subarrays from index ${startIdx} to ${middleIdx} and from ${middleIdx + 1} to ${endIdx}.`
    });
    
    // Copy main array into auxiliary array
    for (let i = startIdx; i <= endIdx; i++) {
      auxiliaryArray[i] = mainArray[i];
      steps.push({
        array: [...mainArray],
        auxiliary: [...auxiliaryArray],
        comparing: [],
        merging: [i],
        sorted: [],
        description: `Copying element at index ${i} (${mainArray[i]}) to auxiliary array.`
      });
    }
    
    let i = startIdx;
    let j = middleIdx + 1;
    let k = startIdx;
    
    // Merge back to main array
    while (i <= middleIdx && j <= endIdx) {
      steps.push({
        array: [...mainArray],
        auxiliary: [...auxiliaryArray],
        comparing: [i, j],
        merging: [],
        sorted: [],
        description: `Comparing elements at auxiliary indices ${i} (${auxiliaryArray[i]}) and ${j} (${auxiliaryArray[j]}).`
      });
      
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        steps.push({
          array: [...mainArray],
          auxiliary: [...auxiliaryArray],
          comparing: [],
          merging: [k],
          sorted: [],
          description: `Placing ${auxiliaryArray[i]} from left subarray into main array at index ${k}.`
        });
        
        mainArray[k] = auxiliaryArray[i];
        i++;
      } else {
        steps.push({
          array: [...mainArray],
          auxiliary: [...auxiliaryArray],
          comparing: [],
          merging: [k],
          sorted: [],
          description: `Placing ${auxiliaryArray[j]} from right subarray into main array at index ${k}.`
        });
        
        mainArray[k] = auxiliaryArray[j];
        j++;
      }
      
      k++;
    }
    
    // Copy remaining elements from left subarray
    while (i <= middleIdx) {
      steps.push({
        array: [...mainArray],
        auxiliary: [...auxiliaryArray],
        comparing: [],
        merging: [k],
        sorted: [],
        description: `Copying remaining element ${auxiliaryArray[i]} from left subarray to main array at index ${k}.`
      });
      
      mainArray[k] = auxiliaryArray[i];
      i++;
      k++;
    }
    
    // Copy remaining elements from right subarray
    while (j <= endIdx) {
      steps.push({
        array: [...mainArray],
        auxiliary: [...auxiliaryArray],
        comparing: [],
        merging: [k],
        sorted: [],
        description: `Copying remaining element ${auxiliaryArray[j]} from right subarray to main array at index ${k}.`
      });
      
      mainArray[k] = auxiliaryArray[j];
      j++;
      k++;
    }
    
    // Mark merged section as sorted
    const sortedIndices = Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i);
    
    steps.push({
      array: [...mainArray],
      auxiliary: [...auxiliaryArray],
      comparing: [],
      merging: [],
      sorted: sortedIndices,
      description: `Subarray from index ${startIdx} to ${endIdx} has been merged and sorted.`
    });
  };
  
  mergeSortHelper(arr, 0, arr.length - 1);
  
  // Add final step with the fully sorted array
  steps.push({
    array: [...arr],
    auxiliary: [...auxiliaryArray],
    comparing: [],
    merging: [],
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    description: "Array is now fully sorted!"
  });
  
  return steps;
};

function MergeSortVisualizer() {
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
  
  // Generate steps for merge sort
  const prepareSorting = () => {
    const sortSteps = mergeSort(array);
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
      <Title>Merge Sort Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of the Merge Sort algorithm with detailed animations and explanations
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
                merging={steps[currentStep].merging?.includes(index)}
                auxiliary={false}
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
        <h2>How Merge Sort Works</h2>
        <p>Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively sorts each half, and then merges the sorted halves. It is highly efficient for large datasets and is particularly useful for sorting linked lists.</p>
        <h3>Time Complexity</h3>
        <p>- Best Case: O(n log n)</p>
        <p>- Average Case: O(n log n)</p>
        <p>- Worst Case: O(n log n)</p>
        <h3>Space Complexity</h3>
        <p>- O(n) - Merge Sort requires additional space for the auxiliary array</p>
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

export default MergeSortVisualizer;