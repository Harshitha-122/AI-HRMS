import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User } from '../types';
import { ROLES } from '../constants';

interface HeaderProps {
  activeView: string;
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, currentUser, onRoleChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userRole = currentUser.role;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-white shadow-sm p-4 lg:p-6 flex justify-between items-center">
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 pl-12 lg:pl-0">{activeView}</h1>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 focus:outline-none"
        >
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={currentUser.avatarUrl}
            alt="User avatar"
          />
          <div className="hidden md:block text-left">
            <div className="font-semibold text-gray-700">{currentUser.name}</div>
            <div className="text-sm text-gray-500">{userRole}</div>
          </div>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 text-xs text-gray-400">Switch Role</div>
            {ROLES.map((role) => (
              <a
                key={role}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onRoleChange(role);
                  setDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm ${
                  userRole === role
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {role}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
