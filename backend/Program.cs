using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.SignalR;

using backend.Interfaces;
using backend.Services;
using backend.Models.Entities;
using backend.Hubs;
using backend.Options;

var builder = WebApplication.CreateBuilder(args);


// =======================
// DATABASE
// =======================

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));


// =======================
// IDENTITY
// =======================

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


// =======================
// CORS
// =======================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://interacthub-socialmedia-2.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


// =======================
// JWT AUTHENTICATION
// =======================

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

        ValidIssuer = jwt["Issuer"]
            ?? throw new Exception("JWT Issuer is not configured."),

        ValidAudience = jwt["Audience"]
            ?? throw new Exception("JWT Audience is not configured."),

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(
                jwt["Key"]
                ?? throw new Exception("JWT Key is not configured.")
            ))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken)
                && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        }
    };
});


// =======================
// SERVICES
// =======================

builder.Services.AddScoped<JwtService>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection("Email"));

builder.Services.Configure<SmtpEmailOptions>(
    builder.Configuration.GetSection("Email:Smtp"));

builder.Services.AddScoped<SmtpEmailService>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

builder.Services.AddScoped<IPostsService, PostsService>();
builder.Services.AddScoped<IFriendsService, FriendsService>();
builder.Services.AddScoped<IStoryService, StoryService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ILikeService, LikeService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IPrivacyService, PrivacyService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IHashtagService, HashtagService>();


// =======================
// SIGNALR
// =======================

builder.Services.AddSignalR();

builder.Services.AddSingleton<IUserIdProvider, SubClaimUserIdProvider>();


// =======================
// CONTROLLERS + SWAGGER
// =======================

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "InteractHub API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
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
            Array.Empty<string>()
        }
    });
});


// =======================
// BUILD APP
// =======================

var app = builder.Build();


// =======================
// MIDDLEWARE
// =======================

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "InteractHub API V1");
    c.RoutePrefix = "swagger";
});


// =======================
// CORS
// =======================

app.UseCors("AllowReact");


// =======================
// AUTH
// =======================

app.UseAuthentication();

app.UseAuthorization();


// =======================
// ROUTES
// =======================

app.MapControllers();

app.MapHub<NotificationHub>("/hubs/notifications");


// =======================
// SPA FALLBACK
// =======================

app.MapFallbackToFile("index.html");


// =======================
// DEBUG CONNECTION STRING
// =======================

Console.WriteLine(
    builder.Configuration.GetConnectionString("DefaultConnection"));


// =======================
// RUN APP
// =======================

app.Run();