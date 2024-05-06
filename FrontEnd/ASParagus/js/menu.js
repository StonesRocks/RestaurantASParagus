document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch menu items from the backend API
    function fetchMenuItems() {
        fetch('/api/menu') // Assuming your backend API endpoint for menu items is '/api/menu'
            .then(response => response.json())
            .then(data => {
                // Process the fetched data
                displayMenuItems(data);
            })
            .catch(error => console.error('Error fetching menu items:', error));
    }

    // Function to display menu items on the page
    function displayMenuItems(menuItems) {
        const menuContainer = document.querySelector('.menu-container');
        menuItems.forEach(item => {
            // Create HTML elements for each menu item
            const menuItemDiv = document.createElement('div');
            menuItemDiv.classList.add('menu-item');

            const itemName = document.createElement('h2');
            itemName.textContent = item.name;

            const itemDescription = document.createElement('p');
            itemDescription.textContent = item.description;

            const itemPrice = document.createElement('p');
            itemPrice.textContent = `Price: ${item.price}`;

            const itemImage = document.createElement('img');
            itemImage.src = item.imageUrl; // Assuming your menu item object has an 'imageUrl' property

            // Append elements to the menu item div
            menuItemDiv.appendChild(itemName);
            menuItemDiv.appendChild(itemDescription);
            menuItemDiv.appendChild(itemPrice);
            menuItemDiv.appendChild(itemImage);

            // Append menu item div to the menu container
            menuContainer.appendChild(menuItemDiv);
        });
    }

    // Call the fetchMenuItems function when the page loads
    fetchMenuItems();
});