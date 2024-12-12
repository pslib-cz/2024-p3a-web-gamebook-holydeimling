using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // GET: api/SceneItem
        [HttpGet]
        public async Task<IActionResult> GetAllSceneItems()
        {
            var sceneItems = await _context
                .SceneItems.Include(si => si.Item)
                .ThenInclude(i => i.ItemImages) // Include ItemImages
                .Include(si => si.Position) // Include Position
                .Include(si => si.Size) // Include Size
                .ToListAsync();
            return Ok(sceneItems);
        }

        // GET: api/SceneItem/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSceneItemById(int id)
        {
            var sceneItem = await _context
                .SceneItems.Include(si => si.Item)
                .ThenInclude(i => i.ItemImages) // Include ItemImages
                .Include(si => si.Position) // Include Position
                .Include(si => si.Size) // Include Size
                .FirstOrDefaultAsync(si => si.SceneItemId == id);

            if (sceneItem == null)
            {
                return NotFound();
            }

            return Ok(sceneItem);
        }

        // POST: api/SceneItem/create-scene-item
        [HttpPost("create-scene-item")]
        public async Task<IActionResult> CreateSceneItem(
            [FromForm] int itemId,
            [FromForm] int positionX,
            [FromForm] int positionY,
            [FromForm] int sizeWidth,
            [FromForm] int sizeHeight
        )
        {
            var position = new Position { X = positionX, Y = positionY };
            var size = new Size { Width = sizeWidth, Height = sizeHeight };

            _context.Positions.Add(position);
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();

            var _item = await _context.Items.FindAsync(itemId);
            if (_item == null)
            {
                return BadRequest("Item not found.");
            }

            var newSceneItem = new SceneItem
            {
                Item = _item,
                Position = position,
                Size = size,
            };

            _context.SceneItems.Add(newSceneItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSceneItemById),
                new { id = newSceneItem.SceneItemId },
                newSceneItem
            );
        }
    }
}
