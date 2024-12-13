using System.IO;
using System.Linq;
using System.Threading.Tasks;
using GamebookTest1.Server.Data; // Replace with your namespace
using GamebookTest1.Server.Models; // Replace with your namespace
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> UploadFile(IFormFile file)
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
        var uploadedFile = new Image { FilePath = relativePath };
        _context.Images.Add(uploadedFile);
        await _context.SaveChangesAsync();

        // Return the relative file path
        return Ok(new { FilePath = relativePath });
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
}
