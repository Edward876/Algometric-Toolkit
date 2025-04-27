# Algometric Toolkit

![Algometric Toolkit](https://img.shields.io/badge/Algometric-Toolkit-00c3ff?style=for-the-badge&logo=react)

A modern, interactive platform for visualizing and understanding algorithms, with a focus on educational value and aesthetic presentation. This application provides step-by-step animations of various algorithms with detailed explanations.

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Algorithm Visualizations](#algorithm-visualizations)
  - [Sorting Algorithms](#sorting-algorithms)
  - [Dynamic Programming Algorithms](#dynamic-programming-algorithms)
  - [Tree Algorithms](#tree-algorithms)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Performance Optimizations](#performance-optimizations)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## 🌟 Overview

Algometric Toolkit is an educational web application designed to help users understand complex algorithms through interactive visualizations. The toolkit includes various sorting algorithms, dynamic programming solutions, and tree-based algorithms rendered in a cyberpunk-inspired UI that makes learning both engaging and visually appealing.

The application facilitates algorithm comprehension by:
- Displaying step-by-step animation of algorithm execution
- Providing detailed explanations of each algorithm step
- Offering code implementations in multiple programming languages
- Allowing users to customize input data and algorithm parameters

## ✨ Features

- **Interactive Visualizations**: Each algorithm comes with a fully interactive visualization that allows users to see the algorithm in action.
- **Step Controls**: Play, pause, step forward/backward through algorithm execution.
- **Speed Control**: Adjust the speed of algorithm animations.
- **Custom Inputs**: Create your own data sets to visualize how algorithms behave with different inputs.
- **Detailed Explanations**: Each algorithm includes comprehensive explanations of how it works.
- **Code View**: Examine the actual implementation of each algorithm in multiple programming languages.
- **Responsive Design**: The application is fully responsive and works on desktop, tablet, and mobile devices.
- **Cyberpunk UI**: Modern, sleek design with neon accents and animated elements for an engaging user experience.
- **Accessibility**: Built with accessibility in mind, including keyboard navigation and screen reader support.

## 🧮 Algorithm Visualizations

### Sorting Algorithms

The toolkit includes visualizations for the following sorting algorithms:

1. **Bubble Sort**
   - Time Complexity: O(n²)
   - Space Complexity: O(1)
   - Visualization includes step-by-step comparison and swapping process.

2. **Selection Sort**
   - Time Complexity: O(n²)
   - Space Complexity: O(1)
   - Visualization shows the selection of the minimum element in each pass.

3. **Insertion Sort**
   - Time Complexity: O(n²)
   - Space Complexity: O(1)
   - Visualization demonstrates the insertion of elements into the sorted portion.

4. **Merge Sort**
   - Time Complexity: O(n log n)
   - Space Complexity: O(n)
   - Visualization illustrates the divide-and-conquer approach with splitting and merging.

5. **Quick Sort**
   - Time Complexity: O(n log n) average, O(n²) worst case
   - Space Complexity: O(log n)
   - Visualization highlights pivot selection, partitioning, and recursive sorting.

6. **Heap Sort**
   - Time Complexity: O(n log n)
   - Space Complexity: O(1)
   - Visualization shows the heap building process and extraction of elements.

7. **Radix Sort**
   - Time Complexity: O(nk) where k is the number of digits
   - Space Complexity: O(n+k)
   - Visualization demonstrates the process of sorting by digit position.

8. **Bucket Sort**
   - Time Complexity: O(n+k)
   - Space Complexity: O(n)
   - Visualization shows distribution into buckets and individual bucket sorting.

### Dynamic Programming Algorithms

The toolkit includes visualizations for the following dynamic programming algorithms:

1. **Knapsack Problem**
   - Visualization of the classic 0/1 knapsack problem with a table-based approach.
   - Interactive selection of items with weights and values.
   - Step-by-step filling of the dynamic programming table.

2. **Longest Common Subsequence (LCS)**
   - Visualization of finding the longest subsequence common to two sequences.
   - Interactive input of two strings/sequences.
   - Grid-based visualization of the LCS table construction and backtracking.

3. **Longest Palindromic Subsequence (LPS)**
   - Visualization of finding the longest subsequence that is a palindrome.
   - Interactive input of strings.
   - Step-by-step table filling and solution reconstruction.

### Tree Algorithms

The toolkit also includes visualizations for tree-based algorithms:

1. **Binary Trees**
   - Interactive tree construction and traversal.
   - Visualization of pre-order, in-order, and post-order traversals.
   - Operations such as insertion, deletion, and searching in binary trees.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later) or yarn (v1.22.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/algometric-toolkit.git
   cd algometric-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Running the Application

1. Development mode:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   This will start the development server at `http://localhost:5173/`.

2. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

3. Preview production build:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## 📖 Usage Guide

### General Navigation

1. **Home Page**: The main page showcases featured algorithms and provides quick access to different sections.
2. **Navigation Bar**: Use the top navigation bar to access different algorithm categories:
   - Sorting Algorithms
   - Other Algorithms
   - Tree Algorithms

3. **Algorithm Selection**: Click on the dropdown menus to select specific algorithms to visualize.

### Using Algorithm Visualizers

Each algorithm visualization page includes the following components:

1. **Control Panel**: Contains buttons to control the visualization:
   - Play/Pause: Start or pause the animation
   - Step Forward/Backward: Move through the algorithm one step at a time
   - Reset: Return to the initial state
   - Speed Control: Adjust the speed of the animation

2. **Input Section**: Customize the input data:
   - Array Size (for sorting algorithms)
   - Generate Random Input
   - Input Custom Data
   - Select Specific Scenarios (Best case, Average case, Worst case)

3. **Visualization Area**: The main area that displays the algorithm in action.

4. **Information Panel**: Provides real-time explanation of the current step.

5. **Code View**: Shows the implementation of the algorithm in your choice of programming language.

6. **Complexity Information**: Displays time and space complexity information.

## 🏗️ Architecture

The application is built with a modular architecture using React components:

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components
│   ├── SortingVisualizers/
│   ├── DPVisualizers/
│   └── TreeVisualizers/
├── hooks/          # Custom React hooks
├── utils/          # Utility functions and algorithm implementations
├── context/        # React Context API implementations
├── styles/         # Global styles and theme definitions
├── App.jsx         # Main application component
└── main.jsx        # Entry point
```

### Component Architecture

Each algorithm visualizer follows a similar structure:

1. **Controller Component**: Manages the state of the visualization.
2. **Visualization Component**: Renders the actual visualization.
3. **InfoPanel Component**: Displays information about the current step.
4. **CodeView Component**: Displays the algorithm implementation.

## 💻 Technology Stack

- **Frontend Framework**: React with hooks and context API
- **Build Tool**: Vite
- **Styling**: Styled Components with CSS animations
- **Animations**: Framer Motion
- **Routing**: React Router
- **State Management**: React Context API
- **Code Highlighting**: Prism.js
- **Icons**: Font Awesome

## ⚡ Performance Optimizations

The application includes several performance optimizations:

1. **Code Splitting**: Components are loaded on demand using React's lazy loading.
2. **Memoization**: React.memo and useMemo are used to prevent unnecessary re-renders.
3. **Virtualization**: For large datasets, virtualization is used to render only the visible elements.
4. **Web Workers**: Intensive computations are offloaded to web workers to prevent UI freezing.
5. **Efficient Animations**: Animations are optimized using CSS transforms and opacity.

## 🎨 Customization

### Theming

The application uses a cyberpunk theme by default, but the styling can be easily customized:

1. **Color Scheme**: Edit the theme variables in `src/styles/theme.js`.
2. **Animations**: Modify animation parameters in the Framer Motion components.
3. **Fonts**: Change the font families in the global CSS.

### Adding New Algorithms

To add a new algorithm visualization:

1. Create a new component in the appropriate directory.
2. Implement the algorithm in `src/utils/algorithms/`.
3. Add a new route in `App.jsx`.
4. Add a new entry in the navigation menu.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [React](https://reactjs.org/) - The web framework used
- [Vite](https://vitejs.dev/) - Frontend tooling
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Styled Components](https://styled-components.com/) - Styling solution
- [React Router](https://reactrouter.com/) - Routing solution

---

Built with ❤️ by Supratim Saha. Last updated: April 27, 2025.

*Note: This project is continuously evolving. Check back for updates and new algorithm visualizations!*
