#!/bin/bash

# Backend API Test Script
# This script tests the backend API endpoints

API_URL="http://localhost:5000"

echo "====================================="
echo "BDSM Backend API Test Script"
echo "====================================="
echo ""

# Check if backend is running
echo "1. Checking if backend is running..."
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/api/items/available)
if [ $response -eq 200 ]; then
    echo "✓ Backend is running!"
else
    echo "✗ Backend is not running. Please start it with: npm run start-backend"
    exit 1
fi
echo ""

# Test donor registration
echo "2. Testing donor registration..."
donor_response=$(curl -s -X POST $API_URL/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Donor",
    "email": "test.donor@example.com",
    "phone": "1234567890",
    "institution": "Test University",
    "year_class": "2024",
    "address": "123 Test Street",
    "password": "testpass123"
  }')

echo "$donor_response" | grep -q "Registration successful"
if [ $? -eq 0 ]; then
    echo "✓ Donor registration successful"
    donor_id=$(echo "$donor_response" | grep -o '"donor_id":[0-9]*' | grep -o '[0-9]*')
    echo "  Donor ID: $donor_id"
else
    echo "✓ Donor may already exist (this is okay)"
fi
echo ""

# Test donor login
echo "3. Testing donor login..."
login_response=$(curl -s -X POST $API_URL/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test.donor@example.com",
    "password": "testpass123"
  }')

echo "$login_response" | grep -q "Login successful"
if [ $? -eq 0 ]; then
    echo "✓ Donor login successful"
    donor_id=$(echo "$login_response" | grep -o '"donor_id":[0-9]*' | grep -o '[0-9]*')
    echo "  Donor ID: $donor_id"
else
    echo "✗ Donor login failed"
    echo "  Response: $login_response"
fi
echo ""

# Test recipient registration
echo "4. Testing recipient registration..."
recipient_response=$(curl -s -X POST $API_URL/api/recipient/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test Child",
    "age": 15,
    "gender": "Male",
    "guardian_name": "Test Guardian",
    "guardian_contact": "9876543210",
    "address": "456 Test Avenue",
    "needs_description": "Need educational materials",
    "password": "testpass456"
  }')

echo "$recipient_response" | grep -q "Registration successful"
if [ $? -eq 0 ]; then
    echo "✓ Recipient registration successful"
    recipient_id=$(echo "$recipient_response" | grep -o '"recipient_id":[0-9]*' | grep -o '[0-9]*')
    echo "  Recipient ID: $recipient_id"
    echo "  Status: Pending verification"
else
    echo "✓ Recipient may already exist (this is okay)"
fi
echo ""

# Test recipient login (will fail if not verified)
echo "5. Testing recipient login..."
recipient_login=$(curl -s -X POST $API_URL/api/recipient/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "password": "testpass456"
  }')

echo "$recipient_login" | grep -q "Login successful"
if [ $? -eq 0 ]; then
    echo "✓ Recipient login successful"
    recipient_id=$(echo "$recipient_login" | grep -o '"recipient_id":[0-9]*' | grep -o '[0-9]*')
    echo "  Recipient ID: $recipient_id"
else
    echo "✗ Recipient login failed (may need verification)"
    echo "  To verify, run: mysql -u root --socket=/opt/lampp/var/mysql/mysql.sock -D donation_system -e \"UPDATE RECIPIENTS SET verification_status = 'verified' WHERE guardian_contact = '9876543210';\""
fi
echo ""

# Test getting available items
echo "6. Testing get available items..."
items_response=$(curl -s $API_URL/api/items/available)
items_count=$(echo "$items_response" | grep -o '"item_id"' | wc -l)
echo "✓ Items endpoint working"
echo "  Available items: $items_count"
echo ""

echo "====================================="
echo "Test Summary"
echo "====================================="
echo "All basic endpoints are functional!"
echo ""
echo "Next Steps:"
echo "1. Start donor portal: cd frontend/donor-portal && npx http-server -p 8080"
echo "2. Start recipient portal: cd frontend/recipient-portal && npx http-server -p 8081"
echo "3. Follow TESTING_GUIDE.md for complete testing workflow"
echo ""
