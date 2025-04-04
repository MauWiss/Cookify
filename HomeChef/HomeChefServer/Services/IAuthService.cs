using HomeChef.Server.Models;

namespace HomeChef.Server.Services
{
    public interface IAuthService
    {
        Task<User> ValidateUserAsync(string email, string password);
        Task<User> GetUserByEmailAsync(string email); 
        string GenerateJwtToken(User user);
    }
}
