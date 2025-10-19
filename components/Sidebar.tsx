import React, { useState } from 'react';
// FIX: Corrected import paths for types and constants.
import { UserRole } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  userRole: UserRole;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // FIX: Explicitly use React.JSX.Element to resolve the type from the imported React module.
  const navLinks: { [key in UserRole]: { name: string; icon: React.JSX.Element }[] } = {
    [UserRole.Admin]: [
      { name: 'Dashboard', icon: ICONS.dashboard },
      { name: 'Employees', icon: ICONS.employees },
      { name: 'Recruitment', icon: ICONS.recruitment },
      { name: 'Performance', icon: ICONS.performance },
    ],
    [UserRole.Manager]: [
      { name: 'Dashboard', icon: ICONS.dashboard },
      { name: 'My Team', icon: ICONS.employees },
      { name: 'Performance', icon: ICONS.performance },
    ],
    [UserRole.HR]: [
      { name: 'Dashboard', icon: ICONS.recruitment },
      { name: 'AI Resume Screener', icon: ICONS.recruitment },
      { name: 'AI Interviewer', icon: ICONS.recruitment },
      { name: 'Employees', icon: ICONS.employees },
    ],
    [UserRole.Employee]: [
      { name: 'Dashboard', icon: ICONS.dashboard },
      { name: 'My Profile', icon: ICONS.profile },
      { name: 'Performance', icon: ICONS.performance },
    ],
  };

  const links = navLinks[userRole];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Synergy</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <a
            key={link.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(link.name);
              if (isSidebarOpen) setIsSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
              activeView === link.name
                ? 'bg-primary-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {link.icon}
            <span className="ml-4">{link.name}</span>
          </a>
        ))}
      </nav>
      <div className="px-4 py-6 border-t border-gray-700">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onLogout(); }}
          className="flex items-center px-4 py-3 text-lg text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white"
        >
          {ICONS.logout}
          <span className="ml-4">Logout</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile-only hamburger menu */}
      <button 
        className="lg:hidden p-4 text-gray-500 absolute top-4 left-4 z-30"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
      </button>

      {/* Sidebar for large screens */}
      <aside className="hidden lg:block lg:flex-shrink-0 w-64 bg-gray-800 text-white">
        {sidebarContent}
      </aside>

      {/* Sidebar for mobile (drawer) */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative w-64 h-full bg-gray-800 text-white">
          {sidebarContent}
        </div>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
      </div>
    </>
  );
};

export default Sidebar;