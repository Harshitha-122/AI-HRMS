import React from 'react';
import { MOCK_EMPLOYEES, ICONS } from './constants';
import StatCard from './components/StatCard';
import PerformanceChart from './components/PerformanceChart';
import EmployeeList from './pages/employee/EmployeeList';
import PerformanceDashboard from './pages/performance/PerformanceDashboard';

interface ManagerDashboardProps {
  activeView: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ activeView }) => {
  const team = MOCK_EMPLOYEES.slice(0, 3); // Mock team
  const teamSize = team.length;
  const avgPerformance = (team.reduce((acc, emp) => acc + emp.performance.slice(-1)[0], 0) / teamSize).toFixed(1);

  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Team Size" value={teamSize.toString()} icon={ICONS.employees} color="bg-blue-100 text-blue-600" />
              <StatCard title="Team Avg. Performance" value={`${avgPerformance}%`} icon={ICONS.performance} color="bg-green-100 text-green-600" />
            </div>
            <PerformanceChart data={team} />
          </div>
        );
      case 'My Team':
        return <EmployeeList employees={team} />;
      case 'Performance':
        return <PerformanceDashboard employees={team}/>;
      default:
        return <div>Select a view</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default ManagerDashboard;
