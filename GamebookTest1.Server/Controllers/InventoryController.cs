using System.Security.Policy;
using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public InventoryController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInventories()
        {
            var inventories = await _context
                .Inventories.Include(i => i.Item1)
                .ThenInclude(a => a.ItemImages)
                .Include(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .ToListAsync();
            return Ok(inventories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInventoryById(int id)
        {
            var inventory = await _context
                .Inventories.Include(i => i.Item1)
                .ThenInclude(a => a.ItemImages)
                .Include(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.InventoryId == id);
            if (inventory == null)
            {
                return NotFound();
            }
            return Ok(inventory);
        }

        [HttpPost("create-inventory")]
        public async Task<IActionResult> CreateInventory(
            [FromForm] int? item1Id,
            [FromForm] int? item2Id,
            [FromForm] int? item3Id,
            [FromForm] int? item4Id,
            [FromForm] int? item5Id,
            [FromForm] int? item6Id,
            [FromForm] int? item7Id,
            [FromForm] int? item8Id,
            [FromForm] int? item9Id
        )
        {
            var _item1 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item1Id);
            var _item2 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item2Id);
            var _item3 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item3Id);
            var _item4 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item4Id);
            var _item5 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item5Id);
            var _item6 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item6Id);
            var _item7 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item7Id);
            var _item8 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item8Id);
            var _item9 = await _context
                .Items.Include(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.ItemId == item9Id);

            var _inventory = new Inventory
            {
                Item1 = _item1,
                Item2 = _item2,
                Item3 = _item3,
                Item4 = _item4,
                Item5 = _item5,
                Item6 = _item6,
                Item7 = _item7,
                Item8 = _item8,
                Item9 = _item9,
            };

            _context.Inventories.Add(_inventory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                "GetInventoryById",
                new { id = _inventory.InventoryId },
                _inventory
            );
        }

        [HttpPut("edit/{id}")]
        public async Task<IActionResult> EditInventory(
            int id,
            [FromForm] int? item1Id,
            [FromForm] int? item2Id,
            [FromForm] int? item3Id,
            [FromForm] int? item4Id,
            [FromForm] int? item5Id,
            [FromForm] int? item6Id,
            [FromForm] int? item7Id,
            [FromForm] int? item8Id,
            [FromForm] int? item9Id
        )
        {
            var _inventory = await _context
                .Inventories.Include(i => i.Item1)
                .ThenInclude(a => a.ItemImages)
                .Include(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.InventoryId == id);
            if (_inventory == null)
            {
                return NotFound();
            }

            if (item1Id.HasValue)
            {
                var _item1 = await _context.Items.FindAsync(item1Id);
                if (_item1 == null)
                {
                    return BadRequest("Item 1 not found.");
                }
                _inventory.Item1 = _item1;
            }
            else
            {
                _inventory.Item1 = null;
            }

            if (item2Id.HasValue)
            {
                var _item2 = await _context.Items.FindAsync(item2Id);
                if (_item2 == null)
                {
                    return BadRequest("Item 2 not found.");
                }
                _inventory.Item2 = _item2;
            }
            else
            {
                _inventory.Item2 = null;
            }

            if (item3Id.HasValue)
            {
                var _item3 = await _context.Items.FindAsync(item3Id);
                if (_item3 == null)
                {
                    return BadRequest("Item 3 not found.");
                }
                _inventory.Item3 = _item3;
            }
            else
            {
                _inventory.Item3 = null;
            }

            if (item4Id.HasValue)
            {
                var _item4 = await _context.Items.FindAsync(item4Id);
                if (_item4 == null)
                {
                    return BadRequest("Item 4 not found.");
                }
                _inventory.Item4 = _item4;
            }
            else
            {
                _inventory.Item4 = null;
            }

            if (item5Id.HasValue)
            {
                var _item5 = await _context.Items.FindAsync(item5Id);
                if (_item5 == null)
                {
                    return BadRequest("Item 5 not found.");
                }
                _inventory.Item5 = _item5;
            }
            else
            {
                _inventory.Item5 = null;
            }

            if (item6Id.HasValue)
            {
                var _item6 = await _context.Items.FindAsync(item6Id);
                if (_item6 == null)
                {
                    return BadRequest("Item 6 not found.");
                }
                _inventory.Item6 = _item6;
            }
            else
            {
                _inventory.Item6 = null;
            }

            if (item7Id.HasValue)
            {
                var _item7 = await _context.Items.FindAsync(item7Id);
                if (_item7 == null)
                {
                    return BadRequest("Item 7 not found.");
                }
                _inventory.Item7 = _item7;
            }
            else
            {
                _inventory.Item7 = null;
            }

            if (item8Id.HasValue)
            {
                var _item8 = await _context.Items.FindAsync(item8Id);
                if (_item8 == null)
                {
                    return BadRequest("Item 8 not found.");
                }
                _inventory.Item8 = _item8;
            }
            else
            {
                _inventory.Item8 = null;
            }

            if (item9Id.HasValue)
            {
                var _item9 = await _context.Items.FindAsync(item9Id);
                if (_item9 == null)
                {
                    return BadRequest("Item 9 not found.");
                }
                _inventory.Item9 = _item9;
            }
            else
            {
                _inventory.Item9 = null;
            }

            _context.Inventories.Update(_inventory);
            await _context.SaveChangesAsync();

            return Ok(_inventory);
        }

        [HttpPut("{inventoryId}/add-item/")]
        public async Task<IActionResult> EditInventoryById(
            int inventoryId,
            int itemNumber,
            int itemId
        )
        {
            var _inventory = await _context.Inventories.FindAsync(inventoryId);
            if (_inventory == null)
            {
                return NotFound();
            }

            var _item = await _context.Items.FindAsync(itemId);
            if (_item == null)
            {
                return BadRequest("Item not found.");
            }

            switch (itemNumber)
            {
                case 1:
                    _inventory.Item1 = _item;
                    break;
                case 2:
                    _inventory.Item2 = _item;
                    break;
                case 3:
                    _inventory.Item3 = _item;
                    break;
                case 4:
                    _inventory.Item4 = _item;
                    break;
                case 5:
                    _inventory.Item5 = _item;
                    break;
                case 6:
                    _inventory.Item6 = _item;
                    break;
                case 7:
                    _inventory.Item7 = _item;
                    break;
                case 8:
                    _inventory.Item8 = _item;
                    break;
                case 9:
                    _inventory.Item9 = _item;
                    break;
                default:
                    return BadRequest("Invalid item number.");
            }

            await _context.SaveChangesAsync();

            var inventory = await _context
                .Inventories.Include(i => i.Item1)
                .ThenInclude(a => a.ItemImages)
                .Include(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.InventoryId == inventoryId);

            return Ok(inventory);
        }

        [HttpPut("{inventoryId}/remove-item/")]
        public async Task<IActionResult> RemoveItemFromInventory(int inventoryId, int itemNumber)
        {
            var _inventory = await _context.Inventories.FindAsync(inventoryId);
            if (_inventory == null)
            {
                return NotFound();
            }

            switch (itemNumber)
            {
                case 1:
                    _inventory.Item1 = null;
                    break;
                case 2:
                    _inventory.Item2 = null;
                    break;
                case 3:
                    _inventory.Item3 = null;
                    break;
                case 4:
                    _inventory.Item4 = null;
                    break;
                case 5:
                    _inventory.Item5 = null;
                    break;
                case 6:
                    _inventory.Item6 = null;
                    break;
                case 7:
                    _inventory.Item7 = null;
                    break;
                case 8:
                    _inventory.Item8 = null;
                    break;
                case 9:
                    _inventory.Item9 = null;
                    break;
                default:
                    return BadRequest("Invalid item number.");
            }

            await _context.SaveChangesAsync();
            var inventory = await _context
                .Inventories.Include(i => i.Item1)
                .ThenInclude(a => a.ItemImages)
                .Include(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.InventoryId == inventoryId);

            return Ok(inventory);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var inventory = await _context.Inventories.FindAsync(id);
            if (inventory == null)
            {
                return NotFound();
            }

            _context.Inventories.Remove(inventory);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
