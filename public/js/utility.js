document.addEventListener('DOMContentLoaded', function() {
  var listItems = document.querySelectorAll('ul li');

  listItems.forEach(function(item) {
    item.addEventListener('click', function() {
      var url = item.getAttribute('data-url');
      window.location.href = url;
    });
  });

  const loginButton = document.getElementById('loginbtn');

  if (loginButton) { // Check if loginButton exists
    loginButton.addEventListener('click', function() {
      window.location.href = '/login';


    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const profileContainer = document.querySelector('.navbar .profile-container');
  const profilePicture = profileContainer.querySelector('#profile-picture');
  const profileCard = profileContainer.querySelector('.profile-card');

  if (profilePicture && profileCard) { // Check if both profilePicture and profileCard exist
    profilePicture.addEventListener('click', function(event) {
      event.stopPropagation(); // Prevent click event from propagating to the document
      profileCard.classList.toggle('active');
    });

    // Close profile card when clicking outside
    document.addEventListener('click', function(event) {
      if (!profileContainer.contains(event.target)) {
        profileCard.classList.remove('active');
      }
    });

    // Close profile card when clicking anywhere else on the document
    document.addEventListener('click', function() {
      profileCard.classList.remove('active');
    });
  }
});
