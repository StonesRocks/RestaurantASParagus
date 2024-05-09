using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProjectASParagus.Objects;
using ProjectASParagus.Services;

namespace ProjectASParagus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        public enum Role { Admin, User, Guest }
        BookingService bookingService;
        public BookingController(BookingService bookingService)
        {
            this.bookingService = bookingService;
        }

        [HttpPost("AddBooking")]
        public ActionResult CreateBooking(Booking booking)
        {
            if (bookingService.CreateBooking(booking))
            {
                return Ok();
            }
            return Conflict();
        }

        //denna funktionen kallas när användaren har fyllt i bookings uppgifter
        [HttpGet("GetOccupancy/{year?}/{month?}")]
        public ActionResult ShowBooking(int? year = null, int? month = null)
        {
            if(year == null || year <= 0)
            {
                year = DateTime.Now.Year;
            }
            if(month == null || month <= 0 || month >12)
            {
                month = DateTime.Now.Month;
            }
            int daysInMonth = DateTime.DaysInMonth(DateTime.Now.Year, (int)month);
            /*
            if (day == null || day <= 0 || day > daysInMonth)
            {
                day = DateTime.Now.Day;
            }
            if (hour == null || hour < 0 || hour > 23)
            {
                hour = DateTime.Now.Hour;
            }
            if (minute == null || minute < 0 || minute > 59)
            {
                minute = DateTime.Now.Minute;
            }
            int quarters = (int)minute/15;
            minute = quarters * 15;
            */
            DateTime cleanDate = new DateTime((int)year, (int)month, 1, 0, 0, 0);

            //Felhantera datument ifall datumet inte ör tillgängligt.

            return Ok(bookingService.GiveBookings(cleanDate));
        }   

        [HttpDelete("DeleteBooking/{id}")]
        public ActionResult DeleteBooking(int id)
        {
            if (bookingService.DeleteBooking(id))
            {
                return Ok();
            }
            return NotFound();
        }

        [HttpPut("UpdateBooking")]
        public ActionResult UpdateBooking(Booking booking)
        {
            if (bookingService.UpdateBooking(booking))
            {
                return Ok();
            }
            return NotFound();
        }

        [HttpGet("GetBooking/{id}")]
        public ActionResult GetBooking(int id)
        {
            Booking booking = bookingService.GetBooking(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpGet("GetBookingByDate/{date}")]
        public ActionResult GetBookingsByDate(DateTime date)
        {
            Dictionary<DateTime, int> bookings = bookingService.GetBookingsByDate(date);
            if (bookings == null)
            {
                return NotFound();
            }
            return Ok(bookings);
        }

        ////////////////////////////ADMIN FUNCTIONS I INDEX///////////////////////////////
        [HttpPost("GiveAdminBookings")]
        public ActionResult GiveAdminBookings(List<string>JsonList)
        {
            List<Booking> bookingList = new List<Booking>();
            if(JsonList.Count >= 3)
            {
                int.TryParse(JsonList[0], out int bookingId);
                int.TryParse(JsonList[1], out int bookingUserId);
                DateTime.TryParse(JsonList[2], out DateTime bookingdate);

                bookingList = bookingService.GiveAdminBookings(bookingId, bookingUserId, bookingdate); 
            }
            return Ok(bookingList);
        }
    }
}
