import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  // FIX: Explicitly use React.JSX.Element to resolve the type from the imported React module.
  icon: React.JSX.Element;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, onClick }) => {
  const interactiveClasses = onClick 
    ? 'cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200' 
    : '';

  return (
    <div 
      className={`bg-white p-6 rounded-lg shadow-md flex items-center ${interactiveClasses}`}
      onClick={onClick}
    >
      <div className={`p-4 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;