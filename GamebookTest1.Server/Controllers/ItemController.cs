using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ItemController> _logger;

        public ItemController(AppDbContext context, ILogger<ItemController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            try
            {
                var items = await _context.Items.Include(i => i.ItemImage).ToListAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting items.");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Item/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            try
            {
                var item = await _context
                    .Items.Include(i => i.ItemImage)
                    .FirstOrDefaultAsync(i => i.ItemId == id);

                if (item == null)
                {
                    return NotFound();
                }

                return Ok(item);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting item with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Item/create-item-with-image
        [HttpPost("create-item-with-image")]
        public async Task<IActionResult> CreateItemWithImage(
            [FromForm] string itemName,
            [FromForm] string? itemDescription,
            [FromForm] int? imageId // The ImageId that is already saved
        )
        {
            // Validate that the item name is provided
            if (string.IsNullOrWhiteSpace(itemName))
            {
                return BadRequest("Item Name is required.");
            }

            // Fetch the image from the database using ImageId
            var image = _context.Images.FirstOrDefault(i => i.ImageId == imageId);
            if (image == null)
            {
                return BadRequest("Image not found.");
            }

            // Create new Item entity and associate the image with it
            var newItem = new Item
            {
                ItemName = itemName,
                ItemDescription = itemDescription,
                ItemImage = image,
            };

            // Save the new item to the database
            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = newItem.ItemId }, newItem);
        }

        // DELETE: api/Item/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            try
            {
                var item = await _context.Items.FindAsync(id);

                if (item == null)
                {
                    return NotFound();
                }

                _context.Items.Remove(item);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting item with ID {id}.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
