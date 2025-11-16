import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2, Pause, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  text: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  useGoogleTTS?: boolean; // Use Google Cloud TTS instead of browser TTS
}

export function TextToSpeech({ 
  text, 
  className = "", 
  variant = "outline",
  size = "sm",
  showLabel = false,
  useGoogleTTS = false 
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if speech synthesis is supported
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSpeechSupported) return;

    const handleEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPaused(true);
    };

    const handleResume = () => {
      setIsPaused(false);
    };

    window.speechSynthesis.addEventListener('end', handleEnd);
    window.speechSynthesis.addEventListener('pause', handlePause);
    window.speechSynthesis.addEventListener('resume', handleResume);

    return () => {
      window.speechSynthesis.removeEventListener('end', handleEnd);
      window.speechSynthesis.removeEventListener('pause', handlePause);
      window.speechSynthesis.removeEventListener('resume', handleResume);
      window.speechSynthesis.cancel();
    };
  }, [isSpeechSupported]);

  const handleSpeakWithGoogle = async () => {
    // If already speaking, pause/resume
    if (isSpeaking && audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
      }
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice: "en-US-Neural2-J",
          speed: 0.95,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      
      // Create audio element from base64
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsLoading(false);
        setIsSpeaking(true);
        setIsPaused(false);
      };

      audio.onpause = () => {
        setIsPaused(true);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsSpeaking(false);
        setIsPaused(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        });
      };

      audio.play();
    } catch (error) {
      console.error('Google TTS error:', error);
      setIsLoading(false);
      toast({
        title: "TTS Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSpeakWithBrowser = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    // If already speaking, pause/resume
    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setIsLoading(true);

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a high-quality voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsLoading(false);
      setIsSpeaking(true);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsLoading(false);
      setIsSpeaking(false);
      setIsPaused(false);
      toast({
        title: "Speech Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSpeak = () => {
    if (useGoogleTTS) {
      handleSpeakWithGoogle();
    } else {
      handleSpeakWithBrowser();
    }
  };

  const handleStop = () => {
    if (useGoogleTTS && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    } else {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  if (!useGoogleTTS && !isSpeechSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleSpeak}
        disabled={isLoading}
        className={`gap-2 ${className}`}
        title={isSpeaking ? (isPaused ? "Resume" : "Pause") : "Play audio"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSpeaking && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : useGoogleTTS ? (
          <>
            <Sparkles className="h-4 w-4" />
            <Volume2 className="h-4 w-4" />
          </>
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        {showLabel && (
          <span>{isSpeaking ? (isPaused ? "Resume" : "Pause") : useGoogleTTS ? "AI Voice" : "Listen"}</span>
        )}
      </Button>
      
      {isSpeaking && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStop}
          className="h-8 w-8"
          title="Stop audio"
        >
          <VolumeX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
