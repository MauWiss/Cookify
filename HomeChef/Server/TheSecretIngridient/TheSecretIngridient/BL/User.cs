using TheSecretIngridient.DAL;

namespace TheSecretIngridient.BL
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }   
        public string Password { get; set; }
        public Boolean IsAdmin { get; set; }
        public Boolean IsActive { get; set; }

        DBservices dbServices = new DBservices();

        


        //empty constructor
        public User() { }

        public User(int id, string name, string email, string password, Boolean isAdmin, Boolean isActive)
        {
            Id = id;
            Name = name;    
            Email = email;
            Password = password;
            IsAdmin = isAdmin;
            IsActive = isActive;
        }

    }
}
