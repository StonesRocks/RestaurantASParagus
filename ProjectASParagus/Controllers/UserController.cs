using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectASParagus.Objects;
using ProjectASParagus.Services;

namespace ProjectASParagus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        UserService userService;
        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("LoginUser")]
        public ActionResult LoginUser(List<string> loginInfo)
        {
            User user = userService.LoginUser(loginInfo[0], loginInfo[1]);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("SetTestSubjects")]
        public ActionResult SetTestSubjects()
        {
            User user1 = new User(
                "admin", "admin", "Admin@admin.se", "0", true
                );
            if (userService.CreateUser(user1))
            {
                return Ok();
            }
            return Conflict();
        }

        [HttpGet("GetAllUsers")]
        public List<User> GetAllUsers()
        {
            return userService.GetAllUsers();
        }

        [HttpPost("AddUser")]
        public ActionResult CreateUser(User user)
        {
            if (user == null)
            {
                return BadRequest();
            }
            if (userService.CreateUser(user))
            {
                return Ok();
            }
            return Conflict();
        }

        [HttpDelete("DeleteUser/{id}")]
        public ActionResult DeleteUser(int id)
        {
            if (userService.DeleteUser(id))
            {
                return Ok();
            }
            return NotFound();
        }

        [HttpPut("UpdateUser")]
        public ActionResult UpdateUser(User user)
        {
            if (userService.UpdateUser(user))
            {
                return Ok();    
            }
            return NotFound();
        }

        [HttpGet("GetUser/{id}")]
        public ActionResult GetUser(int id)
        {
            User user = userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
    }
}
