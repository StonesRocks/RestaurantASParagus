// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


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
window.onload = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('dateInput').value = today;
    createUserDiv();
    GetSession();
    findUserDiv();
}

function GetSession() {
    let currentSessionToken = GetSessionToken();
    console.log("Token found: " + currentSessionToken);
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
            console.log("Active User: " + ActiveUser)
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
    console.log("Generated token: " + token);
    ActiveUser.sessionToken = token;
    console.log("Active user token:  " + ActiveUser.sessionToken)
    SetSessionToken(ActiveUser.sessionToken);
    UpdateUser(ActiveUser);
}

function createUserDiv() {
    let createDiv = document.getElementById("CreateUserDiv");

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

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let formData = {
            userName: userName.value,
            userPass: userPass.value,
            email: email.value,
            phoneNumber: phoneNumber.value,
            userRole: roleEnum[userRole.selectedIndex]
        };
        let jsonData = JSON.stringify(formData);
        console.log(jsonData);
        fetch(url + "api/User/AddUserAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData
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

    createDiv.appendChild(form);
}
function findUserDiv() {
    let findUser = document.getElementById("UserListDiv");

    let searchName = document.createElement("input");
    searchName.type = "text";
    searchName.name = "searchName";
    searchName.placeholder = "Name";
    let searchPhone = document.createElement("input");
    searchPhone.type = "tel";
    searchPhone.name = "searchPhone";
    searchPhone.placeholder = "Phone"
    let searchEmail = document.createElement("input");
    searchEmail.type = "email";
    searchEmail.name = "searchEmail";
    searchEmail.placeholder = "Email";
    findUser.appendChild(searchName);
    findUser.appendChild(searchPhone);
    findUser.appendChild(searchEmail);

    let submit = document.createElement("input");
    submit.type = "submit";
    submit.value = "Submit";
    findUser.appendChild(submit);

    let selectUser = document.createElement("select");
    findUser.appendChild(selectUser);

    submit.addEventListener("click", function (event) {
        event.preventDefault();
        selectUser.innerHTML = "";
        let data = [searchName.value, searchPhone.value, searchEmail.value]
        let jsonData = JSON.stringify(data);
        console.log(data);

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
            })
            .then(users => {
                users.forEach(user => {
                    let option = document.createElement("option");
                    option.value = user.UserId;
                    option.textContent = user.userName;
                    selectUser.appendChild(option);
                })
            })
    });

    
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
            console.log(jsonResponse);
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
            console.log("JSON: " + jsonResponse);
            if (jsonResponse.userRole === "Admin") {
                adminUser = true;
                AdminMenu();
            }
            generateSession();
        })
    .catch (error => {
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
    if (adminUser) {
        let loginDiv = document.getElementById("LoginDiv");
        let welcome = document.getElementById("WelcomeText");
        let bookingDiv = document.getElementById("BookingDiv");
        let menuDiv = document.getElementById("MenuDiv");
        let userDiv = document.getElementById("UserDiv");

        loginDiv.style.visibility = "hidden";
        bookingDiv.style.visibility = "visible";
        menuDiv.style.visibility = "visible";
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
    setMonth.innerHTML = new Date(year, month, day).toLocaleString('default', { month: 'long'});
    for (let i = 0; i < numberOfDays; i++) {
        let button = document.createElement("button");
        button.innerHTML = i + 1;
        let col = (firstcol + i) % 7;
        button.style.gridColumn = `${col+1}`;
        let row = Math.floor((firstcol + i) / 7) + 2;
        button.style.gridRow = `${row}`;
        button.style.backgroundColor = "red";
        dateDiv.appendChild(button);
    }
    TimeSetup(6*60, 21*60, 15);
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
    console.log(token);
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