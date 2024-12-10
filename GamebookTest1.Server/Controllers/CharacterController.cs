using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharacterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public CharacterController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Character
        [HttpGet]
        public async Task<IActionResult> GetAllCharacters()
        {
            var characters = await _context
                .Characters.Include(c => c.CharacterImages)
                .ToListAsync();
            return Ok(characters);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCharacterById(int id)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                return NotFound();
            }
            return Ok(character);
        }

        [HttpPost("create-character-with-images")]
        public async Task<IActionResult> CreateCharacterWithImages(
            [FromForm] string firstName,
            [FromForm] string lastName,
            [FromForm] string? nickname,
            [FromForm] string? backStory,
            [FromForm] List<int>? imageIds // List of Image IDs to associate
        )
        {
            if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
            {
                return BadRequest("First Name and Last Name are required.");
            }

            // Fetch images from database based on provided IDs
            var images = new List<Image>();
            if (imageIds != null && imageIds.Any())
            {
                images = await _context
                    .Images.Where(img => imageIds.Contains(img.ImageId))
                    .ToListAsync();

                if (images.Count != imageIds.Count)
                {
                    return BadRequest("One or more Image IDs are invalid.");
                }
            }

            // Create the new Character
            var newCharacter = new Character
            {
                FirstName = firstName,
                LastName = lastName,
                Nickname = nickname,
                BackStory = backStory,
                CharacterImages = images,
            };

            // Update CharacterId in the images
            foreach (var image in images)
            {
                image.CharacterId = newCharacter.CharacterId;
            }

            _context.Characters.Add(newCharacter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCharacterById),
                new { id = newCharacter.CharacterId },
                newCharacter
            );
        }

        // DELETE: api/Character/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCharacter(int id)
        {
            var character = await _context.Characters.FindAsync(id);
            if (character == null)
            {
                return NotFound();
            }

            _context.Characters.Remove(character);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
