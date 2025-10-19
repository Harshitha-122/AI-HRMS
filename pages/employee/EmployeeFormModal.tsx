import React, { useState, useEffect } from 'react';
import { Employee } from '../../types';
import { useEmployees } from '../../contexts/EmployeeContext';

interface EmployeeFormModalProps {
  employeeToEdit?: Employee | null;
  onClose: () => void;
}

const BLANK_EMPLOYEE: Omit<Employee, 'id'> = {
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  hireDate: '',
  avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
  performance: [80, 80, 80, 80, 80, 80], // Default performance
  attendance: { present: 0, absent: 0, late: 0 },
};

const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({ employeeToEdit, onClose }) => {
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(BLANK_EMPLOYEE);
  const { addEmployee, updateEmployee } = useEmployees();
  const isEditing = !!employeeToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData(employeeToEdit);
    } else {
      setFormData({...BLANK_EMPLOYEE, avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`});
    }
  }, [employeeToEdit, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && employeeToEdit) {
      updateEmployee({ ...employeeToEdit, ...formData });
    } else {
      addEmployee(formData);
    }
    onClose();
  };
  
  const departments = ['Technology', 'Product', 'Design', 'Human Resources', 'Marketing', 'Sales'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <input type="text" name="role" id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
               <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select name="department" id="department" value={formData.department} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option value="">Select a department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date</label>
                <input type="date" name="hireDate" id="hireDate" value={formData.hireDate} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700">{isEditing ? 'Save Changes' : 'Add Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
