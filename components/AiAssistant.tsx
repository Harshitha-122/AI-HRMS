import React from 'react';
import { useAiAssistant } from '../hooks/useAiAssistant';
import { User, Employee, JobOpening, TranscriptionTurn } from '../types';
import { SparklesIcon, MicrophoneIcon, CloseIcon } from './icons';

interface AiAssistantProps {
  currentUser: User;
  employees: Employee[];
  jobOpenings: JobOpening[];
  setActiveView: (view: string) => void;
  updateEmployee: (employee: Employee) => void;
}

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const baseClasses = "w-16 h-16 rounded-full flex items-center justify-center text-white transition-colors duration-300";
  const icon = <div className="w-8 h-8"><MicrophoneIcon /></div>;

  switch (status) {
    case 'listening':
      return <div className={`${baseClasses} bg-green-500`}>{icon}</div>;
    case 'speaking':
      return <div className={`${baseClasses} bg-blue-500 animate-pulse`}>{icon}</div>;
    case 'thinking':
    case 'connecting':
      return <div className={`${baseClasses} bg-yellow-500 animate-pulse`}>{icon}</div>;
    case 'error':
      return <div className={`${baseClasses} bg-red-500`}>{icon}</div>;
    default:
      return <div className={`${baseClasses} bg-gray-400`}>{icon}</div>;
  }
};

const TranscriptMessage: React.FC<{ turn: TranscriptionTurn }> = ({ turn }) => {
  const isModel = turn.speaker === 'model';
  return (
    <div className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white"><SparklesIcon /></div>}
      <div className={`max-w-md p-3 rounded-lg text-sm ${isModel ? 'bg-gray-100 text-gray-800' : 'bg-primary-600 text-white'}`}>
        <p>{turn.text}</p>
      </div>
    </div>
  );
};

const AiAssistant: React.FC<AiAssistantProps> = (props) => {
  const { isAssistantOpen, openAssistant, closeAssistant, status, transcript, error } = useAiAssistant(props);

  return (
    <>
      <button
        onClick={openAssistant}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Open AI Assistant"
      >
        <SparklesIcon />
      </button>

      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onMouseDown={closeAssistant}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[70vh] flex flex-col transform transition-all animate-fade-in"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <SparklesIcon />
                <h2 className="text-lg font-bold text-gray-800">Synergy AI Assistant</h2>
              </div>
              <button onClick={closeAssistant} className="text-gray-400 hover:text-gray-600">
                <CloseIcon />
              </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {transcript.map((turn, index) => (
                  <TranscriptMessage key={index} turn={turn} />
                ))}
              </div>
            </main>

            <footer className="p-4 border-t flex flex-col items-center justify-center gap-2">
              <StatusIndicator status={status} />
              {error ? (
                <p className="text-sm text-red-500 text-center">{error}</p>
              ) : (
                <p className="text-sm text-gray-500 capitalize">{status}</p>
              )}
              <button 
                onClick={status === 'idle' || status === 'error' ? openAssistant : closeAssistant}
                className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                {status === 'idle' || status === 'error' ? 'Try Again' : 'End Session'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant;