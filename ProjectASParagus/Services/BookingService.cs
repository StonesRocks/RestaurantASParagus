using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class BookingService
    {
        DatabaseContext db;
        public BookingService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool CreateBooking(Booking booking)
        {
            
            db.Bookings.Add(booking);
            db.SaveChanges();
            return true;
        }

        public bool DeleteBooking(int id)
        {
            Booking booking = db.Bookings.Find(id);
            if (booking == null)
            {
                return false;
            }
            db.Bookings.Remove(booking);
            db.SaveChanges();
            return true;
        }

        public bool UpdateBooking(Booking booking)
        {
            Booking oldBooking = db.Bookings.Find(booking.BookingId);
            if (oldBooking == null)
            {
                return false;
            }
            oldBooking = booking;
            db.SaveChanges();
            return true;
        }

        public Booking GetBooking(int id)
        {
            return db.Bookings.Find(id);
        }
    }
}
