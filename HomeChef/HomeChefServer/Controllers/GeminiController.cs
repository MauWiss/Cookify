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
        private readonly string _pexelsApiKey;

        public GeminiController(GeminiService geminiService, IConfiguration config)
        {
            _geminiService = geminiService;
            _pexelsApiKey = config["PexelsApiKey"];
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
    


        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            try
            {
                // נחלץ מילות מפתח קולינריות עם Gemini (NLP)
                var keywords = await _geminiService.ExtractFoodKeywordsSmartAsync(query);
                var cleaned = keywords?.Trim();

                // אם לא הצליח לחלץ או קיבלנו טקסט קצר מדי – נ fallback לתמונה כללית
                if (string.IsNullOrWhiteSpace(cleaned) || cleaned.Length < 2)
                {
                    return Ok(new { imageUrl = "https://source.unsplash.com/600x400/?chef,robot" });
                }

                var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", _pexelsApiKey);


                var url = $"https://api.pexels.com/v1/search?query={Uri.EscapeDataString(cleaned)}&per_page=1";
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
