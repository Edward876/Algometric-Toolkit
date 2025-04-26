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
    if (props.distributing) return '#EC4899';
    if (props.sorting) return '#FBBF24';
    if (props.gathering) return '#A78BFA';
    if (props.sorted) return '#00ffa3';
    return '#00c3ff';
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
    if (props.distributing) return '0 0 15px rgba(236, 72, 153, 0.5)';
    if (props.sorting) return '0 0 15px rgba(251, 191, 36, 0.5)';
    if (props.gathering) return '0 0 15px rgba(167, 139, 250, 0.5)';
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

const BucketsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
`;

const Bucket = styled(motion.div)`
  flex: 1;
  min-width: 120px;
  max-width: 180px;
  min-height: 150px;
  padding: 1rem;
  background: rgba(5, 10, 24, 0.8);
  border: 1px dashed ${props => props.active ? '#00c3ff' : 'rgba(0, 195, 255, 0.2)'};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: ${props => props.active ? '0 0 15px rgba(0, 195, 255, 0.3)' : 'none'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 195, 255, 0.03) 0%, rgba(0, 255, 163, 0.03) 100%);
    z-index: -1;
    pointer-events: none;
    border-radius: 8px;
  }
`;

const BucketTitle = styled.h4`
  text-align: center;
  color: #00c3ff;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 5px rgba(0, 195, 255, 0.5);
`;

const BucketContents = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

// Code implementations for Bucket Sort in multiple languages
const codeImplementations = {
  c: `#include <stdio.h>
#include <stdlib.h>
#include <math.h>

// Structure for a node in linked list
struct Node {
    float data;
    struct Node* next;
};

// Function to insert a node in sorted way in a sorted linked list
void sortedInsert(struct Node** head_ref, struct Node* new_node) {
    struct Node* current;
    
    // Special case for the head end
    if (*head_ref == NULL || (*head_ref)->data >= new_node->data) {
        new_node->next = *head_ref;
        *head_ref = new_node;
    } else {
        // Locate the node before the point of insertion
        current = *head_ref;
        while (current->next != NULL && current->next->data < new_node->data) {
            current = current->next;
        }
        new_node->next = current->next;
        current->next = new_node;
    }
}

// Function to sort a linked list using insertion sort
void insertionSort(struct Node** head_ref) {
    struct Node* sorted = NULL;
    struct Node* current = *head_ref;
    
    while (current != NULL) {
        struct Node* next = current->next;
        
        // Insert current into sorted linked list
        sortedInsert(&sorted, current);
        
        current = next;
    }
    
    // Update head to point to sorted linked list
    *head_ref = sorted;
}

// Function to create a new node
struct Node* newNode(float data) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->data = data;
    temp->next = NULL;
    return temp;
}

// Function to perform bucket sort
void bucketSort(float arr[], int n) {
    // Create n empty buckets
    struct Node** buckets = (struct Node**)malloc(n * sizeof(struct Node*));
    
    // Initialize all buckets as empty
    for (int i = 0; i < n; i++) {
        buckets[i] = NULL;
    }
    
    // Put array elements in different buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = n * arr[i]; // Mapping function
        struct Node* new_node = newNode(arr[i]);
        
        // Insert into the bucket
        new_node->next = buckets[bucketIndex];
        buckets[bucketIndex] = new_node;
    }
    
    // Sort each bucket and put back into the array
    int index = 0;
    for (int i = 0; i < n; i++) {
        // Sort bucket using insertion sort
        insertionSort(&buckets[i]);
        
        // Collect elements from bucket
        struct Node* current = buckets[i];
        while (current != NULL) {
            arr[index++] = current->data;
            struct Node* temp = current;
            current = current->next;
            free(temp);
        }
    }
    
    // Free memory used for buckets
    free(buckets);
}

// Function to print the array
void printArray(float arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("%f ", arr[i]);
    printf("\\n");
}

// Example usage
int main() {
    float arr[] = {0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: \\n");
    printArray(arr, n);
    
    bucketSort(arr, n);
    
    printf("Sorted array: \\n");
    printArray(arr, n);
    
    return 0;
}`,

  cpp: `#include <iostream>
#include <vector>
#include <algorithm>

// Function to perform bucket sort
void bucketSort(std::vector<float>& arr) {
    int n = arr.size();
    
    // Create n empty buckets
    std::vector<std::vector<float>> buckets(n);
    
    // Put array elements in different buckets
    for (int i = 0; i < n; i++) {
        int bucketIndex = n * arr[i]; // Mapping function
        buckets[bucketIndex].push_back(arr[i]);
    }
    
    // Sort individual buckets
    for (int i = 0; i < n; i++) {
        // Using built-in sort function
        std::sort(buckets[i].begin(), buckets[i].end());
    }
    
    // Concatenate all buckets into arr[]
    int index = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < buckets[i].size(); j++) {
            arr[index++] = buckets[i][j];
        }
    }
}

// Example usage
int main() {
    std::vector<float> arr = {0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51};
    
    std::cout << "Original array: ";
    for (float num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    bucketSort(arr);
    
    std::cout << "Sorted array: ";
    for (float num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,

  java: `import java.util.*;

public class BucketSort {
    // Function to perform bucket sort
    static void bucketSort(float[] arr) {
        int n = arr.length;
        
        // Create empty buckets
        @SuppressWarnings("unchecked")
        ArrayList<Float>[] buckets = new ArrayList[n];
        
        // Initialize empty buckets
        for (int i = 0; i < n; i++) {
            buckets[i] = new ArrayList<Float>();
        }
        
        // Put array elements in different buckets
        for (int i = 0; i < n; i++) {
            int bucketIndex = (int) (n * arr[i]); // Mapping function
            buckets[bucketIndex].add(arr[i]);
        }
        
        // Sort individual buckets
        for (int i = 0; i < n; i++) {
            Collections.sort(buckets[i]);
        }
        
        // Concatenate all buckets into arr[]
        int index = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < buckets[i].size(); j++) {
                arr[index++] = buckets[i].get(j);
            }
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        float[] arr = {0.42f, 0.32f, 0.33f, 0.52f, 0.37f, 0.47f, 0.51f};
        
        System.out.print("Original array: ");
        for (float num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        bucketSort(arr);
        
        System.out.print("Sorted array: ");
        for (float num : arr) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,

  python: `def bucket_sort(arr):
    # Find the number of buckets (usually the length of the array)
    n = len(arr)
    
    # Create n empty buckets
    buckets = [[] for _ in range(n)]
    
    # Put array elements in different buckets
    for i in range(n):
        # Calculate the bucket index for each element
        # This assumes all elements are in the range [0, 1)
        bucket_index = int(n * arr[i])
        buckets[bucket_index].append(arr[i])
    
    # Sort individual buckets
    for i in range(n):
        buckets[i].sort()
    
    # Concatenate all buckets into the original array
    index = 0
    for i in range(n):
        for j in range(len(buckets[i])):
            arr[index] = buckets[i][j]
            index += 1
    
    return arr

# Example usage
if __name__ == "__main__":
    arr = [0.42, 0.32, 0.33, 0.52, 0.37, 0.47, 0.51]
    
    print("Original array:", arr)
    
    bucket_sort(arr)
    
    print("Sorted array:", arr)
`
};

// Bucket sort algorithm with steps tracking
const bucketSort = (inputArr) => {
  // Work with a normalized copy of the array to make visualization clearer
  const arr = [...inputArr];
  const steps = [];
  const n = arr.length;
  
  // Normalize array values to 0-1 range for bucket assignment
  const minValue = Math.min(...arr);
  const maxValue = Math.max(...arr);
  const normalizedArr = arr.map(val => (val - minValue) / (maxValue - minValue || 1));
  
  steps.push({
    array: [...arr],
    normalized: [...normalizedArr],
    buckets: Array(n).fill().map(() => []),
    distributing: [],
    sorting: [],
    gathering: [],
    sorted: [],
    description: "Initial array state. We'll normalize values to [0,1] range for bucket distribution."
  });

  // Create n empty buckets
  const buckets = Array(n).fill().map(() => []);
  
  steps.push({
    array: [...arr],
    normalized: [...normalizedArr],
    buckets: [...buckets.map(bucket => [...bucket])],
    distributing: [],
    sorting: [],
    gathering: [],
    sorted: [],
    description: `Created ${n} empty buckets for sorting.`
  });

  // Put array elements in different buckets
  for (let i = 0; i < n; i++) {
    // Calculate bucket index - values should be between 0 and n-1
    const normalizedValue = normalizedArr[i];
    const bucketIndex = Math.min(Math.floor(n * normalizedValue), n - 1);
    
    steps.push({
      array: [...arr],
      normalized: [...normalizedArr],
      buckets: [...buckets.map(bucket => [...bucket])],
      distributing: [i],
      sorting: [],
      gathering: [],
      sorted: [],
      description: `Distributing element ${arr[i]} (normalized: ${normalizedValue.toFixed(2)}) to bucket ${bucketIndex}.`
    });
    
    buckets[bucketIndex].push({
      originalValue: arr[i],
      normalizedValue: normalizedValue,
      originalIndex: i
    });
    
    steps.push({
      array: [...arr],
      normalized: [...normalizedArr],
      buckets: [...buckets.map(bucket => [...bucket])],
      distributing: [],
      sorting: [],
      gathering: [],
      sorted: [],
      description: `Added element ${arr[i]} to bucket ${bucketIndex}.`
    });
  }
  
  // Sort individual buckets
  for (let i = 0; i < n; i++) {
    if (buckets[i].length > 0) {
      steps.push({
        array: [...arr],
        normalized: [...normalizedArr],
        buckets: [...buckets.map(bucket => [...bucket])],
        distributing: [],
        sorting: buckets[i].map(item => item.originalIndex),
        gathering: [],
        sorted: [],
        description: `Sorting bucket ${i} with ${buckets[i].length} elements using insertion sort.`
      });
      
      // Use insertion sort for each bucket
      buckets[i].sort((a, b) => a.originalValue - b.originalValue);
      
      steps.push({
        array: [...arr],
        normalized: [...normalizedArr],
        buckets: [...buckets.map(bucket => [...bucket])],
        distributing: [],
        sorting: [],
        gathering: [],
        sorted: [],
        description: `Bucket ${i} is now sorted.`
      });
    }
  }
  
  // Concatenate all buckets into the original array
  let index = 0;
  const sortedIndices = [];
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      steps.push({
        array: [...arr],
        normalized: [...normalizedArr],
        buckets: [...buckets.map(bucket => [...bucket])],
        distributing: [],
        sorting: [],
        gathering: [buckets[i][j].originalIndex],
        sorted: [...sortedIndices],
        description: `Gathering element ${buckets[i][j].originalValue} from bucket ${i} and placing it at position ${index} in the final array.`
      });
      
      arr[index] = buckets[i][j].originalValue;
      sortedIndices.push(index);
      
      steps.push({
        array: [...arr],
        normalized: [...normalizedArr],
        buckets: [...buckets.map(bucket => [...bucket])],
        distributing: [],
        sorting: [],
        gathering: [],
        sorted: [...sortedIndices],
        description: `Element ${arr[index]} is now in its correct position at index ${index}.`
      });
      
      index++;
    }
  }
  
  // Final state
  steps.push({
    array: [...arr],
    normalized: [...normalizedArr],
    buckets: [...buckets.map(bucket => [...bucket])],
    distributing: [],
    sorting: [],
    gathering: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: "Array is now fully sorted!"
  });
  
  return steps;
};

function BucketSortVisualizer() {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sorting, setSorting] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(8);
  const [activeTab, setActiveTab] = useState('c');
  const sortingInterval = useRef(null);
  const stepsContainerRef = useRef(null);
  
  // Generate a new random array with values between 1-100
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
  
  // Generate steps for bucket sort
  const prepareSorting = () => {
    const sortSteps = bucketSort(array);
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
      <Title>Bucket Sort Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of the Bucket Sort algorithm with detailed animations and explanations
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
              min="4" 
              max="12" 
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
                distributing={steps[currentStep].distributing?.includes(index)}
                sorting={steps[currentStep].sorting?.includes(index)}
                gathering={steps[currentStep].gathering?.includes(index)}
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
        
        {steps.length > 0 && currentStep < steps.length && (
          <BucketsContainer>
            {steps[currentStep].buckets.map((bucket, bucketIndex) => (
              <Bucket 
                key={bucketIndex}
                active={bucket.length > 0}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BucketTitle>Bucket {bucketIndex}</BucketTitle>
                <BucketContents>
                  {bucket.map((item, itemIndex) => (
                    <ArrayBar
                      key={`bucket-${bucketIndex}-item-${itemIndex}`}
                      width={barWidth * 0.8}
                      value={item.originalValue}
                      distributing={false}
                      sorting={steps[currentStep].sorting?.includes(item.originalIndex)}
                      gathering={steps[currentStep].gathering?.includes(item.originalIndex)}
                      sorted={false}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: 0.3, delay: itemIndex * 0.05 } 
                      }}
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
                </BucketContents>
              </Bucket>
            ))}
          </BucketsContainer>
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
        <h2>How Bucket Sort Works</h2>
        <p>Bucket Sort is a distribution-based sorting algorithm that works by distributing elements into a number of buckets, each of which is then sorted individually. It's particularly efficient when the input is uniformly distributed over a range.</p>
        
        <h3>Process</h3>
        <p>1. Create n empty buckets (or lists)</p>
        <p>2. Distribute the n elements into the buckets based on their values</p>
        <p>3. Sort the individual buckets (typically using another sorting algorithm)</p>
        <p>4. Concatenate the sorted buckets to get the final sorted array</p>
        
        <h3>Time Complexity</h3>
        <p>- Best Case: O(n) - when the data is uniformly distributed</p>
        <p>- Average Case: O(n + n²/k + k) where k is the number of buckets</p>
        <p>- Worst Case: O(n²) - when all elements are placed in a single bucket</p>
        
        <h3>Space Complexity</h3>
        <p>- O(n + k) - where n is the number of elements and k is the number of buckets</p>
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

export default BucketSortVisualizer;