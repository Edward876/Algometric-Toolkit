import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
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

// Styled components for our landing page
const AppContainer = styled.div`
  min-height: 100vh;
  color: #f1f5f9;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  padding: 0.5rem 0;
  line-height: 1.2;
  display: inline-block;
  background-clip: text; /* Standard syntax for Firefox */
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.95);
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }
`;

const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  position: relative;
  font-weight: 500;
  transition: color 0.3s ease;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 3px;
    bottom: -8px;
    left: 0;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
    border-radius: 3px;
  }

  &:hover {
    color: #ffffff;
    
    &:after {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 0.5rem 0;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.div`
  color: #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background: rgba(51, 65, 85, 0.5);
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(30, 41, 59, 0.95);
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  
  @media (max-width: 768px) {
    position: static;
    box-shadow: none;
    background: transparent;
    min-width: 100%;
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #e2e8f0;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(51, 65, 85, 0.8);
    color: white;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Main = styled.main`
  flex: 1;
  padding-top: 5rem;
`;

const HeroSection = styled(motion.section)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0) 70%);
    z-index: -1;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  line-height: 1.1;
`;

const Subtitle = styled(motion.p)`
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: #94a3b8;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
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
    ? 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)' 
    : 'rgba(30, 41, 59, 0.8)'};
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.primary 
    ? 'transparent' 
    : 'rgba(255, 255, 255, 0.1)'};
  box-shadow: ${props => props.primary 
    ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' 
    : 'none'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.primary 
      ? '0 15px 30px -5px rgba(59, 130, 246, 0.4)' 
      : '0 10px 15px -3px rgba(30, 41, 59, 0.3)'};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FeaturesSection = styled(motion.section)`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  text-align: center;
`;

const FeatureGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: skewX(-25deg);
    transition: all 0.8s;
    z-index: 1;
  }
  
  &:hover::before {
    left: 150%;
    transition: all 0.8s;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.gradient || "#3b82f6, #8b5cf6"});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
`;

const Footer = styled.footer`
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterText = styled.p`
  color: #94a3b8;
  margin: 0;
`;

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

function Home() {
  return (
    <>
      <HeroSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Algometric Toolkit
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          A modern, interactive platform for visualizing and understanding sorting algorithms.
          See algorithms in action with step-by-step animations and detailed explanations.
        </Subtitle>
        <ButtonContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Button to="/bubble-sort" primary="true">
            Start Exploring
          </Button>
          <Button to="/about">
            Learn More
          </Button>
        </ButtonContainer>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ 
            width: '100%', 
            maxWidth: '900px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '1.5rem'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            height: '200px',
            padding: '1rem',
            gap: '5px'
          }}>
            {[35, 20, 45, 10, 25, 50, 30, 15, 40, 5].map((height, idx) => (
              <motion.div
                key={idx}
                initial={{ height: 0 }}
                animate={{ height: `${height * 2}px` }}
                transition={{ 
                  duration: 1,
                  delay: 0.8 + idx * 0.1,
                  type: 'spring'
                }}
                style={{
                  width: '30px',
                  background: idx % 2 === 0 ? 
                    'linear-gradient(to bottom, #3b82f6, #8b5cf6)' : 
                    'linear-gradient(to bottom, #8b5cf6, #ec4899)',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative'
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 + idx * 0.1 }}
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}
                >
                  {height}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </HeroSection>
      
      <FeaturesSection
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <SectionTitle variants={itemVariants}>
          Explore Sorting Algorithms
        </SectionTitle>
        <FeatureGrid>
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#f43f5e, #ec4899">
              <span>🔄</span>
            </FeatureIcon>
            <FeatureTitle>Bubble Sort</FeatureTitle>
            <FeatureDescription>
              Visualize how bubble sort repeatedly steps through the list, compares adjacent elements, 
              and swaps them if they are in the wrong order.
            </FeatureDescription>
            <Button to="/bubble-sort">Explore Bubble Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#8b5cf6, #6366f1">
              <span>⚡</span>
            </FeatureIcon>
            <FeatureTitle>Quick Sort</FeatureTitle>
            <FeatureDescription>
              See the divide-and-conquer strategy of quick sort in action with pivot selection, 
              partitioning, and efficient recursion.
            </FeatureDescription>
            <Button to="/quick-sort">Explore Quick Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#10b981, #34d399">
              <span>🔀</span>
            </FeatureIcon>
            <FeatureTitle>Merge Sort</FeatureTitle>
            <FeatureDescription>
              Watch how merge sort divides the array into halves, sorts them independently, 
              and then merges them back together.
            </FeatureDescription>
            <Button to="/merge-sort">Explore Merge Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#eab308, #f59e0b">
              <span>🌳</span>
            </FeatureIcon>
            <FeatureTitle>Heap Sort</FeatureTitle>
            <FeatureDescription>
              Observe how heap sort creates a heap data structure and efficiently extracts 
              the largest element repeatedly.
            </FeatureDescription>
            <Button to="/heap-sort">Explore Heap Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#4776E6, #8E54E9">
              <span>🪣</span>
            </FeatureIcon>
            <FeatureTitle>Bucket Sort</FeatureTitle>
            <FeatureDescription>
              See how bucket sort distributes elements into buckets, sorts the buckets individually, 
              and then concatenates them.
            </FeatureDescription>
            <Button to="/bucket-sort">Explore Bucket Sort</Button>
          </FeatureCard>
          
          <FeatureCard 
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FeatureIcon gradient="#3b82f6, #2dd4bf">
              <span>💻</span>
            </FeatureIcon>
            <FeatureTitle>Code Implementation</FeatureTitle>
            <FeatureDescription>
              View and learn from professionally written implementations of each 
              algorithm in C, C++, Java, and Python.
            </FeatureDescription>
            <Button to="/bubble-sort">View Code Examples</Button>
          </FeatureCard>
        </FeatureGrid>
      </FeaturesSection>
    </>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortingDropdownOpen, setSortingDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleSortingDropdown = () => {
    setSortingDropdownOpen(!sortingDropdownOpen);
  };

  // Close dropdown when a menu item is clicked
  const handleDropdownItemClick = () => {
    setSortingDropdownOpen(false);
    setMenuOpen(false);
  };

  return (
    <Router>
      <AppContainer>
        <Header>
          <Logo to="/">Algometric Toolkit</Logo>
          <MenuButton onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </MenuButton>
          <Nav isOpen={menuOpen}>
            <DropdownContainer>
              <DropdownButton onClick={toggleSortingDropdown}>
                Sorting Algorithms <span>{sortingDropdownOpen ? '▲' : '▼'}</span>
              </DropdownButton>
              {sortingDropdownOpen && (
                <DropdownMenu
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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
            </DropdownContainer>
            <NavLink to="/tree-algorithms" onClick={() => setMenuOpen(false)}>Tree Algorithms</NavLink>
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
              <Route path="/tree-algorithms" element={<TreeVisualizer />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Main>
        
        <Footer>
          <FooterText>© {new Date().getFullYear()} Algometric Toolkit. All rights reserved.</FooterText>
        </Footer>
      </AppContainer>
    </Router>
  );
}

export default App;
