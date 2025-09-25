// Textcraft - Application Logic

// Application data
const appData = {
  "examBoards": [
    {
      "id": 1,
      "name": "CBSE",
      "type": "School Board",
      "description": "Central Board of Secondary Education",
      "totalPapers": 2500,
      "subjects": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science"],
      "classes": ["Class 9", "Class 10", "Class 11", "Class 12"]
    },
    {
      "id": 2,
      "name": "ICSE",
      "type": "School Board", 
      "description": "Indian Certificate of Secondary Education",
      "totalPapers": 1800,
      "subjects": ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography"],
      "classes": ["Class 9", "Class 10", "Class 11", "Class 12"]
    },
    {
      "id": 3,
      "name": "UPSC",
      "type": "Competitive Exam",
      "description": "Union Public Service Commission",
      "totalPapers": 500,
      "subjects": ["General Studies", "History", "Geography", "Polity", "Economics", "Science & Technology"],
      "examTypes": ["Prelims", "Mains", "Interview"]
    },
    {
      "id": 4,
      "name": "SSC",
      "type": "Competitive Exam",
      "description": "Staff Selection Commission",
      "totalPapers": 800,
      "subjects": ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"],
      "examTypes": ["CGL", "CHSL", "MTS", "CPO"]
    },
    {
      "id": 5,
      "name": "JEE",
      "type": "Entrance Exam",
      "description": "Joint Entrance Examination",
      "totalPapers": 600,
      "subjects": ["Physics", "Chemistry", "Mathematics"],
      "examTypes": ["JEE Main", "JEE Advanced"]
    },
    {
      "id": 6,
      "name": "NEET",
      "type": "Entrance Exam",
      "description": "National Eligibility cum Entrance Test",
      "totalPapers": 400,
      "subjects": ["Physics", "Chemistry", "Biology"],
      "examTypes": ["NEET UG", "NEET PG"]
    }
  ],
  "examPapers": [
    {
      "id": 1,
      "title": "CBSE Class 12 Physics Board Exam 2024",
      "examBoard": "CBSE",
      "year": 2024,
      "subject": "Physics",
      "class": "Class 12",
      "difficulty": "Medium",
      "duration": "3 hours",
      "maxMarks": 70,
      "paperType": "Theory",
      "downloadCount": 15420,
      "rating": 4.5,
      "fileSize": "2.1 MB"
    },
    {
      "id": 2,
      "title": "UPSC Prelims General Studies Paper 1 - 2023",
      "examBoard": "UPSC",
      "year": 2023,
      "subject": "General Studies",
      "difficulty": "Hard",
      "duration": "2 hours",
      "maxMarks": 200,
      "paperType": "MCQ",
      "downloadCount": 28500,
      "rating": 4.8,
      "fileSize": "1.8 MB"
    },
    {
      "id": 3,
      "title": "JEE Main Physics 2024 - Session 1",
      "examBoard": "JEE",
      "year": 2024,
      "subject": "Physics",
      "difficulty": "Hard",
      "duration": "3 hours",
      "maxMarks": 300,
      "paperType": "MCQ + Numerical",
      "downloadCount": 42300,
      "rating": 4.6,
      "fileSize": "2.5 MB"
    },
    {
      "id": 4,
      "title": "SSC CGL Tier 1 - General Awareness 2023",
      "examBoard": "SSC",
      "year": 2023,
      "subject": "General Awareness",
      "difficulty": "Medium",
      "duration": "1 hour",
      "maxMarks": 50,
      "paperType": "MCQ",
      "downloadCount": 35600,
      "rating": 4.3,
      "fileSize": "1.2 MB"
    },
    {
      "id": 5,
      "title": "NEET Biology 2024",
      "examBoard": "NEET",
      "year": 2024,
      "subject": "Biology",
      "difficulty": "Medium",
      "duration": "3 hours",
      "maxMarks": 360,
      "paperType": "MCQ",
      "downloadCount": 38900,
      "rating": 4.7,
      "fileSize": "2.8 MB"
    }
  ],
  "mockTests": [
    {
      "id": 1,
      "name": "CBSE Class 12 Physics Mock Test",
      "examBoard": "CBSE",
      "subject": "Physics",
      "difficulty": "Medium",
      "duration": 180,
      "totalQuestions": 35,
      "maxMarks": 70,
      "attempts": 15420,
      "avgScore": 58.5
    },
    {
      "id": 2,
      "name": "UPSC Prelims GS Mock Test",
      "examBoard": "UPSC", 
      "subject": "General Studies",
      "difficulty": "Hard",
      "duration": 120,
      "totalQuestions": 100,
      "maxMarks": 200,
      "attempts": 28500,
      "avgScore": 112.3
    },
    {
      "id": 3,
      "name": "JEE Main Mathematics Mock",
      "examBoard": "JEE",
      "subject": "Mathematics", 
      "difficulty": "Hard",
      "duration": 180,
      "totalQuestions": 30,
      "maxMarks": 300,
      "attempts": 42300,
      "avgScore": 185.7
    }
  ],
  "platformStats": {
    "totalPapers": 8500,
    "totalUsers": 250000,
    "testsAttempted": 1200000,
    "successRate": 76.5,
    "totalDownloads": 2500000,
    "institutionPartners": 450,
    "yearsOfData": 12,
    "subjectsAvailable": 85
  },
  "subscriptionPlans": [
    {
      "name": "Free",
      "price": 0,
      "features": ["5 papers per month", "Basic mock tests", "Limited analytics"],
      "popular": false
    },
    {
      "name": "Student Premium",
      "price": 299,
      "period": "month",
      "features": ["Unlimited papers", "AI mock tests", "Detailed analytics", "Download PDFs", "Study planner"],
      "popular": true
    },
    {
      "name": "Institutional",
      "price": 15000,
      "period": "year",
      "features": ["Multi-user access", "Bulk management", "Custom branding", "Advanced analytics", "Priority support"],
      "popular": false
    }
  ]
};

// Application state
const state = {
  currentTheme: 'light',
  filteredPapers: appData.examPapers,
  selectedBoard: '',
  selectedSubject: '',
  selectedYear: ''
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeEventListeners();
  renderPlatformStats();
  renderExamBoards();
  renderExamPapers();
  renderMockTests();
  renderPricingPlans();
  initializeSearchForm();
  renderStatsChart();
  setTimeout(animateCounters, 500); // Delay for better animation
});

// Theme management
function initializeTheme() {
  state.currentTheme = 'light';
  document.documentElement.setAttribute('data-color-scheme', state.currentTheme);
  updateThemeButton();
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-color-scheme', state.currentTheme);
  updateThemeButton();
}

function updateThemeButton() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.textContent = state.currentTheme === 'light' ? '🌙' : '☀️';
  }
}

// Event listeners
function initializeEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Login modal
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  const loginSubmit = document.getElementById('loginSubmit');

  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', function() {
      loginModal.classList.remove('hidden');
      const emailInput = document.getElementById('emailInput');
      if (emailInput) emailInput.focus();
    });
  }

  if (modalClose && loginModal) {
    modalClose.addEventListener('click', function() {
      loginModal.classList.add('hidden');
    });
  }

  if (modalOverlay && loginModal) {
    modalOverlay.addEventListener('click', function() {
      loginModal.classList.add('hidden');
    });
  }

  if (loginSubmit) {
    loginSubmit.addEventListener('click', function() {
      const emailInput = document.getElementById('emailInput');
      const email = emailInput?.value;
      if (email && email.includes('@')) {
  alert('Login functionality would be implemented here. Welcome to Textcraft!');
        if (loginModal) loginModal.classList.add('hidden');
        if (emailInput) emailInput.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

  // Search form
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      filterPapers();
    });
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Platform stats animation
function animateCounters() {
  const stats = appData.platformStats;
  const counters = [
    { id: 'totalPapers', target: stats.totalPapers, suffix: '+' },
    { id: 'totalUsers', target: stats.totalUsers, suffix: '+' },
    { id: 'testsAttempted', target: stats.testsAttempted, suffix: 'M+', divisor: 1000000 },
    { id: 'successRate', target: stats.successRate, suffix: '%' }
  ];

  counters.forEach(counter => {
    const element = document.getElementById(counter.id);
    if (element) {
      animateCounter(element, counter.target, counter.suffix, counter.divisor);
    }
  });
}

function animateCounter(element, target, suffix = '', divisor = 1) {
  let current = 0;
  const increment = target / 50;
  const displayTarget = divisor ? target / divisor : target;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    const displayValue = divisor ? Math.floor(current / divisor) : Math.floor(current);
    element.textContent = formatNumber(displayValue) + suffix;
  }, 40);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Render platform stats
function renderPlatformStats() {
  // Stats are animated by animateCounters function
}

// Render exam boards
function renderExamBoards() {
  const boardsGrid = document.getElementById('boardsGrid');
  if (!boardsGrid) return;

  const boardsHTML = appData.examBoards.map(board => `
    <div class="board-card" onclick="selectBoard('${board.name}')">
      <div class="board-header">
        <h4 class="board-name">${board.name}</h4>
        <span class="board-type">${board.type}</span>
      </div>
      <p class="board-description">${board.description}</p>
      <div class="board-stats">${board.totalPapers}+ Papers Available</div>
    </div>
  `).join('');

  boardsGrid.innerHTML = boardsHTML;
}

// Board selection (global function for onclick)
window.selectBoard = function(boardName) {
  state.selectedBoard = boardName;
  const boardSelect = document.getElementById('boardSelect');
  if (boardSelect) {
    boardSelect.value = boardName;
  }
  updateSubjectOptions();
  filterPapers();
  
  // Scroll to papers section
  const papersSection = document.getElementById('papers');
  if (papersSection) {
    papersSection.scrollIntoView({ behavior: 'smooth' });
  }
};

// Initialize search form
function initializeSearchForm() {
  const boardSelect = document.getElementById('boardSelect');
  const subjectSelect = document.getElementById('subjectSelect');
  const yearSelect = document.getElementById('yearSelect');

  if (!boardSelect) return;

  // Populate board options
  const boardOptions = ['<option value="">All Boards</option>']
    .concat(appData.examBoards.map(board => 
      `<option value="${board.name}">${board.name}</option>`
    ));
  boardSelect.innerHTML = boardOptions.join('');

  // Populate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = ['<option value="">All Years</option>']
    .concat(Array.from({length: 10}, (_, i) => {
      const year = currentYear - i;
      return `<option value="${year}">${year}</option>`;
    }));
  if (yearSelect) {
    yearSelect.innerHTML = yearOptions.join('');
  }

  // Initialize subject options
  updateSubjectOptions();

  // Add change listeners
  boardSelect.addEventListener('change', function() {
    state.selectedBoard = this.value;
    updateSubjectOptions();
    filterPapers();
  });

  if (subjectSelect) {
    subjectSelect.addEventListener('change', function() {
      state.selectedSubject = this.value;
      filterPapers();
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', function() {
      state.selectedYear = this.value;
      filterPapers();
    });
  }
}

// Update subject options based on selected board
function updateSubjectOptions() {
  const subjectSelect = document.getElementById('subjectSelect');
  if (!subjectSelect) return;

  let subjects = [];
  if (state.selectedBoard) {
    const board = appData.examBoards.find(b => b.name === state.selectedBoard);
    subjects = board ? board.subjects : [];
  } else {
    // Get all unique subjects
    subjects = [...new Set(appData.examBoards.flatMap(board => board.subjects))];
  }

  const subjectOptions = ['<option value="">All Subjects</option>']
    .concat(subjects.map(subject => 
      `<option value="${subject}">${subject}</option>`
    ));
  
  subjectSelect.innerHTML = subjectOptions.join('');
}

// Filter papers based on search criteria
function filterPapers() {
  let filtered = appData.examPapers;

  if (state.selectedBoard) {
    filtered = filtered.filter(paper => paper.examBoard === state.selectedBoard);
  }

  if (state.selectedSubject) {
    filtered = filtered.filter(paper => paper.subject === state.selectedSubject);
  }

  if (state.selectedYear) {
    filtered = filtered.filter(paper => paper.year.toString() === state.selectedYear);
  }

  state.filteredPapers = filtered;
  renderExamPapers();
}

// Render exam papers
function renderExamPapers() {
  const papersList = document.getElementById('papersList');
  if (!papersList) return;

  if (state.filteredPapers.length === 0) {
    papersList.innerHTML = '<div class="loading">No papers found matching your criteria.</div>';
    return;
  }

  const papersHTML = state.filteredPapers.map(paper => `
    <div class="paper-card">
      <h4 class="paper-title">${paper.title}</h4>
      <div class="paper-meta">
        <span class="paper-tag">${paper.examBoard}</span>
        <span class="paper-tag">${paper.year}</span>
        <span class="paper-tag">${paper.subject}</span>
        <span class="paper-tag paper-tag--difficulty">${paper.difficulty}</span>
      </div>
      <div class="paper-stats">
        <div class="paper-rating">
          <span>⭐ ${paper.rating}</span>
        </div>
        <div class="paper-downloads">${formatNumber(paper.downloadCount)} downloads</div>
      </div>
      <button class="btn btn--primary btn--full-width mt-8" onclick="downloadPaper(${paper.id})">
        Download Paper
      </button>
    </div>
  `).join('');

  papersList.innerHTML = papersHTML;
}

// Download paper function (global for onclick)
window.downloadPaper = function(paperId) {
  const paper = appData.examPapers.find(p => p.id === paperId);
  if (paper) {
    alert(`Downloading: ${paper.title}\nFile size: ${paper.fileSize}`);
  }
};

// Render mock tests
function renderMockTests() {
  const mockTestsGrid = document.getElementById('mockTestsGrid');
  if (!mockTestsGrid) return;

  const mockTestsHTML = appData.mockTests.map(test => `
    <div class="mock-test-card">
      <h4 class="mock-test-name">${test.name}</h4>
      <div class="mock-test-details">
        <div class="mock-test-detail">
          <strong>Duration:</strong> ${test.duration} mins
        </div>
        <div class="mock-test-detail">
          <strong>Questions:</strong> ${test.totalQuestions}
        </div>
        <div class="mock-test-detail">
          <strong>Max Marks:</strong> ${test.maxMarks}
        </div>
        <div class="mock-test-detail">
          <strong>Difficulty:</strong> ${test.difficulty}
        </div>
      </div>
      <div class="mock-test-footer">
        <div class="mock-test-attempts">${formatNumber(test.attempts)} attempts</div>
        <button class="btn btn--primary" onclick="startMockTest(${test.id})">
          Start Test
        </button>
      </div>
    </div>
  `).join('');

  mockTestsGrid.innerHTML = mockTestsHTML;
}

// Start mock test function (global for onclick)
window.startMockTest = function(testId) {
  const test = appData.mockTests.find(t => t.id === testId);
  if (test) {
    alert(`Starting: ${test.name}\nDuration: ${test.duration} minutes\nQuestions: ${test.totalQuestions}`);
  }
};

// Render pricing plans
function renderPricingPlans() {
  const plansGrid = document.getElementById('plansGrid');
  if (!plansGrid) return;

  const plansHTML = appData.subscriptionPlans.map(plan => `
    <div class="plan-card ${plan.popular ? 'plan-card--popular' : ''}">
      <h4 class="plan-name">${plan.name}</h4>
      <div class="plan-price">
        ₹${plan.price}
        ${plan.period ? `<span class="plan-period">/${plan.period}</span>` : ''}
      </div>
      <ul class="plan-features">
        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      <button class="btn ${plan.popular ? 'btn--primary' : 'btn--outline'} btn--full-width" 
              onclick="selectPlan('${plan.name}')">
        ${plan.price === 0 ? 'Get Started' : 'Choose Plan'}
      </button>
    </div>
  `).join('');

  plansGrid.innerHTML = plansHTML;
}

// Select plan function (global for onclick)
window.selectPlan = function(planName) {
  alert(`You selected the ${planName} plan. Redirecting to payment...`);
};

// Render stats chart
function renderStatsChart() {
  const statsChart = document.getElementById('statsChart');
  if (!statsChart) return;

  const ctx = statsChart.getContext('2d');
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Users (in thousands)',
          data: [50, 85, 120, 180, 220, 250],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Papers Added',
          data: [1000, 2500, 4200, 6800, 7800, 8500],
          borderColor: '#FFC185',
          backgroundColor: 'rgba(255, 193, 133, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Platform Growth Over Time'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });
}
