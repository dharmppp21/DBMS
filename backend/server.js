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

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
