using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(ApplicationUser user, IEnumerable<string>? roles = null)
    {
        var jwtSection = _config.GetSection("Jwt");

        var key = jwtSection["Key"] ?? throw new Exception("JWT Key is not configured.");
        var issuer = jwtSection["Issuer"] ?? throw new Exception("JWT Issuer is not configured.");
        var audience = jwtSection["Audience"] ?? throw new Exception("JWT Audience is not configured.");
        var expireMinutes = int.Parse(jwtSection["ExpireMinutes"] ?? throw new Exception("JWT ExpireMinutes is not configured."));

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
         {
            new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
            new Claim(ClaimTypes.Name, user.UserName ?? "")
        };

        if (roles != null)
        {
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}