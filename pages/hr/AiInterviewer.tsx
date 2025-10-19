import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connectToAiInterviewer, analyzeInterviewTranscript } from '../../services/geminiService';
import { TranscriptionTurn, InterviewAnalysisResult } from '../../types';
import InterviewAnalysisModal from './InterviewAnalysisModal';
import { encode, decode, decodeAudioData } from '../../utils/audioUtils';
import type { LiveServerMessage } from '@google/genai';

type LiveSession = Awaited<ReturnType<typeof connectToAiInterviewer>>;

const AiInterviewer: React.FC = () => {
    const [isInterviewing, setIsInterviewing] = useState(false);
    const [status, setStatus] = useState<'idle' | 'listening' | 'speaking' | 'connecting' | 'error'>('idle');
    const [jobRole, setJobRole] = useState('Software Engineer');
    const [systemInstruction, setSystemInstruction] = useState('Keep your questions relevant to the role and your answers concise.');
    const [transcription, setTranscription] = useState<TranscriptionTurn[]>([]);
    const [analysisResult, setAnalysisResult] = useState<InterviewAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Advanced settings state
    const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
    const [tone, setTone] = useState('Friendly');
    const [speed, setSpeed] = useState('Normal');
    const [language, setLanguage] = useState('English');
    
    const sessionRef = useRef<LiveSession | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const currentInputTranscriptionRef = useRef('');
    const currentOutputTranscriptionRef = useRef('');

    useEffect(() => {
        const savedTone = localStorage.getItem('aiInterviewer_tone');
        if (savedTone) setTone(savedTone);
    }, []);

    useEffect(() => {
        localStorage.setItem('aiInterviewer_tone', tone);
    }, [tone]);

    const stopAudioPlayback = () => {
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    };
    
    const cleanupSession = useCallback(() => {
        setIsInterviewing(false);
        setStatus('idle');
        stopAudioPlayback();
        sessionRef.current?.close();
        sessionRef.current = null;
        processorRef.current?.disconnect();
        processorRef.current = null;
        inputAudioContextRef.current?.close().catch(console.error);
        outputAudioContextRef.current?.close().catch(console.error);
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }, []);

    const handleEndInterview = useCallback(async () => {
        if (!isInterviewing) return;
        
        const finalTranscription = [
            ...transcription,
            { speaker: 'user' as const, text: currentInputTranscriptionRef.current.trim() },
            { speaker: 'model' as const, text: currentOutputTranscriptionRef.current.trim() },
        ].filter(t => t.text);

        cleanupSession();

        if (finalTranscription.length > 1) {
            setIsAnalyzing(true);
            try {
                const result = await analyzeInterviewTranscript(jobRole, finalTranscription);
                setAnalysisResult(result);
            } catch (error) {
                console.error("Failed to analyze interview:", error);
                setStatus('error');
            } finally {
                setIsAnalyzing(false);
            }
        }
    }, [isInterviewing, transcription, cleanupSession, jobRole]);


    const handleMessage = useCallback(async (message: LiveServerMessage) => {
        if (message.serverContent?.outputTranscription?.text) {
            setStatus('speaking');
            currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
        }
        if (message.serverContent?.inputTranscription?.text) {
            setStatus('listening');
            currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
        }
        if (message.serverContent?.turnComplete) {
            const fullInput = currentInputTranscriptionRef.current.trim();
            const fullOutput = currentOutputTranscriptionRef.current.trim();
             if (fullInput || fullOutput) {
                setTranscription(prev => [...prev, { speaker: 'user', text: fullInput }, { speaker: 'model', text: fullOutput }]);
            }
            currentInputTranscriptionRef.current = '';
            currentOutputTranscriptionRef.current = '';
            setStatus('listening');
        }

        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
        if (base64Audio && outputAudioContextRef.current) {
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
    }, []);

    const startInterview = async () => {
        if (isInterviewing) return;
        
        setTranscription([]);
        setAnalysisResult(null);
        setStatus('connecting');
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            const finalSystemInstruction = `You are an HR interviewer conducting a pre-screening for a ${jobRole} role. You must conduct the interview in a ${tone.toLowerCase()} tone. ${systemInstruction}`;

            const sessionPromise = connectToAiInterviewer(finalSystemInstruction, {
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
                    setIsInterviewing(true);
                },
                onmessage: handleMessage,
                onerror: (e) => { console.error('Session error:', e); setStatus('error'); cleanupSession(); },
                onclose: () => { cleanupSession(); },
            });
            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error("Failed to start interview:", err);
            setStatus('error');
        }
    };
    
    useEffect(() => () => { cleanupSession(); }, [cleanupSession]);

    const getStatusIndicator = () => {
        switch (status) {
            case 'connecting': return <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>;
            case 'listening': return <div className="w-4 h-4 rounded-full bg-green-500"></div>;
            case 'speaking': return <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>;
            case 'error': return <div className="w-4 h-4 rounded-full bg-red-500"></div>;
            default: return <div className="w-4 h-4 rounded-full bg-gray-400"></div>;
        }
    };
    
    const getButtonContent = () => {
        if (isAnalyzing) return 'Analyzing...';
        if (isInterviewing) return 'End Interview';
        return 'Start Interview';
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Voice Interviewer</h1>
                <p className="text-gray-500 mb-6">Conduct real-time, voice-based candidate screenings and get instant analysis.</p>
                
                <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                            <input
                                type="text"
                                id="jobRole"
                                value={jobRole}
                                onChange={(e) => setJobRole(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., Senior Product Manager"
                                disabled={isInterviewing || isAnalyzing}
                            />
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                            <select
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                disabled={isInterviewing || isAnalyzing}
                            >
                                <option>Friendly</option>
                                <option>Formal</option>
                                <option>Neutral</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="systemInstruction" className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions</label>
                        <textarea
                            id="systemInstruction"
                            rows={2}
                            value={systemInstruction}
                            onChange={(e) => setSystemInstruction(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., Focus on behavioral questions..."
                            disabled={isInterviewing || isAnalyzing}
                        />
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 pt-2">
                        <button
                            onClick={isInterviewing ? handleEndInterview : startInterview}
                            disabled={isAnalyzing}
                            className={`px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 ${
                                isInterviewing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                            {getButtonContent()}
                        </button>
                        <div className="flex items-center space-x-2">
                            {getStatusIndicator()}
                            <span className="text-gray-600 capitalize">{isAnalyzing ? 'Analyzing' : status}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-lg h-96 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Live Transcription</h3>
                    <div className="space-y-4">
                        {transcription.filter(t => t.text).map((turn, index) => (
                            <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-3 rounded-lg ${turn.speaker === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="font-bold capitalize">{turn.speaker === 'user' ? 'You' : 'Interviewer'}</p>
                                    <p>{turn.text}</p>
                                </div>
                            </div>
                        ))}
                         {isInterviewing && status !== 'idle' && <div className="text-gray-400 text-center italic">...</div>}
                         {!isInterviewing && transcription.length === 0 && <p className="text-center text-gray-500 py-16">Transcription will appear here once the interview starts.</p>}
                    </div>
                </div>
            </div>
            {analysisResult && <InterviewAnalysisModal result={analysisResult} onClose={() => setAnalysisResult(null)} />}
        </div>
    );
};

export default AiInterviewer;
