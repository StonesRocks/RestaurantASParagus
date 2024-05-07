using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Pages
{
    public class DeleteUpdateMenuModel : PageModel
    {
        public List<MenuItem> MenuList = new List<MenuItem>();  
        public DatabaseContext db;
        public AddMenuModel addMenu;
        public IHostEnvironment env;

        public DeleteUpdateMenuModel(DatabaseContext db,AddMenuModel addmenu, IHostEnvironment env) 
        {
            this.env = env;
            this.addMenu = addmenu;
            this.db = db;        
        }
        
        //visar användaren alla menyer
        public void OnGet()
        {
            MenuList = db.MenuItems.ToList();
        }
        
        //Uppdaterar Databasen. 
        public async void OnPost(MenuItem item,IFormFile file)
        {
            if(file != null)
            {
                addMenu.AddImageToFiles(file);
            }

            MenuItem menuItemToUpdate = db.MenuItems.Find(item.MenuItemId);
            menuItemToUpdate.ProductName = item.ProductName;
            menuItemToUpdate.Description = item.Description;
            menuItemToUpdate.Price = item.Price;
            if (file != null)
            {
                menuItemToUpdate.ImageUrl = "ImageFolder/" + file.FileName;
            }
            db.SaveChanges();
            MenuList = db.MenuItems.ToList();
            Page();
        }

        public async Task<IActionResult> OnPostDelete(MenuItem menuItem)
        {
            var menuItemToDelete = db.MenuItems.Find(menuItem.MenuItemId);
            if (menuItemToDelete != null)
            {
                db.MenuItems.Remove(menuItemToDelete);
                await db.SaveChangesAsync();
            }
            return RedirectToPage();
        }
    }
}
