import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { User, Employee, JobOpening, UserRole, TranscriptionTurn } from '../types';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';
import type { LiveServerMessage, FunctionDeclaration } from '@google/genai';

type LiveSession = Awaited<ReturnType<GoogleGenAI['live']['connect']>>;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AssistantProps {
  currentUser: User;
  employees: Employee[];
  jobOpenings: JobOpening[];
  setActiveView: (view: string) => void;
  updateEmployee: (employee: Employee) => void;
}

export const useAiAssistant = ({ currentUser, employees, jobOpenings, setActiveView, updateEmployee }: AssistantProps) => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error'>('idle');
  const [transcript, setTranscript] = useState<TranscriptionTurn[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const sessionRef = useRef<LiveSession | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const stopAudioPlayback = useCallback(() => {
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  }, []);

  const cleanupSession = useCallback(() => {
    setStatus('idle');
    stopAudioPlayback();
    sessionRef.current?.close();
    sessionRef.current = null;
    processorRef.current?.disconnect();
    processorRef.current = null;
    // Do not close contexts here to reuse them
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  }, [stopAudioPlayback]);

  const closeAssistant = useCallback(() => {
    setIsAssistantOpen(false);
    cleanupSession();
  }, [cleanupSession]);

  const toolFunctions: { [key: string]: (args: any) => any } = {
    getOverallStats: () => ({
      totalEmployees: employees.length,
      totalDepartments: [...new Set(employees.map(e => e.department))].length,
      openPositions: jobOpenings.filter(j => j.status === 'Open').length,
    }),
    getTeamStats: () => {
      const manager = employees.find(e => e.id === currentUser.employeeId);
      if (!manager) return { error: "Manager not found." };
      const team = employees.filter(e => e.department === manager.department && e.id !== manager.id);
      return {
        teamSize: team.length,
        avgPerformance: team.length > 0 ? (team.reduce((acc, emp) => acc + emp.performance.slice(-1)[0], 0) / team.length).toFixed(1) : 0,
      };
    },
    getMyStats: () => {
      const employee = employees.find(e => e.id === currentUser.employeeId);
      if (!employee) return { error: "Employee not found." };
      return {
        name: employee.name,
        role: employee.role,
        department: employee.department,
        latestPerformance: `${employee.performance.slice(-1)[0]}%`,
      };
    },
    navigateTo: ({ view }: { view: string }) => {
      const validViews: { [key: string]: string[] } = {
        Admin: ['Dashboard', 'Employees', 'Recruitment', 'Performance'],
        Manager: ['Dashboard', 'My Team', 'Performance'],
        HR: ['Dashboard', 'AI Resume Screener', 'AI Interviewer', 'Employees'],
        Employee: ['Dashboard', 'My Profile', 'Performance'],
      };
      const formattedView = view.charAt(0).toUpperCase() + view.slice(1).toLowerCase();
      const userValidViews = validViews[currentUser.role];
      const targetView = userValidViews.find(v => v.toLowerCase().includes(formattedView.toLowerCase()));
      
      if (targetView) {
        setActiveView(targetView);
        setTimeout(closeAssistant, 500); // Close assistant after a short delay
        return { success: true, message: `Navigating to ${targetView}.` };
      }
      return { success: false, message: `Sorry, I can't navigate to a page called '${view}'.` };
    },
    addTeamMember: ({ employeeName }: { employeeName: string }) => {
      const manager = employees.find(e => e.id === currentUser.employeeId);
      if (!manager) {
        return { success: false, message: "Could not identify the current manager." };
      }

      const employeeToAdd = employees.find(e => e.name.toLowerCase() === employeeName.toLowerCase().trim());
      if (!employeeToAdd) {
        return { success: false, message: `Could not find an employee named "${employeeName}". Please say the full, correct name.` };
      }

      if (employeeToAdd.department === manager.department) {
        return { success: false, message: `${employeeName} is already in your department.` };
      }
      
      const updatedEmployee = { ...employeeToAdd, department: manager.department };
      updateEmployee(updatedEmployee);

      return { success: true, message: `Okay, I've moved ${employeeName} to the ${manager.department} department, adding them to your team.` };
    },
  };

  const getToolDeclarations = (role: UserRole): FunctionDeclaration[] => {
    const commonTools = [{
      name: 'navigateTo',
      parameters: {
        type: Type.OBJECT,
        properties: { view: { type: Type.STRING, description: 'The name of the page to navigate to, e.g., "Employees" or "Dashboard".' } },
        required: ['view'],
      },
      description: 'Navigates the user to a specific page or view in the application.'
    }];

    switch (role) {
      case UserRole.Admin:
      case UserRole.HR:
        return [
          ...commonTools,
          { name: 'getOverallStats', parameters: { type: Type.OBJECT, properties: {} }, description: 'Gets overall company statistics like total employees and open job positions.' },
        ];
      case UserRole.Manager:
        return [
          ...commonTools,
          { name: 'getTeamStats', parameters: { type: Type.OBJECT, properties: {} }, description: "Gets statistics for the manager's own team, such as team size and average performance." },
          {
            name: 'addTeamMember',
            parameters: {
              type: Type.OBJECT,
              properties: {
                employeeName: {
                  type: Type.STRING,
                  description: "The full name of the employee to add to the manager's team."
                }
              },
              required: ['employeeName']
            },
            description: "Adds an existing employee to the manager's team. This is done by changing the employee's department to the manager's current department."
          }
        ];
      case UserRole.Employee:
         return [
          ...commonTools,
          { name: 'getMyStats', parameters: { type: Type.OBJECT, properties: {} }, description: 'Gets the personal stats for the current employee, like their role and latest performance score.' },
        ];
      default:
        return commonTools;
    }
  };

  const handleMessage = useCallback(async (message: LiveServerMessage) => {
    const updateTranscript = (speaker: 'user' | 'model', text: string) => {
        setTranscript(prev => {
            const newTranscript = [...prev];
            const last = newTranscript[newTranscript.length - 1];
            if (last?.speaker === speaker) {
                newTranscript[newTranscript.length - 1] = { ...last, text: text };
            } else {
                newTranscript.push({ speaker, text });
            }
            return newTranscript;
        });
    };

    if (message.serverContent?.outputTranscription?.text) {
        currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
        updateTranscript('model', currentOutputTranscriptionRef.current);
    }
    if (message.serverContent?.inputTranscription?.text) {
        setStatus('thinking');
        currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
        updateTranscript('user', currentInputTranscriptionRef.current);
    }
    if (message.serverContent?.turnComplete) {
        currentInputTranscriptionRef.current = '';
        currentOutputTranscriptionRef.current = '';
        setStatus('listening');
    }
    if (message.toolCall) {
        setStatus('thinking');
        const responses = [];
        for (const fc of message.toolCall.functionCalls) {
            const func = toolFunctions[fc.name];
            if (func) {
                const result = await Promise.resolve(func(fc.args));
                responses.push({ id: fc.id, name: fc.name, response: { result: JSON.stringify(result) } });
            }
        }
        sessionRef.current?.sendToolResponse({ functionResponses: responses });
    }
    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
    if (base64Audio && outputAudioContextRef.current) {
        setStatus('speaking');
        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
        const source = outputAudioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContextRef.current.destination);
        const startTime = Math.max(outputAudioContextRef.current.currentTime, nextStartTimeRef.current);
        source.start(startTime);
        nextStartTimeRef.current = startTime + audioBuffer.duration;
        audioSourcesRef.current.add(source);
        source.onended = () => {
            audioSourcesRef.current.delete(source);
            if (audioSourcesRef.current.size === 0) setStatus('listening');
        };
    }
    if (message.serverContent?.interrupted) {
        stopAudioPlayback();
    }
  }, [stopAudioPlayback, toolFunctions]);

  const startSession = async () => {
    setTranscript([]);
    setStatus('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Ensure audio contexts are running, and recreate if they were closed.
      if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
        inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }
      if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
        outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      await inputAudioContextRef.current.resume();
      await outputAudioContextRef.current.resume();
      
      const systemInstruction = `You are Synergy AI, a helpful voice assistant for the Synergy HRMS platform. Your goal is to provide quick answers and perform simple tasks. Use the available tools to answer questions. Be concise and professional. You must communicate only in English. The current user is ${currentUser.name}, who is an ${currentUser.role}.`;
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const processor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(processor);
            processor.connect(inputAudioContextRef.current!.destination);
            setStatus('listening');
            setTranscript([{ speaker: 'model', text: `Hi ${currentUser.name.split(' ')[0]}, how can I help you?` }]);
          },
          onmessage: handleMessage,
          onerror: (e) => { console.error('Session error:', e); setStatus('error'); setError('A connection error occurred.'); },
          onclose: () => { if (status !== 'error') setStatus('idle'); },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction,
          tools: [{ functionDeclarations: getToolDeclarations(currentUser.role) }],
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Failed to start assistant:", err);
      setStatus('error');
      setError('Could not access microphone. Please check permissions.');
    }
  };

  const openAssistant = () => {
    setError(null);
    setIsAssistantOpen(true);
    startSession();
  };
  
  useEffect(() => () => { 
    cleanupSession();
    inputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current?.close().catch(console.error);
  }, [cleanupSession]);

  return { isAssistantOpen, status, transcript, error, openAssistant, closeAssistant };
};