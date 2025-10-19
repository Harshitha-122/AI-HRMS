import React, { useState } from 'react';
import { HiredCandidate, JobOpening } from '../../types';
import AddNewHireModal from './AddNewHireModal';

interface HiredCandidatesModalProps {
  candidates: HiredCandidate[];
  jobOpenings: JobOpening[];
  onClose: () => void;
  onAddNewHire: (newHire: Omit<HiredCandidate, 'id'>) => void;
}

const HiredCandidatesModal: React.FC<HiredCandidatesModalProps> = ({ candidates, jobOpenings, onClose, onAddNewHire }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleFormSubmit = (newHire: Omit<HiredCandidate, 'id'>) => {
        onAddNewHire(newHire);
        setIsAddModalOpen(false); // Close form after submission
    };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-4xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Hired Candidates</h2>
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 whitespace-nowrap"
            >
                + Add New Hire
            </button>
          </div>
          <div className="overflow-y-auto max-h-[60vh]">
            {candidates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates.map(candidate => (
                        <div key={candidate.id} className="bg-gray-50 border rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <img src={candidate.avatarUrl} alt={candidate.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800">{candidate.name}</p>
                                    <p className="text-sm text-gray-600">{candidate.jobTitle}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-xs text-gray-500 uppercase mb-1">Expertise</h4>
                                <div className="flex flex-wrap gap-1">
                                    {candidate.expertise.map(skill => (
                                        <span key={skill} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">Hired on: {new Date(candidate.hireDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">No candidates have been marked as hired this year.</p>
            )}
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
    {isAddModalOpen && (
        <AddNewHireModal 
            jobOpenings={jobOpenings}
            onClose={() => setIsAddModalOpen(false)}
            onAddHire={handleFormSubmit}
        />
    )}
    </>
  );
};

export default HiredCandidatesModal;