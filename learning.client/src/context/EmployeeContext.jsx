import React, { createContext, useState } from "react";

export const EmployeeContext = createContext();



export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  console.log("employeeeees",employees);

  return (
    <EmployeeContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  ); 
};
