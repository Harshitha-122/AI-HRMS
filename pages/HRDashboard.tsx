import React from 'react';
import ResumeScreener from './hr/ResumeScreener';
import AiInterviewer from './hr/AiInterviewer';
import EmployeeList from './employee/EmployeeList';
import RecruitmentDashboard from './recruitment/RecruitmentDashboard';

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