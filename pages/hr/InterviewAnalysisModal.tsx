import React from 'react';
import { InterviewAnalysisResult } from '../../types';

interface InterviewAnalysisModalProps {
  result: InterviewAnalysisResult;
  onClose: () => void;
}

const InterviewAnalysisModal: React.FC<InterviewAnalysisModalProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl m-4 w-full max-w-2xl transform transition-all animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">Interview Analysis Complete</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
            <div className="flex justify-between items-start p-6 bg-gray-50 rounded-lg">
                <div>
                    <p className={`text-xl font-bold ${result.isQualified ? 'text-green-600' : 'text-red-600'}`}>
                    {result.recommendation}
                    </p>
                    <p className="text-gray-600 mt-1">{result.summary}</p>
                </div>
                 <div className="text-center ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">Overall Score</p>
                    <p className={`text-5xl font-bold ${result.overallScore > 75 ? 'text-green-600' : result.overallScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {result.overallScore}
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-green-700">Strengths</h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                    {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-red-700">Weaknesses</h3>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
                    {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
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

export default InterviewAnalysisModal;