import { useEffect, useRef, useState, useContext } from "react";
import { InterviewContext } from "../../context/InterviewContext";

const LeftPanel = () => {
  const { setWarningCount } = useContext(InterviewContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseRef = useRef(null);
  const lastWarnRef = useRef(0); // Throttle: timestamp of last warning

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [warningMsg, setWarningMsg] = useState(""); // Current posture warning
  const [poseReady, setPoseReady] = useState(false);

  // ─── 1. Start camera + mic ───────────────────────────────────
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera/mic access denied:", err.message);
    }
  };

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = cameraOn ? false : true;
    setCameraOn((prev) => !prev);
  };

  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = micOn ? false : true;
    setMicOn((prev) => !prev);
  };

  useEffect(() => {
    startMedia();
  }, []);

  // ─── 2. Load MediaPipe Pose via CDN ─────────────────────────
  useEffect(() => {
    // MediaPipe Pose scripts are loaded in index.html via CDN
    // We poll until the global Pose object is ready
    const checkInterval = setInterval(() => {
      if (window.Pose) {
        clearInterval(checkInterval);
        initPose();
      }
    }, 500);

    return () => clearInterval(checkInterval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 3. Initialise Pose model ────────────────────────────────
  const initPose = () => {
    try {
      const pose = new window.Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 0,       // Fastest model (0 = lite)
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onPoseResults);
      poseRef.current = pose;
      setPoseReady(true);

      // Analyse every 2 seconds to keep it lightweight
      const analysisInterval = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          pose.send({ image: videoRef.current }).catch(() => {});
        }
      }, 2000);

      return () => clearInterval(analysisInterval);
    } catch (err) {
      console.warn("Pose init failed (non-critical):", err.message);
    }
  };

  // ─── 4. Analyse landmarks for posture issues ─────────────────
  const onPoseResults = (results) => {
    if (!results.poseLandmarks) return;

    const lm = results.poseLandmarks;
    // MediaPipe Pose landmark indices:
    // 0 = nose, 11 = left shoulder, 12 = right shoulder
    // 7 = left ear,  8 = right ear

    const nose      = lm[0];
    const leftEar   = lm[7];
    const rightEar  = lm[8];
    const leftShoulder  = lm[11];
    const rightShoulder = lm[12];

    let msg = "";

    // Check if face is visible (nose visibility < 0.5 → looking away)
    if (nose && nose.visibility < 0.5) {
      msg = "👀 Maintain eye contact with the camera";
    }
    // Check slouch: if both ears are very close to shoulders (y diff < 0.12)
    else if (
      leftEar && rightEar && leftShoulder && rightShoulder &&
      Math.abs(leftEar.y - leftShoulder.y) < 0.12 &&
      Math.abs(rightEar.y - rightShoulder.y) < 0.12
    ) {
      msg = "🪑 Sit straight — good posture matters!";
    }

    if (msg) {
      const now = Date.now();
      // Fire warning at most once every 8 seconds
      if (now - lastWarnRef.current > 8000) {
        lastWarnRef.current = now;
        setWarningMsg(msg);
        setWarningCount((c) => c + 1);

        // Auto-dismiss warning after 4 seconds
        setTimeout(() => setWarningMsg(""), 4000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-2 gap-3">

      {/* ── Camera Preview ── */}
      <div className="relative flex-1 rounded-xl border border-slate-700 bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Posture Warning Overlay */}
        {warningMsg && (
          <div className="absolute top-3 left-0 right-0 flex justify-center">
            <div className="bg-yellow-500/90 text-black text-xs font-semibold px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm animate-pulse">
              {warningMsg}
            </div>
          </div>
        )}

        {/* MediaPipe status badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${poseReady ? "bg-green-600 text-white" : "bg-slate-700 text-slate-400"}`}>
            {poseReady ? "Posture AI ✓" : "Loading AI..."}
          </span>
        </div>

        {/* Camera Off overlay */}
        {!cameraOn && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Camera Off</span>
          </div>
        )}

        {/* Media Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={toggleCamera}
            title="Toggle Camera"
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors ${cameraOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-700 hover:bg-red-600"}`}
          >
            🎥
            {!cameraOn && (
              <span className="absolute w-8 h-[2px] bg-red-400 rotate-45 pointer-events-none" />
            )}
          </button>

          <button
            onClick={toggleMic}
            title="Toggle Mic"
            className={`w-10 h-10 rounded-full flex items-center justify-center relative transition-colors ${micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-700 hover:bg-red-600"}`}
          >
            🎙
            {!micOn && (
              <span className="absolute w-8 h-[2px] bg-red-400 rotate-45 pointer-events-none" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden canvas (required by MediaPipe) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LeftPanel;