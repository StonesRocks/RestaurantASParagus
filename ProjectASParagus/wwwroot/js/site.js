// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.


let userNameField = document.getElementById("userName");
let userPassField = document.getElementById("userPass");
let url = window.location.href;
let adminUser = false;

console.log(url);

let loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", Login);

userPassField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        Login();
    }
});

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
        loginDiv.style.display = "none";
        welcome.innerHTML = "Welcome Admin";
    }
}

