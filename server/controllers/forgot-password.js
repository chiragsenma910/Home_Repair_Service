// controllers/forgot-password.js

const nodemailer = require('nodemailer');
const db = require('../db');

// Function to send OTP to user's email
// Function to send OTP to user's email
exports.sendOTP = (req, res) => {
    // Extract data from request body
    const { role, email, profession } = req.body;

    // Determine the table name based on the role
    const tableName = role === 'user' ? 'users' : (profession ? profession.toLowerCase() : null);

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'Invalid role or profession specified.' });
    }

    // Check if email exists in the specified table
    db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email], (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Failed to send OTP. Please try again.' });
        } else {
            if (result.length > 0) {
                // Email exists, generate OTP and send it
                const otp = generateOTP();
                const otpExpiry = new Date();
                otpExpiry.setHours(otpExpiry.getHours() + 1); // OTP expiry after 1 hour

                // Store OTP, email, role, and profession in the session
                req.session.otp = otp;
                req.session.email = email;
                req.session.role = role;
                req.session.profession = profession;

                sendOTPEmail(email, otp, otpExpiry);

                return res.json({ success: true, message: 'OTP sent successfully.' });
            } else {
                // Email does not exist in the specified table
                return res.status(404).json({ success: false, message: 'Email not found. Please check your email address.' });
            }
        }
    });
};


// Function to generate a random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP email
// Function to send OTP email
function sendOTPEmail(email, otp, expiry) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'f', // Your Gmail email address
        pass: 'q' // Your generated App Password
    }
});
    const mailOptions = {
        from: 'fixitpro@gmail.com',
        to: email,
        subject: 'OTP for Password Reset',
        html: `
            <p><strong>Your OTP is: ${otp}</strong></p>
            <p>This OTP is valid until ${expiry.toLocaleString()}.</p>
        `
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


// Function to verify OTP entered by user
exports.verifyOTP = (req, res) => {
  // Extract OTP from request body
  const { otp } = req.body;

  // Compare OTP with the dynamically generated OTP stored on the server
  if (otp === req.session.otp) {
      // Store email in session
      res.json({ success: true });
  } else {
      res.status(401).json({ success: false, message: 'Invalid OTP. Please try again.' });
  }
};

// Function to set a new password
// Function to set new password
exports.setPassword = (req, res) => {
    // Extract new password from request body
    const { password } = req.body;

    // Extract email and role from session
    const email = req.session.email;
    const role = req.session.role;
    const profession = req.session.profession;

    if (!email || !role) {
        return res.status(400).json({ success: false, message: 'Email address or role not found in session. Please verify OTP again.' });
    }

    // Determine the table name based on the role and profession
    const tableName = role === 'user' ? 'users' : (profession ? profession.toLowerCase() : null);

    if (!tableName) {
        return res.status(400).json({ success: false, message: 'Invalid role or profession specified.' });
    }

    // Update password in the database
    db.query(`UPDATE ${tableName} SET password = ? WHERE email = ?`, [password, email], (err, result) => {
        if (err) {
            console.error('Error updating password in database:', err);
            res.status(500).json({ success: false, message: 'Failed to set new password. Please try again.' });
        } else {
            // Destroy the session after updating password
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).json({ success: false, message: 'Failed to clear session. Please try again.' });
                } else {
                    res.json({ success: true, message: 'Password updated successfully! Session cleared.' });
                }
            });
        }
    });
};




