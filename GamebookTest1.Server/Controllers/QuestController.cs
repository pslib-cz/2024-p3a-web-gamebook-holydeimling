using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuests()
        {
            var quests = await _context.Quests.ToListAsync();
            return Ok(quests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestById(int id)
        {
            var quest = await _context.Quests.FindAsync(id);
            if (quest == null)
            {
                return NotFound();
            }
            return Ok(quest);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateQuest(
            [FromForm] string questHeading,
            [FromForm] string questContent
            )
        {
            if (string.IsNullOrWhiteSpace(questHeading))
            {
                return BadRequest("Quest Heading is required.");
            }

            if (string.IsNullOrWhiteSpace(questContent))
            {
                return BadRequest("Quest Content is required.");
            }

            var quest = new Quest
            {
                QuestHeading = questHeading,
                QuestContent = questContent,
            };

            _context.Quests.Add(quest);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetQuestById), new { id = quest.QuestId }, quest);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditQuest(
            int id,
            [FromForm] string? questHeading,
            [FromForm] string? questContent
        )
        {
            var quest = await _context.Quests.FindAsync(id);

            if (quest == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(questHeading))
            {
                quest.QuestHeading = questHeading;
            }

            if (!string.IsNullOrWhiteSpace(questContent))
            {
                quest.QuestContent = questContent;
            }

            await _context.SaveChangesAsync();
            return Ok(quest);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteQuest(int id)
        {
            var quest = await _context.Quests.FindAsync(id);

            if (quest == null)
            {
                return NotFound();
            }

            _context.Quests.Remove(quest);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
