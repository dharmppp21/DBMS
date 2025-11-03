# BDSM Testing Guide

## Prerequisites
- XAMPP/LAMPP MySQL server running
- Node.js installed
- All npm dependencies installed (`npm install`)
- Database setup completed

## Database Setup

1. **Ensure MySQL is running:**
   ```bash
   sudo /opt/lampp/lampp start
   ```

2. **Create/Reset the database:**
   ```bash
   mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock < database.sql
   ```

## Starting the Application

### 1. Start Backend Server
```bash
npm run start-backend
```
Backend will run on http://localhost:5000

### 2. Start Donor Portal
```bash
cd frontend/donor-portal
npx http-server -p 8080
```
Donor Portal accessible at http://localhost:8080

### 3. Start Recipient Portal
```bash
cd frontend/recipient-portal
npx http-server -p 8081
```
Recipient Portal accessible at http://localhost:8081

## Testing Workflow

### Phase 1: Donor Registration and Item Donation

1. **Register as Donor:**
   - Navigate to http://localhost:8080/login.html
   - Click "Sign Up"
   - Fill in donor details:
     - Full Name: John Doe
     - Email: john@example.com
     - Phone: 1234567890
     - Institution: ABC University
     - Year/Class: 2024
     - Address: 123 Main St
     - Password: test123
   - Click "Sign Up"

2. **Login as Donor:**
   - Use email: john@example.com
   - Password: test123
   - Click "Login"

3. **Donate Items:**
   - Click "Donate Items" button
   - Fill in item details:
     - Item Name: Calculus Textbook
     - Category: books
     - Size/Info: Hardcover, 500 pages
     - Condition: excellent
     - Description: Used for one semester
     - Estimated Value: 500
   - Click "Add Item"
   - Add more items as needed (clothes, electronics, toys, stationery)
   - Click "Submit Donation"

### Phase 2: Recipient Registration and Item Requests

1. **Register as Recipient:**
   - Navigate to http://localhost:8081/
   - Click "Sign Up"
   - Fill in recipient details:
     - Full Name: Jane Smith (child's name)
     - Age: 15
     - Gender: Female
     - Guardian Name: Mary Smith
     - Guardian Contact: 9876543210
     - Address: 456 Oak Ave
     - Needs Description: Need educational materials
     - Password: (not required - will be ignored)
   - Click "Sign Up"
   - **Note:** Account will be automatically verified

2. **Login as Recipient:**
   - Use Guardian Contact: 9876543210
   - Password: (not required - will be ignored)
   - Click "Login"

3. **View Dashboard:**
   - Should see stats:
     - Items Received: 0
     - Pending Requests: 0
     - Total Value: ₹0

4. **Browse Available Items:**
   - Click "Browse Items" tab
   - Should see items donated by donors
   - Use filters (category, condition) or search to find items
   - Click "Request" on any item
   - Provide a reason for the request
   - Click "Submit Request"

5. **View My Requests:**
   - Click "My Requests" tab
   - Should see pending requests
   - Can cancel pending requests

### Phase 3: Admin Approves and Distributes Items

1. **Approve Request (Manual Database Update):**
   ```bash
   mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e "UPDATE ITEM_REQUESTS SET request_status = 'approved' WHERE request_id = 1;"
   ```

2. **Create Distribution (Manual Database Insert):**
   ```bash
   mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system << 'EOF'
   INSERT INTO DISTRIBUTIONS (item_id, recipient_id, distributed_by, distribution_method, distribution_notes)
   SELECT item_id, recipient_id, 'Admin', 'center_collection', 'Approved and ready for pickup'
   FROM ITEM_REQUESTS
   WHERE request_id = 1;
   
   UPDATE ITEMS SET availability_status = 'distributed' WHERE item_id = (SELECT item_id FROM ITEM_REQUESTS WHERE request_id = 1);
   UPDATE ITEM_REQUESTS SET request_status = 'fulfilled' WHERE request_id = 1;
   EOF
   ```

### Phase 4: Recipient Views and Rates Items

1. **View Received Items:**
   - Click "Received Items" tab
   - Should see distributed items

2. **Rate Items:**
   - Click "Rate" on any received item
   - Select rating (1-5 stars)
   - Provide feedback
   - Click "Submit Rating"

3. **View Updated Dashboard:**
   - Click "Dashboard" tab
   - Stats should be updated:
     - Items Received: 1
     - Total Value: ₹500 (or item value)

### Phase 5: Profile Management

1. **Update Profile:**
   - Click "Profile" tab
   - Update details (name, guardian contact, address)
   - Click "Update Profile"

2. **Logout:**
   - Click "Logout" button

## API Endpoints Reference

### Recipient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recipient/register` | Register new recipient |
| POST | `/api/recipient/login` | Recipient login |
| GET | `/api/items/available` | Get all available items |
| POST | `/api/recipient/request` | Submit item request |
| GET | `/api/recipient/:id/requests` | Get recipient's requests |
| DELETE | `/api/recipient/request/:id` | Cancel pending request |
| GET | `/api/recipient/:id/distributions` | Get received items |
| POST | `/api/distribution/:id/rating` | Submit rating/feedback |
| GET | `/api/recipient/:id/dashboard` | Get dashboard stats |
| PUT | `/api/recipient/:id/profile` | Update profile |

### Donor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new donor |
| POST | `/api/login` | Donor login |

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Donor can register and login
- [ ] Donor can donate items
- [ ] Recipient can register
- [ ] Recipient account shows "pending" status before verification
- [ ] After manual verification, recipient can login
- [ ] Recipient can browse available items
- [ ] Recipient can request items (only when verified)
- [ ] Items become "reserved" after request
- [ ] Recipient can view their requests
- [ ] Recipient can cancel pending requests
- [ ] After distribution, recipient can view received items
- [ ] Recipient can rate received items
- [ ] Dashboard shows correct statistics
- [ ] Recipient can update profile
- [ ] Logout works correctly

## Common Issues

### Issue: Backend fails to start
**Solution:** Check if MySQL is running and .env file has correct credentials

### Issue: Cannot register recipient
**Solution:** Ensure age is between 1-17 and guardian contact is unique

### Issue: Cannot request items
**Solution:** Ensure recipient account is verified (verification_status = 'verified')

### Issue: Items not showing up
**Solution:** Ensure items have availability_status = 'available'

## Database Queries for Testing

### View all recipients:
```sql
mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e "SELECT * FROM RECIPIENTS;"
```

### View all items:
```sql
mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e "SELECT * FROM ITEMS;"
```

### View all requests:
```sql
mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e "SELECT ir.*, i.item_name, r.full_name FROM ITEM_REQUESTS ir JOIN ITEMS i ON ir.item_id = i.item_id JOIN RECIPIENTS r ON ir.recipient_id = r.recipient_id;"
```

### View all distributions:
```sql
mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e "SELECT d.*, i.item_name, r.full_name FROM DISTRIBUTIONS d JOIN ITEMS i ON d.item_id = i.item_id JOIN RECIPIENTS r ON d.recipient_id = r.recipient_id;"
```
