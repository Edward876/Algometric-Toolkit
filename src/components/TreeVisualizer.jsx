import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components
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
  background: linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  position: relative;
  line-height: 1.2;
  padding: 0.5rem;
  text-shadow: 0 0 30px rgba(255, 65, 108, 0.3);
  letter-spacing: -1px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 25%;
    width: 50%;
    height: 4px;
    background: linear-gradient(90deg, #FF416C 0%, #FF4B2B 100%);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(255, 65, 108, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    right: 0;
    bottom: -10px;
    background: radial-gradient(ellipse at center, rgba(255, 65, 108, 0.15) 0%, rgba(0, 0, 0, 0) 70%);
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

const ExplanationCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

function TreeVisualizer() {
  return (
    <VisualizerContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Tree Algorithms Visualizer</Title>
      <Description>
        Coming soon: Interactive step-by-step visualization of tree algorithms including Preorder, Inorder, Postorder Traversal,
        Binary Search Tree operations, and more.
      </Description>
      
      <ExplanationCard>
        <h2>Tree Algorithms Coming Soon</h2>
        <p>We're working on visualizations for the following tree algorithms:</p>
        <ul>
          <li>Preorder Traversal</li>
          <li>Inorder Traversal</li>
          <li>Postorder Traversal</li>
          <li>Build Tree from Inorder and Preorder/Postorder</li>
          <li>Lowest Common Ancestor (LCA)</li>
          <li>Height/Depth of Tree</li>
          <li>Binary Search Tree (BST) Operations (Insert, Delete, Search)</li>
          <li>Check Valid BST</li>
          <li>Convert to AVL Tree</li>
        </ul>
        <p>Check back soon for interactive visualizations of these algorithms!</p>
      </ExplanationCard>
    </VisualizerContainer>
  );
}

export default TreeVisualizer;