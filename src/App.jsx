import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './App.css';

// Import all visualizer components
import BubbleSortVisualizer from './components/BubbleSortVisualizer';
import QuickSortVisualizer from './components/QuickSortVisualizer';
import MergeSortVisualizer from './components/MergeSortVisualizer';
import HeapSortVisualizer from './components/HeapSortVisualizer';
import BucketSortVisualizer from './components/BucketSortVisualizer';
import TreeVisualizer from './components/TreeVisualizer';
import SelectionSortVisualizer from './components/SelectionSortVisualizer';
import InsertionSortVisualizer from './components/InsertionSortVisualizer';
import RadixSortVisualizer from './components/RadixSortVisualizer';
import KnapsackVisualizer from './components/KnapsackVisualizer';
import LCSVisualizer from './components/LCSVisualizer';

// Styled components for our landing page
const AppContainer = styled.div`
  min-height: 100vh;
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  
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

const Header = styled(motion.header)`
  background: rgba(5, 10, 24, 0.85);
  backdrop-filter: blur(15px);
  padding: 1.2rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(0, 195, 255, 0.2);
  box-shadow: 0 0 20px rgba(0, 195, 255, 0.15);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(90deg, #00c3ff 0%, #60efff 50%, #00ffa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  padding: 0.5rem 0;
  line-height: 1.2;
  display: inline-block;
  background-clip: text; /* Standard syntax for Firefox */
  position: relative;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%);
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  }
  
  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(5, 10, 24, 0.95);
    backdrop-filter: blur(15px);
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
    border-bottom: 1px solid rgba(0, 195, 255, 0.2);
    box-shadow: 0 0 20px rgba(0, 195, 255, 0.15);
    transform-origin: top;
    animation: ${props => props.isOpen ? 'slideDown 0.4s forwards' : 'none'};
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  position: relative;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0.5rem;
  border-radius: 8px;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.5px;

  &:hover {
    color: #00c3ff;
    background: rgba(0, 195, 255, 0.1);
    text-shadow: 0 0 8px rgba(0, 195, 255, 0.8);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -3px;
    left: 0;
    background: linear-gradient(90deg, #00c3ff, #00ffa3);
    transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 1rem;
    width: 100%;
    text-align: center;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownButton = styled.div`
  color: #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.5px;

  &:hover {
    background: rgba(0, 195, 255, 0.1);
    color: #00c3ff;
    text-shadow: 0 0 8px rgba(0, 195, 255, 0.8);
    border-color: rgba(0, 195, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
    padding: 1rem;
    font-size: 1.2rem;
  }
  
  span {
    transition: transform 0.3s ease;
    display: inline-block;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background: rgba(5, 10, 24, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 12px;
  min-width: 220px;
  box-shadow: 0 0 30px rgba(0, 195, 255, 0.2);
  overflow: hidden;
  z-index: 10;
  border: 1px solid rgba(0, 195, 255, 0.2);
  
  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    background: rgba(13, 18, 30, 0.5);
    min-width: 100%;
    margin-top: 0.5rem;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.85rem 1.5rem;
  text-decoration: none;
  color: #e2e8f0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: linear-gradient(180deg, #00c3ff, #00ffa3);
    transform: scaleY(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 8px rgba(0, 195, 255, 0.5);
  }
  
  &:hover {
    background: rgba(0, 195, 255, 0.1);
    color: #00c3ff;
    padding-left: 2rem;
    text-shadow: 0 0 8px rgba(0, 195, 255, 0.8);
  }
  
  &:hover::before {
    transform: scaleY(1);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: rgba(0, 195, 255, 0.1);
  border: 1px solid rgba(0, 195, 255, 0.2);
  color: #00c3ff;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 110;
  text-shadow: 0 0 8px rgba(0, 195, 255, 0.8);

  &:hover {
    background: rgba(0, 195, 255, 0.2);
    box-shadow: 0 0 15px rgba(0, 195, 255, 0.3);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const Main = styled.main`
  flex: 1;
  padding-top: 5rem;
`;

const HeroSection = styled(motion.section)`
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(0, 195, 255, 0.15) 0%, rgba(5, 10, 24, 0) 70%);
    z-index: -1;
  }
`;

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

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  line-height: 1.1;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 15px rgba(0, 195, 255, 0.3);
  position: relative;
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 3px;
    top: 3px;
    z-index: -1;
    background: linear-gradient(90deg, #ff00ff 0%, #00ffa3 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0.3;
    filter: blur(8px);
  }
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.7);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  font-family: 'Share Tech Mono', monospace;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3rem;
`;

const Button = styled(Link)`
  background: ${props => props.primary 
    ? 'linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%)' 
    : 'rgba(5, 10, 24, 0.8)'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  border: 1px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(0, 195, 255, 0.3)'};
  box-shadow: ${props => props.primary 
    ? '0 0 20px rgba(0, 195, 255, 0.5)' 
    : 'none'};
  position: relative;
  overflow: hidden;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.6s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.primary 
      ? '0 0 30px rgba(0, 195, 255, 0.7)' 
      : '0 0 20px rgba(0, 195, 255, 0.3)'};
  }
  
  &:hover::after {
    left: 100%;
  }
  
  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Add this new styled component to enhance the demo visualization
const AlgorithmDemoCard = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0, 195, 255, 0.2);
  border: 1px solid rgba(0, 195, 255, 0.3);
  padding: 2rem;
  position: relative;
  background: rgba(5, 10, 24, 0.7);
  backdrop-filter: blur(10px);
  
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
    z-index: -1;
  }
  
  h3 {
    margin-bottom: 1.5rem;
    color: #00c3ff;
    text-align: left;
    font-family: 'Orbitron', sans-serif;
    letter-spacing: 1px;
    font-size: 1.5rem;
    text-shadow: 0 0 10px rgba(0, 195, 255, 0.5);
  }
`;

const AlgorithmBar = styled(motion.div)`
  width: 35px;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 0 8px 0;
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.3);
`;

// Enhanced animation variants
const containerVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8,
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

// Particles component with enhanced cyberpunk animation
const ParticlesComponent = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
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

// Animated visualization demo for the hero section
const AlgorithmDemo = () => {
  const [array, setArray] = useState([35, 20, 45, 10, 25, 50, 30, 15, 40, 5]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sortedIdx, setSortedIdx] = useState([]);
  const [comparing, setComparing] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sorting animation
      setComparing([currentIdx, currentIdx + 1]);
      
      setTimeout(() => {
        if (array[currentIdx] > array[currentIdx + 1]) {
          setArray(prevArray => {
            const newArray = [...prevArray];
            [newArray[currentIdx], newArray[currentIdx + 1]] = [newArray[currentIdx + 1], newArray[currentIdx]];
            return newArray;
          });
        }
        setComparing([]);
        
        if (currentIdx + 1 === array.length - sortedIdx.length - 1) {
          setSortedIdx(prev => [...prev, array.length - sortedIdx.length - 1]);
          setCurrentIdx(0);
        } else {
          setCurrentIdx(prev => prev + 1);
        }
      }, 500);
    }, 1000);
    
    if (sortedIdx.length === array.length - 1) {
      clearInterval(interval);
      setSortedIdx([...Array(array.length).keys()]);
    }
    
    return () => clearInterval(interval);
  }, [currentIdx, array, sortedIdx.length]);
  
  return (
    <AlgorithmDemoCard
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="cyber-grid"
    >
      <h3 className="neon-text">Bubble Sort Visualization</h3>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '220px',
        padding: '1rem',
        gap: '8px'
      }}>
        {array.map((height, idx) => (
          <AlgorithmBar
            key={idx}
            initial={{ height: 0 }}
            animate={{ 
              height: `${height * 3}px`,
              backgroundColor: comparing.includes(idx)
                ? '#ff00ff'
                : sortedIdx.includes(idx)
                ? '#00ffa3'
                : idx % 2 === 0 
                  ? '#00c3ff' 
                  : '#60efff'
            }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white',
                fontFamily: 'Share Tech Mono, monospace'
              }}
            >
              {height}
            </motion.div>
          </AlgorithmBar>
        ))}
      </div>
    </AlgorithmDemoCard>
  );
};

function Home() {
  // Scroll-based animations
  const { scrollYProgress } = useScroll();
  const featuresOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const featuresY = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  
  return (
    <>
      <HeroSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ParticlesComponent />
        
        <Title
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          Algometric Toolkit
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.3,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          A modern, interactive platform for visualizing and understanding sorting algorithms.
          See algorithms in action with step-by-step animations and detailed explanations.
        </Subtitle>
        <ButtonContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button to="/bubble-sort" primary="true" className="glow-pulse">
            Start Exploring
          </Button>
          <Button to="/about">
            Learn More
          </Button>
        </ButtonContainer>
        
        <AlgorithmDemo />
      </HeroSection>
      
      <FeaturesSection
        style={{ opacity: featuresOpacity, y: featuresY }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <SectionTitle variants={itemVariants}>
          Explore Sorting Algorithms
        </SectionTitle>
        <FeatureGrid>
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#f43f5e, #ec4899" className="glow-pink">
              <span>🔄</span>
            </FeatureIcon>
            <FeatureTitle>Bubble Sort</FeatureTitle>
            <FeatureDescription>
              Visualize how bubble sort repeatedly steps through the list, compares adjacent elements, 
              and swaps them if they are in the wrong order.
            </FeatureDescription>
            <Button to="/bubble-sort" className="hover-lift">Explore Bubble Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#8b5cf6, #6366f1" className="glow">
              <span>⚡</span>
            </FeatureIcon>
            <FeatureTitle>Quick Sort</FeatureTitle>
            <FeatureDescription>
              See the divide-and-conquer strategy of quick sort in action with pivot selection, 
              partitioning, and efficient recursion.
            </FeatureDescription>
            <Button to="/quick-sort" className="hover-lift">Explore Quick Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#10b981, #34d399" className="glow">
              <span>🔀</span>
            </FeatureIcon>
            <FeatureTitle>Merge Sort</FeatureTitle>
            <FeatureDescription>
              Watch how merge sort divides the array into halves, sorts them independently, 
              and then merges them back together.
            </FeatureDescription>
            <Button to="/merge-sort" className="hover-lift">Explore Merge Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#eab308, #f59e0b" className="glow">
              <span>🌳</span>
            </FeatureIcon>
            <FeatureTitle>Heap Sort</FeatureTitle>
            <FeatureDescription>
              Observe how heap sort creates a heap data structure and efficiently extracts 
              the largest element repeatedly.
            </FeatureDescription>
            <Button to="/heap-sort" className="hover-lift">Explore Heap Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#4776E6, #8E54E9" className="glow">
              <span>🪣</span>
            </FeatureIcon>
            <FeatureTitle>Bucket Sort</FeatureTitle>
            <FeatureDescription>
              See how bucket sort distributes elements into buckets, sorts the buckets individually, 
              and then concatenates them.
            </FeatureDescription>
            <Button to="/bucket-sort" className="hover-lift">Explore Bucket Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="card-fancy"
          >
            <FeatureIcon gradient="#3b82f6, #2dd4bf" className="glow">
              <span>💻</span>
            </FeatureIcon>
            <FeatureTitle>Code Implementation</FeatureTitle>
            <FeatureDescription>
              View and learn from professionally written implementations of each 
              algorithm in C, C++, Java, and Python.
            </FeatureDescription>
            <Button to="/bubble-sort" className="hover-lift">View Code Examples</Button>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
    </>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortingDropdownOpen, setSortingDropdownOpen] = useState(false);
  const [otherAlgosDropdownOpen, setOtherAlgosDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleSortingDropdown = () => {
    setSortingDropdownOpen(!sortingDropdownOpen);
  };

  // Close dropdown when a menu item is clicked
  const handleDropdownItemClick = () => {
    setSortingDropdownOpen(false);
    setMenuOpen(false);
  };

  // Add scroll listener for header transparency effect
  const [headerBackground, setHeaderBackground] = useState("rgba(15, 23, 42, 0.75)");
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setHeaderBackground("rgba(15, 23, 42, 0.95)");
      } else {
        setHeaderBackground("rgba(15, 23, 42, 0.75)");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Router>
      <AppContainer>
        <Header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          style={{ background: headerBackground }}
        >
          <Logo to="/">Algometric Toolkit</Logo>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </MenuButton>
          <Nav isOpen={menuOpen}>
            <DropdownContainer>
              <DropdownButton onClick={toggleSortingDropdown} isOpen={sortingDropdownOpen}>
                Sorting Algorithms <span>▼</span>
              </DropdownButton>
              <AnimatePresence>
                {sortingDropdownOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DropdownItem to="/bubble-sort" onClick={handleDropdownItemClick}>Bubble Sort</DropdownItem>
                    <DropdownItem to="/selection-sort" onClick={handleDropdownItemClick}>Selection Sort</DropdownItem>
                    <DropdownItem to="/insertion-sort" onClick={handleDropdownItemClick}>Insertion Sort</DropdownItem>
                    <DropdownItem to="/merge-sort" onClick={handleDropdownItemClick}>Merge Sort</DropdownItem>
                    <DropdownItem to="/quick-sort" onClick={handleDropdownItemClick}>Quick Sort</DropdownItem>
                    <DropdownItem to="/heap-sort" onClick={handleDropdownItemClick}>Heap Sort</DropdownItem>
                    <DropdownItem to="/radix-sort" onClick={handleDropdownItemClick}>Radix Sort</DropdownItem>
                    <DropdownItem to="/bucket-sort" onClick={handleDropdownItemClick}>Bucket Sort</DropdownItem>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </DropdownContainer>
            
            <DropdownContainer>
              <DropdownButton onClick={() => setOtherAlgosDropdownOpen(!otherAlgosDropdownOpen)} isOpen={otherAlgosDropdownOpen}>
                Other Algorithms <span>▼</span>
              </DropdownButton>
              <AnimatePresence>
                {otherAlgosDropdownOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DropdownItem to="/knapsack" onClick={handleDropdownItemClick}>Knapsack</DropdownItem>
                    <DropdownItem to="/lcs" onClick={handleDropdownItemClick}>Longest Common Subsequence (LCS)</DropdownItem>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </DropdownContainer>
            
            <NavLink to="/tree-algorithms" onClick={() => setMenuOpen(false)} className="hover-underline">
              Tree Algorithms
            </NavLink>
          </Nav>
        </Header>
        
        <Main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bubble-sort" element={<BubbleSortVisualizer />} />
              <Route path="/selection-sort" element={<SelectionSortVisualizer />} />
              <Route path="/insertion-sort" element={<InsertionSortVisualizer />} />
              <Route path="/quick-sort" element={<QuickSortVisualizer />} />
              <Route path="/merge-sort" element={<MergeSortVisualizer />} />
              <Route path="/heap-sort" element={<HeapSortVisualizer />} />
              <Route path="/radix-sort" element={<RadixSortVisualizer />} />
              <Route path="/bucket-sort" element={<BucketSortVisualizer />} />
              <Route path="/knapsack" element={<KnapsackVisualizer />} />
              <Route path="/lcs" element={<LCSVisualizer />} />
              <Route path="/tree-algorithms" element={<TreeVisualizer />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Main>
        
        <Footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <FooterContent>
            <FooterLinks>
              <FooterLink to="/" className="hover-underline">Home</FooterLink>
              <FooterLink to="/about" className="hover-underline">About</FooterLink>
              <FooterLink to="/contact" className="hover-underline">Contact</FooterLink>
              <FooterLink to="/privacy" className="hover-underline">Privacy Policy</FooterLink>
            </FooterLinks>
            <FooterText>© {new Date().getFullYear()} Algometric Toolkit. All rights reserved.</FooterText>
          </FooterContent>
        </Footer>
      </AppContainer>
    </Router>
  );
}

export default App;

const Footer = styled(motion.footer)`
  background: rgba(5, 10, 24, 0.9);
  backdrop-filter: blur(15px);
  padding: 2rem 0;
  margin-top: 3rem;
  border-top: 1px solid rgba(0, 195, 255, 0.2);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FooterLink = styled(Link)`
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #00c3ff;
  }
`;

const FooterText = styled.p`
  color: #64748b;
  text-align: center;
`;

const FeaturesSection = styled(motion.section)`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00c3ff 0%, #00ffa3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 15px rgba(0, 195, 255, 0.5);
  position: relative;
  padding: 10px 0; /* Added padding to prevent text cutting */
  line-height: 1.3; /* Improved line height for better vertical spacing */
  
  /* Fixed outline effect for better visibility */
  &::before {
    content: "Explore Sorting Algorithms";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: transparent;
    text-shadow: 
      -1px -1px 0 rgba(0, 0, 0, 0.7),
      1px -1px 0 rgba(0, 0, 0, 0.7),
      -1px 1px 0 rgba(0, 0, 0, 0.7),
      1px 1px 0 rgba(0, 0, 0, 0.7),
      0 0 8px rgba(0, 0, 0, 0.9);
    -webkit-text-fill-color: transparent;
    padding: 10px 0; /* Match the padding of the parent */
    line-height: 1.3; /* Match the line height of the parent */
  }
  
  /* Adjusted glow effect container */
  &::after {
    content: "";
    position: absolute;
    top: -15px; /* Increased top margin */
    left: -10px;
    right: -10px;
    bottom: -15px; /* Increased bottom margin */
    background: radial-gradient(ellipse at center, rgba(0, 195, 255, 0.15) 0%, transparent 70%);
    z-index: -2;
    border-radius: 50%;
    filter: blur(10px);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(13, 18, 30, 0.8);
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 195, 255, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  height: 100%;
  justify-content: space-between;
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${props => props.gradient ? `linear-gradient(135deg, ${props.gradient})` : 'linear-gradient(135deg, #00c3ff, #00ffa3)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.4);
  
  span {
    font-size: 28px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
`;

const FeatureDescription = styled.p`
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;
