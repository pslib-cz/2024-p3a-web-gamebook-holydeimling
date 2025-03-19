using System.Text.Json.Serialization;
using GamebookTest1.Server.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Print current directory and user information for diagnosis
Console.WriteLine($"Current directory: {Environment.CurrentDirectory}");
Console.WriteLine($"Current user: {Environment.UserName}");

// Diagnostic information about the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"Connection string: {connectionString}");

// Check database file location and permissions
if (!string.IsNullOrEmpty(connectionString))
{
    var dataSource = connectionString.Split(';')
        .FirstOrDefault(s => s.Trim().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        ?.Substring("Data Source=".Length).Trim();
    
    Console.WriteLine($"Database path: {dataSource}");
    
    if (!string.IsNullOrEmpty(dataSource))
    {
        var dbDirectory = Path.GetDirectoryName(dataSource);
        Console.WriteLine($"Database directory: {dbDirectory}");
        
        if (!string.IsNullOrEmpty(dbDirectory))
        {
            if (Directory.Exists(dbDirectory))
            {
                Console.WriteLine($"Database directory exists: {dbDirectory}");
                try
                {
                    // Check if writable by trying to create and delete a test file
                    var testFile = Path.Combine(dbDirectory, "write_test.tmp");
                    File.WriteAllText(testFile, "test");
                    File.Delete(testFile);
                    Console.WriteLine($"Database directory is writable");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Database directory is not writable: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine($"Database directory does not exist: {dbDirectory}");
                try
                {
                    Directory.CreateDirectory(dbDirectory);
                    Console.WriteLine($"Created database directory: {dbDirectory}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to create database directory: {ex.Message}");
                }
            }
        }
    }
}

// Configure SQLite to use a relative path if absolute path has permission issues
builder.Services.AddDbContext<AppDbContext>((serviceProvider, options) =>
{
    try
    {
        options.UseSqlite(connectionString);
        Console.WriteLine("Database context configured successfully");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error configuring database context: {ex.Message}");
        
        // Fallback to a relative path if absolute path fails
        var fallbackPath = "gamebook.db";
        Console.WriteLine($"Attempting fallback to relative path: {fallbackPath}");
        options.UseSqlite($"Data Source={fallbackPath}");
    }
});

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
        // This will create the database if it doesn't exist and apply any pending migrations
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Database created or verified successfully");
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
        return $"Database connection: {(canConnect ? "Successful" : "Failed")}";
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
        ["OS Version"] = Environment.OSVersion.ToString(),
        ["Machine Name"] = Environment.MachineName,
        ["Connection String"] = connectionString ?? "Not configured",
        [".NET Version"] = Environment.Version.ToString(),
        ["Processor Count"] = Environment.ProcessorCount.ToString()
    };
    
    // Check data directory
    var dataDir = "/app/data";
    diagnostics["Data Directory Exists"] = Directory.Exists(dataDir).ToString();
    
    if (Directory.Exists(dataDir))
    {
        try
        {
            var testFile = Path.Combine(dataDir, "write_test.tmp");
            File.WriteAllText(testFile, "test");
            File.Delete(testFile);
            diagnostics["Data Directory Writable"] = "Yes";
        }
        catch (Exception ex)
        {
            diagnostics["Data Directory Writable"] = $"No - {ex.Message}";
        }
    }
    
    return diagnostics;
});

Console.WriteLine($"Application starting. Environment: {app.Environment.EnvironmentName}");
app.Run();
