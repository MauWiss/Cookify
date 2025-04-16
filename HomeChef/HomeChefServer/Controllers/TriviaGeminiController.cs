using Microsoft.AspNetCore.Mvc;
using HomeChefServer.Services;
using System.Text.RegularExpressions;

namespace HomeChefServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TriviaGeminiController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public TriviaGeminiController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpGet("generate")]
        public async Task<IActionResult> GenerateTrivia()
        {
            var prompt = @"Create a multiple-choice trivia question about food or cooking. Format it like this:
Question: [question here]
Options: A) [option] B) [option] C) [option] D) [option]
Answer: [correct letter]
Explanation: [optional, 1 sentence explanation]";

            var result = await _geminiService.SendPromptAsync(prompt);

            var question = Regex.Match(result, @"Question:\s*(.*?)\n").Groups[1].Value.Trim();
            var optionsRaw = Regex.Match(result, @"Options:\s*(.*?)\n").Groups[1].Value.Trim();
            var answerRaw = Regex.Match(result, @"Answer:\s*([A-Da-d])").Groups[1].Value.Trim().ToUpper();
            var explanation = Regex.Match(result, @"Explanation:\s*(.*)").Groups[1].Value.Trim();

            var optionsList = optionsRaw.Split(new[] { "A)", "B)", "C)", "D)" }, StringSplitOptions.RemoveEmptyEntries)
                                        .Select(o => o.Trim())
                                        .ToList();

            var answerIndex = "ABCD".IndexOf(answerRaw);
            var correctText = (answerIndex >= 0 && answerIndex < optionsList.Count)
                                ? optionsList[answerIndex]
                                : "";

            return Ok(new
            {
                question,
                options = optionsList,
                answer = answerRaw,      // e.g. "C"
                correctText,             // e.g. "Shallots"
                explanation
            });
        }
    }
}
