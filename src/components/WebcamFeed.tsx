import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as faceapi from 'face-api.js';
import '../App.css'; // Import CSS file


export const WebcamFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detecting, setDetecting] = useState(false);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Load models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const isMobile = window.innerWidth <= 768;

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: isMobile ? 640 : 480,
          height: isMobile ? 480 : 360,
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setDetecting(true);
    } catch (err) {
      console.error('Error accessing webcam:', err);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setDetecting(false);
  };

 
  const startDetection = useCallback(() => {
    if (!modelsLoaded || !videoRef.current || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 128,
      scoreThreshold: 0.4,
    });
  
    const updateSize = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      faceapi.matchDimensions(canvas, { width, height });
    };
  
    updateSize();
  
    let lastTime = performance.now();
  
    const detectLoop = async (time: number) => {
      if (!video || video.paused || video.ended || !detecting) return;
  
      const elapsed = time - lastTime;
  
      if (elapsed > 100) { // ~10 FPS
        lastTime = time;
  
        const detections = await faceapi
          .detectAllFaces(video, options)
          .withFaceExpressions()
          .withAgeAndGender();
  
        const resized = faceapi.resizeResults(detections, {
          width: video.videoWidth,
          height: video.videoHeight,
        });
  
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resized);
  
        //Draw only the dominant expression

        resized.forEach(result => {
          const { expressions, detection, age, gender } = result;
          const { x, y } = detection.box;

          const boxPadding = 20;
          const legengOffset = 5;
          const boxHeight = detection.box.height- boxPadding * 2;
          const boxWidth = detection.box.width;

          if (expressions) {
            const sorted = Object.entries(expressions)
              .sort(([, a], [, b]) => b - a);
            const [dominant, confidence] = sorted[0];
            const label = `${dominant} (${(confidence * 100).toFixed(0)}%)`;
        
            const textHeight = ctx.measureText(label).actualBoundingBoxAscent;
            
        
            ctx.fillStyle = '#002B5B'; // dark blue
            ctx.fillRect(x, y + boxHeight+legengOffset, boxWidth, textHeight * 3);
        
            ctx.font = '15px monospace';
            ctx.fillStyle = 'white';
            ctx.fillText(label, x, y + boxHeight+legengOffset + textHeight);
        
            if (age && gender) {
              const ageGenderLabel = `${gender}, Age: ${Math.round(age)}`;
              ctx.fillText(ageGenderLabel, x, y + boxHeight+legengOffset + textHeight*2.5);
            }
          }
        });
        
      }
      
      requestAnimationFrame(detectLoop);
    };
  
    requestAnimationFrame(detectLoop);
  }, [modelsLoaded, detecting]);
  

  const stopDetection = () => {
    if (detectionInterval.current) clearInterval(detectionInterval.current);
  };

  useEffect(() => {
    if (detecting) startDetection();
    else stopDetection();
    return () => stopDetection();
  }, [detecting, startDetection]);

  // Matrix Rain
  useEffect(() => {
    const canvas = matrixCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const letters = 'アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@$%^&*()';
    const fontSize = 14;
    let columns: number;
    let drops: number[];

    const initRain = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };

    initRain();

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#1288f0";


      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="webcam-container"
    >
      {/* Matrix Background */}
      <canvas
        className='matrix-canvas'
        ref={matrixCanvasRef}
      />

      {/* Video Area */}
      <div
        className="video-container"
      >
        <video
          className="video-feed"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={() => detecting && startDetection()}
        />
        <canvas
          className="overlay-canvas"
          ref={canvasRef}
        />
      </div>

      {/* Controls */}
      <div
        className="control-buttons"
      >
        <button
          className="matrix-button"
          onClick={startCamera}
        >
          Start Camera
        </button>

        <button
          className="matrix-button"
          onClick={stopCamera}
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};
