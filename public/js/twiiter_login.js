document.addEventListener("DOMContentLoaded", function () {
 
    var loginForm = document.querySelector('.LoginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        var username = document.querySelector('.js-signin-email').value.trim();
        var password = document.querySelector('input[name="session[password]"]').value.trim();

        if (username === '' || password === '') {
            alert('Please enter both username and password.');
            return;
        }
        var usernameRegex = /^\w{3,}$/; 
        if (!usernameRegex.test(username)) {
            alert('Username must be at least 3 characters long and can only contain letters, numbers, and underscores.');
            return;
        }
    });
});
