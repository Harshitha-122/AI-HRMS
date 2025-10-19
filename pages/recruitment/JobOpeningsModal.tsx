import React from 'react';
import { JobOpening } from '../../types';

interface JobOpeningsModalProps {
  jobOpenings: JobOpening[];
  onClose: () => void;
  onUpdateStatus: (jobId: number, newStatus: 'Open' | 'Closed' | 'On Hold') => void;
}

const JobOpeningsModal: React.FC<JobOpeningsModalProps> = ({ jobOpenings, onClose, onUpdateStatus }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Manage Job Openings</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobOpenings.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={job.status}
                        onChange={(e) => onUpdateStatus(job.id, e.target.value as 'Open' | 'Closed' | 'On Hold')}
                        className="p-1 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        aria-label={`Status for ${job.title}`}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobOpeningsModal;