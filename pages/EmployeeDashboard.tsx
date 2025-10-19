import React from 'react';
import { ICONS } from '../constants';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import { useEmployees } from '../contexts/EmployeeContext';
import { User } from '../types';

interface EmployeeDashboardProps {
  activeView: string;
  currentUser: User;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ activeView, currentUser }) => {
  const { employees } = useEmployees();
  const employee = employees.find(e => e.id === currentUser.employeeId);

  if (!employee) {
    return <div>Employee data not found.</div>;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
           <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Days Present" value={employee.attendance.present.toString()} icon={ICONS.recruitment} color="bg-green-100 text-green-600" />
              <StatCard title="Latest Performance" value={`${employee.performance.slice(-1)[0]}%`} icon={ICONS.performance} color="bg-blue-100 text-blue-600" />
            </div>
            <PerformanceChart data={[employee]} />
          </div>
        );
      case 'My Profile':
        return <p>Personal Profile Details for {employee.name}</p>;
      case 'Performance':
        return <p>Detailed Personal Performance History for {employee.name}</p>;
      default:
        return <div>Select a view</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default EmployeeDashboard;
