
# 🎹 Virtual Piano - Professional Online Piano Instrument

A beautiful, feature-rich virtual piano application built with React, TypeScript, and modern web technologies. Experience realistic piano playing with high-quality sound synthesis, recording capabilities, and advanced features.

## ✨ Features

### 🎵 **Professional Audio Experience**
- **High-quality sound synthesis** with realistic piano tones
- **Polyphonic support** - play multiple notes simultaneously  
- **Sustain pedal functionality** (spacebar)
- **Dynamic volume control** with smooth audio transitions
- **Web Audio API** integration for low-latency performance

### 🎹 **Advanced Piano Interface**
- **88-key virtual keyboard** with authentic layout
- **Responsive design** - works on desktop, tablet, and mobile
- **Visual feedback** with key press animations and note indicators
- **Customizable key labels** showing keyboard shortcuts
- **Professional styling** with realistic key shadows and gradients

### 🎤 **Recording & Playback**
- **Live recording** of your piano performances
- **Playback functionality** with precise timing reproduction
- **Export recordings** as JSON files for sharing
- **Import recordings** to play others' compositions
- **Recording management** with save, load, and clear options

### ⚙️ **Modern Web Features**
- **Progressive Web App (PWA)** - install on any device
- **SEO optimized** with proper meta tags and structured data
- **Accessibility features** with ARIA labels and keyboard navigation
- **Service Worker** for offline functionality
- **Responsive design** that adapts to any screen size

### 🎛️ **Control Panel**
- **Audio controls** - volume slider and sustain toggle
- **Display settings** - show/hide key labels
- **Recording controls** - start, stop, play, export
- **File operations** - import, export, clear recordings

## 🎮 How to Play

### Keyboard Shortcuts
| Keys | Function |
|------|----------|
| `Z X C V B N M , . /` | White keys (C4-B4 octave) |
| `S D G H J L ;` | Black keys (sharps/flats) |
| `Q W E R T Y U I O P` | Upper octave keys |
| `Spacebar` | Sustain pedal (hold) |

### Mouse/Touch
- Click or tap any piano key to play
- Hold mouse/touch for sustained notes
- Use the control panel for advanced features

## 🛠️ Technical Features

### Architecture
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for beautiful UI components
- **Web Audio API** for professional audio synthesis

### Audio System
- **Custom AudioManager class** handling all audio operations
- **Real-time audio synthesis** with multiple harmonics
- **Envelope control** for natural attack/decay
- **Reverb effects** using ConvolverNode
- **Optimized performance** with audio context management

### PWA Features
- **Offline support** with service worker caching
- **Install prompt** for desktop and mobile
- **Background sync** for recording data
- **Push notifications** for practice reminders
- **App manifest** with proper icons and metadata

## 🚀 Installation & Development

```bash
# Clone the repository
git clone <your-repo-url>
cd virtual-piano

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Click "Install" in the popup
3. The app will open in its own window

### Mobile (iOS/Android)
1. Open in Safari/Chrome
2. Tap the share button
3. Select "Add to Home Screen"
4. Tap "Add" to install

## 🎯 Performance Optimizations

- **Lazy loading** of audio samples
- **Efficient event handling** with debouncing
- **Memory management** for audio contexts
- **Optimized rendering** with React.memo
- **Service worker caching** for instant loading
- **Code splitting** for faster initial load

## 🎨 Customization

The piano is highly customizable through CSS variables and Tailwind classes:

```css
/* Custom piano colors */
--piano-white-key: #ffffff;
--piano-black-key: #1a1a1a;
--piano-accent: #3b82f6;
```

## 🌟 Advanced Features

### Recording Format
Recordings are saved as JSON with precise timing:
```json
[
  { "note": "C4", "timestamp": 0, "velocity": 0.8 },
  { "note": "E4", "timestamp": 250, "velocity": 0.6 }
]
```

### Audio Synthesis
Each note is generated with:
- Fundamental frequency + harmonics
- Natural envelope (attack/decay/sustain/release)
- Reverb processing for realistic sound
- Velocity-sensitive volume

## 🎵 Supported Notes

- **Range**: C3 to F#6 (88 keys)
- **Tuning**: A4 = 440 Hz standard tuning
- **Temperament**: Equal temperament
- **Polyphony**: Unlimited simultaneous notes

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Web Audio API documentation and examples
- Piano sound synthesis techniques
- Open source audio processing libraries
- The music education community

## 🐛 Bug Reports & Feature Requests

Please use the GitHub issues tab to report bugs or request new features.

---

**🎹 Start playing today!** Visit the live demo and experience the most advanced virtual piano on the web.
