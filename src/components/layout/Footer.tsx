
import { Link } from 'react-router-dom';
import {
  Music,
  HelpCircle,
  Users,
  FileAudio,
  MessageSquare,
  Home,
  GraduationCap, Layers, FileText
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateRoomModal from '../room/CreateRoomModal';
import { useTheme } from '@/contexts/ThemeContext';

const Footer = () => {
  const [activeVisitors, setActiveVisitors] = useState(128);
  const [quote, setQuote] = useState({ text: "Music is the universal language of mankind.", author: "Henry Wadsworth Longfellow" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { mode } = useTheme();
  const socialLinks = [
    { name: 'Facebook', icon: FaFacebookF, url: '', color: 'hover:text-blue-600 dark:hover:text-blue-500' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://www.instagram.com/', color: 'hover:text-pink-500 dark:hover:text-pink-400' },
    { name: 'Twitter', icon: FaTwitter, url: '', color: 'hover:text-blue-400 dark:hover:text-blue-400' },
    { name: 'YouTube', icon: FaYoutube, url: 'https://www.youtube.com/@HarmonyHub-Virtual_Instruments', color: 'hover:text-red-600 dark:hover:text-red-500' },
    { name: 'WhatsApp', icon: FaWhatsapp, url: 'https://whatsapp.com/channel/0029Vb62vOn2ER6bd91xQk26', color: 'hover:text-green-500 dark:hover:text-green-400' },
  ];

  // Simulate changing visitor count
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // Random number between -2 and 2
      setActiveVisitors(prev => Math.max(100, prev + change));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Array of music quotes
 const musicQuotes = [
  { text: "Music is the universal language of mankind.", author: "Henry Wadsworth Longfellow" },
  { text: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },
  { text: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
  { text: "Music expresses that which cannot be said and on which it is impossible to be silent.", author: "Victor Hugo" },
  { text: "Music gives a soul to the universe, wings to the mind, flight to the imagination, and life to everything.", author: "Plato" },

  { text: "Where words fail, music speaks.", author: "Hans Christian Andersen" },
  { text: "Music can change the world because it can change people.", author: "Bono" },
  { text: "Music is the strongest form of magic.", author: "Marilyn Manson" },
  { text: "Life is one grand, sweet song, so start the music.", author: "Ronald Reagan" },
  { text: "Music washes away from the soul the dust of everyday life.", author: "Berthold Auerbach" },
  { text: "Music is the shorthand of emotion.", author: "Leo Tolstoy" },
  { text: "Music is an outburst of the soul.", author: "Frederick Delius" },
  { text: "After silence, that which comes nearest to expressing the inexpressible is music.", author: "Aldous Huxley" },
  { text: "Music produces a kind of pleasure which human nature cannot do without.", author: "Confucius" },
  { text: "Music is the divine way to tell beautiful, poetic things to the heart.", author: "Pablo Casals" },
  { text: "Music is the literature of the heart; it commences where speech ends.", author: "Alphonse de Lamartine" }
];


  // Change quote every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * musicQuotes.length);
      setQuote(musicQuotes[randomIndex]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode (just visual in the footer, not functional)
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle auth navigation
  const handleSignIn = () => {
    navigate('/auth/login');
  };

  const handleSignUp = () => {
    navigate('/auth/register');
  };

  // Handle navigation to music rooms
  const handleJoinLiveMusic = () => {
    navigate('/music-rooms');
    // Scroll to top when navigating
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={`${mode === 'dark' ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-gray-50 border-gray-100'} border-t py-12 mt-10`}>
      <div className="container mx-auto px-6">
        {/* Quote of the day */}
        <div className={`text-center mb-10 p-4 ${mode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200' : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700'} rounded-xl`}>
          <p className="italic">{quote.text}</p>
          <p className={`text-sm mt-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>— {quote.author}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-10 bg-white dark:bg-gray-900 transition-colors duration-300">
          {/* Brand / About */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-indigo-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105">
                H
              </div>
              <span className="text-2xl font-semibold text-gray-800 dark:text-white group-hover:text-indigo-500 transition-colors">
                HarmonyHub
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore the world of musical instruments with our beautifully curated collection.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, url, color }, idx) => (
                <a
                  key={idx}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={`text-gray-500 dark:text-gray-500 transition-all duration-300 transform hover:scale-125 ${color}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {activeVisitors} musicians online now
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/music-rooms"
                onClick={() => window.scrollTo({ top: 50, behavior: 'smooth' })}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300 hover:underline"
              >
                Join Live Music
              </Link>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <CreateRoomModal />
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Links</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-transparent rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {[
                { icon: Home, label: 'Home', to: '/' },
                { icon: Music, label: 'Explore Instruments', to: '/explore' },
                { icon: GraduationCap, label: 'Categories', to: '/categories' },
                { icon: Layers, label: 'Tutorial', to: '/tutorial' },
                { icon: FileText, label: 'Blog', to: '/blog' },
              ].map(({ icon: Icon, label, to }) => (
                <li key={to} className="flex items-center gap-2 group">
                  <Icon size={18} className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  <Link
                    to={to}
                    onClick={() => window.scrollTo({ top: 50, behavior: 'smooth' })}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300 hover:translate-x-1 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Essential Links */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Essential Links</h3>
              <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-transparent rounded-full"></div>
            </div>
            <ul className="space-y-3">
              {[
                { icon: Users, label: 'Live Music Rooms', to: '/music-rooms' },
                { icon: MessageSquare, label: 'FAQs & Support', to: '/help' },
                { icon: HelpCircle, label: 'Privacy Policy', to: '/privacy' },
                { icon: FileAudio, label: 'About Us', to: '/about' },
              ].map(({ icon: Icon, label, to }) => (
                <li key={to} className="flex items-center gap-2 group">
                  <Icon size={18} className="text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                  <Link
                    to={to}
                    onClick={() => window.scrollTo({ top: 50, behavior: 'smooth' })}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300 hover:translate-x-1 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Partners */}
        <div className={`rounded-lg p-6 my-8 ${mode === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <span className={`text-sm font-semibold ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Trusted By:</span>
            {['MusicSchool', 'SoundStudio', 'RhythmLab', 'MelodyMakers'].map((partner, idx) => (
              <div key={idx} className={`px-4 py-2 rounded-lg transition-all duration-100 hover:scale-105 cursor-pointer ${mode === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-600/50' : 'text-gray-600 hover:text-indigo-500 hover:bg-white/50'}`}>
                {partner}
              </div>
            ))}
          </div>
        </div>

        <Separator className={`my-6 ${mode === 'dark' ? 'bg-gray-800' : ''}`} />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p className={`${mode === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>&copy; {new Date().getFullYear()} HarmonyHub. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0"> 
            <Link to="/about" className={`${mode === 'dark' ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'} text-sm transition-all duration-300 hover:underline`}>About Us</Link>
            <Link to="/privacy" className={`${mode === 'dark' ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'} text-sm transition-all duration-300 hover:underline`}>Privacy Policy</Link>
            <Link to="/help" className={`${mode === 'dark' ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-500'} text-sm transition-all duration-300 hover:underline`}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;