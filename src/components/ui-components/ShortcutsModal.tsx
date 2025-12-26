import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ShortcutsModalProps {
  className?: string;
}

const shortcuts = [
  { keys: ['Alt', 'H'], description: 'Go to Home' },
  { keys: ['Alt', 'E'], description: 'Go to Explore' },
  { keys: ['Alt', 'P'], description: 'Go to Piano' },
  { keys: ['Alt', 'G'], description: 'Go to Guitar' },
  { keys: ['Alt', 'D'], description: 'Go to Drums' },
  { keys: ['Alt', 'T'], description: 'Toggle Theme' },
  { keys: ['Ctrl', '/'], description: 'Focus Search' },
  { keys: ['Esc'], description: 'Close Modal / Menu' },
];

const ShortcutsModal = ({ className }: ShortcutsModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("text-muted-foreground hover:text-foreground", className)}
        >
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded border border-border shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground mt-4 text-center">
          Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">?</kbd> to show this dialog
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShortcutsModal;
