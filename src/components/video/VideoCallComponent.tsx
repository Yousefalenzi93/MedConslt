'use client';

import React, { useRef, useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  XMarkIcon,
  PhoneIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

interface VideoCallComponentProps {
  isInitiator: boolean;
  callAccepted?: boolean;
  stream?: MediaStream;
}

export default function VideoCallComponent({
  isInitiator,
  callAccepted = false,
  stream
}: VideoCallComponentProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionState, setConnectionState] = useState<string>('connecting');

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callStartTimeRef = useRef<number>(0);

  // Internal handlers - no external props
  const handleSignalData = (data: any) => {
    console.log('Signal data:', data);
    // Handle signal data internally
  };

  const handleCallAccepted = () => {
    console.log('Call accepted');
    // Handle call accepted internally
  };

  const handleCallEnd = () => {
    console.log('Call ended');
    // Handle call end internally
  };

  useEffect(() => {
    // Initialize peer connection
    if (stream) {
      streamRef.current = stream;
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }

      const peer = new SimplePeer({
        initiator: isInitiator,
        trickle: false,
        stream: stream,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            // Add TURN servers for production
          ]
        }
      });

      peer.on('signal', (data) => {
        handleSignalData(data);
      });

      peer.on('stream', (remoteStream) => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = remoteStream;
        }
        setConnectionState('connected');
        callStartTimeRef.current = Date.now();
        handleCallAccepted();
      });

      peer.on('connect', () => {
        setConnectionState('connected');
      });

      peer.on('error', (error) => {
        console.error('Peer connection error:', error);
        setConnectionState('error');
      });

      peer.on('close', () => {
        setConnectionState('disconnected');
        handleCallEnd();
      });

      peerRef.current = peer;
    }

    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [stream, isInitiator]);

  // Signal data handling would be done internally or through other means

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTimeRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [connectionState]);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      const videoTrack = screenStream.getVideoTracks()[0];
      if (peerRef.current && streamRef.current) {
        const sender = peerRef.current._pc?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      setIsScreenSharing(true);

      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      const videoTrack = videoStream.getVideoTracks()[0];
      if (peerRef.current) {
        const sender = peerRef.current._pc?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          await sender.replaceTrack(videoTrack);
        }
      }

      setIsScreenSharing(false);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    handleCallEnd();
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-secondary-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <h2 className="text-lg font-semibold">مكالمة مرئية</h2>
          {connectionState === 'connected' && (
            <span className="text-sm text-secondary-300">
              {formatDuration(callDuration)}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className={`text-sm px-2 py-1 rounded ${
            connectionState === 'connected' ? 'bg-success-600' :
            connectionState === 'connecting' ? 'bg-warning-600' :
            'bg-error-600'
          }`}>
            {connectionState === 'connected' ? 'متصل' :
             connectionState === 'connecting' ? 'جاري الاتصال...' :
             'خطأ في الاتصال'}
          </span>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Remote Video */}
        <video
          ref={userVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-secondary-800 rounded-lg overflow-hidden">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-secondary-800 flex items-center justify-center">
              <VideoCameraSlashIcon className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Connection Status */}
        {connectionState !== 'connected' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card padding="lg">
              <CardContent>
                <div className="text-center">
                  {connectionState === 'connecting' && (
                    <>
                      <div className="spinner h-8 w-8 mx-auto mb-4"></div>
                      <p className="text-secondary-700">جاري الاتصال...</p>
                    </>
                  )}
                  {connectionState === 'error' && (
                    <>
                      <XMarkIcon className="h-8 w-8 text-error-600 mx-auto mb-4" />
                      <p className="text-error-600">فشل في الاتصال</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-secondary-900 p-4">
        <div className="flex items-center justify-center space-x-4 space-x-reverse">
          <Button
            variant={isVideoEnabled ? 'secondary' : 'error'}
            size="lg"
            onClick={toggleVideo}
            leftIcon={isVideoEnabled ? 
              <VideoCameraIcon className="h-5 w-5" /> : 
              <VideoCameraSlashIcon className="h-5 w-5" />
            }
          >
            {isVideoEnabled ? 'إيقاف الكاميرا' : 'تشغيل الكاميرا'}
          </Button>

          <Button
            variant={isAudioEnabled ? 'secondary' : 'error'}
            size="lg"
            onClick={toggleAudio}
            leftIcon={<MicrophoneIcon className="h-5 w-5" />}
          >
            {isAudioEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          </Button>

          <Button
            variant={isScreenSharing ? 'primary' : 'secondary'}
            size="lg"
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            leftIcon={<ComputerDesktopIcon className="h-5 w-5" />}
          >
            {isScreenSharing ? 'إيقاف المشاركة' : 'مشاركة الشاشة'}
          </Button>

          <Button
            variant="error"
            size="lg"
            onClick={endCall}
            leftIcon={<PhoneIcon className="h-5 w-5" />}
          >
            إنهاء المكالمة
          </Button>
        </div>
      </div>
    </div>
  );
}
