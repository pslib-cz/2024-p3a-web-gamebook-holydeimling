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
            var characters = await _context.Characters.ToListAsync();
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

        [HttpPost]
        public async Task<IActionResult> CreateCharacter([FromBody] Character character)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if any nested objects need to be added or linked
            if (character.CharacterImages != null && character.CharacterImages.Any())
            {
                foreach (var image in character.CharacterImages)
                {
                    if (image.Item != null)
                    {
                        _context.Items.Add(image.Item); // Add associated Item if provided
                    }

                    if (image.Scene != null)
                    {
                        // Add associated Scene, including nested SceneCharacters, SceneItems, and SceneDialogs
                        if (image.Scene.SceneCharacters != null)
                        {
                            foreach (var sceneCharacter in image.Scene.SceneCharacters)
                            {
                                _context.SceneCharacters.Add(sceneCharacter);
                            }
                        }

                        if (image.Scene.SceneItems != null)
                        {
                            foreach (var sceneItem in image.Scene.SceneItems)
                            {
                                _context.SceneItems.Add(sceneItem);
                            }
                        }

                        if (image.Scene.SceneDialogs != null)
                        {
                            foreach (var dialog in image.Scene.SceneDialogs)
                            {
                                _context.Dialogs.Add(dialog);
                            }
                        }

                        _context.Scenes.Add(image.Scene);
                    }

                    _context.Images.Add(image); // Add the Image itself
                }
            }

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCharacterById),
                new { id = character.CharacterId },
                character
            );
        }

        [HttpPost]
        [Route("create-character-with-image")]
        public async Task<IActionResult> CreateCharacterWithImage(
            [FromForm] string firstName,
            [FromForm] string lastName,
            [FromForm] string? nickname,
            [FromForm] string? backStory,
            [FromForm] int? imageId // The ImageId that is already saved
        )
        {
            if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
            {
                return BadRequest("First Name and Last Name are required.");
            }

            // Fetch the image from the database using ImageId
            var image = _context.Images.FirstOrDefault(i => i.ImageId == imageId);
            if (image == null)
            {
                return BadRequest("Image not found.");
            }

            // Create new Character entity
            var newCharacter = new Character
            {
                FirstName = firstName,
                LastName = lastName,
                Nickname = nickname,
                BackStory = backStory,
                CharacterImages = new List<Image>
                {
                    image,
                } // Add the image to the character's collection
                ,
            };

            // Save the new character to the database
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
