import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`Users/register?username=${username}&password=${password}&name=${name}&role=${role}`, {
                method: "POST",
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("isAuthenticated", "true");
                navigate("/");
            } else {
                setErrorMessage(data.message || "Registration failed");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className={`login-box ${theme}`}>
                <h2>Register</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 mb-4 border rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 mb-4 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full p-2 mb-4 border rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        className="w-full p-2 mb-4 border rounded"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
                        Register
                    </button>
                </form>

                {/* 🔁 Link to Login Page */}
                <p className="mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
