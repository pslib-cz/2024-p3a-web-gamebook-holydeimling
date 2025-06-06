﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        // GET: api/SceneCharacter
        [HttpGet]
        public async Task<IActionResult> GetAllSceneCharacters()
        {
            var sceneCharacters = await _context
                .SceneCharacters.Include(sc => sc.Character)
                .ThenInclude(c => c.CharacterImages) // Include CharacterImages
                .Include(sc => sc.Position) // Include Position
                .Include(sc => sc.Size) // Include Size
                .ToListAsync();
            //include character
            return Ok(sceneCharacters);
        }

        // GET: api/SceneCharacter/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSceneCharacterById(int id)
        {
            var sceneCharacter = await _context
                .SceneCharacters.Include(sc => sc.Character)
                .ThenInclude(c => c.CharacterImages) // Include CharacterImages
                .Include(sc => sc.Position) // Include Position
                .Include(sc => sc.Size) // Include Size
                .FirstOrDefaultAsync(sc => sc.SceneCharacterId == id);

            if (sceneCharacter == null)
            {
                return NotFound();
            }

            return Ok(sceneCharacter);
        }

        // POST: api/SceneCharacter/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateSceneCharacter(
            [FromForm] int characterId,
            [FromForm] int positionX,
            [FromForm] int positionY,
            [FromForm] int sizeWidth,
            [FromForm] int sizeHeight
        )
        {
            // Create Position and Size objects
            var position = new Position { X = positionX, Y = positionY };
            var size = new Size { Width = sizeWidth, Height = sizeHeight };

            // Add Position and Size to the database first
            _context.Positions.Add(position);
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync(); // Save to generate IDs

            // Fetch Character and Scene from the database
            var _character = await _context.Characters.FindAsync(characterId);
            if (_character == null)
            {
                return BadRequest("Character not found.");
            }

            // Create the SceneCharacter object
            var newSceneCharacter = new SceneCharacter
            {
                Character = _character,
                Position = position, // Link to Position via PositionId
                Size = size, // Directly assign Size
            };

            // Add SceneCharacter to the context
            _context.SceneCharacters.Add(newSceneCharacter);
            await _context.SaveChangesAsync(); // Save the new SceneCharacter

            // Return a response indicating the newly created SceneCharacter
            return CreatedAtAction(
                nameof(GetSceneCharacterById),
                new { id = newSceneCharacter.SceneCharacterId },
                newSceneCharacter
            );
        }

        // PUT: api/SceneCharacter/edit/{id}
        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditSceneCharacter(
            int id,
            [FromForm] int? positionX,
            [FromForm] int? positionY,
            [FromForm] int? sizeWidth,
            [FromForm] int? sizeHeight
        )
        {
            var sceneCharacter = await _context
                .SceneCharacters.Include(sc => sc.Position)
                .Include(sc => sc.Size)
                .FirstOrDefaultAsync(sc => sc.SceneCharacterId == id);

            if (sceneCharacter == null)
            {
                return NotFound();
            }

            // Update Position
            if (positionX.HasValue)
                sceneCharacter.Position.X = positionX.Value;
            if (positionY.HasValue)
                sceneCharacter.Position.Y = positionY.Value;

            // Update Size
            if (sizeWidth.HasValue)
                sceneCharacter.Size.Width = sizeWidth.Value;
            if (sizeHeight.HasValue)
                sceneCharacter.Size.Height = sizeHeight.Value;

            // Save changes to the database
            _context.SceneCharacters.Update(sceneCharacter);
            await _context.SaveChangesAsync();

            return Ok(sceneCharacter);
        }

        // DELETE: api/SceneCharacter/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSceneCharacter(int id)
        {
            var sceneCharacter = await _context.SceneCharacters.FindAsync(id);

            if (sceneCharacter == null)
            {
                return NotFound();
            }

            _context.SceneCharacters.Remove(sceneCharacter);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
