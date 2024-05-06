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

        [HttpGet("GetMenuAPI")]
        public ActionResult GetMenuAPI()
        {
            //menuService.GetAllMenuItems();
            return Ok(menuService.GetAllMenuItems());
        }
    }
}
