import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TunerProps {
  className?: string;
}

const noteFrequencies: Record<string, number> = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46,
};

const Tuner = ({ className }: TunerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [detectedNote, setDetectedNote] = useState<string>('--');
  const [cents, setCents] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const getNoteFromFrequency = useCallback((freq: number): { note: string; cents: number } => {
    let closestNote = 'A4';
    let closestDiff = Infinity;

    for (const [note, noteFreq] of Object.entries(noteFrequencies)) {
      const diff = Math.abs(freq - noteFreq);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestNote = note;
      }
    }

    const noteFreq = noteFrequencies[closestNote];
    const centsValue = Math.round(1200 * Math.log2(freq / noteFreq));

    return { note: closestNote, cents: centsValue };
  }, []);

  const autoCorrelate = useCallback((buffer: Float32Array, sampleRate: number): number => {
    let size = buffer.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / size);

    if (rms < 0.01) return -1;

    let r1 = 0, r2 = size - 1;
    const threshold = 0.2;

    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }

    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buffer[size - i]) < threshold) {
        r2 = size - i;
        break;
      }
    }

    buffer = buffer.slice(r1, r2);
    size = buffer.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] += buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;

    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;

    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }, []);

  const updatePitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);

    const freq = autoCorrelate(buffer, audioContextRef.current.sampleRate);

    if (freq > 0 && freq < 2000) {
      setFrequency(Math.round(freq * 10) / 10);
      const { note, cents: centsVal } = getNoteFromFrequency(freq);
      setDetectedNote(note);
      setCents(centsVal);
    }

    animationFrameRef.current = requestAnimationFrame(updatePitch);
  }, [autoCorrelate, getNoteFromFrequency]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setHasPermission(false);
    }
  }, [updatePitch]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setFrequency(null);
    setDetectedNote('--');
    setCents(0);
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const getTuningStatus = () => {
    if (cents === 0) return { text: 'In Tune', color: 'text-green-500' };
    if (Math.abs(cents) <= 5) return { text: 'Almost', color: 'text-yellow-500' };
    if (cents > 0) return { text: 'Sharp', color: 'text-red-500' };
    return { text: 'Flat', color: 'text-blue-500' };
  };

  const status = getTuningStatus();

  return (
    <div className={cn("p-4 rounded-xl bg-card border border-border shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Music className="h-4 w-4" />
          Tuner
        </h3>
      </div>

      {/* Note Display */}
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-foreground font-mono mb-1">
          {detectedNote}
        </div>
        {frequency && (
          <div className="text-sm text-muted-foreground">
            {frequency} Hz
          </div>
        )}
      </div>

      {/* Tuning Indicator */}
      <div className="relative h-8 mb-4 bg-muted rounded-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-0.5 h-full bg-green-500/50" />
        </div>
        {isListening && frequency && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg transition-all duration-100"
            style={{
              left: `calc(50% + ${Math.max(-45, Math.min(45, cents))}%)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        <div className="absolute inset-0 flex justify-between items-center px-2 text-xs text-muted-foreground">
          <span>♭</span>
          <span>♯</span>
        </div>
      </div>

      {/* Status */}
      {isListening && frequency && (
        <div className={cn("text-center text-sm font-medium mb-4", status.color)}>
          {status.text} {cents !== 0 && `(${cents > 0 ? '+' : ''}${cents} cents)`}
        </div>
      )}

      {/* Permission denied message */}
      {hasPermission === false && (
        <div className="text-center text-sm text-destructive mb-4">
          Microphone access denied. Please enable microphone access.
        </div>
      )}

      {/* Start/Stop Button */}
      <Button
        onClick={isListening ? stopListening : startListening}
        className="w-full"
        variant={isListening ? "destructive" : "default"}
      >
        {isListening ? (
          <>
            <MicOff className="h-4 w-4 mr-2" /> Stop Tuner
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" /> Start Tuner
          </>
        )}
      </Button>
    </div>
  );
};

export default Tuner;
