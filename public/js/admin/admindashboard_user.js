document.addEventListener('DOMContentLoaded', () => {
    const showAllUsersButton = document.getElementById('showAllUsersButton');
    const usersTable = document.getElementById('usersTable');
    const usersTableBody = usersTable.querySelector('tbody');

    showAllUsersButton.addEventListener('click', () => {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                usersTableBody.innerHTML = ''; // Clear the table body
                users.forEach(user => {
                    const row = document.createElement('tr');
                    // Displaying all user information in the table
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.firstname} ${user.lastname}</td>
                        <td>${user.email}</td>
                        <td>${user.mobile}</td>
                        <td>${user.state}</td>
                        <td>${user.district}</td>
                        <td>${user.city}</td>
                        <td>${user.address}</td>
                        <td>${user.pin_code}</td>
                        <td><button class="deleteUserButton" data-id="${user.id}">Delete</button></td>
                    `;
                    usersTableBody.appendChild(row);
                });
                usersTable.style.display = 'table'; // Show the table
            })
            .catch(error => console.error('Error fetching users:', error));
    });
    

    usersTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('deleteUserButton')) {
            const userId = event.target.getAttribute('data-id');
            fetch(`/api/users/delete`, {
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
