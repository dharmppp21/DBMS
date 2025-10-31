const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
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
      'SELECT donor_id, full_name, email, status FROM DONORS WHERE (email = ? OR donor_id = ?) AND status = "active"',
      [identifier, identifier]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email/ID or account inactive' });
    }

    const donor = rows[0];

    if (password !== 'password123') {
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

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
