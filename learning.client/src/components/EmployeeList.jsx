import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";


const EmployeeItem = React.memo(({ id, name, designation, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editdesignation, setEditdesignation] = useState(designation);

    const handleSave = () => {
        onEdit(id, editName, editdesignation);
        setIsEditing(false);
    };

    return (
        <li className="employee-item">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input"
                        style={{marginBottom:'5px'} }
                    />
                    <input
                        type="text"
                        value={editdesignation}
                        onChange={(e) => setEditdesignation(e.target.value)}
                        className="input"
                    />
                    <div className="button-row">
                        <button onClick={handleSave} className="save-button">Save</button>
                        <button onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
                    </div>
                </>
            ) : (
                <>
                    <Link to={`/employee/${id}`} className="employee-name">{name}</Link>
                    <p className="employee-role">{designation}</p>
                    <div className="button-row">
                        <button onClick={() => setIsEditing(true)} className="edit-button">Edit</button>
                        <button onClick={() => onDelete(id)} className="delete-button">Delete</button>
                    </div>
                </>
            )}
        </li>

    );
});

function EmployeeList() {
    const { employees, setEmployees } = useContext(EmployeeContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();


    const [newName, setNewName] = useState("");
    const [newdesignation, setNewdesignation] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, [setEmployees]);

    const fetchEmployees = useCallback(async () => {
        const token = localStorage.getItem("token");
        setIsLoading(true);
        try {
            const response = await 
            fetch("Users/getUSers", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
                navigate("/login");
                return;
            }
            const employees = await response.json();
            setEmployees(employees);
            setIsLoading(false);
        } catch (err) {
            setError("Failed to load employees");
            setIsLoading(false);
        }
    }, [setEmployees]);



    const addEmployee = useCallback(async () => {
        if (newName.trim() === "" || newdesignation.trim() === "") {
            alert("Enter Name and Role")
            return;
        }

        const newEmployee = {
            name: newName,
            designation: newdesignation,
        };
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("/Users/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(newEmployee),
            });

            if (response.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
                navigate("/login");
                return;
            }

            alert('Employee added successfully');

            setNewName("");
            setNewdesignation("");

            await fetchEmployees(); 
        } catch (err) {
            alert("Error adding employee: " + err.message);
        }
    }, [newName, newdesignation, fetchEmployees]);



    const handleEdit = useCallback(async (id, newName, newdesignation) => {
        const updatedEmployee = {
            id:id,
            name: newName,
            designation: newdesignation
        };
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`/Users/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(updatedEmployee),

            });

            if (response.status === 401) {
                // Clear token and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("isAuthenticated");
                navigate("/login");
                return;
            }

            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === id ? { ...emp, name: newName, designation: newdesignation } : emp
                )
            );
            alert('Employe updated Sucessfully');
        } catch (err) {
            alert("Error updating employee: " + err.message);
        }
    }, [setEmployees]);


    const handleDelete = useCallback(async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
        if (!confirmDelete) return;
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`/Users/deleteUser/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            //const data = await response.json(); 
            if (!response.ok) throw new Error("Failed to delete employee");
            if (response.ok) {
                setEmployees((prev) => prev.filter((emp) => emp.id !== id));
                alert('Employe deleted Sucessfully');

            } else {
                alert(data.message);
            }
            
        } catch (err) {
            alert("Error deleting employee: " + err.message);
        }
    }, [setEmployees]);


    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => a.name.localeCompare(b.name));
    }, [employees]);

    if (isLoading) return <p className="text-center mt-6">⏳ Loading employees...</p>;
    if (error) return <p className="text-center text-red-600 mt-6">❌ {error}</p>;

    return (
        <div className={`container ${theme}`}>
            <h2 className={`heading ${theme}`}>Employee List</h2>

            <div className="form-row">
                <input
                    type="text"
                    placeholder="Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input"
                />
                <input
                    type="text"
                    placeholder="Designation"
                    value={newdesignation}
                    onChange={(e) => setNewdesignation(e.target.value)}
                    className="input"
                />
                <button onClick={addEmployee} className="add-button">
                    ➕ Add Employee
                </button>
            </div>

            <ul className="employee-grid">
                {sortedEmployees.map(({ id, name, designation }) => (
                    <EmployeeItem
                        key={id}
                        id={id}
                        name={name}
                        designation={designation}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>

    );
}

export default EmployeeList;
