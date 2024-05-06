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
