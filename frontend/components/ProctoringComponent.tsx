'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Types for landmarks
interface Point {
    x: number;
    y: number;
    z: number;
}

interface ProctoringComponentProps {
    onViolation: (reason: string) => void;
}

const ProctoringComponent: React.FC<ProctoringComponentProps> = ({ onViolation }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [status, setStatus] = useState<string>('Initializing...');
    const [isViolationDetected, setIsViolationDetected] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);

    // Constants
    const EYES_OPEN_THRESHOLD = 5000; // 5 seconds
    const EAR_THRESHOLD = 0.2;

    // Mutable refs
    const eyesOpenStartRef = useRef<number | null>(null);
    const faceMeshRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const violationTriggeredRef = useRef<boolean>(false);

    // Landmark indices
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

    const stopCameraStream = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const handleViolation = useCallback(() => {
        if (violationTriggeredRef.current) return;

        violationTriggeredRef.current = true;
        setIsViolationDetected(true);
        setStatus('VIOLATION DETECTED');

        try {
            cameraRef.current?.stop();
        } catch {}

        stopCameraStream();
        onViolation('Eyes open violation');
    }, [onViolation]);

    const onResults = useCallback((results: any) => {
        if (violationTriggeredRef.current) return;

        if (!results.multiFaceLandmarks?.length) {
            setStatus('No face detected');
            eyesOpenStartRef.current = null;
            setCountdown(0);
            return;
        }

        const landmarks = results.multiFaceLandmarks[0] as Point[];
        const leftEAR = computeEAR(LEFT_EYE, landmarks);
        const rightEAR = computeEAR(RIGHT_EYE, landmarks);
        const avgEAR = (leftEAR + rightEAR) / 2;

        const areEyesOpen = avgEAR >= EAR_THRESHOLD;

        if (areEyesOpen) {
            if (!eyesOpenStartRef.current) {
                eyesOpenStartRef.current = Date.now();
            } else {
                const duration = Date.now() - eyesOpenStartRef.current;
                setCountdown(Math.floor(duration / 1000));

                if (duration >= EYES_OPEN_THRESHOLD) {
                    handleViolation();
                }
            }
            setStatus(`Eyes OPEN (${avgEAR.toFixed(2)})`);
        } else {
            eyesOpenStartRef.current = null;
            setCountdown(0);
            setStatus(`Eyes CLOSED (${avgEAR.toFixed(2)})`);
        }
    }, [handleViolation]);

    useEffect(() => {
        let active = true;

        const init = async () => {
            try {
                const FaceMeshModule = await import('@mediapipe/face_mesh');
                const CameraModule = await import('@mediapipe/camera_utils');

                const FaceMesh = FaceMeshModule.FaceMesh;
                const Camera = CameraModule.Camera;

                const faceMesh = new FaceMesh({
                    locateFile: (file: string) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
                });

                faceMesh.setOptions({
                    maxNumFaces: 1,
                    refineLandmarks: true,
                    minDetectionConfidence: 0.7,
                    minTrackingConfidence: 0.7,
                });

                faceMesh.onResults(onResults);
                faceMeshRef.current = faceMesh;

                if (!videoRef.current) return;

                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (
                            active &&
                            faceMeshRef.current &&
                            videoRef.current &&
                            !violationTriggeredRef.current
                        ) {
                            try {
                                await faceMeshRef.current.send({
                                    image: videoRef.current,
                                });
                            } catch {}
                        }
                    },
                    width: 640,
                    height: 480,
                });

                await camera.start();

                if (!active) {
                    camera.stop();
                    stopCameraStream();
                    return;
                }

                cameraRef.current = camera;
                setIsLoaded(true);
                setStatus('Monitoring active');
            } catch (err: any) {
                console.error(err);
                setStatus('Initialization failed');
            }
        };

        init();

        return () => {
            active = false;
            try {
                cameraRef.current?.stop();
            } catch {}
            stopCameraStream();
            try {
                faceMeshRef.current?.close();
            } catch {}
        };
    }, [onResults]);

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-black/90 p-2 rounded-2xl border border-gray-700 shadow-2xl w-56">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-2">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                    autoPlay
                    muted
                    playsInline
                />

                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                        <div className="animate-spin h-6 w-6 border-b-2 border-orange-500 rounded-full" />
                    </div>
                )}

                {countdown > 0 && countdown < 5 && !isViolationDetected && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                        EYES OPEN: {countdown}s
                    </div>
                )}

                {isViolationDetected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-600/90">
                        <span className="text-white font-black text-xs uppercase">
                            Violation
                        </span>
                    </div>
                )}
            </div>

            <div className={`text-[10px] font-mono flex gap-2 items-center ${isViolationDetected ? 'text-red-400' : 'text-orange-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isViolationDetected ? 'bg-red-500' : 'bg-orange-500 animate-pulse'}`} />
                {status}
            </div>
        </div>
    );
};

export default ProctoringComponent;
