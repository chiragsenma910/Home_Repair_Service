document.addEventListener('DOMContentLoaded', function () {
    const showAllWorkersButton= document.getElementById('showAllWorkersButton');
  
    fetchStates();
    setupEventListeners();
  
    function fetchStates() {
      fetch('/states')
        .then(response => response.json())
        .then(data => populateSelect('state', data))
        .catch(error => console.error('Error fetching states:', error));
    }
  
    function setupEventListeners() {
      document.getElementById('state').addEventListener('change', handleStateChange);
      document.getElementById('district').addEventListener('change', handleDistrictChange);
    //   showAllWorkersButton.addEventListener('click', handleSearch);
    }
  
    function handleStateChange() {
      const stateId = this.value;
      const districtSelect = document.getElementById('district');
      const citySelect = document.getElementById('city');
  
      districtSelect.disabled = false;
      citySelect.disabled = true;
      citySelect.innerHTML = '<option value="">Select a city</option>';
  
      fetch(`/districts/${stateId}`)
        .then(response => response.json())
        .then(data => populateSelect('district', data))
        .catch(error => console.error('Error fetching districts:', error));
    }
  
    function handleDistrictChange() {
      const districtId = this.value;
      const citySelect = document.getElementById('city');
      citySelect.disabled = false;
  
      fetch(`/cities/${districtId}`)
        .then(response => response.json())
        .then(data => populateSelect('city', data))
        .catch(error => console.error('Error fetching cities:', error));
    }
  
    function populateSelect(selectId, data) {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = `<option value="">Select ${selectId.charAt(0).toUpperCase() + selectId.slice(1)}</option>`;
        data.forEach(item => {
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item.name;
          selectElement.appendChild(option);
        });
    }
  
    // const showAllWorkersButton = document.getElementById('showAllWorkersButton');
    const workersTable = document.getElementById('workersTable');
    const workersTableBody = workersTable.querySelector('tbody');
  
    showAllWorkersButton.addEventListener('click', () => {
        const selectedService = document.getElementById('service-select').value;
        const state = document.getElementById('state');
        const district = document.getElementById('district');
        const city = document.getElementById('city');
    
        const searchData = {
          service: selectedService,
          state: state.options[state.selectedIndex].text,
          district: district.options[district.selectedIndex].text,
          city: city.options[city.selectedIndex].text
        };
        fetch('/api/workers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchData)
          })
            .then(response => response.json())
            .then(workers => {
                workersTableBody.innerHTML = ''; // Clear the table body
                workers.forEach(worker => {
                    const row = document.createElement('tr');
                    // Displaying all user information in the table
                    row.innerHTML = `
                        <td>${worker.id}</td>
                        <td>${worker.firstname} ${worker.lastname}</td>
                        <td>${worker.email}</td>
                        <td>${worker.mobile}</td>
                        <td>${worker.profession}</td>
                        <td>${worker.experience}</td>
                        <td>${worker.state}</td>
                        <td>${worker.district}</td>
                        <td>${worker.city}</td>
                        <td>${worker.address}</td>
                        <td>${worker.pin_code}</td>
                        <td><button class="deleteWorkerButton" data-id="${worker.id}" data-profession="${worker.profession}">Delete</button></td>
                    `;
                    workersTableBody.appendChild(row);
                });
                workersTable.style.display = 'table'; // Show the table
            })
            .catch(error => console.error('Error fetching users:', error));
    });
    
    workersTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('deleteWorkerButton')) {
            const workerId = event.target.getAttribute('data-id');
            const workerProfession = event.target.getAttribute('data-profession');
            const deleteData = { workerId: workerId, workerProfession: workerProfession };
            fetch(`/api/workers/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteData)
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
