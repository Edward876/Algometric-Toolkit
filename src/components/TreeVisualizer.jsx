import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Tree from 'react-d3-tree';
import './TreeVisualizer.css';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRedo, FaTree } from 'react-icons/fa';
import { MdSpeed, MdInfo } from 'react-icons/md';
import { IoMdConstruct, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RiLeafLine, RiArrowLeftRightLine } from 'react-icons/ri';

// Tree node class for binary tree implementation
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Binary tree implementation with advanced operations
class BinaryTree {
  constructor() {
    this.root = null;
    this.traversalResults = [];
    this.traversalSteps = [];
    this.buildingSteps = [];
  }
  
  // Insert a value at the next available position (level order)
  insert(val) {
    const newNode = new TreeNode(val);
    this.buildingSteps = [];
    
    if (!this.root) {
      this.root = newNode;
      this.buildingSteps.push({
        action: 'insert',
        node: val,
        message: `Inserting ${val} as root node`
      });
      return;
    }
    
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      if (!node.left) {
        node.left = newNode;
        this.buildingSteps.push({
          action: 'insert',
          node: val,
          parentNode: node.val,
          position: 'left',
          message: `Inserting ${val} as left child of ${node.val}`
        });
        return;
      }
      
      if (!node.right) {
        node.right = newNode;
        this.buildingSteps.push({
          action: 'insert',
          node: val,
          parentNode: node.val,
          position: 'right',
          message: `Inserting ${val} as right child of ${node.val}`
        });
        return;
      }
      
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  
  // Build binary tree from array (level order)
  buildFromArray(arr) {
    this.root = null;
    this.buildingSteps = [];
    
    this.buildingSteps.push({
      action: 'start',
      message: 'Starting tree construction from array',
      array: [...arr]
    });
    
    if (!arr || arr.length === 0) {
      this.buildingSteps.push({
        action: 'complete',
        message: 'Empty array provided, tree is empty'
      });
      return;
    }
    
    this.root = new TreeNode(arr[0]);
    this.buildingSteps.push({
      action: 'insert',
      node: arr[0],
      message: `Inserting ${arr[0]} as root node`,
      currentTree: this._getTreeSnapshot()
    });
    
    const queue = [this.root];
    let i = 1;
    
    while (i < arr.length) {
      const node = queue.shift();
      
      // Left child
      if (i < arr.length) {
        if (arr[i] !== null) {
          node.left = new TreeNode(arr[i]);
          queue.push(node.left);
          this.buildingSteps.push({
            action: 'insert',
            node: arr[i],
            parentNode: node.val,
            position: 'left',
            message: `Inserting ${arr[i]} as left child of ${node.val}`,
            currentTree: this._getTreeSnapshot()
          });
        } else {
          this.buildingSteps.push({
            action: 'skip',
            parentNode: node.val,
            position: 'left',
            message: `Skipping left child of ${node.val} (null value)`,
            currentTree: this._getTreeSnapshot()
          });
        }
      }
      i++;
      
      // Right child
      if (i < arr.length) {
        if (arr[i] !== null) {
          node.right = new TreeNode(arr[i]);
          queue.push(node.right);
          this.buildingSteps.push({
            action: 'insert',
            node: arr[i],
            parentNode: node.val,
            position: 'right',
            message: `Inserting ${arr[i]} as right child of ${node.val}`,
            currentTree: this._getTreeSnapshot()
          });
        } else {
          this.buildingSteps.push({
            action: 'skip',
            parentNode: node.val,
            position: 'right',
            message: `Skipping right child of ${node.val} (null value)`,
            currentTree: this._getTreeSnapshot()
          });
        }
      }
      i++;
    }
    
    this.buildingSteps.push({
      action: 'complete',
      message: 'Tree construction complete',
      currentTree: this._getTreeSnapshot()
    });
  }
  
  // Take a snapshot of the current tree structure
  _getTreeSnapshot() {
    if (!this.root) return null;
    
    // Deep copy the tree structure without circular references
    const copyNode = (node) => {
      if (!node) return null;
      
      return {
        val: node.val,
        left: copyNode(node.left),
        right: copyNode(node.right)
      };
    };
    
    return copyNode(this.root);
  }
  
  // Build tree from inorder and preorder traversal arrays
  buildFromInorderAndPreorder(inorder, preorder) {
    this.root = null;
    this.buildingSteps = [];
    
    this.buildingSteps.push({
      action: 'start',
      message: 'Starting tree construction from Inorder and Preorder traversals',
      inorder: [...inorder],
      preorder: [...preorder]
    });
    
    if (!inorder || !preorder || inorder.length === 0 || preorder.length === 0) {
      this.buildingSteps.push({
        action: 'complete',
        message: 'Empty traversal arrays provided, tree is empty'
      });
      return;
    }
    
    // Create a map for faster lookup of inorder indices
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
      inorderMap.set(inorder[i], i);
    }
    
    this.buildingSteps.push({
      action: 'prepare',
      message: 'Creating index map for efficient lookups',
    });
    
    this.root = this._buildFromInorderAndPreorderHelper(
      preorder, 0, preorder.length - 1,
      inorderMap, 0, inorder.length - 1
    );
    
    this.buildingSteps.push({
      action: 'complete',
      message: 'Tree construction from Inorder and Preorder traversals complete',
      currentTree: this._getTreeSnapshot()
    });
  }
  
  // Helper method for buildFromInorderAndPreorder
  _buildFromInorderAndPreorderHelper(preorder, preStart, preEnd, inorderMap, inStart, inEnd) {
    if (preStart > preEnd || inStart > inEnd) {
      return null;
    }
    
    // The first element in preorder is the root
    const rootVal = preorder[preStart];
    const root = new TreeNode(rootVal);
    
    this.buildingSteps.push({
      action: 'create',
      node: rootVal,
      message: `Creating node with value ${rootVal}`,
      currentTree: this._getTreeSnapshot()
    });
    
    // Find the position of root in inorder using the map
    const rootInorderIdx = inorderMap.get(rootVal);
    
    // Calculate the size of left subtree
    const leftSubtreeSize = rootInorderIdx - inStart;
    
    this.buildingSteps.push({
      action: 'divide',
      node: rootVal,
      message: `Dividing array: Left subtree size = ${leftSubtreeSize}, Right subtree size = ${inEnd - rootInorderIdx}`,
      leftInorder: leftSubtreeSize > 0 ? 'Left subtree elements' : 'Empty',
      rightInorder: (inEnd - rootInorderIdx) > 0 ? 'Right subtree elements' : 'Empty'
    });
    
    // Recursively build left and right subtrees
    root.left = this._buildFromInorderAndPreorderHelper(
      preorder, preStart + 1, preStart + leftSubtreeSize,
      inorderMap, inStart, rootInorderIdx - 1
    );
    
    if (root.left) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.left.val,
        parentNode: rootVal,
        position: 'left',
        message: `Attaching ${root.left.val} as left child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    }
    
    root.right = this._buildFromInorderAndPreorderHelper(
      preorder, preStart + leftSubtreeSize + 1, preEnd,
      inorderMap, rootInorderIdx + 1, inEnd
    );
    
    if (root.right) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.right.val,
        parentNode: rootVal,
        position: 'right',
        message: `Attaching ${root.right.val} as right child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    }
    
    return root;
  }
  
  // Build tree from inorder and postorder traversal arrays
  buildFromInorderAndPostorder(inorder, postorder) {
    this.root = null;
    this.buildingSteps = [];
    
    this.buildingSteps.push({
      action: 'start',
      message: 'Starting tree construction from Inorder and Postorder traversals',
      inorder: [...inorder],
      postorder: [...postorder]
    });
    
    if (!inorder || !postorder || inorder.length === 0 || postorder.length === 0) {
      this.buildingSteps.push({
        action: 'complete',
        message: 'Empty traversal arrays provided, tree is empty'
      });
      return;
    }
    
    // Create a map for faster lookup of inorder indices
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
      inorderMap.set(inorder[i], i);
    }
    
    this.buildingSteps.push({
      action: 'prepare',
      message: 'Creating index map for efficient lookups',
    });
    
    this.root = this._buildFromInorderAndPostorderHelper(
      postorder, 0, postorder.length - 1,
      inorderMap, 0, inorder.length - 1
    );
    
    this.buildingSteps.push({
      action: 'complete',
      message: 'Tree construction from Inorder and Postorder traversals complete',
      currentTree: this._getTreeSnapshot()
    });
  }
  
  // Helper method for buildFromInorderAndPostorder
  _buildFromInorderAndPostorderHelper(postorder, postStart, postEnd, inorderMap, inStart, inEnd) {
    if (postStart > postEnd || inStart > inEnd) {
      return null;
    }
    
    // The last element in postorder is the root
    const rootVal = postorder[postEnd];
    const root = new TreeNode(rootVal);
    
    this.buildingSteps.push({
      action: 'create',
      node: rootVal,
      message: `Creating node with value ${rootVal}`,
      currentTree: this._getTreeSnapshot()
    });
    
    // Find the position of root in inorder using the map
    const rootInorderIdx = inorderMap.get(rootVal);
    
    // Calculate the size of left subtree
    const leftSubtreeSize = rootInorderIdx - inStart;
    
    this.buildingSteps.push({
      action: 'divide',
      node: rootVal,
      message: `Dividing array: Left subtree size = ${leftSubtreeSize}, Right subtree size = ${inEnd - rootInorderIdx}`,
      leftInorder: leftSubtreeSize > 0 ? 'Left subtree elements' : 'Empty',
      rightInorder: (inEnd - rootInorderIdx) > 0 ? 'Right subtree elements' : 'Empty'
    });
    
    // Recursively build left and right subtrees
    root.left = this._buildFromInorderAndPostorderHelper(
      postorder, postStart, postStart + leftSubtreeSize - 1,
      inorderMap, inStart, rootInorderIdx - 1
    );
    
    if (root.left) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.left.val,
        parentNode: rootVal,
        position: 'left',
        message: `Attaching ${root.left.val} as left child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    }
    
    root.right = this._buildFromInorderAndPostorderHelper(
      postorder, postStart + leftSubtreeSize, postEnd - 1,
      inorderMap, rootInorderIdx + 1, inEnd
    );
    
    if (root.right) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.right.val,
        parentNode: rootVal,
        position: 'right',
        message: `Attaching ${root.right.val} as right child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    }
    
    return root;
  }
  
  // Generate a BST from a sorted array
  buildBSTFromSortedArray(arr) {
    this.root = null;
    this.buildingSteps = [];
    
    this.buildingSteps.push({
      action: 'start',
      message: 'Starting BST construction from sorted array',
      array: [...arr]
    });
    
    if (!arr || arr.length === 0) {
      this.buildingSteps.push({
        action: 'complete',
        message: 'Empty array provided, tree is empty'
      });
      return;
    }
    
    this.root = this._buildBSTFromSortedArrayHelper(arr, 0, arr.length - 1);
    
    this.buildingSteps.push({
      action: 'complete',
      message: 'BST construction complete',
      currentTree: this._getTreeSnapshot()
    });
  }
  
  // Helper method for buildBSTFromSortedArray
  _buildBSTFromSortedArrayHelper(arr, start, end) {
    if (start > end) {
      return null;
    }
    
    // Find middle element to make it root
    const mid = Math.floor((start + end) / 2);
    const rootVal = arr[mid];
    const root = new TreeNode(rootVal);
    
    this.buildingSteps.push({
      action: 'create',
      node: rootVal,
      message: `Using middle element ${rootVal} as node`,
      currentArray: arr.slice(start, end + 1),
      midIndex: mid - start,
      currentTree: this._getTreeSnapshot()
    });
    
    // Recursively build left and right subtrees
    root.left = this._buildBSTFromSortedArrayHelper(arr, start, mid - 1);
    
    if (root.left) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.left.val,
        parentNode: rootVal,
        position: 'left',
        message: `Attaching ${root.left.val} as left child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    } else if (start <= mid - 1) {
      this.buildingSteps.push({
        action: 'noLeft',
        parentNode: rootVal,
        message: `No left child for ${rootVal}`,
      });
    }
    
    root.right = this._buildBSTFromSortedArrayHelper(arr, mid + 1, end);
    
    if (root.right) {
      this.buildingSteps.push({
        action: 'attach',
        node: root.right.val,
        parentNode: rootVal,
        position: 'right',
        message: `Attaching ${root.right.val} as right child of ${rootVal}`,
        currentTree: this._getTreeSnapshot()
      });
    } else if (mid + 1 <= end) {
      this.buildingSteps.push({
        action: 'noRight',
        parentNode: rootVal,
        message: `No right child for ${rootVal}`,
      });
    }
    
    return root;
  }
  
  // Get the tree structure by levels
  getTreeLevels() {
    if (!this.root) return [];
    
    const levels = [];
    const queue = [{ node: this.root, level: 0, position: 0 }];
    
    while (queue.length > 0) {
      const { node, level, position } = queue.shift();
      
      // Create level array if it doesn't exist
      if (!levels[level]) {
        levels[level] = [];
      }
      
      // Add node to its level
      levels[level].push({
        val: node.val,
        position,
        hasLeft: !!node.left,
        hasRight: !!node.right,
        width: 1
      });
      
      // Add children to queue with updated position and level
      if (node.left) {
        queue.push({
          node: node.left,
          level: level + 1,
          position: position * 2
        });
      }
      
      if (node.right) {
        queue.push({
          node: node.right,
          level: level + 1,
          position: position * 2 + 1
        });
      }
    }
    
    return levels;
  }
  
  // In-order traversal
  inorderTraversal() {
    this.traversalResults = [];
    this.traversalSteps = [];
    this._inorder(this.root);
    return this.traversalResults;
  }
  
  // Helper method for inorderTraversal
  _inorder(node, depth = 0) {
    if (!node) return;
    
    // Go to left subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goLeft',
      depth,
      message: `Moving to left subtree of ${node.val}`
    });
    this._inorder(node.left, depth + 1);
    
    // Process the current node (visit)
    this.traversalResults.push(node.val);
    this.traversalSteps.push({
      node: node.val,
      action: 'visit',
      depth,
      message: `Visiting ${node.val} (Inorder)`
    });
    
    // Go to right subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goRight',
      depth,
      message: `Moving to right subtree of ${node.val}`
    });
    this._inorder(node.right, depth + 1);
    
    // Return from this node
    this.traversalSteps.push({
      node: node.val,
      action: 'return',
      depth,
      message: `Returning from ${node.val}`
    });
  }
  
  // Pre-order traversal
  preorderTraversal() {
    this.traversalResults = [];
    this.traversalSteps = [];
    this._preorder(this.root);
    return this.traversalResults;
  }
  
  // Helper method for preorderTraversal
  _preorder(node, depth = 0) {
    if (!node) return;
    
    // Process the current node (visit)
    this.traversalResults.push(node.val);
    this.traversalSteps.push({
      node: node.val,
      action: 'visit',
      depth,
      message: `Visiting ${node.val} (Preorder)`
    });
    
    // Go to left subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goLeft',
      depth,
      message: `Moving to left subtree of ${node.val}`
    });
    this._preorder(node.left, depth + 1);
    
    // Go to right subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goRight',
      depth,
      message: `Moving to right subtree of ${node.val}`
    });
    this._preorder(node.right, depth + 1);
    
    // Return from this node
    this.traversalSteps.push({
      node: node.val,
      action: 'return',
      depth,
      message: `Returning from ${node.val}`
    });
  }
  
  // Post-order traversal
  postorderTraversal() {
    this.traversalResults = [];
    this.traversalSteps = [];
    this._postorder(this.root);
    return this.traversalResults;
  }
  
  // Helper method for postorderTraversal
  _postorder(node, depth = 0) {
    if (!node) return;
    
    // Go to left subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goLeft',
      depth,
      message: `Moving to left subtree of ${node.val}`
    });
    this._postorder(node.left, depth + 1);
    
    // Go to right subtree
    this.traversalSteps.push({
      node: node.val,
      action: 'goRight',
      depth,
      message: `Moving to right subtree of ${node.val}`
    });
    this._postorder(node.right, depth + 1);
    
    // Process the current node (visit)
    this.traversalResults.push(node.val);
    this.traversalSteps.push({
      node: node.val,
      action: 'visit',
      depth,
      message: `Visiting ${node.val} (Postorder)`
    });
    
    // Return from this node
    this.traversalSteps.push({
      node: node.val,
      action: 'return',
      depth,
      message: `Returning from ${node.val}`
    });
  }
  
  // Level-order traversal
  levelOrderTraversal() {
    this.traversalResults = [];
    this.traversalSteps = [];
    
    if (!this.root) return [];
    
    const queue = [this.root];
    const levels = [0]; // Track level of each node
    
    while (queue.length > 0) {
      const node = queue.shift();
      const level = levels.shift();
      
      if (!node) continue;
      
      // Visit the node
      this.traversalResults.push(node.val);
      this.traversalSteps.push({
        node: node.val,
        action: 'visit',
        depth: level,
        message: `Visiting ${node.val} (Level ${level})`
      });
      
      // Add left child to queue
      if (node.left) {
        queue.push(node.left);
        levels.push(level + 1);
        this.traversalSteps.push({
          node: node.val,
          action: 'queueLeft',
          depth: level,
          childNode: node.left.val,
          message: `Adding left child ${node.left.val} to queue`
        });
      } else {
        this.traversalSteps.push({
          node: node.val,
          action: 'noLeft',
          depth: level,
          message: `No left child for ${node.val}`
        });
      }
      
      // Add right child to queue
      if (node.right) {
        queue.push(node.right);
        levels.push(level + 1);
        this.traversalSteps.push({
          node: node.val,
          action: 'queueRight',
          depth: level,
          childNode: node.right.val,
          message: `Adding right child ${node.right.val} to queue`
        });
      } else {
        this.traversalSteps.push({
          node: node.val,
          action: 'noRight',
          depth: level,
          message: `No right child for ${node.val}`
        });
      }
    }
    
    return this.traversalResults;
  }
}

// Convert to react-d3-tree compatible format - moved outside the BinaryTree class
const convertToD3TreeFormat = (node) => {
  if (!node) return null;
  
  return {
    name: node.val.toString(),
    attributes: {
      value: node.val
    },
    children: [
      node.left ? convertToD3TreeFormat(node.left) : null,
      node.right ? convertToD3TreeFormat(node.right) : null
    ].filter(Boolean) // Remove null children
  };
};

// Get tree data formatted for react-d3-tree - moved outside the BinaryTree class
const getTreeData = (tree) => {
  if (!tree || !tree.root) return [];
  
  const d3Data = convertToD3TreeFormat(tree.root);
  return [d3Data];
};

// Individual tree node component for the visualization
const TreeNodeComponent = ({ data, isHighlighted, position }) => {
  return (
    <div className="node-container" style={{ width: `${data.width * 50}px` }}>
      <div className={`tree-node ${isHighlighted ? 'highlighted' : ''}`}>
        {data.val}
      </div>
      {data.hasLeft && <div className="tree-edge edge-left"></div>}
      {data.hasRight && <div className="tree-edge edge-right"></div>}
    </div>
  );
};

// Component for showing progress of animations
const ProgressBar = ({ current, total }) => {
  const progress = total > 0 ? (current + 1) / total * 100 : 0;
  
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

// Tree visualizer main component
const TreeVisualizer = () => {
  // Tree state
  const [tree, setTree] = useState(new BinaryTree());
  const [treeStructure, setTreeStructure] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState({});
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const treeContainerRef = useRef(null);
  
  // Tab control
  const [activeTab, setActiveTab] = useState('create');
  
  // Input state
  const [arrayInput, setArrayInput] = useState('1,2,3,4,5,6,7');
  const [inorderInput, setInorderInput] = useState('4,2,5,1,6,3,7');
  const [preorderInput, setPreorderInput] = useState('1,2,4,5,3,6,7');
  const [postorderInput, setPostorderInput] = useState('4,5,2,6,7,3,1');
  const [sortedArrayInput, setSortedArrayInput] = useState('1,2,3,4,5,6,7');
  const [usePostorder, setUsePostorder] = useState(false);
  const [inputError, setInputError] = useState('');
  
  // Traversal state
  const [traversalType, setTraversalType] = useState('inorder');
  const [traversalResults, setTraversalResults] = useState([]);
  const [traversalSteps, setTraversalSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const animationRef = useRef(null);
  
  // Building steps state
  const [buildingSteps, setBuildingSteps] = useState([]);
  const [currentBuildStep, setCurrentBuildStep] = useState(-1);
  const [isBuildAnimating, setIsBuildAnimating] = useState(false);
  const buildAnimationRef = useRef(null);
  const [buildAnimationSpeed, setBuildAnimationSpeed] = useState(1000);
  
  // Initialize example tree and set dimensions
  useEffect(() => {
    const initialTree = new BinaryTree();
    initialTree.buildFromArray([1, 2, 3, 4, 5, 6, 7]);
    setTree(initialTree);
    updateTreeStructure(initialTree);
    setBuildingSteps(initialTree.buildingSteps);
    
    // Set dimensions based on container
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        setDimensions({
          width: treeContainerRef.current.offsetWidth,
          height: treeContainerRef.current.offsetHeight
        });
      }
    };
    
    // Initial dimensions update
    updateDimensions();
    
    // Update dimensions on window resize
    window.addEventListener('resize', updateDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Update tree structure when tree changes
  const updateTreeStructure = useCallback((treeObj) => {
    const levels = treeObj.getTreeLevels();
    setTreeStructure(levels);
  }, []);
  
  // Parse input string to array
  const parseInput = (input) => {
    return input
      .split(',')
      .map(val => val.trim())
      .map(val => {
        if (val === '' || val.toLowerCase() === 'null') return null;
        const parsed = isNaN(val) ? val : parseInt(val);
        return parsed;
      });
  };
  
  // Build tree from array
  const handleBuildFromArray = () => {
    setInputError('');
    try {
      const values = parseInput(arrayInput);
      const newTree = new BinaryTree();
      newTree.buildFromArray(values);
      setTree(newTree);
      updateTreeStructure(newTree);
      setBuildingSteps(newTree.buildingSteps);
      setCurrentBuildStep(-1);
      resetTraversalState();
      setHighlightedNodes({});
    } catch (error) {
      setInputError(`Error building tree: ${error.message}`);
    }
  };
  
  // Build BST from sorted array
  const handleBuildBST = () => {
    setInputError('');
    try {
      const values = parseInput(sortedArrayInput);
      const newTree = new BinaryTree();
      newTree.buildBSTFromSortedArray(values);
      setTree(newTree);
      updateTreeStructure(newTree);
      setBuildingSteps(newTree.buildingSteps);
      setCurrentBuildStep(-1);
      resetTraversalState();
      setHighlightedNodes({});
    } catch (error) {
      setInputError(`Error building BST: ${error.message}`);
    }
  };
  
  // Build tree from traversals
  const handleBuildFromTraversals = () => {
    setInputError('');
    try {
      const inorderValues = parseInput(inorderInput);
      let secondaryValues;
      
      if (usePostorder) {
        secondaryValues = parseInput(postorderInput);
        if (inorderValues.length !== secondaryValues.length) {
          setInputError('Inorder and Postorder arrays must be of the same length');
          return;
        }
        
        const newTree = new BinaryTree();
        newTree.buildFromInorderAndPostorder(inorderValues, secondaryValues);
        setTree(newTree);
        updateTreeStructure(newTree);
        setBuildingSteps(newTree.buildingSteps);
        
      } else {
        secondaryValues = parseInput(preorderInput);
        if (inorderValues.length !== secondaryValues.length) {
          setInputError('Inorder and Preorder arrays must be of the same length');
          return;
        }
        
        const newTree = new BinaryTree();
        newTree.buildFromInorderAndPreorder(inorderValues, secondaryValues);
        setTree(newTree);
        updateTreeStructure(newTree);
        setBuildingSteps(newTree.buildingSteps);
      }
      
      setCurrentBuildStep(-1);
      resetTraversalState();
      setHighlightedNodes({});
    } catch (error) {
      setInputError(`Error building tree from traversals: ${error.message}`);
    }
  };
  
  // Reset traversal state
  const resetTraversalState = () => {
    setTraversalSteps([]);
    setTraversalResults([]);
    setCurrentStep(-1);
    setIsAnimating(false);
    
    // Clear any ongoing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Handle tree traversal
  const handleTraversal = () => {
    resetTraversalState();
    
    let results = [];
    let steps = [];
    
    switch (traversalType) {
      case 'inorder':
        results = tree.inorderTraversal();
        steps = tree.traversalSteps;
        break;
      case 'preorder':
        results = tree.preorderTraversal();
        steps = tree.traversalSteps;
        break;
      case 'postorder':
        results = tree.postorderTraversal();
        steps = tree.traversalSteps;
        break;
      case 'levelorder':
        results = tree.levelOrderTraversal();
        steps = tree.traversalSteps;
        break;
      default:
        break;
    }
    
    setTraversalResults(results);
    setTraversalSteps(steps);
  };
  
  // Update highlighted nodes based on current step
  useEffect(() => {
    if (currentStep >= 0 && currentStep < traversalSteps.length) {
      const step = traversalSteps[currentStep];
      
      // Create new highlight object
      const newHighlights = {};
      
      if (step.action === 'visit') {
        newHighlights[step.node] = 'visit';
      } else if (step.action === 'goLeft' || step.action === 'queueLeft') {
        newHighlights[step.node] = 'goLeft';
        if (step.childNode) {
          newHighlights[step.childNode] = 'child';
        }
      } else if (step.action === 'goRight' || step.action === 'queueRight') {
        newHighlights[step.node] = 'goRight';
        if (step.childNode) {
          newHighlights[step.childNode] = 'child';
        }
      } else if (step.action === 'return') {
        newHighlights[step.node] = 'return';
      }
      
      setHighlightedNodes(newHighlights);
    } else {
      setHighlightedNodes({});
    }
  }, [currentStep, traversalSteps]);
  
  // Animation controls for traversal
  const startAnimation = () => {
    // Clear any existing animation timeout
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    if (currentStep >= traversalSteps.length - 1) {
      setCurrentStep(-1); // Reset if at end
      setTimeout(() => {
        setIsAnimating(true);
        advanceStep();
      }, 300);
    } else {
      setIsAnimating(true);
      advanceStep();
    }
  };
  
  const pauseAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  };
  
  const advanceStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      
      if (next < traversalSteps.length) {
        animationRef.current = setTimeout(() => {
          // Only continue if still animating
          if (isAnimating) {
            advanceStep();
          }
        }, animationSpeed);
        return next;
      } else {
        setIsAnimating(false);
        return prev;
      }
    });
  };
  
  const stepForward = () => {
    if (isAnimating) pauseAnimation();
    if (currentStep < traversalSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const stepBackward = () => {
    if (isAnimating) pauseAnimation();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const resetAnimation = () => {
    pauseAnimation();
    setCurrentStep(-1);
    setHighlightedNodes({});
  };
  
  // Building steps animation controls
  const startBuildAnimation = () => {
    // Clear any existing animation timeout
    if (buildAnimationRef.current) {
      clearTimeout(buildAnimationRef.current);
      buildAnimationRef.current = null;
    }
    
    if (currentBuildStep >= buildingSteps.length - 1) {
      setCurrentBuildStep(-1); // Reset if at end
      setTimeout(() => {
        setIsBuildAnimating(true);
        advanceBuildStep();
      }, 300);
    } else {
      setIsBuildAnimating(true);
      advanceBuildStep();
    }
  };
  
  const pauseBuildAnimation = () => {
    setIsBuildAnimating(false);
    if (buildAnimationRef.current) {
      clearTimeout(buildAnimationRef.current);
      buildAnimationRef.current = null;
    }
  };
  
  const advanceBuildStep = () => {
    setCurrentBuildStep(prev => {
      const next = prev + 1;
      
      // Update tree structure if available
      if (next < buildingSteps.length) {
        const step = buildingSteps[next];
        if (step.currentTree) {
          // Create a new tree with this structure
          const stepTree = new BinaryTree();
          stepTree.root = JSON.parse(JSON.stringify(step.currentTree));
          updateTreeStructure(stepTree);
        }
      }
      
      // Continue animation if not finished
      if (next < buildingSteps.length) {
        buildAnimationRef.current = setTimeout(() => {
          // Only continue if still animating
          if (isBuildAnimating) {
            advanceBuildStep();
          }
        }, buildAnimationSpeed);
        return next;
      } else {
        setIsBuildAnimating(false);
        updateTreeStructure(tree); // Reset to final tree
        return prev;
      }
    });
  };
  
  const stepBuildForward = () => {
    if (isBuildAnimating) pauseBuildAnimation();
    if (currentBuildStep < buildingSteps.length - 1) {
      const nextStep = currentBuildStep + 1;
      const step = buildingSteps[nextStep];
      
      if (step.currentTree) {
        const stepTree = new BinaryTree();
        stepTree.root = JSON.parse(JSON.stringify(step.currentTree));
        updateTreeStructure(stepTree);
      }
      
      setCurrentBuildStep(nextStep);
    }
  };
  
  const stepBuildBackward = () => {
    if (isBuildAnimating) pauseBuildAnimation();
    if (currentBuildStep > 0) {
      const prevStep = currentBuildStep - 1;
      const step = buildingSteps[prevStep];
      
      if (step.currentTree) {
        const stepTree = new BinaryTree();
        stepTree.root = JSON.parse(JSON.stringify(step.currentTree));
        updateTreeStructure(stepTree);
      } else if (prevStep === 0) {
        // First step, empty tree
        const emptyTree = new BinaryTree();
        updateTreeStructure(emptyTree);
      }
      
      setCurrentBuildStep(prevStep);
    }
  };
  
  const resetBuildAnimation = () => {
    pauseBuildAnimation();
    setCurrentBuildStep(-1);
    updateTreeStructure(tree);
  };
  
  // Get current building step message
  const getCurrentBuildStepMessage = () => {
    if (currentBuildStep >= 0 && currentBuildStep < buildingSteps.length) {
      return buildingSteps[currentBuildStep].message;
    }
    return "No building steps";
  };
  
  return (
    <div className="tree-visualizer-container">
      <h1 className="tree-title">Binary Tree Visualizer</h1>
      <p className="tree-description">
        Explore binary trees with step-by-step visualization of construction and traversal algorithms
      </p>
      
      <div className="tree-tabs">
        <button
          className={`tree-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}>
          Create Tree
        </button>
        <button
          className={`tree-tab ${activeTab === 'traversal' ? 'active' : ''}`}
          onClick={() => setActiveTab('traversal')}>
          Tree Traversal
        </button>
        <button
          className={`tree-tab ${activeTab === 'building' ? 'active' : ''}`}
          onClick={() => setActiveTab('building')}>
          Building Steps
        </button>
        <button
          className={`tree-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}>
          Tree Info
        </button>
      </div>
      
      {/* Visualization container for the tree */}
      <div className="tree-wrapper" ref={treeContainerRef}>
        {tree.root && (
          <Tree 
            data={getTreeData(tree)}
            orientation="vertical"
            translate={{ x: dimensions.width / 2, y: 100 }}
            separation={{ siblings: 2, nonSiblings: 2.5 }}
            nodeSize={{ x: 120, y: 120 }}
            pathFunc="step"
            renderCustomNodeElement={(rd3tProps) => (
              <g>
                <circle 
                  r={30} 
                  cx={0} 
                  cy={0} 
                  fill={highlightedNodes[rd3tProps.nodeDatum.attributes.value] ? '#FF416C' : '#191d28'}
                  stroke="#FF416C"
                  strokeWidth={2}
                  className={highlightedNodes[rd3tProps.nodeDatum.attributes.value] ? 'node-highlighted' : ''}
                />
                <text 
                  fill="white" 
                  strokeWidth="0.5" 
                  fontSize="16" 
                  fontFamily="Orbitron" 
                  textAnchor="middle" 
                  y="5"
                >
                  {rd3tProps.nodeDatum.name}
                </text>
              </g>
            )}
            collapsible={false}
          />
        )}
      </div>
      
      {/* Create Tree Tab */}
      {activeTab === 'create' && (
        <div className="tree-card">
          <h2>Create Binary Tree</h2>
          
          <div className="tree-tabs">
            <button
              className={`tree-tab ${activeTab === 'create' && !usePostorder ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}>
              From Array
            </button>
            <button
              className={`tree-tab ${activeTab === 'create' ? (usePostorder ? 'active' : '') : ''}`}
              onClick={() => {
                setActiveTab('create');
                setUsePostorder(true);
              }}>
              From Traversals
            </button>
            <button
              className={`tree-tab ${activeTab === 'create' ? '' : ''}`}
              onClick={() => {
                setActiveTab('create');
                setUsePostorder(false);
              }}>
              From Sorted Array (BST)
            </button>
          </div>
          
          {!usePostorder ? (
            <>
              <div className="tree-input-group">
                <label className="tree-label">Enter comma-separated values (use 'null' for empty nodes):</label>
                <input
                  type="text"
                  className="tree-input"
                  value={arrayInput}
                  onChange={(e) => setArrayInput(e.target.value)}
                  placeholder="e.g., 1,2,3,4,5,null,7"
                />
                <div className="button-group">
                  <button className="tree-button primary" onClick={handleBuildFromArray}>
                    <FaTree /> Build Tree
                  </button>
                </div>
              </div>
              
              <div className="tree-input-group">
                <label className="tree-label">Enter sorted array for BST creation:</label>
                <input
                  type="text"
                  className="tree-input"
                  value={sortedArrayInput}
                  onChange={(e) => setSortedArrayInput(e.target.value)}
                  placeholder="e.g., 1,2,3,4,5,6,7"
                />
                <div className="button-group">
                  <button className="tree-button primary" onClick={handleBuildBST}>
                    <IoMdConstruct /> Build BST
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="tree-input-group">
              <label className="tree-label">Inorder traversal:</label>
              <input
                type="text"
                className="tree-input"
                value={inorderInput}
                onChange={(e) => setInorderInput(e.target.value)}
                placeholder="e.g., 4,2,5,1,6,3,7"
              />
              
              <div className="switch-container">
                <label className="tree-label">Use Postorder</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={usePostorder}
                    onChange={() => setUsePostorder(!usePostorder)}
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
              
              {!usePostorder ? (
                <>
                  <label className="tree-label">Preorder traversal:</label>
                  <input
                    type="text"
                    className="tree-input"
                    value={preorderInput}
                    onChange={(e) => setPreorderInput(e.target.value)}
                    placeholder="e.g., 1,2,4,5,3,6,7"
                  />
                </>
              ) : (
                <>
                  <label className="tree-label">Postorder traversal:</label>
                  <input
                    type="text"
                    className="tree-input"
                    value={postorderInput}
                    onChange={(e) => setPostorderInput(e.target.value)}
                    placeholder="e.g., 4,5,2,6,7,3,1"
                  />
                </>
              )}
              
              <div className="button-group">
                <button className="tree-button primary" onClick={handleBuildFromTraversals}>
                  <RiArrowLeftRightLine /> Build From Traversals
                </button>
              </div>
            </div>
          )}
          
          {inputError && <div className="error-message">{inputError}</div>}
        </div>
      )}
      
      {/* Tree Traversal Tab */}
      {activeTab === 'traversal' && (
        <div className="tree-card">
          <h2>Tree Traversal</h2>
          
          <div className="tree-tabs">
            <button
              className={`tree-tab ${traversalType === 'inorder' ? 'active' : ''}`}
              onClick={() => setTraversalType('inorder')}>
              Inorder
            </button>
            <button
              className={`tree-tab ${traversalType === 'preorder' ? 'active' : ''}`}
              onClick={() => setTraversalType('preorder')}>
              Preorder
            </button>
            <button
              className={`tree-tab ${traversalType === 'postorder' ? 'active' : ''}`}
              onClick={() => setTraversalType('postorder')}>
              Postorder
            </button>
            <button
              className={`tree-tab ${traversalType === 'levelorder' ? 'active' : ''}`}
              onClick={() => setTraversalType('levelorder')}>
              Level Order
            </button>
          </div>
          
          <div className="button-group">
            <button className="tree-button primary" onClick={handleTraversal}>
              Start Traversal
            </button>
          </div>
          
          {traversalSteps.length > 0 && (
            <>
              <h3>Traversal Animation</h3>
              
              <div className="tree-input-group">
                <label className="tree-label">Animation Speed:</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                />
                <span className="tree-label">{animationSpeed}ms</span>
              </div>
              
              <ProgressBar current={currentStep} total={traversalSteps.length} />
              
              <div className="button-group">
                <button className="tree-button" onClick={stepBackward} disabled={currentStep <= 0}>
                  <FaStepBackward /> Back
                </button>
                
                {isAnimating ? (
                  <button className="tree-button" onClick={pauseAnimation}>
                    <FaPause /> Pause
                  </button>
                ) : (
                  <button className="tree-button" onClick={startAnimation}>
                    <FaPlay /> {currentStep >= traversalSteps.length - 1 ? 'Restart' : 'Play'}
                  </button>
                )}
                
                <button
                  className="tree-button"
                  onClick={stepForward}
                  disabled={currentStep >= traversalSteps.length - 1}
                >
                  <FaStepForward /> Forward
                </button>
                
                <button className="tree-button" onClick={resetAnimation}>
                  <FaRedo /> Reset
                </button>
              </div>
              
              <div className="step-details">
                {currentStep >= 0 && currentStep < traversalSteps.length ? (
                  <p>{traversalSteps[currentStep].message}</p>
                ) : (
                  <p>No step selected</p>
                )}
              </div>
              
              <h3>Traversal Result</h3>
              <div className="traversal-steps">
                {traversalResults.map((result, idx) => (
                  <span key={`result-${idx}`} className="traversal-step">
                    {result}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Building Steps Tab */}
      {activeTab === 'building' && (
        <div className="tree-card">
          <h2>Tree Building Steps</h2>
          
          {buildingSteps.length > 0 ? (
            <>
              <div className="tree-input-group">
                <label className="tree-label">Animation Speed:</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={buildAnimationSpeed}
                  onChange={(e) => setBuildAnimationSpeed(parseInt(e.target.value))}
                />
                <span className="tree-label">{buildAnimationSpeed}ms</span>
              </div>
              
              <ProgressBar current={currentBuildStep} total={buildingSteps.length} />
              
              <div className="button-group">
                <button className="tree-button" onClick={stepBuildBackward} disabled={currentBuildStep <= 0}>
                  <FaStepBackward /> Back
                </button>
                
                {isBuildAnimating ? (
                  <button className="tree-button" onClick={pauseBuildAnimation}>
                    <FaPause /> Pause
                  </button>
                ) : (
                  <button className="tree-button" onClick={startBuildAnimation}>
                    <FaPlay /> {currentBuildStep >= buildingSteps.length - 1 ? 'Restart' : 'Play'}
                  </button>
                )}
                
                <button
                  className="tree-button"
                  onClick={stepBuildForward}
                  disabled={currentBuildStep >= buildingSteps.length - 1}
                >
                  <FaStepForward /> Forward
                </button>
                
                <button className="tree-button" onClick={resetBuildAnimation}>
                  <FaRedo /> Reset
                </button>
              </div>
              
              <div className="step-details">
                <p>{getCurrentBuildStepMessage()}</p>
              </div>
            </>
          ) : (
            <p className="tree-description">Create a tree first to see building steps.</p>
          )}
        </div>
      )}
      
      {/* Tree Info Tab */}
      {activeTab === 'info' && (
        <div className="tree-card">
          <h2>Binary Tree Information</h2>
          
          <h3>Tree Types</h3>
          <p>
            <strong>Binary Tree:</strong> Each node has at most two children, referred to as left child and right child.
          </p>
          <p>
            <strong>Binary Search Tree (BST):</strong> For each node, all elements in left subtree are less than the node, and all elements in right subtree are greater than the node.
          </p>
          
          <h3>Tree Traversals</h3>
          <p>
            <strong>Inorder:</strong> Left → Root → Right (Produces sorted elements in a BST)
          </p>
          <p>
            <strong>Preorder:</strong> Root → Left → Right (Used to create a copy of the tree)
          </p>
          <p>
            <strong>Postorder:</strong> Left → Right → Root (Used to delete the tree)
          </p>
          <p>
            <strong>Level Order:</strong> Visit nodes level by level from top to bottom
          </p>
          
          <h3>Tree Properties</h3>
          <p>
            <strong>Height:</strong> The number of edges on the longest path from the root to a leaf.
          </p>
          <p>
            <strong>Depth:</strong> The number of edges from the root to a node.
          </p>
          <p>
            <strong>Complete Binary Tree:</strong> All levels are filled except possibly the last, which is filled from left to right.
          </p>
          <p>
            <strong>Perfect Binary Tree:</strong> All internal nodes have two children and all leaves are at the same level.
          </p>
        </div>
      )}
    </div>
  );
};

export default TreeVisualizer;