import React, { useState ,useContext} from "react";
import { useNavigate,Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // To display errors
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`Users/login?Username=${username}&Password=${password}`, {
                method: "POST",
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("isAuthenticated", "true");
                navigate("/");
            } else {
                setErrorMessage(data.message || "Invalid credentials");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };


    return (
        <div className="login-container">
            <div className={`login-box ${theme}`}>
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 mb-4 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
                </form>
                <p className="mt-4 text-center">
                    Don't' have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register    
                    </Link>
                </p>
            </div>
         
        </div>
    );
};

export default Login;
