function showSignUp() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

function showLogIn() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function hideForms() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
}



function registerUser(event) {
    event.preventDefault();  // Prevent the default form submission.

    const form = document.getElementById('signup-form');
    const userData = {
        userName: form.querySelector('#userName').value,
        userPass: form.querySelector('#userPass').value,
        email: form.querySelector('#email').value,
        phoneNumber: form.querySelector('#phoneNumber').value,
        userRole: form.querySelector('#userRole').value
    };

    console.log(JSON.stringify(userData));
    fetch('https://localhost:7154/api/User/AddUserAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        console.log(response.status); // Log the response status
        console.log(response.json);
        if (response.status !== 200) {
            return response.json().then(err => { throw new Error(err.message || 'Failed to create user') });
        }
        return response.json();
    })
    .then(data => {
        console.log('User created successfully', data);
        alert('User created successfully!');
        form.reset();  // Reset form after successful registration
        hideForms();  // Hide the form
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    });
}



function loginUser(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const userName = document.getElementById('loginUserName').value;
    const password = document.getElementById('loginPassword').value;
    const url = 'https://localhost:7154/api/User/LoginUser';

/* 
        const loginInfo = { 
            username: userName, 
            password: password 
        };
*/

    // Create an array instead of an object directly with userName and password
    const loginInfo = [userName, password];

    fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo) // Send the array as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to login: Invalid username or password');
        }
        return response.json();
    })
    .then(user => {
        console.log('Login successful:', user);
        // Perform actions based on successful login here
        // Example: Redirect to a profile page or update user state
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    });
}
