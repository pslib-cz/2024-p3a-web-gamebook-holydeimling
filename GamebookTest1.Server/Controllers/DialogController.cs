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
            [FromForm] string text
        )
        {
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

            var newDialog = new Dialog { Character = character, Text = text };

            _context.Dialogs.Add(newDialog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetDialogById),
                new { id = newDialog.DialogId },
                newDialog
            );
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
