using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HomeChefServer.Services;
using System.Text.Json;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // רק למשתמשים מחוברים
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
                // שליחת שאלה ברורה עם בקשה למנה אחת בלבד
                var prompt = $"What is the most iconic traditional national dish of {country}? Just return the dish name only.";
                var geminiResponse = await _geminiService.SendPromptAsync(prompt);

                if (string.IsNullOrWhiteSpace(geminiResponse))
                    return BadRequest("Could not generate a dish from Gemini.");

                var dish = geminiResponse.Trim();

                var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", _pexelsApiKey);

                var searchQuery = $"{dish} traditional {country} cuisine plated close up, professional food photo";
                var url = $"https://api.pexels.com/v1/search?query={Uri.EscapeDataString(searchQuery)}&per_page=5";

                var res = await httpClient.GetAsync(url);
                var json = await res.Content.ReadAsStringAsync();

                string imageUrl = null;

                try
                {
                    using var doc = JsonDocument.Parse(json);
                    var photos = doc.RootElement.GetProperty("photos");

                    foreach (var photo in photos.EnumerateArray())
                    {
                        var alt = photo.GetProperty("alt").GetString()?.ToLowerInvariant();
                        var urlCandidate = photo.GetProperty("src").GetProperty("large").GetString();

                        // בדיקה שהקישור לא ריק ושה-alt קשור לשם המנה
                        if (!string.IsNullOrWhiteSpace(urlCandidate) &&
                            alt != null &&
                            alt.Contains(dish.ToLowerInvariant()))
                        {
                            imageUrl = urlCandidate;
                            break;
                        }
                    }

                    // אם לא נמצאה תמונה מתאימה, נבחר את הראשונה ברשימה (fallback פנימי)
                    if (string.IsNullOrWhiteSpace(imageUrl) && photos.GetArrayLength() > 0)
                    {
                        imageUrl = photos[0].GetProperty("src").GetProperty("large").GetString();
                    }

                    // ואם עדיין אין – תמונה כללית
                    if (string.IsNullOrWhiteSpace(imageUrl))
                    {
                        imageUrl = "https://source.unsplash.com/600x400/?food";
                    }
                }
                catch
                {
                    imageUrl = "https://source.unsplash.com/600x400/?food";
                }



                return Ok(new
                {
                    title = dish,
                    imageUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }



    }
}
