// Recipient Portal - React Application
const { useState, useContext, createContext, useEffect } = React;

// ============= MOCK DATA =============
const MOCK_DATA = {
  preLoginStats: {
    totalItemsAvailable: 487,
    activeDonors: 1250,
    recipientsHelped: 3200,
    partnerInstitutions: 156
  },

  testimonials: [
    {
      id: 1,
      message: "The laptop I received helped me complete my online classes during lockdown. Forever grateful to the donors!",
      author: "Rahul Kumar",
      role: "Class 12 Student"
    },
    {
      id: 2,
      message: "The textbooks and study materials changed my academic journey. Now I'm preparing for engineering entrance!",
      author: "Priya Singh",
      role: "College Student"
    },
    {
      id: 3,
      message: "Winter clothes for my children came at the perfect time. Thank you to all generous donors!",
      author: "Sunita Devi",
      role: "Parent/Guardian"
    }
  ],

  recipients: [
    {
      id: 1,
      name: "Ananya Sharma",
      email: "recipient@example.com",
      phone: "+91 98765 00000",
      registrationDate: "2024-09-15",
      password: "password123"
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "+91 99876 54321",
      registrationDate: "2024-09-10"
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@example.com",
      phone: "+91 98765 12345",
      registrationDate: "2024-08-20"
    }
  ],

  availableItems: [
    { id: 1, name: "NCERT Physics Textbook", category: "Books", condition: "Good", value: 450, donorInstitution: "IIT Delhi", status: "available" },
    { id: 2, name: "Scientific Calculator", category: "Electronics", condition: "Excellent", value: 800, donorInstitution: "DU", status: "available" },
    { id: 3, name: "Winter Jacket", category: "Clothes", condition: "Good", value: 1200, donorInstitution: "IIT Bombay", status: "available" },
    { id: 4, name: "Geometry Box Set", category: "Stationery", condition: "New", value: 200, donorInstitution: "JNU", status: "available" },
    { id: 5, name: "School Bag", category: "Accessories", condition: "Excellent", value: 600, donorInstitution: "BITS Pilani", status: "available" },
    { id: 6, name: "Chemistry Reference Book", category: "Books", condition: "Good", value: 500, donorInstitution: "IIT Delhi", status: "available" },
    { id: 7, name: "Laptop Bag", category: "Accessories", condition: "Fair", value: 400, donorInstitution: "DU", status: "available" },
    { id: 8, name: "Notebook Set (10 pcs)", category: "Stationery", condition: "New", value: 300, donorInstitution: "IIT Bombay", status: "available" },
    { id: 9, name: "English Dictionary", category: "Books", condition: "Excellent", value: 350, donorInstitution: "JNU", status: "available" },
    { id: 10, name: "Sports Shoes", category: "Clothes", condition: "Good", value: 800, donorInstitution: "BITS Pilani", status: "available" },
    { id: 11, name: "Compass and Ruler Set", category: "Stationery", condition: "New", value: 150, donorInstitution: "IIT Delhi", status: "available" },
    { id: 12, name: "Mathematics Reference", category: "Books", condition: "Excellent", value: 550, donorInstitution: "IIT Bombay", status: "available" },
    { id: 13, name: "Digital Watch", category: "Electronics", condition: "Good", value: 600, donorInstitution: "DU", status: "available" },
    { id: 14, name: "School Uniform (Size M)", category: "Clothes", condition: "New", value: 900, donorInstitution: "JNU", status: "available" },
    { id: 15, name: "Colored Pencil Set", category: "Stationery", condition: "New", value: 250, donorInstitution: "BITS Pilani", status: "available" }
  ],

  requests: [
    { id: 1, requestId: "REQ001", itemId: 2, itemName: "Scientific Calculator", category: "Electronics", quantity: 1, requestedDate: "2024-10-25", status: "approved" },
    { id: 2, requestId: "REQ002", itemId: 6, itemName: "Chemistry Reference Book", category: "Books", quantity: 2, requestedDate: "2024-10-28", status: "pending" },
    { id: 3, requestId: "REQ003", itemId: 8, itemName: "Notebook Set (10 pcs)", category: "Stationery", quantity: 3, requestedDate: "2024-10-20", status: "fulfilled" }
  ],

  distributions: [
    { id: 1, distributionId: "DIST001", itemName: "Mathematics Textbook", category: "Books", receivedDate: "2024-10-15", condition: "Good", value: 550, donor: "IIT Delhi Alumni", rating: 5, feedback: "Excellent book in great condition. Helped me a lot!" },
    { id: 2, distributionId: "DIST002", itemName: "School Uniform", category: "Clothes", receivedDate: "2024-10-18", condition: "Excellent", value: 900, donor: "Anonymous", rating: null, feedback: null },
    { id: 3, distributionId: "DIST003", itemName: "Pen Set", category: "Stationery", receivedDate: "2024-10-22", condition: "New", value: 150, donor: "DU Student Council", rating: 4, feedback: "Nice quality pens. Thank you!" }
  ]
};

// ============= AUTH CONTEXT =============
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

  const login = (email, password) => {
    const foundUser = MOCK_DATA.recipients.find(u =>
      (u.email === email || u.phone === email) && u.password === password
    );
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      setIsAuthenticated(true);
      window.sessionUser = userData;
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const newUser = {
      id: MOCK_DATA.recipients.length + 1,
      ...userData,
      registrationDate: new Date().toISOString().split('T')[0]
    };
    MOCK_DATA.recipients.push(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    window.sessionUser = newUser;
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    window.sessionUser = null;
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { user, isAuthenticated, login, register, logout } },
    children
  );
};

// ============= MAIN APP COMPONENT =============
function RecipientPortal() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('light');
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!isAuthenticated) {
    if (currentPage === 'login') {
      return React.createElement(LoginPage, { setCurrentPage, toggleTheme, theme });
    }
    if (currentPage === 'register') {
      return React.createElement(RegisterPage, { setCurrentPage, toggleTheme, theme });
    }
    return React.createElement(LandingPage, { setCurrentPage, toggleTheme, theme });
  }

  return React.createElement(
    'div',
    { style: { display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-background)' } },
    React.createElement(Sidebar, { currentPage, setCurrentPage, logout }),
    React.createElement(
      'main',
      { style: { flex: 1 } },
      React.createElement(Header, { toggleTheme, theme }),
      React.createElement(
        'div',
        { style: { padding: '24px' } },
        currentPage === 'dashboard' && React.createElement(Dashboard),
        currentPage === 'browse' && React.createElement(BrowseItems),
        currentPage === 'requests' && React.createElement(MyRequests),
        currentPage === 'received' && React.createElement(ReceivedItems),
        currentPage === 'profile' && React.createElement(ProfileSettings)
      )
    )
  );
}

// ============= LANDING PAGE =============
function LandingPage({ setCurrentPage, toggleTheme, theme }) {
  return React.createElement(
    'div',
    { className: 'landing-page', style: { minHeight: '100vh', backgroundColor: 'var(--color-background)' } },
    React.createElement(
      'header',
      { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' } },
      React.createElement('h1', { style: { margin: 0, color: 'var(--color-primary)' } }, 'Recipient Portal'),
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '12px' } },
        React.createElement('button', { className: 'btn btn--secondary', onClick: toggleTheme }, theme === 'light' ? '🌙 Dark' : '☀️ Light'),
        React.createElement('button', { className: 'btn btn--primary', onClick: () => setCurrentPage('login') }, 'Login')
      )
    ),
    React.createElement(
      'div',
      { style: { padding: '60px 24px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' } },
      React.createElement('h2', { style: { fontSize: '48px', marginBottom: '16px' } }, 'Access Resources That Change Lives'),
      React.createElement('p', { style: { fontSize: '18px', color: 'var(--color-text-secondary)', marginBottom: '40px' } }, 'Request items donated by generous donors and improve your life'),
      React.createElement(
        'div',
        { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', margin: '40px 0' } },
        React.createElement(
          'div',
          { className: 'card', style: { textAlign: 'center', padding: '24px' } },
          React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0' } }, MOCK_DATA.preLoginStats.totalItemsAvailable),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)' } }, 'Items Available')
        ),
        React.createElement(
          'div',
          { className: 'card', style: { textAlign: 'center', padding: '24px' } },
          React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0' } }, MOCK_DATA.preLoginStats.activeDonors),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)' } }, 'Active Donors')
        ),
        React.createElement(
          'div',
          { className: 'card', style: { textAlign: 'center', padding: '24px' } },
          React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0' } }, MOCK_DATA.preLoginStats.recipientsHelped),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)' } }, 'Recipients Helped')
        ),
        React.createElement(
          'div',
          { className: 'card', style: { textAlign: 'center', padding: '24px' } },
          React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0' } }, MOCK_DATA.preLoginStats.partnerInstitutions),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)' } }, 'Partner Institutions')
        )
      ),
      React.createElement(
        'div',
        { style: { margin: '40px 0' } },
        React.createElement('h3', { style: { fontSize: '28px', marginBottom: '24px' } }, 'Success Stories'),
        React.createElement(
          'div',
          { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' } },
          MOCK_DATA.testimonials.map(testimonial =>
            React.createElement(
              'div',
              { key: testimonial.id, className: 'card', style: { padding: '24px', textAlign: 'left' } },
              React.createElement('p', { style: { fontStyle: 'italic', marginBottom: '16px' } }, `"${testimonial.message}"`),
              React.createElement('p', { style: { fontWeight: 'bold', margin: '0 0 4px 0' } }, testimonial.author),
              React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: 0 } }, testimonial.role)
            )
          )
        )
      ),
      React.createElement(
        'div',
        { style: { margin: '40px 0' } },
        React.createElement('button', { className: 'btn btn--primary btn--lg', onClick: () => setCurrentPage('register'), style: { marginRight: '12px' } }, 'Request Resources'),
        React.createElement('button', { className: 'btn btn--secondary btn--lg', onClick: () => setCurrentPage('login') }, 'Login')
      )
    )
  );
}

// ============= LOGIN PAGE =============
function LoginPage({ setCurrentPage, toggleTheme, theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (login(email, password)) {
      setCurrentPage('dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', padding: '24px' } },
    React.createElement(
      'div',
      { style: { maxWidth: '400px', width: '100%' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } },
        React.createElement('h1', { style: { margin: 0, fontSize: '28px', color: 'var(--color-primary)' } }, 'Login'),
        React.createElement('button', { className: 'btn btn--secondary', onClick: toggleTheme }, theme === 'light' ? '🌙' : '☀️')
      ),
      React.createElement(
        'div',
        { className: 'card', style: { padding: '32px' } },
        React.createElement(
          'form',
          { onSubmit: handleLogin },
          error && React.createElement('div', { style: { color: 'var(--color-error)', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(192, 21, 47, 0.1)', borderRadius: '6px' } }, error),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Email or Phone'),
            React.createElement('input', { type: 'text', className: 'form-control', value: email, onChange: (e) => setEmail(e.target.value), placeholder: 'Enter your email or phone' })
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '24px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Password'),
            React.createElement('input', { type: 'password', className: 'form-control', value: password, onChange: (e) => setPassword(e.target.value), placeholder: 'Enter your password' })
          ),
          React.createElement('button', { type: 'submit', className: 'btn btn--primary btn--full-width', style: { marginBottom: '16px' } }, 'Login'),
          React.createElement(
            'p',
            { style: { textAlign: 'center', color: 'var(--color-text-secondary)' } },
            'Don\'t have an account? ',
            React.createElement('button', { type: 'button', className: 'btn btn--outline', style: { padding: 0, border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }, onClick: () => setCurrentPage('register') }, 'Register here')
          ),
          React.createElement(
            'p',
            { style: { textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '16px' } },
            'Demo: recipient@example.com / password123'
          )
        )
      )
    )
  );
}

// ============= REGISTER PAGE =============
function RegisterPage({ setCurrentPage, toggleTheme, theme }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const { register } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone || !/^\+?91?[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Valid phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      register({ ...formData, password: 'password123' });
      setCurrentPage('dashboard');
    }
  };

  return React.createElement(
    'div',
    { style: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)', padding: '24px' } },
    React.createElement(
      'div',
      { style: { maxWidth: '400px', width: '100%' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } },
        React.createElement('h1', { style: { margin: 0, fontSize: '28px', color: 'var(--color-primary)' } }, 'Register'),
        React.createElement('button', { className: 'btn btn--secondary', onClick: toggleTheme }, theme === 'light' ? '🌙' : '☀️')
      ),
      React.createElement(
        'div',
        { className: 'card', style: { padding: '32px' } },
        React.createElement(
          'form',
          { onSubmit: handleRegister },
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Full Name'),
            React.createElement('input', { type: 'text', name: 'name', className: 'form-control', value: formData.name, onChange: handleChange, placeholder: 'Enter your full name' }),
            errors.name && React.createElement('p', { style: { color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' } }, errors.name)
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Email'),
            React.createElement('input', { type: 'email', name: 'email', className: 'form-control', value: formData.email, onChange: handleChange, placeholder: 'Enter your email' }),
            errors.email && React.createElement('p', { style: { color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' } }, errors.email)
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '24px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Phone'),
            React.createElement('input', { type: 'tel', name: 'phone', className: 'form-control', value: formData.phone, onChange: handleChange, placeholder: '+91 XXXXX XXXXX' }),
            errors.phone && React.createElement('p', { style: { color: 'var(--color-error)', fontSize: '12px', marginTop: '4px' } }, errors.phone)
          ),
          React.createElement('button', { type: 'submit', className: 'btn btn--primary btn--full-width', style: { marginBottom: '16px' } }, 'Register'),
          React.createElement(
            'p',
            { style: { textAlign: 'center', color: 'var(--color-text-secondary)' } },
            'Already have an account? ',
            React.createElement('button', { type: 'button', className: 'btn btn--outline', style: { padding: 0, border: 'none', color: 'var(--color-primary)', cursor: 'pointer', textDecoration: 'underline' }, onClick: () => setCurrentPage('login') }, 'Login here')
          )
        )
      )
    )
  );
}

// ============= DASHBOARD =============
function Dashboard() {
  const { user } = useContext(AuthContext);
  const itemsReceived = MOCK_DATA.distributions.length;
  const pendingRequests = MOCK_DATA.requests.filter(r => r.status === 'pending').length;
  const activeDistributions = MOCK_DATA.distributions.filter(d => !d.rating).length;

  return React.createElement(
    'div',
    { style: { maxWidth: '1200px', margin: '0 auto' } },
    React.createElement('h1', { style: { marginBottom: '24px' } }, `Welcome back, ${user.name}!`),
    React.createElement(
      'div',
      { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' } },
      React.createElement(
        'div',
        { className: 'card', style: { padding: '24px', textAlign: 'center' } },
        React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0', color: 'var(--color-primary)' } }, itemsReceived),
        React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: 0 } }, 'Items Received')
      ),
      React.createElement(
        'div',
        { className: 'card', style: { padding: '24px', textAlign: 'center' } },
        React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0', color: 'var(--color-primary)' } }, pendingRequests),
        React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: 0 } }, 'Pending Requests')
      ),
      React.createElement(
        'div',
        { className: 'card', style: { padding: '24px', textAlign: 'center' } },
        React.createElement('h3', { style: { fontSize: '32px', margin: '0 0 8px 0', color: 'var(--color-primary)' } }, activeDistributions),
        React.createElement('p', { style: { color: 'var(--color-text-secondary)', margin: 0 } }, 'Active Distributions')
      )
    )
  );
}

// ============= BROWSE ITEMS =============
function BrowseItems() {
  const [filters, setFilters] = useState({ category: '', condition: '', search: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const filteredItems = MOCK_DATA.availableItems.filter(item =>
    (!filters.category || item.category === filters.category) &&
    (!filters.condition || item.condition === filters.condition) &&
    (!filters.search || item.name.toLowerCase().includes(filters.search.toLowerCase()))
  );

  const handleRequestItem = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowModal(true);
  };

  const handleSubmitRequest = () => {
    const newRequest = {
      id: MOCK_DATA.requests.length + 1,
      requestId: `REQ${String(MOCK_DATA.requests.length + 1).padStart(3, '0')}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      category: selectedItem.category,
      quantity: quantity,
      requestedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    MOCK_DATA.requests.push(newRequest);
    setShowModal(false);
    alert('Request submitted successfully!');
  };

  return React.createElement(
    'div',
    { style: { maxWidth: '1200px', margin: '0 auto' } },
    React.createElement('h1', { style: { marginBottom: '24px' } }, 'Browse Available Items'),
    React.createElement(
      'div',
      { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' } },
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Category'),
        React.createElement(
          'select',
          { className: 'form-control', value: filters.category, onChange: (e) => setFilters({ ...filters, category: e.target.value }) },
          React.createElement('option', { value: '' }, 'All Categories'),
          React.createElement('option', { value: 'Books' }, 'Books'),
          React.createElement('option', { value: 'Electronics' }, 'Electronics'),
          React.createElement('option', { value: 'Clothes' }, 'Clothes'),
          React.createElement('option', { value: 'Stationery' }, 'Stationery'),
          React.createElement('option', { value: 'Accessories' }, 'Accessories')
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Condition'),
        React.createElement(
          'select',
          { className: 'form-control', value: filters.condition, onChange: (e) => setFilters({ ...filters, condition: e.target.value }) },
          React.createElement('option', { value: '' }, 'All Conditions'),
          React.createElement('option', { value: 'New' }, 'New'),
          React.createElement('option', { value: 'Excellent' }, 'Excellent'),
          React.createElement('option', { value: 'Good' }, 'Good'),
          React.createElement('option', { value: 'Fair' }, 'Fair')
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Search'),
        React.createElement('input', { type: 'text', className: 'form-control', placeholder: 'Search items...', value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }) })
      )
    ),
    React.createElement(
      'div',
      { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' } },
      filteredItems.map(item =>
        React.createElement(
          'div',
          { key: item.id, className: 'card', style: { padding: '20px' } },
          React.createElement('h3', { style: { margin: '0 0 8px 0', fontSize: '18px' } }, item.name),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', fontSize: '14px' } }, `Category: ${item.category}`),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', fontSize: '14px' } }, `Condition: ${item.condition}`),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', fontSize: '14px' } }, `Value: ₹${item.value}`),
          React.createElement('p', { style: { color: 'var(--color-text-secondary)', fontSize: '12px' } }, `From: ${item.donorInstitution}`),
          React.createElement('button', { className: 'btn btn--primary btn--full-width', style: { marginTop: '12px' }, onClick: () => handleRequestItem(item) }, 'Request Item')
        )
      )
    ),
    showModal && React.createElement(
      'div',
      { className: 'modal-overlay', onClick: () => setShowModal(false) },
      React.createElement(
        'div',
        { className: 'modal', onClick: (e) => e.stopPropagation() },
        React.createElement(
          'div',
          { className: 'modal-header' },
          React.createElement('h2', { className: 'modal-title' }, 'Request Item'),
          React.createElement('button', { className: 'modal-close', onClick: () => setShowModal(false) }, '×')
        ),
        React.createElement(
          'div',
          { className: 'modal-body' },
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Item Name'),
            React.createElement('input', { type: 'text', className: 'form-control', value: selectedItem.name, disabled: true })
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Category'),
            React.createElement('input', { type: 'text', className: 'form-control', value: selectedItem.category, disabled: true })
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Quantity Required'),
            React.createElement('input', { type: 'number', className: 'form-control', value: quantity, onChange: (e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1))), min: 1, max: 10 })
          )
        ),
        React.createElement(
          'div',
          { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn--secondary', onClick: () => setShowModal(false) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn--primary', onClick: handleSubmitRequest }, 'Submit Request')
        )
      )
    )
  );
}

// ============= MY REQUESTS =============
function MyRequests() {
  const handleCancelRequest = (requestId) => {
    const index = MOCK_DATA.requests.findIndex(r => r.requestId === requestId);
    if (index > -1 && MOCK_DATA.requests[index].status === 'pending') {
      MOCK_DATA.requests.splice(index, 1);
      alert('Request cancelled');
      window.location.reload();
    }
  };

  return React.createElement(
    'div',
    { style: { maxWidth: '1200px', margin: '0 auto' } },
    React.createElement('h1', { style: { marginBottom: '24px' } }, 'My Requests'),
    React.createElement(
      'div',
      { style: { overflowX: 'auto' } },
      React.createElement(
        'table',
        { style: { width: '100%', borderCollapse: 'collapse' } },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { style: { borderBottom: '1px solid var(--color-card-border)' } },
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Request ID'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Item Name'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Quantity'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Requested Date'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Status'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Actions')
          )
        ),
        React.createElement(
          'tbody',
          null,
          MOCK_DATA.requests.map(request =>
            React.createElement(
              'tr',
              { key: request.id, style: { borderBottom: '1px solid var(--color-card-border)' } },
              React.createElement('td', { style: { padding: '12px' } }, request.requestId),
              React.createElement('td', { style: { padding: '12px' } }, request.itemName),
              React.createElement('td', { style: { padding: '12px' } }, request.quantity),
              React.createElement('td', { style: { padding: '12px' } }, request.requestedDate),
              React.createElement('td', { style: { padding: '12px' } },
                React.createElement(
                  'span',
                  { style: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                      backgroundColor: request.status === 'pending' ? 'rgba(251, 191, 36, 0.1)' :
                        request.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' :
                        request.status === 'fulfilled' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(192, 21, 47, 0.1)',
                      color: request.status === 'pending' ? '#d97706' :
                        request.status === 'approved' ? '#059669' :
                        request.status === 'fulfilled' ? '#2563eb' : '#dc2626'
                    } },
                  request.status.charAt(0).toUpperCase() + request.status.slice(1)
                )
              ),
              React.createElement(
                'td',
                { style: { padding: '12px' } },
                request.status === 'pending' && React.createElement('button', { className: 'btn btn--sm btn--secondary', onClick: () => handleCancelRequest(request.requestId) }, 'Cancel')
              )
            )
          )
        )
      )
    )
  );
}

// ============= RECEIVED ITEMS =============
function ReceivedItems() {
  const [ratingItem, setRatingItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmitRating = () => {
    if (ratingItem) {
      ratingItem.rating = rating;
      ratingItem.feedback = feedback;
      setShowModal(false);
      alert('Rating submitted!');
      window.location.reload();
    }
  };

  return React.createElement(
    'div',
    { style: { maxWidth: '1200px', margin: '0 auto' } },
    React.createElement('h1', { style: { marginBottom: '24px' } }, 'Received Items'),
    React.createElement(
      'div',
      { style: { overflowX: 'auto' } },
      React.createElement(
        'table',
        { style: { width: '100%', borderCollapse: 'collapse' } },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { style: { borderBottom: '1px solid var(--color-card-border)' } },
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Distribution ID'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Item Name'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Received Date'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Condition'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Donor'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Rating'),
            React.createElement('th', { style: { padding: '12px', textAlign: 'left', fontWeight: '600' } }, 'Action')
          )
        ),
        React.createElement(
          'tbody',
          null,
          MOCK_DATA.distributions.map(item =>
            React.createElement(
              'tr',
              { key: item.id, style: { borderBottom: '1px solid var(--color-card-border)' } },
              React.createElement('td', { style: { padding: '12px' } }, item.distributionId),
              React.createElement('td', { style: { padding: '12px' } }, item.itemName),
              React.createElement('td', { style: { padding: '12px' } }, item.receivedDate),
              React.createElement('td', { style: { padding: '12px' } }, item.condition),
              React.createElement('td', { style: { padding: '12px' } }, item.donor),
              React.createElement('td', { style: { padding: '12px' } },
                item.rating ? React.createElement('span', null, '⭐ '.repeat(item.rating)) : React.createElement('span', { style: { color: 'var(--color-text-secondary)' } }, 'Not rated')
              ),
              React.createElement('td', { style: { padding: '12px' } },
                !item.rating && React.createElement('button', { className: 'btn btn--sm btn--primary', onClick: () => { setRatingItem(item); setShowModal(true); } }, 'Rate')
              )
            )
          )
        )
      )
    ),
    showModal && React.createElement(
      'div',
      { className: 'modal-overlay', onClick: () => setShowModal(false) },
      React.createElement(
        'div',
        { className: 'modal', onClick: (e) => e.stopPropagation() },
        React.createElement(
          'div',
          { className: 'modal-header' },
          React.createElement('h2', { className: 'modal-title' }, 'Rate Item'),
          React.createElement('button', { className: 'modal-close', onClick: () => setShowModal(false) }, '×')
        ),
        React.createElement(
          'div',
          { className: 'modal-body' },
          React.createElement('p', { style: { marginBottom: '16px' } }, `Item: ${ratingItem?.itemName}`),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Rating'),
            React.createElement(
              'div',
              { style: { display: 'flex', gap: '8px' } },
              [1, 2, 3, 4, 5].map(star =>
                React.createElement('button', {
                  key: star,
                  style: {
                    fontSize: '32px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    opacity: star <= rating ? 1 : 0.3,
                    transition: 'opacity 0.2s'
                  },
                  onClick: () => setRating(star)
                }, '⭐')
              )
            )
          ),
          React.createElement(
            'div',
            { style: { marginBottom: '16px' } },
            React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Feedback'),
            React.createElement('textarea', { className: 'form-control', value: feedback, onChange: (e) => setFeedback(e.target.value), placeholder: 'Share your experience...', style: { minHeight: '100px' } })
          )
        ),
        React.createElement(
          'div',
          { className: 'modal-footer' },
          React.createElement('button', { className: 'btn btn--secondary', onClick: () => setShowModal(false) }, 'Cancel'),
          React.createElement('button', { className: 'btn btn--primary', onClick: handleSubmitRating }, 'Submit Rating')
        )
      )
    )
  );
}

// ============= PROFILE SETTINGS =============
function ProfileSettings() {
  const { user, logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone });

  const handleSave = () => {
    Object.assign(user, formData);
    window.sessionUser = user;
    setEditMode(false);
    alert('Profile updated!');
  };

  return React.createElement(
    'div',
    { style: { maxWidth: '600px', margin: '0 auto' } },
    React.createElement('h1', { style: { marginBottom: '24px' } }, 'Profile Settings'),
    React.createElement(
      'div',
      { className: 'card', style: { padding: '24px', marginBottom: '24px' } },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-card-border)' } },
        React.createElement('h2', { style: { margin: 0 } }, 'Personal Information'),
        React.createElement('button', { className: 'btn btn--secondary', onClick: () => setEditMode(!editMode) }, editMode ? 'Cancel' : 'Edit')
      ),
      editMode ? React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'div',
          { style: { marginBottom: '16px' } },
          React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Name'),
          React.createElement('input', { type: 'text', className: 'form-control', value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })
        ),
        React.createElement(
          'div',
          { style: { marginBottom: '16px' } },
          React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Email'),
          React.createElement('input', { type: 'email', className: 'form-control', value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) })
        ),
        React.createElement(
          'div',
          { style: { marginBottom: '16px' } },
          React.createElement('label', { style: { display: 'block', marginBottom: '8px', fontWeight: '500' } }, 'Phone'),
          React.createElement('input', { type: 'tel', className: 'form-control', value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })
        ),
        React.createElement('button', { className: 'btn btn--primary btn--full-width', onClick: handleSave }, 'Save Changes')
      ) : React.createElement(
        React.Fragment,
        null,
        React.createElement('p', { style: { marginBottom: '12px' } }, React.createElement('strong', null, 'Name: '), user.name),
        React.createElement('p', { style: { marginBottom: '12px' } }, React.createElement('strong', null, 'Email: '), user.email),
        React.createElement('p', { style: { marginBottom: '12px' } }, React.createElement('strong', null, 'Phone: '), user.phone),
        React.createElement('p', null, React.createElement('strong', null, 'Member Since: '), user.registrationDate)
      )
    ),
    React.createElement(
      'div',
      { style: { textAlign: 'center' } },
      React.createElement('button', { className: 'btn btn--secondary btn--lg', onClick: logout }, 'Logout')
    )
  );
}

// ============= SIDEBAR COMPONENT =============
function Sidebar({ currentPage, setCurrentPage, logout }) {
  return React.createElement(
    'aside',
    { style: { width: '280px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-card-border)', padding: '24px', overflowY: 'auto', maxHeight: '100vh' } },
    React.createElement('h2', { style: { margin: '0 0 24px 0', fontSize: '20px', color: 'var(--color-primary)' } }, 'Menu'),
    React.createElement(
      'nav',
      { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
      ['dashboard', 'browse', 'requests', 'received', 'profile'].map(page =>
        React.createElement(
          'button',
          {
            key: page,
            className: 'btn btn--secondary',
            style: {
              justifyContent: 'flex-start',
              width: '100%',
              backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
              color: currentPage === page ? 'white' : 'var(--color-text)'
            },
            onClick: () => setCurrentPage(page)
          },
          page === 'dashboard' && '📊 Dashboard',
          page === 'browse' && '🛍️ Browse Items',
          page === 'requests' && '📝 My Requests',
          page === 'received' && '📦 Received Items',
          page === 'profile' && '⚙️ Profile'
        )
      )
    )
  );
}

// ============= HEADER COMPONENT =============
function Header({ toggleTheme, theme }) {
  return React.createElement(
    'header',
    { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--color-card-border)', backgroundColor: 'var(--color-surface)' } },
    React.createElement('h1', { style: { margin: 0, fontSize: '24px', color: 'var(--color-primary)' } }, 'Recipient Portal'),
    React.createElement('button', { className: 'btn btn--secondary', onClick: toggleTheme }, theme === 'light' ? '🌙 Dark' : '☀️ Light')
  );
}

// ============= APP INITIALIZATION =============
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AuthProvider, null, React.createElement(RecipientPortal)));
