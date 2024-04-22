namespace ProjectASParagus.Objects
{
    public class Booking
    {
        public int BookingId { get; set; } = int.MinValue;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.MinValue;
        public int PartySize { get; set; } = int.MinValue;

        public Booking(string name, string email, string phone, DateTime date, int partySize)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Date = date;
            PartySize = partySize;
        }

        public Booking(){}
    }
}
