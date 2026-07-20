// 80 additional demo courses (the seed already has 2: "Machine Learning
// Fundamentals" and "Full-Stack Web Development"), bringing the catalog to 82.
//
// Each entry: [title, category, level, duration, description, topicNames, instructor, organization, tag, rating, reviewCount]
// `topicNames` becomes a linear prerequisite chain (topic N requires topic N-1),
// matching the shape the adaptive engine (services/quizGenerator.js) expects.

const RAW = [
  ['React Native for Mobile Apps', 'Mobile Development', 'Intermediate', '7 weeks',
    'Build cross-platform iOS and Android apps with React Native, from navigation to native modules and app store deployment.',
    ['React Native Basics', 'Navigation & Routing', 'Native Modules', 'State Management', 'App Store Deployment'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.6, 1840],

  ['iOS Development with Swift', 'Mobile Development', 'Beginner', '9 weeks',
    'Learn Swift and SwiftUI to build native iOS apps, covering UIKit fundamentals, Core Data, and App Store submission.',
    ['Swift Fundamentals', 'SwiftUI Basics', 'UIKit & Layouts', 'Core Data', 'App Store Submission'],
    'Aisha Bello', 'Learnly Originals', null, 4.5, 980],


  ['Deep Learning with PyTorch', 'Artificial Intelligence', 'Advanced', '10 weeks',
    'Go from tensors to transformers — build, train, and deploy deep neural networks using PyTorch.',
    ['Tensors & Autograd', 'Building Neural Networks', 'CNNs for Vision', 'RNNs & Sequences', 'Transformers'],
    'Dr. Ada Okafor', 'Learnly Originals', 'Bestseller', 4.9, 4300],

  ['Natural Language Processing Basics', 'Artificial Intelligence', 'Intermediate', '6 weeks',
    'Understand how machines process human language, from tokenization to sentiment analysis and transformer-based models.',
    ['Text Preprocessing', 'Bag-of-Words & TF-IDF', 'Word Embeddings', 'Sentiment Analysis', 'Intro to Transformers'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.6, 1520],

  ['Prompt Engineering for LLMs', 'Artificial Intelligence', 'Beginner', '3 weeks',
    'Practical techniques for getting reliable, high-quality outputs from large language models.',
    ['LLM Fundamentals', 'Prompt Patterns', 'Few-Shot Prompting', 'Chaining & Agents'],
    'Ngozi Balogun', 'Learnly Originals', 'New', 4.7, 2100],

  ['Ethical Hacking Fundamentals', 'Cybersecurity', 'Intermediate', '8 weeks',
    'Learn how attackers think — reconnaissance, scanning, exploitation, and reporting, all within a legal, ethical framework.',
    ['Footprinting & Recon', 'Scanning Networks', 'Vulnerability Analysis', 'Exploitation Basics', 'Reporting & Remediation'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.7, 2750],

  ['Network Security Essentials', 'Cybersecurity', 'Beginner', '6 weeks',
    'Core concepts of securing networks: firewalls, VPNs, intrusion detection, and common attack vectors.',
    ['Networking Basics', 'Firewalls & VPNs', 'Intrusion Detection', 'Common Attack Vectors'],
    'Aisha Bello', 'Learnly Originals', null, 4.3, 690],


  ['AWS Cloud Practitioner', 'Cloud Computing', 'Beginner', '6 weeks',
    'Prepare for the AWS Cloud Practitioner certification — core services, pricing, and the shared responsibility model.',
    ['Cloud Concepts', 'Core AWS Services', 'Security & Compliance', 'Billing & Pricing'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Bestseller', 4.8, 3900],

  ['DevOps with Docker & Kubernetes', 'Cloud Computing', 'Intermediate', '9 weeks',
    'Containerize applications with Docker and orchestrate them at scale with Kubernetes.',
    ['Docker Fundamentals', 'Writing Dockerfiles', 'Kubernetes Basics', 'Deployments & Services', 'CI/CD Pipelines'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.7, 2680],


  ['Business Strategy Foundations', 'Business', 'Beginner', '6 weeks',
    'Learn the frameworks top companies use to analyze markets, competitors, and build sustainable advantage.',
    ['Strategic Analysis', 'Competitive Advantage', 'Market Positioning', 'Growth Strategy'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.4, 1100],

  ['Project Management Essentials', 'Business', 'Beginner', '5 weeks',
    'Master the fundamentals of planning, executing, and closing projects using Agile and Waterfall approaches.',
    ['Project Lifecycle', 'Agile Fundamentals', 'Risk Management', 'Stakeholder Communication'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Popular', 4.6, 3100],


  ['Personal Finance & Budgeting', 'Finance', 'Beginner', '4 weeks',
    'Take control of your money — budgeting, saving, debt management, and building an emergency fund.',
    ['Budgeting Basics', 'Saving Strategies', 'Debt Management', 'Emergency Funds'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.8, 5200],

  ['Investing 101: Stocks & Bonds', 'Finance', 'Beginner', '5 weeks',
    'Understand how financial markets work and build a diversified investment portfolio with confidence.',
    ['Markets & Asset Classes', 'Stocks Fundamentals', 'Bonds & Fixed Income', 'Portfolio Diversification'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.7, 2900],


  ['Startup Fundamentals', 'Entrepreneurship', 'Beginner', '6 weeks',
    'From idea validation to your first customers — the essential playbook for launching a startup.',
    ['Idea Validation', 'Building an MVP', 'Finding Product-Market Fit', 'Fundraising Basics'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Popular', 4.7, 2450],

  ['Lean Startup Methodology', 'Entrepreneurship', 'Intermediate', '5 weeks',
    'Apply build-measure-learn cycles to reduce risk and iterate quickly toward a sustainable business model.',
    ['Build-Measure-Learn', 'Customer Development', 'Pivoting', 'Growth Experiments'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.5, 1330],

  ['Digital Marketing Fundamentals', 'Marketing', 'Beginner', '6 weeks',
    'A practical tour of SEO, social media, email, and paid advertising to grow any brand online.',
    ['SEO Basics', 'Social Media Marketing', 'Email Marketing', 'Paid Advertising'],
    'Aisha Bello', 'Learnly Originals', 'Bestseller', 4.8, 4600],

  ['Content Marketing & Storytelling', 'Marketing', 'Intermediate', '5 weeks',
    'Craft compelling content strategies that build audiences and drive conversions.',
    ['Content Strategy', 'Storytelling Techniques', 'Distribution Channels', 'Measuring Impact'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.4, 1050],


  ['UI/UX Design Principles', 'Design', 'Beginner', '7 weeks',
    'Learn user-centered design — wireframing, prototyping, usability testing, and design systems.',
    ['Design Thinking', 'Wireframing', 'Prototyping', 'Usability Testing', 'Design Systems'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.9, 5400],

  ['Graphic Design Fundamentals', 'Design', 'Beginner', '6 weeks',
    'Master typography, color theory, and composition to create striking visual designs.',
    ['Typography Basics', 'Color Theory', 'Layout & Composition', 'Branding Essentials'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.6, 2320],

  ['Figma for Product Designers', 'Design', 'Beginner', '4 weeks',
    'Hands-on mastery of Figma — components, auto layout, prototyping, and design handoff.',
    ['Figma Basics', 'Components & Variants', 'Auto Layout', 'Prototyping & Handoff'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.5, 1580],

  ['Introduction to 3D Modeling with Blender', '3D & Animation', 'Beginner', '7 weeks',
    'Learn 3D modeling, texturing, lighting, and rendering fundamentals using the free Blender toolset.',
    ['Blender Interface', 'Modeling Basics', 'Texturing & Materials', 'Lighting & Rendering'],
    'Tunde Bakare', 'Learnly Originals', null, 4.4, 970],

  ['Character Animation Basics', '3D & Animation', 'Intermediate', '8 weeks',
    'Bring characters to life with the 12 principles of animation, rigging, and keyframe workflows.',
    ['12 Principles of Animation', 'Rigging Basics', 'Keyframing', 'Walk Cycles'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.5, 720],

  ['Photography Fundamentals', 'Photography', 'Beginner', '5 weeks',
    'Master your camera — exposure, composition, and lighting to take consistently great photos.',
    ['Exposure Triangle', 'Composition Rules', 'Natural Lighting', 'Camera Settings'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.7, 3050],

  ['Portrait Photography Masterclass', 'Photography', 'Intermediate', '6 weeks',
    'Techniques for flattering, expressive portraits — posing, studio lighting, and post-processing.',
    ['Posing Fundamentals', 'Studio Lighting Setups', 'Working with Subjects', 'Portrait Retouching'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.6, 1140],

  ['Music Theory Essentials', 'Music', 'Beginner', '6 weeks',
    'Understand scales, chords, rhythm, and harmony — the building blocks behind every song.',
    ['Scales & Key Signatures', 'Chords & Harmony', 'Rhythm & Meter', 'Song Structure'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.5, 1420],

  ['Music Production with Ableton Live', 'Music', 'Intermediate', '8 weeks',
    'Produce, mix, and master electronic music from scratch using Ableton Live.',
    ['DAW Basics', 'Beat Making', 'Mixing Fundamentals', 'Mastering Basics'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.7, 2260],

  ['Video Editing with Premiere Pro', 'Video Production', 'Beginner', '6 weeks',
    'Learn professional video editing workflows — cutting, color grading, audio, and export settings.',
    ['Editing Basics', 'Color Grading', 'Audio Editing', 'Export & Delivery'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.8, 3700],

  ['Cinematography Fundamentals', 'Video Production', 'Intermediate', '7 weeks',
    'The visual language of film — camera movement, framing, lighting, and shot composition.',
    ['Framing & Composition', 'Camera Movement', 'Lighting for Film', 'Shot Lists & Storyboards'],
    'Aisha Bello', 'Learnly Originals', null, 4.5, 980],

  ['Creative Writing Workshop', 'Writing', 'Beginner', '6 weeks',
    'Develop your voice as a writer through character, plot, and dialogue exercises.',
    ['Finding Your Voice', 'Character Development', 'Plot Structure', 'Dialogue & Scene'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.6, 1560],

  ['Technical Writing Fundamentals', 'Writing', 'Beginner', '4 weeks',
    'Write clear, structured documentation for software, APIs, and technical products.',
    ['Audience & Purpose', 'Structuring Documentation', 'Style & Clarity', 'API Documentation'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Popular', 4.6, 1980],


  ['Spanish for Beginners', 'Language Learning', 'Beginner', '8 weeks',
    'Build a solid foundation in Spanish — greetings, grammar basics, and everyday conversation.',
    ['Greetings & Basics', 'Present Tense Verbs', 'Everyday Vocabulary', 'Basic Conversation'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.7, 4100],

  ['French for Beginners', 'Language Learning', 'Beginner', '8 weeks',
    'Start speaking French confidently with practical grammar and everyday vocabulary.',
    ['Greetings & Pronunciation', 'Present Tense Verbs', 'Everyday Vocabulary', 'Basic Conversation'],
    'Aisha Bello', 'Learnly Originals', null, 4.5, 1740],

  ['Physics: Mechanics Fundamentals', 'Science', 'Intermediate', '8 weeks',
    'Classical mechanics from first principles — kinematics, forces, energy, and momentum.',
    ['Kinematics', 'Newton\'s Laws', 'Energy & Work', 'Momentum & Collisions'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.6, 1670],

  ['Introduction to Chemistry', 'Science', 'Beginner', '7 weeks',
    'Atoms, bonding, reactions, and stoichiometry — the essentials of general chemistry.',
    ['Atomic Structure', 'Chemical Bonding', 'Chemical Reactions', 'Stoichiometry'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.4, 1320],

  ['Human Biology Essentials', 'Science', 'Beginner', '7 weeks',
    'An accessible tour of human anatomy and physiology — cells, organ systems, and homeostasis.',
    ['Cell Biology', 'Circulatory System', 'Nervous System', 'Homeostasis'],
    'Ngozi Balogun', 'Learnly Originals', 'Popular', 4.7, 2380],

  ['Calculus I: Limits & Derivatives', 'Mathematics', 'Intermediate', '9 weeks',
    'Build a rigorous foundation in single-variable calculus, from limits to applied derivatives.',
    ['Limits & Continuity', 'Derivative Rules', 'Applications of Derivatives', 'Related Rates'],
    'Tunde Bakare', 'Learnly Originals', 'Bestseller', 4.8, 3200],

  ['Statistics & Probability Basics', 'Mathematics', 'Beginner', '6 weeks',
    'Core statistical concepts — distributions, hypothesis testing, and probability fundamentals.',
    ['Descriptive Statistics', 'Probability Basics', 'Distributions', 'Hypothesis Testing'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.6, 2540],

  ['World History: Ancient Civilizations', 'History', 'Beginner', '6 weeks',
    'Explore the rise and fall of ancient Egypt, Mesopotamia, Greece, and Rome.',
    ['Ancient Egypt', 'Mesopotamia', 'Ancient Greece', 'The Roman Empire'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.5, 1180],

  ['Introduction to Philosophy', 'Philosophy', 'Beginner', '6 weeks',
    'Big questions about knowledge, ethics, and existence, explored through classic and modern texts.',
    ['What is Philosophy?', 'Epistemology Basics', 'Ethics & Morality', 'Logic & Argumentation'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.4, 960],

  ['Introduction to Psychology', 'Psychology', 'Beginner', '7 weeks',
    'Survey the core areas of psychology — cognition, development, personality, and behavior.',
    ['Cognitive Psychology', 'Human Development', 'Personality Theory', 'Social Psychology'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.8, 3900],

  ['Fitness & Strength Training Basics', 'Health & Fitness', 'Beginner', '5 weeks',
    'Build a sustainable strength training routine grounded in proper form and progressive overload.',
    ['Training Fundamentals', 'Proper Form', 'Progressive Overload', 'Recovery & Nutrition'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.6, 2140],

  ['Productivity & Habit Building', 'Personal Development', 'Beginner', '4 weeks',
    'Practical systems for building habits that stick and getting meaningfully more done.',
    ['Habit Formation', 'Time Management', 'Focus & Deep Work', 'Goal Setting'],
    'Aisha Bello', 'Learnly Originals', 'Bestseller', 4.7, 3300],

  ['Instructional Design Fundamentals', 'Teaching & Education', 'Intermediate', '6 weeks',
    'Design effective learning experiences using proven instructional design frameworks.',
    ['Learning Objectives', 'ADDIE Model', 'Assessment Design', 'Learner Engagement'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.5, 890],

  ['Intellectual Property Law Basics', 'Law', 'Beginner', '5 weeks',
    'An introduction to copyright, trademark, and patent law for creators and entrepreneurs.',
    ['Copyright Basics', 'Trademark Fundamentals', 'Patent Essentials', 'Fair Use & Licensing'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.3, 640],

  ['Structural Engineering Fundamentals', 'Engineering', 'Intermediate', '8 weeks',
    'Core principles of structural analysis and design for beams, columns, and load-bearing systems.',
    ['Statics Fundamentals', 'Beam Analysis', 'Material Strength', 'Load-Bearing Design'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.5, 1050],

  ['Architectural Design Basics', 'Architecture', 'Beginner', '6 weeks',
    'Foundational principles of architectural design — space, form, and function.',
    ['Design Fundamentals', 'Space Planning', 'Form & Function', 'Sustainable Design'],
    'Tunde Bakare', 'Learnly Originals', null, 4.4, 720],

  ['Unity Game Development', 'Game Development', 'Intermediate', '9 weeks',
    'Build a complete 2D/3D game in Unity — physics, scripting, UI, and publishing.',
    ['Unity Editor Basics', 'C# Scripting', 'Physics & Collisions', 'UI & Game Menus', 'Publishing a Build'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.7, 2870],

  ['Game Design Principles', 'Game Development', 'Beginner', '5 weeks',
    'Core concepts of game design — mechanics, balance, player psychology, and level design.',
    ['Core Mechanics', 'Game Balance', 'Player Psychology', 'Level Design Basics'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.5, 1190],

  // ─── New categories ─────────────────────────────────────────────────────
  ['Blockchain Fundamentals', 'Blockchain & Web3', 'Beginner', '5 weeks',
    'How blockchains actually work — distributed ledgers, consensus, and the ideas behind Bitcoin and Ethereum.',
    ['Distributed Ledgers', 'Consensus Mechanisms', 'Wallets & Keys', 'Public vs Private Chains'],
    'Tunde Bakare', 'Learnly Originals', 'New', 4.5, 1080],

  ['Smart Contracts with Solidity', 'Blockchain & Web3', 'Intermediate', '7 weeks',
    'Write, test, and deploy smart contracts on Ethereum using Solidity and modern tooling.',
    ['Solidity Syntax', 'Contract Deployment', 'Gas & Optimization', 'Security Pitfalls'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.4, 640],

  ['NFTs & Digital Ownership', 'Blockchain & Web3', 'Beginner', '4 weeks',
    'What NFTs actually represent, how minting works, and the marketplaces and standards behind them.',
    ['Token Standards', 'Minting Basics', 'Marketplaces', 'Digital Ownership Rights'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.2, 410],

  ['Culinary Foundations', 'Culinary Arts', 'Beginner', '6 weeks',
    'Master core knife skills, cooking methods, and flavor building used in every professional kitchen.',
    ['Knife Skills', 'Cooking Methods', 'Flavor Building', 'Kitchen Safety'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.8, 2960],

  ['Baking & Pastry Basics', 'Culinary Arts', 'Beginner', '6 weeks',
    'The science of baking — doughs, batters, leavening, and classic pastry techniques.',
    ['Dough & Batter Basics', 'Leavening Science', 'Classic Pastries', 'Cakes & Frosting'],
    'Dr. Ada Okafor', 'Learnly Originals', 'Bestseller', 4.9, 3840],

  ['World Cuisines: A Practical Tour', 'Culinary Arts', 'Beginner', '8 weeks',
    'Cook your way through the signature dishes and techniques of five global cuisines.',
    ['Mediterranean Cooking', 'East Asian Techniques', 'Latin American Flavors', 'West African Staples'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.6, 1220],

  ['Real Estate Investing Basics', 'Real Estate', 'Beginner', '5 weeks',
    'How to evaluate, finance, and manage your first rental property investment.',
    ['Market Analysis', 'Financing Options', 'Property Valuation', 'Rental Management'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Popular', 4.6, 1980],

  ['Property Management Essentials', 'Real Estate', 'Beginner', '4 weeks',
    'The day-to-day of managing tenants, leases, maintenance, and legal compliance.',
    ['Tenant Screening', 'Lease Agreements', 'Maintenance Planning', 'Legal Compliance'],
    'Tunde Bakare', 'Learnly Originals', null, 4.3, 560],

  ['Real Estate Agent Fundamentals', 'Real Estate', 'Beginner', '6 weeks',
    'What it takes to sell property professionally — listings, negotiation, and closing deals.',
    ['Listing Properties', 'Client Relationships', 'Negotiation Tactics', 'Closing the Deal'],
    'Aisha Bello', 'Learnly Originals', null, 4.4, 730],

  ['Public Speaking Mastery', 'Public Speaking', 'Beginner', '4 weeks',
    'Overcome stage fright and structure talks that hold a room — from toasts to keynotes.',
    ['Overcoming Stage Fright', 'Structuring a Talk', 'Vocal Delivery', 'Handling Q&A'],
    'Ngozi Balogun', 'Learnly Originals', 'Bestseller', 4.8, 4420],

  ['Persuasive Communication', 'Public Speaking', 'Intermediate', '5 weeks',
    'The rhetoric and psychology behind messages that actually change minds.',
    ['Rhetoric Fundamentals', 'Audience Psychology', 'Storytelling for Persuasion', 'Handling Objections'],
    'Dr. Ada Okafor', 'Learnly Originals', 'Popular', 4.7, 2010],

  ['Executive Presence & Communication', 'Public Speaking', 'Intermediate', '4 weeks',
    'Build the presence, tone, and clarity expected of leaders in high-stakes meetings.',
    ['Tone & Body Language', 'Meeting Facilitation', 'Difficult Conversations', 'Executive Storytelling'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.5, 890],

  ['Journalism Fundamentals', 'Journalism & Media', 'Beginner', '6 weeks',
    'Reporting, interviewing, and writing news stories that are accurate, fair, and readable.',
    ['News Writing Basics', 'Interviewing Techniques', 'Fact-Checking & Ethics', 'Editing for Clarity'],
    'Ngozi Balogun', 'Learnly Originals', 'Popular', 4.6, 1540],

  ['Podcast Production Essentials', 'Journalism & Media', 'Beginner', '5 weeks',
    'Plan, record, edit, and publish a podcast — from scripting to distribution.',
    ['Show Planning', 'Recording & Audio Gear', 'Editing Basics', 'Publishing & Distribution'],
    'Tunde Bakare', 'Learnly Originals', 'New', 4.5, 870],

  ['Media Literacy & Misinformation', 'Journalism & Media', 'Beginner', '3 weeks',
    'Spot bias, verify sources, and think critically about what you read, watch, and share.',
    ['Spotting Bias', 'Source Verification', 'Understanding Misinformation', 'Critical Reading'],
    'Aisha Bello', 'Learnly Originals', null, 4.4, 610],

  ['Fashion Design Fundamentals', 'Fashion Design', 'Beginner', '7 weeks',
    'From sketch to garment — the core skills behind designing your own clothing line.',
    ['Fashion Sketching', 'Fabric & Textiles', 'Pattern Making Basics', 'Garment Construction'],
    'Dr. Ada Okafor', 'Learnly Originals', 'Popular', 4.7, 1650],

  ['Sewing & Pattern Making', 'Fashion Design', 'Beginner', '6 weeks',
    'Hands-on sewing techniques and pattern drafting for real, wearable garments.',
    ['Sewing Machine Basics', 'Pattern Drafting', 'Seams & Finishes', 'Fitting Adjustments'],
    'Ngozi Balogun', 'Learnly Originals', null, 4.5, 780],

  ['Fashion Styling & Trends', 'Fashion Design', 'Beginner', '4 weeks',
    'Build outfits and collections with an eye for color, silhouette, and current trends.',
    ['Color & Silhouette', 'Building a Look Book', 'Trend Forecasting', 'Personal Styling'],
    'Aisha Bello', 'Learnly Originals', null, 4.3, 520],

  // ─── More courses in existing categories ───────────────────────────────
  ['SQL for Data Analysis', 'Data Science', 'Beginner', '5 weeks',
    'Query, join, and aggregate real datasets with SQL — the foundational skill for any data role.',
    ['SELECT & Filtering', 'Joins Across Tables', 'Aggregation & Grouping', 'Window Functions'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Bestseller', 4.8, 5100],

  ['Computer Vision Fundamentals', 'Artificial Intelligence', 'Advanced', '9 weeks',
    'Teach machines to see — image classification, object detection, and CNN architectures.',
    ['Image Processing Basics', 'Convolutional Networks', 'Object Detection', 'Transfer Learning'],
    'Tunde Bakare', 'Learnly Originals', 'Popular', 4.7, 2010],

  ['Cloud Security Essentials', 'Cybersecurity', 'Intermediate', '6 weeks',
    'Secure cloud infrastructure — identity management, encryption, and shared responsibility done right.',
    ['Identity & Access Management', 'Data Encryption', 'Shared Responsibility Model', 'Cloud Compliance'],
    'Aisha Bello', 'Learnly Originals', null, 4.5, 970],

  ['Serverless Architecture Basics', 'Cloud Computing', 'Intermediate', '5 weeks',
    'Design and deploy serverless applications with functions, event triggers, and managed services.',
    ['Functions as a Service', 'Event-Driven Design', 'API Gateways', 'Cost & Scaling'],
    'Dr. Ada Okafor', 'Learnly Originals', 'New', 4.4, 540],

  ['Negotiation Skills for Professionals', 'Business', 'Intermediate', '4 weeks',
    'Practical negotiation frameworks for salary talks, vendor deals, and everyday workplace conflict.',
    ['Preparing to Negotiate', 'BATNA & Leverage', 'Win-Win Tactics', 'Handling Difficult Counterparts'],
    'Ngozi Balogun', 'Learnly Originals', 'Popular', 4.7, 2760],

  ['Cryptocurrency Investing', 'Finance', 'Beginner', '4 weeks',
    'Evaluate and invest in crypto assets responsibly — risk, volatility, and portfolio allocation.',
    ['Crypto Asset Basics', 'Risk & Volatility', 'Wallets & Exchanges', 'Portfolio Allocation'],
    'Prof. Emeka Nwosu', 'Learnly Originals', null, 4.2, 1340],

  ['SEO Mastery', 'Marketing', 'Intermediate', '5 weeks',
    'Rank higher on search engines with technical SEO, keyword research, and link-building strategy.',
    ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building'],
    'Tunde Bakare', 'Learnly Originals', 'Bestseller', 4.8, 3980],

  ['Motion Graphics with After Effects', 'Design', 'Intermediate', '7 weeks',
    'Animate type, shapes, and illustrations into polished motion graphics for video and web.',
    ['Keyframe Animation', 'Shape Layers', 'Typography in Motion', 'Compositing Basics'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.6, 1870],

  ['Astronomy: Exploring the Universe', 'Science', 'Beginner', '6 weeks',
    'From our solar system to distant galaxies — a tour of how the universe works and how we study it.',
    ['The Solar System', 'Stars & Stellar Life Cycles', 'Galaxies', 'Cosmology Basics'],
    'Dr. Ada Okafor', 'Learnly Originals', null, 4.6, 1450],

  ['Linear Algebra Foundations', 'Mathematics', 'Intermediate', '7 weeks',
    'Vectors, matrices, and transformations — the math underneath machine learning and graphics.',
    ['Vectors & Vector Spaces', 'Matrix Operations', 'Eigenvalues & Eigenvectors', 'Linear Transformations'],
    'Ngozi Balogun', 'Learnly Originals', 'Popular', 4.7, 2230],

  ['Yoga & Mindfulness Fundamentals', 'Health & Fitness', 'Beginner', '4 weeks',
    'Build a sustainable yoga and mindfulness practice for flexibility, breath, and calm.',
    ['Foundational Poses', 'Breathwork Basics', 'Mindfulness Meditation', 'Building a Home Practice'],
    'Prof. Emeka Nwosu', 'Learnly Originals', 'Bestseller', 4.8, 3610],

  ['Emotional Intelligence at Work', 'Personal Development', 'Beginner', '4 weeks',
    'Recognize and manage emotions — yours and others\' — to work better with people.',
    ['Self-Awareness', 'Self-Regulation', 'Empathy in Practice', 'Managing Workplace Relationships'],
    'Aisha Bello', 'Learnly Originals', 'Popular', 4.7, 2440],

  ['Level Design with Unreal Engine', 'Game Development', 'Intermediate', '8 weeks',
    'Block out, light, and polish playable game levels using Unreal Engine.',
    ['Blockout Basics', 'Lighting a Level', 'Environmental Storytelling', 'Playtesting & Iteration'],
    'Tunde Bakare', 'Learnly Originals', null, 4.5, 1080],

  ['Flutter for Cross-Platform Apps', 'Mobile Development', 'Intermediate', '7 weeks',
    'Build one codebase that ships to iOS and Android using Flutter and Dart.',
    ['Dart Fundamentals', 'Widgets & Layouts', 'State Management', 'Publishing to App Stores'],
    'Dr. Ada Okafor', 'Learnly Originals', 'New', 4.6, 760],
]

const { getThumbnail } = require('./categoryImages')
const { generateLessonContent } = require('./lessonContent')

// Real, hand-picked YouTube videos shown alongside the written lesson
// content in the Learn flow. Keyed by exact course title -> { exact topic
// name -> YouTube URL }. Every course below has one video on its first topic.
const VIDEO_MAP = {
  'React Native for Mobile Apps':        { 'React Native Basics':        'https://www.youtube.com/watch?v=BUXnASp_WyQ' },
  'iOS Development with Swift':          { 'Swift Fundamentals':          'https://www.youtube.com/watch?v=8Xg7E9shq0U' },
  'Deep Learning with PyTorch':          { 'Tensors & Autograd':          'https://www.youtube.com/watch?v=V_xro1bcAuA' },
  'Natural Language Processing Basics':  { 'Text Preprocessing':          'https://www.youtube.com/watch?v=wcfSyNgk9Kk' },
  'Prompt Engineering for LLMs':         { 'LLM Fundamentals':            'https://www.youtube.com/watch?v=_ZvnD73m40o' },
  'Ethical Hacking Fundamentals':        { 'Footprinting & Recon':        'https://www.youtube.com/watch?v=3Kq1MIfTWCE' },
  'Network Security Essentials':         { 'Networking Basics':           'https://www.youtube.com/watch?v=U_P23SqJaDc' },
  'AWS Cloud Practitioner':              { 'Cloud Concepts':              'https://www.youtube.com/watch?v=SOTamWNgDKc' },
  'DevOps with Docker & Kubernetes':     { 'Docker Fundamentals':         'https://www.youtube.com/watch?v=Wf2eSG3owoA' },
  'Business Strategy Foundations':       { 'Strategic Analysis':          'https://www.youtube.com/watch?v=zyRkXq_VHww' },
  'Project Management Essentials':       { 'Project Lifecycle':           'https://www.youtube.com/watch?v=Oy9Ov-l_pGM' },
  'Personal Finance & Budgeting':        { 'Budgeting Basics':            'https://www.youtube.com/watch?v=LKxOamnP8J4' },
  'Investing 101: Stocks & Bonds':       { 'Markets & Asset Classes':     'https://www.youtube.com/watch?v=qIw-yFC-HNU' },
  'Startup Fundamentals':                { 'Idea Validation':             'https://www.youtube.com/watch?v=Th8JoIan4dg' },
  'Lean Startup Methodology':            { 'Build-Measure-Learn':         'https://www.youtube.com/watch?v=sjzL0pMuROg' },
  'Digital Marketing Fundamentals':      { 'SEO Basics':                  'https://www.youtube.com/watch?v=hIiHkaOw6Uw' },
  'Content Marketing & Storytelling':    { 'Content Strategy':            'https://www.youtube.com/watch?v=7Lod9Y3oHjg' },
  'UI/UX Design Principles':             { 'Design Thinking':             'https://www.youtube.com/watch?v=rJ1XdbpXT7s' },
  'Graphic Design Fundamentals':         { 'Typography Basics':           'https://www.youtube.com/watch?v=hkOqk8kf1xk' },
  'Figma for Product Designers':         { 'Figma Basics':                'https://www.youtube.com/watch?v=jwCmIBJ8Jtc' },
  'Introduction to 3D Modeling with Blender': { 'Blender Interface':      'https://www.youtube.com/watch?v=1kSVb-VEhNc' },
  'Character Animation Basics':          { '12 Principles of Animation':  'https://www.youtube.com/watch?v=uDqjIdI4bF4' },
  'Photography Fundamentals':            { 'Exposure Triangle':           'https://www.youtube.com/watch?v=_krYKDYURQ4' },
  'Portrait Photography Masterclass':    { 'Posing Fundamentals':         'https://www.youtube.com/watch?v=6pK6KOyO1YY' },
  'Music Theory Essentials':             { 'Scales & Key Signatures':     'https://www.youtube.com/watch?v=go3lc60E8vQ' },
  'Music Production with Ableton Live':  { 'DAW Basics':                  'https://www.youtube.com/watch?v=NzCt2uDF1Xg' },
  'Video Editing with Premiere Pro':     { 'Editing Basics':              'https://www.youtube.com/watch?v=xDq3ij-oHJA' },
  'Cinematography Fundamentals':         { 'Framing & Composition':       'https://www.youtube.com/watch?v=WHFrwpTr2MI' },
  'Creative Writing Workshop':           { 'Finding Your Voice':          'https://www.youtube.com/watch?v=oxFLbMSe7wI' },
  'Technical Writing Fundamentals':      { 'Audience & Purpose':          'https://www.youtube.com/watch?v=vT5pcc30Ffw' },
  'Spanish for Beginners':               { 'Greetings & Basics':          'https://www.youtube.com/watch?v=RbMn2CikYgI' },
  'French for Beginners':                { 'Greetings & Pronunciation':   'https://www.youtube.com/watch?v=o7YOYU38haY' },
  'Physics: Mechanics Fundamentals':     { 'Kinematics':                  'https://www.youtube.com/watch?v=_pH22LAM7Ek' },
  'Introduction to Chemistry':           { 'Atomic Structure':            'https://www.youtube.com/watch?v=lz_gMkQr7YE' },
  'Human Biology Essentials':            { 'Cell Biology':                'https://www.youtube.com/watch?v=jsDxw63QqK0' },
  'Calculus I: Limits & Derivatives':    { 'Limits & Continuity':         'https://www.youtube.com/watch?v=YLbMvvwYCcg' },
  'Statistics & Probability Basics':     { 'Descriptive Statistics':      'https://www.youtube.com/watch?v=FbGgAZSQp7M' },
  'World History: Ancient Civilizations': { 'Ancient Egypt':              'https://www.youtube.com/watch?v=Z3Wvw6BivVI' },
  'Introduction to Philosophy':          { 'What is Philosophy?':         'https://www.youtube.com/watch?v=1A_CAkYt3GY' },
  'Introduction to Psychology':          { 'Cognitive Psychology':        'https://www.youtube.com/watch?v=R-sVnmmw6WY' },
  'Fitness & Strength Training Basics':  { 'Training Fundamentals':       'https://www.youtube.com/watch?v=K_TZIKBk4jY' },
  'Productivity & Habit Building':       { 'Habit Formation':             'https://www.youtube.com/watch?v=BVi23iv2wBU' },
  'Instructional Design Fundamentals':   { 'Learning Objectives':         'https://www.youtube.com/watch?v=f5mVel5zc0A' },
  'Intellectual Property Law Basics':    { 'Copyright Basics':            'https://www.youtube.com/watch?v=Tamoj84j64I' },
  'Structural Engineering Fundamentals': { 'Statics Fundamentals':        'https://www.youtube.com/watch?v=xOkJFrXg8V0' },
  'Architectural Design Basics':         { 'Design Fundamentals':         'https://www.youtube.com/watch?v=rPveNM9IqYk' },
  'Unity Game Development':              { 'Unity Editor Basics':         'https://www.youtube.com/watch?v=gB1F9G0JXOo' },
  'Game Design Principles':              { 'Core Mechanics':              'https://www.youtube.com/watch?v=5Fk7p-f2ymY' },
  'Blockchain Fundamentals':             { 'Distributed Ledgers':         'https://www.youtube.com/watch?v=SyVMma1IkXM' },
  'Smart Contracts with Solidity':       { 'Solidity Syntax':             'https://www.youtube.com/watch?v=Qe-3FUxThso' },
  'NFTs & Digital Ownership':            { 'Token Standards':             'https://www.youtube.com/watch?v=OTbe5i3dyS4' },
  'Culinary Foundations':                { 'Knife Skills':                'https://www.youtube.com/watch?v=YrHpeEwk_-U' },
  'Baking & Pastry Basics':              { 'Dough & Batter Basics':       'https://www.youtube.com/watch?v=BJ-7AlHBT8c' },
  'World Cuisines: A Practical Tour':    { 'Mediterranean Cooking':       'https://www.youtube.com/watch?v=tq-0JjmeGW0' },
  'Real Estate Investing Basics':        { 'Market Analysis':             'https://www.youtube.com/watch?v=_lCofO9AuBM' },
  'Property Management Essentials':      { 'Tenant Screening':            'https://www.youtube.com/watch?v=mFabHtBeJCg' },
  'Real Estate Agent Fundamentals':      { 'Listing Properties':          'https://www.youtube.com/watch?v=FHiLFE0ecvE' },
  'Public Speaking Mastery':             { 'Overcoming Stage Fright':     'https://www.youtube.com/watch?v=eIho2S0ZahI' },
  'Persuasive Communication':            { 'Rhetoric Fundamentals':       'https://www.youtube.com/watch?v=cVtOl3qGcfw' },
  'Executive Presence & Communication':  { 'Tone & Body Language':        'https://www.youtube.com/watch?v=vaLle1MNN-E' },
  'Journalism Fundamentals':             { 'News Writing Basics':         'https://www.youtube.com/watch?v=OzpU9QgmD8o' },
  'Podcast Production Essentials':       { 'Show Planning':               'https://www.youtube.com/watch?v=MhwikevhcF4' },
  'Media Literacy & Misinformation':     { 'Spotting Bias':               'https://www.youtube.com/watch?v=1B1x3p3vesU' },
  'Fashion Design Fundamentals':         { 'Fashion Sketching':           'https://www.youtube.com/watch?v=ED84NRVGWNk' },
  'Sewing & Pattern Making':             { 'Sewing Machine Basics':       'https://www.youtube.com/watch?v=5S7qiIlXD4Y' },
  'Fashion Styling & Trends':            { 'Color & Silhouette':          'https://www.youtube.com/watch?v=PGR0rLZzPZM' },
  'SQL for Data Analysis':               { 'SELECT & Filtering':          'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  'Computer Vision Fundamentals':        { 'Image Processing Basics':     'https://www.youtube.com/watch?v=oXlwWbU8l2o' },
  'Cloud Security Essentials':           { 'Identity & Access Management':'https://www.youtube.com/watch?v=Ijkvx1u0w6o' },
  'Serverless Architecture Basics':      { 'Functions as a Service':      'https://www.youtube.com/watch?v=woqLi6NEW58' },
  'Negotiation Skills for Professionals':{ 'Preparing to Negotiate':      'https://www.youtube.com/watch?v=TpRTCmK2QMA' },
  'Cryptocurrency Investing':            { 'Crypto Asset Basics':         'https://www.youtube.com/watch?v=niT7g4ghm3o' },
  'SEO Mastery':                         { 'Keyword Research':            'https://www.youtube.com/watch?v=x6M7fzIzHKY' },
  'Motion Graphics with After Effects':  { 'Keyframe Animation':          'https://www.youtube.com/watch?v=uKZ8S29wgVA' },
  'Astronomy: Exploring the Universe':   { 'The Solar System':            'https://www.youtube.com/watch?v=TKM0P3XlMNA' },
  'Linear Algebra Foundations':          { 'Vectors & Vector Spaces':     'https://www.youtube.com/watch?v=br7tS1t2SFE' },
  'Yoga & Mindfulness Fundamentals':     { 'Foundational Poses':          'https://www.youtube.com/watch?v=WZwKrf5kyTM' },
  'Emotional Intelligence at Work':      { 'Self-Awareness':              'https://www.youtube.com/watch?v=Qmd5bnyiH_c' },
  'Level Design with Unreal Engine':     { 'Blockout Basics':             'https://www.youtube.com/watch?v=ZfalgxLtNyI' },
  'Flutter for Cross-Platform Apps':     { 'Dart Fundamentals':           'https://www.youtube.com/watch?v=Ej_Pcr4uC2Q' },
}

function toCourse([title, category, level, duration, description, topicNames, instructor, organization, tag, rating, reviewCount]) {
  return {
    title,
    description,
    instructor,
    organization,
    category,
    level,
    price: 0,
    tag: tag || null,
    duration,
    rating,
    reviewCount,
    thumbnail: getThumbnail(category, title),
    syllabus: topicNames.map((t, i) => `${i + 1}. ${t}`),
    topics: topicNames.map((name, i) => ({
      name,
      order: i + 1,
      prerequisites: i === 0 ? [] : [topicNames[i - 1]],
      lesson: {
        ...generateLessonContent(name, title),
        ...(VIDEO_MAP[title]?.[name] ? { videoUrl: VIDEO_MAP[title][name] } : {}),
      },
    })),
  }
}

const DEMO_COURSES = RAW.map(toCourse)

module.exports = { DEMO_COURSES }
