// React Context for Global State Management
const { useState, useContext, createContext, useEffect } = React;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userData = window.sessionUser;
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    window.sessionUser = userData;
  };

  const register = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      registrationDate: new Date().toISOString().split('T')[0],
      verificationStatus: "pending",
      level: "Bronze",
      points: 0
    };
    
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Notification Context
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
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
    }
  ]);

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
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.donor_id,
          name: data.donor_name,
          email: formData.email,
          phone: '+91 98765 43210',
          institution: 'IIT Delhi',
          address: 'New Delhi, India',
          registrationDate: '2024-01-15',
          verificationStatus: 'verified',
          level: 'Gold',
          points: 850
        };
        
        login(userData);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Error connecting to server. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
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
      
      {error && <div className="form-error">{error}</div>}
      
      <button type="submit" className="btn btn-primary btn-block">Login</button>
    </form>
  );
};

// Register Form Component
const RegisterForm = ({ register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    institution: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      register(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
          className="form-control"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
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
      
      <div className="form-group">
        <label className="form-label">Institution</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter your institution"
          value={formData.institution}
          onChange={(e) => setFormData({...formData, institution: e.target.value})}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Address</label>
        <textarea
          className="form-control"
          placeholder="Enter your address"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
      
      <button type="submit" className="btn btn-primary btn-block">Register</button>
    </form>
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
          className={`nav-link ${currentPage === 'notifications' ? 'active' : ''}`}
          onClick={() => setCurrentPage('notifications')}
        >
          Notifications {unreadCount > 0 && <span className="badge badge-pending">{unreadCount}</span>}
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
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.name}! 👋</h1>
        <div className="dashboard-subtitle">
          <span className={`badge badge-${user.level.toLowerCase()}`}>{user.level} Donor</span>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">0</div>
              <div className="stat-card-label">Total Items Donated</div>
            </div>
            <div className="stat-card-icon">📦</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">0</div>
              <div className="stat-card-label">Recipients Helped</div>
            </div>
            <div className="stat-card-icon">👥</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">0</div>
              <div className="stat-card-label">Total Batches</div>
            </div>
            <div className="stat-card-icon">📋</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <div className="stat-card-value">{user.points}</div>
              <div className="stat-card-label">Impact Points</div>
            </div>
            <div className="stat-card-icon">⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Donation History Component
const DonationHistory = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donation History</h1>
        <p className="dashboard-subtitle">Track all your donations and their impact</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">No donations yet</div>
            <div className="empty-state-message">Start making a difference by donating items!</div>
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
                <div className="notification-icon">
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
    Object.assign(user, formData);
    setEditing(false);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Profile</h1>
        <p className="dashboard-subtitle">Manage your account settings</p>
      </div>
      
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
              <div style={{padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>{formData.name}</div>
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
              <div style={{padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>{formData.email}</div>
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
              <div style={{padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>{formData.phone}</div>
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
              <div style={{padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>{formData.institution}</div>
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
              <div style={{padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px'}}>{formData.address}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'history' && <DonationHistory />}
        {currentPage === 'notifications' && <NotificationsCenter />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>
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
