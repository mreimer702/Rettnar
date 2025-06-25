-- Create the EasyRent database
CREATE DATABASE EasyRent;
USE EasyRent;

-- Table to store user information
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each user
    name VARCHAR(255) NOT NULL, -- Full name of the user
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address (must be unique)
    phone VARCHAR(20) UNIQUE, -- Phone number (optional, but must be unique if provided)
    password_hash VARCHAR(255) NOT NULL, -- Hashed password for security
    role ENUM('renter', 'owner', 'admin') NOT NULL DEFAULT 'renter', -- User role (renter, owner, or admin)
    permission_level ENUM('super_admin', 'moderator', 'support', 'finance') DEFAULT 'support', -- Admin permission level
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the user was created
);

-- Table to store rental listings
CREATE TABLE listings (
    listing_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each listing
    owner_id INT NOT NULL, -- ID of the user who owns the listing
    title VARCHAR(255) NOT NULL, -- Title of the listing
    description TEXT, -- Description of the listing
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0), -- Price of the rental (must be non-negative)
    category ENUM('equipment', 'venue') NOT NULL, -- Category of the listing (equipment or venue)
    latitude DECIMAL(10,8), -- Latitude for location-based searches
    longitude DECIMAL(11,8), -- Longitude for location-based searches
    calendar_availability TEXT, -- Availability slots (stored as JSON string)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the listing was created
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to owner
    FULLTEXT(title, description) -- Full-text index for searching
);

-- Table to track fraud and disputes
CREATE TABLE fraud_tracking (
    fraud_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each fraud/dispute entry
    user_id INT NOT NULL, -- ID of the user involved in the dispute
    listing_id INT, -- ID of the listing involved (if applicable)
    dispute_type ENUM('chargeback', 'policy_violation', 'fraudulent_activity') NOT NULL, -- Type of dispute
    status ENUM('open', 'resolved') DEFAULT 'open', -- Status of the dispute
    flagged_by INT, -- ID of the admin who flagged the user/listing
    reason TEXT, -- Reason for flagging
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the dispute was created
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to user
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE, -- Link to listing
    FOREIGN KEY (flagged_by) REFERENCES users(user_id) ON DELETE SET NULL -- Link to admin who flagged
);

-- Table to store messages between users
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each message
    sender_id INT NOT NULL, -- ID of the user who sent the message
    receiver_id INT NOT NULL, -- ID of the user who received the message
    message_text TEXT NOT NULL, -- The content of the message
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the message was sent
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to sender
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE -- Link to receiver
);

-- Table to log user activity (e.g., logins, actions)
CREATE TABLE user_activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each log entry
    user_id INT NOT NULL, -- ID of the user who performed the activity
    activity_type ENUM('login', 'logout', 'view_listing', 'send_message') NOT NULL, -- Type of activity
    activity_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the activity
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Link to user
);

-- Table to store booking information
CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each booking
    renter_id INT NOT NULL, -- ID of the user who made the booking
    listing_id INT NOT NULL, -- ID of the listing being booked
    start_date DATETIME NOT NULL, -- Start date of the booking
    end_date DATETIME NOT NULL, -- End date of the booking
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending', -- Status of the booking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the booking was created
    FOREIGN KEY (renter_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to renter
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Table to log admin actions (e.g., banning users, approving listings)
CREATE TABLE admin_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each admin action
    admin_id INT NOT NULL, -- ID of the admin who performed the action
    user_id INT, -- ID of the user affected by the action
    listing_id INT, -- ID of the listing affected by the action
    action_type ENUM('ban_user', 'suspend_user', 'approve_listing', 'reject_listing', 'hide_listing', 'refund_transaction') NOT NULL, -- Type of action
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the action was performed
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to admin
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE, -- Link to user
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Table to store attachments for messages
CREATE TABLE attachments (
    attachment_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each attachment
    message_id INT NOT NULL, -- ID of the message the attachment belongs to
    file_url VARCHAR(255) NOT NULL, -- URL or path to the attached file
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the attachment was uploaded
    FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE -- Link to message
);

-- Table to log user search queries
CREATE TABLE search_logs (
    search_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each search log
    user_id INT, -- ID of the user who performed the search
    search_query VARCHAR(255), -- The search query entered by the user
    latitude DECIMAL(10,8), -- Latitude for location-based searches
    longitude DECIMAL(11,8), -- Longitude for location-based searches
    radius_km DECIMAL(5,2), -- Search radius in kilometers
    min_price DECIMAL(10,2), -- Minimum price filter
    max_price DECIMAL(10,2), -- Maximum price filter
    min_rating INT CHECK (min_rating BETWEEN 1 AND 5), -- Minimum rating filter
    filters TEXT, -- Additional filters in JSON format (stored as TEXT)
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the search was performed
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL -- Link to user
);

-- Table to store additional features for listings
CREATE TABLE listing_features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each feature
    listing_id INT NOT NULL, -- ID of the listing the feature belongs to
    feature_name VARCHAR(255) NOT NULL, -- Name of the feature
    feature_value VARCHAR(255), -- Value of the feature
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Table to track delivery status for rented items
CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each delivery
    booking_id INT NOT NULL, -- ID of the booking the delivery belongs to
    delivery_status ENUM('pending', 'out_for_delivery', 'delivered', 'returned') DEFAULT 'pending', -- Status of the delivery
    estimated_arrival DATETIME, -- Estimated arrival time
    actual_arrival DATETIME, -- Actual arrival time
    delivery_latitude DECIMAL(10,8), -- Latitude for delivery location
    delivery_longitude DECIMAL(11,8), -- Longitude for delivery location
    tracking_url VARCHAR(255), -- URL for tracking the delivery
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the delivery was created
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE -- Link to booking
);

-- Table to store notifications for users
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each notification
    user_id INT NOT NULL, -- ID of the user who receives the notification
    message TEXT NOT NULL, -- Content of the notification
    notification_type ENUM('booking', 'payment', 'dispute', 'alert') NOT NULL, -- Type of notification
    status ENUM('unread', 'read') DEFAULT 'unread', -- Status of the notification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the notification was created
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Link to user
);

-- Table to store delivery-specific notifications
CREATE TABLE delivery_notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each delivery notification
    delivery_id INT NOT NULL, -- ID of the delivery the notification belongs to
    user_id INT NOT NULL, -- ID of the user who receives the notification
    message TEXT NOT NULL, -- Content of the notification
    status ENUM('sent', 'read') DEFAULT 'sent', -- Status of the notification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the notification was created
    FOREIGN KEY (delivery_id) REFERENCES deliveries(delivery_id) ON DELETE CASCADE, -- Link to delivery
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Link to user
);

-- Table to store user reviews for bookings
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each review
    booking_id INT NOT NULL, -- ID of the booking the review belongs to
    reviewer_id INT NOT NULL, -- ID of the user who wrote the review
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Rating (1 to 5 stars)
    review_text TEXT, -- Text content of the review
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the review was created
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE, -- Link to booking
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE -- Link to reviewer
);

-- Table to store payment information for bookings
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each payment
    booking_id INT NOT NULL, -- ID of the booking the payment belongs to
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0), -- Payment amount (must be non-negative)
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending', -- Status of the payment
    payment_method ENUM('credit_card', 'paypal', 'cash') NOT NULL, -- Payment method used
    transaction_id VARCHAR(255) UNIQUE, -- Unique transaction ID (e.g., from payment gateway)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the payment was created
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE -- Link to booking
);

-- Table to track revenue by category and commission breakdown
CREATE TABLE revenue_tracking (
    revenue_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each revenue entry
    booking_id INT NOT NULL, -- ID of the booking
    category ENUM('equipment', 'venue') NOT NULL, -- Category of the listing
    total_amount DECIMAL(10,2) NOT NULL, -- Total amount of the booking
    platform_fee DECIMAL(10,2) NOT NULL, -- Platform fee
    service_fee DECIMAL(10,2) NOT NULL, -- Service fee
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the revenue was tracked
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE -- Link to booking
);

-- Table to track engagement metrics (listing views, messages, rental requests)
CREATE TABLE engagement_metrics (
    engagement_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each engagement entry
    listing_id INT NOT NULL, -- ID of the listing
    views INT DEFAULT 0, -- Number of views
    messages_exchanged INT DEFAULT 0, -- Number of messages exchanged
    rental_requests INT DEFAULT 0, -- Number of rental requests
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the metrics were tracked
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Table to store dynamic pricing rules and discounts
CREATE TABLE pricing_rules (
    rule_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each pricing rule
    listing_id INT NOT NULL, -- ID of the listing
    rule_type ENUM('discount', 'surcharge') NOT NULL, -- Type of rule (discount or surcharge)
    amount DECIMAL(10,2) NOT NULL, -- Amount of the discount or surcharge
    start_date DATETIME NOT NULL, -- Start date of the rule
    end_date DATETIME NOT NULL, -- End date of the rule
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the rule was created
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Table to store rental demand data for heatmaps
CREATE TABLE rental_demand (
    demand_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each demand entry
    latitude DECIMAL(10,8) NOT NULL, -- Latitude of the location
    longitude DECIMAL(11,8) NOT NULL, -- Longitude of the location
    demand_level ENUM('low', 'medium', 'high') NOT NULL, -- Demand level (low, medium, high)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the demand was tracked
);

-- Table to store A/B testing results
CREATE TABLE ab_testing_results (
    test_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each A/B test
    listing_id INT NOT NULL, -- ID of the listing
    test_type ENUM('pricing', 'visibility') NOT NULL, -- Type of test (pricing or visibility)
    variant_a VARCHAR(255) NOT NULL, -- Variant A of the test
    variant_b VARCHAR(255) NOT NULL, -- Variant B of the test
    result ENUM('variant_a', 'variant_b') NOT NULL, -- Result of the test
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the test was conducted
    FOREIGN KEY (listing_id) REFERENCES listings(listing_id) ON DELETE CASCADE -- Link to listing
);

-- Add indexes for better performance
ALTER TABLE listings ADD FULLTEXT(title, description); -- Full-text index for searching listings
CREATE INDEX idx_lat_long ON listings (latitude, longitude); -- Index for location-based searches
CREATE INDEX idx_search_query ON search_logs (search_query); -- Index for search logs
CREATE INDEX idx_start_end_date ON bookings (start_date, end_date); -- Index for booking date ranges


SET PASSWORD FOR 'root'@'localhost' = PASSWORD('app_password');
FLUSH PRIVILEGES;





/*
===========================================================
EasyRent Database Setup and Usage Guide
===========================================================

This guide provides step-by-step instructions for setting up, connecting to, and using the EasyRent database for both backend and frontend development.

---

1. **Setting Up the Database**
--------------------------------
-- Prerequisites:
-- - Install a MySQL server (e.g., MySQL, MariaDB).
-- - Install a database management tool (e.g., MySQL Workbench, phpMyAdmin, or DBeaver).

-- Steps to Create the Database:
-- 1. Run the provided SQL script to create the `EasyRent` database and all its tables.
-- 2. Verify the database and tables:
     SHOW DATABASES;
     USE EasyRent;
     SHOW TABLES;
-- 3. (Optional) Insert sample data for testing:
     INSERT INTO users (name, email, phone, password_hash, role) 
     VALUES ('John Doe', 'john@example.com', '1234567890', 'hashed_password', 'renter');

---

2. **Connecting to the Database**
----------------------------------
-- Backend Connection:
-- Use one of the following methods to connect to the database from your backend application.

-- **Using Node.js (with `mysql2` or `sequelize`)**:
-- 1. Install the required package:
     npm install mysql2
     # OR
     npm install sequelize

-- 2. Create a connection:
     const mysql = require('mysql2');
     const connection = mysql.createConnection({
       host: 'localhost', // Database host
       user: 'root',      // Database username
       password: 'app_password', // Database password
       database: 'EasyRent' // Database name
     });
     connection.connect((err) => {
       if (err) throw err;
       console.log('Connected to the EasyRent database!');
     });

-- 3. Execute queries:
     connection.query('SELECT * FROM users', (err, results) => {
       if (err) throw err;
       console.log(results);
     });

-- **Using Python (with `mysql-connector-python`)**:
-- 1. Install the required package:
     pip install mysql-connector-python

-- 2. Create a connection:
     import mysql.connector
     db = mysql.connector.connect(
       host="localhost",
       user="root",
       password="your_password",
       database="EasyRent"
     )
     cursor = db.cursor()

-- 3. Execute queries:
     cursor.execute("SELECT * FROM users")
     results = cursor.fetchall()
     for row in results:
       print(row)

---

3. **Using the Database in Frontend**
--------------------------------------
-- Frontend applications interact with the database through backend APIs. Below is an example of how to fetch data from the backend:

-- **Example: Fetching Users (JavaScript Fetch API)**:
     fetch('http://your-backend-api.com/api/users')
       .then(response => response.json())
       .then(data => console.log(data))
       .catch(error => console.error('Error:', error));

-- **Example: Fetching Listings (React)**:
     import React, { useEffect, useState } from 'react';
     function Listings() {
       const [listings, setListings] = useState([]);
       useEffect(() => {
         fetch('http://your-backend-api.com/api/listings')
           .then(response => response.json())
           .then(data => setListings(data));
       }, []);
       return (
         <div>
           {listings.map(listing => (
             <div key={listing.listing_id}>{listing.title}</div>
           ))}
         </div>
       );
     }

---

4. **Backend API Examples**
----------------------------
-- Below are examples of backend API endpoints to interact with the EasyRent database.

-- **Get All Users**:
     app.get('/api/users', (req, res) => {
       connection.query('SELECT * FROM users', (err, results) => {
         if (err) throw err;
         res.json(results);
       });
     });

-- **Get Listings by Category**:
     app.get('/api/listings/:category', (req, res) => {
       const category = req.params.category;
       connection.query('SELECT * FROM listings WHERE category = ?', [category], (err, results) => {
         if (err) throw err;
         res.json(results);
       });
     });

-- **Create a New User**:
     app.post('/api/users', (req, res) => {
       const { name, email, phone, password_hash, role } = req.body;
       const query = 'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)';
       connection.query(query, [name, email, phone, password_hash, role], (err, results) => {
         if (err) throw err;
         res.json({ message: 'User created successfully!', userId: results.insertId });
       });
     });

---

5. **Database Maintenance**
----------------------------
-- Regularly back up the database:
     mysqldump -u root -p EasyRent > EasyRent_backup.sql

-- Optimize database performance:
     ANALYZE TABLE users;
     OPTIMIZE TABLE listings;

-- Monitor database logs for errors and performance issues.

---

6. **Security Best Practices**
-------------------------------
-- Use environment variables to store database credentials.
-- Hash passwords before storing them in the `users` table.
-- Use prepared statements to prevent SQL injection.
-- Regularly update your MySQL server to the latest version.

===========================================================
End of Guide
===========================================================
*/



