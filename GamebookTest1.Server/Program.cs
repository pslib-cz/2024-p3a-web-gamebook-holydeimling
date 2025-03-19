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

// Add a custom check to ensure the database directory exists
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrEmpty(connectionString))
{
    var dataSource = connectionString.Split(';')
        .FirstOrDefault(s => s.Trim().StartsWith("Data Source=", StringComparison.OrdinalIgnoreCase))
        ?.Substring("Data Source=".Length).Trim();
    
    if (!string.IsNullOrEmpty(dataSource))
    {
        var dbDirectory = Path.GetDirectoryName(dataSource);
        if (!string.IsNullOrEmpty(dbDirectory) && !Directory.Exists(dbDirectory))
        {
            try
            {
                Directory.CreateDirectory(dbDirectory);
                Console.WriteLine($"Created database directory: {dbDirectory}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Failed to create database directory: {ex.Message}");
                // Continue execution - the application may still work if the directory already exists
            }
        }
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
);
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

Console.WriteLine($"Application starting. Environment: {app.Environment.EnvironmentName}");
app.Run();
