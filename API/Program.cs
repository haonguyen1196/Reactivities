using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000", "https://localhost:3000"));

app.MapControllers();

using var scope = app.Services.CreateScope(); // Tạo scope DI, tự động dispose khi ra khỏi block
var services = scope.ServiceProvider; // gán server provider cho 1 biến để lấy từng service cho gọn

try
{
    var context = services.GetRequiredService<AppDbContext>(); // lấy context từ DI
    await context.Database.MigrateAsync(); // tương tự cli dotnet ef update
    await DbInitializer.SeedData(context); // Seed dữ liệu ban đầu
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>(); // lấy ra ILogger cho lớp Program
    logger.LogError(ex, "An error occurred during migration."); // Ghi log lỗi khi migration hoặc seed data thất bại
}

app.Run();
