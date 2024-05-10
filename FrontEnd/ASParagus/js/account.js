// Check session on page load to maintain user state
document.addEventListener('DOMContentLoaded', () => {
    const buttonsElement = document.getElementById('buttons');
    const bookingOptionsElement = document.getElementById('booking-options');
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        showUserOptions(user);
    } else {
        // Ensure the element exists before trying to change its style
        if (buttonsElement) {
            buttonsElement.style.display = 'block';
        }
        if (bookingOptionsElement) {
            bookingOptionsElement.style.display = 'none';
        }
    }
});


function showSignUp() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('update-user-form').style.display = 'none';
}


function showLogIn() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('update-user-form').style.display = 'none';
}

// Hide the forms when user is not logged in
function hideForms() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('update-user-form').style.display = 'none';
}

// Register a new user
function registerUser(event) {
    event.preventDefault();
    const form = document.getElementById('signup-form');
    const userData = {
        userName: form.querySelector('#userName').value,
        userPass: form.querySelector('#userPass').value,
        email: form.querySelector('#email').value,
        phoneNumber: form.querySelector('#phoneNumber').value,
        userRole: form.querySelector('#userRole').value
    };

    fetch('https://localhost:7154/api/User/AddUserAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (response.status !== 200) {
            return response.json().then(err => { throw new Error(err.message || 'Failed to create user') });
        }
        return response.json();
    })
    .then(data => {
        alert('User created successfully!');
        form.reset();
        hideForms();
    })
    .catch(error => {
        console.error('Error creating user:', error);
        alert('Error creating user: ' + error.message);
    });
}

// Log in a user and update the UI
function loginUser(event) {
    event.preventDefault();
    const userName = document.getElementById('loginUserName').value;
    const password = document.getElementById('loginPassword').value;
    const loginInfo = [userName, password];

    fetch('https://localhost:7154/api/User/LoginUser', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to login: Invalid username or password');
        }
        return response.json();
    })
    .then(user => {
        if (user && user.userId) {
            console.log("Logged in user:", user);  // Debug: Check logged-in user details
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            hideForms();
            showUserOptions(user);
        } else {
            console.error("Login response missing user ID:", user);
            throw new Error("User ID is missing in the login response.");
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    });
}

// Logout stuff
function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    alert('You have been logged out.');

    const buttonsElement = document.getElementById('buttons');
    if (buttonsElement) {
        buttonsElement.style.display = 'block';
    }

    const bookingOptionsElement = document.getElementById('booking-options');
    if (bookingOptionsElement) {
        bookingOptionsElement.style.display = 'none';
    }

    window.location.href = 'index.html';
}


// Display user-specific options after login
function showUserOptions(user) {
    const userOptionsDiv = document.createElement('div');
    userOptionsDiv.id = 'user-options';
    userOptionsDiv.innerHTML = `
        <h2>Welcome, ${user.userName}!</h2>
        <button onclick="showChangeUserDetailsForm()">Change Details</button>
        <button onclick="deleteUserAccount()">Delete Account</button>
        <button onclick="logoutUser()">Log Out</button>
    `;
    document.getElementById('account-container').appendChild(userOptionsDiv);

    const buttonsElement = document.getElementById('buttons');
    if (buttonsElement) {
        buttonsElement.style.display = 'none';
    }

    const bookingOptionsElement = document.getElementById('booking-options');
    if (bookingOptionsElement) {
        bookingOptionsElement.style.display = 'block';
    }
}


// Show the form to update user details
function showChangeUserDetailsForm() {
    const form = document.getElementById('update-user-form');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    form.querySelector('#updateUserName').value = loggedInUser.userName || '';
    form.querySelector('#updateEmail').value = loggedInUser.email || '';
    form.querySelector('#updatePhoneNumber').value = loggedInUser.phoneNumber || '';
    form.style.display = 'block';
}

// Update user details
function updateUserDetails(event) {
    event.preventDefault();
    const form = document.getElementById('update-user-form');
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    const updatedData = {
        userId: loggedInUser.userId,  // Ensure userId is part of the object
        userName: form.querySelector('#updateUserName').value,
        userPass: form.querySelector('#updateUserPass').value,
        email: form.querySelector('#updateEmail').value,
        phoneNumber: form.querySelector('#updatePhoneNumber').value,
        userRole: loggedInUser.userRole, // Include userRole if it's needed or set by default
    };

    // Check if logged-in user has a valid userId
    if (!loggedInUser || !loggedInUser.userId) {
        console.error('Error updating user: Missing user ID.');
        alert('Cannot update user: Missing user ID.');
        return;
    }

    // Update user details with the complete user object
    fetch('https://localhost:7154/api/User/UpdateUser', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Failed to update user, response status:", response.status);
            throw new Error('Failed to update user');
        }
        return response.json();
    })
    .then(updatedUser => {
        alert('User details updated successfully!');
        form.reset();
        hideForms();
        // Update session storage with the new user details
        sessionStorage.setItem('loggedInUser', JSON.stringify({...loggedInUser, ...updatedData}));
        showUserOptions({...loggedInUser, ...updatedData});
    })
    .catch(error => {
        console.error('Error updating user:', error);
        alert('Error updating user: ' + error.message);
    });
}

// Delete a user account
function deleteUserAccount() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.userId) {
        console.error("Attempt to delete user failed: User is not logged in or missing user ID.");
        alert("User is not logged in or missing user ID.");
        return;
    }
    console.log("Attempting to delete user with ID:", loggedInUser.userId); // Debug: Check user ID before deletion
    fetch(`https://localhost:7154/api/User/DeleteUser/${loggedInUser.userId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("User successfully deleted.");
            alert('User account deleted.');
            sessionStorage.removeItem('loggedInUser');
            window.location.reload();
        } else {
            console.error("Failed to delete user, response status:", response.status);
            throw new Error('Failed to delete user');
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + error.message);
    });
}


function fetchUserBookings() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        fetch(`https://localhost:7154/api/Booking/GetUserBookings/${loggedInUser.userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(bookings => {
            const bookingsList = document.getElementById('bookings-list');
            bookingsList.innerHTML = ''; // Clear previous bookings

            bookings.forEach(booking => {
                const li = document.createElement('li');
                li.textContent = `Booking on ${booking.bookingDate} for ${booking.partySize} guests`;
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = () => deleteBooking(booking.bookingId);
                li.appendChild(deleteBtn);
                bookingsList.appendChild(li);
            });
        })
        .catch(error => console.error('Failed to fetch bookings:', error));
    }
}

function deleteBooking(bookingId) {
    fetch(`https://localhost:7154/api/Booking/DeleteBooking/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Booking deleted successfully!');
            fetchUserBookings(); // Refresh the list of bookings
        } else {
            alert('Failed to delete booking.');
        }
    })
    .catch(error => console.error('Error deleting booking:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUserBookings(); // Load user bookings when the page loads
});
