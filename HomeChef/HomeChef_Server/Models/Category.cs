using System.ComponentModel.DataAnnotations;

namespace HomeChef_Server.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public ICollection<NewRecipe> Recipes { get; set; }
    }
}
