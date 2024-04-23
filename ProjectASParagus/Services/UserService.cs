using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class UserService
    {
        DatabaseContext db;
        public UserService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool CreateUser(User user)
        {
            db.Users.Add(user);
            db.SaveChanges();
            return true;
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
            oldUser = user;
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
