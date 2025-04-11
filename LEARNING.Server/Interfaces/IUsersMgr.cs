using LEARNING.Server.Models;

namespace LEARNING.Server.Interfaces
{
    public interface IUsersMgr
    {
        List<User> GetUsers();

        void AddUser(User user);

        void UpdateUser(User user);

        void DeleteUser(int id);
    }
}
