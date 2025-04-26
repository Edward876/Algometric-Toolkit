import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components with cyberpunk theme
const VisualizerContainer = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 50px 50px;
    background-image: 
      linear-gradient(rgba(0, 195, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 195, 255, 0.05) 1px, transparent 1px);
    z-index: -1;
    opacity: 0.3;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 1rem 0 1.5rem;
  background: linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  position: relative;
  line-height: 1.2;
  padding: 0.5rem;
  text-shadow: 0 0 30px rgba(0, 195, 255, 0.3);
  letter-spacing: -1px;
  font-family: 'Orbitron', sans-serif;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 25%;
    width: 50%;
    height: 4px;
    background: linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
    background: radial-gradient(ellipse at center, rgba(0, 195, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
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
  font-family: 'Share Tech Mono', monospace;
`;

const ControlsWrapper = styled.div`
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(90deg, transparent, rgba(0, 195, 255, 0.05), transparent) 0 0,
      linear-gradient(rgba(0, 195, 255, 0.05), transparent 3px) 0 0;
    background-repeat: no-repeat;
    background-size: 100% 1px, 1px 100%;
    z-index: -1;
    pointer-events: none;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  background: ${props => props.primary 
    ? 'linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%)' 
    : 'rgba(5, 10, 24, 0.8)'};
  border: 1px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(0, 195, 255, 0.3)'};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: ${props => props.primary 
    ? '0 0 20px rgba(0, 195, 255, 0.5)' 
    : 'none'};
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.primary 
      ? '0 0 30px rgba(0, 195, 255, 0.7)' 
      : '0 0 20px rgba(0, 195, 255, 0.3)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  font-family: 'Share Tech Mono', monospace;
`;

const Slider = styled.input`
  width: 100%;
  accent-color: #00c3ff;
  &::-webkit-slider-thumb {
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  }
`;

const VisualizationContainer = styled.div`
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(0, 195, 255, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 195, 255, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 195, 255, 0.05) 0%, rgba(0, 255, 163, 0.05) 100%);
    pointer-events: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(90deg, transparent, rgba(0, 195, 255, 0.05), transparent) 0 0,
      linear-gradient(rgba(0, 195, 255, 0.05), transparent 3px) 0 0,
      linear-gradient(270deg, transparent, rgba(0, 195, 255, 0.05), transparent) 0 100%,
      linear-gradient(transparent, rgba(0, 195, 255, 0.05) 3px) 100% 0;
    background-repeat: no-repeat;
    background-size: 100% 1px, 1px 100%, 100% 1px, 1px 100%;
    z-index: 1;
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
  position: relative;
  z-index: 2;
`;

const ArrayBar = styled(motion.div)`
  width: ${props => props.width}px;
  height: ${props => `${props.value * 3}px`};
  background: ${props => {
    if (props.heapifying) return '#EC4899'; // pink for heapify
    if (props.comparing) return '#FBBF24'; // yellow for comparing
    if (props.swapping) return '#A78BFA'; // purple for swapping
    if (props.sorted) return '#00ffa3'; // neon green for sorted
    return '#00c3ff'; // default cyan
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
  box-shadow: ${props => {
    if (props.heapifying) return '0 0 15px rgba(236, 72, 153, 0.5)';
    if (props.comparing) return '0 0 15px rgba(251, 191, 36, 0.5)';
    if (props.swapping) return '0 0 15px rgba(167, 139, 250, 0.5)';
    if (props.sorted) return '0 0 15px rgba(0, 255, 163, 0.5)';
    return '0 0 15px rgba(0, 195, 255, 0.3)';
  }};
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    bottom: 4px;
    font-family: 'Share Tech Mono', monospace;
  }
`;

const HeapTreeContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  position: relative;
  overflow: auto;
  min-height: 400px;
  padding-bottom: 2rem;
`;

const TreeNodeContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TreeNode = styled(motion.div)`
  width: 50px;
  height: 50px;
  margin: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 50%;
  font-family: 'Share Tech Mono', monospace;
  position: relative;
  z-index: 2;
  
  background: ${props => {
    if (props.heapifying) return '#EC4899';
    if (props.comparing) return '#FBBF24';
    if (props.swapping) return '#A78BFA';
    if (props.sorted) return '#00ffa3';
    return '#00c3ff';
  }};
  
  color: white;
  box-shadow: ${props => {
    if (props.heapifying) return '0 0 15px rgba(236, 72, 153, 0.5)';
    if (props.comparing) return '0 0 15px rgba(251, 191, 36, 0.5)';
    if (props.swapping) return '0 0 15px rgba(167, 139, 250, 0.5)';
    if (props.sorted) return '0 0 15px rgba(0, 255, 163, 0.5)';
    return '0 0 15px rgba(0, 195, 255, 0.3)';
  }};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 30%);
    z-index: 1;
    pointer-events: none;
  }
`;

const TreeEdge = styled.div`
  position: absolute;
  height: ${props => props.length}px;
  width: 2px;
  background: rgba(0, 195, 255, 0.5);
  transform: rotate(${props => props.angle}deg);
  transform-origin: top center;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  box-shadow: 0 0 8px rgba(0, 195, 255, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(0, 195, 255, 1);
    box-shadow: 0 0 8px rgba(0, 195, 255, 0.8);
  }
`;

const ExplanationCard = styled.div`
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.1);
  position: relative;
  z-index: 2;
  
  h2, h3 {
    color: #00c3ff;
    margin-bottom: 1rem;
    font-family: 'Orbitron', sans-serif;
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.3);
  }
  
  p {
    color: #94a3b8;
    line-height: 1.6;
    margin-bottom: 1rem;
    font-family: 'Share Tech Mono', monospace;
  }
`;

const StepsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
  margin-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #334155 #1e293b;
  position: relative;
  z-index: 2;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(5, 10, 24, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 195, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 195, 255, 0.5);
    }
  }
`;

const StepCard = styled(motion.div)`
  background: ${props => props.active ? 'linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%)' : 'rgba(5, 10, 24, 0.8)'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border-radius: 8px;
  padding: 1rem;
  min-width: 200px;
  max-width: 200px;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  box-shadow: ${props => props.active ? '0 10px 20px rgba(0, 195, 255, 0.3)' : 'none'};
  border: 1px solid ${props => props.active ? 'rgba(0, 195, 255, 0.5)' : 'rgba(0, 195, 255, 0.2)'};
  font-family: 'Share Tech Mono', monospace;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#94a3b8'};
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  font-family: 'Share Tech Mono', monospace;
  
  &:hover {
    color: ${props => props.active ? 'white' : '#00c3ff'};
    background: ${props => props.active ? 'linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%)' : 'rgba(0, 195, 255, 0.1)'};
    text-shadow: 0 0 8px rgba(0, 195, 255, 0.8);
  }
`;

const CodeBlock = styled.pre`
  background: rgba(5, 10, 24, 0.9);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Roboto Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #e2e8f0;
  border: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 195, 255, 0.1) inset;
`;

const TabContent = styled(motion.div)`
  padding: 1rem 0;
`;

// Add particles component for cyberpunk effect
const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
`;

const Particle = styled(motion.div)`
  position: absolute;
  background: ${props => props.color || 'rgba(0, 195, 255, 0.2)'};
  border-radius: 50%;
  box-shadow: 0 0 8px ${props => props.glow || 'rgba(0, 195, 255, 0.5)'};
`;

// Particles component with cyberpunk animation
const ParticlesComponent = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    color: Math.random() > 0.7 
      ? 'rgba(255, 0, 255, 0.15)' 
      : Math.random() > 0.5 
        ? 'rgba(0, 255, 163, 0.15)' 
        : 'rgba(0, 195, 255, 0.15)',
    glow: Math.random() > 0.7 
      ? 'rgba(255, 0, 255, 0.4)' 
      : Math.random() > 0.5 
        ? 'rgba(0, 255, 163, 0.4)' 
        : 'rgba(0, 195, 255, 0.4)'
  }));

  return (
    <Particles>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.size / 8
          }}
          color={particle.color}
          glow={particle.glow}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50
            ]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </Particles>
  );
};

// Code implementations for Heap Sort in multiple languages
const codeImplementations = {
  c: `#include <stdio.h>

// Function to swap two elements
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Function to heapify a subtree rooted with node i
// which is an index in arr[]. n is size of heap
void heapify(int arr[], int n, int i) {
    // Initialize largest as root
    int largest = i;
    
    // Left child
    int left = 2 * i + 1;
    
    // Right child
    int right = 2 * i + 2;
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Main function to do heap sort
void heapSort(int arr[], int n) {
    // Build max heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        swap(&arr[0], &arr[i]);
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
    }
}

// Function to print the array
void printArray(int arr[], int n) {
    for (int i = 0; i < n; ++i)
        printf("%d ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {12, 11, 13, 5, 6, 7};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    heapSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>

// Function to heapify a subtree rooted with node i
// which is an index in arr[]. n is size of heap
void heapify(std::vector<int>& arr, int n, int i) {
    // Initialize largest as root
    int largest = i;
    
    // Left child
    int left = 2 * i + 1;
    
    // Right child
    int right = 2 * i + 2;
    
    // If left child is larger than root
    if (left < n && arr[left] > arr[largest])
        largest = left;
    
    // If right child is larger than largest so far
    if (right < n && arr[right] > arr[largest])
        largest = right;
    
    // If largest is not root
    if (largest != i) {
        std::swap(arr[i], arr[largest]);
        
        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest);
    }
}

// Main function to do heap sort
void heapSort(std::vector<int>& arr) {
    int n = arr.size();
    
    // Build max heap (rearrange array)
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
    
    // Extract elements from heap one by one
    for (int i = n - 1; i > 0; i--) {
        // Move current root to end
        std::swap(arr[0], arr[i]);
        
        // Call max heapify on the reduced heap
        heapify(arr, i, 0);
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
    
    heapSort(arr);
    
    std::cout << "Sorted array: ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,

  java: `import java.util.Arrays;

public class HeapSort {
    // Function to heapify a subtree rooted with node i
    // which is an index in arr[]. n is size of heap
    static void heapify(int[] arr, int n, int i) {
        // Initialize largest as root
        int largest = i;
        
        // Left child
        int left = 2 * i + 1;
        
        // Right child
        int right = 2 * i + 2;
        
        // If left child is larger than root
        if (left < n && arr[left] > arr[largest])
            largest = left;
        
        // If right child is larger than largest so far
        if (right < n && arr[right] > arr[largest])
            largest = right;
        
        // If largest is not root
        if (largest != i) {
            // Swap
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            
            // Recursively heapify the affected sub-tree
            heapify(arr, n, largest);
        }
    }
    
    // Main function to do heap sort
    static void heapSort(int[] arr) {
        int n = arr.length;
        
        // Build max heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
        
        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            // Move current root to end
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            
            // Call max heapify on the reduced heap
            heapify(arr, i, 0);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        
        System.out.println("Original array: " + Arrays.toString(arr));
        
        heapSort(arr);
        
        System.out.println("Sorted array: " + Arrays.toString(arr));
    }
}`,

  python: `def heapify(arr, n, i):
    # Initialize largest as root
    largest = i
    
    # Left child
    left = 2 * i + 1
    
    # Right child
    right = 2 * i + 2
    
    # If left child is larger than root
    if left < n and arr[left] > arr[largest]:
        largest = left
    
    # If right child is larger than largest so far
    if right < n and arr[right] > arr[largest]:
        largest = right
    
    # If largest is not root
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]  # Swap
        
        # Recursively heapify the affected sub-tree
        heapify(arr, n, largest)

# Main function to do heap sort
def heap_sort(arr):
    n = len(arr)
    
    # Build a maxheap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    
    # Extract elements one by one
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]  # Swap
        heapify(arr, i, 0)
    
    return arr

# Example usage
if __name__ == "__main__":
    arr = [12, 11, 13, 5, 6, 7]
    
    print("Original array:", arr)
    
    heap_sort(arr)
    
    print("Sorted array:", arr)
`
};

// Heap sort algorithm with steps tracking
const heapSort = (inputArr) => {
  const arr = [...inputArr];
  const steps = [];
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    heapifying: [],
    root: null,
    sorted: [],
    description: "Initial array state. We'll start the Heap Sort algorithm."
  });

  const n = arr.length;
  
  // Step 1: Build max heap
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    heapifying: [],
    root: null,
    sorted: [],
    description: "First we need to build a max heap from the array."
  });
  
  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyWithSteps(arr, n, i, steps);
  }
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    heapifying: [],
    root: null,
    sorted: [],
    description: "Max heap has been built. Now we'll extract elements one by one."
  });
  
  // Step 2: Extract elements from heap one by one
  const sortedIndices = [];
  
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [0, i],
      heapifying: [],
      root: 0,
      sorted: [...sortedIndices],
      description: `Moving the root element (${arr[0]}) to position ${i}.`
    });
    
    // Swap
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    sortedIndices.push(i);
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      heapifying: [],
      root: null,
      sorted: [...sortedIndices],
      description: `Element ${arr[i]} is now in its correct position. We need to heapify the remaining heap.`
    });
    
    // Call max heapify on the reduced heap
    heapifyWithSteps(arr, i, 0, steps, sortedIndices);
  }
  
  // Mark the first element as sorted
  sortedIndices.push(0);
  
  // Final step
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    heapifying: [],
    root: null,
    sorted: sortedIndices,
    description: "Array is now fully sorted!"
  });
  
  return steps;
};

// Function to heapify a subtree and track steps
const heapifyWithSteps = (arr, n, i, steps, sortedIndices = []) => {
  let largest = i;  // Initialize largest as root
  const left = 2 * i + 1;  // Left child
  const right = 2 * i + 2;  // Right child
  
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    heapifying: [i],
    root: i,
    sorted: [...sortedIndices],
    description: `Heapifying subtree with root at index ${i} (value ${arr[i]}).`
  });
  
  // If left child is larger than root
  if (left < n) {
    steps.push({
      array: [...arr],
      comparing: [i, left],
      swapping: [],
      heapifying: [i],
      root: i,
      sorted: [...sortedIndices],
      description: `Comparing root ${arr[i]} with left child ${arr[left]}.`
    });
    
    if (arr[left] > arr[largest]) {
      largest = left;
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        heapifying: [i],
        root: largest,
        sorted: [...sortedIndices],
        description: `Left child ${arr[left]} is larger than root. New largest is at index ${largest}.`
      });
    }
  }
  
  // If right child is larger than largest so far
  if (right < n) {
    steps.push({
      array: [...arr],
      comparing: [largest, right],
      swapping: [],
      heapifying: [i],
      root: largest,
      sorted: [...sortedIndices],
      description: `Comparing current largest ${arr[largest]} with right child ${arr[right]}.`
    });
    
    if (arr[right] > arr[largest]) {
      largest = right;
      
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        heapifying: [i],
        root: largest,
        sorted: [...sortedIndices],
        description: `Right child ${arr[right]} is larger than current largest. New largest is at index ${largest}.`
      });
    }
  }
  
  // If largest is not root
  if (largest !== i) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [i, largest],
      heapifying: [i],
      root: null,
      sorted: [...sortedIndices],
      description: `Swapping ${arr[i]} and ${arr[largest]} to maintain heap property.`
    });
    
    // Swap
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      heapifying: [],
      root: null,
      sorted: [...sortedIndices],
      description: `After swap, need to recursively heapify the affected subtree.`
    });
    
    // Recursively heapify the affected sub-tree
    heapifyWithSteps(arr, n, largest, steps, sortedIndices);
  } else {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      heapifying: [],
      root: null,
      sorted: [...sortedIndices],
      description: `Heap property is satisfied for subtree with root at index ${i}.`
    });
  }
};

function HeapSortVisualizer() {
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
  
  // Generate steps for heap sort
  const prepareSorting = () => {
    const sortSteps = heapSort(array);
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
      <Title>Heap Sort Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of the Heap Sort algorithm with detailed animations and explanations
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
                heapifying={steps[currentStep].heapifying?.includes(index)}
                root={steps[currentStep].root === index}
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
        <h2>How Heap Sort Works</h2>
        <p>Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It divides the input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element and inserting it into the sorted region.</p>
        <h3>Process</h3>
        <p>1. Build a max heap from the input data</p>
        <p>2. Replace the root (maximum value) with the last item of the heap and reduce the size of the heap by 1</p>
        <p>3. Heapify the root element to ensure the heap property is maintained</p>
        <p>4. Repeat steps 2 and 3 while the size of the heap is greater than 1</p>
        <h3>Time Complexity</h3>
        <p>- Best Case: O(n log n)</p>
        <p>- Average Case: O(n log n)</p>
        <p>- Worst Case: O(n log n)</p>
        <h3>Space Complexity</h3>
        <p>- O(1) - Heap Sort is an in-place algorithm</p>
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

export default HeapSortVisualizer;