using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectASParagus.Services;

namespace ProjectASParagus.Pages
{
    public class AddImageModel : PageModel
    {
        public string FilePath = string.Empty;
        //public string Message = string.Empty;

        private readonly ILogger<AddImageModel> logger;
        MenuService menuService;

        public AddImageModel(MenuService menuService, ILogger<AddImageModel> logger)
        {
            this.menuService = menuService;
            this.logger = logger;
        }

        public void OnGet()
        {
        }
        public async void OnPost(IFormFile file) //parametern måste matcha med Name = "file" i frontend.
        {
            if(file != null) 
            {
                FilePath = await menuService.AddImageToFiles(file);
                //Message = "Image Successfully added";
            }
            else
            {
                //Message = "You can only add images.";
            }
        }
    }
}
