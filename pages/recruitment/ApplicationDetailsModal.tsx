import React from 'react';
import { JobOpening } from '../../types';

interface ApplicationDetailsModalProps {
  jobOpenings: JobOpening[];
  onClose: () => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ jobOpenings, onClose }) => {
    const totalApplications = jobOpenings.reduce((sum, job) => sum + job.applications, 0);
    const totalInterviews = jobOpenings.reduce((sum, job) => sum + job.interviews, 0);
    const totalHired = jobOpenings.reduce((sum, job) => sum + job.hired, 0);
    const uniqueHiringManagers = new Set(jobOpenings.map(job => job.hiringManager)).size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Application Pipeline Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiring Manager</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Interviews</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hired</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobOpenings.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.hiringManager}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{job.applications}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{job.interviews}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{job.hired}</td>
                  </tr>
                ))}
              </tbody>
               <tfoot className="bg-gray-100 font-bold">
                <tr>
                  <td className="px-6 py-3 text-left text-sm text-gray-700 uppercase">Total</td>
                  <td className="px-6 py-3 text-left text-sm text-gray-700">{uniqueHiringManagers} Unique Managers</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">{totalApplications}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">{totalInterviews}</td>
                  <td className="px-6 py-3 text-right text-sm text-gray-700">{totalHired}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
         <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;