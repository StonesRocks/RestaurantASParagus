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
        public MenuController(MenuService menuService)
        {
            this.menuService = menuService;
        }

        /*
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            // Ensure the file is an image
            if (!file.ContentType.StartsWith("image/"))
            {
                return BadRequest("Only images are allowed");
            }

            // Create a new filename for every upload to avoid name collisions
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine("ProjectASParagus/Images/", fileName);

            // Save the file to the server
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            // Save the filePath to your database here

            return Ok();
        }
        */

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
