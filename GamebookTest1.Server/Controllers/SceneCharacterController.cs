using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SceneCharacterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SceneCharacterController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/SceneCharacter
        [HttpPost]
        public async Task<ActionResult<SceneCharacter>> PostSceneCharacter(
            SceneCharacter sceneCharacter
        )
        {
            // Add the new scene character to the database
            _context.SceneCharacters.Add(sceneCharacter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                "GetSceneCharacter",
                new { id = sceneCharacter.SceneCharacterId },
                sceneCharacter
            );
        }

        // Example Get for SceneCharacter
        [HttpGet("{id}")]
        public async Task<ActionResult<SceneCharacter>> GetSceneCharacter(int id)
        {
            var sceneCharacter = await _context.SceneCharacters.FindAsync(id);

            if (sceneCharacter == null)
            {
                return NotFound();
            }

            return sceneCharacter;
        }
    }
}
