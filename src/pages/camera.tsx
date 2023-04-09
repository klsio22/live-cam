import { useRef, useState } from 'react';

type CameraProps = {
  onStream: (stream: MediaStream) => void;
  onError: (error: Error) => void;
};

export const Camera = ({ onStream, onError }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStartClick = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      onStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleStopClick = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='bg-gray-400 h-96'>
        <video ref={videoRef} autoPlay />
      </div>

      <div className='flex gap-4 justify-between text-white'>
        <button
          onClick={handleStartClick}
          className='bg-sky-700 w-1/2 p-2 rounded'
        >
          Start Camera
        </button>
        <button
          onClick={handleStopClick}
          className='bg-red-700 w-1/2 p-2 rounded'
        >
          Stop Camera
        </button>
      </div>
    </div>
  );
};
