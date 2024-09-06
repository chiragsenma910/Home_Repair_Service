window.onload = function() {
    document.getElementById('loginform').reset(); 
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



document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get('error');
    
    if (errorMessage) {
        alert(errorMessage);
        // Redirect to the login or signup page after dismissing the alert
        const currentPage = window.location.pathname;
        if (currentPage.includes('Admin_89')) {
            window.location.href = '/Admin_89';
        } 
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    if (window.history.replaceState && (window.location.pathname === '/Admin_89')) {
        window.history.replaceState(null, null, window.location.href);
    }
});