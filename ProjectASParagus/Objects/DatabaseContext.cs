using Microsoft.EntityFrameworkCore;

namespace ProjectASParagus.Objects
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions options)
            : base(options)
        {
        }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }

        public DbSet<User> Users { get; set; }

        //publid DbSet<[Class]> [variable Name] { get; set; }
    }
}
