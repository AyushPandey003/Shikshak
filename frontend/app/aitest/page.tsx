'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { AppState, AssessmentConfig, AssessmentReport, QuestionEntry } from '../../types/types';
import AssessmentForm from '../../components/AssessmentForm';
// import CameraPreview from './components/CameraPreview';
import ProctoringComponent from '../../components/ProctoringComponent';
import { decode, decodeAudioData, createBlob } from '../../utils/audio-utils';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionEntry[]>([]);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AssessmentReport | null>(null);
  const [liveTranscription, setLiveTranscription] = useState('');
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Audio Contexts
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  // Logical state tracking
  const currentIndexRef = useRef(0);
  const configRef = useRef<AssessmentConfig | null>(null);
  const questionsCountRef = useRef(0);
  const accumulatedTranscriptionRef = useRef('');
  const phaseRef = useRef<'ASKING' | 'WAITING_FOR_ANSWER'>('ASKING');
  const isFinishingRef = useRef(false);

  const handleStartSetup = (config: AssessmentConfig) => {
    setConfig(config);
    configRef.current = config;
    const initialQuestions = config.questions.map((q, i) => ({ id: `q-${i}`, text: q }));
    setQuestions(initialQuestions);
    questionsCountRef.current = initialQuestions.length;
    setAppState(AppState.PERMISSIONS);
  };

  const requestPermissions = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(audioStream);
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCamStream(videoStream);
      } catch (e) {
        console.warn('Camera access denied.');
      }
      setAppState(AppState.TESTING);
    } catch (err) {
      setError('Microphone access is mandatory.');
    }
  };

  const generateFinalReport = useCallback(async (qaHistory: { question: string, answer: string }[]) => {
    const finalReport: AssessmentReport = {
      title: configRef.current?.title || 'Oral Assessment',
      timestamp: new Date().toLocaleString(),
      totalQuestions: qaHistory.length,
      qa: qaHistory,
    };

    // Switch state FIRST to ensure we are off the testing screen
    setReport(finalReport);
    setAppState(AppState.REPORT);

    // Load AI summary in background
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Review this oral English assessment and provide a brief professional summary of the candidate's performance. 
    Questions and Answers:
    ${qaHistory.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}
    Summary:`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setAiSummary(response.text || 'Summary generation unavailable.');
    } catch (e) {
      console.error("Failed to generate AI summary:", e);
      setAiSummary('Assessment concluded.');
    }
  }, []);

  const finishTest = useCallback((violationReason?: string) => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;

    // 1. Stop and cleanup Live Session immediately
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch (e) { }
      sessionRef.current = null;
    }

    // Stop all media tracks explicitly
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    if (camStream) {
      camStream.getTracks().forEach(track => track.stop());
      setCamStream(null);
    }

    // 2. Prepare the history
    setQuestions(prev => {
      const qaHistory = prev.map((q, idx) => {
        let answer = q.answer || accumulatedTranscriptionRef.current || 'No response recorded';
        if (violationReason && idx >= currentIndexRef.current) {
          answer = `[Terminated: ${violationReason}]`;
        }
        return { question: q.text, answer };
      });

      // 3. Move to report phase
      setTimeout(() => generateFinalReport(qaHistory), 0);
      return prev;
    });

    if (violationReason) {
      setError(`Proctoring Alert: ${violationReason}. Your assessment has been recorded.`);
    }
  }, [generateFinalReport]);

  const handleLiveMessage = useCallback(async (message: LiveServerMessage) => {
    if (isFinishingRef.current) return;
    try {
      const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
      if (base64Audio && outputAudioCtxRef.current) {
        setIsAiSpeaking(true);
        const ctx = outputAudioCtxRef.current;
        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          activeSourcesRef.current.delete(source);
          if (activeSourcesRef.current.size === 0) setIsAiSpeaking(false);
        };
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += audioBuffer.duration;
        activeSourcesRef.current.add(source);
      }

      if (message.serverContent?.inputTranscription) {
        const text = message.serverContent.inputTranscription.text;
        if (phaseRef.current === 'WAITING_FOR_ANSWER') {
          accumulatedTranscriptionRef.current += text;
          setLiveTranscription(accumulatedTranscriptionRef.current);
          setIsListening(true);
        }
      }

      if (message.serverContent?.turnComplete) {
        if (phaseRef.current === 'ASKING') {
          phaseRef.current = 'WAITING_FOR_ANSWER';
          setIsListening(false);
        } else {
          const answerText = accumulatedTranscriptionRef.current.trim();
          const idx = currentIndexRef.current;

          setQuestions(prev => {
            const updated = [...prev];
            if (updated[idx]) updated[idx].answer = answerText || "(Silence recorded)";
            return updated;
          });

          if (idx < questionsCountRef.current - 1) {
            const nextIndex = idx + 1;
            currentIndexRef.current = nextIndex;
            setCurrentQuestionIndex(nextIndex);
            phaseRef.current = 'ASKING';
            accumulatedTranscriptionRef.current = '';
            setLiveTranscription('');

            setTimeout(() => {
              if (sessionRef.current && !isFinishingRef.current) {
                sessionRef.current.sendRealtimeInput({
                  text: `SYSTEM_COMMAND: EXECUTE_QUESTION_${nextIndex + 1}`
                });
              }
            }, 800);
          } else {
            setTimeout(() => finishTest(), 1500);
          }
        }
      }

      if (message.serverContent?.interrupted) {
        activeSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) { } });
        activeSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setIsAiSpeaking(false);
      }
    } catch (err) {
      console.error("Error in Live API message handler:", err);
    }
  }, [finishTest]);

  const startLiveAssessment = useCallback(async () => {
    if (!micStream || !configRef.current) return;

    setError(null);
    isFinishingRef.current = false;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const qList = configRef.current.questions.map((q, i) => `Question ${i + 1}: ${q}`).join('\n');
      const systemInstruction = `
        YOU ARE AN AUTOMATED QUESTION-READING TERMINAL. 
        
        YOUR SOURCE TEXT:
        ${qList}

        STRICT PROTOCOL:
        1. NO PERSONALITY. 
        2. DO NOT RESPOND TO THE USER.
        3. NO FOLLOW-UPS.
        4. ONLY SPEAK WHEN COMMANDED "SYSTEM_COMMAND: EXECUTE_QUESTION_X".
        5. ENGLISH ONLY.
      `.trim();

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            if (!inputAudioCtxRef.current) return;
            const source = inputAudioCtxRef.current.createMediaStreamSource(micStream);
            const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              if (isFinishingRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const blob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: blob });
              }).catch(() => { });
            };
            source.connect(processor);
            processor.connect(inputAudioCtxRef.current.destination);

            sessionPromise.then(session => {
              if (configRef.current && !isFinishingRef.current) {
                phaseRef.current = 'ASKING';
                session.sendRealtimeInput({ text: `SYSTEM_COMMAND: EXECUTE_QUESTION_1` });
              }
            }).catch(() => { });
          },
          onmessage: handleLiveMessage,
          onerror: (e) => {
            console.error('Session Error:', e);
            if (!isFinishingRef.current) setError('Connection error. Saving report.');
          },
          onclose: () => console.log('Session Closed'),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction,
          inputAudioTranscription: {},
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error('Failed to connect:', e);
      setError('Connection failed.');
    }
  }, [micStream, handleLiveMessage]);

  useEffect(() => {
    if (appState === AppState.TESTING) {
      startLiveAssessment();
    }
    return () => {
      if (sessionRef.current) {
        try { sessionRef.current.close(); } catch (e) { }
      }
      if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
        inputAudioCtxRef.current.close().catch(() => { });
      }
      if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
        outputAudioCtxRef.current.close().catch(() => { });
      }
    };
  }, [appState, startLiveAssessment]);

  useEffect(() => {
    if (appState === AppState.REPORT) {
      let activeCtx: AudioContext | null = null;
      const speakFinalMessage = async () => {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        try {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: 'The test is over. Open your eyes.' }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
              },
            },
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            activeCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(base64Audio), activeCtx, 24000, 1);
            const source = activeCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(activeCtx.destination);
            source.start();
          }
        } catch (e) {
          console.error("Failed to play final message audio:", e);
        }
      };
      const timer = setTimeout(speakFinalMessage, 1500);
      return () => {
        clearTimeout(timer);
        if (activeCtx && activeCtx.state !== 'closed') {
          activeCtx.close().catch(() => { });
        }
      };
    }
  }, [appState]);

  const handleProctoringViolation = useCallback((reason: string) => {
    finishTest(reason);
  }, [finishTest]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">AI Examiner <span className="text-blue-600">LIVE</span></h1>
          </div>
          {appState === AppState.TESTING && (
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
              <div className={`w-3 h-3 rounded-full ${isAiSpeaking ? 'bg-blue-500 animate-pulse' : (isListening ? 'bg-green-500 animate-ping' : 'bg-gray-300')}`} />
              <span className="text-sm font-semibold text-gray-700">
                {isAiSpeaking ? 'Examiner Speaking' : (isListening ? 'Listening' : 'Ready')}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between shadow-sm">
            <span className="font-medium">{error}</span>
            <button onClick={() => window.location.reload()} className="underline font-bold text-red-800">New Setup</button>
          </div>
        )}

        {appState === AppState.SETUP && <AssessmentForm onStart={handleStartSetup} />}

        {appState === AppState.PERMISSIONS && (
          <div className="max-w-xl mx-auto bg-white p-10 rounded-2xl shadow-xl text-center border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Prepare for Assessment</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Note: This is a <strong>closed-eye assessment</strong>.
              The proctoring system will monitor you. Keep your eyes closed throughout the test.
            </p>
            <button onClick={requestPermissions} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg active:scale-95 w-full">
              Confirm & Start
            </button>
          </div>
        )}

        {appState === AppState.TESTING && config && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <ProctoringComponent onViolation={handleProctoringViolation} />
            <div className="lg:col-span-5 space-y-6">
              {/* <CameraPreview stream={camStream} /> */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Progress</h3>
                  <span className="text-sm font-bold text-blue-600">{currentQuestionIndex + 1} / {questions.length}</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-700" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex-1 bg-white p-10 rounded-2xl shadow-md border border-gray-100 flex flex-col relative overflow-hidden">
                {isAiSpeaking && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Current Question</h3>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-3xl font-bold text-gray-900 leading-tight">
                    {questions[currentQuestionIndex]?.text}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-50 bg-gray-50 p-6 rounded-xl">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-ping' : 'bg-gray-300'}`} />
                    Answer Transcript
                  </h4>
                  <p className={`text-lg leading-relaxed ${liveTranscription ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                    {liveTranscription || (isListening ? 'Processing speech...' : 'Waiting for response...')}
                  </p>
                </div>
              </div>

              <button onClick={() => finishTest('Manually Ended')} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-100 shadow-sm">
                Terminate Exam
              </button>
            </div>
          </div>
        )}

        {appState === AppState.REPORT && report && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-12 rounded-2xl shadow-2xl border border-gray-100">
              <div className="flex justify-between items-start mb-10 border-b pb-8">
                <div>
                  <h1 className="text-4xl font-black text-gray-900 mb-2">Assessment Completed</h1>
                  <p className="text-xl text-gray-500">{report.title}</p>
                </div>
                <div className="text-right text-xs text-gray-400 font-mono">
                  <p>{report.timestamp}</p>
                </div>
              </div>

              {aiSummary && (
                <div className="mb-12 bg-blue-50 border border-blue-100 p-8 rounded-2xl">
                  <h3 className="text-blue-800 font-bold text-xs uppercase tracking-widest mb-4">Examiner's AI Summary</h3>
                  <p className="text-blue-900 text-lg leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                </div>
              )}

              <div className="space-y-12">
                {report.qa.map((item, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">{idx + 1}</span>
                      <h3 className="text-xl font-bold text-gray-900">{item.question}</h3>
                    </div>
                    <div className="ml-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 text-lg leading-relaxed italic shadow-inner">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t flex gap-4 no-print">
                <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                  Conduct New Assessment
                </button>
                <button onClick={() => window.print()} className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
                  Export PDF Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
