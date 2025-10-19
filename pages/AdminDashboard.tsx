import React from 'react';
import { ICONS } from '../constants';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import EmployeeList from './employee/EmployeeList';
import RecruitmentDashboard from './recruitment/RecruitmentDashboard';
import PerformanceDashboard from './performance/PerformanceDashboard';
import { useEmployees } from '../contexts/EmployeeContext';
import { User } from '../types';

interface AdminDashboardProps {
  activeView: string;
  currentUser: User; // Prop is passed but not used
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeView }) => {
  const { employees } = useEmployees();
  
  const totalEmployees = employees.length;
  const avgPerformance = totalEmployees > 0 ? (employees.reduce((acc, emp) => acc + emp.performance.slice(-1)[0], 0) / totalEmployees).toFixed(1) : '0';
  const totalDepartments = [...new Set(employees.map(e => e.department))].length;

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Employees" value={totalEmployees.toString()} icon={ICONS.employees} color="bg-blue-100 text-blue-600" />
              <StatCard title="Average Performance" value={`${avgPerformance}%`} icon={ICONS.performance} color="bg-green-100 text-green-600" />
              <StatCard title="Departments" value={totalDepartments.toString()} icon={ICONS.dashboard} color="bg-purple-100 text-purple-600" />
            </div>
            <PerformanceChart data={employees} />
          </div>
        );
      case 'Employees':
        return <EmployeeList />;
      case 'Recruitment':
        return <RecruitmentDashboard />;
      case 'Performance':
        return <PerformanceDashboard employees={employees}/>;
      default:
        return <div>Select a view</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default AdminDashboard;
