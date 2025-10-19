import React, { useState } from 'react';
import { HiredCandidate, JobOpening } from '../../types';

interface AddNewHireModalProps {
  jobOpenings: JobOpening[];
  onClose: () => void;
  onAddHire: (newHire: Omit<HiredCandidate, 'id'>) => void;
}

const AddNewHireModal: React.FC<AddNewHireModalProps> = ({ jobOpenings, onClose, onAddHire }) => {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [expertise, setExpertise] = useState('');
  const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !jobTitle || !hireDate) {
      alert('Please fill all required fields.');
      return;
    }
    
    const newHire: Omit<HiredCandidate, 'id'> = {
      name,
      jobTitle,
      expertise: expertise.split(',').map(s => s.trim()).filter(Boolean),
      hireDate,
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    onAddHire(newHire);
  };

  const openJobTitles = jobOpenings
    .filter(job => job.status === 'Open')
    .map(job => job.title);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Hire</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                 <select name="jobTitle" id="jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                    <option value="">Select a position</option>
                    {openJobTitles.map(title => <option key={title} value={title}>{title}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">Expertise (comma-separated)</label>
                <input type="text" name="expertise" id="expertise" value={expertise} onChange={e => setExpertise(e.target.value)} placeholder="e.g., React, Node.js, SEO" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
              <div>
                <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">Hire Date</label>
                <input type="date" name="hireDate" id="hireDate" value={hireDate} onChange={e => setHireDate(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"/>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700">Add Hire</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewHireModal;