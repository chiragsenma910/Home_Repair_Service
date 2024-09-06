const multer = require('multer');
const db = require('../db'); // Import your database module

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        const userEmail = req.session.user.email; // Assuming user email is available in the session
        const fileName = `${userEmail}_profile_image.${file.originalname.split('.').pop()}`; // Use user email as the file name
        cb(null, fileName); // Set the file name
    }
});


const upload = multer({ storage: storage }).single('profile_image'); // 'profile_image' is the name attribute of the file input field in the form

// Function to handle image upload
function handleUpload(req, res, next) {
    console.log('Received image upload request');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            // An unknown error occurred when uploading
            console.error('Unknown error:', err);
            return res.status(500).json({ message: 'Unknown error: ' + err.message });
        }

        // File uploaded successfully
        console.log('Image uploaded successfully');

        // Save the image path to the database
        const imagePath = `/uploads/${req.file.filename}`; // Adjusted image path
        const userEmail = req.session.user.email; // Assuming user email is available in the session
        let tableName; // Define table name dynamically based on user's role

        // Check if role property exists in req.session.user object
        if (req.session.user && req.session.user.role === 'user') {
            tableName = 'users'; // Set tableName to 'users' if user is a regular user
        } else if (req.session.user && req.session.user.role === 'worker') {
            // Set tableName based on the worker's profession
            tableName = req.session.user.profession;
        } else {
            // Default to 'users' table if role is not defined or not 'worker'
            tableName = 'users';
        }

        const updateQuery = `UPDATE ${tableName} SET profile_image = ? WHERE email = ?`;

        // Execute the SQL query
        db.query(updateQuery, [imagePath, userEmail], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating profile image path in database:', updateErr);
                return res.status(500).json('Error updating profile image path in database' );
            }
            console.log('Profile image path updated in database');
            // Send success response
            return res.status(200).json({ message: 'Image uploaded and profile image path updated successfully' });
        });
    });
}


module.exports = {
    handleUpload
};
