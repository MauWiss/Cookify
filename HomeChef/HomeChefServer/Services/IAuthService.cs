using HomeChef.Server.Models;

namespace HomeChef.Server.Services
{
    public interface IAuthService
    {
        Task<User> ValidateUserAsync(string email, string password);
        string GenerateJwtToken(User user);
    }
}
