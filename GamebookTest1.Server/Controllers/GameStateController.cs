using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameStateController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public GameStateController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/GameState
        [HttpGet]
        public async Task<IActionResult> GetGameState()
        {
            var gameStates = await _context.GameStates
                .Include(q => q.QuestsState)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item1)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .ToListAsync();

            return Ok(gameStates);
        }

        // GET: api/GameState/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameStateById(int id)
        {
            var gameState = await _context.GameStates.Include(q => q.QuestsState)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item1)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.GameStateId == id);
            if (gameState == null)
            {
                return NotFound();
            }
            return Ok(gameState);
        }

        //PUT: api/GameState/edit/CheckpointSceneId/{id}
        [HttpPut("edit/CheckpointSceneId/{id}")]
        public async Task<IActionResult> EditGameStateCheckpointSceneId(int id, [FromForm] int checkpointSceneId)
        {
            var gameState = await _context.GameStates.FirstOrDefaultAsync(i => i.GameStateId == id);
            if (gameState == null)
            {
                return NotFound();
            }
            gameState.CheckpointSceneId = checkpointSceneId;
            await _context.SaveChangesAsync();
            return Ok(gameState);
        }

        //PUT: api/GameState/edit/QuestsState/{id}
        [HttpPut("edit/QuestsState/{id}")]
        public async Task<IActionResult> EditGameStateQuestsState(int id, [FromForm] List<int> questsIds)
        {
            var gameState = await _context.GameStates.Include(q => q.QuestsState)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item1)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item2)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item3)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item4)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item5)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item6)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item7)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item8)
                .ThenInclude(i => i.ItemImages)
                .Include(i => i.InventoryState)
                .ThenInclude(i => i.Item9)
                .ThenInclude(i => i.ItemImages)
                .FirstOrDefaultAsync(i => i.GameStateId == id);
            if (gameState == null)
            {
                return NotFound();
            }

            if(questsIds != null && questsIds.Any())
            {
                var quests = await _context.Quests.Where(q => questsIds.Contains(q.QuestId)).ToListAsync();
                if (quests.Count != questsIds.Count)
                {
                    return BadRequest("One or more Quest IDs are invalid.");
                }
                gameState.QuestsState = quests;
            }
            else
            {
                gameState.QuestsState = new List<Quest>();
            }

            await _context.SaveChangesAsync();
            return Ok(gameState);

        }

    }
}
