// Maps each course category to a relevant keyword used to fetch a real,
// category-matching stock photo from LoremFlickr (a keyword-based photo
// placeholder service — free, no API key required, stable for demo/seed data).
// Swap these out for real uploaded thumbnails later if you want fully
// custom art per course.

const CATEGORY_KEYWORDS = {
  'Data Science':          'data,analytics',
  'Computer Science':      'programming,code',
  'Mobile Development':    'smartphone,app',
  'Artificial Intelligence':'robot,ai',
  'Cybersecurity':         'cybersecurity,hacker',
  'Cloud Computing':       'cloud,server',
  'Business':              'business,office',
  'Finance':                'finance,money',
  'Entrepreneurship':       'startup,entrepreneur',
  'Marketing':              'marketing,advertising',
  'Design':                 'design,creative',
  '3D & Animation':         '3d,animation',
  'Photography':            'camera,photography',
  'Music':                  'music,instrument',
  'Video Production':       'videocamera,film',
  'Writing':                'writing,typewriter',
  'Language Learning':      'language,books',
  'Science':                'science,laboratory',
  'Mathematics':            'mathematics,numbers',
  'History':                'history,ancient',
  'Philosophy':             'philosophy,books',
  'Psychology':             'psychology,brain',
  'Health & Fitness':       'fitness,gym',
  'Personal Development':   'motivation,growth',
  'Teaching & Education':   'teaching,classroom',
  'Law':                    'law,justice',
  'Engineering':            'engineering,machinery',
  'Architecture':           'architecture,building',
  'Game Development':       'videogame,gaming',
  'Blockchain & Web3':      'blockchain,crypto',
  'Culinary Arts':          'cooking,kitchen',
  'Real Estate':            'realestate,property',
  'Public Speaking':        'publicspeaking,microphone',
  'Journalism & Media':     'journalism,newsroom',
  'Fashion Design':         'fashion,sewing',
}

const DEFAULT_KEYWORD = 'education,learning'

function hashToInt(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

function getThumbnail(category, seed = '') {
  const keyword = CATEGORY_KEYWORDS[category] || DEFAULT_KEYWORD
  // ?lock=<n> pins LoremFlickr to a specific photo for that number, so every
  // course keeps the same thumbnail on refresh, but different courses in the
  // same category (different seed = different lock) get different photos.
  const lock = seed ? `?lock=${hashToInt(seed)}` : ''
  return `https://loremflickr.com/640/360/${keyword}${lock}`
}

module.exports = { getThumbnail, CATEGORY_KEYWORDS }
