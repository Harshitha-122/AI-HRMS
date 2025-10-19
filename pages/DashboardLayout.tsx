import React, { useState, useEffect } from 'react';
import { UserRole, User, Employee } from '../types';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import HRDashboard from './HRDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import AiAssistant from '../components/AiAssistant';
import { useEmployees } from '../contexts/EmployeeContext';
import { MOCK_JOB_OPENINGS } from '../constants';

interface DashboardLayoutProps {
  currentUser: User;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
}

const roleDashboardMap: { [key in UserRole]: { component: React.FC<any>; defaultView: string } } = {
  [UserRole.Admin]: { component: AdminDashboard, defaultView: 'Dashboard' },
  [UserRole.Manager]: { component: ManagerDashboard, defaultView: 'Dashboard' },
  [UserRole.HR]: { component: HRDashboard, defaultView: 'Dashboard' },
  // FIX: Corrected typo from `defaultVw` to `defaultView`.
  [UserRole.Employee]: { component: EmployeeDashboard, defaultView: 'Dashboard' },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ currentUser, onLogout, onRoleChange }) => {
  const userRole = currentUser.role;
  const [activeView, setActiveView] = useState(roleDashboardMap[userRole].defaultView);
  
  useEffect(() => {
    setActiveView(roleDashboardMap[userRole].defaultView);
  }, [userRole]);

  const CurrentDashboard = roleDashboardMap[userRole].component;
  const { employees, updateEmployee } = useEmployees();
  const jobOpenings = MOCK_JOB_OPENINGS;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        userRole={userRole} 
        activeView={activeView}
        setActiveView={setActiveView} 
        onLogout={onLogout} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activeView={activeView} 
          currentUser={currentUser} 
          onRoleChange={onRoleChange} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <CurrentDashboard activeView={activeView} currentUser={currentUser} />
        </main>
      </div>
      <AiAssistant 
        currentUser={currentUser}
        employees={employees}
        jobOpenings={jobOpenings}
        setActiveView={setActiveView}
        updateEmployee={updateEmployee}
      />
    </div>
  );
};

export default DashboardLayout;