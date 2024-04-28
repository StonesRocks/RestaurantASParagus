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
        public Role userRole { get; set; }
        public enum Role { Admin, User , Guest}
        public DateTime Expiration { get; set; }
        public string SessionToken { get; set; }

        //public Dictionary<DateTime,int> BookingLog { get; set; }

        public User(string userName, string password, string email, string phoneNumber, Role userRole)
        {
            UserName = userName;
            Password = password;
            Email = email;
            PhoneNumber = phoneNumber;
            this.userRole = userRole;
        }

        public User() { }

        public void Reset()
        {
            UserName = "";
            Password = "";
            Email = "";
            PhoneNumber = "";
            userRole = Role.Guest;
            SessionToken = "";
        }
    }
}
