const editButtons = document.querySelectorAll('.edit-btn'); //hämtar alla editBtn's
const deleteBtn = document.querySelectorAll('.delete-btn'); //hämtar alla deleteBtn's


editButtons.forEach(function (button)
{
    button.addEventListener('click', function () {
        console.log("we got here")
        var menuItem = button.closest('.menu-item'); //Börjar på sig själv, om de inte matchar så tar den närmsta parent och kollar ifall den matchar
        var editForm = menuItem.querySelector('.edit-form');
        var saveButton = menuItem.querySelector('.save-btn');


        //togglar formen från readonly till input
        var formInputs = editForm.querySelectorAll('input, textarea');
        formInputs.forEach(function (input) {
            input.readOnly = !input.readOnly;
        });

        //togglar fram Save button om man editar.
        if (saveButton.style.display === 'none') {
            saveButton.style.display = 'block';
        }
        else {
            saveButton.style.display = 'none';
        }

        //här ska det ändrade skrivas in i Databasen.
        var allSaveButtons = document.querySelectorAll('.save-btn');
        allSaveButtons.forEach(function (btn) {
            if (btn !== saveButton) {
                btn.style.display = 'none';
            }
        });

        var allForms = document.querySelectorAll('.edit-form');
        allForms.forEach(function (form) {
            if (form !== editForm) {
                var otherInputs = form.querySelectorAll('input, textarea');

                otherInputs.forEach(function (input) {
                    input.readOnly = true;
                });
            }
        });
    });
}
