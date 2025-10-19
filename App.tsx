import React, { useState, useCallback } from 'react';
import { UserRole, User } from './types';
import LoginScreen from './pages/LoginScreen';
import DashboardLayout from './pages/DashboardLayout';
import { EmployeeProvider } from './contexts/EmployeeContext';
import { MOCK_EMPLOYEES } from './constants';

const getMockUserForRole = (role: UserRole): User => {
  // Find an employee that could fit the role, or default to some values
  switch (role) {
    case UserRole.Admin:
      const adminEmp = MOCK_EMPLOYEES.find(e => e.role.includes('Manager')) || MOCK_EMPLOYEES[1];
      return { email: adminEmp.email, role: UserRole.Admin, name: adminEmp.name, avatarUrl: adminEmp.avatarUrl, employeeId: adminEmp.id };
    case UserRole.Manager:
      const managerEmp = MOCK_EMPLOYEES.find(e => e.department === 'Product') || MOCK_EMPLOYEES[1];
       return { email: managerEmp.email, role: UserRole.Manager, name: managerEmp.name, avatarUrl: managerEmp.avatarUrl, employeeId: managerEmp.id };
    case UserRole.HR:
      const hrEmp = MOCK_EMPLOYEES.find(e => e.department === 'Human Resources') || MOCK_EMPLOYEES[3];
      return { email: hrEmp.email, role: UserRole.HR, name: hrEmp.name, avatarUrl: hrEmp.avatarUrl, employeeId: hrEmp.id };
    case UserRole.Employee:
    default:
      const employeeEmp = MOCK_EMPLOYEES[0];
      return { email: employeeEmp.email, role: UserRole.Employee, name: employeeEmp.name, avatarUrl: employeeEmp.avatarUrl, employeeId: employeeEmp.id };
  }
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);
  
  const handleLogout = useCallback(() => {
    setUserRole(null);
  }, []);

  const handleRoleChange = useCallback((role: UserRole) => {
    setUserRole(role);
  }, []);

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  const mockUser = getMockUserForRole(userRole);

  return (
    <EmployeeProvider>
      <DashboardLayout 
        currentUser={mockUser}
        onLogout={handleLogout} 
        onRoleChange={handleRoleChange} 
      />
    </EmployeeProvider>
  );
};

export default App;
