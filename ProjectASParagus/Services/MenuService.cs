using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Primitives;
using ProjectASParagus.Objects;
using System.Reflection.Metadata.Ecma335;

namespace ProjectASParagus.Services
{
    public class MenuService
    {
        DatabaseContext db;
        IHostEnvironment env;
        public MenuService(DatabaseContext db, IHostEnvironment env)
        {
            this.db = db;
            this.env = env;
        }
        //TODO- Gör så admin kan lägga till filer(bilder) i filsystemet- KLART
        //TODO- Gör så admin kan lägga till rätter- KLART

        //TODO- Gör så admin kan Updatera rätter // autofylls när man klickar på korrekt rätt, frontend som styr??


        //TODO- töm formen när man submitat.
        //TODO- Gör så admin kan ta bort rätter // gör detta i editmenu.cshtml, detta ska enbart admin kunna göra(i razorpages) frontend ska var kunna visa upp rätter, inte göra några åtgärder alls
        //TODO- Gör så admin kan ta bort filer(bilder) i filsystemet- 

        public bool CreateMenu(MenuItem menu)
        {
            try
            {
                if (string.IsNullOrEmpty(menu.Description) || //får inte va null/""
                    string.IsNullOrEmpty(menu.ProductName) ||
                    string.IsNullOrEmpty(menu.ImageUrl))
                {
                    menu.ImageUrl = string.Empty; // kan va tom men kraschar inte
                    return false;
                }
                CapitalizeAndAppendPeriod(menu.Description); // Gör första bokstaven till versal
                db.MenuItems.Add(menu);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        //lägger till en stor bokstav till beskrivningen och en punk om det inte finns.
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

        public bool DeleteMenu(int id)
        {
            try
            {

                MenuItem menu = db.MenuItems.Find(id);
                if (menu == null)
                {
                    return false;
                }
                db.MenuItems.Remove(menu);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        public bool UpdateMenu(MenuItem menu)
        {
            try
            {

                MenuItem oldMenu = db.MenuItems.Find(menu.MenuItemId);
                if (oldMenu == null || oldMenu.Equals(menu))
                {
                    return false;
                }
                oldMenu.ProductName = menu.ProductName;
                oldMenu.Description = menu.Description;
                oldMenu.Price = menu.Price;
                oldMenu.ImageUrl = menu.ImageUrl;
                db.SaveChanges();
                return true;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        //kalla denna från frontend för att kunna autofylla det mna vill uppdatera.
        public MenuItem GetMenu(int id)
        {
            try
            {
                return db.MenuItems.Find(id);
            }
            catch(Exception ex)
            {
                Console.WriteLine($"An error occurred while retrieving the menu item with ID {id}: {ex.Message}");
                return null;
            }
        }

        public List<MenuItem> GetAllMenuItems()
        {
            return db.MenuItems.ToList();
        }

        public async Task<string> AddImageToFiles(IFormFile file)
        {
            if (file == null || !file.ContentType.StartsWith("image/"))
            {
                Console.WriteLine("The uploaded file is not an image.");
                return null;
            }

            var filepath = "";
            filepath = Path.Combine(env.ContentRootPath, @"wwwroot/MenuImages", file.FileName); // vart den ska spara filen

            using (FileStream stream = new FileStream(filepath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            Console.WriteLine("Image successfully added");
            return filepath;
        }
    }
}
