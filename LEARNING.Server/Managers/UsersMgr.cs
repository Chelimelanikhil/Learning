using LEARNING.Server.DAO;
using LEARNING.Server.Interfaces;
using LEARNING.Server.Models;

namespace LEARNING.Server.Managers
{
    public class UsersMgr : IUsersMgr
    {
        private readonly IConfiguration _configuration;

        public UsersMgr(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public User Login(string username, string password)
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            return usersDAO.Login(username, password);
        }

        public User Register(string username, string password, string name, string designation)
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            return usersDAO.Register(username, password, name, designation);
        }




        public List<User> GetUsers()
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            return usersDAO.GetUsers();
        }

        public void AddUser(User user)
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            usersDAO.AddUser(user);
        }

        public void UpdateUser(User user)
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            usersDAO.UpdateUser(user);
        }

        public void DeleteUser(int id)
        {
            UsersDAO usersDAO = new UsersDAO(_configuration);
            usersDAO.DeleteUser(id);
        }
    }
}
