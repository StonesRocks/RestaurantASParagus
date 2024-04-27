using Microsoft.AspNetCore.Server.HttpSys;
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
        }

        //kollar om det finns plats på den angivna tiden 
        private int GetSumOfPers(Booking booking)
        {
            //Linq funktioner för att kolla om restaurangen har plats på den angivna tiden. 
            int totalGuests = db.Bookings
                              .Where(b => b.BookingDate == booking.BookingDate) 
                              .Sum(b => b.PartySize);

            int sumOfBookings = totalGuests + booking.PartySize;

            return sumOfBookings; //Ger tillbaka hur många det är bokade den angivna tiden med den önskade bokningen inräknad.
        }

        //Funktionen ger tillbaka lediga tider och tillgängliga tider.
        public Dictionary<DateTime,int> GiveBookings(DateTime date)
        {
            Dictionary<DateTime,int> Capacity = new Dictionary<DateTime,int>(); //Key = tid mellan 10:00-17:00, Value = Antal lediga platser.
            DateTime firstSearchParam = new DateTime(date.Year, date.Month, 1, 0, 0, 0);
            DateTime secondSearchParam = new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month), 23, 59, 59);

            var dbResult = db.Bookings.Where(b => b.BookingDate >= firstSearchParam && b.BookingDate <= secondSearchParam).ToList();

            foreach (var booking in dbResult)
            {
                if (Capacity.ContainsKey(booking.BookingDate)){
                    Capacity[booking.BookingDate] += booking.PartySize;
                }
                else
                {
                    Capacity.Add(booking.BookingDate, booking.PartySize);
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
                if (CheckForEmailInDb(booking.Email)) //uppdaterar emailen om den inte redan existerar, sen formatterar den till storbokstav.
                {
                    oldBooking.Email= booking.Email;
                    MakeFirstCapital(booking.Email);
                }
                oldBooking.PartySize = booking.PartySize;
                oldBooking.PhoneNumber= booking.PhoneNumber;
                oldBooking.BookingDate = booking.BookingDate;

                db.Update(booking);
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

        private bool CheckForEmailInDb (string email)
        {
            Booking booking= db.Bookings.Find(email);

            if(booking.Email == email)
            {
                return true;
            }
            return false;
        }
    }
}
