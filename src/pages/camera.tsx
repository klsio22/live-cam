import { useEffect, useRef, useState } from 'react';

type CameraProps = {
  onStream: (stream: MediaStream) => void;
  onError: (error: Error) => void;
};

type VideoDevice = {
  deviceId: string;
  label: string;
};

export const Camera = ({ onStream, onError }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<VideoDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );
      setDevices(
        videoDevices.map((device) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${videoDevices.indexOf(device) + 1}`,
        }))
      );
      if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    };
    getDevices();
  }, []);

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

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };

  const switchCamera = () => {
    const index = devices.findIndex(
      (device) => device.deviceId === selectedDevice
    );
    const nextIndex = (index + 1) % devices.length;
    setSelectedDevice(devices[nextIndex].deviceId);
  };

  return (
    <div className='flex flex-col gap-4 p-4 justify-start'>
      <div className='bg-gray-400 h-96 my-5'>
        <video ref={videoRef} autoPlay />
      </div>
      <div className='flex flex-col justify-center items-center w-full gap-3 my-4'>
        <button
          onClick={switchCamera}
          className='bg-green-400 w-1/2 p-2 rounded'
        >
          Switch Camera
        </button>
        <select className='w-full' value={selectedDevice || ''} onChange={handleDeviceChange}>
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
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
