using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Pages
{
    public class AddMenuModel : PageModel
    {
        [BindProperty]
        public MenuItem menuItem { get; set; }
        public DatabaseContext db;
        public IWebHostEnvironment env;

        public string errorMessages = "Item already added.";
        public bool itemExists = false;
        public bool success = false;
        public bool successNoImage = false;
        public bool fail = false;

        public AddMenuModel(DatabaseContext db, IWebHostEnvironment env) 
        { 
            this.env = env;
            this.db = db;
        }


        //skapar en meny.
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
                menuItem.ImageUrl = "MenuImages\\" + file.FileName;
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
                db.MenuItems.Add(menuItem);
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
            return Redirect("/AddMenu");
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

        //ändra till ny mapp där frontend och backend kan nå bilderna.
        //
        //
        //lägger till bilder i filsystemet 
        public async Task AddImageToFiles(IFormFile file)
        {
            string currentDirectory = Directory.GetCurrentDirectory();
            string solutionDirectory = Directory.GetParent(currentDirectory).FullName;
            string folderName = "ImageFolder";
            string path = Path.Combine(solutionDirectory, folderName);

            //skapar en folder där fronend och backend är sparat.
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }

            if (file == null || !file.ContentType.StartsWith("image/"))
            {
                Console.WriteLine("The uploaded file is not an image.");
                return;
            }
            
            var filepath = Path.Combine(env.ContentRootPath, @"wwwroot/MenuImages", file.FileName); //skriver in till programmet så admin kan se bilden
            var secondFilepath = Path.Combine(path, file.FileName); //skriver in till imagefolder så fronend kan hämta


            if (System.IO.File.Exists(filepath)) //finns filen så läggs den inte till igen.
            {
                await Console.Out.WriteLineAsync("image already exists");
            }
            if (System.IO.File.Exists(secondFilepath)) //finns filen så läggs den inte till igen i imagefolder
            {
                await Console.Out.WriteLineAsync("image already exists");
            }

            using (FileStream stream = new FileStream(filepath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
                Console.WriteLine("Image successfully to menuImages added");
            }
            using (FileStream stream = new FileStream(secondFilepath, FileMode.Create)) //skriver in filen i imagefolder
            {
                await file.CopyToAsync(stream);
                Console.WriteLine("Image successfully added to ImageFolder to frontend");
                return;
            }

        }
    }
}
