import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetail from "./components/EmployeeDetail";
import About from "./components/About";
import Login from "./components/Login";
import { EmployeeProvider } from "./context/EmployeeContext";
import { ThemeProvider } from "./context/ThemeContext";
import Register from "./components/Register";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider>
            <EmployeeProvider>
                <Router>
                    <div className="container mx-auto p-4">
                        <Header title="Employee Management" />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>  
                                        <EmployeeList />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/employee/:id"
                                element={
                                    <PrivateRoute>
                                        <EmployeeDetail />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/about"
                                element={
                                    <PrivateRoute>
                                        <About />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </EmployeeProvider>
        </ThemeProvider>
    );
}

export default App;
