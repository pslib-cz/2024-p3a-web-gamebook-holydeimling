using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DialogAnswerController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public DialogAnswerController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDialogAnswers()
        {
            var dialogAnswers = await _context.DialogAnswers.ToListAsync();
            return Ok(dialogAnswers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDialogAnswerById(int id)
        {
            var dialogAnswer = await _context.DialogAnswers.FindAsync(id);
            if (dialogAnswer == null)
            {
                return NotFound();
            }
            return Ok(dialogAnswer);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateDialogAnswer(
            [FromForm] string answerText,
            [FromForm] int? nextSceneId
        )
        {
            if (string.IsNullOrWhiteSpace(answerText))
            {
                return BadRequest("Answer text is required.");
            }
            if (nextSceneId == 0)
            {
                return BadRequest("Next scene shouldn't be 0.");
            }

            var dialogAnswer = new DialogAnswer
            {
                AnswerText = answerText,
                NextSceneId = nextSceneId,
            };

            await _context.DialogAnswers.AddAsync(dialogAnswer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetDialogAnswerById),
                new { id = dialogAnswer.DialogAnswerId },
                dialogAnswer
            );
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditDialogAnswer(
            int id,
            [FromForm] string? answerText,
            [FromForm] int? nextSceneId
        )
        {
            var dialogAnswer = await _context.DialogAnswers.FindAsync(id);
            if (dialogAnswer == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(answerText))
            {
                dialogAnswer.AnswerText = answerText;
            }

            if (nextSceneId.HasValue)
            {
                dialogAnswer.NextSceneId = nextSceneId.Value;
            }

            _context.DialogAnswers.Update(dialogAnswer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDialogAnswer(int id)
        {
            var dialogAnswer = await _context.DialogAnswers.FindAsync(id);
            if (dialogAnswer == null)
            {
                return NotFound();
            }

            _context.DialogAnswers.Remove(dialogAnswer);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
