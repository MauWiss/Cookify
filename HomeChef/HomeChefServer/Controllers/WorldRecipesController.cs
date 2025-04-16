using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeChefServer.Services;
using System.Text.Json;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorldRecipesController : ControllerBase
    {
        private readonly GeminiService _geminiService;
        private readonly IConfiguration _config;
        private readonly string _pexelsApiKey;

        public WorldRecipesController(GeminiService geminiService, IConfiguration config)
        {
            _geminiService = geminiService;
            _config = config;
            _pexelsApiKey = config["PexelsApiKey"];
        }

        [HttpGet("{country}")]
        public async Task<IActionResult> GetNationalDish(string country)
        {
            try
            {
                var prompt = $"What is the most iconic traditional national dish of {country}? Just return the dish name only.";
                var geminiResponse = await _geminiService.SendPromptAsync(prompt);

                if (string.IsNullOrWhiteSpace(geminiResponse))
                    return BadRequest("Could not generate dish name from Gemini.");

                var dish = CleanGeminiDishName(geminiResponse);

                if (string.IsNullOrWhiteSpace(dish))
                    return BadRequest("Could not extract a valid dish name.");

                var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", _pexelsApiKey);

                var queries = new[]
                {
                    $"{dish} {country} traditional food plated close up",
                    $"{country} national dish {dish}",
                    $"{dish} {country} food"
                };

                string imageUrl = null;

                foreach (var query in queries)
                {
                    imageUrl = await GetImageFromPexels(httpClient, query, dish);
                    if (!string.IsNullOrWhiteSpace(imageUrl))
                        break;
                }

                if (string.IsNullOrWhiteSpace(imageUrl))
                    return BadRequest("No accurate image found for this dish.");

                return Ok(new
                {
                    title = dish,
                    imageUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Server error: {ex.Message}");
            }
        }

        private string CleanGeminiDishName(string raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return null;

            var cleaned = raw.ToLowerInvariant()
                .Replace("the most iconic", "")
                .Replace("national dish of", "")
                .Replace("is", "")
                .Replace(":", "")
                .Replace(".", "")
                .Trim();

            var lines = cleaned.Split(new[] { '\n', '.', ',' }, StringSplitOptions.RemoveEmptyEntries);
            return lines.LastOrDefault()?.Trim().Split(' ').FirstOrDefault();
        }

        private async Task<string> GetImageFromPexels(HttpClient httpClient, string query, string dish)
        {
            var url = $"https://api.pexels.com/v1/search?query={Uri.EscapeDataString(query)}&per_page=6";
            var res = await httpClient.GetAsync(url);
            var json = await res.Content.ReadAsStringAsync();

            try
            {
                using var doc = JsonDocument.Parse(json);
                var photos = doc.RootElement.GetProperty("photos");

                foreach (var photo in photos.EnumerateArray())
                {
                    var alt = photo.GetProperty("alt").GetString()?.ToLowerInvariant() ?? "";
                    var image = photo.GetProperty("src").GetProperty("large").GetString();

                    if (alt.Contains(dish.ToLowerInvariant()))
                        return image;
                }
            }
            catch
            {
                return null;
            }

            return null; // ❌ לא מחזירים סתם את התמונה הראשונה
        }
    }
}
