// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


let userNameField = document.getElementById("userName");
let userPassField = document.getElementById("userPass");
let datePicker = document.getElementById("dateInput");
let timePicker = document.getElementById("timeInput");
let dateDiv = document.getElementById("BookingButtonDiv");
let timeDiv = document.getElementById("TimeBookingButtonDiv");
let setMonth = document.getElementById("SelectedMonth");
let daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
let url = window.location.href;
let adminUser = false;

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", Login);
DaySetup();
datePicker.addEventListener("change", function () {
    DaySetup();
});

userPassField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        Login();
    }
});
window.onload = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById('dateInput').value = today;
};
function Login() {
    let userName = userNameField.value;
    let userPass = userPassField.value;
    if (userName === "" || userPass === "") {
        alert("Please enter a username and password");
        return;
    }
    console.log(
        JSON.stringify([userName, userPass])
    );
    let apiURL = url + "api/User/LoginUser";
    fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            [userName, userPass]
        ),
    })
        .then((response) => {
            console.log("status code:" + response.status);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            else if (response.ok) {
                adminUser = true;
                console.log("Admin activated");
                AdminMenu();
            }
        });
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

        welcome.innerHTML = 'Welcome ${test}';
        
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


