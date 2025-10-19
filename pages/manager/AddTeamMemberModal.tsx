import React, { useState } from 'react';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee } from '../../types';

interface AddTeamMemberModalProps {
  team: Employee[];
  onClose: () => void;
  onAddMembers: (newMemberIds: number[]) => void;
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ team, onClose, onAddMembers }) => {
  const { employees: allEmployees } = useEmployees();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const teamMemberIds = team.map(member => member.id);
  const potentialNewMembers = allEmployees.filter(emp => !teamMemberIds.includes(emp.id));

  const handleToggleSelection = (employeeId: number) => {
    setSelectedIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSubmit = () => {
    onAddMembers(selectedIds);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Team Members</h2>
          <div className="h-64 overflow-y-auto border rounded-md p-2 space-y-2">
            {potentialNewMembers.length > 0 ? (
              potentialNewMembers.map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                  <div className="flex items-center">
                    <img src={employee.avatarUrl} alt={employee.name} className="w-8 h-8 rounded-full mr-3" />
                    <div>
                      <p className="font-semibold text-gray-800">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.role}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(employee.id)}
                    onChange={() => handleToggleSelection(employee.id)}
                    className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500"
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No other employees available to add.</p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={handleSubmit} disabled={selectedIds.length === 0} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:bg-gray-400">Add Selected</button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
