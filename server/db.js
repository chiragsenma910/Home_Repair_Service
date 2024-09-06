const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fixitpro'
});

// Establish connection to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Create users table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) 
  )`, err => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      // console.log('Users table created successfully');
    }
  });


  // Create plumber table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS plumber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) 
  )`, err => {
    if (err) {
      console.error('Error creating plumber table:', err);
    } else {
      // console.log('Plumber table created successfully');
    }
  });

  // Create electrician table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS electrician (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) 
  )`, err => {
    if (err) {
      console.error('Error creating electrician table:', err);
    } else {
      // console.log('Electrician table created successfully');
    }
  });

  // Create carpenter table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS carpenter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) 
  )`, err => {
    if (err) {
      console.error('Error creating carpenter table:', err);
    } else {
      // console.log('Carpenter table created successfully');
    }
  });

  // Create paintwork table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS paintwork (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    mobile VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    profession VARCHAR(255) NOT NULL,
    experience VARCHAR(255) NOT NULL,
    rating VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    district VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    profile_image VARCHAR(255) 
  )`, err => {
    if (err) {
      console.error('Error creating paintwork table:', err);
    } else {
      // console.log('Paintwork table created successfully');
    }
  });

});

connection.query(`CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  user_id INT NOT NULL,
  worker_type VARCHAR(255) NOT NULL,
  task_details TEXT NOT NULL,
  task_date DATE NOT NULL,
  task_time_slot VARCHAR(255) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'cancelled','in_progress','completed') DEFAULT 'pending'
)`, err => {
  if (err) {
    console.error('Error creating appointments table:', err);
  } else {
    // console.log('Appointments table created successfully');
  }
});

connection.query(`CREATE TABLE IF NOT EXISTS completedservices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  worker_id INT NOT NULL,
  user_id INT NOT NULL,
  worker_type VARCHAR(255) NOT NULL,
  task_details TEXT NOT NULL,
  task_date DATE NOT NULL,
  task_time_slot VARCHAR(255) NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  rating INT NOT NULL
)`, err => {
  if (err) {
    console.error('Error creating appointments table:', err);
  } else {
    // console.log('Appointments table created successfully');
  }
});

module.exports = connection;
