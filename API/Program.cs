using API.Middleware;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using Domain;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.S
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();// Chỉ cho phép user đã đăng nhập
    opt.Filters.Add(new AuthorizeFilter(policy));// Áp dụng xác thực cho toàn bộ controller/action
});
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();
builder.Services.AddMediatR(x =>
{
    //tìm tất cả IRequestHandler trong assembly có GetActivityList.Handler và đăng ký chúng vào DI
    // chỉ cần đăng ký 1 class trong 1 assembly, các class khác cùng assembly không cần đăng ký
    x.RegisterServicesFromAssemblyContaining<GetActivityList.Handler>();
    //add validation middleware của mediator
    x.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>(); // đk validator vào DI container
builder.Services.AddTransient<ExceptionMiddleware>(); // đk middleware exception vào di container

//tự động sinh ra các API endpoint đăng nhập / đăng ký cho website
//Thêm Role-based authorization
builder.Services.AddIdentityApiEndpoints<User>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>(); //Lưu user, role, password, token… vào database

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(); // sử dụng middleware trong mỗi request
app.UseCors(x => x.AllowAnyHeader()
    .AllowCredentials() // cho phép gửi cookie
    .AllowAnyMethod()
    .WithOrigins("http://localhost:3000", "https://localhost:3000")
);

app.UseAuthentication(); // midd xác thực: Đọc JWT / cookie / bearer token từ request
app.UseAuthorization(); // midd role / policy[Authorize] [Authorize(Roles = "Admin")]

app.MapControllers();
app.MapGroup("api").MapIdentityApi<User>(); // các end point tự sinh ra phải có tiền tố api

using var scope = app.Services.CreateScope(); // Tạo scope DI, tự động dispose khi ra khỏi block
var services = scope.ServiceProvider; // gán server provider cho 1 biến để lấy từng service cho gọn

try
{
    var context = services.GetRequiredService<AppDbContext>(); // lấy context từ DI
    var userManager = services.GetRequiredService<UserManager<User>>(); // lấy user manager từ DI
    await context.Database.MigrateAsync(); // tương tự cli dotnet ef update
    await DbInitializer.SeedData(context, userManager); // Seed dữ liệu ban đầu
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>(); // lấy ra ILogger cho lớp Program
    logger.LogError(ex, "An error occurred during migration."); // Ghi log lỗi khi migration hoặc seed data thất bại
}

app.Run();
