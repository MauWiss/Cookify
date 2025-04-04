using HomeChef.Server.Models;

namespace HomeChef.Server.Services
{
    public interface IAuthService
    {
      
        Task<User> GetUserByEmailAsync(string email); 
        string GenerateJwtToken(User user);
    }
}
