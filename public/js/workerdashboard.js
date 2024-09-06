document.addEventListener('DOMContentLoaded', function () {
    const editProfileImgButton = document.querySelector('#changeprofileimg');
    const editProfileInfoButton = document.querySelector('#changeprofileinfo');
    const saveImageButton = document.querySelector('.save-image-button');
    const saveInfoButton = document.querySelector('.save-info-button');
    const cancelImageButton = document.querySelector('.cancel-image-button');
    const cancelInfoButton = document.querySelector('.cancel-info-button');
    let originalEditProfileImgDisplay = null;
    let originalEditProfileInfoDisplay = null;
    const uploadProfileImgInput = document.getElementById('upload-profile-img');


    fetch('/states')
    .then(response => response.json())
    .then(data => {
        const stateSelect = document.getElementById('state');
        data.forEach(state => {
            const option = document.createElement('option');
            option.value = state.id;
            option.textContent = state.name;
            stateSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching states:', error));

    // Event listener for state change to fetch districts
    document.getElementById('state').addEventListener('change', function () {
        const stateId = this.value;
        const districtSelect = document.getElementById('district');
        const citySelect = document.getElementById('city');
        const pincodeInput = document.getElementById('pin_code');

        districtSelect.disabled = false;
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">Select a city</option>';
        pincodeInput.value = '';

        fetch(`/districts/${stateId}`)
            .then(response => response.json())
            .then(data => {
                districtSelect.innerHTML = '<option value="">Select a district</option>';
                data.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.id;
                    option.textContent = district.name;
                    districtSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching districts:', error));
    });

    // Event listener for district change to fetch cities
    document.getElementById('district').addEventListener('change', function () {
        const districtId = this.value;
        const citySelect = document.getElementById('city');
        const pincodeInput = document.getElementById('pin_code');

        citySelect.disabled = false;
        pincodeInput.value = '';

        fetch(`/cities/${districtId}`)
            .then(response => response.json())
            .then(data => {
                citySelect.innerHTML = '<option value="">Select a city</option>';
                data.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.id;
                    option.textContent = city.name;
                    option.dataset.pincode = city.pin; // Store pincode in the option element
                    citySelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching cities:', error));
    });

    // Event listener for city change to fill in the pincode
    document.getElementById('city').addEventListener('change', function () {
        const selectedOption = this.selectedOptions[0];
        const pincodeInput = document.getElementById('pin_code');
        pincodeInput.value = selectedOption.dataset.pincode || '';
    });

    editProfileImgButton.addEventListener('click', function () {
        showImageActionButtons();
        hideEditProfileInfoButton();
        uploadProfileImgInput.click();
    });

    // Event listener for changing profile image
    uploadProfileImgInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        console.log('Selected file:', file);

        const reader = new FileReader();
        reader.onload = function(event) {
            const imgSrc = event.target.result;
            document.getElementById('proimg').src = imgSrc;
        };
        reader.readAsDataURL(file);
    });

    // Event listener for saving profile image
    saveImageButton.addEventListener('click', function (event) {
        const defaultProfileImageUrl = 'your_default_profile_image_url_here';
    
        const currentProfileImageUrl = document.getElementById('proimg').src;
    
        if (currentProfileImageUrl !== defaultProfileImageUrl) {
            // If different, proceed with image upload
            const formData = new FormData(profileImageForm);
            fetch('/api/upload-profile-image', {
                method: 'POST',
                body: formData
            })
            .then(response => { 
                if (!response.ok) {
                    throw new Error('Failed to update profile image');
                }
                alert('Profile image updated successfully');
                location.reload();
            })
            .catch(error => {
                console.error('Error updating profile image:', error);
                alert('Failed to update profile image');
            });
        } else {
            // If the current profile image URL is the same as the default, do nothing
            console.log('Profile image is the default image, no need to upload.');
        }
    
        event.preventDefault();
    });

    editProfileInfoButton.addEventListener('click', function () {
        const inputs = document.querySelectorAll('.worker-info input:not(#proimg)');
        const selects = document.querySelectorAll('.worker-info select');
        inputs.forEach(input => {
            if (input.id !== 'email' && input.id !== 'profession' && input.id !== 'rating' ) {
                input.removeAttribute('readonly');
            }
        });
        selects.forEach(select => select.disabled = false);
        showInfoActionButtons();
        hideEditProfileImgButton();
    });


        // Event listener for saving image
        const profileImageForm = document.getElementById('profile-image-form');
        profileImageForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/api/update-profile-image', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update profile image');
                }
                alert('Profile image updated successfully');
                location.reload();
            })
            .catch(error => {
                console.error('Error updating profile image:', error);
                alert('Failed to update profile image');
            });
        });

    saveInfoButton.addEventListener('click', function (event) {
        const stateSelect = document.getElementById('state');
        const districtSelect = document.getElementById('district');
        const citySelect = document.getElementById('city');

        const updatedUserInfo = {
            firstname: document.getElementById('firstname').value,
            lastname: document.getElementById('lastname').value,
            mobile: document.getElementById('mobile').value,
            profession: document.getElementById('profession').value,
            experience: document.getElementById('experience').value,
            state: stateSelect.options[stateSelect.selectedIndex].text,
            district: districtSelect.options[districtSelect.selectedIndex].text,
            city: citySelect.options[citySelect.selectedIndex].text,
            address: document.getElementById('address').value,
            pin_code: document.getElementById('pin_code').value
        };

        // Send updated user information to the server
        fetch('/api/update-user-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserInfo)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update user information');
                }
                alert('User information updated successfully');
                location.reload();
            })
            .catch(error => {
                console.error('Error updating user information:', error);
                alert('Failed to update user information');
            });

        event.preventDefault();
    });

    // Event listener for canceling image editing
    cancelImageButton.addEventListener('click', function () {
        showEditProfileImgButton();
        showEditProfileInfoButton();
        hideActionButtons();
        location.reload();
    });

    // Event listener for canceling user information editing
    cancelInfoButton.addEventListener('click', function () {
        const inputs = document.querySelectorAll('.worker-info input');
        inputs.forEach(input => {
            input.setAttribute('readonly', true);
        });
        showEditProfileInfoButton();
        showEditProfileImgButton(); 
        hideActionButtons();
        location.reload();
    });

    function showImageActionButtons() {
        saveImageButton.style.display = 'inline-block';
        cancelImageButton.style.display = 'inline-block';
        saveImageButton.classList.add('image-save');
        cancelImageButton.classList.add('image-cancel');
    }

    function showInfoActionButtons() {
        saveInfoButton.style.display = 'inline-block';
        cancelInfoButton.style.display = 'inline-block';
    }

    function hideActionButtons() {
        saveImageButton.style.display = 'none';
        saveInfoButton.style.display = 'none';
        cancelImageButton.style.display = 'none';
        cancelInfoButton.style.display = 'none';
    }

    function hideEditProfileImgButton() {
        originalEditProfileImgDisplay = editProfileImgButton.style.display;
        editProfileImgButton.style.display = 'none';
    }

    function hideEditProfileInfoButton() {
        originalEditProfileInfoDisplay = editProfileInfoButton.style.display;
        editProfileInfoButton.style.display = 'none';
    }

    function showEditProfileImgButton() {
        if (originalEditProfileImgDisplay !== null) {
            editProfileImgButton.style.display = originalEditProfileImgDisplay;
        } else {
            editProfileImgButton.style.display = 'inline-block';
        }
    }

    function showEditProfileInfoButton() {
        if (originalEditProfileInfoDisplay !== null) {
            editProfileInfoButton.style.display = originalEditProfileInfoDisplay;
        } else {
            editProfileInfoButton.style.display = 'inline-block';
        }
    }
});
