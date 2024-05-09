
let userNameField = document.getElementById("userName");
let userPassField = document.getElementById("userPass");
let statusField = document.getElementById("StatusMessage");
let datePicker = document.getElementById("dateInput");
let timePicker = document.getElementById("timeInput");
let dateDiv = document.getElementById("BookingButtonDiv");
let timeDiv = document.getElementById("TimeBookingButtonDiv");
let setMonth = document.getElementById("SelectedMonth");
let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let url = window.location.href;
let adminUser = false;
let ActiveUser = null;
let currentSessionToken = null;
let roleEnum = ["Admin", "User", "Guest"];

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", LoginUser);
DaySetup();

datePicker.addEventListener("change", function () {
    DaySetup();
});

userPassField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        //Login();
        LoginUser();
    }
});
window.onload = function ()
{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('dateInput').value = today; 
    document.getElementById('dateInputBooking').value = today; 
    GetSession();
    createUserDiv();
    findUserDiv();
    editUserDiv();

    let navbar = document.getElementById("navbar");

    if (navbar.style.display === "block" || navbar.style.display === "") {
        navbar.style.display = "none";
    }
}

function GetSession() {
    let currentSessionToken = GetSessionToken();
    //console.log("Token found: " + currentSessionToken);
    if (currentSessionToken != undefined) {
        //console.log(JSON.stringify(currentSessionToken))
        fetch(url + "api/User/ValidateSessionToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(currentSessionToken)
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            ActiveUser = jsonResponse;
            //console.log("Active User: " + ActiveUser)
            if (ActiveUser.userRole === "Admin") {
                adminUser = true;
                AdminMenu();
            }
            generateSession();
        }).catch(error => {
            console.error("No active token found");
        });
    }
}
function generateSession() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    let length = 256;
    for (let i = 0; i < length; i++) {
        // Choose a random character from the charset
        const randomIndex = Math.floor(Math.random() * charset.length);
        token += charset.charAt(randomIndex);
    }
    //console.log("Generated token: " + token);
    ActiveUser.sessionToken = token;
    //console.log("Active user token:  " + ActiveUser.sessionToken)
    SetSessionToken(ActiveUser.sessionToken);
    UpdateUser(ActiveUser);
}
function createUserPropertyForm(form, User) {

    let formId = form.id;

    let UserId = document.createElement("input");
    UserId.type = "text";
    UserId.name = `${formId}UserId`;
    UserId.placeholder = "User Id";
    UserId.readOnly = true;

    let userName = document.createElement("input");
    userName.type = "text";
    userName.name = `${formId}UserName`;
    userName.placeholder = "User Name";
    userName.required = true;

    let userPass = document.createElement("input");
    userPass.type = "password";
    userPass.name = `${formId}UserPass`;
    userPass.placeholder = "Password";
    if (formId === "CreateUserForm") {
        userPass.required = true;
        userPass.readOnly = false;
    } else {
        userPass.readOnly = true;
    }

    let email = document.createElement("input");
    email.type = "email";
    email.name = `${formId}Email`;
    email.placeholder = "Email";
    email.required = true;

    let phoneNumber = document.createElement("input");
    phoneNumber.type = "text"; //replace with tel when needed
    phoneNumber.name = `${formId}PhoneNumber`;
    phoneNumber.placeholder = "Phone Number";
    phoneNumber.required = true;

    let userRole = document.createElement("select");
    userRole.name = `${formId}UserRole`;
    userRole.required = true;
    let option1 = document.createElement("option");
    option1.value = roleEnum[0];
    option1.innerHTML = "Admin";
    let option2 = document.createElement("option");
    option2.value = roleEnum[1];
    option2.innerHTML = "User";
    let option3 = document.createElement("option");
    option3.value = roleEnum[2];
    option3.innerHTML = "Guest";

    userRole.appendChild(option2);
    userRole.appendChild(option3);
    userRole.appendChild(option1);

    form.appendChild(UserId);
    form.appendChild(userName);
    form.appendChild(userPass);
    form.appendChild(email);
    form.appendChild(phoneNumber);
    form.appendChild(userRole);
    console.log("User: " + User)
    if (User != null) {
        console.log("User found: " + User.userName);
        UserId.value = User.userId;
        userName.value = User.userName;
        email.value = User.email;
        phoneNumber.value = User.phoneNumber;
        userRole.selectedIndex = User.userRole;
    }
}
function createUserDiv() {
    let createUser = document.getElementById("CreateUserDiv");

    let form = document.createElement("form");

    let userName = document.createElement("input");
    userName.type = "text";
    userName.name = "userName";
    userName.placeholder = "User Name";
    userName.required = true;

    let userPass = document.createElement("input");
    userPass.type = "password";
    userPass.name = "userPass";
    userPass.placeholder = "Password";
    userPass.required = true;

    let email = document.createElement("input");
    email.type = "email";
    email.name = "email";
    email.placeholder = "Email";
    email.required = true;

    let phoneNumber = document.createElement("input");
    phoneNumber.type = "tel";
    phoneNumber.name = "phoneNumber";
    phoneNumber.placeholder = "Phone Number";
    phoneNumber.required = true;

    let roleEnum = ["Admin", "User", "Guest"];
    let userRole = document.createElement("select");


    let option1 = document.createElement("option");
    option1.value = "Admin";
    option1.innerHTML = "Admin";
    let option2 = document.createElement("option");
    option2.value = "User";
    option2.innerHTML = "User";
    let option3 = document.createElement("option");
    option3.value = "Guest";
    option3.innerHTML = "Guest";

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Submit";

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        let formData = {
            userName: userName.value,
            userPass: userPass.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            userRole: roleEnum[userRole.selectedIndex]
        };
        let jsonData = JSON.stringify(formData);
        //console.log(jsonData);
        fetch(url + "api/User/AddUserAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData
        })
            .then(response => {
                console.log(response.status)
            })
    });

    userRole.appendChild(option2);
    userRole.appendChild(option3);
    userRole.appendChild(option1);

    form.appendChild(userName);
    form.appendChild(userPass);
    form.appendChild(email);
    form.appendChild(phoneNumber);
    form.appendChild(userRole);
    form.appendChild(submit);

    createUser.appendChild(form);
}
function findUserDiv() {
    let findUser = document.getElementById("UserListDiv");
    let searchForm = document.createElement("form");
    searchForm.id = "SearchUserForm";
    createUserPropertyForm(searchForm);

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Search";
    searchForm.appendChild(submit);

    findUser.appendChild(searchForm);

    let selectUser = document.createElement("select");
    let noOption = document.createElement("option");
    noOption.textContent = "No user found"
    noOption.value = null;
    findUser.appendChild(selectUser);

    let inputElements = searchForm.getElementsByTagName("input");
    submit.addEventListener("click", function (event) {
        event.preventDefault();
        selectUser.innerHTML = "";
        let data = []
        for (let i = 0; i < inputElements.length; i++) {
            data.push(inputElements[i].value);
        }
        let jsonData = JSON.stringify(data);
        //console.log(data);

        fetch(url + "api/User/FindUser", {
            method: "Post",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Users not found");
                }
            })
            .then(users => {
                //console.log(users);
                users.forEach(user => {
                    let option = document.createElement("option");
                    //console.log(user.userName + " with id: " + user.userId)
                    option.value = user.userId;
                    option.textContent = user.userName;
                    selectUser.appendChild(option);
                })
            })
            .catch(error => {
                console.log(error);
            })
    });
    selectUser.addEventListener("change", function (event) {
        let id = selectUser.value;
        if (id != null) {
            SelectedUser(id);
        }
    })
}

function editUserDiv() {
    let editUser = document.getElementById("EditUserDiv");
    let form = document.createElement("form");
    form.id = "EditUserForm";
    createUserPropertyForm(form);


    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Edit";
    submit.addEventListener("click", function (event) {
        event.preventDefault();
        let id = form.querySelector("#EditUserFormUserId").value;
        let name = form.querySelector("#EditUserFormUserName").value;
        let email = form.querySelector("#EditUserFormEmail").value;
        let phoneNumber = form.querySelector("#EditUserFormPhoneNumber").value;
        let role = form.querySelector("#EditUserFormUserRole").value;

        let data = [];

    })

    form.appendChild(submit);
    editUser.appendChild(form);
}

function GetUserById(id) {
    fetch(url + `api/User/GetUser/${id}`, {
        method: "Get",
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .catch(error => {
            console.log(error);
        })
}

function SelectedUser(id) {

    let form = document.getElementById("EditUserForm");
    //console.log("this is the id: " + id);
    fetch(url + `api/User/GetUser/${id}`, {
        method: "Get",
        headers: {
            "Token": GetSessionToken()
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Something went wrong");
            }
        })
        .then(User => {
            console.log(User.userName);
            form.innerHTML = "";
            createUserPropertyForm(form, User);
        })
        .catch(error => {
            console.log(error);
        })
}
function LoginUser() {
    if (ActiveUser != null) {

    }
    let data = [userNameField.value, userPassField.value];
    fetch(url + "api/User/LoginUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                let jsonResponse = response.json();
                //console.log(jsonResponse);
                console.log("Network response was ok");
                return jsonResponse;
            }
            else {
                //console.log("Network response was not ok");
                statusField.innerHTML = "Invalid username or password";
                throw new Error("Network response was not ok");
            }
        })
        .then(jsonResponse => {
            ActiveUser = jsonResponse;
            console.log("Active User: " + ActiveUser)
            //console.log("JSON: " + jsonResponse);
            if (jsonResponse.userRole === "Admin") {
                adminUser = true;
                AdminMenu();
            }
            generateSession();
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation:", error);
        })
}
function UpdateUser(User) {
    fetch(url + "api/User/UpdateUser", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(User)
    })
        .then(response => {
            if (response.ok) {
                console.log("User updated");
            }
            else {
                console.log("User not updated");
            }
        })
}

function AdminMenu() {
    if (adminUser)
    {
        let navbar = document.getElementById("navbar");

        if (navbar.style.display === "none" || navbar.style.display === "")
        {
            navbar.style.display = "block";
        }


        let loginDiv = document.getElementById("LoginDiv");
        let welcome = document.getElementById("WelcomeText");
        let bookingDiv = document.getElementById("BookingDiv");
        let userDiv = document.getElementById("UserDiv");

        loginDiv.style.visibility = "hidden";
        bookingDiv.style.visibility = "visible";
        userDiv.style.visibility = "visible";

        welcome.innerHTML = `Welcome ${ActiveUser.userName}`;
    }
}

function DaySetup() {
    dateDiv.innerHTML = "";
    for (let day = 0; day < 7; day++) {
        let label = document.createElement("label");
        label.innerHTML = daysOfWeek[day];
        label.style.gridColumn = `${day + 1}`;
        label.style.gridRow = "1";
        dateDiv.appendChild(label);
    }

    let currentDate = GetDate(datePicker.value);
    if (isNaN(currentDate)) {
        currentDate = new Date();
    }
    console.log(currentDate);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let numberOfDays = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).toLocaleString('default', { weekday: 'long' });
    let firstcol = daysOfWeek.indexOf(firstDay);
    console.log("tot:" + numberOfDays, "first:" + firstDay, "index:" + firstcol);
    setMonth.innerHTML = new Date(year, month, day).toLocaleString('default', { month: 'long' });
    for (let i = 0; i < numberOfDays; i++) {
        let button = document.createElement("button");
        button.innerHTML = i + 1;
        let col = (firstcol + i) % 7;
        button.style.gridColumn = `${col + 1}`;
        let row = Math.floor((firstcol + i) / 7) + 2;
        button.style.gridRow = `${row}`;
        button.style.backgroundColor = "red";
        dateDiv.appendChild(button);
    }
    TimeSetup(6 * 60, 21 * 60, 15);
}

function TimeSetup(startTime = 6 * 60, stopTime = 21 * 60, interval = 60) {
    timeDiv.innerHTML = "";
    let TimeSelect = document.createElement("select")
    for (let i = startTime; i < stopTime; i += interval) {
        let option = document.createElement("option");
        option.innerHTML = formatTime(i);
        option.style.backgroundColor = "red";
        option.style.margin = "5px";
        TimeSelect.appendChild(option);
    }
    timeDiv.appendChild(TimeSelect);
}

function GetDate(dateHTML) {
    let dateValue = dateHTML;
    let dateJS = new Date(dateValue);
    //let year = date.getFullYear();
    //let month = date.getMonth() + 1;
    //let day = date.getDate();
    //console.log(year, month, day);
    //return [year, month, day];
    return dateJS;
}

function SetDate(_date) {
    let date = new Date(_date.value);
    date.setDate();
    let firstDayInt = date.getDay();
    let firstDayString = date.toLocaleString('default', { weekday: 'long' });
    console.log(firstDayInt, firstDayString);
}


function formatTime(minutes) {
    // Convert minutes to hours and minutes
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    // Format hours and minutes with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');

    // Combine hours and minutes
    return `${formattedHours}:${formattedMins}`;
}

function SetSessionToken(token) {
    //console.log(token);
    let jsonToken = JSON.stringify(token);
    sessionStorage.setItem("sessionToken", jsonToken);
}

function GetSessionToken() {
    let token = sessionStorage.getItem("sessionToken");
    return token;
}



function User(userName, email, phoneNumber) {
    this.userName
    this.email
    this.phoneNumber
}

function Booking(User, PartySize, BookingDate) {
    this.User = User;
    this.PartySize = PartySize;
    this.Date = BookingDate;
}

//////////////ADMIN THINGS///////////////////////

document.addEventListener('DOMContentLoaded', function ()
{
    const form = document.getElementById("searchBookingForm");

    form.addEventListener('submit', function (event)
    {
        event.preventDefault(); // Prevent the default form submission behavior

        //let formData =
        //{
        //    bookingId: document.getElementById("bookingid").value,
        //    bookingUserId: document.getElementById("userid").value,
        //    bookingDate: document.getElementById("dateInputBooking").value
        //};
        let Newarray =
             [document.getElementById("bookingid").value,
            document.getElementById("userid").value,
            document.getElementById("dateInputBooking").value];

        let jsonData = JSON.stringify(Newarray);
        console.log(Newarray);
        fetch(url + "api/Booking/GiveAdminBookings",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json" 
                },
                body: jsonData // Send JSON data in the request body
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else
                {
                    console.log("Error in response.")
                    throw new Error("Error fetching bookings");
                }
            })
            .then(bookings =>
            {
                if (bookings.length > 0)
                {
                    console.log("we are inside of builder shit");
                    bookings.forEach(booking => {
                        let createdDiv = document.createElement("div");
                        console.log(bookings);
                        let createdP = document.createElement("p");
                        createdP.textContent = booking.bookingId;

                        let createdPUserId = document.createElement("p");
                        createdPUserId.textContent = booking.bookedUserId;

                        let createdPPartySize = document.createElement("p");
                        createdPPartySize.textContent = booking.partySize;

                        let createdPDate = document.createElement("p");
                        createdPDate.textContent = booking.bookingDate;

                        createdDiv.appendChild(createdP);
                        createdDiv.appendChild(createdPUserId);
                        createdDiv.appendChild(createdPPartySize);
                        createdDiv.appendChild(createdPDate);
                        document.body.appendChild(createdDiv);
                    });
                }
                else
                {
                    let alert = document.createElement("div");
                    alert.classList.add("alert", "alert-warning", "mt-3");

                    let message = document.createElement("span");
                    message.textContent = "There are no bookings with the given information.";
                    message.classList.add("text-danger"); // Apply the Bootstrap class to make the text red

                    alert.appendChild(message);

                    // Append the alert to the container or any desired location in the DOM
                    let container = document.querySelector(".bookingDiv");
                    container.appendChild(alert);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});