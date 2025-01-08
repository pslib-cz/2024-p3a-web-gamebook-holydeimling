using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SceneController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SceneController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllScenes()
        {
            var scenes = await _context
                .Scenes.Include(s => s.SceneCharacters)
                .ThenInclude(sc => sc.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(s => s.SceneCharacters)
                .ThenInclude(s => s.Size)
                .Include(s => s.SceneCharacters)
                .ThenInclude(p => p.Position)
                .Include(s => s.SceneItems)
                .ThenInclude(si => si.Item)
                .ThenInclude(i => i.ItemImages)
                .Include(s => s.SceneItems)
                .ThenInclude(s => s.Position)
                .Include(s => s.SceneItems)
                .ThenInclude(s => s.Size)
                .Include(s => s.SceneDialogs)
                .ThenInclude(sd => sd.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(s => s.SceneDialogs)
                .ThenInclude(s => s.DialogAnswers)
                .Include(s => s.BackgroundImage)
                .ToListAsync();
            return Ok(scenes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSceneById(int id)
        {
            var scene = await _context
                .Scenes.Include(s => s.SceneCharacters)
                .ThenInclude(sc => sc.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(s => s.SceneCharacters)
                .ThenInclude(s => s.Size)
                .Include(s => s.SceneCharacters)
                .ThenInclude(p => p.Position)
                .Include(s => s.SceneItems)
                .ThenInclude(si => si.Item)
                .ThenInclude(i => i.ItemImages)
                .Include(s => s.SceneItems)
                .ThenInclude(s => s.Position)
                .Include(s => s.SceneItems)
                .ThenInclude(s => s.Size)
                .Include(s => s.SceneDialogs)
                .ThenInclude(sd => sd.Character)
                .ThenInclude(c => c.CharacterImages)
                .Include(s => s.SceneDialogs)
                .ThenInclude(s => s.DialogAnswers)
                .Include(s => s.BackgroundImage)
                .FirstOrDefaultAsync(s => s.SceneId == id);

            if (scene == null)
            {
                return NotFound();
            }

            return Ok(scene);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateScene(
            [FromForm] int imageId,
            [FromForm] string sceneName,
            [FromForm] List<int> sceneCharactersIds,
            [FromForm] List<int> sceneItemsIds,
            [FromForm] List<int> sceneDialogsIds,
            [FromForm] bool isCheckpoint,
            [FromForm] int? minigameId,
            [FromForm] int? questToAddId,
            [FromForm] int? questToRemoveId
        )
        {
            var _image = await _context.Images.FindAsync(imageId);
            var _sceneCharacters = new List<SceneCharacter>();
            var _sceneItems = new List<SceneItem>();
            var _sceneDialogs = new List<Dialog>();
            if (sceneCharactersIds != null && sceneCharactersIds.Any())
            {
                _sceneCharacters = await _context
                    .SceneCharacters.Include(sc => sc.Character)
                    .Include(sc => sc.Position)
                    .Include(sc => sc.Size)
                    .Where(sc => sceneCharactersIds.Contains(sc.SceneCharacterId))
                    .ToListAsync();
            }
            if (sceneItemsIds != null && sceneItemsIds.Any())
            {
                _sceneItems = await _context
                    .SceneItems.Include(si => si.Item)
                    .Include(si => si.Position)
                    .Include(si => si.Size)
                    .Where(si => sceneItemsIds.Contains(si.SceneItemId))
                    .ToListAsync();
            }
            if (sceneDialogsIds != null && sceneDialogsIds.Any())
            {
                _sceneDialogs = await _context
                    .Dialogs.Include(d => d.Character)
                    .ThenInclude(c => c.CharacterImages)
                    .Include(d => d.DialogAnswers)
                    .Where(d => sceneDialogsIds.Contains(d.DialogId))
                    .ToListAsync();
            }

            if (_image == null)
            {
                return BadRequest("Image not found.");
            }

            var newScene = new Scene
            {
                BackgroundImage = _image,
                SceneName = sceneName,
                SceneCharacters = _sceneCharacters,
                SceneItems = _sceneItems,
                SceneDialogs = _sceneDialogs,
                IsCheckpoint = isCheckpoint,
                MinigameId = minigameId,
                QuestToAddId = questToAddId,
                QuestToRemoveId = questToRemoveId,
            };

            _context.Scenes.Add(newScene);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSceneById), new { id = newScene.SceneId }, newScene);
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditScene(
            int id,
            [FromForm] int? imageId,
            [FromForm] string? sceneName,
            [FromForm] List<int>? sceneCharactersIds,
            [FromForm] List<int>? sceneItemsIds,
            [FromForm] List<int>? sceneDialogsIds,
            [FromForm] bool? isCheckpoint,
            [FromForm] int? minigameId,
            [FromForm] int? questToAddId,
            [FromForm] int? questToRemoveId
        )
        {
            var scene = await _context
                .Scenes.Include(s => s.SceneCharacters)
                .Include(s => s.SceneItems)
                .Include(s => s.SceneDialogs)
                .FirstOrDefaultAsync(s => s.SceneId == id);

            if (scene == null)
            {
                return NotFound();
            }

            if (imageId.HasValue)
            {
                var newImage = await _context.Images.FindAsync(imageId.Value);
                if (newImage == null)
                {
                    return BadRequest("Invalid image ID.");
                }
                scene.BackgroundImage = newImage;
            }

            if (!string.IsNullOrWhiteSpace(sceneName))
            {
                scene.SceneName = sceneName;
            }

            if (sceneCharactersIds != null)
            {
                var newSceneCharacters = await _context
                    .SceneCharacters.Where(sc => sceneCharactersIds.Contains(sc.SceneCharacterId))
                    .ToListAsync();
                scene.SceneCharacters = newSceneCharacters;
            }

            if (sceneItemsIds != null)
            {
                var newSceneItems = await _context
                    .SceneItems.Where(si => sceneItemsIds.Contains(si.SceneItemId))
                    .ToListAsync();
                scene.SceneItems = newSceneItems;
            }

            if (sceneDialogsIds != null)
            {
                var newSceneDialogs = await _context
                    .Dialogs.Where(d => sceneDialogsIds.Contains(d.DialogId))
                    .ToListAsync();
                scene.SceneDialogs = newSceneDialogs;
            }

            if (isCheckpoint.HasValue)
            {
                scene.IsCheckpoint = isCheckpoint.Value;
            }

            if (minigameId.HasValue)
            {
                scene.MinigameId = minigameId;
            }

            if (questToAddId.HasValue)
            {
                scene.QuestToAddId = questToAddId;
            }

            if (questToRemoveId.HasValue)
            {
                scene.QuestToRemoveId = questToRemoveId;
            }

            _context.Scenes.Update(scene);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScene(int id)
        {
            var scene = await _context.Scenes.FindAsync(id);
            if (scene == null)
            {
                return NotFound();
            }

            _context.Scenes.Remove(scene);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
