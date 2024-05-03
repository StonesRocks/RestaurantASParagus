using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Pages
{
    public class DeleteUpdateMenuModel : PageModel
    {
        public List<MenuItem> MenuList = new List<MenuItem>();  
        DatabaseContext db;

        public DeleteUpdateMenuModel(DatabaseContext db) 
        {
            this.db = db;        
        }
        
        //visar användaren alla menyer
        public void OnGet()
        {
            MenuList = db.MenuItems.ToList();
        }
        
        //Uppdaterar 
        public void OnPost()
        {

        }
        
        public void Delete()
        {
        }
    }
}
