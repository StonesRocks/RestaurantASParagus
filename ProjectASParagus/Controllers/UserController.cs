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
        public enum Role { Admin, User, Guest }
        public UserController(UserService userService)
        {
            this.userService = userService;
        }

        /*
            Send a POST request to https://localhost:[INSERT PORT]/api/User/LoginUser
            with the following format:
                javascript:
                    let data = [name, password]
                JSON:
                    ["name","password"]
         */
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

        [HttpPost("ValidateSessionToken")]
        public ActionResult ValidateSessionToken([FromBody]string sessionToken)
        {
            if (userService.GetAccountWithToken(sessionToken) == null)
            {
                return NotFound();
            }
            return Ok(userService.GetAccountWithToken(sessionToken));
        }

        [HttpGet("GetAllUsers")]
        public List<User> GetAllUsers()
        {
            return userService.GetAllUsers();
        }

        [HttpPost("FindUser")]
        public ActionResult FindUser(List<string> terms)
        {
            List<User> users = userService.FindUser(terms);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users);
        }

        /*
            1. Use Postman POST request to https://localhost:[INSERT PORT]/api/User/AddUserAccount
            2. Set body format to raw -> JSON and insert this into body:

            {
                "userName": "admin",
                "userPass": "admin",
                "email": "admin",
                "phoneNumber": "1337",
                "userRole": "Admin"
            }

        */
        [HttpPost("AddUserAccount")]
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

        [HttpPost("AddGuestAccount")]
        public ActionResult CreateGuest(string sessionToken, DateTime? expirationDate)
        {
            if (sessionToken == null)
            {
                return BadRequest();
            }
            if (userService.CreateGuest(sessionToken, expirationDate))
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
