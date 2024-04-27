using Microsoft.AspNetCore.Mvc.Infrastructure;
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
        //TODO- Gör så admin kan lägga till rätter- KLART
        //TODO- Gör så admin kan Updatera rätter // autofylls när man klickar på korrekt rätt
        //TODO- Gör så admin kan ta bort rätter
        //TODO- Gör så admin kan lägga till filer(bilder) i filsystemet
        //TODO- Gör så admin kan lägga till filer(bilder) i filsystemet


        public bool CreateMenu(MenuItem menu)
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

        //lägger till en stor bokstav till beskrivningen och en punk om det inte finns.
        private string CapitalizeAndAppendPeriod(string description)
        {
            string capitalized = "";
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
            MenuItem menu = db.MenuItems.Find(id);
            if (menu == null)
            {
                return false;
            }
            db.MenuItems.Remove(menu);
            db.SaveChanges();
            return true;
        }

        public bool UpdateMenu(MenuItem menu)
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

        //kalla denna från frontend för att kunna autofylla det mna vill uppdatera.
        public MenuItem GetMenu(int id)
        {
            return db.MenuItems.Find(id);
        }

        public async Task<string> AddImageToFiles(IFormFile file)
        {
            var filepath = "";
            filepath = Path.Combine(env.ContentRootPath, @"wwwroot/MenuImages", file.FileName); // vart den ska spara filen

            using (FileStream stream = new FileStream(filepath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return filepath;
        }
    }
}
