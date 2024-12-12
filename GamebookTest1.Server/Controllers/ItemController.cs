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
        private readonly IWebHostEnvironment _environment;

        public ItemController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _context.Items.Include(i => i.ItemImages).ToListAsync();
            return Ok(items);
        }

        // GET: api/Item/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetItemById(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        // POST: api/Item/create-item-with-image
        [HttpPost("create-item-with-image")]
        public async Task<IActionResult> CreateItemWithImage(
            [FromForm] string itemName,
            [FromForm] string? itemDescription,
            [FromForm] List<int> imageIds // The ImageId that is already saved
        )
        {
            // Validate that the item name is provided
            if (string.IsNullOrWhiteSpace(itemName))
            {
                return BadRequest("Item Name is required.");
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

            var newItem = new Item
            {
                ItemName = itemName,
                ItemDescription = itemDescription,
                ItemImages = images,
            };

            _context.Items.Add(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItemById), new { id = newItem.ItemId }, newItem);
        }

        // DELETE: api/Item/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
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
    }
}
