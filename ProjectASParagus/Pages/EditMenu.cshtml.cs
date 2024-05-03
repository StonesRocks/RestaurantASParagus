using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Pages
{
    public class EditMenuModel : PageModel
    {
        [BindProperty]
        public MenuItem menuItem { get; set; }
        DatabaseContext db;
        IWebHostEnvironment env;

        public string errorMessages = "Item already added.";
        public bool itemExists = false;
        public bool success = false;
        public bool successNoImage = false;
        public bool fail = false;
        public List<MenuItem> menuList = new List<MenuItem>();

        public EditMenuModel(DatabaseContext db, IWebHostEnvironment env) 
        { 
            this.env = env;
            this.db = db;
        }

        public void OnGet()
        {
            menuList = db.MenuItems.ToList();
        }

        public async Task<ActionResult> OnPost(IFormFile file)
        {
            if(menuItem.Description == null || menuItem.ProductName == null)
            {
                NotFound();
                fail = true;
            }
            itemExists = await db.MenuItems.AnyAsync(i => i.Description == menuItem.Description); //om den finns visa det i .cshtml

            if(file != null)
            {
                menuItem.ImageUrl = "MenuImages/" + file.FileName;
            }
            else
            {
                menuItem.ImageUrl = "Image missing";
                successNoImage = true;
                TempData["successNoImage"] = true;

            }
            
            menuItem.ProductName = CapitalizeMenuName(menuItem.ProductName);
            menuItem.Description = CapitalizeAndAppendPeriod(menuItem.Description);
            AddImageToFiles(file); //lägger till bilden i filsystemet om den inte finns.
            try
            {
                db.Add(menuItem);
                db.SaveChanges();
                success = true;
                TempData["success"] = true;
            }
            catch
            {
                fail = true;
                TempData["fail"] = true;
                await Console.Out.WriteLineAsync("Error occurred while saving to database.");
            }
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
            string rootpath = env.WebRootPath;

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


        //lägger till bilder i filsystemet 
        public async Task AddImageToFiles(IFormFile file)
        {
            if (file == null || !file.ContentType.StartsWith("image/"))
            {
                Console.WriteLine("The uploaded file is not an image.");
                return;
            }

            var filepath = Path.Combine(env.ContentRootPath, @"wwwroot/MenuImages", file.FileName); 

            if (System.IO.File.Exists(filepath)) //finns filen så läggs den inte till igen.
            {
                await Console.Out.WriteLineAsync("image already exists");
                return;
            }
            using (FileStream stream = new FileStream(filepath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            Console.WriteLine("Image successfully added");
        }
    }
}
