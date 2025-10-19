import React from 'react';
import { MOCK_EMPLOYEES, ICONS } from './constants';
import StatCard from './components/StatCard';
import PerformanceChart from './components/PerformanceChart';
import EmployeeList from './pages/employee/EmployeeList';
import RecruitmentDashboard from './pages/recruitment/RecruitmentDashboard';
import PerformanceDashboard from './pages/performance/PerformanceDashboard';

interface AdminDashboardProps {
  activeView: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeView }) => {
  
  const totalEmployees = MOCK_EMPLOYEES.length;
  const avgPerformance = (MOCK_EMPLOYEES.reduce((acc, emp) => acc + emp.performance.slice(-1)[0], 0) / totalEmployees).toFixed(1);
  const totalDepartments = [...new Set(MOCK_EMPLOYEES.map(e => e.department))].length;

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
            <PerformanceChart data={MOCK_EMPLOYEES} />
          </div>
        );
      case 'Employees':
        return <EmployeeList />;
      case 'Recruitment':
        return <RecruitmentDashboard />;
      case 'Performance':
        return <PerformanceDashboard employees={MOCK_EMPLOYEES}/>;
      default:
        return <div>Select a view</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default AdminDashboard;