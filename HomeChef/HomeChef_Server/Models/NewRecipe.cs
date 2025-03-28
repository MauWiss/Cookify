using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HomeChef_Server.Models
{
    public class NewRecipe
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(200)]
        public string? Publisher { get; set; }

        public string? ImageUrl { get; set; }

        public string? SourceUrl { get; set; }

        public int? Servings { get; set; }

        public int? CookingTime { get; set; }

        public int? CategoryId { get; set; }
        public Category Category { get; set; }

        public ICollection<NewRecipeIngredient> Ingredients { get; set; }
    }
}
