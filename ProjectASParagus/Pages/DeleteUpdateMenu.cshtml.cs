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

        //Uppdaterar Databasen
        public void OnPost(MenuItem item, IFormFile file)
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
        }

        public void OnPostDelete(MenuItem item, IFormFile file)
        {
            if (!string.IsNullOrEmpty(item.ImageUrl))
            {
                // Combine the base directory with the image path
                string imagePath = Path.Combine(item.ImageUrl);
                string solutionPath = Path.Combine(env.ContentRootPath, "wwwroot", imagePath);

                //för att radera filerna i frontend/backend genensam bild folder
                string DirectoryPath = Directory.GetCurrentDirectory();
                string newImagePath = item.ImageUrl.Split('\\')[1];
                string outsideSolution = Path.Combine(DirectoryPath, "..", "ImageFolder\\", newImagePath);

                //tar bort ifrån solution
                if (System.IO.File.Exists(solutionPath))
                {
                    System.IO.File.Delete(solutionPath);
                }
                //tar bort från ImageFolder utanför solution
                if (System.IO.File.Exists(outsideSolution))
                {
                    System.IO.File.Delete(outsideSolution);
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
