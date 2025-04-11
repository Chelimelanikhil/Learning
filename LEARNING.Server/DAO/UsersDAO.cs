using Dapper;
using LEARNING.Server.Models;
using System.Data;
using System.Data.SqlClient;

namespace LEARNING.Server.DAO
{
    public class UsersDAO
    {
        private readonly IConfiguration _configuration;

        public UsersDAO(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public List<User> GetUsers()
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = "SELECT * FROM Users";
            return connection.Query<User>(query).ToList();
        }

        public void AddUser(User user)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"INSERT INTO Users (name, role) VALUES (@name, @role)";
            connection.Execute(query, new { user.name, user.role });
        }

        public void UpdateUser(User user)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"UPDATE Users SET name = @name, role = @role WHERE id = @id";
            connection.Execute(query, new { user.name, user.role, user.id });
        }

        public void DeleteUser(int id)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"DELETE FROM Users WHERE Id = @Id";
            connection.Execute(query, new { Id = id });
        }
    }
}
