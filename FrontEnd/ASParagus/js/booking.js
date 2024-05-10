let url = window.location.href;
let selectedDate = null;

document.addEventListener('DOMContentLoaded', function() {
    const months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
    let currentDate = new Date();
    const today = new Date();  // Today's date for comparison

    // Update the calendar based on the current date
    function updateCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const monthDays = lastDay.getDate();
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        // Clear existing calendar cells
        for (let i = 1; i <= 42; i++) {
            const cell = document.getElementById(`xy${i}`);
            cell.innerText = '';
            cell.className = 'date-cell';  // Reset class to only date-cell
            cell.onclick = null;  // Remove previous event listeners
        }

        // Set the month and year in the calendar header
        document.getElementById('headTable').innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        // Fill dates from the previous month in the calendar
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = firstDayOfWeek; i > 0; i--) {
            const cell = document.getElementById(`xy${firstDayOfWeek - i + 1}`);
            cell.innerText = prevMonthLastDay - i + 1;
            cell.className += ' non-current-month';
        }

        // Fill dates of the current month in the calendar
        for (let i = 0; i < monthDays; i++) {
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
            const cell = document.getElementById(`xy${i + firstDayOfWeek + 1}`);
            cell.innerText = i + 1;

            // Highlight if it is the current day
            if (cellDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
                cell.className += ' current-day';
            }

            // Add click event listener to each day cell
            cell.onclick = function() { selectDate(cell); };
        }

        // Fill dates from the next month in the calendar
        const numCellsFilled = firstDayOfWeek + monthDays;
        for (let i = 0; i < (42 - numCellsFilled); i++) {
            const cell = document.getElementById(`xy${numCellsFilled + i + 1}`);
            cell.innerText = i + 1;
            cell.className += ' non-current-month';
        }
    }

    // Function to select a date from the calendar
    function selectDate(cell) {
        // Deselect all other cells
        for (let i = 1; i <= 42; i++) {
            document.getElementById(`xy${i}`).classList.remove('selected-date');
        }

        // Select this cell
        cell.classList.add('selected-date');

        // Update the selectedDate variable with the complete date (YYYY-MM-DD)
        selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${cell.innerText.padStart(2, '0')}`;
        console.log('Selected Date:', selectedDate);

        // Fetch availability for the selected date
        fetchAvailability(selectedDate);
    }

    // Function to fetch and display availability
    function fetchAvailability(date) {
        fetch(`https://localhost:7154/api/Booking/GetAvailability/${date}`)
            .then(response => response.json())
            .then(availableSeats => {
                updateAvailabilityBox(availableSeats);
            })
            .catch(error => {
                console.error('Error fetching availability:', error);
                document.getElementById('availabilityBox').innerText = 'Error fetching availability';
            });
    }

    // Function to update the availability box based on available seats
    function updateAvailabilityBox(availableSeats) {
        const box = document.getElementById('availabilityBox');
        box.innerText = `Available Seats: ${availableSeats}`;
        if (availableSeats > 50) {
            box.style.backgroundColor = 'green';
        } else if (availableSeats > 20) {
            box.style.backgroundColor = 'yellow';
        } else {
            box.style.backgroundColor = 'red';
        }
    }

    // Function to move to the previous month in the calendar
    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    }

    // Function to move to the next month in the calendar
    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    }

    // Function to reset to the current month in the calendar
    function currentMonth() {
        currentDate = new Date();
        updateCalendar();
    }

    // Assigning functions to global window object for navigation
    window.vorige = prevMonth;
    window.volgende = nextMonth;
    window.nu = currentMonth;

    // Initialize the calendar view
    updateCalendar();

    // Hide or show booking options based on login status
    const bookingOptions = document.getElementById('booking-options');
    const loginPrompt = document.getElementById('login-prompt');  // Ensure this element exists in your HTML

    if (sessionStorage.getItem('loggedInUser')) {
        if (bookingOptions) {
            bookingOptions.style.display = 'block';  // Show booking options if logged in
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'none';  // Hide the login prompt
        }
    } else {
        if (bookingOptions) {
            bookingOptions.style.display = 'none';  // Hide booking options if not logged in
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'block';  // Show the login prompt
        }
    }
});

// Function to continue to booking with the selected date, time, and party size
function continueToBooking() {
    if (!selectedDate) {
        alert('Please select a date for your booking.');
        return;
    }

    const selectedTime = document.getElementById('timePicker').value;
    const partySize = document.getElementById('guestPicker').value;
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('You need to be logged in to make a booking.');
        return;
    }

    const bookingData = {
        BookedUserId: loggedInUser.userId,
        PartySize: parseInt(partySize),
        BookingDate: `${selectedDate}T${selectedTime}:00`
    };

    fetch('https://localhost:7154/api/Booking/AddBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create booking');
        }
        return response.json();
    })
    .then(data => {
        alert('Booking created successfully!');
    })
    .catch(error => {
        console.error('Error creating booking:', error);
        alert('Error creating booking: ' + error.message);
    });
}
