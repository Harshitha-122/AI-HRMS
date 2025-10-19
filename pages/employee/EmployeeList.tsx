import React, { useState } from 'react';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee } from '../../types';
import EmployeeDetailModal from './EmployeeDetailModal';
import EmployeeFormModal from './EmployeeFormModal';

interface EmployeeListProps {
  employees?: Employee[]; // Optional prop to display a subset of employees
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees: passedEmployees }) => {
  const { employees: allEmployees, deleteEmployee } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const employeesToDisplay = passedEmployees || allEmployees;

  const filteredEmployees = employeesToDisplay.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  };

  const handleAddNew = () => {
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setIsFormModalOpen(true);
  };

  const handleDelete = (employeeId: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(employeeId);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        <div className="w-full md:w-auto flex gap-2">
          <input 
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
          >
            + Add Employee
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={employee.avatarUrl} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleViewDetails(employee)} className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                  <button onClick={() => handleEdit(employee)} className="text-yellow-600 hover:text-yellow-900 mr-3">Edit</button>
                  <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDetailModalOpen && selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setIsDetailModalOpen(false)} 
        />
      )}

      {isFormModalOpen && (
        <EmployeeFormModal
          employeeToEdit={employeeToEdit}
          onClose={() => {
            setIsFormModalOpen(false);
            setEmployeeToEdit(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
