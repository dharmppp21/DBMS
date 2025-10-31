// React Context for Global State Management
const { useState, useContext, createContext, useEffect } = React;

// Mock Data
const MOCK_DATA = {
  preLoginStats: {
    totalItems: 12450,
    recipients: 3200,
    institutions: 156,
    volunteers: 450
  },
  testimonials: [
    {
      id: 1,
      message: "Thanks to this platform, I was able to donate my old textbooks and help students in need. The process was seamless!",
      author: "Priya Sharma",
      role: "College Student"
    },
    {
      id: 2,
      message: "I've donated over 50 items through this platform. Seeing the impact on recipients' lives is incredibly rewarding!",
      author: "Rajesh Kumar",
      role: "Alumni Donor"
    },
    {
      id: 3,
      message: "The gamification features make donating fun! I'm competing with friends to help more students. Win-win!",
      author: "Anita Desai",
      role: "Faculty Member"
    }
  ],
  users: [
    {
      id: 1,
      name: "Amit Singh",
      email: "amit.singh@example.com",
      phone: "+91 98765 43210",
      institution: "IIT Delhi",
      address: "New Delhi, India",
      registrationDate: "2024-01-15",
      verificationStatus: "verified",
      level: "Gold",
      points: 850,
      password: "password123"
    }
  ],
  donations: [
    {
      id: 1,
      donorId: 1,
      batchId: "BTH001",
      items: [
        { id: 1, name: "Engineering Textbook", category: "Books", condition: "Good", value: 500 },
        { id: 2, name: "Scientific Calculator", category: "Electronics", condition: "Excellent", value: 800 }
      ],
      status: "completed",
      createdDate: "2024-10-15",
      rating: 5
    },
    {
      id: 2,
      donorId: 1,
      batchId: "BTH002",
      items: [
        { id: 3, name: "Winter Jacket", category: "Clothes", condition: "Good", value: 1200 },
        { id: 4, name: "Notebooks Set", category: "Stationery", condition: "New", value: 300 }
      ],
      status: "distributed",
      createdDate: "2024-10-20"
    },
    {
      id: 3,
      donorId: 1,
      batchId: "BTH003",
      items: [
        { id: 5, name: "Laptop Bag", category: "Accessories", condition: "Good", value: 600 }
      ],
      status: "pickup",
      createdDate: "2024-10-25"
    },
    {
      id: 4,
      donorId: 1,
      batchId: "BTH004",
      items: [
        { id: 6, name: "Tablet", category: "Electronics", condition: "Fair", value: 5000 }
      ],
      status: "approved",
      createdDate: "2024-10-28"
    },
    {
      id: 5,
      donorId: 1,
      batchId: "BTH005",
      items: [
        { id: 7, name: "Books Set", category: "Books", condition: "Good", value: 800 }
      ],
      status: "pending",
      createdDate: "2024-10-30"
    }
  ],
  leaderboard: [
    { rank: 1, name: "Amit Singh", items: 45, points: 850, institution: "IIT Delhi" },
    { rank: 2, name: "Priya Sharma", items: 38, points: 720, institution: "DU" },
    { rank: 3, name: "Rajesh Kumar", items: 32, points: 680, institution: "IIT Bombay" },
    { rank: 4, name: "Anita Desai", items: 28, points: 590, institution: "JNU" },
    { rank: 5, name: "Vikram Patel", items: 25, points: 520, institution: "BITS Pilani" }
  ],
  notifications: [
    {
      id: 1,
      type: "approved",
      title: "Batch Approved",
      message: "Your donation batch BTH005 has been approved!",
      timestamp: "2024-10-30T14:30:00",
      read: false
    },
    {
      id: 2,
      type: "pickup",
      title: "Pickup Scheduled",
      message: "Pickup for batch BTH003 scheduled for tomorrow at 2 PM.",
      timestamp: "2024-10-29T10:15:00",
      read: false
    },
    {
      id: 3,
      type: "distributed",
      title: "Items Distributed",
      message: "Your donated items from batch BTH002 have been distributed to 3 recipients.",
      timestamp: "2024-10-28T16:45:00",
      read: true
    },
    {
      id: 4,
      type: "feedback",
      title: "Recipient Feedback",
      message: "A recipient has rated your donation 5 stars! View their feedback.",
      timestamp: "2024-10-27T09:20:00",
      read: true
    }
  ],
  impactStories: [
    {
      id: 1,
      recipient: "Student A",
      institution: "Delhi University",
      message: "The textbooks I received helped me ace my exams. I'm so grateful to the donor!",
      rating: 5,
      date: "2024-10-20"
    },
    {
      id: 2,
      recipient: "Student B",
      institution: "IIT Bombay",
      message: "The laptop I received changed my life. Now I can complete my coursework on time!",
      rating: 5,
      date: "2024-10-18"
    },
    {
      id: 3,
      recipient: "Student C",
      institution: "JNU",
      message: "The winter jacket donation came at the perfect time. Thank you so much!",
      rating: 4,
      date: "2024-10-15"
    }
  ],
  achievements: [
    { id: 1, icon: "🎖️", title: "First Donation", desc: "Made your first donation", unlocked: true },
    { id: 2, icon: "🔟", title: "10 Items!", desc: "Donated 10 items", unlocked: true },
    { id: 3, icon: "5️⃣0️⃣", title: "50 Items!", desc: "Donated 50 items", unlocked: false },
    { id: 4, icon: "💯", title: "100 Items!", desc: "Donated 100 items", unlocked: false },
    { id: 5, icon: "⭐", title: "Top 10 Donor", desc: "Ranked in top 10", unlocked: true },
    { id: 6, icon: "🏆", title: "Champion", desc: "#1 ranked donor", unlocked: true }
  ]
};

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in memory (simulating session)
    const userData = window.sessionUser;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password) => {
    // Mock login - find user
    const foundUser = MOCK_DATA.users.find(u => 
      (u.email === email || u.phone === email) && u.password === password
    );
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      setIsAuthenticated(true);
      window.sessionUser = userData; // Store in window object
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Mock registration
    const newUser = {
      id: MOCK_DATA.users.length + 1,
      ...userData,
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
      level: "Bronze",
      points: 0
    };
    MOCK_DATA.users.push(newUser);
    
    const userDataClean = { ...newUser };
    delete userDataClean.password;
    setUser(userDataClean);
    setIsAuthenticated(true);
    window.sessionUser = userDataClean;
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    window.sessionUser = null;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Notification Context
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_DATA.notifications);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, deleteNotification, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotifications = () => useContext(NotificationContext);

// Components

// Login Page Component
const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🎓 Student Resource Donation</h1>
            <p>Make a difference by sharing resources</p>
          </div>
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Register
            </button>
          </div>
          
          <div className="auth-body">
            {activeTab === 'login' ? <LoginForm login={login} /> : <RegisterForm register={register} />}
          </div>
        </div>
        
        <PreLoginImpact />
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    twoFa: false
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = login(formData.email, formData.password);
    if (!success) {
      setError('Invalid credentials. Try: amit.singh@example.com / password123');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email or Phone</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email or phone"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="twoFa"
              checked={formData.twoFa}
              onChange={(e) => setFormData({...formData, twoFa: e.target.checked})}
            />
            <label htmlFor="twoFa">Enable Two-Factor Authentication</label>
          </div>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <button type="submit" className="btn btn-primary btn-block">Login</button>
        
        <div className="text-center mt-16">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }} style={{color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)'}}>Forgot Password?</a>
        </div>
        
        <div className="divider">OR</div>
        
        <div className="social-login">
          <button type="button" className="btn btn-outline btn-block">
            <span>🔵</span> Continue with Google
          </button>
        </div>
      </form>
      
      {showForgotPassword && (
        <Modal onClose={() => setShowForgotPassword(false)} title="Forgot Password">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" />
          </div>
          <button className="btn btn-primary btn-block">Send Reset Link</button>
        </Modal>
      )}
    </>
  );
};

// Register Form Component
const RegisterForm = ({ register }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    institution: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferences: []
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Institution' },
    { number: 3, label: 'Address' },
    { number: 4, label: 'Preferences' }
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.institution) newErrors.institution = 'Institution is required';
    } else if (step === 3) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        // Submit registration
        register(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePreference = (pref) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

  return (
    <>
      <div className="progress-bar">
        {steps.map(step => (
          <div key={step.number} className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
            <div className="progress-step-circle">{step.number}</div>
            <div className="progress-step-label">{step.label}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
        {currentStep === 1 && (
          <>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'error' : ''}`}
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </>
        )}
        
        {currentStep === 2 && (
          <>
            <div className="form-group">
              <label className="form-label">Institution</label>
              <select
                className={`form-control ${errors.institution ? 'error' : ''}`}
                value={formData.institution}
                onChange={(e) => setFormData({...formData, institution: e.target.value})}
              >
                <option value="">Select your institution</option>
                <option value="IIT Delhi">IIT Delhi</option>
                <option value="IIT Bombay">IIT Bombay</option>
                <option value="DU">Delhi University</option>
                <option value="JNU">JNU</option>
                <option value="BITS Pilani">BITS Pilani</option>
                <option value="Other">Other</option>
              </select>
              {errors.institution && <div className="form-error">{errors.institution}</div>}
            </div>
          </>
        )}
        
        {currentStep === 3 && (
          <>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                className={`form-control ${errors.address ? 'error' : ''}`}
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              {errors.address && <div className="form-error">{errors.address}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className={`form-control ${errors.city ? 'error' : ''}`}
                placeholder="Enter your city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              {errors.city && <div className="form-error">{errors.city}</div>}
            </div>
            
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your state"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter ZIP code"
                value={formData.zipCode}
                onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              />
            </div>
          </>
        )}
        
        {currentStep === 4 && (
          <>
            <div className="form-group">
              <label className="form-label">Donation Preferences (Select all that apply)</label>
              {['Books', 'Clothes', 'Electronics', 'Accessories', 'Stationery', 'Other'].map(pref => (
                <div key={pref} className="form-checkbox" style={{marginBottom: 'var(--space-8)'}}>
                  <input
                    type="checkbox"
                    id={pref}
                    checked={formData.preferences.includes(pref)}
                    onChange={() => togglePreference(pref)}
                  />
                  <label htmlFor={pref}>{pref}</label>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="flex gap-16" style={{marginTop: 'var(--space-24)'}}>
          {currentStep > 1 && (
            <button type="button" className="btn btn-outline" onClick={handleBack}>Back</button>
          )}
          <button type="submit" className="btn btn-primary" style={{flex: 1}}>
            {currentStep === 4 ? 'Complete Registration' : 'Next'}
          </button>
        </div>
      </form>
    </>
  );
};

// Pre-Login Impact Section
const PreLoginImpact = () => {
  return (
    <div className="pre-login-section">
      <div className="container">
        <h2 className="text-center" style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-32)'}}>Our Impact</h2>
        
        <div className="pre-login-stats">
          <div className="pre-login-stat">
            <div className="pre-login-stat-value">{MOCK_DATA.preLoginStats.totalItems.toLocaleString()}</div>
            <div className="pre-login-stat-label">Items Donated</div>
          </div>
          <div className="pre-login-stat">
            <div className="pre-login-stat-value">{MOCK_DATA.preLoginStats.recipients.toLocaleString()}</div>
            <div className="pre-login-stat-label">Recipients Helped</div>
          </div>
          <div className="pre-login-stat">
            <div className="pre-login-stat-value">{MOCK_DATA.preLoginStats.institutions}</div>
            <div className="pre-login-stat-label">Institutions</div>
          </div>
          <div className="pre-login-stat">
            <div className="pre-login-stat-value">{MOCK_DATA.preLoginStats.volunteers}</div>
            <div className="pre-login-stat-label">Active Donors</div>
          </div>
        </div>
        
        <h3 className="text-center" style={{fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-24)'}}>What Our Donors Say</h3>
        <div className="testimonials">
          {MOCK_DATA.testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial">
              <div className="testimonial-message">"{testimonial.message}"</div>
              <div className="testimonial-author">{testimonial.author}</div>
              <div className="testimonial-role">{testimonial.role}</div>
            </div>
          ))}
        </div>
        
        <div className="how-it-works">
          <h3 className="text-center" style={{fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)'}}>How It Works</h3>
          <div className="how-it-works-steps">
            <div className="how-it-works-step">
              <div className="how-it-works-number">1</div>
              <div className="how-it-works-title">Register</div>
              <div className="how-it-works-desc">Create your donor account in minutes</div>
            </div>
            <div className="how-it-works-step">
              <div className="how-it-works-number">2</div>
              <div className="how-it-works-title">List Items</div>
              <div className="how-it-works-desc">Add items you want to donate</div>
            </div>
            <div className="how-it-works-step">
              <div className="how-it-works-number">3</div>
              <div className="how-it-works-title">Schedule Pickup</div>
              <div className="how-it-works-desc">We'll collect items from your location</div>
            </div>
            <div className="how-it-works-step">
              <div className="how-it-works-number">4</div>
              <div className="how-it-works-title">Track Impact</div>
              <div className="how-it-works-desc">See how your donations help students</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Bar
const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎓 Donor Portal
      </div>
      <div className="navbar-menu">
        <button
          className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentPage('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
          onClick={() => setCurrentPage('history')}
        >
          History
        </button>
        <button
          className={`nav-link ${currentPage === 'impact' ? 'active' : ''}`}
          onClick={() => setCurrentPage('impact')}
        >
          Impact
        </button>
        <button
          className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
          onClick={() => setCurrentPage('notifications')}
        >
          Notifications {unreadCount > 0 && <span className="badge badge-pending" style={{marginLeft: 'var(--space-4)'}}>{unreadCount}</span>}
        </button>
        <button
          className={`nav-link ${currentPage === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentPage('profile')}
        >
          Profile
        </button>
        <button className="btn btn-sm btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

// Dashboard Component
const Dashboard = ({ setCurrentPage, setShowNewDonation }) => {
  const { user } = useAuth();
  const donations = MOCK_DATA.donations.filter(d => d.donorId === user.id);
  
  const totalItems = donations.reduce((sum, d) => sum + d.items.length, 0);
  const recipients = donations.filter(d => d.status === 'completed' || d.status === 'distributed').length * 2;
  const batches = donations.length;
  const points = user.points;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <div className="dashboard-subtitle">
          <span className={`badge badge-${user.level.toLowerCase()}`}>{user.level} Donor</span>
          <span style={{marginLeft: 'var(--space-12)', color: 'var(--color-text-secondary)'}}>Verified: {user.verificationStatus === 'verified' ? '✅' : '⏳'}</span>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{totalItems}</div>
              <div className="stat-card-label">Total Items Donated</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-1)', color: 'var(--primary-blue)'}}>📦</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{recipients}</div>
              <div className="stat-card-label">Recipients Helped</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-3)', color: 'var(--secondary-green)'}}>👥</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{batches}</div>
              <div className="stat-card-label">Total Batches</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-6)', color: 'var(--accent-orange)'}}>📋</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{points}</div>
              <div className="stat-card-label">Impact Points</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-5)', color: '#8b5cf6'}}>⭐</div>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <div className="action-card" onClick={() => setShowNewDonation(true)}>
          <div className="action-card-icon">➕</div>
          <div className="action-card-title">Make New Donation</div>
        </div>
        <div className="action-card" onClick={() => setCurrentPage('history')}>
          <div className="action-card-icon">📜</div>
          <div className="action-card-title">View History</div>
        </div>
        <div className="action-card" onClick={() => setCurrentPage('history')}>
          <div className="action-card-icon">📍</div>
          <div className="action-card-title">Track Status</div>
        </div>
        <div className="action-card" onClick={() => setCurrentPage('impact')}>
          <div className="action-card-icon">💫</div>
          <div className="action-card-title">View Impact</div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Donations</h3>
          <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('history')}>View All</button>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Items</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {donations.slice(0, 5).map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.batchId}</td>
                    <td>{donation.items.length} items</td>
                    <td>{new Date(donation.createdDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${donation.status}`}>
                        {donation.status === 'pending' && '🟡 Pending'}
                        {donation.status === 'approved' && '✅ Approved'}
                        {donation.status === 'pickup' && '🚚 Pickup'}
                        {donation.status === 'inventory' && '📦 Inventory'}
                        {donation.status === 'distributed' && '✨ Distributed'}
                        {donation.status === 'completed' && '⭐ Completed'}
                      </span>
                    </td>
                    <td>
                      {donation.rating ? (
                        <span style={{color: 'var(--accent-orange)'}}>{'⭐'.repeat(donation.rating)}</span>
                      ) : (
                        <span style={{color: 'var(--color-text-secondary)'}}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Donation History Component
const DonationHistory = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [expandedDonation, setExpandedDonation] = useState(null);
  
  const donations = MOCK_DATA.donations.filter(d => d.donorId === user.id);
  
  const filteredDonations = donations.filter(donation => {
    if (filters.status !== 'all' && donation.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donation History</h1>
        <p className="dashboard-subtitle">Track all your donations and their impact</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Filters</h3>
        </div>
        <div className="card-body">
          <div className="filters">
            <div className="filter-group">
              <label className="form-label">Status</label>
              <select 
                className="form-control"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="pickup">Pickup Scheduled</option>
                <option value="inventory">In Inventory</option>
                <option value="distributed">Distributed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="form-label">Category</label>
              <select 
                className="form-control"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="all">All Categories</option>
                <option value="Books">Books</option>
                <option value="Clothes">Clothes</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Stationery">Stationery</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Donations</h3>
        </div>
        <div className="card-body">
          {filteredDonations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-title">No donations found</div>
              <div className="empty-state-message">Try adjusting your filters or make your first donation!</div>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Batch ID</th>
                    <th>Items</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map(donation => (
                    <React.Fragment key={donation.id}>
                      <tr>
                        <td>{donation.batchId}</td>
                        <td>{donation.items.length} items</td>
                        <td>{new Date(donation.createdDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${donation.status}`}>
                            {donation.status === 'pending' && '🟡 Pending'}
                            {donation.status === 'approved' && '✅ Approved'}
                            {donation.status === 'pickup' && '🚚 Pickup'}
                            {donation.status === 'inventory' && '📦 Inventory'}
                            {donation.status === 'distributed' && '✨ Distributed'}
                            {donation.status === 'completed' && '⭐ Completed'}
                          </span>
                        </td>
                        <td>
                          {donation.rating ? (
                            <span style={{color: 'var(--accent-orange)'}}>{'⭐'.repeat(donation.rating)}</span>
                          ) : (
                            <span style={{color: 'var(--color-text-secondary)'}}>—</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => setExpandedDonation(expandedDonation === donation.id ? null : donation.id)}
                          >
                            {expandedDonation === donation.id ? 'Hide' : 'View'} Items
                          </button>
                        </td>
                      </tr>
                      {expandedDonation === donation.id && (
                        <tr>
                          <td colSpan="6" style={{backgroundColor: 'var(--color-bg-1)', padding: 'var(--space-16)'}}>
                            <h4 style={{marginBottom: 'var(--space-12)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)'}}>Items in this batch:</h4>
                            <ul style={{listStyle: 'none', padding: 0}}>
                              {donation.items.map(item => (
                                <li key={item.id} style={{marginBottom: 'var(--space-8)', padding: 'var(--space-8)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-base)'}}>
                                  <strong>{item.name}</strong> - {item.category} ({item.condition}) - ₹{item.value}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Impact Dashboard Component
const ImpactDashboard = () => {
  const { user } = useAuth();
  const donations = MOCK_DATA.donations.filter(d => d.donorId === user.id);
  const totalItems = donations.reduce((sum, d) => sum + d.items.length, 0);
  const recipients = donations.filter(d => d.status === 'completed' || d.status === 'distributed').length * 2;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Impact</h1>
        <p className="dashboard-subtitle">See the difference you're making</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{totalItems}</div>
              <div className="stat-card-label">Items Donated</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-1)', color: 'var(--primary-blue)'}}>📦</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{recipients}</div>
              <div className="stat-card-label">Recipients Helped</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-3)', color: 'var(--secondary-green)'}}>👥</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{donations.length}</div>
              <div className="stat-card-label">Batches Processed</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-6)', color: 'var(--accent-orange)'}}>📋</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{user.points}</div>
              <div className="stat-card-label">Points Earned</div>
            </div>
            <div className="stat-card-icon" style={{backgroundColor: 'var(--color-bg-5)', color: '#8b5cf6'}}>⭐</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Your Level &amp; Badges</h3>
        </div>
        <div className="card-body">
          <div style={{textAlign: 'center', marginBottom: 'var(--space-24)'}}>
            <div style={{fontSize: '64px', marginBottom: 'var(--space-16)'}}>
              {user.level === 'Bronze' && '🥉'}
              {user.level === 'Silver' && '🥈'}
              {user.level === 'Gold' && '🥇'}
              {user.level === 'Platinum' && '💎'}
            </div>
            <h2 style={{fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-8)'}}>{user.level} Donor</h2>
            <p style={{color: 'var(--color-text-secondary)'}}>You have {user.points} impact points</p>
            <div style={{marginTop: 'var(--space-16)'}}>
              <div style={{height: '8px', backgroundColor: 'var(--color-card-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${(user.points % 1000) / 10}%`, backgroundColor: 'var(--color-primary)'}}></div>
              </div>
              <p style={{fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-8)'}}>Next level in {1000 - (user.points % 1000)} points</p>
            </div>
          </div>
          
          <div className="achievements-grid">
            {MOCK_DATA.achievements.map(achievement => (
              <div key={achievement.id} className="achievement-card" style={{opacity: achievement.unlocked ? 1 : 0.4}}>
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-desc">{achievement.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Leaderboard</h3>
        </div>
        <div className="card-body">
          {MOCK_DATA.leaderboard.map(donor => (
            <div key={donor.rank} className="leaderboard-item">
              <div className={`leaderboard-rank ${donor.rank <= 3 ? `top-${donor.rank}` : ''}`}>
                {donor.rank <= 3 ? (donor.rank === 1 ? '🥇' : donor.rank === 2 ? '🥈' : '🥉') : donor.rank}
              </div>
              <div className="leaderboard-info">
                <div className="leaderboard-name">{donor.name}</div>
                <div className="leaderboard-meta">{donor.institution}</div>
              </div>
              <div>
                <div className="leaderboard-stat">{donor.items}</div>
                <div className="leaderboard-meta">items</div>
              </div>
              <div>
                <div className="leaderboard-stat">{donor.points}</div>
                <div className="leaderboard-meta">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Impact Stories</h3>
        </div>
        <div className="card-body">
          <div className="impact-stories">
            {MOCK_DATA.impactStories.map(story => (
              <div key={story.id} className="impact-story">
                <div className="impact-story-header">
                  <div className="impact-story-avatar">👤</div>
                  <div className="impact-story-info">
                    <h4>{story.recipient}</h4>
                    <p>{story.institution}</p>
                  </div>
                </div>
                <div className="impact-story-message">"{story.message}"</div>
                <div className="impact-story-rating">
                  {'⭐'.repeat(story.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Component
const NotificationsCenter = () => {
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Notifications</h1>
        <p className="dashboard-subtitle">Stay updated on your donations</p>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">All Notifications</h3>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔔</div>
              <div className="empty-state-title">No notifications</div>
              <div className="empty-state-message">You're all caught up!</div>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                <div className="notification-icon" style={{
                  backgroundColor: notif.type === 'approved' ? 'var(--color-bg-3)' :
                    notif.type === 'pickup' ? 'var(--color-bg-1)' :
                    notif.type === 'distributed' ? 'var(--color-bg-5)' :
                    'var(--color-bg-2)'
                }}>
                  {notif.type === 'approved' && '✅'}
                  {notif.type === 'pickup' && '🚚'}
                  {notif.type === 'distributed' && '✨'}
                  {notif.type === 'feedback' && '⭐'}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-time">{new Date(notif.timestamp).toLocaleString()}</div>
                </div>
                <div className="notification-actions">
                  {!notif.read && (
                    <button className="btn btn-sm btn-outline" onClick={() => markAsRead(notif.id)}>
                      Mark Read
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline" onClick={() => deleteNotification(notif.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Component
const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    institution: user.institution,
    address: user.address
  });

  const handleSave = () => {
    // Update user data (in real app, this would call an API)
    Object.assign(user, formData);
    setEditing(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Profile</h1>
        <p className="dashboard-subtitle">Manage your account settings</p>
      </div>
      
      <div className="profile-grid">
        <div className="profile-sidebar">
          <div className="card profile-avatar-card">
            <div className="profile-avatar">👤</div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
            <span className={`badge badge-${user.level.toLowerCase()}`} style={{display: 'inline-block'}}>{user.level} Donor</span>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h4 style={{marginBottom: 'var(--space-16)', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)'}}>Quick Stats</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-12)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--color-text-secondary)'}}>Points:</span>
                  <span style={{fontWeight: 'var(--font-weight-semibold)'}}>{user.points}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--color-text-secondary)'}}>Level:</span>
                  <span style={{fontWeight: 'var(--font-weight-semibold)'}}>{user.level}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: 'var(--color-text-secondary)'}}>Verified:</span>
                  <span>{user.verificationStatus === 'verified' ? '✅' : '⏳'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-main">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Personal Information</h3>
              <button 
                className="btn btn-sm btn-outline"
                onClick={() => editing ? handleSave() : setEditing(true)}
              >
                {editing ? 'Save' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              <div style={{display: 'grid', gap: 'var(--space-16)'}}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <div style={{padding: 'var(--space-12)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-base)'}}>{formData.name}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <div style={{padding: 'var(--space-12)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-base)'}}>{formData.email}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <div style={{padding: 'var(--space-12)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-base)'}}>{formData.phone}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Institution</label>
                  {editing ? (
                    <input
                      type="text"
                      className="form-control"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    />
                  ) : (
                    <div style={{padding: 'var(--space-12)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-base)'}}>{formData.institution}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Address</label>
                  {editing ? (
                    <textarea
                      className="form-control"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  ) : (
                    <div style={{padding: 'var(--space-12)', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-base)'}}>{formData.address}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Preferences</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-12)'}}>
                <div className="form-checkbox">
                  <input type="checkbox" id="emailNotif" defaultChecked />
                  <label htmlFor="emailNotif">Receive email notifications</label>
                </div>
                <div className="form-checkbox">
                  <input type="checkbox" id="smsNotif" />
                  <label htmlFor="smsNotif">Receive SMS notifications</label>
                </div>
                <div className="form-checkbox">
                  <input type="checkbox" id="newsletter" defaultChecked />
                  <label htmlFor="newsletter">Subscribe to newsletter</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Security</h3>
            </div>
            <div className="card-body">
              <button className="btn btn-outline" style={{marginRight: 'var(--space-12)'}}>Change Password</button>
              <button className="btn btn-outline">Enable Two-Factor Auth</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// New Donation Modal Component
const NewDonationModal = ({ onClose }) => {
  const [items, setItems] = useState([{
    id: 1,
    name: '',
    category: '',
    condition: '',
    value: '',
    description: ''
  }]);

  const addItem = () => {
    setItems([...items, {
      id: items.length + 1,
      name: '',
      category: '',
      condition: '',
      value: '',
      description: ''
    }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    alert('Donation batch created successfully! Tracking ID: BTH' + String(Date.now()).slice(-3));
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Create New Donation Batch">
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: 'var(--space-24)'}}>
          <h4 style={{marginBottom: 'var(--space-16)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)'}}>Add Items</h4>
          
          {items.map((item, index) => (
            <div key={item.id} style={{
              padding: 'var(--space-16)',
              backgroundColor: 'var(--color-bg-1)',
              borderRadius: 'var(--radius-base)',
              marginBottom: 'var(--space-16)'
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)'}}>
                <strong>Item {index + 1}</strong>
                {items.length > 1 && (
                  <button type="button" className="btn btn-sm btn-outline" onClick={() => removeItem(item.id)}>Remove</button>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Item Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Engineering Textbook"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  required
                />
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)'}}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={item.category}
                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Books">Books</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select
                    className="form-control"
                    value={item.condition}
                    onChange={(e) => updateItem(item.id, 'condition', e.target.value)}
                    required
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Estimated Value (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter value"
                  value={item.value}
                  onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Add any additional details"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
          
          <button type="button" className="btn btn-outline btn-block" onClick={addItem}>
            ➕ Add Another Item
          </button>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit Donation Batch</button>
        </div>
      </form>
    </Modal>
  );
};

// Modal Component
const Modal = ({ children, onClose, title }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showNewDonation, setShowNewDonation] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container">
        {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} setShowNewDonation={setShowNewDonation} />}
        {currentPage === 'history' && <DonationHistory />}
        {currentPage === 'impact' && <ImpactDashboard />}
        {currentPage === 'notifications' && <NotificationsCenter />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>
      {showNewDonation && <NewDonationModal onClose={() => setShowNewDonation(false)} />}
    </div>
  );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </AuthProvider>
);