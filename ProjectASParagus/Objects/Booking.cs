﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectASParagus.Objects
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingId { get; set; } 
        public int BookedUserId { get; set; } // foreignkey
        public int PartySize { get; set; }
        public DateTime BookingDate { get; set; }

        public Booking(DateTime bookingDate, User user)
        {
            this.BookingDate = bookingDate;
            this.BookedUserId = user.UserId;
        }

        public Booking() { }
    }
}
