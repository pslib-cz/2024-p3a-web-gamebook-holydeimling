using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using GamebookTest1.Server.Data;
using GamebookTest1.Server.Models;
using System.ComponentModel.DataAnnotations;

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

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromForm] string email,
            [FromForm] string password,
            [FromForm] string confirmPassword,
            [FromForm] UserRole? userRole = null)
        {
            // Create a DTO-like object for validation
            var registerDto = new UserRegisterDto
            {
                Email = email,
                Password = password,
                ConfirmPassword = confirmPassword
            };

            // Validate input
            var validationContext = new ValidationContext(registerDto);
            var validationResults = new List<ValidationResult>();
            if (!Validator.TryValidateObject(registerDto, validationContext, validationResults, true))
            {
                return BadRequest(validationResults.Select(vr => vr.ErrorMessage));
            }

            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return Conflict("User with this email already exists");
            }

            // Create new user
            var user = new User
            {
                Email = email,
                PasswordHash = HashPassword(password),
                UserRole = "User"// Default to User if not specified
            };

            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUser), new { id = user.Id },
                    new { user.Id, user.Email, user.UserRole });
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
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            // Verify password
            if (!VerifyPassword(password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password");
            }

            return Ok(new { user.Id, user.Email, user.UserRole });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new { user.Id, user.Email, user.UserRole });
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
            };

            user.UserRole = newRole;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { user.Id, user.Email, user.UserRole });
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
