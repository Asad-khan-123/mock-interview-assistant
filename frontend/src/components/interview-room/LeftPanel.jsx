import { useEffect, useRef, useState } from "react";

const LeftPanel = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  // 🎥 Start Camera + Mic
  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true, // audio ON for future analysis
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Media access denied", err);
    }
  };

  // 🎥 Toggle Camera
  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;

    track.enabled = !cameraOn;
    setCameraOn(!cameraOn);
  };

  // 🎙 Toggle Mic
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !micOn;
    setMicOn(!micOn);
  };

  useEffect(() => {
    startMedia();
  }, []);

  return (
    <div className="h-full flex flex-col p-3">

      {/* 🎥 Camera Preview */}
      <div className="relative flex-1 rounded-xl border border-slate-700 bg-black overflow-hidden">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">

          {/* Camera Button */}
          <button
            onClick={toggleCamera}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative"
          >
            🎥
            {!cameraOn && (
              <span className="absolute w-8 h-[2px] bg-red-500 rotate-45"></span>
            )}
          </button>

          {/* Mic Button */}
          <button
            onClick={toggleMic}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center relative"
          >
            🎙
            {!micOn && (
              <span className="absolute w-8 h-[2px] bg-red-500 rotate-45"></span>
            )}
          </button>

        </div>
      </div>

    </div>
  );
};

export default LeftPanel;