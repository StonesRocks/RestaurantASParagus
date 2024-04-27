using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectASParagus.Objects;
using ProjectASParagus.Services;

namespace ProjectASParagus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        MenuService menuService;
        public string FilePath;
        public MenuController(MenuService menuService)
        {
            this.menuService = menuService;
        }

        

        [HttpPost("AddImage")]
        public async Task<IActionResult> UploadImage(IFormFile file) //parametern måste matcha med Name = "file" i frontend.
        {
            if(file != null)
            {
                FilePath = await menuService.AddImageToFiles(file);
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("AddMenuItem")]
        public ActionResult CreateMenuItem(MenuItem menuItem)
        {
            if (menuItem == null)
            {
                return BadRequest();
            }
            if (menuService.CreateMenu(menuItem))
            {
                return Ok();
            }
            Console.WriteLine("Wrong format when creating a menu.");
            return Conflict();
        }

        [HttpDelete("DeleteMenuItem/{id}")]
        public ActionResult DeleteMenuItem(int id)
        {
            if (menuService.DeleteMenu(id))
            {
                return Ok();
            }
            return NotFound();
        }

        [HttpPut("UpdateMenuItem")]
        public ActionResult UpdateMenuItem(MenuItem menuItem)
        {
            if (menuService.UpdateMenu(menuItem))
            {
                return Ok();
            }
            return NotFound();
        }

        [HttpGet("GetMenuItem/{id}")]
        public ActionResult GetMenuItem(int id)
        {
            MenuItem menuItem = menuService.GetMenu(id);
            if (menuItem == null)
            {
                return NotFound();
            }
            return Ok(menuItem);
        }
    }
}
