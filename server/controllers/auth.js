const multer = require('multer');
const path = require('path');
const db = require('../db'); // Import your database module

// auth-login.js

exports.login = (req, res) => {
  const { email, password, role } = req.body;

  // Determine the table name based on the role
  const tableName = role === 'user' ? 'users' : req.body.profession.toLowerCase();

  // Query the database using the determined table name
  db.query(`SELECT * FROM ${tableName} WHERE email = ? AND password = ?`, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error connecting to database');
    }

    if (results.length > 0) {
      // Store user data in the session upon successful login
      req.session.loggedin = true;
      req.session.user = results[0];

      const returnTo = req.session.returnTo || '/homepage';
      delete req.session.returnTo;
      res.redirect(returnTo);
    } else {
      res.redirect('/login?error=Invalid+email+or+password&reset=true');
    }
  });
};

// auth-signup.js

exports.signup = (req, res) => {
  const { email, password, role, profession } = req.body;
  
  if (req.body['password'] !== req.body['confirm-password']) {
    return res.redirect('/signup?error=Password+and+Confirm+Password+do+not+match&reset=true');
  }
  
  let tableName;
  let values;

  if (role === 'user') {
    tableName = 'users';
    values = [email, password, role]; // No profession for regular users
  } else {
    tableName = profession.toLowerCase();
    values = [email, password, role, profession];
  }
  
  db.query(`INSERT INTO ${tableName} (email, password, role${role !== 'user' ? ', profession' : ''}) VALUES (?, ?, ?${role !== 'user' ? ', ?' : ''})`, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.redirect('/signup?error=Error+inserting+data+into+database&reset=true');
    }
    // Fetch the user's data after signup
    db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).send('Error fetching user data');
      }
      
      // Store all user data in the session
      req.session.loggedin = true;
      req.session.user = results[0]; // Assuming only one user with the given email
      
      if (role === 'worker') {
        return res.redirect('/workerprofile');
      } else {
        return res.redirect('/homepage');
      }
    });
  });
};


// auth-update.js

exports.updateUserInfo = (req, res) => {
  const updatedUserInfo = req.body;
  const userEmail = req.session.user.email; // Retrieve email from the session
  const role = req.session.user.role; // Retrieve role from the session

  console.log('Updating user information:', updatedUserInfo); // Log updated user information

  // Prepare arrays to store columns and values for the update query
  const columns = [];
  const values = [];

  // Iterate through the updatedUserInfo object to check for non-empty fields
  Object.entries(updatedUserInfo).forEach(([key, value]) => {
    if (value !== '' && key !== 'profile_image') { // Check if the value is not empty and not profile_image
      columns.push(`${key} = ?`);
      values.push(value);
    }
  });

  let tableName;
  if (role === 'user') {
    tableName = 'users';
  } else {
    // If the user is a worker, retrieve the profession from the session and determine the table name
    const profession = req.session.user.profession.toLowerCase();
    tableName = profession;
  }

  // Add the user's email to the values array
  values.push(userEmail);

  // Update user information in the database
  if (columns.length > 0) {
    db.query(
      `UPDATE ${tableName} SET ${columns.join(', ')} WHERE email = ?`,
      values,
      (err, result) => {
        if (err) {
          console.error('Error updating user information:', err);
          return res.status(500).send('Failed to update user information');
        }
        // Update session data with the new user information
        Object.assign(req.session.user, updatedUserInfo);
        res.status(200).send('User information updated successfully');
      }
    );
  } else {
    // If no non-empty fields are provided, send a response indicating that no update is performed
    res.status(200).send('No fields provided for update');
  }
};


exports.updatePassword = (req, res) => {
  const { password, newPassword } = req.body;
  const userEmail = req.session.user.email; // Retrieve email from the session
  const role = req.session.user.role; // Retrieve role from the session

  if (password !== req.session.user.password) {
    return res.status(400).send('Current password does not match');
  }

  let tableName;
  if (role === 'user') {
    tableName = 'users';
  } else {
    // If the user is a worker, set the table name based on the profession
    const profession = req.session.user.profession.toLowerCase();
    tableName = profession;
  }

  db.query(
    `UPDATE ${tableName} SET password = ? WHERE email = ?`,
    [newPassword, userEmail],
    (err, result) => {
      if (err) {
        console.error('Error updating user password:', err);
        return res.status(500).send('Failed to update user password');
      }
      // Update session data with the new password
      req.session.user.password = newPassword;
      res.status(200).json({ success: true, message: 'Password updated successfully' });
    }
  );
};

