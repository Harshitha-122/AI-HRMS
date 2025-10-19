import React from 'react';
import { UserRole } from '../types';
import { ROLES } from '../constants';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-700">Synergy AI HRMS</h1>
          <p className="text-gray-500 mt-2">The Future of HR Management</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 text-center">Select Your Role to Continue</h2>
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => onLogin(role)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Login as {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
