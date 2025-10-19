
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { TranscriptionTurn, InterviewAnalysisResult } from "../types";

if (!process.env.API_KEY) {
  console.warn(
    "API_KEY environment variable not set. Please provide a valid API key for the app to function."
  );
}

// FIX: Initialize GoogleGenAI strictly with the environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const screenResume = async (jobDescription: string, resumeFile: { data: string; mimeType: string }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `
              **Job Description:**
              ${jobDescription}

              **Instructions:**
              Act as an expert HR Recruiter. Analyze the candidate's resume, provided as a file, against the job description.
              Extract the relevant information from the resume and provide a detailed evaluation in the structured JSON format below.
              The overall score should be an integer between 0 and 100.
            `
          },
          {
            inlineData: {
              mimeType: resumeFile.mimeType,
              data: resumeFile.data,
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidateName: { type: Type.STRING, description: "The candidate's full name from the resume." },
            overallScore: { type: Type.INTEGER, description: "A score from 0-100 based on the resume's match to the job description." },
            summary: { type: Type.STRING, description: "A brief summary of the candidate's profile and fit for the role." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key strengths and matching qualifications." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of potential weaknesses or areas lacking experience." },
            isQualified: { type: Type.BOOLEAN, description: "A boolean indicating if the candidate is qualified for an interview." }
          },
          required: ["candidateName", "overallScore", "summary", "strengths", "weaknesses", "isQualified"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error screening resume:", error);
    throw new Error("Failed to analyze resume with Gemini API.");
  }
};

export const analyzeInterviewTranscript = async (jobRole: string, transcript: TranscriptionTurn[]): Promise<InterviewAnalysisResult> => {
  try {
    const conversationHistory = transcript.map(turn => `${turn.speaker === 'user' ? 'Candidate' : 'Interviewer'}: ${turn.text}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            text: `
              **Context:**
              You are an expert HR Manager tasked with analyzing an interview transcript.
              The candidate was interviewed for the role of: **${jobRole}**.

              **Interview Transcript:**
              ${conversationHistory}

              **Instructions:**
              Based on the transcript, evaluate the candidate's suitability for the role.
              Provide a detailed analysis in the structured JSON format below.
              The overall score should be an integer between 0 and 100, reflecting their qualifications, communication skills, and fit for the role.
              The recommendation should be a clear action item for the recruiter.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isQualified: { type: Type.BOOLEAN, description: "A boolean indicating if the candidate seems qualified based on the interview." },
            overallScore: { type: Type.INTEGER, description: "A score from 0-100 based on the candidate's performance." },
            summary: { type: Type.STRING, description: "A brief summary of the candidate's interview performance and fit for the role." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the candidate's key strengths observed during the interview." },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of potential weaknesses or areas for improvement." },
            recommendation: { type: Type.STRING, description: "A final recommendation, e.g., 'Proceed to next round', 'Hold for future consideration', 'Reject'." }
          },
          required: ["isQualified", "overallScore", "summary", "strengths", "weaknesses", "recommendation"],
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing interview transcript:", error);
    throw new Error("Failed to analyze interview with Gemini API.");
  }
};

// FIX: The 'LiveSession' type is not exported from '@google/genai'. The return type is now inferred from the SDK.
export const connectToAiInterviewer = (
  systemInstruction: string,
  callbacks: {
    onopen: () => void;
    onmessage: (message: any) => void;
    onerror: (e: any) => void;
    onclose: (e: any) => void;
  }
): ReturnType<typeof ai.live.connect> => {
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: callbacks,
    config: {
      // FIX: Use Modality.AUDIO enum for type safety as per guidelines.
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      inputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: systemInstruction,
    },
  });
};