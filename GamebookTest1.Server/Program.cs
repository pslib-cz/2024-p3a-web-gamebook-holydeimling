using System.Text.Json.Serialization;
using GamebookTest1.Server.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Print current directory and user information for diagnosis
Console.WriteLine($"Current directory: {Environment.CurrentDirectory}");
Console.WriteLine($"Current user: {Environment.UserName}");

// Diagnostic information about the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Initial connection string: {connectionString}");

// Try to find a working database path
string TryFindWorkingDatabasePath()
{
    // First try the default connection
    var conn = connectionString;
    if (IsDatabasePathUsable(conn))
    {
        Console.WriteLine($"Using primary database path: {conn}");
        return conn;
    }

    // Try fallback options in order
    for (int i = 1; i <= 3; i++)
    {
        var fallbackConn = builder.Configuration.GetConnectionString($"FallbackConnection{i}");
        if (!string.IsNullOrEmpty(fallbackConn) && IsDatabasePathUsable(fallbackConn))
        {
            Console.WriteLine($"Using fallback database path {i}: {fallbackConn}");
            return fallbackConn;
        }
    }

    // If all else fails, use in-memory
    Console.WriteLine("All database paths failed, using in-memory database");
    return "Data Source=:memory:";
}

bool IsDatabasePathUsable(string connString)
{
    if (string.IsNullOrEmpty(connString))
        return false;

    // In-memory database is always usable
    if (connString.Contains(":memory:"))
        return true;

    try
    {
        var dataSource = connString.Split(';')
            .FirstOrDefault(s => s.Trim().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
            ?.Substring("Data Source=".Length).Trim();

        if (string.IsNullOrEmpty(dataSource))
            return false;

        Console.WriteLine($"Testing database path: {dataSource}");

        // Get directory of the database file
        var dbDirectory = Path.GetDirectoryName(dataSource);
        if (string.IsNullOrEmpty(dbDirectory))
        {
            // This could be a relative path in current directory
            dbDirectory = Environment.CurrentDirectory;
            dataSource = Path.Combine(dbDirectory, dataSource);
        }

        // If directory doesn't exist, try to create it
        if (!Directory.Exists(dbDirectory))
        {
            Console.WriteLine($"Database directory does not exist: {dbDirectory}");
            try 
            {
                Directory.CreateDirectory(dbDirectory);
                Console.WriteLine($"Created database directory: {dbDirectory}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to create directory: {ex.Message}");
                return false;
            }
        }

        // Check if directory is writable
        try
        {
            var testFile = Path.Combine(dbDirectory, $"test_{Guid.NewGuid()}.tmp");
            File.WriteAllText(testFile, "test");
            File.Delete(testFile);
            Console.WriteLine($"Database directory is writable: {dbDirectory}");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database directory is not writable: {ex.Message}");
            return false;
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error checking database path: {ex.Message}");
        return false;
    }
}

// Find a working database connection
connectionString = TryFindWorkingDatabasePath();
Console.WriteLine($"Final connection string: {connectionString}");

// Check if file system is read-only (only use in-memory if we actually found a memory connection string)
bool isFileSystemReadOnly = connectionString.Contains(":memory:");
if (isFileSystemReadOnly)
{
    Console.WriteLine("Using in-memory database");
}

// Configure database context based on in-memory flag
if (isFileSystemReadOnly)
{
    // Use in-memory database
    Console.WriteLine("Configuring in-memory SQLite database");
    
    // Create a persistent connection for the in-memory database
    var connection = new SqliteConnection("Data Source=:memory:");
    connection.Open();
    
    // Configure the context to use this persistent connection
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connection));
        
    // Store the connection in a singleton service so it stays alive for the app lifetime
    builder.Services.AddSingleton(connection);
}
else
{
    // Configure SQLite to use file-based database
    Console.WriteLine($"Configuring file-based SQLite database: {connectionString}");
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlite(connectionString));
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReactApp",
        builder =>
        {
            builder
                .WithOrigins("https://localhost:5173", "https://localhost:5173/dataTest")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    );
    options.AddPolicy(
        "AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    );
});

var app = builder.Build();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<AppDbContext>();
        
        // Special handling for in-memory database
        if (isFileSystemReadOnly)
        {
            // For in-memory database, connection is lost when context is disposed
            // So we need to keep the connection open
            dbContext.Database.OpenConnection();
            dbContext.Database.EnsureCreated();
            Console.WriteLine("In-memory database created successfully");
            
            // Seed the database immediately
            SeedInMemoryDatabase(dbContext);
        }
        else
        {
            // For file-based database
            dbContext.Database.EnsureCreated();
            Console.WriteLine("File-based database created or verified successfully");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while creating/migrating the database.");
        Console.WriteLine($"Database error: {ex.Message}");
        
        // If there's an inner exception, log that too
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Always enable Swagger in any environment for this app
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles(); // Enable serving static files
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Add a simple health check endpoint
app.MapGet("/health", () => "Application is running!");

// Add a database check endpoint
app.MapGet("/dbstatus", (AppDbContext dbContext) => {
    try {
        // Try to access the database
        var canConnect = dbContext.Database.CanConnect();
        var dbType = isFileSystemReadOnly ? "In-Memory" : "File-based";
        return $"Database connection ({dbType}): {(canConnect ? "Successful" : "Failed")}";
    }
    catch (Exception ex) {
        return $"Database error: {ex.Message}";
    }
});

// Add detailed diagnostics endpoint
app.MapGet("/diagnostics", () => {
    var diagnostics = new Dictionary<string, string>
    {
        ["Current Directory"] = Environment.CurrentDirectory,
        ["User"] = Environment.UserName,
        ["User ID"] = Environment.GetEnvironmentVariable("APP_UID") ?? "unknown",
        ["OS Version"] = Environment.OSVersion.ToString(),
        ["Machine Name"] = Environment.MachineName,
        ["Connection String"] = connectionString ?? "Not configured",
        ["Using In-Memory Database"] = isFileSystemReadOnly.ToString(),
        [".NET Version"] = Environment.Version.ToString(),
        ["Processor Count"] = Environment.ProcessorCount.ToString(),
        ["File System Read-Only"] = isFileSystemReadOnly.ToString()
    };
    
    // Check data directory
    var dataDir = "/app/data";
    diagnostics["Data Directory Exists"] = Directory.Exists(dataDir).ToString();
    
    if (Directory.Exists(dataDir))
    {
        try
        {
            var files = Directory.GetFiles(dataDir);
            diagnostics["Data Directory Files"] = string.Join(", ", files);
            
            var testFile = Path.Combine(dataDir, "write_test.tmp");
            try {
                File.WriteAllText(testFile, "test");
                File.Delete(testFile);
                diagnostics["Data Directory Writable"] = "Yes";
            } catch (Exception ex) {
                diagnostics["Data Directory Writable"] = $"No - {ex.Message}";
            }
        }
        catch (Exception ex)
        {
            diagnostics["Data Directory Access Error"] = ex.Message;
        }
    }
    
    // Add current directory files
    try {
        var currentDirFiles = Directory.GetFiles(Environment.CurrentDirectory);
        diagnostics["Current Directory Files"] = string.Join(", ", currentDirFiles);
    } catch (Exception ex) {
        diagnostics["Current Directory Files Error"] = ex.Message;
    }
    
    return diagnostics;
});

// Ensure routing works correctly for the SPA - Must be after controller mappings
// This will serve index.html for any non-API/non-file routes to support client-side routing
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api") && 
                  !ctx.Request.Path.StartsWithSegments("/swagger") && 
                  !ctx.Request.Path.Value.Contains('.'),
            appBuilder => {
                appBuilder.UseStaticFiles();
                appBuilder.Run(async context => {
                    context.Response.ContentType = "text/html";
                    await context.Response.SendFileAsync(Path.Combine(app.Environment.ContentRootPath, "wwwroot", "index.html"));
                });
            });

// Add this method to seed the database with essential data
private static void SeedInMemoryDatabase(AppDbContext context)
{
    // Add a sample background image
    var image = new Image
    {
        Name = "Sample Background",
        FilePath = "/images/sample-background.jpg"
    };
    context.Images.Add(image);
    
    // Add a sample scene
    var scene = new Scene
    {
        SceneName = "Initial Scene",
        BackgroundImage = image,
        IsCheckpoint = true,
        GameOver = false
    };
    context.Scenes.Add(scene);
    
    context.SaveChanges();
    
    Console.WriteLine("In-memory database seeded with initial data");
}

Console.WriteLine($"Application starting. Environment: {app.Environment.EnvironmentName}");
app.Run();
