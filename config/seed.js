const mongoose = require('mongoose')
const dotenv   = require('dotenv')
dotenv.config()

const User     = require('../models/User')
const Course   = require('../models/Course')
const Question = require('../models/Question')
const { DEMO_COURSES } = require('./demoCourses')
const { generateTemplateQuestions } = require('./templateQuestions')
const { getThumbnail } = require('./categoryImages')

// ─── Users ────────────────────────────────────────────────────────────────────
const USERS = [
  { name: 'Admin',          email: 'admin@learnly.com',      password: 'admin1234',  role: 'admin',      isVerified: true },
  { name: 'Dr. Ada Okafor', email: 'instructor@learnly.com', password: 'teach1234',  role: 'instructor', isVerified: true },
  { name: 'Chidi Adeleke',  email: 'student@learnly.com',    password: 'learn1234',  role: 'student',    isVerified: true },
]

// ─── Courses ──────────────────────────────────────────────────────────────────
const COURSES = [
  {
    title:        'Machine Learning Fundamentals',
    description:  'Master supervised and unsupervised learning, model evaluation, and neural network basics. Build real-world ML pipelines from scratch using Python and scikit-learn.',
    instructor:   'Dr. Ada Okafor',
    organization: 'LAUTECH',
    category:     'Data Science',
    level:        'Intermediate',
    price:        0,
    tag:          'Popular',
    duration:     '8 weeks',
    rating:       4.8,
    reviewCount:  3200,
    thumbnail: getThumbnail('Data Science', 'Machine Learning Fundamentals'),
    syllabus: [
      'Introduction to ML and types of learning',
      'Supervised learning: regression and classification',
      'Unsupervised learning: clustering and dimensionality reduction',
      'Model evaluation and cross-validation',
      'Neural networks and deep learning basics',
    ],
    topics: [
      { name: 'Introduction to ML',   order: 1, prerequisites: [], lesson: {
        intro: 'Machine learning (ML) is a field of AI that lets computers find patterns in data and make predictions, without being explicitly programmed with rules for every case.',
        keyPoints: [
          'Supervised learning: the model learns from labelled examples (input → correct output), e.g. predicting house prices from past sales.',
          'Unsupervised learning: the model finds structure in unlabelled data, e.g. grouping customers by behaviour.',
          'Reinforcement learning: an agent learns by trial and error, receiving rewards or penalties for its actions.',
          'Training data teaches the model; a separate test set checks how well it generalises to data it has never seen.',
        ],
        example: 'Example: to predict whether an email is spam, you\'d train a supervised model on thousands of emails already labelled "spam" or "not spam" — the model learns the patterns that separate the two.',
        summary: 'You should now be able to name the three main types of ML and explain, in your own words, why training and test data need to be kept separate.',
        videoUrl: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
      }},
      { name: 'Supervised Learning',  order: 2, prerequisites: ['Introduction to ML'], lesson: {
        intro: 'Supervised learning covers two main tasks: regression (predicting a number) and classification (predicting a category), both learned from labelled data.',
        keyPoints: [
          'Regression predicts continuous values, e.g. linear regression predicting a price.',
          'Classification predicts discrete labels, e.g. logistic regression predicting "yes/no".',
          'Overfitting happens when a model memorises training noise instead of the underlying pattern, hurting performance on new data.',
          'Regularisation (like L2/Ridge) penalises overly complex models to reduce overfitting.',
        ],
        example: 'Example: given a dataset of house sizes and prices, a regression model learns the relationship so it can predict the price of a house it has never seen based on its size.',
        summary: 'You should be able to tell regression and classification apart, and explain overfitting to someone unfamiliar with ML.',
        videoUrl: 'https://www.youtube.com/watch?v=Mu3POlNoLdc',
      }},
      { name: 'Unsupervised Learning',order: 3, prerequisites: ['Introduction to ML'], lesson: {
        intro: 'Unsupervised learning finds structure in data that has no labels — the model isn\'t told the "right answer", it discovers patterns on its own.',
        keyPoints: [
          'Clustering (e.g. K-Means) groups similar data points together, such as grouping customers by purchasing behaviour.',
          'Dimensionality reduction (e.g. PCA) compresses many features into fewer ones while keeping the important structure.',
          'There\'s no ground truth to check against, so evaluation relies on how coherent and useful the discovered groups/structure are.',
        ],
        example: 'Example: an online store clusters customers by browsing and purchase history, without any pre-existing "customer type" labels, to design targeted promotions per cluster.',
        summary: 'You should be able to explain what makes unsupervised learning different from supervised learning, and give one real-world clustering example.',
        videoUrl: 'https://www.youtube.com/watch?v=lEfrr0Yr684',
      }},
      { name: 'Model Evaluation',     order: 4, prerequisites: ['Supervised Learning'], lesson: {
        intro: 'A model is only as good as your ability to measure it honestly. This topic covers how to evaluate model performance without fooling yourself.',
        keyPoints: [
          'A confusion matrix breaks predictions into true/false positives and negatives.',
          'Accuracy can be misleading on imbalanced data — F1-score (balancing precision and recall) is often more informative.',
          'k-fold cross-validation trains/tests on k different data splits to get a more reliable performance estimate than a single split.',
          'The test set must stay untouched until final evaluation — using it to tune the model defeats its purpose.',
        ],
        example: 'Example: in a fraud-detection dataset where only 1% of transactions are fraud, a model that always predicts "not fraud" gets 99% accuracy but is useless — F1-score exposes this.',
        summary: 'You should be able to explain why accuracy alone can be misleading, and what cross-validation protects against.',
        videoUrl: 'https://www.youtube.com/watch?v=a86WxNgMv7E',
      }},
      { name: 'Neural Networks',      order: 5, prerequisites: ['Supervised Learning', 'Model Evaluation'], lesson: {
        intro: 'Neural networks are layered models loosely inspired by the brain, capable of learning very complex, non-linear patterns.',
        keyPoints: [
          'Activation functions (ReLU, sigmoid) introduce non-linearity, letting networks model complex relationships rather than only straight lines.',
          'The vanishing gradient problem: in deep networks, gradients can shrink as they propagate backward, slowing or stalling learning in early layers.',
          'Batch normalisation stabilises training by normalising layer inputs within each batch.',
        ],
        example: 'Example: a neural network for handwritten digit recognition stacks several layers, each learning increasingly abstract features — edges, then shapes, then whole digits.',
        summary: 'You should be able to explain what an activation function does and why very deep networks can be harder to train.',
        videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
      }},
    ],
  },
  {
    title:        'Full-Stack Web Development with React & Node',
    description:  'Build complete web applications using React on the frontend and Node.js + Express + MongoDB on the backend. Covers authentication, REST APIs, and deployment.',
    instructor:   'Dr. Ada Okafor',
    organization: 'LAUTECH',
    category:     'Computer Science',
    level:        'Beginner',
    price:        0,
    tag:          'Bestseller',
    duration:     '10 weeks',
    rating:       4.9,
    reviewCount:  5100,
    thumbnail: getThumbnail('Computer Science', 'Full-Stack Web Development with React & Node'),
    syllabus: [
      'HTML, CSS and JavaScript foundations',
      'React.js components and state management',
      'Node.js and Express REST APIs',
      'MongoDB and Mongoose ODM',
      'JWT Authentication and security',
    ],
    topics: [
      { name: 'JavaScript Basics',  order: 1, prerequisites: [], lesson: {
        intro: 'Modern JavaScript is the foundation everything else in this course builds on — React, Node, and Express all assume you\'re comfortable with it.',
        keyPoints: [
          '`let`/`const` are block-scoped; prefer them over `var`, which is function-scoped and a common source of bugs.',
          '`===` checks value AND type (strict equality); `==` coerces types and can produce surprising results.',
          'Promises represent a future async result (pending → fulfilled/rejected) — the basis for `async/await`.',
          'The spread operator (`...`) expands arrays/objects in place, commonly used for copying and merging.',
        ],
        example: 'Example: `const merged = { ...defaults, ...userOptions }` merges two objects, with `userOptions` overriding any matching keys in `defaults`.',
        summary: 'You should be comfortable with `let`/`const`, strict equality, and reading basic Promise-based code before moving to React.',
        videoUrl: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
      }},
      { name: 'React Fundamentals', order: 2, prerequisites: ['JavaScript Basics'], lesson: {
        intro: 'React lets you build UIs out of small, reusable components. This topic covers the core building blocks: JSX, components, and state.',
        keyPoints: [
          'JSX is syntax sugar for `React.createElement()` calls, compiled by Babel into plain JavaScript.',
          'A component is a function that accepts props and returns JSX — the basic reusable UI unit.',
          '`useState` gives a component local state via a `[value, setter]` pair.',
          'An empty `useEffect(fn, [])` dependency array runs the effect once, after the first render (like `componentDidMount`).',
        ],
        example: 'Example: `const [count, setCount] = useState(0)` creates a piece of state; calling `setCount(count + 1)` re-renders the component with the new value.',
        summary: 'You should be able to explain what JSX compiles to, and what `useState` and an empty-array `useEffect` are each used for.',
        videoUrl: 'https://www.youtube.com/watch?v=4UZrsTqkcW4',
      }},
      { name: 'Node & Express',     order: 3, prerequisites: ['JavaScript Basics'], lesson: {
        intro: 'Node.js runs JavaScript outside the browser; Express is the minimal framework this course uses to build REST APIs on top of it.',
        keyPoints: [
          'Express routes map an HTTP method + path (e.g. `POST /api/courses`) to a handler function.',
          'By REST convention, POST creates, GET reads, PUT/PATCH updates, and DELETE removes a resource.',
          'Middleware functions run in the request/response pipeline, with access to `req`, `res`, and `next()`.',
          'Forgetting to call `next()` in middleware leaves the request hanging — the response is never sent.',
        ],
        example: 'Example: an auth middleware checks the request\'s JWT, attaches the user to `req.user`, then calls `next()` so the route handler can run.',
        summary: 'You should be able to explain what middleware is and why `next()` matters, since this course\'s own `protect` middleware works exactly this way.',
        videoUrl: 'https://www.youtube.com/watch?v=CnH3kAXSrmU',
      }},
      { name: 'MongoDB',            order: 4, prerequisites: ['Node & Express'], lesson: {
        intro: 'MongoDB is a document-oriented NoSQL database — instead of rows and tables, data is stored as flexible JSON-like documents.',
        keyPoints: [
          'A Mongoose schema defines a document\'s shape, types, and validation rules before it\'s saved to a collection.',
          'Documents can nest related data directly (e.g. an array of enrollments inside a User document) instead of always requiring joins.',
          '`$lookup` performs a join-like operation across collections when you do need to combine data from two collections.',
        ],
        example: 'Example: this course\'s own `User` model nests an `enrolledCourses` array directly inside each user document, rather than using a separate join table.',
        summary: 'You should be able to explain the difference between a document database and a relational one, and what a Mongoose schema is for.',
        videoUrl: 'https://www.youtube.com/watch?v=DZBGEVgL2eE',
      }},
      { name: 'JWT Authentication', order: 5, prerequisites: ['Node & Express', 'MongoDB'], lesson: {
        intro: 'JSON Web Tokens (JWT) let a server verify who a user is on each request, without needing to store session state server-side.',
        keyPoints: [
          'A JWT has three parts: header, payload (claims like user id and role), and signature.',
          'The server signs the token with a secret; anyone can read the payload, but only the server can produce a valid signature.',
          'Storing JWTs in httpOnly cookies (rather than `localStorage`) protects them from being stolen via XSS, since client-side JS can\'t read httpOnly cookies.',
        ],
        example: 'Example: in this app, logging in returns a signed token; the frontend sends it as `Authorization: Bearer <token>` on each request, and the `protect` middleware verifies it before allowing access.',
        summary: 'You should be able to explain what\'s inside a JWT and why the signature — not encryption of the payload — is what makes it trustworthy.',
        videoUrl: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
      }},
    ],
  },
]

// ─── Questions ────────────────────────────────────────────────────────────────
// Format: [topic, difficulty, text, options[], correctIndex, explanation]
const ML_QUESTIONS = [
  // Introduction to ML
  ['Introduction to ML','Easy','What does ML stand for?',['Machine Language','Machine Learning','Mechanical Logic','Modular Learning'],1,'ML stands for Machine Learning — a field of AI that lets computers learn from data without being explicitly programmed.'],
  ['Introduction to ML','Easy','Which of the following is NOT a type of machine learning?',['Supervised','Unsupervised','Reinforcement','Compilational'],3,'The three standard types are supervised, unsupervised, and reinforcement learning. "Compilational" is not a category.'],
  ['Introduction to ML','Easy','What is training data in machine learning?',['Data used to test the model','Data the model learns patterns from','Random data generated by the model','Data stored in the cloud'],1,'Training data is the labelled or unlabelled dataset the model uses to learn patterns during the training phase.'],
  ['Introduction to ML','Medium','What is the primary goal of machine learning?',['Write programs manually','Enable computers to learn from data and make decisions','Design faster processors','Create database schemas'],1,'ML enables systems to automatically learn and improve from experience without being explicitly programmed for each task.'],
  ['Introduction to ML','Medium','Which application best demonstrates supervised learning?',['Grouping customers by behaviour','Email spam detection','Compressing images','Discovering hidden patterns'],1,'Spam detection uses labelled examples (spam/not-spam) to train a classifier — a hallmark of supervised learning.'],
  ['Introduction to ML','Hard','Which statement best describes the bias-variance tradeoff?',['High bias means overfitting','High variance means underfitting','Reducing bias usually increases variance','Bias and variance are independent'],2,'The tradeoff: reducing bias (making the model more flexible) tends to increase variance, and vice versa. This is the core challenge of model selection.'],
  ['Introduction to ML','Hard','What is a hyperparameter in ML?',['A learned weight in the model','A setting configured before training begins','The final output layer','A feature in the dataset'],1,'Hyperparameters (e.g. learning rate, max depth) are set before training. Unlike parameters, they are not learned from data.'],

  // Supervised Learning
  ['Supervised Learning','Easy','Which algorithm predicts a continuous numeric value?',['Logistic Regression','K-Means','Linear Regression','Naive Bayes'],2,'Linear regression models a continuous output variable (e.g. price, temperature) — it is a regression algorithm.'],
  ['Supervised Learning','Easy','What type of output does a classification model produce?',['Continuous values','Discrete class labels','Cluster centroids','Probability densities only'],1,'Classification models output discrete categories or class labels such as "cat", "dog", "spam", or "not spam".'],
  ['Supervised Learning','Medium','What is overfitting?',['Model performs poorly on training data','Model memorises training noise and fails on new data','Model has too few parameters','Model converges too slowly'],1,'Overfitting occurs when a model learns the noise in training data rather than the underlying pattern, causing poor generalisation.'],
  ['Supervised Learning','Medium','Which metric is most appropriate for imbalanced classification?',['Accuracy','F1-Score','Mean Squared Error','R-Squared'],1,'F1-Score balances precision and recall and is more informative than accuracy when classes are imbalanced.'],
  ['Supervised Learning','Hard','Why does L2 regularisation prevent overfitting?',['It increases model complexity','It penalises large weights, constraining model complexity','It adds more training samples','It accelerates gradient descent'],1,'L2 (Ridge) regularisation adds a penalty proportional to the square of the weights, discouraging the model from fitting noise.'],
  ['Supervised Learning','Hard','What is the kernel trick in SVMs?',['Reduces data dimensionality before training','Maps data to a higher dimension implicitly without computing it explicitly','Normalises input features','Prunes decision tree branches'],1,'The kernel trick computes the dot product in a higher-dimensional space without explicitly transforming the data, enabling non-linear boundaries.'],

  // Model Evaluation
  ['Model Evaluation','Easy','What does a confusion matrix display?',['Feature importance scores','True/false positives and negatives','Learning rate over epochs','Loss curve'],1,'A confusion matrix shows TP, TN, FP, FN counts, enabling computation of precision, recall, accuracy, and F1.'],
  ['Model Evaluation','Easy','What is the purpose of a test set?',['To tune hyperparameters','To train the model','To evaluate final model performance on unseen data','To clean the raw data'],2,'The test set is held out until final evaluation to give an unbiased estimate of model performance on new data.'],
  ['Model Evaluation','Medium','What is k-fold cross-validation used for?',['Feature engineering','Getting a more reliable performance estimate by training on k different splits','Tuning neural network layers','Cleaning datasets'],1,'K-fold CV averages performance across k train/test splits, reducing the variance of the performance estimate compared to a single split.'],
  ['Model Evaluation','Hard','What does an AUC-ROC of 0.5 indicate?',['Perfect classifier','No better than random guessing','Perfectly wrong classifier','Severely overfitted model'],1,'AUC = 0.5 means the model\'s rankings are no better than random — it has no discriminative power.'],

  // Neural Networks
  ['Neural Networks','Easy','What is an activation function used for?',['Initialising weights','Introducing non-linearity into the network','Normalising input data','Computing the loss'],1,'Activation functions (ReLU, sigmoid, tanh) add non-linearity, allowing networks to learn complex, non-linear patterns.'],
  ['Neural Networks','Medium','What causes the vanishing gradient problem?',['Weights become too large','Gradients shrink exponentially through layers, preventing early layers from learning','The loss function diverges','Batch size is too small'],1,'In deep networks, gradients can become extremely small as they propagate back through many layers, making early layers nearly unable to update.'],
  ['Neural Networks','Hard','Why is batch normalisation useful during training?',['Reduces the number of parameters','Normalises layer inputs, reducing internal covariate shift and stabilising training','Replaces dropout completely','Automatically adjusts the learning rate'],1,'Batch norm normalises activations within each mini-batch, reducing internal covariate shift and allowing higher learning rates.'],
]

const WEB_QUESTIONS = [
  // JavaScript Basics
  ['JavaScript Basics','Easy','What keyword declares a block-scoped variable in modern JavaScript?',['var','let','def','dim'],1,'`let` (and `const`) are block-scoped. `var` is function-scoped and hoisted, which causes many bugs.'],
  ['JavaScript Basics','Easy','What does the `===` operator check?',['Value only','Type only','Value AND type (strict equality)','Reference equality only'],2,'`===` is strict equality — it checks both value and type without coercion, unlike `==` which coerces types.'],
  ['JavaScript Basics','Easy','Which method adds an element to the end of an array?',['unshift()','push()','splice()','concat()'],1,'`push()` appends one or more elements to the end of an array and returns the new length.'],
  ['JavaScript Basics','Medium','What is a Promise in JavaScript?',['A synchronous blocking function','An object representing a future async completion or failure','A CSS animation hook','A type of loop'],1,'A Promise represents the eventual result of an asynchronous operation. It can be pending, fulfilled, or rejected.'],
  ['JavaScript Basics','Medium','What does the spread operator (...) do?',['Declares a rest parameter','Expands iterable elements in-place','Loops over an iterable','Destructures a variable'],1,'The spread operator expands an iterable (array, object, string) in-place, used for copying, merging, and passing arguments.'],
  ['JavaScript Basics','Hard','What is the JavaScript event loop responsible for?',['Rendering HTML to the DOM','Managing heap memory allocation','Picking tasks from the callback queue when the call stack is empty','Compiling TypeScript to JavaScript'],2,'The event loop enables async behaviour: it monitors the call stack and callback queue, pushing queued callbacks to the stack when it\'s empty.'],

  // React Fundamentals
  ['React Fundamentals','Easy','What is JSX?',['A JavaScript testing library','A syntax extension letting you write HTML-like markup inside JavaScript','A global state manager','A Node.js templating engine'],1,'JSX is syntactic sugar for React.createElement() calls. Babel compiles it to regular JavaScript.'],
  ['React Fundamentals','Easy','Which hook manages local component state?',['useEffect','useReducer','useState','useContext'],2,'`useState` returns a [value, setter] pair for managing a piece of local state inside a functional component.'],
  ['React Fundamentals','Easy','What is a React component?',['A CSS class','A reusable, self-contained piece of UI','A database model','A Node.js module'],1,'A React component is a reusable UI building block — a function (or class) that accepts props and returns JSX.'],
  ['React Fundamentals','Medium','When does useEffect with an empty dependency array `[]` run?',['On every re-render','Only when specific state changes','Once after the first render (mount)','Never'],2,'An empty `[]` dependency array tells React to run the effect only once after the initial render — equivalent to componentDidMount.'],
  ['React Fundamentals','Medium','What is prop drilling?',['Passing props through intermediate components that don\'t use them','A React performance optimisation','A hook for deep state updates','A testing strategy'],0,'Prop drilling is when you pass data through many component layers just to reach a deeply nested child, making code harder to maintain.'],
  ['React Fundamentals','Hard','What does React.memo do?',['Memoises function return values','Prevents a component re-rendering when its props have not changed','Caches API responses','Manages side effects'],1,'React.memo is a HOC that shallow-compares props. If they haven\'t changed, it skips the re-render, improving performance.'],

  // Node & Express
  ['Node & Express','Easy','What is Express.js?',['A frontend CSS framework','A minimal web framework for Node.js','A relational database ORM','A bundler like Webpack'],1,'Express is a minimal, unopinionated web framework for Node.js used to build APIs and web servers.'],
  ['Node & Express','Easy','Which HTTP method creates a new resource by convention?',['GET','DELETE','POST','PATCH'],2,'POST is the conventional REST method for creating new resources on the server.'],
  ['Node & Express','Medium','What is middleware in Express?',['A database driver','A function with access to req, res, and next in the request cycle','A frontend routing library','An HTTP header type'],1,'Middleware functions sit in the request-response pipeline and can read/modify req & res, end the cycle, or call next() to continue.'],
  ['Node & Express','Hard','What is the purpose of next() in Express middleware?',['Sends a response to the client','Passes control to the next matching middleware or route handler','Restarts the Node process','Logs the request to stdout'],1,'Calling `next()` passes control downstream. Without it, the request hangs — the response is never sent.'],

  // MongoDB
  ['MongoDB','Easy','What type of database is MongoDB?',['Relational (SQL)','Graph','Document-oriented NoSQL','Key-value store'],2,'MongoDB is a document-oriented NoSQL database. It stores data as flexible BSON (binary JSON) documents.'],
  ['MongoDB','Medium','What is a Mongoose schema?',['A query optimiser','A shape definition for MongoDB documents with types and validation','A MongoDB index strategy','A replication topology'],1,'A Mongoose schema defines the structure, data types, and validation rules for documents stored in a collection.'],
  ['MongoDB','Hard','What does the $lookup aggregation stage do?',['Filters documents by a condition','Performs a left outer join to another collection','Groups documents and computes aggregates','Sorts the result set'],1,'`$lookup` joins documents from another collection into the pipeline — similar to a SQL LEFT JOIN.'],

  // JWT Authentication
  ['JWT Authentication','Easy','What does JWT stand for?',['JavaScript Web Token','JSON Web Token','Java Web Technology','JSON Web Transfer'],1,'JWT stands for JSON Web Token — a compact, URL-safe format for transmitting claims between parties.'],
  ['JWT Authentication','Medium','Which part of a JWT contains user claims?',['Header','Signature','Payload','All three parts equally'],2,'The payload is the second segment of a JWT and contains the claims (e.g. user id, role, expiry time).'],
  ['JWT Authentication','Hard','Why store JWTs in httpOnly cookies rather than localStorage?',['localStorage is too small','httpOnly cookies are inaccessible to JavaScript, preventing XSS theft','Cookies are always encrypted automatically','JWTs are too large for localStorage'],1,'httpOnly cookies cannot be read by client-side JavaScript, so a successful XSS attack cannot steal the token — unlike localStorage.'],
]

// ─── Seed function ─────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')

    await Promise.all([User.deleteMany(), Course.deleteMany(), Question.deleteMany()])
    console.log('Cleared existing data')

    const users   = await User.create(USERS)
    const instructorId = users.find(u => u.role === 'instructor')._id
    console.log(`Created ${users.length} users`)

    const courses = await Course.create(COURSES.map(c => ({ ...c, createdBy: instructorId })))
    console.log(`Created ${courses.length} courses`)

    const mlCourse  = courses.find(c => c.title.includes('Machine Learning'))
    const webCourse = courses.find(c => c.title.includes('Full-Stack'))

    const allQuestions = [
      ...ML_QUESTIONS.map(([topic,difficulty,text,options,correctAnswer,explanation]) => ({
        course: mlCourse._id, topic, difficulty, text, options, correctAnswer, explanation, type: 'mcq', source: 'manual',
      })),
      ...WEB_QUESTIONS.map(([topic,difficulty,text,options,correctAnswer,explanation]) => ({
        course: webCourse._id, topic, difficulty, text, options, correctAnswer, explanation, type: 'mcq', source: 'manual',
      })),
    ]

    await Question.insertMany(allQuestions)
    console.log(`Created ${allQuestions.length} hand-written questions (ML + Web Dev courses)`)

    // Top up the two flagship courses with template-generated questions on
    // top of the hand-written ones above, so each topic/difficulty pool is
    // deep enough to support a 30-question final quiz without heavy repeats.
    const flagshipQuestions = []
    for (const course of [mlCourse, webCourse]) {
      for (const topic of course.topics) {
        for (const difficulty of ['Easy', 'Medium', 'Hard']) {
          flagshipQuestions.push(...generateTemplateQuestions(course._id, topic.name, difficulty, 4))
        }
      }
    }
    await Question.insertMany(flagshipQuestions)
    console.log(`Added ${flagshipQuestions.length} supplemental questions to the flagship courses`)

    // ─── 80 additional demo courses (→ 82 total) ─────────────────────────────
    const demoCourses = await Course.create(DEMO_COURSES.map(c => ({ ...c, createdBy: instructorId })))
    console.log(`Created ${demoCourses.length} additional demo courses (${courses.length + demoCourses.length} total)`)

    // Give every topic in every demo course a working practice quiz pool
    // (6 questions × 3 difficulty levels per topic — 18 per topic) using
    // offline templates — no network or AI API calls required. This is
    // deep enough that a 4-topic course comfortably fills a 30-question
    // final quiz without heavy repetition. Instructors can layer real
    // AI-generated questions on top later from the Instructor Dashboard.
    const demoQuestions = []
    for (const course of demoCourses) {
      for (const topic of course.topics) {
        for (const difficulty of ['Easy', 'Medium', 'Hard']) {
          demoQuestions.push(...generateTemplateQuestions(course._id, topic.name, difficulty, 6))
        }
      }
    }
    await Question.insertMany(demoQuestions)
    console.log(`Created ${demoQuestions.length} practice questions for the 48 demo courses`)

    console.log('\n✅  Seed complete!')
    console.log('─────────────────────────────────────────')
    console.log('Admin:       admin@learnly.com      / admin1234')
    console.log('Instructor:  instructor@learnly.com / teach1234')
    console.log('Student:     student@learnly.com    / learn1234')
    console.log('─────────────────────────────────────────')
    process.exit(0)
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
