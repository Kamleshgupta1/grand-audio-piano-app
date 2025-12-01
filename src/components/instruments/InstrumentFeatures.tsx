import React from 'react';
import { Music, Headphones, Users, Download, Mic, Settings, PlayCircle, BookOpen } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => (
  <div 
    className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-500 hover-lift animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors duration-300">
      {title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">
      {description}
    </p>
  </div>
);

interface InstrumentFeaturesProps {
  instrumentName: string;
  customFeatures?: Array<{
    icon: React.ReactNode;
    title: string;
    description: string;
  }>;
}

const InstrumentFeatures: React.FC<InstrumentFeaturesProps> = ({ 
  instrumentName,
  customFeatures 
}) => {
  const defaultFeatures = [
    {
      icon: <PlayCircle size={24} />,
      title: 'Realistic Sound',
      description: `High-quality ${instrumentName.toLowerCase()} samples with authentic timbre and expression`
    },
    {
      icon: <Mic size={24} />,
      title: 'Recording Studio',
      description: 'Record your performances and export as high-quality audio files'
    },
    {
      icon: <Settings size={24} />,
      title: 'Customization',
      description: 'Adjust tone, reverb, and other parameters to match your style'
    },
    {
      icon: <Headphones size={24} />,
      title: 'Practice Mode',
      description: 'Built-in metronome and loop features for effective practice sessions'
    },
    {
      icon: <Users size={24} />,
      title: 'Live Collaboration',
      description: 'Join music rooms and play with other musicians in real-time'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Learning Resources',
      description: 'Access tutorials, chord charts, and technique guides'
    },
    {
      icon: <Download size={24} />,
      title: 'Offline Mode',
      description: 'Works offline as a PWA - practice anywhere, anytime'
    },
    {
      icon: <Music size={24} />,
      title: 'MIDI Support',
      description: 'Connect MIDI controllers for enhanced playing experience'
    }
  ];

  const features = customFeatures || defaultFeatures;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to master the {instrumentName.toLowerCase()}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstrumentFeatures;