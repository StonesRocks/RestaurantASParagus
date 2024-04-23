using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class BookingService
    {
        int availableSeats = 100; //Max antal platser i restaurangen, Deklraras här så man kan användas i Tex, UpdateBooking
        DatabaseContext db;
        public BookingService(DatabaseContext db)
        {
            this.db = db;
        }

        //Johan
        public bool CreateBooking(Booking booking)
        {
            if (IsBookingAvailable(booking))
            {
                db.Bookings.Add(booking);
                db.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }
        //kollar om det finns plats på den angivna tiden 
        private bool IsBookingAvailable(Booking booking)
        {
            //Linq funktioner för att kolla om restaurangen har plats på den angivna tiden. 
            int totalGuests = db.Bookings
                              .Where(b => b.BookingDate == booking.BookingDate) 
                              .Sum(b => b.PartySize);

            int sumOfBookings = totalGuests + booking.PartySize; // kollar om det finns plats med den pågående bokningen.
            
            if (sumOfBookings <= availableSeats)
            {
                return true;
            }
            else {return false; }
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
