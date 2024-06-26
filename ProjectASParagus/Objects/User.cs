﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace ProjectASParagus.Objects
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        [Required]
        public string userName { get; set; }
        public string userPass { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public Role userRole { get; set; }
        public enum Role { Admin, User, Guest }
        public DateTime? expiration { get; set; }
        public string? sessionToken { get; set; }

        //public Dictionary<DateTime,int> BookingLog { get; set; }

        public User(string userName, string userPass, string email, string phoneNumber, Role userRole)
        {
            this.userName = userName;
            this.userPass = userPass;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.userRole = userRole;
        }

        public User() { }

        public void Reset()
        {
            userName = "";
            userPass = "";
            email = "";
            phoneNumber = "";
            userRole = Role.Guest;
            sessionToken = "";
        }
    }
}
