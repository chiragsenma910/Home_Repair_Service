window.onload = function() {
    document.getElementById('loginform').reset(); 
    document.getElementById('signup-form').reset(); 
};

document.addEventListener('DOMContentLoaded', function() {
    var inputs = document.querySelectorAll('input');
    inputs.forEach(function(input) {
        input.addEventListener('input', function() {
            if (this.value !== '') {
                this.classList.add('not-empty');
            } else {
                this.classList.remove('not-empty');
            }
        });

        // Trigger initial class check
        if (input.value !== '') {
            input.classList.add('not-empty');
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const eyeIcon = document.getElementById("eye-icon");
    const passwordInput = document.getElementById("password");

    // Function to toggle password visibility
    function togglePasswordVisibility() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.style.backgroundImage = "url('img/lgsp/closeeye.svg')";
        } else {
            passwordInput.type = "password";
            eyeIcon.style.backgroundImage = "url('img/lgsp/openeye.svg')";
        }
    }
    // Event listener for the eye icon
    eyeIcon.addEventListener("click", togglePasswordVisibility);
});

document.addEventListener("DOMContentLoaded", function() {
    const eyeIcon1 = document.getElementById("eye-icon1");
    const eyeIcon2 = document.getElementById("eye-icon2");
    const passwordInput = document.getElementById("password1");
    const confirmPassword = document.getElementById("password2");

    eyeIcon1.addEventListener("click", function() {
        // Toggle the type of the password input between "password" and "text"
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon1.style.backgroundImage = "url('img/lgsp/closeeye.svg')";
        } else {
            passwordInput.type = "password";
            eyeIcon1.style.backgroundImage = "url('img/lgsp/openeye.svg')";
        }
    });
    eyeIcon2.addEventListener("click", function() {
        // Toggle the type of the password input between "password" and "text"
        if (confirmPassword.type === "password") {
            confirmPassword.type = "text";
            eyeIcon2.style.backgroundImage = "url('img/lgsp/closeeye.svg')";
        } else {
            confirmPassword.type = "password";
            eyeIcon2.style.backgroundImage = "url('img/lgsp/openeye.svg')";
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Activate forgot password overlay
    const forgotPasswordLink = document.getElementById('forgot');
    const forgotPasswordOverlay = document.getElementById('forgot-password-overlay');

    // Event listener for the forgot password link
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior

        // Show the forgot password overlay
        forgotPasswordOverlay.classList.add('active');
    });

    // Event listener for the close button in the forgot password overlay
    const closeButton = document.querySelector('.close-btn');
    closeButton.addEventListener('click', function() {
        // Hide the forgot password overlay
        forgotPasswordOverlay.classList.remove('active');
    });
});

// features.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    
    if (errorMessage) {
        alert(errorMessage);
        // Redirect to the login or signup page after dismissing the alert
        const currentPage = window.location.pathname;
        if (currentPage.includes('login')) {
            window.location.href = '/login';
        } else if (currentPage.includes('signup')) {
            window.location.href = '/signup';
        }
    }
});

function toggleProfessionDropdown() {
    var roleDropdown = document.getElementById("role");
    var professionGroup = document.getElementById("profession-group");

    if (roleDropdown.value === "worker") {
      professionGroup.style.display = "block";
    } else {
      professionGroup.style.display = "none";
    }
}


document.addEventListener('DOMContentLoaded', (event) => {
    if (window.history.replaceState && (window.location.pathname === '/login' || window.location.pathname === '/signup')) {
        window.history.replaceState(null, null, window.location.href);
    }
});
