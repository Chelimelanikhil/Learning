using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LEARNING.Server.Models;
using Microsoft.IdentityModel.Tokens;

namespace LEARNING.Server.Helpers
{
    public class JwtHelper
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public JwtHelper(IConfiguration config)
        {
            _key = config["Jwt:Key"];
            _issuer = config["Jwt:Issuer"];
            _audience = config["Jwt:Audience"];
        }

        public string GenerateToken(User user)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.Role, user.role ?? "user"),
            new Claim("UserID", user.id.ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                    issuer: _issuer,
                    audience: _audience,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(10), 
                    signingCredentials: creds
                );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
