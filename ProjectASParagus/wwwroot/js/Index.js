
let userNameField = document.getElementById("userName");
let userPassField = document.getElementById("userPass");
let statusField = document.getElementById("StatusMessage");
let datePicker = document.getElementById("dateInput");
let timePicker = document.getElementById("timeInput");
let dateDiv = document.getElementById("BookingButtonDiv");
let timeDiv = document.getElementById("TimeBookingButtonDiv");
let setMonth = document.getElementById("SelectedMonth");
let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let BookingDictionary = {};
let MaxOccupancyPerTimeStamp = 100;
let VisitDuration = 2 * 60;
let DurationPrecision = 15;
let StartingTime = 6 * 60;
let EndingTime = 21 * 60;
let MaxOccupancyPerDay = (EndingTime - StartingTime) / 15 * MaxOccupancyPerTimeStamp;

let url = window.location.href;
let adminUser = false;
let ActiveUser = null;
let EditUser = null;
let currentSessionToken = null;
let roleEnum = ["Admin", "User", "Guest"];

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", LoginUser);
DaySetup();

datePicker.addEventListener("change", function () {
    DaySetup();
    UpdateOccupancy();
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
    UpdateOccupancy();

    let navbar = document.getElementById("navbar");
    if (!adminUser) {
        navbar.style.visibility = "hidden";
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

    userRole.appendChild(option1);
    userRole.appendChild(option2);
    userRole.appendChild(option3);

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
                let option = document.createElement("option");
                option.textContent = "Select User";
                option.value = null;
                selectUser.appendChild(option);
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
    let submitEdit = document.getElementById("EditUserButton");



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
            EditUser = User;
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
            console.log("Active User Role: " + ActiveUser.userRole)
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

        let loginDiv = document.getElementById("LoginDiv");
        let welcome = document.getElementById("WelcomeText");
        let bookingDiv = document.getElementById("BookingDiv");
        let userDiv = document.getElementById("UserDiv");
        let searchbookingdiv = document.getElementById("searchBookingForm");
        let navbar = document.getElementById("navbar");

        loginDiv.style.visibility = "hidden";
        searchbookingdiv.style.visibility = "visible";
        bookingDiv.style.visibility = "visible";
        userDiv.style.visibility = "visible";
        navbar.style.visibility = "visible";

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
        button.id = "Day" + (i + 1);
        button.value = 0;
        button.innerHTML = i + 1;
        let col = (firstcol + i) % 7;
        button.style.gridColumn = `${col + 1}`;
        let row = Math.floor((firstcol + i) / 7) + 2;
        button.style.gridRow = `${row}`;
        button.style.backgroundColor = "rgb(0, 255, 0)";
        dateDiv.appendChild(button);
    }
    TimeSetup(6 * 60, 21 * 60, 15);
}

function UpdateOccupancy() {
    ShowOccupancy()
        .then(data => {
            //console.log(data);
            let groupedData = ConvertApiResponseToJsDict(data);
            //console.log(groupedData);
            let currentDate = GetDate(datePicker.value);
            let month = currentDate.getMonth();

            BookingDictionary = {};

            Object.keys(groupedData).forEach(key => {
                let dateKey = new Date(key);
                let day = dateKey.getDate();

                // Ensure that timeDictperDay is initialized for every day
                if (BookingDictionary[day] === undefined) {
                    BookingDictionary[day] = {};
                }

                let time = dateKey.getHours() * 60 + dateKey.getMinutes();
                if (BookingDictionary[day][time] === undefined) {
                    BookingDictionary[day][time] = groupedData[key];
                } else {
                    BookingDictionary[day][time] += groupedData[key];
                }
            });

            //console.log(BookingDictionary);

            let redFactorForDay = 255 / MaxOccupancyPerDay;
            let redFactorForTime = 255 / MaxOccupancyPerTimeStamp;
            for (let day in BookingDictionary) {
                let totalDailyOccupancy = 0;
                for (let time in BookingDictionary[day]) {
                    let occupancy = BookingDictionary[day][time];
                    totalDailyOccupancy += occupancy;
                    //let button = document.getElementById("Day" + day);
                    let red = Math.floor(redFactorForTime * occupancy);
                    let green = 255 - red;
                }
                let button = document.getElementById("Day" + day);
                let red = Math.floor(redFactorForDay * totalDailyOccupancy);
                let green = 255 - red;
                button.style.backgroundColor = `rgb(${red}, ${green}, 0)`;
            }
            let day = GetDate(datePicker.value).getDate();
            if (BookingDictionary[day] !== undefined) {
                let timeOptions = timeDiv.getElementsByTagName("option");
                Array.from(timeOptions).forEach(option => { // Convert timeOptions to an array
                    if (BookingDictionary[day][option.id] !== undefined) {
                        let occupancy = BookingDictionary[day][option.id];
                        let red = Math.floor(redFactorForTime * occupancy);
                        let green = 255 - red;
                        option.style.backgroundColor = `rgb(${red}, ${green}, 0)`
                    };
                });
            }
        });
}


async function ShowOccupancy() {
    let currentDate = GetDate(datePicker.value);
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;

    try {
        const response = await fetch(url + "api/Booking/GetOccupancy/" + year + "/" + month, {
            method: "GET"
        });

        if (response.ok) {
            const jsonData = await response.json();
            // Convert the JSON object to a dictionary
            const occupancyDictionary = {};

            for (const key in jsonData) {
                occupancyDictionary[key] = jsonData[key];
            }
            //console.log(occupancyDictionary);
            return occupancyDictionary;
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}


function ConvertApiResponseToJsDict(data) {
    //console.log(data);
    let groupedData = {};
    for (const timestamp in data) {
        const date = new Date(timestamp);
        const day = date
        if (!groupedData[day]) {
            groupedData[day] = data[timestamp];
        }
        //groupedData[day].push(data[timestamp]);
    }
    return groupedData;
}

function TimeSetup(startTime = 6 * 60, stopTime = 21 * 60, interval = 60) {
    let TimeSelect;
    if (document.getElementById("TimeSelect") === null) {
        TimeSelect = document.createElement("select");
        TimeSelect.id = "TimeSelect";
    }
    else {
        TimeSelect = document.getElementById("TimeSelect");
        TimeSelect.innerHTML = "";
    }
    let date = GetDate(datePicker.value);
    let day = date.getDate();
    for (let i = startTime; i < stopTime; i += interval) {
        let option = document.createElement("option");
        option.innerHTML = formatTime(i);
        option.id = i;
        option.style.backgroundColor = "rgb(0, 255, 0)";
        option.style.margin = "5px";
        TimeSelect.appendChild(option);
    }
    timeDiv.appendChild(TimeSelect);
}

function GetDate(dateHTML) {
    let dateValue = dateHTML;
    let dateJS = new Date(dateValue);
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
                if (bookings.length > 0) {
                    console.log("we are inside of builder shit");
                    bookings.forEach(booking => {

                        let containerDiv = document.createElement("div");
                        containerDiv.classList.add("container");

                        let rowDiv = document.createElement("div");
                        rowDiv.classList.add("row", "justify-content-center", "mt-5");

                        let colDiv = document.createElement("div");
                        colDiv.classList.add("col-lg-8"); 

                        let textCenterDiv = document.createElement("div");
                        textCenterDiv.classList.add("text-center", "bookingDiv");


                        let bookingDetailsDiv = document.createElement("div");
                        bookingDetailsDiv.classList.add("DivBorder", "row");
                        bookingDetailsDiv.style.border = "5px solid green";


                        let bookingIdCol = document.createElement("div");
                        bookingIdCol.classList.add("col", "m-2");

                        let bookingIdInput = document.createElement("p");
                        bookingIdInput.textContent = "Booking ID: " + booking.bookingId;

                        let userIdCol = document.createElement("div");
                        userIdCol.classList.add("col", "m-2");

                        let userIdInput = document.createElement("p");
                        userIdInput.textContent = "Booked User ID: " + booking.bookedUserId;

                        let partySizeCol = document.createElement("div");
                        partySizeCol.classList.add("col", "m-2");

                        let partySizeInput = document.createElement("p");
                        partySizeInput.textContent = "Party Size: " + booking.partySize;

                        let bookingDateCol = document.createElement("div");
                        bookingDateCol.classList.add("col", "m-2");

                        let bookingDateInput = document.createElement("p");
                        bookingDateInput.textContent = "Booking Date: " + booking.bookingDate;

                        bookingIdCol.appendChild(bookingIdInput);
                        userIdCol.appendChild(userIdInput);
                        partySizeCol.appendChild(partySizeInput);
                        bookingDateCol.appendChild(bookingDateInput);

                        bookingDetailsDiv.appendChild(bookingIdCol);
                        bookingDetailsDiv.appendChild(userIdCol);
                        bookingDetailsDiv.appendChild(partySizeCol);
                        bookingDetailsDiv.appendChild(bookingDateCol);

                        textCenterDiv.appendChild(bookingDetailsDiv);
                        colDiv.appendChild(textCenterDiv);
                        rowDiv.appendChild(colDiv);
                        containerDiv.appendChild(rowDiv);

                        let MenuForm = document.getElementById("searchBookingForm");
                        MenuForm.appendChild(containerDiv)
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


    const SubmitUserEdit = document.getElementById("EditUserButton");
    SubmitUserEdit.addEventListener('click', function (event) {
        let User = EditUser;
        let form = document.getElementById("EditUserForm");
        let inputElements = form.getElementsByTagName("input");
        let data = [];
        for (let i = 0; i < inputElements.length; i++) {
            data.push(inputElements[i].value);
        }
        User.userName = data[1];
        User.email = data[3];
        User.phoneNumber = data[4];
        User.userRole = data[5];
        UpdateUser(User);
    })
});