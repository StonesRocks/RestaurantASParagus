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
            User user = db.Users.FirstOrDefault(u => u.expiration < DateTime.Now);
            if (user != null)
            {
                //found old user
                user.Reset();
                user.expiration = expirationDate;
                user.sessionToken = sessionToken;
            }
            //create new user
            user = new User();
            user.expiration = expirationDate;
            user.sessionToken = sessionToken;

            db.Users.Add(user);
            db.SaveChanges();
            return true;
        }

        public User GetAccountWithToken(string sessionToken)
        {
            sessionToken = sessionToken.Replace("\"", "");
            User user = db.Users.FirstOrDefault(u => u.sessionToken == sessionToken);
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
            var properties = typeof(User).GetProperties();
            foreach (var property in properties)
            {
                var value = property.GetValue(user);
                property.SetValue(oldUser, value);
            }
            db.SaveChanges();
            return true;
        }

        public List<User> FindUser(List<string> terms)
        {
            List<User> foundUsers = new List<User>();
            foreach (string term in terms)
            {
                if (term == "" || term == null) { continue; }
                List<User> users = db.Users.Where(u => u.userName.Contains(term) || u.email.Contains(term) || u.phoneNumber.Contains(term)).ToList();
                foreach (User user in users)
                {
                    if (!foundUsers.Contains(user))
                    {
                        foundUsers.Add(user);
                    }
                }
            }
            if (foundUsers.Count == 0)
            {
                return null;
            }
            return foundUsers;
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
