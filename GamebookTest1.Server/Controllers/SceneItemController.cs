using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SceneItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SceneItemController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/SceneItem
        [HttpPost]
        public async Task<ActionResult<SceneItem>> PostSceneItem(SceneItem sceneItem)
        {
            // Add the new scene item to the database
            _context.SceneItems.Add(sceneItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSceneItem", new { id = sceneItem.SceneItemId }, sceneItem);
        }

        // Example Get for SceneItem
        [HttpGet("{id}")]
        public async Task<ActionResult<SceneItem>> GetSceneItem(int id)
        {
            var sceneItem = await _context.SceneItems.FindAsync(id);

            if (sceneItem == null)
            {
                return NotFound();
            }

            return sceneItem;
        }
    }
}
