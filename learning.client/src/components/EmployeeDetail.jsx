import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { EmployeeContext } from "../context/EmployeeContext";

function EmployeeDetail() {
  const { id } = useParams();
  const { employees } = useContext(EmployeeContext);
  const employee = employees.find(emp => emp.id === parseInt(id));

  if (!employee) return <p>Employee not found</p>;

  return (
      <div className="employee-detail">
          <h2>{employee.name}</h2>
          <p>Role: {employee.role}</p>
          <p>ID: {employee.id}</p>
      </div>
  );
}

export default EmployeeDetail;