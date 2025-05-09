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

        public User Login(string username, string password)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = "SELECT * FROM Users WHERE username = @username AND password = @password";
            return connection.QueryFirstOrDefault<User>(query, new { username, password });
        }
        public User Register(string username, string password, string name, string role)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);

            // Check if the username already exists
            string checkQuery = "SELECT COUNT(1) FROM Users WHERE username = @username";
            int count = connection.ExecuteScalar<int>(checkQuery, new { username });

            if (count > 0)
            {
                return null; // Username already exists
            }

            // Insert the new user
            string insertQuery = @"
        INSERT INTO Users (Username, Password, Name, Role)
        VALUES (@username, @password, @name, @role);

        SELECT * FROM Users WHERE Username = @username;
    ";

            return connection.QueryFirstOrDefault<User>(insertQuery, new { username, password, name, role });
        }

        public List<User> GetUsers()
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = "SELECT id,name ,role, designation FROM Users";
            return connection.Query<User>(query).ToList();
        }

        public void AddUser(User user)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"INSERT INTO Users (name, role,designation) VALUES (@name, @role, @designation)";
            connection.Execute(query, new { user.name, user.role,user.designation });
        }

        public void UpdateUser(User user)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"UPDATE Users SET name = @name, designation = @designation WHERE id = @id";
            connection.Execute(query, new { user.name, user.designation, user.id });
        }

        public void DeleteUser(int id)
        {
            using var connection = new SqlConnection(ConnectionString.DefaultConnection);
            string query = @"DELETE FROM Users WHERE Id = @Id";
            connection.Execute(query, new { Id = id });
        }

    }
}
