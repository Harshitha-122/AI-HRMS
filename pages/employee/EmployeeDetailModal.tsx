import React from 'react';
// FIX: Corrected import paths for types and components.
import { Employee } from '../../types';
import PerformanceChart from '../../components/PerformanceChart';

interface EmployeeDetailModalProps {
  employee: Employee;
  onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center text-sm text-gray-600">
    <div className="w-5 h-5 mr-3 text-gray-400">{icon}</div>
    <div>
      <span className="font-semibold">{label}:</span> {value}
    </div>
  </div>
);

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ employee, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl m-4 w-full max-w-2xl transform transition-all animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <img className="h-16 w-16 rounded-full object-cover" src={employee.avatarUrl} alt="Employee Avatar" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
                <p className="text-gray-600">{employee.role} - {employee.department}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <h3 className="text-lg font-semibold text-gray-700 col-span-full mb-2">Job Information</h3>
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" clipRule="evenodd" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>}
              label="Role"
              value={`${employee.role}, ${employee.department}`}
            />
             <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM4.5 8.5a.75.75 0 00-1.5 0v6.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.5a.75.75 0 00-1.5 0v6.25H4.5V8.5z" clipRule="evenodd" /></svg>}
              label="Hire Date"
              value={new Date(employee.hireDate).toLocaleDateString()}
            />

            <h3 className="text-lg font-semibold text-gray-700 col-span-full mt-4 mb-2">Contact Information</h3>
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" /><path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" /></svg>}
              label="Email"
              value={employee.email}
            />
            <DetailItem 
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5h-1.528a1.5 1.5 0 01-1.491-1.355l-.42-1.89a.75.75 0 00-1.45.32l.42 1.89a3 3 0 01-2.982 2.71A12.035 12.035 0 012 3.5z" clipRule="evenodd" /></svg>}
              label="Phone"
              value={employee.phone}
            />
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{employee.attendance.present}</p>
                <p className="text-sm text-gray-500">Days Present</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{employee.attendance.absent}</p>
                <p className="text-sm text-gray-500">Days Absent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{employee.attendance.late}</p>
                <p className="text-sm text-gray-500">Late Arrivals</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
             <PerformanceChart data={[employee]} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;