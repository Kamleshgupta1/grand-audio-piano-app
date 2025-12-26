import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Guitar, Home, Music, ArrowLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { useTheme } from '@/contexts/ThemeContext';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Organize instruments with blue, sky, ocean, violet, purple color schemes
  const allInstruments = [
    { name: "Piano", path: "/piano", icon: "🎹", category: "Keyboard", bgGradient: "from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-800", direction: "to-r" },
    { name: "Guitar", path: "/guitar", icon: "🎸", category: "String", bgGradient: "from-blue-500 via-indigo-600 to-blue-600 dark:from-blue-700 dark:via-indigo-700 dark:to-blue-800", direction: "to-br" },
    { name: "Violin", path: "/violin", icon: "🎻", category: "String", bgGradient: "from-violet-500 via-purple-600 to-violet-600 dark:from-violet-700 dark:via-purple-700 dark:to-violet-800", direction: "to-tl" },
    { name: "Harmonica", path: "/harmonica", icon: "🎤", category: "Wind", bgGradient: "from-sky-500 via-blue-500 to-sky-600 dark:from-sky-700 dark:via-blue-700 dark:to-sky-800", direction: "to-b" },
    { name: "Flute", path: "/flute", icon: "🎵", category: "Wind", bgGradient: "from-cyan-500 via-sky-500 to-cyan-600 dark:from-cyan-700 dark:via-sky-700 dark:to-cyan-800", direction: "to-tr" },
    { name: "Saxophone", path: "/saxophone", icon: "🎷", category: "Wind", bgGradient: "from-purple-500 via-violet-600 to-purple-600 dark:from-purple-700 dark:via-violet-700 dark:to-purple-800", direction: "to-bl" },
    { name: "Trumpet", path: "/trumpet", icon: "🎺", category: "Wind", bgGradient: "from-indigo-500 via-purple-600 to-indigo-600 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-800", direction: "to-r" },
    { name: "Drums", path: "/drums", icon: "🥁", category: "Percussion", bgGradient: "from-blue-600 via-cyan-500 to-blue-700 dark:from-blue-800 dark:via-cyan-700 dark:to-blue-900", direction: "to-br" },
    { name: "Xylophone", path: "/xylophone", icon: "🪕", category: "Percussion", bgGradient: "from-sky-600 via-indigo-500 to-sky-700 dark:from-sky-800 dark:via-indigo-700 dark:to-sky-900", direction: "to-b" },
    { name: "Kalimba", path: "/kalimba", icon: "🎵", category: "Percussion", bgGradient: "from-violet-600 via-purple-500 to-violet-700 dark:from-violet-800 dark:via-purple-700 dark:to-violet-900", direction: "to-tl" },
    { name: "Marimba", path: "/marimba", icon: "🎵", category: "Percussion", bgGradient: "from-cyan-600 via-blue-500 to-cyan-700 dark:from-cyan-800 dark:via-blue-700 dark:to-cyan-900", direction: "to-tr" },
    { name: "Veena", path: "/veena", icon: "🎵", category: "Electronic", bgGradient: "from-indigo-600 via-violet-500 to-indigo-700 dark:from-indigo-800 dark:via-violet-700 dark:to-indigo-900", direction: "to-bl" },
    { name: "Drum Machine", path: "/drummachine", icon: "🎚️", category: "Electronic", bgGradient: "from-blue-600 via-purple-500 to-blue-700 dark:from-blue-800 dark:via-purple-700 dark:to-blue-900", direction: "to-r" },
    { name: "Chord Progression", path: "/chordprogression", icon: "🎼", category: "Electronic", bgGradient: "from-sky-600 via-violet-500 to-sky-700 dark:from-sky-800 dark:via-violet-700 dark:to-sky-900", direction: "to-br" },
  ];

  return (
    <AppLayout>
      <div className={`min-h-screen transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-950' : 'bg-gradient-to-br from-white via-gray-50 to-blue-50'}`}>
        <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />

          <div className="relative z-10 w-full max-w-6xl">
            
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-6 animate-fade-in">
              
              {/* Animated 404 Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-40 animate-pulse" />
                  <Guitar className="relative w-32 h-32 text-indigo-600 dark:text-indigo-400 animate-bounce drop-shadow-2xl" style={{
                    animation: "bounce 2s ease-in-out infinite, spin 8s linear infinite"
                  }} />
                </div>
              </div>

              {/* Main heading */}
              <div className="space-y-2">
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  404
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Page Not Found
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                It looks like this page harmonized itself away! But don't worry, your favorite instruments are waiting for you.
              </p>

              {/* Primary CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button 
                  onClick={() => navigate(-1)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Go Back
                </Button>
                <Button 
                  asChild
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <Link to="/">
                    <Home className="mr-2 h-5 w-5" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
              <span className="text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Explore
              </span>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
            </div>

            {/* Continuous Instruments Grid - Mobile Responsive */}
            <div className="animate-fade-in animation-delay-300">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {allInstruments.map((instrument) => (
                  <Link key={instrument.path} to={instrument.path}>
                    <Button
                      asChild
                      className={`w-full h-auto py-3 sm:py-4 md:py-5 px-2 sm:px-3 md:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 group border-0 bg-gradient-${instrument.direction} ${instrument.bgGradient} text-white hover:scale-105 hover:shadow-2xl hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 dark:focus:ring-offset-gray-950`}
                    >
                      <span className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-1 sm:gap-3 group-hover:translate-x-0 sm:group-hover:translate-x-1 transition-transform">
                        <span className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{instrument.icon}</span>
                        <span className="text-left hidden sm:block">
                          <div className="font-bold text-white text-xs md:text-sm">{instrument.name}</div>
                          <div className="text-xs text-white/80 opacity-90 hidden md:block">Try Now</div>
                        </span>
                        <span className="sm:hidden text-center text-xs font-semibold">{instrument.name.split(' ')[0]}</span>
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Want to explore more? Check out our full instrument collection.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
              >
                <Link to="/explore" className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Explore All Instruments
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 8s linear infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </AppLayout>
  );
};

export default NotFound;
