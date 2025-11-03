-- Student Resource Donation Management System Database

CREATE DATABASE IF NOT EXISTS donation_system;
USE donation_system;

-- 1. DONORS Table
CREATE TABLE DONORS (
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    year_class VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Add indexes
CREATE INDEX idx_email ON DONORS(email);
CREATE INDEX idx_phone ON DONORS(phone);

-- 2. RECIPIENTS Table
CREATE TABLE RECIPIENTS (
    recipient_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL CHECK (age > 0 AND age < 18),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    guardian_name VARCHAR(100) NOT NULL,
    guardian_contact VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    needs_description TEXT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending'
);

-- Add indexes
CREATE INDEX idx_guardian_contact ON RECIPIENTS(guardian_contact);
CREATE INDEX idx_verification_status ON RECIPIENTS(verification_status);

-- 3. ITEMS Table
CREATE TABLE ITEMS (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(200) NOT NULL,
    category ENUM('clothes', 'books', 'electronics', 'toys', 'stationery', 'others') NOT NULL,
    subcategory VARCHAR(100),
    size_info VARCHAR(50),
    condition_status ENUM('excellent', 'good', 'fair', 'poor') NOT NULL,
    description TEXT,
    estimated_value DECIMAL(10,2) CHECK (estimated_value >= 0),
    donor_id INT NOT NULL,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    availability_status ENUM('available', 'reserved', 'distributed', 'damaged') DEFAULT 'available',
    FOREIGN KEY (donor_id) REFERENCES DONORS(donor_id)
);

-- Add indexes
CREATE INDEX idx_category ON ITEMS(category);
CREATE INDEX idx_availability_status ON ITEMS(availability_status);
CREATE INDEX idx_donor_id ON ITEMS(donor_id);

-- 4. DONATION_BATCHES Table
CREATE TABLE DONATION_BATCHES (
    batch_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_items INT NOT NULL CHECK (total_items > 0),
    pickup_required BOOLEAN DEFAULT FALSE,
    pickup_address TEXT,
    pickup_date DATETIME,
    batch_notes TEXT,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by VARCHAR(100),
    FOREIGN KEY (donor_id) REFERENCES DONORS(donor_id)
);

-- Add indexes
CREATE INDEX idx_batch_donor_id ON DONATION_BATCHES(donor_id);
CREATE INDEX idx_batch_approval_status ON DONATION_BATCHES(approval_status);

-- 5. ITEM_REQUESTS Table
CREATE TABLE ITEM_REQUESTS (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_id INT NOT NULL,
    item_id INT NOT NULL,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    request_status ENUM('pending', 'approved', 'rejected', 'fulfilled') DEFAULT 'pending',
    request_reason TEXT,
    FOREIGN KEY (recipient_id) REFERENCES RECIPIENTS(recipient_id),
    FOREIGN KEY (item_id) REFERENCES ITEMS(item_id)
);

-- Add indexes
CREATE INDEX idx_request_recipient_id ON ITEM_REQUESTS(recipient_id);
CREATE INDEX idx_request_item_id ON ITEM_REQUESTS(item_id);
CREATE INDEX idx_request_status ON ITEM_REQUESTS(request_status);

-- 6. DISTRIBUTIONS Table
CREATE TABLE DISTRIBUTIONS (
    distribution_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id INT NOT NULL,
    recipient_id INT NOT NULL,
    distribution_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    distributed_by VARCHAR(100) NOT NULL,
    distribution_method ENUM('direct_pickup', 'home_delivery', 'center_collection') NOT NULL,
    recipient_feedback TEXT,
    distribution_notes TEXT,
    satisfaction_rating INT CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    FOREIGN KEY (item_id) REFERENCES ITEMS(item_id),
    FOREIGN KEY (recipient_id) REFERENCES RECIPIENTS(recipient_id)
);

-- Add indexes
CREATE INDEX idx_dist_item_id ON DISTRIBUTIONS(item_id);
CREATE INDEX idx_dist_recipient_id ON DISTRIBUTIONS(recipient_id);
CREATE INDEX idx_dist_date ON DISTRIBUTIONS(distribution_date);
