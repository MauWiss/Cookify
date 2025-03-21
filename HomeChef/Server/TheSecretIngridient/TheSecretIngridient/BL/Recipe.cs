using TheSecretIngridient.DAL;

namespace TheSecretIngridient.BL
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Instuations { get; set; }
        public string ImageUrl { get; set; }
        public string CreatedAt { get; set; }
        public int PrepTime { get; set; } 
        public int Difficulty { get; set; }
        public int UserID { get; set; }

        public DBservices DBservices = new DBservices();

        public Recipe()
        {
            
        }

        public static bool Insert(Recipe recipe)
        {

            //db

            return true;
        }

        public static List<Recipe> readRecipes()
        {

            //return db;



        }

        public static bool DeleteRecipe()
        {

            //return db;



        }


    }
}
