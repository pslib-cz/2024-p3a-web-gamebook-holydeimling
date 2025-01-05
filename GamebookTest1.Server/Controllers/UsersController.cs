using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace GamebookTest1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context
                .Users.Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item1)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item2)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item3)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item4)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item5)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item6)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item7)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item8)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item9)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(q => q.QuestsState)
                .ToListAsync();
            return Ok(users);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromForm] string userName,
            [FromForm] string email,
            [FromForm] string password,
            [FromForm] string confirmPassword,
            [FromForm] UserRole? userRole = null
        )
        {
            //create new gamaeState
            var createdCurrentInventory = new Inventory();
            _context.Inventories.Add(createdCurrentInventory);
            var createdCurrentQuests = new List<Quest>();
            _context.Quests.AddRange(createdCurrentQuests);
            await _context.SaveChangesAsync();

            var gameState = new GameState
            {
                InventoryState = createdCurrentInventory,
                QuestsState = createdCurrentQuests,
                CheckpointSceneId = 1,
            };
            _context.GameStates.Add(gameState);
            await _context.SaveChangesAsync();

            // Create a DTO-like object for validation
            var registerDto = new UserRegisterDto
            {
                Email = email,
                Password = password,
                ConfirmPassword = confirmPassword,
            };

            // Validate input
            var validationContext = new ValidationContext(registerDto);
            var validationResults = new List<ValidationResult>();
            if (
                !Validator.TryValidateObject(
                    registerDto,
                    validationContext,
                    validationResults,
                    true
                )
            )
            {
                return BadRequest(validationResults.Select(vr => vr.ErrorMessage));
            }

            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict("User with this email already exists");
            }

            // Create new user
            var newUser = new User
            {
                UserName = userName,
                Email = email,
                PasswordHash = HashPassword(password),
                UserRole =
                    "User" // Default to User if not specified
                ,
                GameState = gameState,
            };

            try
            {
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred during registration");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromForm] string email, [FromForm] string password)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            {
                return BadRequest("Email and password are required");
            }

            // Find user
            var newUser = await _context
                .Users.Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item1)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item2)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item3)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item4)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item5)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item6)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item7)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item8)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(i => i.InventoryState)
                .ThenInclude(it => it.Item9)
                .ThenInclude(im => im.ItemImages)
                .Include(u => u.GameState)
                .ThenInclude(q => q.QuestsState)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (newUser == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // Verify password
            if (!VerifyPassword(password, newUser.PasswordHash))
            {
                return Unauthorized("Invalid email or password");
            }

            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var newUser = await _context
                .Users.Include(g => g.GameState)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (newUser == null)
            {
                return NotFound();
            }

            return Ok(newUser);
        }

        [HttpPut("role/{id}")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromForm] string newRole)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if (newRole != "User" && newRole != "Admin")
            {
                return BadRequest("Invalid role");
            }
            ;

            user.UserRole = newRole;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(
                    new
                    {
                        user.Id,
                        user.Email,
                        user.UserRole,
                    }
                );
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while updating user role");
            }
        }

        // Password hashing utility methods
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hashOfInput = HashPassword(password);
            return hashOfInput == storedHash;
        }
    }
}
