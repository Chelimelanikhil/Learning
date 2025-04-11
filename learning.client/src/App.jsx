import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import EmployeeList from "./components/EmployeeList";
import EmployeeDetail from "./components/EmployeeDetail";
import About from "./components/About";
import { EmployeeProvider } from "./context/EmployeeContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
    return (
        <ThemeProvider>
            <EmployeeProvider>
                <Router>
                    <div className="container mx-auto p-4">
                        <Header title="Employee Management Dashboard" />
                        <Routes>
                            <Route path="/" element={<EmployeeList />} />
                            <Route path="/employee/:id" element={<EmployeeDetail />} />
                            <Route path="/about" element={<About />} />
                        </Routes>
                    </div>
                </Router>
            </EmployeeProvider>
        </ThemeProvider>
    );
}

export default App;
