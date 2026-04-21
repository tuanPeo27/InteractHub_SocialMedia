using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.OpenApi.Models;

using backend.Interfaces;
using backend.Services;
using backend.Models.Entities;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// JWT 
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwt = builder.Configuration.GetSection("Jwt");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        RoleClaimType = ClaimTypes.Role,
        ValidIssuer = jwt["Issuer"] ?? throw new Exception("JWT Issuer is not configured."),
        ValidAudience = jwt["Audience"] ?? throw new Exception("JWT Audience is not configured."),
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt["Key"] ?? throw new Exception("JWT Key is not configured.")))
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    };
});



// Đăng ký JwtService
builder.Services.AddScoped<JwtService>();
// Đăng ký AuthService
builder.Services.AddScoped<IAuthService, AuthService>();
// Đăng ký PostService
builder.Services.AddScoped<IPostsService, PostsService>();
// Đăng ký FriendService
builder.Services.AddScoped<IFriendsService, FriendsService>();
// Đăng ký StoryService
builder.Services.AddScoped<IStoryService, StoryService>();
// Đăng ký UserService
builder.Services.AddScoped<IUserService, UserService>();
// Đăng ký NotificationService
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

app.UseStaticFiles();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// CORS
app.UseCors("AllowReact");

// Auth
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

app.Run();