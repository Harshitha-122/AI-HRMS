import React from 'react';
import ResumeScreener from './pages/hr/ResumeScreener';
import AiInterviewer from './pages/hr/AiInterviewer';
import { ICONS, MOCK_EMPLOYEES } from './constants';
import StatCard from './components/StatCard';
import EmployeeList from './pages/employee/EmployeeList';
import RecruitmentDashboard from './pages/recruitment/RecruitmentDashboard';

interface HRDashboardProps {
  activeView: string;
}

const HRDashboard: React.FC<HRDashboardProps> = ({ activeView }) => {
  const renderContent = () => {
    switch (activeView) {
      case 'Dashboard':
        return <RecruitmentDashboard />;
      case 'AI Resume Screener':
        return <ResumeScreener />;
      case 'AI Interviewer':
        return <AiInterviewer />;
      case 'Employees':
        return <EmployeeList />;
      default:
        return <div>Select a view</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default HRDashboard;