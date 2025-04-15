using HomeChefServer.Services;
using Microsoft.AspNetCore.Mvc;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeminiController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public GeminiController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] string userMessage)
        {
            try
            {
                var reply = await _geminiService.SendPromptAsync(userMessage);
                return Ok(new { content = reply });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Gemini error: {ex.Message}");
            }
        }
    }
}
