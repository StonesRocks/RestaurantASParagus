using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class MenuService
    {
        DatabaseContext db;
        public MenuService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool CreateMenu(MenuItem menu)
        {
            db.MenuItems.Add(menu);
            db.SaveChanges();
            return true;
        }

        public bool DeleteMenu(int id)
        {
            MenuItem menu = db.MenuItems.Find(id);
            if (menu == null)
            {
                return false;
            }
            db.MenuItems.Remove(menu);
            db.SaveChanges();
            return true;
        }

        public bool UpdateMenu(MenuItem menu)
        {
            MenuItem oldMenu = db.MenuItems.Find(menu.MenuItemId);
            if (oldMenu == null)
            {
                return false;
            }
            oldMenu = menu;
            db.SaveChanges();
            return true;
        }

        public MenuItem GetMenu(int id)
        {
            return db.MenuItems.Find(id);
        }
    }
}
