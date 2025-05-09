using LEARNING.Server.Helpers;
using LEARNING.Server.Interfaces;
using LEARNING.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using NETCore.MailKit.Core;

namespace LEARNING.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersMgr _usersMgr;
        private readonly JwtHelper _jwtHelper;
        private readonly IMemoryCache _cache;
        private readonly ICustomEmailService _emailService;
        


        public UsersController(IUsersMgr usersMgr, IConfiguration config, IMemoryCache cache, ICustomEmailService emailService)
        {
            _usersMgr = usersMgr;
            _jwtHelper = new JwtHelper(config);
            _cache = cache;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public IActionResult Login(string username, string password)
        {
            try
            {
                var user = _usersMgr.Login(username, password);

                if (user == null)
                    return Unauthorized(new { message = "Invalid username or password." });

                var token = _jwtHelper.GenerateToken(user);

                return Ok(new
                {
                    Token = token,
                    User = new { user.id, user.name, user.role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Login error: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public IActionResult Register(string username, string password, string name, string role)
        {
            try
            {
                var user = _usersMgr.Register(username, password, name, role);

                if (user == null)
                    return BadRequest(new { message = "User  already exist." });

                var token = _jwtHelper.GenerateToken(user);

                return Ok(new
                {
                    Token = token,
                    User = new { user.id, user.name, user.role }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration error: {ex.Message}");
            }
        }



        [HttpGet("getUsers")]
        [Authorize]
        public IActionResult GetUsers()
        {
            try
            {
                const string cacheKey = "users:list";

                // Try to get the users list from cache
                if (_cache.TryGetValue(cacheKey, out List<User> ?cachedUsers))
                {
                    return Ok( cachedUsers );
                }

                // If not found in cache, fetch from DB
                var users = _usersMgr.GetUsers();

                // Cache the result for 60 seconds
                _cache.Set(cacheKey, users, TimeSpan.FromSeconds(60));

                return Ok( users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("addUser")]
        [Authorize]
        public IActionResult AddUser([FromBody] User user)
        {
            try
            {
                _usersMgr.AddUser(user);

                const string cacheKey = "users:list";

                if (_cache.TryGetValue(cacheKey, out List<User> cachedUsers))
                {
                    var updatedList = new List<User>(cachedUsers) { user };
                    _cache.Set(cacheKey, updatedList, TimeSpan.FromSeconds(60));
                }


                // Prepare email
                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "EmailTemplates", "WelcomeTemplate.html");

                var placeholders = new Dictionary<string, string>
                {
                     { "username", user.name },
                     { "link", "https://yourwebsite.com/welcome" }
                };

                _emailService.SendHtmlTemplateEmail(user.name, "Welcome to Our Platform!", templatePath, placeholders);

                return Ok("User added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to add user: {ex.Message}");
            }
        }

        [HttpPut("updateUser")]
        [Authorize]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                _usersMgr.UpdateUser(user);

                const string cacheKey = "users:list";

                if (_cache.TryGetValue(cacheKey, out List<User> cachedUsers))
                {
                    var index = cachedUsers.FindIndex(u => u.id == user.id);
                    if (index != -1)
                    {
                        cachedUsers[index] = user;
                        _cache.Set(cacheKey, cachedUsers, TimeSpan.FromSeconds(60));
                    }
                }

                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update user: {ex.Message}");
            }
        }

        [HttpDelete("deleteUser/{id}")]
        [Authorize]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (userRole != "admin")
                    return Unauthorized(new { message = "Only admins can delete users." });

                _usersMgr.DeleteUser(id);

                const string cacheKey = "users:list";

                if (_cache.TryGetValue(cacheKey, out List<User> cachedUsers))
                {
                    cachedUsers.RemoveAll(u => u.id == id);
                    _cache.Set(cacheKey, cachedUsers, TimeSpan.FromSeconds(60));
                }

                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to delete user: {ex.Message}");
            }
        }

    }
}
