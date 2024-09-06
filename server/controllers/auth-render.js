const multer = require("multer");
const path = require("path");
const db = require("../db"); // Import your database module


exports.renderHomePage = (req, res) => {
  const { loggedin, user } = req.session;
  res.render("homepage", { loggedin, user });
};

exports.renderServiceSelection = (req, res) => {
  const { loggedin, user } = req.session;
  res.render("serviceselection", { loggedin, user });
};

exports.renderAboutUs = (req, res) => {
  const { loggedin, user } = req.session;
  res.render("aboutus", { loggedin, user });
};

exports.renderContactUs = (req, res) => {
  const { loggedin, user } = req.session;
  res.render("contactus", { loggedin, user });
};

exports.renderJoinUs = (req, res) => {
  const { loggedin, user } = req.session;
  res.render("joinus", { loggedin, user });
};

exports.renderLoginPage = (req, res) => {
  req.session.returnTo = req.query.from || req.get("referer") || "/homepage";
  if (req.session.loggedin) {
    res.redirect(req.session.returnTo);
  } else {
    res.render("login", { error: req.query.error, reset: req.query.reset });
  }
};

exports.renderSignupPage = (req, res) => {
  if (req.session.loggedin) {
    res.redirect("/homepage");
  } else {
    req.session.returnTo = req.query.from || req.get("referer") || "/";
    res.render("signup", { reset: req.query.reset });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/homepage");
    }
  });
};

exports.renderUserProfilePage = (req, res) => {
  const { loggedin, user } = req.session;

  // Check if user is logged in and user object exists in session
  if (!loggedin || !user || !user.email) {
    return res.status(401).send("Unauthorized");
  }

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [user.email],
    (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).send("Error fetching user data");
      }

      // Check if user data exists
      if (results.length > 0) {
        const userData = results[0]; // Assuming only one user with the given email
        req.session.user = userData; // Update session data with fetched user data
        res.render("dashboard/userprofile", { loggedin, user: userData }); // Pass user data to the template
      } else {
        res.status(404).send("User not found");
      }
    }
  );
};

// Add rendering code for userservice.css
exports.renderServiceDashboardPage = (req, res) => {
  const { loggedin, user } = req.session;

  if (!loggedin || !user || !user.id) {
    return res.status(401).send("Unauthorized");
  }
    res.render("dashboard/userservice", { loggedin, user });
};

exports.renderWorkerServiceDashboardPage = (req, res) => {
  const { loggedin, user } = req.session;

  if (!loggedin || !user || !user.id) {
    return res.status(401).send("Unauthorized");
  }
    res.render("dashboard/workerservice", { loggedin, user });
};

exports.renderWorkerProfilePage = (req, res) => {
  const { loggedin, user } = req.session;

  // Check if user is logged in and user object exists in session
  if (!loggedin || !user || !user.email) {
    return res.status(401).send("Unauthorized");
  }

  // Define the table name based on the user's role
  let tableName;
  if (user.role === "user") {
    // Redirect to user profile page as this function is for worker profile
    return res.redirect("/user-profile");
  } else if (user.role === "worker") {
    tableName = user.profession;
  } else {
    // Default to 'users' table for unknown roles
    tableName = "users";
  }

  // Fetch worker data from the database based on the email and selected table name
  db.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [user.email],
    (err, results) => {
      if (err) {
        console.error("Error fetching worker data:", err);
        return res.status(500).send("Error fetching worker data");
      }

      // Check if worker data exists
      if (results.length > 0) {
        const workerData = results[0]; // Assuming only one worker with the given email
        req.session.user = workerData; // Update session data with fetched worker data
        res.render("dashboard/workerprofile", { loggedin, user: workerData }); // Pass worker data to the template
      } else {
        // Handle case where worker data does not exist
        res.status(404).send("Worker not found");
      }
    }
  );
};

exports.renderChangePassword = (req, res) => {
  const { loggedin, user } = req.session;
  if (!loggedin || !user || !user.email) {
    return res.status(401).send("Unauthorized");
  }

  // Define the table name based on the user's role
  let tableName;
  if (user.role === "user") {
    tableName = "users";
  } else if (user.role === "worker") {
    // Set the table name based on the worker's profession
    tableName = user.profession;
  } else {
    // Default to 'users' table for unknown roles
    tableName = "users";
  }

  // Fetch user data from the database based on the email and selected table name
  db.query(
    `SELECT * FROM ${tableName} WHERE email = ?`,
    [user.email],
    (err, results) => {
      if (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).send("Error fetching user data");
      }

      // Check if user data exists
      if (results.length > 0) {
        const userData = results[0]; // Assuming only one user with the given email
        req.session.user = userData; // Update session data with fetched user data
        // Render the change password page based on user's role
        if (user.role === "user") {
          res.render("dashboard/userchangepassword", {
            loggedin,
            user: userData,
          });
        } else if (user.role === "worker") {
          res.render("dashboard/workerchangepassword", {
            loggedin,
            user: userData,
          });
        }
      } else {
        // Handle case where user data does not exist
        res.status(404).send("User not found");
      }
    }
  );
};




exports.renderAdminLogin = (req, res) => {
  req.session.returnTo = req.query.from || req.get("referer") || "/homepage";
  if (req.session.loggedin) {
    res.redirect(req.session.returnTo);
  } else {
    res.render("dashboard/admin/adminlogin", { error: req.query.error, reset: req.query.reset });
  }
};

exports.renderAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email === 'vanshpatel89@gmail.com' && password === 'Vansh@89') {
    const loggedin = true; // Assuming you need to set this variable to true
    res.render("dashboard/admin/admindashboard_user", { loggedin });
  } else {
    res.status(401).send("Unauthorized");
  }
};

exports.renderAdminUser = (req, res) => {
    res.render("dashboard/admin/admindashboard_user");
};

exports.renderAdminWorker = (req, res) => {
    res.render("dashboard/admin/admindashboard_worker");
};

exports.renderAdminAppointment = (req, res) => {
    res.render("dashboard/admin/admindashboard_appointment");
};
