app.post('/login', (req, res) => {
    const { email, password, role } = req.body;
  
    const tableName = role === 'user' ? 'users' : 'workers';
    const sql = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
    connection.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error connecting to database');
      }
      if (results.length > 0) {
        const loginForm = document.getElementById('loginform');
        loginForm.addEventListener('submit', (event) => {
          event.preventDefault(); 
          loginForm.reset();
          window.location.href = '/homepage';
          window.history.pushState(null, null, '/homepage');
        
          window.onpopstate = function () {
            window.location.href = '/homepage';
          };
        });
      } else {
        return res.redirect(`/login?error=Invalid+email+or+password&reset=true`); 
      }
    });
  });



  // Assuming you're using Express.js and express-session middleware
const session = require('express-session');

// Initialize session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// When the user accesses the login page (e.g., from the "Contact Us" page)
app.get('/login', (req, res) => {
  // Store the referring URL in the session
  req.session.referringUrl = req.headers.referer || '/'; // Default to homepage
  res.render('login'); // Render your login page
});

// After successful login
app.post('/login', (req, res) => {
  // Your login logic here...

  // Clear form data after successful login
  // ...

  // Redirect back to the referring URL (or homepage if not set)
  const referringUrl = req.session.referringUrl || '/';
  res.redirect(referringUrl);
});



  app.post('/login', (req, res) => {
    const { email, password, role } = req.body;
  
    const tableName = role === 'user' ? 'users' : 'workers';
    const sql = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
    connection.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error connecting to database');
      }
  
      if (results.length > 0) {
        const loginForm = document.getElementById('loginform');
        loginForm.reset();
  

        const referringUrl = req.headers.referer || '/homepage';
        res.redirect(referringUrl);
  
        // Add an entry to the browser's history
        window.history.pushState(null, null, referringUrl);
  
        // Listen for the browser's back button
        window.onpopstate = function () {
          window.location.href = referringUrl;
        };
      } else {
        return res.redirect(`/login?error=Invalid+email+or+password&reset=true`);
      }
    });
  });
  




  app.post('/login', (req, res) => {
    const { email, password, role } = req.body;
  
    // Login logic...
    // Check if the user exists in the database
    const tableName = role === 'user' ? 'users' : 'workers';
    const sql = `SELECT * FROM ${tableName} WHERE email = ? AND password = ?`;
    connection.query(sql, [email, password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).send('Error connecting to database');
      }
  
      // Check if user exists and password matches
      if (results.length > 0) {
        // After successful login:
        return res.redirect('/homepage'); // Use 'return' here
      } else {
        // If login fails, redirect back to login page with an error message
        return res.redirect(`/login?error=Invalid+email+or+password&reset=true`); // Use 'return' here
      }
    });
  });