const editButtons = document.querySelectorAll('.edit-btn'); //hämtar alla editBtn's
const deleteBtn = document.querySelectorAll('.delete-btn'); //hämtar alla deleteBtn's


editButtons.forEach(function (button)
{
    button.addEventListener('click', function ()
    {
        console.log("we got here")
        var menuItem = button.closest('.menu-item'); //Börjar på sig själv, om de inte matchar så tar den närmsta parent och kollar ifall den matchar
        var editForm = menuItem.querySelector('.edit-form');
        var saveButton = menuItem.querySelector('.save-btn');

        //togglar edit formen
        if (editForm.style.display === 'none')
        {
            editForm.style.display = 'block';
        }
        else
        {
            editForm.style.display = 'none';
        }
    });
});

deleteBtn.forEach(function (button)
{
    button.addEventListener('click', function ()
    {
        console.log("we got here")
        var menuItemId = button.id.split('-')[1]; // Extract the menu item ID from the button ID
        // Send AJAX request to delete the menu item
        fetch('/YourPageName?handler=Delete',
            {
                method: 'POST',
                headers:
                {   
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ menuItemId: menuItemId }),
        })
            .then(response => {
                if (response.ok) {
                    // If deletion is successful, remove the menu item from the DOM
                    var menuItem = button.closest('.menu-item');
                    menuItem.remove();
                } else {
                    // Handle error response
                    console.error('Failed to delete menu item');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
