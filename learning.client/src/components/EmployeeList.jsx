import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";


const EmployeeItem = React.memo(({ id, name, role, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editRole, setEditRole] = useState(role);

    const handleSave = () => {
        onEdit(id, editName, editRole);
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
                    />
                    <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
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
                    <p className="employee-role">{role}</p>
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme } = useContext(ThemeContext);


    const [newName, setNewName] = useState("");
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, [setEmployees]);

    const fetchEmployees = useCallback(async () => {
        try {
            const response = await fetch("/Users/getUSers");
            const employees = await response.json();
            setEmployees(employees);
            setIsLoading(false);
        } catch (err) {
            setError("Failed to load employees");
            setIsLoading(false);
        }
    }, [setEmployees]);

    const addEmployee = useCallback(async () => {
        if (newName.trim() === "" || newRole.trim() === "")
            alert("Enter Name and Role")
            return;

        const newEmployee = {
            name: newName,
            role: newRole,
        };

        try {
            const response = await fetch("/Users/addUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) throw new Error("Failed to add employee");

            alert('Employee added successfully');

            setNewName("");
            setNewRole("");

            await fetchEmployees(); 
        } catch (err) {
            alert("Error adding employee: " + err.message);
        }
    }, [newName, newRole, fetchEmployees]);



    const handleEdit = useCallback(async (id, newName, newRole) => {
        const updatedEmployee = {
            id:id,
            name: newName,
            role: newRole,
        };
        try {
            const response = await fetch(`/Users/updateUser`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEmployee),

            });

            if (!response.ok) throw new Error("Failed to update employee");

            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === id ? { ...emp, name: newName, role: newRole } : emp
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

        try {
            const response = await fetch(`/Users/deleteUser/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete employee");

            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            alert('Employe deleted Sucessfully');

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
                    placeholder="Role"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input"
                />
                <button onClick={addEmployee} className="add-button">
                    ➕ Add Employee
                </button>
            </div>

            <ul className="employee-grid">
                {sortedEmployees.map(({ id, name, role }) => (
                    <EmployeeItem
                        key={id}
                        id={id}
                        name={name}
                        role={role}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </ul>
        </div>

    );
}

export default EmployeeList;
