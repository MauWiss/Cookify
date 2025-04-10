namespace HomeChefServer.DTOs
{
    public class ReviewDTO
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } // שם המשתמש להצגה בביקורות
        public string ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
