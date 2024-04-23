using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectASParagus.Objects
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingId { get; set; } 
        public int? BookedUserId { get; set; } // foreignkey
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int PartySize { get; set; }
        public DateTime BookingDate { get; set; }

        public Booking(int bookedUserId, int partySize, DateTime bookingDate)
        {
            BookedUserId = bookedUserId;
            PartySize = partySize;
            BookingDate = bookingDate;
        }

        public Booking(string? email, string? phoneNumber, int partySize, DateTime bookingDate)
        {
            Email = email;
            PhoneNumber = phoneNumber;
            if (Email == null && PhoneNumber == null)
            {
                throw new System.Exception("Email or Phone Number must be provided");
            }
            PartySize = partySize;
            BookingDate = bookingDate;
        }
    }
}
