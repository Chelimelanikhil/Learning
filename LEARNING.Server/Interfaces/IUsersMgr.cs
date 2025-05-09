using LEARNING.Server.Models;

namespace LEARNING.Server.Interfaces
{
    public interface IUsersMgr
    {

        User Login(string username, string password);

        User Register(string username, string password, string name, string designation);


        List<User> GetUsers();

        void AddUser(User user);

        void UpdateUser(User user);

        void DeleteUser(int id);
    }
}
