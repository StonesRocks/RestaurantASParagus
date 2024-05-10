using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ProjectASParagus.Objects;

namespace ProjectASParagus.Services
{
    public class BookingService
    {
        int availableSeats = 100; //Max antal gäster.
        DatabaseContext db;
        public BookingService(DatabaseContext db)
        {
            this.db = db;
        }

        //användaren visas bokningsbara tider från GiveBookings som som skickas in här
        //alltså spelar det roll vilken funktion som körs i vilken ording
        public bool CreateBooking(Booking booking)
        {
            if (booking == null)
            {
                return false;
            }
            if (AvailableSeats(booking))
            {
                db.Bookings.Add(booking);
                db.SaveChanges();
                return true;
            }
            return false;
            /*
            try
            {
                db.Bookings.Add(booking);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                //för att logga in consolen
                Console.WriteLine($"Could not book, something went wrong in BookingService CreateBooking \t{ex.Message}");
                return false;
            }
            */
        }
        public bool AvailableSeats(Booking booking)
        {
            int currentSeatsBooked = GetSumOfPers(booking);
            if (currentSeatsBooked+booking.PartySize <= availableSeats)
            {
                return true;
            }
            return false;
        }

        //kollar om det finns plats på den angivna tiden 
        private int GetSumOfPers(Booking booking)
        {
            // Linq funktioner för att kolla om restaurangen har plats på den angivna tiden. 


            // dear whoever cooked this,
            // this might not be bussin since it includes the current booking's party size two times back to back
            // once in the method call itself and again in sumOfBookings
            // orewa ochinchin ga daisuki nandayo
            // oh you want an example... try booking a table (lmao) for 99 people for example
            // did I add way too many bookings and ended up with an error? maybe. Did I spend too much time on finding out what was wrong? maybe
            // I'll leave it to the original chef to reheat this since it's working right now.
            // Time of comment: 03:54, 10.05.2024

            int totalGuests = db.Bookings
                              .Where(b => b.BookingDate == booking.BookingDate) 
                              .Sum(b => b.PartySize);

            int sumOfBookings = totalGuests + booking.PartySize;

            return sumOfBookings; //Ger tillbaka hur många det är bokade den angivna tiden med den önskade bokningen inräknad.
        }

        //Funktionen ger tillbaka lediga tider och tillgängliga tider.
        public Dictionary<DateTime,int> GiveBookings(DateTime date)
        {
            Dictionary<DateTime,int> Capacity = new Dictionary<DateTime,int>();
            DateTime firstSearchParam = new DateTime(date.Year, date.Month, 1, 0, 0, 0);
            DateTime secondSearchParam = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59);

            var dbResult = db.Bookings.Where(b => b.BookingDate >= firstSearchParam && b.BookingDate <= secondSearchParam).ToList();

            foreach (var booking in dbResult)
            {
                for (int i = 0; i < 120; i += 15)
                {
                    DateTime dateCovered = booking.BookingDate.AddMinutes(i);
                    if (Capacity.ContainsKey(dateCovered)){
                        Capacity[dateCovered] += booking.PartySize;
                    }
                    else
                    {
                        Capacity.Add(dateCovered, booking.PartySize);
                    }
                }
            }
            return Capacity;
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
            try
            {
                Booking oldBooking = db.Bookings.Find(booking.BookingId); //retunerar null om inget hittas

                //Om bokningen lagt till fler gäster på bokningen så kollar GetSumOfPers ifall de får plats på den angivna tiden
                if (oldBooking == null || (GetSumOfPers(oldBooking) > availableSeats))
                {
                    return false;
                }

                oldBooking.PartySize = booking.PartySize;
                oldBooking.BookingDate = booking.BookingDate;

                db.Update(oldBooking);
                db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in BookingService, could not run UpdateBooking.\n{ex}");
                return false;
            }
        }

        public Booking GetBooking(int bookedUserId)
        {
            try
            {
                return db.Bookings.Find(bookedUserId);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error in BookingService. GetBooking, could not find: {bookedUserId} \n {e.Message}");
                return null;
            }
        }

        public Dictionary<DateTime, int> GetBookingsByDate(DateTime date)
        {

            Dictionary<DateTime, int> bookings = new Dictionary<DateTime, int>();
            var bookingsInMonth = db.Bookings.Where(b => b.BookingDate.Month == date.Month && b.BookingDate.Year == date.Year).ToList();
            foreach ( var booking in bookingsInMonth)
            {
                for (int i = 0; i < 2*60/15; i += 15)
                {
                    if (bookings.ContainsKey(booking.BookingDate))
                    {
                        bookings[booking.BookingDate] += booking.PartySize;
                    }
                    else
                    {
                        bookings.Add(booking.BookingDate, booking.PartySize);
                    }
                }
            }
            return bookings;
        }
        
        //sparar användares Email i samma format.
        private string MakeFirstCapital(string email)
        {
            if(string.IsNullOrEmpty(email))
            {
                return email;
            }
            
            string firstCapitalized = email.Substring(0,1).ToUpper();
            string restLower = email.Substring(1).ToLower();
            string capitalizedString = firstCapitalized + restLower;

            return capitalizedString;
        }

        public List<Booking> GiveAdminBookings(int? bookingId, int? userBookingId, DateTime? bookingDate)
        {
            List<Booking> bookingList = new List<Booking>();

            if (bookingId != null)
            {
                var booking = db.Bookings.Where(b => b.BookingId == bookingId);
                bookingList.AddRange(booking);
            }
            if (userBookingId != null)
            {
                var booking = db.Bookings.Where(b => b.BookedUserId == userBookingId).ToList();
                bookingList.AddRange(booking);
            }
            if (bookingDate != null)
            {
                var booking = db.Bookings.Where(b => b.BookingDate == bookingDate).ToList();
                bookingList.AddRange(booking);
            }
            //om någon parameter har ett värde, ge tillbaka
            if (userBookingId.HasValue && bookingId.HasValue && bookingDate.HasValue)
            {
                return bookingList;
            }
            else
            {

                return null;
            }
        }

        /*
        private bool CheckForEmailInDb (string email)
        {
            Booking booking= db.Bookings.Find(email);

            if(booking.Email == email)
            {
                return true;
            }
            return false;
        }
        */


        //fmlpleaswork: part 1
        public int GetAvailableSeats(DateTime date)
        {
            var bookings = db.Bookings.Where(b => b.BookingDate.Date == date.Date).ToList();
            int bookedSeats = bookings.Sum(b => b.PartySize);
            return availableSeats - bookedSeats;
        }
    }
}
