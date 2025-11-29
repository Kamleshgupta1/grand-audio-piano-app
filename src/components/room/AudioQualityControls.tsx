import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Settings2 } from 'lucide-react';
import type { AudioProcessorConfig } from '@/utils/audio/audioProcessor';

interface AudioQualityControlsProps {
  config: AudioProcessorConfig;
  onConfigChange: (config: Partial<AudioProcessorConfig>) => void;
}

const AudioQualityControls: React.FC<AudioQualityControlsProps> = ({
  config,
  onConfigChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Settings2 className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Audio Quality Settings</h4>
            <p className="text-xs text-muted-foreground">
              Adjust audio processing to reduce background noise
            </p>
          </div>

          {/* Noise Gate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="noise-gate" className="text-xs">
                Noise Gate
              </Label>
              <Switch
                id="noise-gate"
                checked={config.enableNoiseGate}
                onCheckedChange={(checked) =>
                  onConfigChange({ enableNoiseGate: checked })
                }
              />
            </div>
            {config.enableNoiseGate && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="noise-threshold" className="text-xs text-muted-foreground">
                    Threshold
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {config.noiseGateThreshold} dB
                  </span>
                </div>
                <Slider
                  id="noise-threshold"
                  value={[config.noiseGateThreshold]}
                  onValueChange={([value]) =>
                    onConfigChange({ noiseGateThreshold: value })
                  }
                  min={-60}
                  max={-10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Lower values = more aggressive noise removal
                </p>
              </div>
            )}
          </div>

          {/* Compression */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="compression" className="text-xs">
                Compression
              </Label>
              <Switch
                id="compression"
                checked={config.enableCompression}
                onCheckedChange={(checked) =>
                  onConfigChange({ enableCompression: checked })
                }
              />
            </div>
            {config.enableCompression && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="compression-ratio" className="text-xs text-muted-foreground">
                    Ratio
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    {config.compressionRatio}:1
                  </span>
                </div>
                <Slider
                  id="compression-ratio"
                  value={[config.compressionRatio]}
                  onValueChange={([value]) =>
                    onConfigChange({ compressionRatio: value })
                  }
                  min={1}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values = more consistent volume
                </p>
              </div>
            )}
          </div>

          {/* Frequency Filtering */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="filtering" className="text-xs">
                Frequency Filtering
              </Label>
              <Switch
                id="filtering"
                checked={config.enableFiltering}
                onCheckedChange={(checked) =>
                  onConfigChange({ enableFiltering: checked })
                }
              />
            </div>
            {config.enableFiltering && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-cut" className="text-xs text-muted-foreground">
                      Low Cut
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {config.lowCutFrequency} Hz
                    </span>
                  </div>
                  <Slider
                    id="low-cut"
                    value={[config.lowCutFrequency]}
                    onValueChange={([value]) =>
                      onConfigChange({ lowCutFrequency: value })
                    }
                    min={20}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Removes low frequency rumble
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="high-cut" className="text-xs text-muted-foreground">
                      High Cut
                    </Label>
                    <span className="text-xs text-muted-foreground">
                      {config.highCutFrequency} Hz
                    </span>
                  </div>
                  <Slider
                    id="high-cut"
                    value={[config.highCutFrequency]}
                    onValueChange={([value]) =>
                      onConfigChange({ highCutFrequency: value })
                    }
                    min={8000}
                    max={20000}
                    step={500}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Removes high frequency hiss
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                onConfigChange({
                  noiseGateThreshold: -40,
                  compressionRatio: 4,
                  lowCutFrequency: 80,
                  highCutFrequency: 12000,
                  enableNoiseGate: true,
                  enableCompression: true,
                  enableFiltering: true,
                });
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AudioQualityControls;
