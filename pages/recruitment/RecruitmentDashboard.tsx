import React, { useState } from 'react';
import { MOCK_JOB_OPENINGS, ICONS, MOCK_HIRED_CANDIDATES } from '../../constants';
import StatCard from '../../components/StatCard';
import { JobOpening, HiredCandidate } from '../../types';
import JobOpeningsModal from './JobOpeningsModal';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import HiredCandidatesModal from './HiredCandidatesModal';


const RecruitmentDashboard: React.FC = () => {
    const [jobOpenings, setJobOpenings] = useState<JobOpening[]>(MOCK_JOB_OPENINGS);
    const [hiredCandidates, setHiredCandidates] = useState<HiredCandidate[]>(MOCK_HIRED_CANDIDATES);
    const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
    const [isAppsModalOpen, setIsAppsModalOpen] = useState(false);
    const [isHiredModalOpen, setIsHiredModalOpen] = useState(false);

    const openPositionsCount = jobOpenings.filter(j => j.status === 'Open').length;
    const totalApplications = jobOpenings.reduce((sum, job) => sum + job.applications, 0);

    const handleUpdateJobStatus = (jobId: number, newStatus: 'Open' | 'Closed' | 'On Hold') => {
        setJobOpenings(prevOpenings => 
            prevOpenings.map(job => 
                job.id === jobId ? { ...job, status: newStatus } : job
            )
        );
    };
    
    const handleAddNewHire = (newHire: Omit<HiredCandidate, 'id'>) => {
        setHiredCandidates(prev => [
            ...prev,
            { ...newHire, id: Math.max(0, ...prev.map(c => c.id)) + 1 }
        ]);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Open Positions" 
                    value={openPositionsCount.toString()} 
                    icon={ICONS.recruitment} 
                    color="bg-blue-100 text-blue-600"
                    onClick={() => setIsJobsModalOpen(true)}
                />
                <StatCard 
                    title="Total Applications" 
                    value={totalApplications.toString()} 
                    icon={ICONS.employees} 
                    color="bg-purple-100 text-purple-600"
                    onClick={() => setIsAppsModalOpen(true)}
                />
                <StatCard 
                    title="Hired This Year" 
                    value={hiredCandidates.length.toString()} 
                    icon={ICONS.profile} 
                    color="bg-green-100 text-green-600"
                    onClick={() => setIsHiredModalOpen(true)}
                />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Job Openings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiring Manager</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobOpenings.map((job) => (
                                <tr key={job.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.hiringManager}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            job.status === 'Open' ? 'bg-green-100 text-green-800' :
                                            job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.applications}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isJobsModalOpen && (
                <JobOpeningsModal
                    jobOpenings={jobOpenings}
                    onClose={() => setIsJobsModalOpen(false)}
                    onUpdateStatus={handleUpdateJobStatus}
                />
            )}

            {isAppsModalOpen && (
                <ApplicationDetailsModal
                    jobOpenings={jobOpenings}
                    onClose={() => setIsAppsModalOpen(false)}
                />
            )}

            {isHiredModalOpen && (
                <HiredCandidatesModal
                    candidates={hiredCandidates}
                    jobOpenings={jobOpenings}
                    onClose={() => setIsHiredModalOpen(false)}
                    onAddNewHire={handleAddNewHire}
                />
            )}
        </div>
    );
};

export default RecruitmentDashboard;