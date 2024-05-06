const editButtons = document.querySelectorAll('.edit-btn'); //h�mtar alla editBtn's
const deleteBtn = document.querySelectorAll('.delete-btn'); //h�mtar alla deleteBtn's


editButtons.forEach(function (button)
{
    button.addEventListener('click', function ()
    {
        console.log("we got here")
        var menuItem = button.closest('.menu-item'); //B�rjar p� sig sj�lv, om de inte matchar s� tar den n�rmsta parent och kollar ifall den matchar
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
