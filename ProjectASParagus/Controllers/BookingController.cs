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
        BookingService bookingService;
        public BookingController(BookingService bookingService)
        {
            this.bookingService = bookingService;
        }

        [HttpPost("AddBooking")]
        public ActionResult CreateBooking(Booking booking)
        {
            if (booking == null)
            {
                return BadRequest();
            }
            if (bookingService.CreateBooking(booking))
            {
                return Ok();
            }
            return Conflict();
        }

        //denna funktionen kallas när användaren har fyllt i bookings uppgifter
        [HttpGet("ShowBookings")]
        public ActionResult ShowBooking(Booking booking)
        {
            Dictionary<DateTime, int> bookingDictionary = bookingService.GiveBookings(booking);

            if (bookingDictionary.Count == 0) //inga tillgängliga tider att boka
            {
                return NotFound("There are currently no available bookings. Please try again later.");
            }
            return Ok(bookingDictionary);
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
    }
}
