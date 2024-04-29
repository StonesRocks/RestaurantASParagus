using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ProjectASParagus.Objects
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string userName { get; set; }
        public string userPass { get; set; }    
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public Role userRole { get; set; }
        public enum Role { Admin, User, Guest }
        public DateTime? Expiration { get; set; }
        public string? SessionToken { get; set; }

        //public Dictionary<DateTime,int> BookingLog { get; set; }

        public User(string userName, string userPass, string email, string phoneNumber, Role userRole)
        {
            this.userName = userName;
            this.userPass = userPass;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.userRole = userRole;
        }

        public User() { }

        public void Reset()
        {
            userName = "";
            userPass = "";
            email = "";
            phoneNumber = "";
            userRole = Role.Guest;
            SessionToken = "";
        }
    }
}
