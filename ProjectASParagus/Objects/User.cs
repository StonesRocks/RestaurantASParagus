using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectASParagus.Objects
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }    
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsAdmin { get; set; }

        //public Dictionary<DateTime,int> BookingLog { get; set; }

        public User(string userName, string password, string email, string phoneNumber, bool isAdmin)
        {
            UserName = userName;
            Password = password;
            Email = email;
            PhoneNumber = phoneNumber;
            IsAdmin = isAdmin;
        }

        public User() { }
    }
}
