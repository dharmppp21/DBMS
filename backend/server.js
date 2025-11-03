const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'donation_system',
  socketPath: '/opt/lampp/var/mysql/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/ID and password are required' });
    }

    const connection = await pool.getConnection();

    const [rows] = await connection.execute(
      'SELECT donor_id, full_name, email, password, status FROM DONORS WHERE (email = ? OR donor_id = ?) AND status = "active"',
      [identifier, identifier]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email/ID or account inactive' });
    }

    const donor = rows[0];

    if (!donor.password || donor.password === '') {
      return res.status(401).json({ message: 'Account password not set. Please contact support.' });
    }

    const isPasswordValid = await bcrypt.compare(password, donor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    return res.json({
      message: 'Login successful',
      donor_id: donor.donor_id,
      donor_name: donor.full_name,
      email: donor.email
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { full_name, email, phone, institution, year_class, address, password } = req.body;

    if (!full_name || !email || !phone || !institution || !year_class || !address || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();

    const [existingUsers] = await connection.execute(
      'SELECT donor_id FROM DONORS WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      'INSERT INTO DONORS (full_name, email, phone, institution, year_class, address, password, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [full_name, email, phone, institution, year_class, address, hashedPassword, 'active']
    );

    connection.release();

    return res.status(201).json({
      message: 'Registration successful',
      donor_id: result.insertId
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ============= RECIPIENT ENDPOINTS =============

// Recipient login - simple identifier-based (no password)
app.post('/api/recipient/login', async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Phone number or ID required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT recipient_id, full_name, age, gender, guardian_contact, address, verification_status FROM RECIPIENTS WHERE (guardian_contact = ? OR recipient_id = ?)',
      [identifier, identifier]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Recipient not found' });
    }

    const recipient = rows[0];
    return res.json({
      message: 'Login successful',
      recipient_id: recipient.recipient_id,
      name: recipient.full_name,
      phone: recipient.guardian_contact,
      email: recipient.guardian_contact,
      registrationDate: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('Recipient login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Recipient registration
app.post('/api/recipient/register', async (req, res) => {
  try {
    const { full_name, age, gender, guardian_name, guardian_contact, address, needs_description } = req.body;

    if (!full_name || !age || !gender || !guardian_name || !guardian_contact || !address) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const connection = await pool.getConnection();
    const [existingUsers] = await connection.execute(
      'SELECT recipient_id FROM RECIPIENTS WHERE guardian_contact = ?',
      [guardian_contact]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(409).json({ message: 'Contact already registered' });
    }

    const [result] = await connection.execute(
      'INSERT INTO RECIPIENTS (full_name, age, gender, guardian_name, guardian_contact, address, needs_description, verification_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [full_name, age, gender, guardian_name, guardian_contact, address, needs_description || null, 'verified']
    );
    connection.release();

    return res.status(201).json({
      message: 'Registration successful',
      recipient_id: result.insertId
    });
  } catch (error) {
    console.error('Recipient registration error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get available items
app.get('/api/items/available', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [items] = await connection.execute(
      'SELECT item_id, item_name, category, subcategory, size_info, condition_status, description, estimated_value FROM ITEMS WHERE availability_status = "available" ORDER BY donation_date DESC'
    );
    connection.release();
    return res.json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Submit item request
app.post('/api/recipient/request', async (req, res) => {
  try {
    const { recipient_id, item_id, request_reason, quantity } = req.body;

    if (!recipient_id || !item_id) {
      return res.status(400).json({ message: 'Recipient ID and Item ID required' });
    }

    const connection = await pool.getConnection();
    const [item] = await connection.execute(
      'SELECT availability_status FROM ITEMS WHERE item_id = ?',
      [item_id]
    );

    if (item.length === 0 || item[0].availability_status !== 'available') {
      connection.release();
      return res.status(400).json({ message: 'Item not available' });
    }

    const [result] = await connection.execute(
      'INSERT INTO ITEM_REQUESTS (recipient_id, item_id, request_reason, quantity_requested, request_status) VALUES (?, ?, ?, ?, ?)',
      [recipient_id, item_id, request_reason || null, quantity || 1, 'pending']
    );

    await connection.execute(
      'UPDATE ITEMS SET availability_status = "reserved" WHERE item_id = ?',
      [item_id]
    );
    connection.release();

    return res.status(201).json({
      message: 'Request submitted successfully',
      request_id: result.insertId
    });
  } catch (error) {
    console.error('Error submitting request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get recipient requests
app.get('/api/recipient/:recipientId/requests', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const connection = await pool.getConnection();
     const [requests] = await connection.execute(
       `SELECT ir.request_id, ir.request_date, ir.request_status, ir.request_reason, ir.quantity_requested,
        i.item_name, i.category, i.estimated_value 
        FROM ITEM_REQUESTS ir 
        JOIN ITEMS i ON ir.item_id = i.item_id 
        WHERE ir.recipient_id = ? 
        ORDER BY ir.request_date DESC`,
       [recipientId]
     );
    connection.release();
    return res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Cancel request
app.delete('/api/recipient/request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const connection = await pool.getConnection();
    const [request] = await connection.execute(
      'SELECT item_id, request_status FROM ITEM_REQUESTS WHERE request_id = ?',
      [requestId]
    );

    if (request.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request[0].request_status !== 'pending') {
      connection.release();
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    await connection.execute('DELETE FROM ITEM_REQUESTS WHERE request_id = ?', [requestId]);
    await connection.execute(
      'UPDATE ITEMS SET availability_status = "available" WHERE item_id = ?',
      [request[0].item_id]
    );
    connection.release();
    return res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get received items (distributions)
app.get('/api/recipient/:recipientId/distributions', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const connection = await pool.getConnection();
    const [distributions] = await connection.execute(
      `SELECT d.distribution_id, d.distribution_date, d.distribution_method, 
       d.satisfaction_rating as rating, d.quantity, d.recipient_feedback, d.distributed_by,
       i.item_name, i.category, i.estimated_value, i.condition_status,
       i.donor_id
       FROM DISTRIBUTIONS d 
       JOIN ITEMS i ON d.item_id = i.item_id 
       WHERE d.recipient_id = ? 
       ORDER BY d.distribution_date DESC`,
      [recipientId]
    );
    connection.release();
    return res.json({ distributions });
  } catch (error) {
    console.error('Error fetching distributions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Submit rating
app.post('/api/recipient/distribution/:distributionId/rate', async (req, res) => {
  try {
    const { distributionId } = req.params;
    const { satisfaction_rating, recipient_feedback, rating, feedback } = req.body;
    
    const ratingValue = rating || satisfaction_rating;
    const feedbackValue = feedback || recipient_feedback;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE DISTRIBUTIONS SET satisfaction_rating = ?, recipient_feedback = ? WHERE distribution_id = ?',
      [ratingValue, feedbackValue || null, distributionId]
    );
    connection.release();
    return res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats
app.get('/api/recipient/:recipientId/dashboard', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const connection = await pool.getConnection();

    const [itemsReceived] = await connection.execute(
      'SELECT COUNT(*) as count FROM DISTRIBUTIONS WHERE recipient_id = ?',
      [recipientId]
    );

    const [pendingRequests] = await connection.execute(
      'SELECT COUNT(*) as count FROM ITEM_REQUESTS WHERE recipient_id = ? AND request_status = "pending"',
      [recipientId]
    );

    const [totalValue] = await connection.execute(
      `SELECT SUM(i.estimated_value) as total 
       FROM DISTRIBUTIONS d 
       JOIN ITEMS i ON d.item_id = i.item_id 
       WHERE d.recipient_id = ?`,
      [recipientId]
    );

    connection.release();

    return res.json({
      stats: {
        itemsReceived: itemsReceived[0].count,
        pendingRequests: pendingRequests[0].count,
        totalValue: totalValue[0].total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get profile
app.get('/api/recipient/:recipientId/profile', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const connection = await pool.getConnection();
    const [profile] = await connection.execute(
      'SELECT recipient_id, full_name, age, gender, guardian_name, guardian_contact, address, needs_description, registration_date, verification_status FROM RECIPIENTS WHERE recipient_id = ?',
      [recipientId]
    );
    connection.release();
    
    if (profile.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    return res.json(profile[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
app.put('/api/recipient/:recipientId/profile', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { full_name, guardian_contact, address } = req.body;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE RECIPIENTS SET full_name = ?, guardian_contact = ?, address = ? WHERE recipient_id = ?',
      [full_name, guardian_contact, address, recipientId]
    );
    connection.release();
    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
