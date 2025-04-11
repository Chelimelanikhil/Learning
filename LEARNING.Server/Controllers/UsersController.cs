using LEARNING.Server.Interfaces;
using LEARNING.Server.Managers;
using LEARNING.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace LEARNING.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersMgr _usersMgr;

        public UsersController(IUsersMgr usersMgr)
        {
            _usersMgr = usersMgr;
        }

        [HttpGet("getUsers")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _usersMgr.GetUsers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost("addUser")]
        public IActionResult AddUser([FromBody] User user)
        {
            try
            {
                _usersMgr.AddUser(user);
                return Ok("User added successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to add user: {ex.Message}");
            }
        }

        [HttpPut("updateUser")]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                _usersMgr.UpdateUser(user);
                return Ok("User updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to update user: {ex.Message}");
            }
        }

        [HttpDelete("deleteUser/{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                _usersMgr.DeleteUser(id);
                return Ok("User deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to delete user: {ex.Message}");
            }
        }
    }
}
