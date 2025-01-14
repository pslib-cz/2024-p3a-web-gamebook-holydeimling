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
            [FromForm] int? nextSceneId,
            [FromForm] int? nextDialogId
        )
        {
            if (string.IsNullOrWhiteSpace(answerText))
            {
                return BadRequest("Answer text is required.");
            }

            if (nextSceneId.HasValue && nextSceneId <= 0)
            {
                return BadRequest("NextSceneId must be a positive integer or null.");
            }

            if (nextDialogId.HasValue && nextDialogId <= 0)
            {
                return BadRequest("NextDialogId must be a positive integer or null.");
            }

            var dialogAnswer = new DialogAnswer
            {
                AnswerText = answerText,
                NextSceneId = nextSceneId,
                NextDialogId = nextDialogId,
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
            [FromForm] int? nextSceneId,
            [FromForm] int? nextDialogId
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
                if (nextSceneId.Value <= 0)
                {
                    return BadRequest("NextSceneId must be a positive integer or null.");
                }
                dialogAnswer.NextSceneId = nextSceneId.Value;
            }

            if (nextDialogId.HasValue)
            {
                if (nextDialogId.Value <= 0)
                {
                    return BadRequest("NextDialogId must be a positive integer or null.");
                }
                dialogAnswer.NextDialogId = nextDialogId.Value;
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
