using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(ApplicationUser user)
    {
        var jwtSection = _config.GetSection("Jwt");

        var key = jwtSection["Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];
        var expireMinutes = int.Parse(jwtSection["ExpireMinutes"]);

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
         {
            new Claim(ClaimTypes.NameIdentifier, user.Id), // 🔥 QUAN TRỌNG
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName)
        };

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