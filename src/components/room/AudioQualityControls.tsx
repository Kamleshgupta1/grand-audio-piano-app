
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Settings, Volume2 } from 'lucide-react';

interface AudioQualityControlsProps {
  onSettingsChange: (settings: {
    noiseGateThreshold?: number;
    compressorThreshold?: number;
    highPassFreq?: number;
    lowPassFreq?: number;
  }) => void;
}

const AudioQualityControls: React.FC<AudioQualityControlsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    noiseGateThreshold: -40,
    compressorThreshold: -24,
    highPassFreq: 80,
    lowPassFreq: 8000,
  });

  const handleSettingChange = (key: string, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange({ [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Settings className="h-3 w-3 mr-1" />
          Audio Quality
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <h4 className="text-sm font-medium">Audio Processing Settings</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">Noise Gate</label>
                <span className="text-xs">{settings.noiseGateThreshold}dB</span>
              </div>
              <Slider
                value={[settings.noiseGateThreshold]}
                min={-80}
                max={-10}
                step={1}
                onValueChange={(value) => handleSettingChange('noiseGateThreshold', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">Lower values = more noise reduction</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">Compressor</label>
                <span className="text-xs">{settings.compressorThreshold}dB</span>
              </div>
              <Slider
                value={[settings.compressorThreshold]}
                min={-40}
                max={-6}
                step={1}
                onValueChange={(value) => handleSettingChange('compressorThreshold', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">Controls dynamic range</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">High Pass</label>
                <span className="text-xs">{settings.highPassFreq}Hz</span>
              </div>
              <Slider
                value={[settings.highPassFreq]}
                min={20}
                max={200}
                step={5}
                onValueChange={(value) => handleSettingChange('highPassFreq', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">Removes low-frequency noise</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">Low Pass</label>
                <span className="text-xs">{Math.round(settings.lowPassFreq/1000)}kHz</span>
              </div>
              <Slider
                value={[settings.lowPassFreq]}
                min={4000}
                max={12000}
                step={100}
                onValueChange={(value) => handleSettingChange('lowPassFreq', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">Removes high-frequency noise</p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AudioQualityControls;
