const connection = require('../db');

exports.submitRating = (req, res) => {
    const { appointmentId, paymentAmount, rating } = req.body;

    // Fetch appointment details
    connection.query('SELECT * FROM appointments WHERE id = ?', [appointmentId], (err, results) => {
        if (err) {
            console.error('Error fetching appointment details:', err);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const appointment = results[0];

        // Move appointment data to completedservices table
        const insertQuery = `
            INSERT INTO completedservices (appointment_id, worker_id, user_id, worker_type, task_details, task_date, task_time_slot, payment_amount, rating)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const insertValues = [
            appointment.id,
            appointment.worker_id,
            appointment.user_id,
            appointment.worker_type,
            appointment.task_details,
            appointment.task_date,
            appointment.task_time_slot,
            paymentAmount,
            rating
        ];

        connection.query(insertQuery, insertValues, (err, result) => {
            if (err) {
                console.error('Error inserting into completedservices:', err);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }

            // Delete the appointment from the appointments table
            connection.query('DELETE FROM appointments WHERE id = ?', [appointmentId], (err, result) => {
                if (err) {
                    console.error('Error deleting appointment:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                res.status(200).json({ success: true, message: 'Rating submitted and appointment completed' });
            });
        });
    });
};
