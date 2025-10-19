
import React, { useState } from 'react';
import { screenResume } from '../../services/geminiService';
// FIX: Corrected import path for types.
import { ResumeScreeningResult } from '../../types';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center space-x-2">
    <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '-0.3s' }}></div>
    <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '-0.15s' }}></div>
    <div className="w-4 h-4 rounded-full bg-primary-500 animate-bounce"></div>
    <span className="ml-2 text-gray-600">AI is analyzing...</span>
  </div>
);

const ResultDisplay: React.FC<{ result: ResumeScreeningResult }> = ({ result }) => (
  <div className="mt-8 p-6 bg-white rounded-lg shadow-md animate-fade-in">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{result.candidateName}</h2>
        <p className={`text-lg font-semibold ${result.isQualified ? 'text-green-600' : 'text-red-600'}`}>
          {result.isQualified ? 'Qualified for Interview' : 'Not a Strong Fit'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Overall Score</p>
        <p className={`text-4xl font-bold ${result.overallScore > 75 ? 'text-green-600' : result.overallScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
          {result.overallScore}
        </p>
      </div>
    </div>
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700">Summary</h3>
      <p className="mt-1 text-gray-600">{result.summary}</p>
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
);

const ResumeScreener: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to read file as base64 string'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || !selectedFile) {
      setError('Please provide a job description and upload a resume file.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const base64Data = await fileToBase64(selectedFile);
      const screeningResult = await screenResume(jobDescription, {
        data: base64Data,
        mimeType: selectedFile.type
      });
      setResult(screeningResult);
    } catch (err) {
      setError('An error occurred while analyzing the resume. The file format might not be supported by the AI. Please try a different file or format.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Resume Screener</h1>
        <p className="text-gray-500 mb-6">Evaluate candidates instantly by providing a job description and uploading their resume.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea
              id="jobDescription"
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
              placeholder="Paste the full job description here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="resumeFile" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>{selectedFile ? 'Change file' : 'Upload a file'}</span>
                    <input id="resumeFile" name="resumeFile" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOCX, TXT supported</p>
              </div>
            </div>
            {selectedFile && <p className="text-sm text-gray-600 mt-2">Selected file: <span className="font-medium text-gray-800">{selectedFile.name}</span></p>}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner /> : 'Analyze Resume'}
            </button>
          </div>
        </form>
      </div>
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default ResumeScreener;