const editButtons = document.querySelectorAll('.edit-btn'); //h�mtar alla editBtn's

editButtons.forEach(function (button)
{
    button.addEventListener('click', function ()
    {
        console.log("we got here")
        var menuItem = button.closest('.menu-item'); //B�rjar p� sig sj�lv, om de inte matchar s� tar den n�rmsta parent och kollar ifall den matchar
        var editForm = menuItem.querySelector('.edit-form');
        if (button.textContent === "Edit")
        {
            button.textContent = "Cancel";
            button.classList.remove('btn-primary'); 
            button.classList.add('btn', 'btn-secondary');
        }
        else
        {
            button.textContent = "Edit";
            button.classList.remove('btn-secondary'); 
            button.classList.add('btn', 'btn-primary');
        }

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
