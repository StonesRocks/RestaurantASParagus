using BCrypt.Net;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class UserService
    {
        DatabaseContext db;
        public enum Role { Admin, User, Guest }
        public UserService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool CreateUser(User user)
        {
            //krypterar användarens lösenord med Bcrypt(kolla Db för att se hashat lösen)
            user.userPass = BCrypt.Net.BCrypt.HashPassword(user.userPass);
            db.Users.Add(user);
            db.SaveChanges();
            return true;
        }
        public bool CreateGuest(string sessionToken, DateTime? expirationDate)
        {
            if (expirationDate == null)
            {
                expirationDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day + 7);
            }
            User user = db.Users.FirstOrDefault(u => u.Expiration < DateTime.Now);
            if (user != null)
            {
                //found old user
                user.Reset();
                user.Expiration = expirationDate;
                user.SessionToken = sessionToken;
            }
            //create new user
            user = new User();
            user.Expiration = expirationDate;
            user.SessionToken = sessionToken;

            db.Users.Add(user);
            db.SaveChanges();
            return true;
        }

        public User GetAccount(string sessionToken)
        {
            User user = db.Users.FirstOrDefault(u => u.SessionToken == sessionToken);
            if (user != null)
            {
                return user;
            }
            return user;
        }

        public User LoginUser(string userName, string userPass)
        {
            User user = db.Users.FirstOrDefault(u => u.userName == userName);
            if (user == null)
            {
                return null;
            }

            if (BCrypt.Net.BCrypt.Verify(userPass, user.userPass))
            {
                return user;
            }
            return null;
        }

        public bool DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return false;
            }
            db.Users.Remove(user);
            db.SaveChanges();
            return true;
        }

        public bool UpdateUser(User user)
        {
            User oldUser = db.Users.Find(user.UserId);
            if (oldUser == null)
            {
                return false;
            }

            oldUser.userName = user.userName;
            oldUser.email = user.email;
            oldUser.userPass = user.userPass;
            oldUser.phoneNumber = user.phoneNumber;
            oldUser.userRole = user.userRole;

            db.SaveChanges();
            return true;
        }

        public User GetUser(int id)
        {
            return db.Users.Find(id);
        }

        public List<User> GetAllUsers()
        {
            return db.Users.ToList();
        }
    }
}
