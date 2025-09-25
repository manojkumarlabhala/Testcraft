# Textcraft - Technical Documentation
[//]: # (Super Admin Ad Monetization Controls)

## 🤑 Ad Monetization Controls (Super Admin)

### Overview
Super Admins can manage ad monetization via the dashboard:
- Enable/disable ads platform-wide
- Select ad network (Google AdSense, custom)
- Set ad placement (Home, Dashboard, Community)
- View ad revenue stats

### How It Works
- Ad settings are stored in the backend (Supabase table recommended)
- API endpoints: `/api/admin/ad-controls` (GET/POST)
- Frontend checks ad settings to conditionally render ads
- Ad revenue stats are displayed in the dashboard

### Best Practices for Monetization
- Use Google AdSense for reliable revenue and compliance
- Place ads in high-traffic areas (Home, Dashboard)
- Avoid excessive ads to maintain user experience
- Offer ad-free plans for paid users
- Track revenue and optimize placement based on analytics

### Example API Usage
```js
// Get current ad settings
fetch('/api/admin/ad-controls').then(res => res.json())

// Update ad settings (Super Admin only)
fetch('/api/admin/ad-controls', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ adsEnabled: true, adNetwork: 'Google AdSense', adPlacement: 'Home Page' })
})
```

### Frontend Integration
- Use conditional rendering for `<AdBanner />` based on ad settings
- Example:
```tsx
{adsEnabled && adPlacement === "Home Page" && <AdBanner />}
```

### Security
- Only verified Super Admins can update ad settings
- Validate session and role in backend API

### References
- [Google AdSense Setup](https://support.google.com/adsense/answer/9724?hl=en)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)


## 🚀 Project Overview

Textcraft is a comprehensive full-stack web application designed to serve as a central hub for 10+ years of past exam papers from Indian educational systems, combined with AI-powered mock testing capabilities.

## 🏗️ Architecture Overview

### Frontend Technology Stack
- **Framework**: React.js / Next.js (recommended for production)
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API / Redux Toolkit
- **UI Components**: Custom component library with accessibility
- **PWA**: Progressive Web App capabilities for offline access

### Backend Technology Stack
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Neon for cloud hosting
- **Authentication**: Firebase Auth with JWT tokens
- **File Storage**: Firebase Storage for PDF documents
- **AI Integration**: OpenAI API for question generation
- **Payment**: Razorpay integration for Indian market

### Deployment & Infrastructure
- **Frontend**: Vercel / Netlify for static site deployment
- **Backend**: Railway / Render for API hosting
- **Database**: Neon PostgreSQL cloud database
- **CDN**: Cloudflare for global content delivery
- **Monitoring**: LogRocket / Sentry for error tracking

## 📊 Database Schema Design

\`\`\`sql
-- Core User Management
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15),
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'student', -- 'student', 'teacher', 'admin'
  profile_data JSONB,
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Educational Boards & Institutions
CREATE TABLE exam_boards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'school', 'competitive', 'entrance'
  description TEXT,
  logo_url VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exam Papers Repository
CREATE TABLE exam_papers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  exam_board_id INTEGER REFERENCES exam_boards(id),
  year INTEGER NOT NULL,
  subject VARCHAR(100) NOT NULL,
  class_level VARCHAR(50), -- 'Class 10', 'Class 12', 'Graduation', etc.
  difficulty VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  duration INTEGER, -- in minutes
  max_marks INTEGER,
  paper_type VARCHAR(50), -- 'mcq', 'descriptive', 'mixed'
  file_url VARCHAR(255),
  file_size INTEGER, -- in bytes
  metadata JSONB, -- additional paper information
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Question Bank for AI Mock Tests
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  paper_id INTEGER REFERENCES exam_papers(id),
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'mcq', -- 'mcq', 'numerical', 'descriptive'
  options JSONB, -- for MCQ options
  correct_answer TEXT,
  explanation TEXT,
  difficulty VARCHAR(20) DEFAULT 'medium',
  subject VARCHAR(100),
  topic VARCHAR(100),
  marks INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mock Test Configuration
CREATE TABLE mock_tests (
  id SERIAL PRIMARY KEY,
  creator_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  exam_board_id INTEGER REFERENCES exam_boards(id),
  subject VARCHAR(100),
  difficulty VARCHAR(20),
  duration INTEGER NOT NULL, -- in minutes
  total_questions INTEGER,
  max_marks INTEGER,
  question_ids INTEGER[], -- array of question IDs
  settings JSONB, -- test configuration
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Test Attempts & Results
CREATE TABLE test_attempts (
  id SERIAL PRIMARY KEY,
  test_id INTEGER REFERENCES mock_tests(id),
  user_id INTEGER REFERENCES users(id),
  answers JSONB, -- user's answers
  score INTEGER,
  percentage DECIMAL(5,2),
  time_taken INTEGER, -- in seconds
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  is_completed BOOLEAN DEFAULT false
);

-- User Progress Tracking
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject VARCHAR(100),
  topic VARCHAR(100),
  level VARCHAR(20), -- current proficiency level
  score_trend JSONB, -- historical scores
  total_tests INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0.0,
  last_activity TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookmarks & Favorites
CREATE TABLE user_bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  paper_id INTEGER REFERENCES exam_papers(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, paper_id)
);

-- Payment & Subscription Management
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  plan_name VARCHAR(50) NOT NULL,
  razorpay_subscription_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics & Usage Tracking
CREATE TABLE user_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  event_type VARCHAR(50), -- 'paper_download', 'test_start', 'test_complete'
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content Management
CREATE TABLE content_moderation (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50), -- 'paper', 'question', 'comment'
  content_id INTEGER,
  moderator_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 🔐 Authentication & Security

### Firebase Authentication Integration
\`\`\`javascript
// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication service
export const authService = {
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signInWithEmail: (email, password) => signInWithEmailAndPassword(auth, email, password),
  signUpWithEmail: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  signOut: () => signOut(auth),
  resetPassword: (email) => sendPasswordResetEmail(auth, email)
};
\`\`\`

### Role-Based Access Control
\`\`\`javascript
// Middleware for protected routes
export const requireAuth = (requiredRole = null) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      }
      
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token.' });
    }
  };
};
\`\`\`

## 💳 Payment Integration (Razorpay)

### Backend Payment API
\`\`\`javascript
// /api/payment/create-order
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, currency = 'INR', planName } = req.body;
      
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          plan: planName,
          userId: req.user.id
        }
      };
      
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// /api/payment/verify
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
      
      if (expectedSignature === razorpay_signature) {
        // Payment verified, update user subscription
        await updateUserSubscription(req.user.id, req.body.planName);
        res.status(200).json({ message: "Payment verified successfully" });
      } else {
        res.status(400).json({ error: "Invalid signature" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
\`\`\`

## 🤖 AI Integration for Mock Tests

### AI Question Generation Service
\`\`\`javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIQuestionGenerator {
  static async generateQuestions(params) {
    const { subject, topic, difficulty, count, questionType } = params;
    
    const prompt = `
    Generate ${count} ${difficulty} level ${questionType} questions for ${subject} - ${topic}.
    
    Format each question as JSON with:
    - question: The question text
    - options: Array of 4 options (for MCQ)
    - correctAnswer: Index of correct option (0-3)
    - explanation: Detailed explanation of the answer
    - difficulty: "${difficulty}"
    - marks: Number of marks (1-5 based on difficulty)
    
    Ensure questions are relevant to Indian educational standards.
    `;
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI Question Generation Error:', error);
      throw new Error('Failed to generate questions');
    }
  }
  
  static async generateExplanation(question, userAnswer, correctAnswer) {
    const prompt = `
    For the question: "${question}"
    User answered: "${userAnswer}"
    Correct answer: "${correctAnswer}"
    
    Provide a detailed explanation of why the correct answer is right and why the user's answer (if wrong) is incorrect.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  }
}
\`\`\`

### Mock Test Engine
\`\`\`javascript
export class MockTestEngine {
  static async createAdaptiveTest(userId, preferences) {
    const { subject, difficulty, duration, questionCount } = preferences;
    
    // Get user's historical performance
    const userProgress = await getUserProgress(userId, subject);
    
    // Generate questions using AI
    const questions = await AIQuestionGenerator.generateQuestions({
      subject,
      topic: userProgress.weakAreas?.[0] || 'general',
      difficulty: this.adjustDifficulty(difficulty, userProgress.averageScore),
      count: questionCount,
      questionType: 'mcq'
    });
    
    // Create test record
    const testId = await this.saveTest({
      creatorId: userId,
      name: `AI Generated ${subject} Test`,
      questions,
      duration,
      difficulty,
      isAdaptive: true
    });
    
    return testId;
  }
  
  static adjustDifficulty(baseDifficulty, userScore) {
    if (userScore > 80) return 'hard';
    if (userScore > 60) return 'medium';
    return 'easy';
  }
  
  static async calculateResults(testAttemptId) {
    const attempt = await getTestAttempt(testAttemptId);
    const questions = await getTestQuestions(attempt.testId);
    
    let score = 0;
    let totalMarks = 0;
    const analysis = {
      correct: 0,
      incorrect: 0,
      unattempted: 0,
      subjectWise: {},
      topicWise: {}
    };
    
    questions.forEach((question, index) => {
      const userAnswer = attempt.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      totalMarks += question.marks;
      if (isCorrect) {
        score += question.marks;
        analysis.correct++;
      } else if (userAnswer !== null) {
        analysis.incorrect++;
      } else {
        analysis.unattempted++;
      }
      
      // Subject-wise analysis
      if (!analysis.subjectWise[question.subject]) {
        analysis.subjectWise[question.subject] = { correct: 0, total: 0 };
      }
      analysis.subjectWise[question.subject].total++;
      if (isCorrect) analysis.subjectWise[question.subject].correct++;
    });
    
    const percentage = (score / totalMarks) * 100;
    
    // Update user progress
    await updateUserProgress(attempt.userId, {
      subject: questions[0].subject,
      score: percentage,
      testDate: new Date(),
      analysis
    });
    
    return {
      score,
      totalMarks,
      percentage,
      analysis,
      rank: await calculateRank(attempt.userId, percentage),
      recommendations: await generateRecommendations(analysis)
    };
  }
}
\`\`\`

## 📱 Frontend Implementation

### React Component Structure
\`\`\`javascript
// App.js - Main application component
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Page components
import HomePage from './pages/HomePage';
import PapersPage from './pages/PapersPage';
import MockTestsPage from './pages/MockTestsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';

// Layout components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/papers" element={<PapersPage />} />
                <Route path="/mock-tests" element={<MockTestsPage />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
\`\`\`

### Advanced Search Component
\`\`\`javascript
// components/Search/AdvancedSearch.js
import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const AdvancedSearch = ({ onSearch, examBoards }) => {
  const [filters, setFilters] = useState({
    query: '',
    examBoard: '',
    subject: '',
    year: '',
    difficulty: '',
    type: ''
  });
  
  const debouncedQuery = useDebounce(filters.query, 300);
  
  useEffect(() => {
    onSearch(filters);
  }, [debouncedQuery, filters.examBoard, filters.subject, filters.year, filters.difficulty, filters.type]);
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div className="advanced-search">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search papers, subjects, or topics..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="search-input"
        />
        <button className="search-btn">🔍</button>
      </div>
      
      <div className="filters-grid">
        <select
          value={filters.examBoard}
          onChange={(e) => handleFilterChange('examBoard', e.target.value)}
          className="filter-select"
        >
          <option value="">All Boards</option>
          {examBoards.map(board => (
            <option key={board.id} value={board.name}>{board.name}</option>
          ))}
        </select>
        
        <select
          value={filters.subject}
          onChange={(e) => handleFilterChange('subject', e.target.value)}
          className="filter-select"
        >
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="English">English</option>
          <option value="General Studies">General Studies</option>
        </select>
        
        <select
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="filter-select"
        >
          <option value="">All Years</option>
          {Array.from({ length: 15 }, (_, i) => 2024 - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="filter-select"
        >
          <option value="">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );
};

export default AdvancedSearch;
\`\`\`

### Mock Test Component
\`\`\`javascript
// components/MockTest/TestInterface.js
import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';

const TestInterface = ({ test, questions, onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { timeLeft, start, pause, resume } = useTimer(test.duration * 60);
  const autoSaveRef = useRef();
  
  useEffect(() => {
    start();
    
    // Auto-save every 30 seconds
    autoSaveRef.current = setInterval(() => {
      saveProgress();
    }, 30000);
    
    return () => {
      clearInterval(autoSaveRef.current);
    };
  }, []);
  
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);
  
  const saveProgress = async () => {
    try {
      await fetch(`/api/tests/${test.id}/save-progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, currentQuestion })
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };
  
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };
  
  const handleMarkForReview = (questionIndex) => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const results = await fetch(`/api/tests/${test.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          timeTaken: (test.duration * 60) - timeLeft,
          markedForReview: Array.from(markedForReview)
        })
      }).then(res => res.json());
      
      onSubmit(results);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
    }
  };
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getQuestionStatus = (index) => {
    if (answers[index] !== undefined) return 'answered';
    if (markedForReview.has(index)) return 'marked';
    return 'not-attempted';
  };
  
  return (
    <div className="test-interface">
      {/* Header */}
      <div className="test-header">
        <h2>{test.name}</h2>
        <div className="test-timer">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Question Navigation */}
      <div className="question-nav">
        <div className="question-grid">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-nav-btn ${getQuestionStatus(index)} ${currentQuestion === index ? 'current' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <div className="nav-legend">
          <span className="legend-item answered">Answered</span>
          <span className="legend-item marked">Marked for Review</span>
          <span className="legend-item not-attempted">Not Attempted</span>
        </div>
      </div>
      
      {/* Question Display */}
      <div className="question-content">
        <div className="question-header">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Marks: {questions[currentQuestion].marks}</span>
        </div>
        
        <div className="question-text">
          {questions[currentQuestion].questionText}
        </div>
        
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(currentQuestion, index)}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>
        
        <div className="question-actions">
          <button
            className="btn btn-outline"
            onClick={() => handleMarkForReview(currentQuestion)}
          >
            {markedForReview.has(currentQuestion) ? 'Unmark' : 'Mark for Review'}
          </button>
          
          <div className="navigation-buttons">
            <button
              className="btn btn-secondary"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </button>
            
            <button
              className="btn btn-secondary"
              disabled={currentQuestion === questions.length - 1}
              onClick={() => setCurrentQuestion(prev => prev + 1)}
            >
              Next
            </button>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;
\`\`\`

## 📊 Analytics & Reporting

### User Performance Analytics
\`\`\`javascript
// services/analyticsService.js
export class AnalyticsService {
  static async getUserAnalytics(userId, timeRange = '30d') {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));
    
    const [
      performanceData,
      subjectAnalysis,
      testHistory,
      compareData
    ] = await Promise.all([
      this.getPerformanceData(userId, startDate, endDate),
      this.getSubjectAnalysis(userId),
      this.getTestHistory(userId, startDate, endDate),
      this.getPeerComparison(userId)
    ]);
    
    return {
      performance: performanceData,
      subjects: subjectAnalysis,
      history: testHistory,
      comparison: compareData,
      insights: this.generateInsights(performanceData, subjectAnalysis)
    };
  }
  
  static async getPerformanceData(userId, startDate, endDate) {
    const query = `
      SELECT 
        DATE(completed_at) as test_date,
        AVG(percentage) as avg_score,
        COUNT(*) as tests_taken
      FROM test_attempts 
      WHERE user_id = $1 
        AND completed_at BETWEEN $2 AND $3
        AND is_completed = true
      GROUP BY DATE(completed_at)
      ORDER BY test_date
    `;
    
    const result = await db.query(query, [userId, startDate, endDate]);
    return result.rows;
  }
  
  static async getSubjectAnalysis(userId) {
    const query = `
      SELECT 
        up.subject,
        up.average_score,
        up.total_tests,
        COUNT(DISTINCT up.topic) as topics_covered,
        ARRAY_AGG(DISTINCT up.topic ORDER BY up.average_score ASC) as weak_topics
      FROM user_progress up
      WHERE up.user_id = $1
      GROUP BY up.subject, up.average_score, up.total_tests
      ORDER BY up.average_score DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }
  
  static generateInsights(performanceData, subjectAnalysis) {
    const insights = [];
    
    // Performance trend analysis
    if (performanceData.length >= 5) {
      const recent = performanceData.slice(-5);
      const earlier = performanceData.slice(-10, -5);
      
      const recentAvg = recent.reduce((sum, item) => sum + parseFloat(item.avg_score), 0) / recent.length;
      const earlierAvg = earlier.reduce((sum, item) => sum + parseFloat(item.avg_score), 0) / earlier.length;
      
      if (recentAvg > earlierAvg + 5) {
        insights.push({
          type: 'improvement',
          message: `Great progress! Your performance has improved by ${(recentAvg - earlierAvg).toFixed(1)}% in recent tests.`
        });
      } else if (recentAvg < earlierAvg - 5) {
        insights.push({
          type: 'decline',
          message: `Your recent performance has declined. Consider reviewing weak topics and taking more practice tests.`
        });
      }
    }
    
    // Subject-wise insights
    const weakestSubject = subjectAnalysis.reduce((min, subject) => 
      subject.average_score < min.average_score ? subject : min
    );
    
    if (weakestSubject.average_score < 60) {
      insights.push({
        type: 'focus_area',
        message: `Focus on ${weakestSubject.subject}. Your current average is ${weakestSubject.average_score}%. Try more practice tests in this subject.`
      });
    }
    
    return insights;
  }
}
\`\`\`

## 🚀 Deployment Configuration

### Production Environment Variables
\`\`\`bash
# .env.production
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
JWT_SECRET=your_jwt_secret_key

# Payment Gateway
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key

# AI Services
OPENAI_API_KEY=sk-your_openai_api_key

# File Storage
FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Monitoring
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
\`\`\`

### Docker Configuration
\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine

# Install dependencies for Sharp (image optimization)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]
\`\`\`

### Production Deployment Script
\`\`\`yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  redis_data:
\`\`\`

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component with WebP support
- **Caching**: Service worker for offline functionality
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Progressive loading of content

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexes
- **Caching Layer**: Redis for session management and query caching
- **CDN Integration**: CloudFront/Cloudflare for static assets
- **Database Connection Pooling**: Efficient database connections
- **API Rate Limiting**: Prevent abuse and ensure fair usage

### Monitoring & Analytics
- **Performance Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Sentry for error monitoring
- **User Analytics**: Google Analytics 4 integration
- **Server Monitoring**: CPU, memory, and database performance
- **Business Metrics**: User engagement and conversion tracking

## 🔄 API Documentation

### Authentication Endpoints
\`\`\`
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
\`\`\`

### Papers & Content Endpoints
\`\`\`
GET /api/papers
GET /api/papers/:id
POST /api/papers (admin only)
PUT /api/papers/:id (admin only)
DELETE /api/papers/:id (admin only)
GET /api/papers/search
GET /api/papers/download/:id
\`\`\`

### Mock Tests Endpoints
\`\`\`
GET /api/tests
POST /api/tests/create
GET /api/tests/:id
POST /api/tests/:id/start
POST /api/tests/:id/submit
GET /api/tests/:id/results
GET /api/tests/history
\`\`\`

### User & Analytics Endpoints
\`\`\`
GET /api/user/profile
PUT /api/user/profile
GET /api/user/analytics
GET /api/user/progress
POST /api/user/bookmark
GET /api/user/bookmarks
\`\`\`

### Payment Endpoints
\`\`\`
POST /api/payment/create-order
POST /api/payment/verify
GET /api/payment/plans
POST /api/subscription/create
PUT /api/subscription/cancel
\`\`\`

## 🤖 Groq AI Integration

### API Endpoint for Mock Test Generation
- **Route:** `/api/mock-tests/create`
- **Method:** POST
- **Request Body:**
  - `subject`: string
  - `topic`: string
  - `difficulty`: string
  - `count`: number
  - `questionType`: string
- **Response:**
  - `questions`: Array of generated questions (with options, correctAnswer, explanation, etc.)

### Usage Example
```js
fetch('/api/mock-tests/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Physics',
    topic: 'Electromagnetism',
    difficulty: 'Medium',
    count: 10,
    questionType: 'mcq'
  })
})
  .then(res => res.json())
  .then(data => console.log(data.questions))
```

### Implementation
- Backend utility: `lib/groq.ts` (see code for details)
- Frontend: Integrated in `MockTestsSection` via `CreateMockTestForm`
- Error handling and loading states included

### Environment Variable
- Set `GROQ_API_KEY` in your environment for production use.

This comprehensive technical documentation provides a complete blueprint for implementing the Textcraft platform with production-ready architecture, security measures, and scalability considerations.
