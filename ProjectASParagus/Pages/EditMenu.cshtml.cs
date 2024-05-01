using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Pages
{
    public class EditMenuModel : PageModel
    {
        public List<string> ImagePaths { get; private set; }
        DatabaseContext db;
        [BindProperty]
        public MenuItem menuItem { get; set; }

        //dessa används i cshtml
        public string errorMessages = "Item already added.";
        //dessa används i cshtml
        public bool itemExists = false;

        public EditMenuModel(DatabaseContext db) 
        { 
            this.db = db;
        }

        public void OnGet()
        {
        }

        public async Task<ActionResult> OnPost()
        {
            if(!ModelState.IsValid)
            {
                return Page();
            }
            if(menuItem == null)
            {
                NotFound(); 
            }
            itemExists = await db.MenuItems.AnyAsync(i => i.MenuItemId == menuItem.MenuItemId);


            menuItem.ProductName = CapitalizeMenuName(menuItem.ProductName);
            menuItem.Description = CapitalizeAndAppendPeriod(menuItem.Description);
            
            //sparar ner till databasen. sen tillbaka till samma sida fast som en ny sida.
            db.Add(menuItem);
            db.SaveChanges();
            return Redirect("/EditMenu");
        }
        //gör så att beskrivningen sparas med vokal och punkt i slutet.
        private string CapitalizeAndAppendPeriod(string description)
        {
            string capitalized = string.Empty;
            if (!(description.Length > 0 && description[0] == char.ToUpper(description[0])))
            {
                capitalized = char.ToUpper(description[0]) + description.Substring(1);
            }
            else
            {
                capitalized = description;
            }
            if (!capitalized.EndsWith("."))
            {
                capitalized += ".";
            }
            return capitalized;
        }
        //Gör så att Meny namnet sparas ner med storbokastav till databasen.
        private string CapitalizeMenuName(string menuItemName)
        {
            string capitalized = string.Empty;
            if (!(menuItemName.Length > 0 && menuItemName[0] == char.ToUpper(menuItemName[0])))
            {
                capitalized = char.ToUpper(menuItemName[0]) + menuItemName.Substring(1);
            }
            else
            {
                capitalized = menuItemName;
            }
            return capitalized;
        }
    }
}
