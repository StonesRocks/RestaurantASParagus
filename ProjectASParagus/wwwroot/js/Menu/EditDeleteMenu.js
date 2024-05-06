const editButtons = document.querySelectorAll('.edit-btn'); //h�mtar alla editBtn's
const deleteBtn = document.querySelectorAll('.delete-btn'); //h�mtar alla deleteBtn's


editButtons.forEach(function (button)
{
    button.addEventListener('click', function () {
        console.log("we got here")
        var menuItem = button.closest('.menu-item'); //B�rjar p� sig sj�lv, om de inte matchar s� tar den n�rmsta parent och kollar ifall den matchar
        var editForm = menuItem.querySelector('.edit-form');
        var saveButton = menuItem.querySelector('.save-btn');


        //togglar formen fr�n readonly till input
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

        //h�r ska det �ndrade skrivas in i Databasen.
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
