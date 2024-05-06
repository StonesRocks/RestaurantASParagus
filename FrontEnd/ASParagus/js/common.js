// Initial data object to store user selections
const bookingData = {
    guests: 0,
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  };
  
  // Function to handle guest selection
  function selectGuests(guestNumber) {
    bookingData.guests = guestNumber;
    showNextStep('date-selection');
  }
  
  // Function to handle date selection
  function selectDate(date) {
    bookingData.date = date;
    // Assuming you're using a date picker library
    showNextStep('time-selection');
  }
  
  // Function to handle time selection
  function selectTime(time) {
    bookingData.time = time;
    showNextStep('personal-details');
  }
  
  // Function to save personal details
  function saveDetails(name, phone, email) {
    bookingData.name = name;
    bookingData.phone = phone;
    bookingData.email = email;
    showNextStep('confirmation');
    displaySummary(); // Function to show summary of the booking before confirmation
  }
  
  // Function to show the next step
  function showNextStep(nextStepId) {
    // Hide all steps
    const steps = document.querySelectorAll('.booking-section > div');
    steps.forEach(step => {
      step.classList.add('hidden');
    });
  
    // Show next step
    const nextStep = document.getElementById(nextStepId);
    nextStep.classList.remove('hidden');
  }
  
  // Function to display booking summary
  function displaySummary() {
    const summary = document.getElementById('booking-summary');
    summary.innerHTML = `
      <p>Guests: ${bookingData.guests}</p>
      <p>Date: ${bookingData.date}</p>
      <p>Time: ${bookingData.time}</p>
      <p>Name: ${bookingData.name}</p>
      <p>Phone: ${bookingData.phone}</p>
      <p>Email: ${bookingData.email}</p>
    `;
  }
  
  // Event listeners for the guest number buttons
  const guestButtons = document.querySelectorAll('.guest-number');
  guestButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      selectGuests(e.target.textContent);
    });
  });
  
  // Assuming you're using a date picker library that handles the input event
  const datePicker = document.getElementById('booking-date');
  datePicker.addEventListener('change', (e) => {
    selectDate(e.target.value);
  });
  
  // Event listeners for the time slot buttons
  const timeButtons = document.querySelectorAll('.time-slot');
  timeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      selectTime(e.target.textContent);
    });
  });
  
  // Event listener for the details form submission
  const detailsForm = document.getElementById('details-form');
  detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    saveDetails(name, phone, email);
  });
  
  // Event listener for confirm booking button
  const confirmBookingButton = document.getElementById('confirm-booking');
  confirmBookingButton.addEventListener('click', () => {
    // Here you would normally send data to the server
    alert('Booking confirmed!'); // Replace with better confirmation message or action
  });
  