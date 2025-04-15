using HomeChefServer.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

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

        [HttpGet("pexels/search")]
        public async Task<IActionResult> SearchImage([FromQuery] string query)
        {
            try
            {
                var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", "sVkbVmdjdjSbsvpUDm7Kgui23ggEqCtfXDHKUwzdbHZl8yQSU4O0oxfE");

                var url = $"https://api.pexels.com/v1/search?query={Uri.EscapeDataString(query)}&per_page=1";
                var response = await client.GetAsync(url);
                var json = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(json);
                var photoUrl = doc.RootElement
                    .GetProperty("photos")[0]
                    .GetProperty("src")
                    .GetProperty("large")
                    .GetString();

                return Ok(new { imageUrl = photoUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching image from Pexels: {ex.Message}");
            }
        }

    }
}
