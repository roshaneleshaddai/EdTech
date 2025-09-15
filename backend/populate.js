// backend/populate.js

// Ensure environment variables are loaded FIRST
// Adjust the path if your .env file is not in the same directory as populate.js
require("dotenv").config({ path: "./.env" });

const mongoose = require("mongoose");
const connectDB = require("./config/db"); // Your existing DB connection file
const Course = require("./models/Course"); // Your Course model
const Module = require("./models/Module"); // Your Module model
const User = require("./models/User"); // Your User model (needed for instructor reference)

// --- IMPORTANT: REPLACE THIS WITH YOUR ACTUAL INSTRUCTOR USER _id ---
// You must get this from your MongoDB 'users' collection.
// Example: If your user _id is "65f7c8d9e0a1b2c3d4e5f6g7", put that string here.
const INSTRUCTOR_USER_OID = "68c5ba603f225e4ff38f8628"; // <<< REPLACED WITH ADMIN USER ID! <<<

// --- DATA DEFINITION ---
// This data is structured to match your finalized Course and Module schemas.
// All `timestamps` and `_id` fields will be handled automatically by Mongoose/MongoDB.

const coursesToCreate = [
  {
    customId: "web_dev_fundamentals",
    title: "Web Development Fundamentals: From Zero to Hero",
    description:
      "A comprehensive course covering the core technologies of web development: HTML, CSS, and JavaScript. Designed for absolute beginners with no prior coding experience.",
    estimatedDuration: "10 hours",
    difficulty: "Beginner",
    category: "Web Development",
    tags: ["HTML", "CSS", "JavaScript", "Frontend", "Beginner", "Web Basics"],
    finalProject: {
      title: "Responsive Personal Portfolio Website",
      description:
        "Build a multi-page responsive portfolio website to showcase your skills. It must include an 'About Me', 'Projects', and 'Contact' section.",
      requirements: [
        "Semantic HTML",
        "Responsive Design (Mobile-first)",
        "Interactive JS elements",
        "Form Validation",
      ],
      evaluationCriteria: [
        "Code quality",
        "Design responsiveness",
        "Functionality",
        "UI/UX principles",
      ],
      aiProjectGenerationPrompt:
        "Generate a final project for a beginner web dev course: personal portfolio.",
    },
    isPredefined: true,
    isPublic: true,
    thumbnail: "https://example.com/thumbnails/web_dev.jpg",
    rating: { average: 0, count: 0 },
    enrollmentCount: 0,
    completionCount: 0,
    aiGenerationMetadata: {
      modelUsed: "gemini-1.5-pro",
      initialPrompt: "Design a beginner web development course.",
      timestamp: new Date("2025-09-15T09:00:00.000Z"),
    },
  },
  {
    customId: "python_data_science",
    title: "Python for Data Science: Crash Course",
    description:
      "An accelerated introduction to Python programming for data analysis, visualization, and machine learning fundamentals. Ideal for aspiring data scientists.",
    estimatedDuration: "15 hours",
    difficulty: "Intermediate",
    category: "Data Science",
    tags: [
      "Python",
      "Data Analysis",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Machine Learning",
    ],
    finalProject: {
      title: "Exploratory Data Analysis on a Real Dataset",
      description:
        "Choose a public dataset, perform EDA using Pandas/NumPy, visualize insights with Matplotlib/Seaborn, and present your findings.",
      requirements: [
        "Data loading & cleaning",
        "Descriptive statistics",
        "At least 5 visualizations",
        "Interpretation of results",
      ],
      evaluationCriteria: [
        "Data handling",
        "Quality of visualizations",
        "Depth of analysis",
        "Clarity of presentation",
      ],
      aiProjectGenerationPrompt:
        "Generate a final project for an intermediate Python data science course focusing on EDA.",
    },
    isPredefined: true,
    isPublic: true,
    thumbnail: "https://example.com/thumbnails/python_ds.jpg",
    rating: { average: 0, count: 0 },
    enrollmentCount: 0,
    completionCount: 0,
    aiGenerationMetadata: {
      modelUsed: "gemini-1.5-pro",
      initialPrompt: "Outline an intermediate Python course for data science.",
      timestamp: new Date("2025-09-15T09:10:00.000Z"),
    },
  },
  {
    customId: "ux_design_principles",
    title: "UI/UX Design: Foundations & Best Practices",
    description:
      "Explore the fundamental principles of User Interface (UI) and User Experience (UX) design. Learn how to create intuitive, accessible, and delightful digital products.",
    estimatedDuration: "8 hours",
    difficulty: "Beginner",
    category: "UI/UX",
    tags: [
      "UI Design",
      "UX Design",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Figma",
    ],
    finalProject: {
      title: "Design a Mobile App Concept & Prototype",
      description:
        "Based on a chosen problem, design a mobile app concept from user research to a clickable prototype in Figma (or similar tool).",
      requirements: [
        "Problem statement",
        "User personas",
        "User flows",
        "Low-fidelity wireframes",
        "High-fidelity prototype",
        "Usability testing plan",
      ],
      evaluationCriteria: [
        "User-centered approach",
        "Adherence to design principles",
        "Prototype quality",
        "Presentation of findings",
      ],
      aiProjectGenerationPrompt:
        "Generate a final project for a beginner UI/UX course: mobile app concept.",
    },
    isPredefined: true,
    isPublic: true,
    thumbnail: "https://example.com/thumbnails/ui_ux.jpg",
    rating: { average: 0, count: 0 },
    enrollmentCount: 0,
    completionCount: 0,
    aiGenerationMetadata: {
      modelUsed: "gemini-1.5-pro",
      initialPrompt: "Create a beginner UI/UX design course.",
      timestamp: new Date("2025-09-15T09:20:00.000Z"),
    },
  },
  {
    customId: "aws_cloud_essentials",
    title: "AWS Cloud Computing: The Absolute Basics",
    description:
      "Get started with Amazon Web Services (AWS) and understand core cloud concepts. This course covers foundational services like EC2, S3, and IAM for beginners.",
    estimatedDuration: "12 hours",
    difficulty: "Beginner",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud", "EC2", "S3", "IAM", "VPC", "Serverless", "DevOps"],
    finalProject: {
      title: "Deploy a Simple Web Application to AWS S3 & CloudFront",
      description:
        "Deploy a static website to AWS S3, configure it for web hosting, and distribute it globally using Amazon CloudFront.",
      requirements: [
        "Static HTML/CSS/JS website",
        "S3 bucket configuration",
        "CloudFront distribution setup",
        "Custom domain (optional)",
      ],
      evaluationCriteria: [
        "Successful deployment",
        "Website accessibility",
        "CloudFront caching efficiency",
        "Security best practices",
      ],
      aiProjectGenerationPrompt:
        "Generate a final project for a beginner AWS course: static website deployment on S3/CloudFront.",
    },
    isPredefined: true,
    isPublic: true,
    thumbnail: "https://example.com/thumbnails/aws_cloud.jpg",
    rating: { average: 0, count: 0 },
    enrollmentCount: 0,
    completionCount: 0,
    aiGenerationMetadata: {
      modelUsed: "gemini-1.5-pro",
      initialPrompt: "Design a beginner course for AWS cloud fundamentals.",
      timestamp: new Date("2025-09-15T09:30:00.000Z"),
    },
  },
];

const modulesToCreate = [
  // --- Web Development Fundamentals Modules ---
  {
    courseCustomId: "web_dev_fundamentals", // Temporary field to link to course
    customId: "html_structure_basics",
    title: "Module 1: HTML Structure & Semantic Tags",
    description:
      "Master the fundamental building blocks of all web pages with HTML. Learn about document structure, essential tags, and semantic HTML for better accessibility and SEO.",
    topics: [
      "HTML5 basics",
      "Document Structure",
      "Tags and Elements",
      "Attributes",
      "Semantic HTML",
    ],
    duration: "90 minutes",
    order: 0,
    type: "lesson",
    content: {
      videoScript:
        "Hello! Let's build your first webpage using HTML. We'll cover everything from the DOCTYPE to creating paragraphs, headings, lists, and linking images. Pay close attention to how we nest elements to create logical structure.",
      keyConcepts: [
        "HTML document structure",
        "Common HTML tags",
        "Semantic elements",
        "Block vs. Inline elements",
      ],
      practicalExamples: [
        "Basic personal bio page",
        "Simple recipe card",
        "List of favorite things",
      ],
      handsOnActivity:
        "Create an HTML document for a fictional personal blog post, including a title, author, date, paragraphs, and an image.",
      aiPrompts: [
        "Generate an HTML intro lesson",
        "Describe an HTML hands-on activity",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 400,
        timestamp: new Date("2025-09-15T09:05:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated HTML tag library",
        "3D browser rendering HTML document",
        "Interactive HTML structure builder",
      ],
    },
    prerequisites: [],
    learningObjectives: [
      "Understand HTML syntax",
      "Create basic web page structures",
      "Use common HTML tags for content",
    ],
  },
  {
    courseCustomId: "web_dev_fundamentals",
    customId: "css_styling_essentials",
    title: "Module 2: CSS Styling Essentials",
    description:
      "Transform plain HTML into visually engaging web designs. Learn about CSS selectors, properties, the box model, and fundamental layout techniques with Flexbox.",
    topics: [
      "CSS Syntax",
      "Selectors",
      "Properties",
      "Box Model",
      "Flexbox",
      "Colors",
      "Fonts",
      "Backgrounds",
    ],
    duration: "1 hour 30 minutes",
    order: 1,
    type: "lesson",
    content: {
      videoScript:
        "Time to make things pretty! This module focuses on CSS. We'll explore how to target specific HTML elements, apply styles for colors, fonts, and backgrounds, and master the box model—the secret to spacing on the web.",
      keyConcepts: [
        "CSS rules & declarations",
        "Type, class, ID selectors",
        "The Box Model (margin, border, padding, content)",
        "Color values (hex, rgb, named)",
      ],
      practicalExamples: [
        "Styling a navigation bar",
        "Creating a custom button",
        "Applying a theme to your blog post",
      ],
      handsOnActivity:
        "Style the blog post HTML from the previous module. Change font styles, colors, add a background image, and use padding/margin to space elements.",
      aiPrompts: [
        "Generate a CSS styling module lesson",
        "Describe CSS box model visuals",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 450,
        timestamp: new Date("2025-09-15T09:15:00.000Z"),
      },
      visualAssetDescriptions: [
        "Interactive CSS box model visualizer",
        "3D demonstration of CSS cascade",
        "Color wheel for web design",
      ],
    },
    prerequisites: ["html_structure_basics"],
    learningObjectives: [
      "Apply CSS to HTML elements",
      "Understand CSS selectors and specificity",
      "Master the CSS Box Model",
    ],
  },
  {
    courseCustomId: "web_dev_fundamentals",
    customId: "js_intro_dom",
    title: "Module 3: JavaScript & DOM Interaction",
    description:
      "Unlock interactivity on your webpages with JavaScript. Learn fundamental programming concepts and how to manipulate the Document Object Model (DOM).",
    topics: [
      "Variables",
      "Data Types",
      "Operators",
      "Functions",
      "Conditional Logic",
      "DOM Manipulation",
      "Event Listeners",
    ],
    duration: "2 hours",
    order: 2,
    type: "lesson",
    content: {
      videoScript:
        "JavaScript brings your pages to life! We'll start with basic programming concepts like variables and functions. Then, we'll learn how to interact with your HTML using the DOM, and make things happen with event listeners, like clicking buttons to change content.",
      keyConcepts: [
        "JavaScript variables & data types",
        "Functions",
        "If/else statements",
        "DOM (Document Object Model)",
        "Event handling",
      ],
      practicalExamples: [
        "Simple button click counter",
        "Text content changer",
        "Basic form validation",
      ],
      handsOnActivity:
        "Add a button to your blog post that, when clicked, changes the main heading's text and color using JavaScript.",
      aiPrompts: [
        "Generate a JS intro lesson plan",
        "Explain DOM manipulation simply",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 500,
        timestamp: new Date("2025-09-15T09:25:00.000Z"),
      },
      visualAssetDescriptions: [
        "Interactive JS console simulation",
        "3D representation of DOM hierarchy",
        "Event listener flow diagram animation",
      ],
    },
    prerequisites: ["css_styling_essentials"],
    learningObjectives: [
      "Understand basic JS programming",
      "Manipulate HTML/CSS with JS",
      "Respond to user interactions",
    ],
  },
  {
    courseCustomId: "web_dev_fundamentals",
    customId: "responsive_flexbox",
    title: "Module 4: Responsive Design with Flexbox & Media Queries",
    description:
      "Ensure your websites look great on any device, from mobile phones to large desktops, using responsive design principles.",
    topics: [
      "Responsive Web Design",
      "Viewport Meta Tag",
      "Media Queries",
      "Flexbox for Layouts",
      "Mobile-first approach",
    ],
    duration: "1 hour 45 minutes",
    order: 3,
    type: "lesson",
    content: {
      videoScript:
        "In today's world, websites must work on all screen sizes. This module introduces Responsive Web Design using CSS Media Queries and advanced Flexbox techniques to adapt your layouts dynamically.",
      keyConcepts: [
        "Viewport configuration",
        "Breakpoints",
        "Flexbox properties for responsiveness",
        "Mobile-first design strategy",
      ],
      practicalExamples: [
        "Creating a responsive navigation menu",
        "Building a flexible grid of product cards",
        "Adapting a landing page for mobile",
      ],
      handsOnActivity:
        "Refactor your personal blog post to be fully responsive using Flexbox for layout and media queries for specific breakpoints (e.g., mobile, tablet, desktop).",
      aiPrompts: [
        "Generate a module on responsive design",
        "Explain media queries visually",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 480,
        timestamp: new Date("2025-09-15T09:35:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated screen resizing effect on a website",
        "3D demonstration of Flexbox item wrapping",
        "Interactive media query simulator",
      ],
    },
    prerequisites: ["js_intro_dom"],
    learningObjectives: [
      "Implement responsive design using CSS",
      "Utilize Flexbox for complex layouts",
      "Apply media queries effectively",
    ],
  },
  {
    courseCustomId: "web_dev_fundamentals",
    customId: "web_dev_final_project_prep",
    title: "Module 5: Final Project Preparation & Review",
    description:
      "Review all core concepts and prepare for building your final responsive portfolio project. This module covers best practices and common pitfalls.",
    topics: [
      "Review HTML, CSS, JS",
      "Project Planning",
      "Debugging Tips",
      "Deployment Basics (brief)",
      "Version Control Intro",
    ],
    duration: "1 hour",
    order: 4,
    type: "summary",
    content: {
      videoScript:
        "You've learned a lot! This final module helps consolidate your HTML, CSS, and JavaScript knowledge. We'll outline strategies for approaching your final portfolio project, discuss debugging techniques, and briefly touch on getting your site online.",
      keyConcepts: [
        "Consolidated web dev workflow",
        "Effective debugging strategies",
        "Introduction to Git/GitHub for project management",
        "Final project structure",
      ],
      practicalExamples: [
        "Reviewing previous exercises for improvements",
        "Setting up a basic GitHub repository",
        "Planning project milestones",
      ],
      handsOnActivity:
        "Outline the full plan for your personal portfolio website. Include a sitemap, wireframe sketches, and a list of key features for each page.",
      aiPrompts: [
        "Generate project prep module",
        "Suggest web dev best practices",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 420,
        timestamp: new Date("2025-09-15T09:45:00.000Z"),
      },
      visualAssetDescriptions: [
        "Interactive project management board",
        "3D model of a deployment pipeline",
        "Code review annotation tool",
      ],
    },
    prerequisites: ["responsive_flexbox"],
    learningObjectives: [
      "Consolidate web development knowledge",
      "Plan and strategize for a web project",
      "Apply basic debugging and project management skills",
    ],
  },

  // --- Python for Data Science Modules ---
  {
    courseCustomId: "python_data_science",
    customId: "python_basics_ds",
    title: "Module 1: Python Basics for Data Science",
    description:
      "Start your journey into data science with a strong foundation in Python programming. Covers variables, data types, control flow, and functions.",
    topics: [
      "Python syntax",
      "Variables",
      "Data types",
      "Operators",
      "Control flow",
      "Functions",
      "Basic I/O",
    ],
    duration: "2 hours",
    order: 0,
    type: "lesson",
    content: {
      videoScript:
        "Welcome to Python! This module is your gateway to data science. We'll cover Python's fundamental syntax, how to store data in variables, make decisions with if/else, and repeat actions with loops. By the end, you'll be writing simple Python scripts.",
      keyConcepts: [
        "Variables & Assignment",
        "Integers, Floats, Strings, Booleans",
        "Comparison & Logical Operators",
        "For & While Loops",
        "Defining Functions",
      ],
      practicalExamples: [
        "Simple calculator",
        "Guess the number game",
        "Looping through lists",
      ],
      handsOnActivity:
        "Write a Python script that calculates the area of a rectangle. Ask the user for length and width, then print the result.",
      aiPrompts: [
        "Generate Python basics lesson",
        "Suggest Python practice problems",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 380,
        timestamp: new Date("2025-09-15T09:50:00.000Z"),
      },
      visualAssetDescriptions: [
        "Python code editor with syntax highlighting",
        "3D representation of data types",
        "Flowchart animation of Python control flow",
      ],
    },
    prerequisites: [],
    learningObjectives: [
      "Write basic Python code",
      "Understand core data types",
      "Use control flow and functions",
    ],
  },
  {
    courseCustomId: "python_data_science",
    customId: "numpy_pandas_data",
    title: "Module 2: NumPy & Pandas for Data Manipulation",
    description:
      "Master the two most crucial libraries for data scientists: NumPy for numerical operations and Pandas for data manipulation and analysis.",
    topics: [
      "NumPy arrays",
      "array operations",
      "Pandas DataFrames",
      "Series",
      "data loading",
      "data cleaning",
      "indexing",
      "grouping",
    ],
    duration: "3 hours",
    order: 1,
    type: "lesson",
    content: {
      videoScript:
        "NumPy and Pandas are the backbone of data science in Python. This module will show you how to efficiently handle numerical data with NumPy arrays and transform messy datasets into clean, analyzable structures using Pandas DataFrames. We'll cover loading, cleaning, filtering, and grouping data.",
      keyConcepts: [
        "NumPy arrays vs. Python lists",
        "Vectorized operations",
        "Pandas DataFrame structure",
        "Reading CSV/Excel",
        "Missing data handling (dropna, fillna)",
        "groupby()",
      ],
      practicalExamples: [
        "Calculating statistics on stock data",
        "Analyzing sales records",
        "Cleaning a customer feedback dataset",
      ],
      handsOnActivity:
        "Load a CSV file into a Pandas DataFrame. Clean any missing values, calculate the average of a numerical column, and filter rows based on a condition.",
      aiPrompts: [
        "Generate a NumPy/Pandas lesson",
        "Explain DataFrame operations",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 520,
        timestamp: new Date("2025-09-15T10:00:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated NumPy array operations",
        "3D visualization of DataFrame structure",
        "Interactive data cleaning demo",
      ],
    },
    prerequisites: ["python_basics_ds"],
    learningObjectives: [
      "Perform numerical operations with NumPy",
      "Manipulate and analyze data with Pandas DataFrames",
      "Handle missing data and group data",
    ],
  },
  {
    courseCustomId: "python_data_science",
    customId: "data_viz_python",
    title: "Module 3: Data Visualization with Matplotlib & Seaborn",
    description:
      "Learn to effectively communicate your data insights through compelling visualizations using Matplotlib and Seaborn.",
    topics: [
      "Matplotlib basics",
      "line plots",
      "scatter plots",
      "histograms",
      "bar charts",
      "Seaborn enhancements",
      "figure & axes customization",
    ],
    duration: "2 hours 30 minutes",
    order: 2,
    type: "lesson",
    content: {
      videoScript:
        "Visualizing data is key to telling its story. This module teaches you how to create various plots like line, bar, scatter, and histograms using Matplotlib. We'll then enhance these with Seaborn for more aesthetically pleasing and statistically informative graphics.",
      keyConcepts: [
        "Matplotlib figure and axes",
        "Plot types",
        "Customizing plots",
        "Seaborn's statistical plots (e.g., distplot, pairplot)",
        "Choosing the right visualization",
      ],
      practicalExamples: [
        "Plotting stock price trends",
        "Visualizing customer demographics",
        "Comparing sales across categories",
      ],
      handsOnActivity:
        "Using the dataset from the previous module, create a histogram of a numerical column, a bar chart comparing two categorical columns, and a scatter plot of two numerical columns.",
      aiPrompts: [
        "Generate data visualization module",
        "Suggest plot types for data",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 480,
        timestamp: new Date("2025-09-15T10:10:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated chart gallery",
        "3D data point visualization",
        "Interactive plot customization interface",
      ],
    },
    prerequisites: ["numpy_pandas_data"],
    learningObjectives: [
      "Create various types of plots with Matplotlib",
      "Enhance visualizations with Seaborn",
      "Interpret and customize data graphics",
    ],
  },
  {
    courseCustomId: "python_data_science",
    customId: "intro_ml_sklearn",
    title: "Module 4: Introduction to Machine Learning with Scikit-learn",
    description:
      "Get your first taste of machine learning. Understand supervised vs. unsupervised learning and implement simple models using Scikit-learn.",
    topics: [
      "ML concepts",
      "supervised learning",
      "unsupervised learning",
      "model training",
      "prediction",
      "evaluation",
      "linear regression",
      "k-means clustering",
    ],
    duration: "3 hours",
    order: 3,
    type: "lesson",
    content: {
      videoScript:
        "Machine Learning is transforming industries! This module demystifies ML concepts, distinguishing between supervised and unsupervised learning. We'll use the powerful Scikit-learn library to build and evaluate your first predictive models like Linear Regression.",
      keyConcepts: [
        "Features & Labels",
        "Training & Testing Data",
        "Overfitting & Underfitting",
        "Linear Regression algorithm",
        "K-Means Clustering algorithm",
      ],
      practicalExamples: [
        "Predicting house prices",
        "Classifying emails as spam/not-spam",
        "Grouping customers into segments",
      ],
      handsOnActivity:
        "Using a simple dataset (e.g., housing prices), implement a Linear Regression model using Scikit-learn to predict a target variable.",
      aiPrompts: ["Generate ML intro module", "Explain supervised learning"],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 500,
        timestamp: new Date("2025-09-15T10:20:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated ML model training process",
        "3D visualization of regression line",
        "Interactive clustering demo",
      ],
    },
    prerequisites: ["data_viz_python"],
    learningObjectives: [
      "Distinguish ML paradigms",
      "Implement simple ML models",
      "Evaluate model performance",
    ],
  },
  {
    courseCustomId: "python_data_science",
    customId: "python_ds_case_study",
    title: "Module 5: Case Study: Analyzing a Retail Dataset",
    description:
      "Apply your Python, Pandas, Matplotlib, and Scikit-learn skills to a realistic retail dataset for a practical data science project.",
    topics: [
      "End-to-end data analysis",
      "problem definition",
      "data acquisition",
      "cleaning",
      "EDA",
      "modeling",
      "interpretation",
      "presentation",
    ],
    duration: "4 hours",
    order: 4,
    type: "project",
    content: {
      videoScript:
        "This final module is a hands-on case study. We'll work through a complete data science pipeline using a retail dataset, from defining the problem to presenting actionable insights. This integrates all skills learned.",
      keyConcepts: [
        "Project lifecycle in DS",
        "Business understanding",
        "Data storytelling",
        "Cross-validation (briefly)",
      ],
      practicalExamples: [
        "Identifying top-selling products",
        "Predicting customer churn",
        "Optimizing marketing campaigns",
      ],
      handsOnActivity:
        "Given a transactional retail dataset, identify trends, build a customer segmentation model (e.g., K-Means), and visualize your findings.",
      aiPrompts: [
        "Generate DS case study",
        "Suggest retail dataset analysis ideas",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 550,
        timestamp: new Date("2025-09-15T10:30:00.000Z"),
      },
      visualAssetDescriptions: [
        "3D dashboard of retail KPIs",
        "Animated customer journey map",
        "Interactive sales forecasting chart",
      ],
    },
    prerequisites: ["intro_ml_sklearn"],
    learningObjectives: [
      "Execute a full data science project",
      "Integrate multiple Python libraries",
      "Communicate data-driven insights effectively",
    ],
  },

  // --- UI/UX Design Modules ---
  {
    courseCustomId: "ux_design_principles",
    customId: "ui_ux_intro",
    title: "Module 1: Introduction to UI/UX Design",
    description:
      "Understand what UI and UX design are, their importance, and how they differ yet complement each other in product development.",
    topics: [
      "What is UI/UX?",
      "Importance of good design",
      "User-centered design",
      "Design Thinking process",
      "Design roles",
    ],
    duration: "1 hour 15 minutes",
    order: 0,
    type: "introduction",
    content: {
      videoScript:
        "Welcome to the world of UI/UX design! This module clarifies the often-confused terms UI and UX, explaining how one focuses on aesthetics and the other on user journey. We'll highlight why great design is crucial for product success.",
      keyConcepts: [
        "User Interface (UI)",
        "User Experience (UX)",
        "Usability",
        "Accessibility",
        "Empathy in design",
      ],
      practicalExamples: [
        "Analyzing good vs. bad app designs",
        "Identifying UX problems in daily objects",
      ],
      handsOnActivity:
        "Choose a commonly used app and list 3 good UI elements and 3 good UX flows you observe. Justify your choices.",
      aiPrompts: [
        "Generate intro to UI/UX lesson",
        "Explain UI vs UX differences",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 350,
        timestamp: new Date("2025-09-15T10:35:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated infographic: UI vs UX",
        "3D demonstration of user journey mapping",
        "Virtual workspace for design brainstorming",
      ],
    },
    prerequisites: [],
    learningObjectives: [
      "Define UI and UX",
      "Explain the value of good design",
      "Differentiate UI from UX roles",
    ],
  },
  {
    courseCustomId: "ux_design_principles",
    customId: "ui_ux_user_research",
    title: "Module 2: User Research & Persona Creation",
    description:
      "Learn to understand your users through various research methods. Develop detailed user personas to guide your design decisions.",
    topics: [
      "User research methods",
      "Interviews",
      "Surveys",
      "Usability testing intro",
      "Persona development",
      "Empathy maps",
    ],
    duration: "2 hours",
    order: 1,
    type: "lesson",
    content: {
      videoScript:
        "Great design starts with understanding people. This module delves into user research, teaching you how to gather insights through interviews and surveys. You'll then synthesize this data to create compelling user personas and empathy maps.",
      keyConcepts: [
        "Qualitative vs. Quantitative research",
        "User interviews best practices",
        "Survey design",
        "User persona components",
        "Empathy map structure",
      ],
      practicalExamples: [
        "Conducting a mini-interview with a friend",
        "Creating a survey for a hypothetical app",
        "Developing a persona for an e-commerce user",
      ],
      handsOnActivity:
        "Interview 2-3 people about their experience using a specific app. Based on their feedback, create one detailed user persona for that app.",
      aiPrompts: [
        "Generate user research module",
        "Explain persona creation process",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 420,
        timestamp: new Date("2025-09-15T10:45:00.000Z"),
      },
      visualAssetDescriptions: [
        "Interactive user research toolkit",
        "3D animated persona development",
        "Virtual user interview simulation",
      ],
    },
    prerequisites: ["ui_ux_intro"],
    learningObjectives: [
      "Apply basic user research methods",
      "Create effective user personas",
      "Develop empathy maps for deeper insights",
    ],
  },
  {
    courseCustomId: "ux_design_principles",
    customId: "ui_ux_wireframing",
    title: "Module 3: Wireframing & Prototyping",
    description:
      "Translate your research into tangible designs. Learn to create low-fidelity wireframes and clickable prototypes using design tools.",
    topics: [
      "Wireframes (lo-fi vs hi-fi)",
      "Prototyping",
      "Figma basics",
      "User flows",
      "Information architecture",
      "Sketching",
    ],
    duration: "2 hours 30 minutes",
    order: 2,
    type: "lesson",
    content: {
      videoScript:
        "From ideas to interaction! This module bridges research to design. You'll learn the power of wireframes for structuring layouts and prototyping tools like Figma to create clickable user flows, bringing your concepts to life.",
      keyConcepts: [
        "Wireframe fidelity",
        "Prototyping stages",
        "Figma interface basics",
        "User flow mapping",
        "Information architecture principles",
      ],
      practicalExamples: [
        "Sketching wireframes for a new feature",
        "Building a clickable prototype in Figma for an onboarding flow",
      ],
      handsOnActivity:
        "Design low-fidelity wireframes for a simple mobile app (e.g., a to-do list app) on paper or using a digital tool. Then, create a basic clickable prototype in Figma for its main user flow.",
      aiPrompts: [
        "Generate wireframing lesson",
        "Explain prototyping with Figma",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 480,
        timestamp: new Date("2025-09-15T10:55:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated wireframe to prototype transformation",
        "3D interactive Figma workspace tour",
        "Virtual whiteboard for collaborative wireframing",
      ],
    },
    prerequisites: ["ui_ux_user_research"],
    learningObjectives: [
      "Create low-fidelity wireframes",
      "Develop clickable prototypes",
      "Utilize a design tool like Figma for basic prototyping",
    ],
  },
  {
    courseCustomId: "ux_design_principles",
    customId: "ui_ux_usability_testing",
    title: "Module 4: Usability Testing & Iteration",
    description:
      "Learn how to evaluate your designs effectively by conducting usability tests and using feedback to iterate and improve.",
    topics: [
      "Usability testing methods",
      "Test planning",
      "Moderated vs. unmoderated tests",
      "Analyzing results",
      "Iterative design",
      "Heuristic evaluation",
    ],
    duration: "1 hour 45 minutes",
    order: 3,
    type: "lesson",
    content: {
      videoScript:
        "How do you know if your design works? Usability testing! This module guides you through planning, conducting, and analyzing usability tests. You'll learn how to gather crucial feedback and apply it in an iterative design process to continuously improve your product.",
      keyConcepts: [
        "Usability principles",
        "Test scenario creation",
        "Observing user behavior",
        "Synthesizing feedback",
        "Iterative design cycle",
      ],
      practicalExamples: [
        "Planning a usability test for your prototype",
        "Analyzing simulated test results to find pain points",
      ],
      handsOnActivity:
        "Create a simple usability test plan for the Figma prototype you built in Module 3. Define tasks, metrics, and questions for participants.",
      aiPrompts: [
        "Generate usability testing module",
        "Explain iterative design process",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 400,
        timestamp: new Date("2025-09-15T11:05:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated usability test setup",
        "3D data visualization for test results",
        "Virtual user testing environment",
      ],
    },
    prerequisites: ["ui_ux_wireframing"],
    learningObjectives: [
      "Plan and conduct basic usability tests",
      "Analyze user feedback effectively",
      "Apply iterative design principles for improvement",
    ],
  },
  {
    courseCustomId: "ux_design_principles",
    customId: "ui_ux_design_systems",
    title: "Module 5: Introduction to Design Systems",
    description:
      "Explore the concept of design systems and their benefits for consistency, scalability, and efficiency in design and development workflows.",
    topics: [
      "What is a design system?",
      "Components",
      "Guidelines",
      "Tokenization",
      "Benefits",
      "Maintenance",
    ],
    duration: "1 hour 30 minutes",
    order: 4,
    type: "lesson",
    content: {
      videoScript:
        "Design systems are essential for modern product teams. This module introduces you to creating scalable, consistent designs by leveraging component libraries, style guides, and design tokens to streamline your workflow.",
      keyConcepts: [
        "Single Source of Truth",
        "Atomic Design principles (briefly)",
        "Component libraries",
        "Style guides",
        "Design tokens",
      ],
      practicalExamples: [
        "Analyzing existing design systems (e.g., Material Design, Apple Human Interface Guidelines)",
        "Identifying components in an app",
      ],
      handsOnActivity:
        "Choose a small section of an existing website or app. Identify reusable UI components and define a few basic design tokens (e.g., primary color, font-size-body) that could form part of a design system for it.",
      aiPrompts: [
        "Generate design systems intro module",
        "Explain design tokens",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 380,
        timestamp: new Date("2025-09-15T11:15:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated design system component library",
        "3D demonstration of component reusability",
        "Virtual collaborative design system environment",
      ],
    },
    prerequisites: ["ui_ux_usability_testing"],
    learningObjectives: [
      "Understand the purpose of design systems",
      "Identify core components of a design system",
      "Recognize benefits for design and development workflows",
    ],
  },

  // --- AWS Cloud Computing Modules ---
  {
    courseCustomId: "aws_cloud_essentials",
    customId: "aws_intro_cloud",
    title: "Module 1: Introduction to Cloud Computing & AWS",
    description:
      "Start your cloud journey by understanding what cloud computing is, its benefits, and the foundational concepts of Amazon Web Services (AWS).",
    topics: [
      "Cloud computing concepts",
      "IaaS, PaaS, SaaS",
      "AWS global infrastructure",
      "Regions & AZs",
      "Core AWS services overview",
    ],
    duration: "1 hour",
    order: 0,
    type: "introduction",
    content: {
      videoScript:
        "What is the cloud and why is everyone talking about AWS? This module demystifies cloud computing, explains its different service models, and introduces you to the vast global infrastructure and key services of Amazon Web Services.",
      keyConcepts: [
        "Cloud benefits (elasticity, pay-as-you-go)",
        "IaaS, PaaS, SaaS models",
        "AWS Regions, Availability Zones, Edge Locations",
        "Overview of EC2, S3, Lambda, VPC",
      ],
      practicalExamples: [
        "Comparing on-premise vs. cloud benefits for a startup",
        "Identifying service models in everyday apps",
      ],
      handsOnActivity:
        "Research and describe a real-world company that significantly benefited from migrating to cloud computing. Which specific benefits were most impactful?",
      aiPrompts: ["Generate cloud intro lesson", "Explain AWS infrastructure"],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 370,
        timestamp: new Date("2025-09-15T11:20:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated cloud vs. on-premise comparison",
        "3D globe showing AWS regions",
        "Interactive AWS service tree diagram",
      ],
    },
    prerequisites: [],
    learningObjectives: [
      "Define cloud computing & AWS",
      "Differentiate IaaS, PaaS, SaaS",
      "Identify key components of AWS global infrastructure",
    ],
  },
  {
    courseCustomId: "aws_cloud_essentials",
    customId: "aws_ec2_s3_basics",
    title: "Module 2: EC2 (Virtual Servers) & S3 (Storage)",
    description:
      "Learn about Amazon EC2 for virtual servers and Amazon S3 for highly scalable object storage, two foundational AWS services.",
    topics: [
      "EC2 instances",
      "AMIs",
      "instance types",
      "EBS volumes",
      "S3 buckets",
      "objects",
      "versioning",
      "static website hosting",
    ],
    duration: "2 hours 30 minutes",
    order: 1,
    type: "lesson",
    content: {
      videoScript:
        "EC2 and S3 are your first steps in building on AWS. EC2 lets you run virtual servers in the cloud, while S3 provides incredibly durable and scalable storage for any type of data. We'll explore launching instances and managing data in buckets.",
      keyConcepts: [
        "EC2 instance lifecycle",
        "Amazon Machine Images (AMIs)",
        "S3 storage classes",
        "Bucket policies & security",
        "Static website hosting on S3",
      ],
      practicalExamples: [
        "Launching a basic web server on EC2",
        "Storing backups in S3",
        "Hosting a simple HTML website on S3",
      ],
      handsOnActivity:
        "Launch a t2.micro EC2 instance. Create an S3 bucket and upload a sample file. Try accessing the file publicly (and then secure it).",
      aiPrompts: ["Generate EC2/S3 basics module", "Explain S3 static hosting"],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 500,
        timestamp: new Date("2025-09-15T11:30:00.000Z"),
      },
      visualAssetDescriptions: [
        "3D model of an EC2 instance in a data center",
        "Animated data flowing into an S3 bucket",
        "Interactive AWS Console simulation for EC2/S3",
      ],
    },
    prerequisites: ["aws_intro_cloud"],
    learningObjectives: [
      "Launch and manage EC2 instances",
      "Utilize S3 for object storage",
      "Configure S3 for static website hosting",
    ],
  },
  {
    courseCustomId: "aws_cloud_essentials",
    customId: "aws_vpc_iam",
    title: "Module 3: Networking (VPC) & Identity (IAM)",
    description:
      "Understand how to create isolated networks with Amazon VPC and manage access control securely with AWS Identity and Access Management (IAM).",
    topics: [
      "VPC concepts",
      "subnets",
      "route tables",
      "security groups",
      "NACLs",
      "IAM users",
      "groups",
      "roles",
      "policies",
    ],
    duration: "2 hours 45 minutes",
    order: 2,
    type: "lesson",
    content: {
      videoScript:
        "Networking and security are paramount in the cloud. This module covers AWS VPC for creating your own isolated virtual networks, and IAM for fine-grained control over who can access what resources in your AWS account.",
      keyConcepts: [
        "VPC (Virtual Private Cloud)",
        "Public vs. Private Subnets",
        "Security Groups vs. Network ACLs",
        "IAM Users, Groups, Roles",
        "IAM Policies & Permissions",
      ],
      practicalExamples: [
        "Setting up a custom VPC with public/private subnets",
        "Creating an IAM user with S3 read-only access",
        "Attaching an IAM role to an EC2 instance",
      ],
      handsOnActivity:
        "Create a new VPC with two subnets (one public, one private). Create an IAM user and grant them permission to list your S3 buckets, but not delete objects.",
      aiPrompts: ["Generate VPC/IAM module", "Explain IAM roles vs users"],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 520,
        timestamp: new Date("2025-09-15T11:40:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated VPC network topology diagram",
        "3D demonstration of IAM policy evaluation",
        "Interactive AWS security group configurator",
      ],
    },
    prerequisites: ["aws_ec2_s3_basics"],
    learningObjectives: [
      "Configure custom VPC networks",
      "Implement network security with Security Groups/NACLs",
      "Manage user identities and permissions with IAM",
    ],
  },
  {
    courseCustomId: "aws_cloud_essentials",
    customId: "aws_serverless_lambda",
    title: "Module 4: Serverless Computing with AWS Lambda",
    description:
      "Explore the world of serverless computing. Learn how to build and deploy event-driven functions with AWS Lambda without managing any servers.",
    topics: [
      "Serverless concepts",
      "AWS Lambda",
      "event-driven architecture",
      "Lambda functions",
      "triggers",
      "API Gateway (intro)",
    ],
    duration: "2 hours",
    order: 3,
    type: "lesson",
    content: {
      videoScript:
        "Serverless is a game-changer! This module introduces AWS Lambda, letting you run code without provisioning or managing servers. We'll build simple Lambda functions, define their triggers, and even expose them via API Gateway.",
      keyConcepts: [
        "Serverless benefits (auto-scaling, no server management)",
        "Lambda function structure",
        "Event sources (S3, API Gateway, DynamoDB)",
        "API Gateway for HTTP endpoints",
      ],
      practicalExamples: [
        "Creating a Lambda function to resize images uploaded to S3",
        "Building a simple API endpoint with Lambda & API Gateway",
      ],
      handsOnActivity:
        "Create a Lambda function that logs a 'Hello from Lambda!' message. Configure an API Gateway endpoint to invoke it via HTTP.",
      aiPrompts: ["Generate serverless module", "Explain Lambda triggers"],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 480,
        timestamp: new Date("2025-09-15T11:50:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated serverless architecture flow",
        "3D visualization of Lambda execution environment",
        "Interactive API Gateway configuration tool",
      ],
    },
    prerequisites: ["aws_vpc_iam"],
    learningObjectives: [
      "Understand serverless computing",
      "Develop and deploy AWS Lambda functions",
      "Configure Lambda triggers and API Gateway integration",
    ],
  },
  {
    courseCustomId: "aws_cloud_essentials",
    customId: "aws_monitoring_cost",
    title: "Module 5: Monitoring, Logging & Cost Management",
    description:
      "Learn essential practices for monitoring your AWS resources, managing logs, and optimizing costs to ensure efficient and performant cloud operations.",
    topics: [
      "CloudWatch",
      "CloudTrail",
      "logging best practices",
      "AWS Budgets",
      "cost explorer",
      "billing alerts",
    ],
    duration: "1 hour 45 minutes",
    order: 4,
    type: "lesson",
    content: {
      videoScript:
        "Keeping an eye on your cloud environment is crucial. This module covers AWS CloudWatch for monitoring metrics and alarms, CloudTrail for auditing actions, and essential tools like AWS Budgets and Cost Explorer to manage and optimize your spending.",
      keyConcepts: [
        "CloudWatch metrics & alarms",
        "CloudTrail for auditing",
        "Log analysis",
        "AWS Free Tier management",
        "Cost Explorer & Budgets",
      ],
      practicalExamples: [
        "Setting a CloudWatch alarm for EC2 CPU utilization",
        "Reviewing CloudTrail logs for user activity",
        "Creating a budget for your AWS account",
      ],
      handsOnActivity:
        "Set up a CloudWatch alarm that notifies you if your EC2 instance's CPU utilization goes above 80% for 5 minutes. Create a simple billing alarm for your account.",
      aiPrompts: [
        "Generate monitoring/cost module",
        "Explain CloudWatch alarms",
      ],
      aiGeneratedDetails: {
        modelUsed: "gemini-1.5-pro",
        temperature: 0.7,
        tokens: 450,
        timestamp: new Date("2025-09-15T12:00:00.000Z"),
      },
      visualAssetDescriptions: [
        "Animated CloudWatch dashboard",
        "3D representation of cost breakdown",
        "Interactive budget planner tool",
      ],
    },
    prerequisites: ["aws_serverless_lambda"],
    learningObjectives: [
      "Monitor AWS resources with CloudWatch",
      "Audit actions with CloudTrail",
      "Implement basic cost management and optimization strategies",
    ],
  },
];

// --- POPULATION SCRIPT LOGIC ---

const populateDB = async () => {
  await connectDB(); // Connect to your MongoDB instance using your db.js

  try {
    console.log("Starting database population...");

    // Validate INSTRUCTOR_USER_OID and check if user exists
    if (!mongoose.Types.ObjectId.isValid(INSTRUCTOR_USER_OID)) {
      console.error(
        `\n❌ ERROR: Invalid INSTRUCTOR_USER_OID: '${INSTRUCTOR_USER_OID}'. Please provide a valid 24-character hex string from an existing user.`
      );
      process.exit(1);
    }
    const instructorExists = await User.findById(INSTRUCTOR_USER_OID);
    if (!instructorExists) {
      console.error(
        `\n❌ ERROR: Instructor User with _id '${INSTRUCTOR_USER_OID}' not found in the database. Please ensure this user exists before running the population script.`
      );
      process.exit(1);
    }
    console.log(
      `\n✅ Validated instructor: '${
        instructorExists.email ||
        instructorExists.username ||
        INSTRUCTOR_USER_OID
      }' (ID: ${INSTRUCTOR_USER_OID})`
    );

    // Clear existing data (optional, but good for fresh runs during development)
    console.log("\n--- Clearing existing data (Courses and Modules) ---");
    await Course.deleteMany({});
    await Module.deleteMany({});
    console.log("✅ Cleared existing courses and modules.");

    // --- Step 1: Insert Courses and map their customId to MongoDB _id ---
    const courseIdMap = new Map(); // Maps customId (e.g., "web_dev_fundamentals") to MongoDB _id

    console.log("\n--- Inserting Courses ---");
    for (const courseData of coursesToCreate) {
      try {
        const newCourse = new Course({
          ...courseData,
          createdBy: INSTRUCTOR_USER_OID, // Link to your actual instructor user
          instructor: INSTRUCTOR_USER_OID, // Link to your actual instructor user
          modules: [], // Modules array is empty initially, will be updated later
        });
        const savedCourse = await newCourse.save();
        courseIdMap.set(savedCourse.customId, savedCourse._id);
        console.log(
          `  ✅ Inserted Course: '${savedCourse.title}' (MongoDB _id: ${savedCourse._id})`
        );
      } catch (error) {
        console.error(
          `  ❌ Failed to insert course '${courseData.title}': ${error.message}`
        );
        // Consider if you want to exit here or continue with other courses
      }
    }
    console.log(`\n✅ Successfully inserted ${courseIdMap.size} courses.`);

    // --- Step 2: Insert Modules and link them to their Courses ---
    const moduleIdMap = new Map(); // Maps customId (e.g., "html_structure_basics") to MongoDB _id
    const courseToModuleOIDs = new Map(); // Maps Course MongoDB _id (string) -> [Module MongoDB _id (string), ...]
    let modulesInsertedCount = 0;

    console.log("\n--- Inserting Modules ---");
    for (const moduleData of modulesToCreate) {
      const course_id = courseIdMap.get(moduleData.courseCustomId); // Get the MongoDB _id of the parent course

      if (!course_id) {
        console.warn(
          `  ⚠️ Warning: Course with customId '${moduleData.courseCustomId}' not found for module '${moduleData.title}'. Skipping module insertion.`
        );
        continue; // Skip this module if its parent course wasn't inserted
      }

      try {
        const newModule = new Module({
          ...moduleData,
          course: course_id, // Link module to its parent course's actual MongoDB _id
        });
        const savedModule = await newModule.save();
        moduleIdMap.set(savedModule.customId, savedModule._id);

        // Collect module _ids per course for later course update
        if (!courseToModuleOIDs.has(course_id.toString())) {
          courseToModuleOIDs.set(course_id.toString(), []);
        }
        courseToModuleOIDs.get(course_id.toString()).push(savedModule._id);
        console.log(
          `  ✅ Inserted Module: '${savedModule.title}' (MongoDB _id: ${savedModule._id}) for Course: '${moduleData.courseCustomId}'`
        );
        modulesInsertedCount++;
      } catch (error) {
        console.error(
          `  ❌ Failed to insert module '${moduleData.title}' for course '${moduleData.courseCustomId}': ${error.message}`
        );
      }
    }
    console.log(`\n✅ Successfully inserted ${modulesInsertedCount} modules.`);

    // --- Step 3: Update Courses with their Module References ---
    console.log("\n--- Updating Courses with Module References ---");
    let coursesUpdatedCount = 0;
    for (const [courseCustomId, course_id] of courseIdMap.entries()) {
      const module_ids_for_this_course =
        courseToModuleOIDs.get(course_id.toString()) || [];

      try {
        const updatedCourse = await Course.findByIdAndUpdate(
          course_id,
          { $set: { modules: module_ids_for_this_course } },
          { new: true, runValidators: true } // Return the updated document, run schema validators
        );

        if (updatedCourse) {
          console.log(
            `  ✅ Updated Course: '${updatedCourse.title}' with ${module_ids_for_this_course.length} module references.`
          );
          coursesUpdatedCount++;
        } else {
          // This case should ideally not happen if course_id came from courseIdMap
          console.warn(
            `  ⚠️ Warning: Could not find Course with ID ${course_id} for update (course might have been deleted after initial insertion or has an issue).`
          );
        }
      } catch (error) {
        console.error(
          `  ❌ Failed to update course '${courseCustomId}' with modules: ${error.message}`
        );
      }
    }
    console.log(
      `\n✅ Successfully updated ${coursesUpdatedCount} courses with module references.`
    );

    console.log("\nDatabase population completed successfully! ✨");
  } catch (error) {
    console.error("\n💥 FATAL ERROR during database population:", error);
    process.exit(1); // Exit with error code to indicate failure
  } finally {
    // Ensure the connection is only closed if it's currently open
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("\nMongoDB connection closed.");
    } else {
      console.log("\nMongoDB connection was already closed or not open.");
    }
  }
};

// Execute the population script
populateDB();
