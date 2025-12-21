'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Types for landmarks
interface Point {
    x: number;
    y: number;
    z: number;
}

interface FaceMeshResults {
    multiFaceLandmarks?: Point[][];
}

// Extend Window to include MediaPipe globals loaded from CDN
declare global {
    interface Window {
        FaceMesh: new (config: { locateFile: (file: string) => string }) => FaceMeshInstance;
        Camera: new (video: HTMLVideoElement, config: { onFrame: () => Promise<void>; width: number; height: number }) => CameraInstance;
    }
}

interface FaceMeshInstance {
    setOptions: (options: {
        maxNumFaces: number;
        refineLandmarks: boolean;
        minDetectionConfidence: number;
        minTrackingConfidence: number;
    }) => void;
    onResults: (callback: (results: FaceMeshResults) => void) => void;
    send: (input: { image: HTMLVideoElement }) => Promise<void>;
    close: () => void;
}

interface CameraInstance {
    start: () => Promise<void>;
    stop: () => void;
}

const ProctoringComponent: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<string>('Loading MediaPipe...');
    const [isEyesClosed, setIsEyesClosed] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    // Constants
    const CLOSED_TIME_THRESHOLD = 2000; // 2 seconds

    // Mutable state for logic
    const closedStartRef = useRef<number | null>(null);
    const faceMeshRef = useRef<FaceMeshInstance | null>(null);
    const cameraRef = useRef<CameraInstance | null>(null);

    // Landmark Indices
    const LEFT_EYE = [33, 160, 158, 133, 153, 144];
    const RIGHT_EYE = [362, 385, 387, 263, 373, 380];

    const distance = (a: Point, b: Point) => {
        return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const computeEAR = (eyeIndices: number[], landmarks: Point[]) => {
        const p1 = landmarks[eyeIndices[0]];
        const p2 = landmarks[eyeIndices[1]];
        const p3 = landmarks[eyeIndices[2]];
        const p4 = landmarks[eyeIndices[3]];
        const p5 = landmarks[eyeIndices[4]];
        const p6 = landmarks[eyeIndices[5]];

        const vertical1 = distance(p2, p6);
        const vertical2 = distance(p3, p5);
        const horizontal = distance(p1, p4);

        return (vertical1 + vertical2) / (2.0 * horizontal);
    };

    const handleSuspiciousActivity = useCallback(async (type: string, duration: number) => {
        try {
            await fetch("/api/proctor/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    duration,
                    timestamp: Date.now()
                })
            });
            console.log(`Reported ${type} to backend`);
        } catch (err) {
            console.error("Failed to report proctor event", err);
        }
    }, []);

    const onResults = useCallback((results: FaceMeshResults) => {
        if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setStatus("No face detected");
            return;
        }

        const landmarks = results.multiFaceLandmarks[0] as Point[];

        const leftEAR = computeEAR(LEFT_EYE, landmarks);
        const rightEAR = computeEAR(RIGHT_EYE, landmarks);
        const avgEAR = (leftEAR + rightEAR) / 2;

        // Debug: Log EAR value every frame (comment out after testing)
        console.log(`👁️ EAR: ${avgEAR.toFixed(3)} | Threshold: 0.2 | Eyes ${avgEAR < 0.2 ? 'CLOSED' : 'OPEN'}`);

        // Detection Logic
        if (avgEAR < 0.2) {
            if (!closedStartRef.current) {
                closedStartRef.current = Date.now();
                console.log("⏱️ Started tracking eye closure...");
            } else {
                const duration = Date.now() - closedStartRef.current;
                if (duration > CLOSED_TIME_THRESHOLD) {
                    handleSuspiciousActivity('EYE_CLOSED_TOO_LONG', duration);
                    setIsEyesClosed(true);
                    console.log("🚨 Eyes closed too long - Alert triggered!");
                    closedStartRef.current = null;
                }
            }
        } else {
            setIsEyesClosed(false);
            closedStartRef.current = null;
        }

        setStatus(`EAR: ${avgEAR.toFixed(3)}`);
    }, [handleSuspiciousActivity]);

    // Load MediaPipe scripts from CDN
    const loadScript = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            try {
                // Load MediaPipe scripts from CDN
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js');

                if (!isMounted) return;
                setStatus('Initializing Face Mesh...');

                // Wait for globals to be available
                await new Promise(resolve => setTimeout(resolve, 100));

                if (!window.FaceMesh || !window.Camera) {
                    throw new Error('MediaPipe failed to load');
                }

                const faceMesh = new window.FaceMesh({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.7
                });

                faceMesh.onResults(onResults);
                faceMeshRef.current = faceMesh;

                if (videoRef.current) {
                    const camera = new window.Camera(videoRef.current, {
                        onFrame: async () => {
                            if (videoRef.current && faceMeshRef.current) {
                                await faceMeshRef.current.send({ image: videoRef.current });
                            }
                        },
                        width: 640,
                        height: 480
                    });

                    await camera.start();
                    cameraRef.current = camera;
                    setIsLoaded(true);
                    setStatus("Tracking active");
                }
            } catch (error) {
                console.error('Error initializing MediaPipe:', error);
                setStatus('Failed to initialize');
            }
        };

        init();

        return () => {
            isMounted = false;
            if (faceMeshRef.current) faceMeshRef.current.close();
            if (videoRef.current) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream?.getTracks().forEach(t => t.stop());
            }
        };
    }, [onResults]);

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-2 rounded-lg border border-gray-700 shadow-lg w-64">
            <div className="relative aspect-video bg-gray-900 rounded overflow-hidden">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                    autoPlay
                    muted
                    playsInline
                />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />

                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-400">{status}</span>
                        </div>
                    </div>
                )}

                {isEyesClosed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500/50 animate-pulse">
                        <span className="text-white font-bold text-sm">WAKE UP!</span>
                    </div>
                )}
            </div>
            <div className="mt-2 text-xs text-green-400 font-mono">
                Status: {status}
            </div>
        </div>
    );
};

export default ProctoringComponent;
