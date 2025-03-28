namespace HomeChef_Server.Models
{
    public class NewFavorite
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int RecipeId { get; set; }
        public NewRecipe Recipe { get; set; }
    }
}
