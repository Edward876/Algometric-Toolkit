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

const GraphContainer = styled.div`
  height: 500px;
  position: relative;
  margin-bottom: 2rem;
  z-index: 2;
`;

const Node = styled(motion.div)`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => {
    if (props.source) return '#00ffa3';
    if (props.target) return '#EC4899';
    if (props.current) return '#FBBF24';
    if (props.visited) return '#A78BFA';
    if (props.shortest) return '#00ffa3';
    return 'rgba(0, 195, 255, 0.8)';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: ${props => (props.source || props.target || props.current || props.visited || props.shortest) ? '#0b0f1a' : '#ffffff'};
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  z-index: 3;
  box-shadow: ${props => {
    if (props.source) return '0 0 20px rgba(0, 255, 163, 0.7)';
    if (props.target) return '0 0 20px rgba(236, 72, 153, 0.7)';
    if (props.current) return '0 0 20px rgba(251, 191, 36, 0.7)';
    if (props.visited) return '0 0 15px rgba(167, 139, 250, 0.7)';
    if (props.shortest) return '0 0 20px rgba(0, 255, 163, 0.7)';
    return '0 0 10px rgba(0, 195, 255, 0.7)';
  }};
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const Distance = styled.div`
  position: absolute;
  top: -20px;
  font-size: 0.8rem;
  color: ${props => props.infinity ? '#EC4899' : '#00ffa3'};
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 5px ${props => props.infinity ? 'rgba(236, 72, 153, 0.7)' : 'rgba(0, 255, 163, 0.7)'};
`;

const Edge = styled.div`
  position: absolute;
  height: ${props => props.thickness || 2}px;
  background: ${props => {
    if (props.shortest) return 'linear-gradient(90deg, #00ffa3, #00c3ff)';
    if (props.visited) return 'rgba(167, 139, 250, 0.7)';
    if (props.considering) return 'rgba(251, 191, 36, 0.7)';
    return 'rgba(0, 195, 255, 0.4)';
  }};
  transform-origin: left center;
  z-index: 2;
  box-shadow: ${props => {
    if (props.shortest) return '0 0 8px rgba(0, 255, 163, 0.7)';
    if (props.visited) return '0 0 5px rgba(167, 139, 250, 0.4)';
    if (props.considering) return '0 0 5px rgba(251, 191, 36, 0.4)';
    return 'none';
  }};
`;

const EdgeWeight = styled.div`
  position: absolute;
  background: rgba(5, 10, 24, 0.9);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: white;
  font-family: 'Share Tech Mono', monospace;
  border: 1px solid rgba(0, 195, 255, 0.4);
`;

const ExplanationCard = styled.div`
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
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

// Dijkstra Algorithm implementation
function dijkstraAlgorithm(graph, source, target) {
  // Initialize distances and previous nodes
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const steps = [];

  // Set initial distances
  for (const node in graph) {
    if (node === source) {
      distances[node] = 0;
    } else {
      distances[node] = Infinity;
    }
    previous[node] = null;
    unvisited.add(node);
  }
  
  steps.push({
    currentNode: null,
    visitedNodes: [],
    shortestPath: [],
    distances: { ...distances },
    previous: { ...previous },
    unvisited: [...unvisited],
    description: `Initialized distances: source node ${source} = 0, all others = ∞`
  });

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let minDistance = Infinity;
    let minNode = null;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    
    // If minimal distance is infinity, there's no path
    if (minDistance === Infinity) {
      steps.push({
        currentNode: null,
        visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
        shortestPath: [],
        distances: { ...distances },
        previous: { ...previous },
        unvisited: [...unvisited],
        description: `No path exists to remaining nodes.`
      });
      break;
    }
    
    // If we've reached the target, construct the path and finish
    if (minNode === target) {
      const path = [];
      let current = target;
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
      
      steps.push({
        currentNode: minNode,
        visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
        shortestPath: [...path],
        distances: { ...distances },
        previous: { ...previous },
        unvisited: [...unvisited],
        description: `Target node ${target} reached! Shortest path found: ${path.join(' → ')}, total distance: ${distances[target]}`
      });
      break;
    }
    
    // Remove minNode from unvisited
    unvisited.delete(minNode);
    
    // Update distances for all neighbors of minNode
    for (const neighbor in graph[minNode]) {
      if (unvisited.has(neighbor)) {
        const alt = distances[minNode] + graph[minNode][neighbor];
        const oldDistance = distances[neighbor];
        
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = minNode;
          
          steps.push({
            currentNode: minNode,
            currentNeighbor: neighbor,
            visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
            shortestPath: [],
            distances: { ...distances },
            previous: { ...previous },
            unvisited: [...unvisited],
            description: `Updated distance to node ${neighbor}: ${oldDistance === Infinity ? '∞' : oldDistance} → ${alt} via node ${minNode}`
          });
        } else {
          steps.push({
            currentNode: minNode,
            currentNeighbor: neighbor,
            visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
            shortestPath: [],
            distances: { ...distances },
            previous: { ...previous },
            unvisited: [...unvisited],
            description: `Kept distance to node ${neighbor}: ${distances[neighbor]}, as path via ${minNode} (${alt}) is not shorter`
          });
        }
      }
    }
    
    steps.push({
      currentNode: minNode,
      visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
      shortestPath: [],
      distances: { ...distances },
      previous: { ...previous },
      unvisited: [...unvisited],
      description: `Processed node ${minNode}, updated distances to neighbors. Moving to next node.`
    });
  }
  
  // Construct the final path
  const path = [];
  if (distances[target] !== Infinity) {
    let current = target;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
  }
  
  if (path.length === 0 && target !== source) {
    steps.push({
      currentNode: null,
      visitedNodes: [...Object.keys(distances).filter(node => !unvisited.has(node))],
      shortestPath: [],
      distances: { ...distances },
      previous: { ...previous },
      unvisited: [...unvisited],
      description: `No path exists from ${source} to ${target}.`
    });
  }
  
  // Return the final result with the steps
  return {
    distances,
    previous,
    path,
    steps
  };
}

// Code implementations for different languages
const codeImplementations = {
  javascript: `function dijkstra(graph, start, end) {
  // Priority queue to get the node with the minimum distance
  const queue = new PriorityQueue();
  
  // Distances from the source node to each node
  const distances = {};
  
  // Previous node in the optimal path
  const previous = {};
  
  // Initialize distances and previous nodes
  for (const node in graph) {
    if (node === start) {
      distances[node] = 0;
      queue.enqueue(node, 0);
    } else {
      distances[node] = Infinity;
      queue.enqueue(node, Infinity);
    }
    previous[node] = null;
  }
  
  // Process all nodes in the priority queue
  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    
    // If we've reached the end node, we're done
    if (current === end) break;
    
    // Check all neighboring nodes
    for (const neighbor in graph[current]) {
      const distance = graph[current][neighbor];
      
      // Calculate total distance from start to neighbor through current
      const totalDistance = distances[current] + distance;
      
      // If this path is shorter than any previous path
      if (totalDistance < distances[neighbor]) {
        distances[neighbor] = totalDistance;
        previous[neighbor] = current;
        queue.decreasePriority(neighbor, totalDistance);
      }
    }
  }
  
  // Construct the shortest path
  const path = [];
  let current = end;
  
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  return {
    distance: distances[end],
    path: path
  };
}

// Simple priority queue implementation
class PriorityQueue {
  constructor() {
    this.values = {};
    this.keys = [];
  }
  
  enqueue(val, priority) {
    this.values[val] = priority;
    this.keys.push(val);
    this.sort();
  }
  
  dequeue() {
    const val = this.keys.shift();
    delete this.values[val];
    return val;
  }
  
  decreasePriority(val, priority) {
    this.values[val] = priority;
    this.sort();
  }
  
  isEmpty() {
    return this.keys.length === 0;
  }
  
  sort() {
    this.keys.sort((a, b) => this.values[a] - this.values[b]);
  }
}`,

  python: `import heapq

def dijkstra(graph, start, end):
    # Priority queue to get the node with the minimum distance
    queue = [(0, start)]
    
    # Distances from the source node to each node
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    
    # Previous node in the optimal path
    previous = {node: None for node in graph}
    
    # Visited nodes set
    visited = set()
    
    while queue:
        current_distance, current_node = heapq.heappop(queue)
        
        # If we've already found a shorter path, skip
        if current_distance > distances[current_node]:
            continue
            
        # If we've reached the end node, we're done
        if current_node == end:
            break
            
        # Mark as visited
        visited.add(current_node)
        
        # Check all neighboring nodes
        for neighbor, weight in graph[current_node].items():
            if neighbor in visited:
                continue
                
            distance = current_distance + weight
            
            # If this path is shorter than any previous path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(queue, (distance, neighbor))
    
    # Construct the shortest path
    path = []
    current_node = end
    
    while current_node is not None:
        path.insert(0, current_node)
        current_node = previous[current_node]
    
    return {
        "distance": distances[end],
        "path": path if path[0] == start else []
    }`,

  java: `import java.util.*;

public class Dijkstra {
    public static Map<String, Object> findShortestPath(
            Map<String, Map<String, Integer>> graph,
            String start,
            String end) {
        
        // Priority queue to get the node with the minimum distance
        PriorityQueue<Node> queue = new PriorityQueue<>();
        
        // Distances from the source node to each node
        Map<String, Integer> distances = new HashMap<>();
        
        // Previous node in the optimal path
        Map<String, String> previous = new HashMap<>();
        
        // Initialize distances and previous nodes
        for (String node : graph.keySet()) {
            if (node.equals(start)) {
                distances.put(node, 0);
                queue.add(new Node(node, 0));
            } else {
                distances.put(node, Integer.MAX_VALUE);
                queue.add(new Node(node, Integer.MAX_VALUE));
            }
            previous.put(node, null);
        }
        
        // Process all nodes in the priority queue
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            
            // If we've reached the end node, we're done
            if (current.name.equals(end)) break;
            
            // If we've already found a shorter path, skip
            if (current.distance > distances.get(current.name)) continue;
            
            // Check all neighboring nodes
            for (Map.Entry<String, Integer> neighbor : graph.get(current.name).entrySet()) {
                String neighborName = neighbor.getKey();
                int weight = neighbor.getValue();
                
                int distance = distances.get(current.name) + weight;
                
                // If this path is shorter than any previous path
                if (distance < distances.get(neighborName)) {
                    distances.put(neighborName, distance);
                    previous.put(neighborName, current.name);
                    queue.add(new Node(neighborName, distance));
                }
            }
        }
        
        // Construct the shortest path
        List<String> path = new ArrayList<>();
        String current = end;
        
        while (current != null) {
            path.add(0, current);
            current = previous.get(current);
        }
        
        // Return the result
        Map<String, Object> result = new HashMap<>();
        result.put("distance", distances.get(end));
        result.put("path", path.get(0).equals(start) ? path : new ArrayList<>());
        return result;
    }
    
    // Node class for the priority queue
    static class Node implements Comparable<Node> {
        String name;
        int distance;
        
        Node(String name, int distance) {
            this.name = name;
            this.distance = distance;
        }
        
        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }
}`,

  cpp: `#include <iostream>
#include <vector>
#include <map>
#include <queue>
#include <limits>
#include <string>
#include <utility>

using namespace std;

struct Result {
    int distance;
    vector<string> path;
};

Result dijkstra(
    map<string, map<string, int>> graph,
    string start,
    string end
) {
    // Priority queue to get the node with the minimum distance
    priority_queue<
        pair<int, string>,
        vector<pair<int, string>>,
        greater<pair<int, string>>
    > queue;
    
    // Distances from the source node to each node
    map<string, int> distances;
    
    // Previous node in the optimal path
    map<string, string> previous;
    
    // Initialize distances and previous nodes
    for (const auto& node : graph) {
        string nodeName = node.first;
        if (nodeName == start) {
            distances[nodeName] = 0;
            queue.push(make_pair(0, nodeName));
        } else {
            distances[nodeName] = numeric_limits<int>::max();
            queue.push(make_pair(numeric_limits<int>::max(), nodeName));
        }
        previous[nodeName] = "";
    }
    
    // Process all nodes in the priority queue
    while (!queue.empty()) {
        pair<int, string> current = queue.top();
        queue.pop();
        
        int currentDistance = current.first;
        string currentNode = current.second;
        
        // If we've reached the end node, we're done
        if (currentNode == end) break;
        
        // If we've already found a shorter path, skip
        if (currentDistance > distances[currentNode]) continue;
        
        // Check all neighboring nodes
        for (const auto& neighbor : graph[currentNode]) {
            string neighborName = neighbor.first;
            int weight = neighbor.second;
            
            int distance = distances[currentNode] + weight;
            
            // If this path is shorter than any previous path
            if (distance < distances[neighborName]) {
                distances[neighborName] = distance;
                previous[neighborName] = currentNode;
                queue.push(make_pair(distance, neighborName));
            }
        }
    }
    
    // Construct the shortest path
    vector<string> path;
    string current = end;
    
    while (!current.empty()) {
        path.insert(path.begin(), current);
        current = previous[current];
    }
    
    // Return the result
    Result result;
    result.distance = distances[end];
    result.path = (path.front() == start) ? path : vector<string>();
    return result;
}`
};

// Sample graphs for the algorithm
const sampleGraphs = {
  simple: {
    A: { B: 4, C: 2 },
    B: { A: 4, C: 1, D: 5 },
    C: { A: 2, B: 1, D: 8 },
    D: { B: 5, C: 8 }
  },
  medium: {
    A: { B: 5, C: 3, E: 11 },
    B: { A: 5, C: 1, F: 7 },
    C: { A: 3, B: 1, D: 4, F: 6 },
    D: { C: 4, F: 2, G: 1 },
    E: { A: 11, F: 4 },
    F: { B: 7, C: 6, D: 2, E: 4, G: 3 },
    G: { D: 1, F: 3 }
  },
  complex: {
    A: { B: 2, C: 4, D: 1 },
    B: { A: 2, D: 3, E: 2, F: 5 },
    C: { A: 4, D: 2, G: 4 },
    D: { A: 1, B: 3, C: 2, E: 3, G: 6 },
    E: { B: 2, D: 3, F: 1, H: 5 },
    F: { B: 5, E: 1, H: 3 },
    G: { C: 4, D: 6, H: 2 },
    H: { E: 5, F: 3, G: 2 }
  }
};

// Function to generate a random graph with better node positioning
const generateRandomGraph = (nodeCount, density) => {
  // Create node names (A, B, C, etc.)
  const nodes = Array.from({ length: nodeCount }, (_, i) => 
    String.fromCharCode(65 + i)
  );
  
  // Generate positions in a circular layout for better visualization
  const positions = {};
  const radius = 180; // Radius of the circle
  const centerX = 225; // Center X position
  const centerY = 200; // Center Y position
  
  nodes.forEach((node, index) => {
    // Calculate position in a circle with slight random variation
    const angle = (index / nodeCount) * 2 * Math.PI;
    // Add slight random offset for a more natural look
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    positions[node] = {
      x: centerX + Math.cos(angle) * radius + offsetX,
      y: centerY + Math.sin(angle) * radius + offsetY
    };
  });
  
  // Generate graph with random edges
  const graph = {};
  nodes.forEach(node => {
    graph[node] = {};
  });
  
  // Connect each node based on density (0-1)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      // Random connection based on density
      if (Math.random() < density) {
        // Random weight between 1 and 9
        const weight = Math.floor(Math.random() * 9) + 1;
        graph[nodes[i]][nodes[j]] = weight;
        graph[nodes[j]][nodes[i]] = weight;
      }
    }
  }
  
  // Ensure the graph is connected by creating a minimum spanning tree
  for (let i = 1; i < nodes.length; i++) {
    const prevNode = nodes[i-1];
    const currentNode = nodes[i];
    
    // If not already connected, connect them
    if (!graph[prevNode][currentNode]) {
      const weight = Math.floor(Math.random() * 9) + 1;
      graph[prevNode][currentNode] = weight;
      graph[currentNode][prevNode] = weight;
    }
  }
  
  // Connect first and last node to ensure circular connectivity if needed
  if (nodeCount > 3 && !graph[nodes[0]][nodes[nodeCount-1]] && Math.random() > 0.5) {
    const weight = Math.floor(Math.random() * 9) + 1;
    graph[nodes[0]][nodes[nodeCount-1]] = weight;
    graph[nodes[nodeCount-1]][nodes[0]] = weight;
  }
  
  return { graph, positions };
};

// Improved node positions for predefined graphs
const nodePositions = {
  simple: {
    A: { x: 125, y: 125 },
    B: { x: 325, y: 75 },
    C: { x: 175, y: 275 },
    D: { x: 375, y: 225 }
  },
  medium: {
    A: { x: 100, y: 75 },
    B: { x: 250, y: 50 },
    C: { x: 225, y: 175 },
    D: { x: 375, y: 175 },
    E: { x: 125, y: 250 },
    F: { x: 275, y: 300 },
    G: { x: 425, y: 250 }
  },
  complex: {
    A: { x: 100, y: 100 },
    B: { x: 225, y: 50 },
    C: { x: 75, y: 225 },
    D: { x: 175, y: 175 },
    E: { x: 325, y: 100 },
    F: { x: 400, y: 50 },
    G: { x: 225, y: 300 },
    H: { x: 400, y: 225 }
  }
};

// Main component
function DijkstraAlgorithmVisualizer() {
  const [graph, setGraph] = useState(sampleGraphs.simple);
  const [graphType, setGraphType] = useState('simple');
  const [sourceNode, setSourceNode] = useState('A');
  const [targetNode, setTargetNode] = useState('D');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [sorting, setSorting] = useState(false);
  const sortingInterval = useRef(null);
  const stepsContainerRef = useRef(null);
  const [speed, setSpeed] = useState(500);
  const [activeTab, setActiveTab] = useState('javascript');
  const [customNodePositions, setCustomNodePositions] = useState(nodePositions.simple);
  const [nodeCount, setNodeCount] = useState(5);
  const [density, setDensity] = useState(0.5);
  const [isCustomGraph, setIsCustomGraph] = useState(false);

  // Calculate positions for the graph visualization
  const positions = isCustomGraph ? customNodePositions : nodePositions[graphType];

  // Generate edges from the graph
  const generateEdges = () => {
    const edges = [];
    for (const node in graph) {
      for (const neighbor in graph[node]) {
        // Only add an edge once (for undirected graph)
        if (node < neighbor) {
          edges.push({
            from: node,
            to: neighbor,
            weight: graph[node][neighbor]
          });
        }
      }
    }
    return edges;
  };
  
  // Generate a random graph
  const createRandomGraph = () => {
    resetVisualization();
    
    // Cap the node count to avoid performance issues
    const safeNodeCount = Math.min(Math.max(3, nodeCount), 10);
    
    // Generate a new random graph with positions
    const { graph: randomGraph, positions: randomPositions } = generateRandomGraph(safeNodeCount, density);
    
    // Update state with new graph
    setGraph(randomGraph);
    setCustomNodePositions(randomPositions);
    setIsCustomGraph(true);
    
    // Set source to first node (A) and target to last node
    const nodes = Object.keys(randomGraph);
    setSourceNode(nodes[0]);
    setTargetNode(nodes[nodes.length - 1]);
  };

  // Run the algorithm
  const runAlgorithm = () => {
    const result = dijkstraAlgorithm(graph, sourceNode, targetNode);
    setSteps(result.steps);
    setCurrentStep(0);
  };

  // Start automated animation
  const startAnimation = () => {
    if (steps.length === 0) {
      runAlgorithm();
    }
    
    setSorting(true);
    
    sortingInterval.current = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep >= steps.length - 1) {
          setSorting(false);
          clearInterval(sortingInterval.current);
          return prevStep;
        }
        return prevStep + 1;
      });
    }, 1000 - speed);
  };

  // Stop animation
  const stopAnimation = () => {
    setSorting(false);
    if (sortingInterval.current) {
      clearInterval(sortingInterval.current);
      sortingInterval.current = null;
    }
  };

  // Reset the visualization
  const resetVisualization = () => {
    stopAnimation();
    setSteps([]);
    setCurrentStep(0);
  };

  // Go to a specific step
  const goToStep = (index) => {
    if (sorting) stopAnimation();
    setCurrentStep(index);
  };

  // Change the graph
  const changeGraph = (type) => {
    resetVisualization();
    setGraphType(type);
    setGraph(sampleGraphs[type]);
    setIsCustomGraph(false);
    
    // Reset source and target nodes based on the graph type
    if (type === 'simple') {
      setSourceNode('A');
      setTargetNode('D');
    } else if (type === 'medium') {
      setSourceNode('A');
      setTargetNode('G');
    } else if (type === 'complex') {
      setSourceNode('A');
      setTargetNode('H');
    }
  };
  
  // Handler for source node change
  const handleSourceNodeChange = (e) => {
    setSourceNode(e.target.value);
    resetVisualization();
  };
  
  // Handler for target node change
  const handleTargetNodeChange = (e) => {
    setTargetNode(e.target.value);
    resetVisualization();
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (sortingInterval.current) {
        clearInterval(sortingInterval.current);
      }
    };
  }, []);

  // Scroll to the active step card
  useEffect(() => {
    if (stepsContainerRef.current && steps.length > 0) {
      const container = stepsContainerRef.current;
      const activeCard = container.children[currentStep];
      
      if (activeCard) {
        container.scrollLeft = activeCard.offsetLeft - container.offsetWidth / 2 + activeCard.offsetWidth / 2;
      }
    }
  }, [currentStep, steps.length]);

  // Calculate edge angle and length
  const calculateEdge = (fromNode, toNode) => {
    const x1 = positions[fromNode].x;
    const y1 = positions[fromNode].y;
    const x2 = positions[toNode].x;
    const y2 = positions[toNode].y;
    
    // Calculate distance between nodes
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy) - 50; // Subtract node radius
    
    // Calculate angle
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Calculate midpoint for weight label
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    return {
      left: x1 + 25,
      top: y1 + 25,
      length,
      angle,
      midX,
      midY
    };
  };

  // Check if an edge is part of the shortest path
  const isEdgeInShortestPath = (from, to) => {
    if (!steps.length || currentStep >= steps.length) return false;
    
    const path = steps[currentStep].shortestPath;
    if (!path || path.length < 2) return false;
    
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === from && path[i+1] === to) || (path[i] === to && path[i+1] === from)) {
        return true;
      }
    }
    return false;
  };

  // Check if an edge is being visited/considered in the current step
  const isEdgeBeingConsidered = (from, to) => {
    if (!steps.length || currentStep >= steps.length) return false;
    
    const { currentNode, currentNeighbor } = steps[currentStep];
    return (currentNode === from && currentNeighbor === to) || (currentNode === to && currentNeighbor === from);
  };

  // Check if an edge connects to a visited node
  const isEdgeToVisitedNode = (from, to) => {
    if (!steps.length || currentStep >= steps.length) return false;
    
    const visitedNodes = steps[currentStep].visitedNodes;
    return visitedNodes.includes(from) && visitedNodes.includes(to);
  };

  // Render edges
  const renderEdges = () => {
    const edges = generateEdges();
    
    return edges.map((edge, index) => {
      const { left, top, length, angle, midX, midY } = calculateEdge(edge.from, edge.to);
      
      const isInPath = isEdgeInShortestPath(edge.from, edge.to);
      const isConsidering = isEdgeBeingConsidered(edge.from, edge.to);
      const isVisited = isEdgeToVisitedNode(edge.from, edge.to);
      
      const thickness = isInPath ? 4 : isConsidering ? 3 : 2;
      
      return (
        <div key={`edge-${index}`}>
          <Edge 
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${length}px`,
              transform: `rotate(${angle}deg)`
            }}
            thickness={thickness}
            shortest={isInPath}
            considering={isConsidering}
            visited={isVisited}
          />
          <EdgeWeight 
            style={{
              left: `${midX - 10}px`,
              top: `${midY - 10}px`
            }}
          >
            {edge.weight}
          </EdgeWeight>
        </div>
      );
    });
  };

  // Render nodes
  const renderNodes = () => {
    return Object.keys(positions).map(node => {
      const isSource = node === sourceNode;
      const isTarget = node === targetNode;
      const isCurrent = steps.length > 0 && currentStep < steps.length && steps[currentStep].currentNode === node;
      const isVisited = steps.length > 0 && currentStep < steps.length && steps[currentStep].visitedNodes.includes(node);
      const isInShortestPath = steps.length > 0 && currentStep < steps.length && steps[currentStep].shortestPath.includes(node);
      
      // Get the distance value for the node
      const distance = steps.length > 0 && currentStep < steps.length ? 
        steps[currentStep].distances[node] : 
        node === sourceNode ? 0 : Infinity;
      
      return (
        <div key={`node-${node}`} style={{ position: 'absolute', left: `${positions[node].x}px`, top: `${positions[node].y}px` }}>
          <Node 
            source={isSource}
            target={isTarget}
            current={isCurrent}
            visited={!isCurrent && isVisited && !isInShortestPath}
            shortest={isInShortestPath}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {node}
          </Node>
          <Distance 
            infinity={distance === Infinity}
            style={{ display: steps.length > 0 ? 'block' : 'none' }}
          >
            {distance === Infinity ? '∞' : distance}
          </Distance>
        </div>
      );
    });
  };

  // Get nodes for dropdowns
  const getNodes = () => Object.keys(graph);

  return (
    <VisualizerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Dijkstra Algorithm Visualizer</Title>
      <Description>
        Interactive step-by-step visualization of Dijkstra's shortest path algorithm with detailed animations and explanations
      </Description>
      
      <ControlsWrapper>
        <Controls>
          <Button 
            onClick={() => changeGraph('simple')} 
            primary={graphType === 'simple' && !isCustomGraph}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting}
          >
            Simple Graph
          </Button>
          <Button 
            onClick={() => changeGraph('medium')} 
            primary={graphType === 'medium' && !isCustomGraph}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting}
          >
            Medium Graph
          </Button>
          <Button 
            onClick={() => changeGraph('complex')} 
            primary={graphType === 'complex' && !isCustomGraph}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting}
          >
            Complex Graph
          </Button>
          <Button 
            onClick={createRandomGraph}
            primary={isCustomGraph}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting}
          >
            Random Graph
          </Button>
        </Controls>
        
        {isCustomGraph && (
          <Controls style={{ marginTop: '1rem' }}>
            <SliderContainer style={{ maxWidth: '200px' }}>
              <Label htmlFor="nodeCount">Nodes: {nodeCount}</Label>
              <Slider 
                id="nodeCount"
                type="range" 
                min="3" 
                max="10" 
                value={nodeCount} 
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                disabled={sorting}
              />
            </SliderContainer>
            
            <SliderContainer style={{ maxWidth: '200px' }}>
              <Label htmlFor="density">Edge Density: {density.toFixed(1)}</Label>
              <Slider 
                id="density"
                type="range" 
                min="0.1" 
                max="1" 
                step="0.1"
                value={density} 
                onChange={(e) => setDensity(parseFloat(e.target.value))}
                disabled={sorting}
              />
            </SliderContainer>
          </Controls>
        )}
        
        <Controls style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
              <Label htmlFor="sourceNode">Source Node</Label>
              <select 
                id="sourceNode" 
                value={sourceNode}
                onChange={handleSourceNodeChange}
                disabled={sorting}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(5, 10, 24, 0.8)',
                  color: '#00c3ff',
                  border: '1px solid rgba(0, 195, 255, 0.3)',
                  borderRadius: '4px',
                  fontFamily: '"Share Tech Mono", monospace',
                  cursor: 'pointer'
                }}
              >
                {getNodes().map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '120px' }}>
              <Label htmlFor="targetNode">Target Node</Label>
              <select 
                id="targetNode" 
                value={targetNode}
                onChange={handleTargetNodeChange}
                disabled={sorting}
                style={{
                  padding: '0.5rem',
                  background: 'rgba(5, 10, 24, 0.8)',
                  color: '#00c3ff',
                  border: '1px solid rgba(0, 195, 255, 0.3)',
                  borderRadius: '4px',
                  fontFamily: '"Share Tech Mono", monospace',
                  cursor: 'pointer'
                }}
              >
                {getNodes().map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
            </div>
          </div>
        </Controls>
        
        <Controls style={{ marginTop: '1rem' }}>
          <Button 
            onClick={runAlgorithm} 
            primary
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting}
          >
            Initialize Algorithm
          </Button>
          <Button 
            onClick={startAnimation}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting || steps.length === 0 || currentStep >= steps.length - 1}
          >
            Start Animation
          </Button>
          <Button 
            onClick={stopAnimation} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!sorting}
          >
            Stop Animation
          </Button>
          <Button 
            onClick={resetVisualization} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={sorting || steps.length === 0}
          >
            Reset
          </Button>
        </Controls>
        
        <div style={{ marginTop: '1rem' }}>
          <SliderContainer>
            <Label htmlFor="speed">Animation Speed: {(1000/speed).toFixed(1)}x</Label>
            <Slider 
              id="speed"
              type="range" 
              min="50" 
              max="900" 
              value={speed} 
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
          </SliderContainer>
        </div>
      </ControlsWrapper>
      
      <VisualizationContainer>
        <GraphContainer>
          {renderEdges()}
          {renderNodes()}
        </GraphContainer>
        
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
              <p>Step {index + 1}</p>
              <p style={{ fontSize: '0.8rem' }}>
                {step.description.length > 60 
                  ? `${step.description.substring(0, 60)}...` 
                  : step.description
                }
              </p>
            </StepCard>
          ))}
        </StepsContainer>
      </VisualizationContainer>
      
      <ExplanationCard>
        <h2>Dijkstra's Algorithm Code</h2>
        <TabsContainer>
          <Tab active={activeTab === 'javascript'} onClick={() => setActiveTab('javascript')}>JavaScript</Tab>
          <Tab active={activeTab === 'python'} onClick={() => setActiveTab('python')}>Python</Tab>
          <Tab active={activeTab === 'java'} onClick={() => setActiveTab('java')}>Java</Tab>
          <Tab active={activeTab === 'cpp'} onClick={() => setActiveTab('cpp')}>C++</Tab>
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

export default DijkstraAlgorithmVisualizer;