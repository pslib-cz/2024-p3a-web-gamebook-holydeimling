using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.Include(i => i.ItemImage).ToListAsync();
        }

        // GET: api/Item/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context
                .Items.Include(i => i.ItemImage)
                .FirstOrDefaultAsync(i => i.ItemId == id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }

        // POST: api/Item
        [HttpPost]
        public async Task<ActionResult<Item>> PostItem(Item item)
        {
            // Ensure that the ItemImage is associated with the item
            if (item.ItemImage != null)
            {
                // Begin a database transaction to ensure both image and item are saved correctly
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    // Add the image to the database
                    _context.Images.Add(item.ItemImage);
                    await _context.SaveChangesAsync(); // Save the image first to get the ImageId

                    // Assign ImageId to the item
                    item.ItemImageId = item.ItemImage.ImageId;

                    // Now, add the item
                    _context.Items.Add(item);
                    await _context.SaveChangesAsync();

                    // Commit the transaction
                    await transaction.CommitAsync();

                    return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
                }
                catch (Exception)
                {
                    // Rollback the transaction if any error occurs
                    await transaction.RollbackAsync();
                    return StatusCode(
                        500,
                        "Internal server error while saving the item and image."
                    );
                }
            }

            // In case the item does not have an image, just add it without the image
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
        }

        // PUT: api/Item/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Item/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            // Remove the item and its image
            if (item.ItemImageId.HasValue)
            {
                var image = await _context.Images.FindAsync(item.ItemImageId);
                if (image != null)
                {
                    _context.Images.Remove(image);
                }
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}
