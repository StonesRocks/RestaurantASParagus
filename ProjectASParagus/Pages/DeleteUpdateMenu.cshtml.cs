using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectASParagus.Objects;
using System.IO;

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

        //Uppdaterar Databasen eller tar bort 
        public void OnPost(MenuItem item,IFormFile file, string action)
        {
            if (action == "Update")
            {
                if (file != null)
                {
                    addMenu.AddImageToFiles(file);
                }

                MenuItem menuItemToUpdate = db.MenuItems.Find(item.MenuItemId);
                menuItemToUpdate.ProductName = item.ProductName;
                menuItemToUpdate.Description = item.Description;
                menuItemToUpdate.Price = item.Price;

                if (file != null)
                {
                    menuItemToUpdate.ImageUrl = "MenuImages/" + file.FileName;
                }
                db.SaveChanges();
                MenuList = db.MenuItems.ToList();
                Page();
            }
            else if(action == "Delete")
            {
                if (!string.IsNullOrEmpty(item.ImageUrl))
                {
                    // Combine the base directory with the image path
                    string imagePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, item.ImageUrl);

                    // Check if the file exists before attempting to delete it
                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }
                MenuItem menuItemToDelete = db.MenuItems.Find(item.MenuItemId);

                if (menuItemToDelete != null)
                {
                    db.MenuItems.Remove(menuItemToDelete);
                    db.SaveChanges();
                }
                MenuList = db.MenuItems.ToList();
            }
        }
    }
}
