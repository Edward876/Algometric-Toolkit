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
  height: ${props => `${props.height}px`};
  background: ${props => {
    if (props.current) return '#FBBF24';
    if (props.bucket) return '#EC4899';
    if (props.comparing) return '#A78BFA';
    if (props.sorted) return '#00ffa3';
    return '#00c3ff';
  }};
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 4px;
  color: ${props => props.height < 50 ? '#fff' : '#1e293b'};
  font-weight: bold;
  font-size: 0.8rem;
  position: relative;
  box-shadow: ${props => {
    if (props.current) return '0 0 15px rgba(251, 191, 36, 0.5)';
    if (props.bucket) return '0 0 15px rgba(236, 72, 153, 0.5)';
    if (props.comparing) return '0 0 15px rgba(167, 139, 250, 0.5)';
    if (props.sorted) return '0 0 15px rgba(0, 255, 163, 0.5)';
    return '0 0 15px rgba(0, 195, 255, 0.3)';
  }};
`;

const BarValue = styled.div`
  position: absolute;
  bottom: 4px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.height < 50 ? '#fff' : '#1e293b'};
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
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

const BucketsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
`;

const BucketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
`;

const BucketLabel = styled.div`
  font-family: 'Share Tech Mono', monospace;
  color: #00c3ff;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Bucket = styled.div`
  background: rgba(5, 10, 24, 0.8);
  border: 1px solid rgba(0, 195, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 120px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.15) inset;
`;

const BucketItem = styled(motion.div)`
  background: ${props => props.current ? '#FBBF24' : '#00c3ff'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 10px ${props => props.current ? 'rgba(251, 191, 36, 0.5)' : 'rgba(0, 195, 255, 0.3)'};
  font-family: 'Share Tech Mono', monospace;
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

// Code implementation in multiple languages
const codeImplementations = {
  c: `#include <stdio.h>

// Function to get the maximum value in arr[]
int getMax(int arr[], int n) {
    int mx = arr[0];
    for (int i = 1; i < n; i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

// A function to do counting sort of arr[] according to
// the digit represented by exp
void countSort(int arr[], int n, int exp) {
    int output[n]; // output array
    int i, count[10] = {0};
    
    // Store count of occurrences in count[]
    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    
    // Change count[i] so that count[i] now contains actual
    // position of this digit in output[]
    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    // Build the output array
    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy the output array to arr[]
    for (i = 0; i < n; i++)
        arr[i] = output[i];
}

// The main function to that sorts arr[] of size n using
// Radix Sort
void radixSort(int arr[], int n) {
    // Find the maximum number to know the number of digits
    int m = getMax(arr, n);
    
    // Do counting sort for every digit
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}

// Function to print the array
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++)
        printf("%d ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    int arr[] = {170, 45, 75, 90, 802, 24, 2, 66};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    radixSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>
using namespace std;

// Function to get the maximum value in arr[]
int getMax(vector<int>& arr) {
    int mx = arr[0];
    for (size_t i = 1; i < arr.size(); i++)
        if (arr[i] > mx)
            mx = arr[i];
    return mx;
}

// A function to do counting sort of arr[] according to
// the digit represented by exp
void countSort(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    vector<int> count(10, 0);
    
    // Store count of occurrences in count[]
    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;
    
    // Change count[i] so that count[i] now contains actual
    // position of this digit in output[]
    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];
    
    // Build the output array
    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }
    
    // Copy the output array to arr[]
    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

// The main function to that sorts arr[] using Radix Sort
void radixSort(vector<int>& arr) {
    // Find the maximum number to know the number of digits
    int m = getMax(arr);
    
    // Do counting sort for every digit
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, exp);
}

// Example usage
int main() {
    vector<int> arr = {170, 45, 75, 90, 802, 24, 2, 66};
    
    cout << "Original array: ";
    for (int num : arr)
        cout << num << " ";
    cout << endl;
    
    radixSort(arr);
    
    cout << "Sorted array: ";
    for (int num : arr)
        cout << num << " ";
    cout << endl;
    
    return 0;
}`,

  java: `import java.util.Arrays;

public class RadixSort {
    // Function to get the maximum value in arr[]
    static int getMax(int arr[]) {
        int mx = arr[0];
        for (int i = 1; i < arr.length; i++)
            if (arr[i] > mx)
                mx = arr[i];
        return mx;
    }

    // A function to do counting sort of arr[] according to
    // the digit represented by exp
    static void countSort(int arr[], int exp) {
        int n = arr.length;
        int output[] = new int[n]; // output array
        int count[] = new int[10];
        Arrays.fill(count, 0);

        // Store count of occurrences in count[]
        for (int i = 0; i < n; i++)
            count[(arr[i] / exp) % 10]++;

        // Change count[i] so that count[i] now contains
        // actual position of this digit in output[]
        for (int i = 1; i < 10; i++)
            count[i] += count[i - 1];

        // Build the output array
        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }

        // Copy the output array to arr[]
        for (int i = 0; i < n; i++)
            arr[i] = output[i];
    }

    // The main function to that sorts arr[] of size n using
    // Radix Sort
    public static void radixSort(int arr[]) {
        // Find the maximum number to know number of digits
        int m = getMax(arr);

        // Do counting sort for every digit
        for (int exp = 1; m / exp > 0; exp *= 10)
            countSort(arr, exp);
    }

    // Example usage
    public static void main(String[] args) {
        int arr[] = {170, 45, 75, 90, 802, 24, 2, 66};

        System.out.println("Original array: " + Arrays.toString(arr));

        radixSort(arr);

        System.out.println("Sorted array: " + Arrays.toString(arr));
    }
}`,

  python: `def countingSort(arr, exp):
    n = len(arr)
    
    # The output array that will have sorted arr
    output = [0] * n
    
    # Initialize count array as 0
    count = [0] * 10
    
    # Store count of occurrences in count[]
    for i in range(n):
        index = arr[i] // exp
        count[index % 10] += 1
    
    # Change count[i] so that count[i] now contains actual
    # position of this digit in output[]
    for i in range(1, 10):
        count[i] += count[i - 1]
    
    # Build the output array
    i = n - 1
    while i >= 0:
        index = arr[i] // exp
        output[count[index % 10] - 1] = arr[i]
        count[index % 10] -= 1
        i -= 1
    
    # Copy the output array to arr[]
    for i in range(n):
        arr[i] = output[i]

def radixSort(arr):
    # Find the maximum number to know number of digits
    max_val = max(arr)
    
    # Do counting sort for every digit
    exp = 1
    while max_val // exp > 0:
        countingSort(arr, exp)
        exp *= 10
    
    return arr

# Example usage
if __name__ == "__main__":
    arr = [170, 45, 75, 90, 802, 24, 2, 66]
    
    print("Original array:", arr)
    
    radixSort(arr)
    
    print("Sorted array:", arr)
`
};

// Function to get the maximum number in an array
const getMax = (arr) => {
  return Math.max(...arr);
};

// Radix sort algorithm with steps tracking
const radixSort = (inputArr) => {
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  
  steps.push({
    array: [...arr],
    current: [],
    processing: [],
    bucket: [],
    buckets: null,
    sorted: [],
    description: "Initial array state. We'll start sorting by the least significant digit (rightmost)."
  });

  // Find the maximum number to know number of digits
  const max = getMax(arr);
  
  // Create and initialize buckets
  const createBuckets = () => {
    const buckets = [];
    for (let i = 0; i < 10; i++) {
      buckets[i] = [];
    }
    return buckets;
  };
  
  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets = createBuckets();
    
    steps.push({
      array: [...arr],
      current: [],
      processing: [],
      bucket: [],
      buckets: null,
      sorted: [],
      description: `Starting to sort by the ${exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds"} place (dividing by ${exp}).`
    });
    
    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      
      steps.push({
        array: [...arr],
        current: [i],
        processing: [],
        bucket: [],
        buckets: JSON.parse(JSON.stringify(buckets)),
        sorted: [],
        description: `Getting the ${exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds"} digit of ${arr[i]} (${digit}).`
      });
      
      buckets[digit].push(arr[i]);
      
      steps.push({
        array: [...arr],
        current: [],
        processing: [],
        bucket: [i],
        buckets: JSON.parse(JSON.stringify(buckets)),
        sorted: [],
        description: `Placing ${arr[i]} into bucket ${digit}.`
      });
    }
    
    // Collect elements from buckets
    let index = 0;
    for (let digit = 0; digit < 10; digit++) {
      const bucket = buckets[digit];
      
      for (let j = 0; j < bucket.length; j++) {
        arr[index] = bucket[j];
        
        steps.push({
          array: [...arr],
          current: [],
          processing: [index],
          bucket: [],
          buckets: JSON.parse(JSON.stringify(buckets)),
          sorted: [],
          description: `Collecting ${bucket[j]} from bucket ${digit} and placing it at index ${index}.`
        });
        
        index++;
      }
    }
    
    // Mark all elements as partially sorted
    steps.push({
      array: [...arr],
      current: [],
      processing: [],
      bucket: [],
      buckets: JSON.parse(JSON.stringify(buckets)),
      sorted: [],
      description: `Completed sorting by the ${exp === 1 ? "ones" : exp === 10 ? "tens" : "hundreds"} place.`
    });
  }
  
  // Mark all elements as fully sorted
  steps.push({
    array: [...arr],
    current: [],
    processing: [],
    bucket: [],
    buckets: null,
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is now fully sorted!"
  });
  
  return steps;
};

function RadixSortVisualizer() {
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
    // Generate unique values to ensure different heights
    const tempSet = new Set();
    while (tempSet.size < arraySize) {
      tempSet.add(Math.floor(Math.random() * 900) + 10);
    }
    const newArray = Array.from(tempSet);
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
  
  // Generate steps for radix sort
  const prepareSorting = () => {
    const sortSteps = radixSort(array);
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
  
  // Calculate scaled height for visual representation
  const getScaledHeight = (value) => {
    // Scale height proportionally but with a minimum height
    return Math.max(30, Math.min(280, value * 0.3));
  };

  return (
    <VisualizerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Radix Sort Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of the Radix Sort algorithm with detailed animations and explanations
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
            {steps.length > 0 && currentStep < steps.length && steps[currentStep].array.map((value, index) => {
              const barHeight = getScaledHeight(value);
              return (
                <ArrayBar
                  key={index}
                  width={barWidth}
                  height={barHeight}
                  current={steps[currentStep].current.includes(index)}
                  processing={steps[currentStep].processing.includes(index)}
                  bucket={steps[currentStep].bucket.includes(index)}
                  sorted={steps[currentStep].sorted.includes(index)}
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    height: barHeight,
                    transition: { duration: 0.3 } 
                  }}
                  layoutId={`bar-${index}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <BarValue height={barHeight}>{value}</BarValue>
                </ArrayBar>
              );
            })}
          </AnimatePresence>
        </ArrayContainer>
        
        {steps.length > 0 && currentStep < steps.length && steps[currentStep].buckets && (
          <BucketsContainer>
            {Array.from({ length: 10 }).map((_, i) => (
              <BucketWrapper key={i}>
                <BucketLabel>Bucket {i}</BucketLabel>
                <Bucket>
                  {steps[currentStep].buckets[i].map((num, j) => (
                    <BucketItem 
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {num}
                    </BucketItem>
                  ))}
                </Bucket>
              </BucketWrapper>
            ))}
          </BucketsContainer>
        )}
        
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
        <h2>How Radix Sort Works</h2>
        <p>Radix Sort is a non-comparative integer sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.</p>
        <p>It processes the digits of the numbers from the least significant digit to the most significant digit (LSD radix sort).</p>
        <h3>Time Complexity</h3>
        <p>- Best Case: O(n*k) where k is the number of digits in the largest number</p>
        <p>- Average Case: O(n*k)</p>
        <p>- Worst Case: O(n*k)</p>
        <h3>Space Complexity</h3>
        <p>O(n+k) - Radix sort needs temporary arrays to store the sorted elements</p>
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
      
      <ParticlesComponent />
    </VisualizerContainer>
  );
}

export default RadixSortVisualizer;