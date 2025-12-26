import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MetronomeProps {
  className?: string;
  compact?: boolean;
}

const Metronome = ({ className, compact = false }: MetronomeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [isMuted, setIsMuted] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerMeasure] = useState(4);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const currentBeatRef = useRef(0);

  const createClick = useCallback((isDownbeat: boolean) => {
    if (!audioContextRef.current || isMuted) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = isDownbeat ? 1000 : 800;
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, [isMuted]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const lookahead = 0.1;
    const scheduleAheadTime = 0.1;
    
    while (nextNoteTimeRef.current < ctx.currentTime + scheduleAheadTime) {
      const isDownbeat = currentBeatRef.current === 0;
      createClick(isDownbeat);
      
      setBeat(currentBeatRef.current);
      
      const secondsPerBeat = 60.0 / bpm;
      nextNoteTimeRef.current += secondsPerBeat;
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsPerMeasure;
    }
    
    timerIdRef.current = window.setTimeout(scheduler, lookahead * 1000);
  }, [bpm, beatsPerMeasure, createClick]);

  const startMetronome = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    currentBeatRef.current = 0;
    nextNoteTimeRef.current = audioContextRef.current.currentTime;
    scheduler();
    setIsPlaying(true);
  }, [scheduler]);

  const stopMetronome = useCallback(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsPlaying(false);
    setBeat(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  }, [isPlaying, startMetronome, stopMetronome]);

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2 p-2 rounded-lg bg-card border border-border", className)}>
        <Button
          size="sm"
          variant={isPlaying ? "default" : "outline"}
          onClick={togglePlay}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <span className="text-sm font-mono w-12 text-center">{bpm}</span>
        <Slider
          value={[bpm]}
          onValueChange={(v) => setBpm(v[0])}
          min={40}
          max={220}
          step={1}
          className="w-20"
        />
      </div>
    );
  }

  return (
    <div className={cn("p-4 rounded-xl bg-card border border-border shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Metronome</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsMuted(!isMuted)}
          className="h-8 w-8"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Beat indicator */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-100",
              beat === i && isPlaying
                ? i === 0
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                  : "bg-primary/70 scale-110"
                : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* BPM Display */}
      <div className="text-center mb-4">
        <span className="text-4xl font-bold text-foreground font-mono">{bpm}</span>
        <span className="text-sm text-muted-foreground ml-1">BPM</span>
      </div>

      {/* BPM Slider */}
      <div className="mb-4">
        <Slider
          value={[bpm]}
          onValueChange={(v) => setBpm(v[0])}
          min={40}
          max={220}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>40</span>
          <span>220</span>
        </div>
      </div>

      {/* Quick BPM buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[60, 80, 100, 120, 140, 160].map((tempo) => (
          <Button
            key={tempo}
            size="sm"
            variant={bpm === tempo ? "default" : "outline"}
            onClick={() => setBpm(tempo)}
            className="flex-1 min-w-[40px] text-xs"
          >
            {tempo}
          </Button>
        ))}
      </div>

      {/* Play/Pause */}
      <Button
        onClick={togglePlay}
        className="w-full"
        size="lg"
      >
        {isPlaying ? (
          <>
            <Pause className="h-5 w-5 mr-2" /> Stop
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" /> Start
          </>
        )}
      </Button>
    </div>
  );
};

export default Metronome;
