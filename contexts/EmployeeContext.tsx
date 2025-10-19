import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { Employee } from '../types';
import { MOCK_EMPLOYEES } from '../constants';

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (employeeId: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);

  const addEmployee = useCallback((newEmployeeData: Omit<Employee, 'id'>) => {
    setEmployees(prev => {
      const newEmployee: Employee = {
        ...newEmployeeData,
        id: Math.max(...prev.map(e => e.id), 0) + 1,
      };
      return [...prev, newEmployee];
    });
  }, []);
  
  const updateEmployee = useCallback((updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
  }, []);

  const deleteEmployee = useCallback((employeeId: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
