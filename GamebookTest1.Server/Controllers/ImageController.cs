using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GamebookTest1.Server.Data; // Replace with your namespace
using GamebookTest1.Server.Models; // Replace with your namespace
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly AppDbContext _context;

    public ImageController(IWebHostEnvironment environment, AppDbContext context)
    {
        _environment = environment;
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file, [FromForm] string name)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        // Validate the file type (e.g., only allow images)
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var fileExtension = Path.GetExtension(file.FileName).ToLower();
        if (!Array.Exists(allowedExtensions, ext => ext == fileExtension))
        {
            return BadRequest("Invalid file type. Only images are allowed.");
        }

        // Generate a unique file name
        var fileName = Guid.NewGuid().ToString() + fileExtension;

        // Define the folder path
        var folderPath = Path.Combine(_environment.WebRootPath, "uploads");

        // Ensure the folder exists
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        // Define the full file path
        var filePath = Path.Combine(folderPath, fileName);

        // Save the file to the server
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Save the file path to the database
        var relativePath = Path.Combine("uploads", fileName).Replace("\\", "/");
        var uploadedFile = new Image { FilePath = relativePath, Name = name };
        _context.Images.Add(uploadedFile);
        await _context.SaveChangesAsync();

        // Return the relative file path
        return Ok(new { FilePath = relativePath });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllImages()
    {
        var images = await _context.Images.ToListAsync();
        return Ok(images);
    }

    [HttpGet("list")]
    public IActionResult GetFiles()
    {
        var files = _context.Images.Select(i => i.FilePath).ToList();
        return Ok(files);
    }

    [HttpGet("{id}")]
    public IActionResult GetImage(int id)
    {
        var image = _context.Images.FirstOrDefault(i => i.ImageId == id);
        if (image == null)
        {
            return NotFound();
        }
        return Ok(image);
    }

    [HttpPut("edit/{id}")]
    public async Task<IActionResult> EditImage(
        int id,
        [FromForm] string? name,
        [FromForm] string? filePath
    )
    {
        var image = await _context.Images.FindAsync(id);
        if (image == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(name))
        {
            image.Name = name;
        }

        if (!string.IsNullOrWhiteSpace(filePath))
        {
            image.FilePath = filePath;
        }

        _context.Images.Update(image);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteImage(int id)
    {
        var image = await _context.Images.FindAsync(id);
        if (image == null)
        {
            return NotFound();
        }

        _context.Images.Remove(image);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
