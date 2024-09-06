const connection = require('../db'); 

exports.fetchAllUsers = (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.body.userId;
    connection.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Server error');
        } else {
            res.status(204).send(); // No Content
        }
    });
};

exports.fetchAllAppointments = (req, res) => {
    connection.query('SELECT * FROM appointments', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
};

exports.deleteAppointment = (req, res) => {
    const userId = req.body.userId;
    connection.query('DELETE FROM appointments WHERE id = ?', [userId], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Server error');
        } else {
            res.status(204).send(); // No Content
        }
    });
};


exports.fetchAllWorkers = (req, res) => {
    const { service, state, district, city } = req.body;
    const tableName = service.toLowerCase();
    connection.query(
      `SELECT * FROM ${tableName} WHERE state = ? AND district = ? AND city = ?`,
      [state, district, city],
      (err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Error connecting to database');
        }
        res.json(results);
      }
    );
};
  

exports.deleteWorker = (req, res) => {
    const { workerId,workerProfession } = req.body;
    const tableName = workerProfession.toLowerCase();
    connection.query(`DELETE FROM ${tableName} WHERE id = ?`, [workerId], (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            res.status(500).send('Server error');
        } else {
            res.status(204).send(); // No Content
        }
    });
};