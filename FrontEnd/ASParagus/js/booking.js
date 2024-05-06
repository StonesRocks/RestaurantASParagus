let url = window.location.href;

document.addEventListener('DOMContentLoaded', function() {
    const months = ["Januari", 
                    "Februari", 
                    "Mars", 
                    "April", 
                    "Maj", 
                    "Juni", 
                    "Juli", 
                    "Augusti", 
                    "September", 
                    "Oktober", 
                    "November", 
                    "December"];

    let currentDate = new Date();
    const today = new Date(); // Get today's date for comparison

    function updateCalendar() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const monthDays = lastDay.getDate();
        const firstDayOfWeek = (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1);

        // Clear existing cells
        for (let i = 1; i <= 42; i++) {
            const cell = document.getElementById(`xy${i}`);
            cell.innerText = '';
            cell.className = ''; // Reset class
        }

        // Set month and year in header
        document.getElementById('headTable').innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        // Fill dates from the previous month
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = firstDayOfWeek; i > 0; i--) {
            const cell = document.getElementById(`xy${firstDayOfWeek - i + 1}`);
            cell.innerText = prevMonthLastDay - i + 1;
            cell.className = 'non-current-month'; // CSS class for styling
        }

        // Fills dates in the calendar
        for (let i = 0; i < monthDays; i++) {
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
            const cell = document.getElementById(`xy${i + firstDayOfWeek + 1}`);
            cell.innerText = i + 1;

            // Checks if it is the current day
            if (cellDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
                cell.className = 'current-day'; // Apply a class if it's today
            }
        }

        // Dates from the next month
        const numCellsFilled = firstDayOfWeek + monthDays;
        for (let i = 0; i < (42 - numCellsFilled); i++) {
            const cell = document.getElementById(`xy${numCellsFilled + i + 1}`);
            cell.innerText = i + 1;
            cell.className = 'non-current-month'; // CSS class for styling
        }
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    }

    function currentMonth() {
        currentDate = new Date();
        updateCalendar();
    }

    window.vorige = prevMonth;
    window.volgende = nextMonth;
    window.nu = currentMonth;

    updateCalendar(); // Initial call to display the current month
});


function continueToBooking() {
    const selectedTime = document.getElementById('timePicker').value;
    alert('Booking time selected: ' + selectedTime);
    // Here you can add code to integrate with the API or navigate to another page
}


// ----------API TESTING TIME ------------------------------------------------------------------

// Example of fetching data from an API endpoint
//fetch('URL TO API')
//  .then(response => {
//    if (!response.ok) {
//      throw new Error('Network response was not ok :(');
//    }
//    return response.json();
//  })
//  .then(data => {
//    // Process the data returned from the API
//    console.log(data);
//  })
//  .catch(error => {
//    // Handle any errors that occur during the fetch
//    console.error('Error fetching data:', error);
//  });
//