using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using ProjectASParagus.Services;
using ProjectASParagus.Objects;
using Microsoft.AspNetCore.Http.HttpResults;

namespace ProjectASParagus.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IHttpClientFactory httpClientFactory;
        UserService userService;
        public User user;

        public IndexModel(UserService userService)
        {
            this.userService = userService;
        }
        public void OnGet()
        {

        }

        public StatusCodeResult LoginUser(List<string> loginInfo)
        {
            var response = userService.LoginUser(loginInfo[0], loginInfo[1]);
            if (response == null)
            {
                return StatusCode(404);
            }
            else
            {
                user = response;
                return StatusCode(200);
            }
        }
    }
}
