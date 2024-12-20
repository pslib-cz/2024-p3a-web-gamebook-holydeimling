using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DialogController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public DialogController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Dialog
        [HttpGet]
        public async Task<IActionResult> GetAllDialogs()
        {
            var dialogs = await _context
                .Dialogs.Include(i => i.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(d => d.DialogAnswers)
                .ToListAsync();
            return Ok(dialogs);
        }

        // GET: api/Dialog/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDialogById(int id)
        {
            var dialog = await _context
                .Dialogs.Include(i => i.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(d => d.DialogAnswers)
                .FirstOrDefaultAsync(c => c.DialogId == id);
            if (dialog == null)
            {
                return NotFound();
            }
            return Ok(dialog);
        }

        //POST: api/Dialog/create-dialog
        [HttpPost("create-dialog-with-character")]
        public async Task<IActionResult> CreateDialogWithCharacter(
            [FromForm] int characterId,
            [FromForm] string text,
            [FromForm] List<int> dialogAnswersIds
        )
        {
            var _dialogAnswers = new List<DialogAnswer>();
            if (dialogAnswersIds != null)
            {
                _dialogAnswers = await _context
                    .DialogAnswers.Where(da => dialogAnswersIds.Contains(da.DialogAnswerId))
                    .ToListAsync();
            }

            if (string.IsNullOrWhiteSpace(text))
            {
                return BadRequest("Text is required.");
            }

            var character = await _context
                .Characters.Where(cha => cha.CharacterId == characterId)
                .FirstOrDefaultAsync();

            if (character == null)
            {
                return BadRequest("Character not found.");
            }

            if (_dialogAnswers.Count == 0)
            {
                return BadRequest("DialogAnswers not found.");
            }

            var newDialog = new Dialog
            {
                Character = character,
                Text = text,
                DialogAnswers = _dialogAnswers,
            };

            _context.Dialogs.Add(newDialog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetDialogById),
                new { id = newDialog.DialogId },
                newDialog
            );
        }

        [HttpPut("edit-dialog/{id}")]
        public async Task<IActionResult> EditDialog(
            int id,
            [FromForm] int? characterId,
            [FromForm] string? text,
            [FromForm] List<int>? dialogAnswersIds
        )
        {
            var dialog = await _context
                .Dialogs.Include(d => d.DialogAnswers)
                .FirstOrDefaultAsync(d => d.DialogId == id);

            if (dialog == null)
            {
                return NotFound();
            }

            if (characterId.HasValue)
            {
                var character = await _context.Characters.FindAsync(characterId.Value);
                if (character == null)
                {
                    return BadRequest("Character not found.");
                }
                dialog.Character = character;
            }

            if (!string.IsNullOrWhiteSpace(text))
            {
                dialog.Text = text;
            }

            if (dialogAnswersIds != null)
            {
                var _dialogAnswers = await _context
                    .DialogAnswers.Where(da => dialogAnswersIds.Contains(da.DialogAnswerId))
                    .ToListAsync();

                if (_dialogAnswers.Count == 0)
                {
                    return BadRequest("DialogAnswers not found.");
                }

                dialog.DialogAnswers = _dialogAnswers;
            }

            _context.Dialogs.Update(dialog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDialog(int id)
        {
            var dialog = await _context.Dialogs.FindAsync(id);
            if (dialog == null)
            {
                return NotFound();
            }

            _context.Dialogs.Remove(dialog);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
