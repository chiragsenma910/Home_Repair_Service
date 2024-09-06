document.addEventListener('DOMContentLoaded', () => {
    const showAllUsersButton = document.getElementById('showAllUsersButton');
    const appointmentsTable = document.getElementById('appointmentsTable');
    const appointmentsTableBody = appointmentsTable.querySelector('tbody');

    showAllAppointmentsButton.addEventListener('click', () => {
        fetch('/api/appointments')
            .then(response => response.json())
            .then(appointments => {
                appointmentsTableBody.innerHTML = ''; // Clear the table body
                appointments.forEach(appointment => {
                    const row = document.createElement('tr');
                    // Displaying all user information in the table
                    row.innerHTML = `
                        <td>${appointment.id}</td>
                        <td>${appointment.worker_id} </td>
                        <td>${appointment.user_id}</td>
                        <td>${appointment.worker_type}</td>
                        <td>${appointment.task_details}</td>
                        <td>${appointment.task_date}</td>
                        <td>${appointment.task_time_slot}</td>
                        <td>${appointment.task_status}</td>
                        <td><button class="deleteUserButton" data-id="${appointment.id}">Delete</button></td>
                    `;
                    appointmentsTableBody.appendChild(row);
                });
                appointmentsTable.style.display = 'table'; // Show the table
            })
            .catch(error => console.error('Error fetching users:', error));
    });
    

    appointmentsTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('deleteUserButton')) {
            const userId = event.target.getAttribute('data-id');
            fetch(`/api/appointments/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userId)
            })
            .then(response => {
                if (response.ok) {
                    event.target.closest('tr').remove();
                } else {
                    console.error('Error deleting user');
                }
            })
            .catch(error => console.error('Error deleting user:', error));
        }
    });
});
