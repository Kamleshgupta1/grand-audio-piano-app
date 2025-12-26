import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from '@/contexts/ThemeContext';
import { HelpCircle, Search, Mail, ChevronDown, ChevronUp, Music, Keyboard, Mic, Users, Volume2, Smartphone, Settings, Headphones } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StaticPageLayout from "@/components/layout/StaticPageLayout";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      icon: Mic,
      question: "How do I record my instrument performance?",
      answer: "Each instrument has recording controls at the top of its page. Click the red record button to start recording, play your music, then click stop. You can then download your recording or share it with others."
    },
    {
      icon: Keyboard,
      question: "Can I use my computer keyboard to play instruments?",
      answer: "Yes! Most instruments support keyboard controls. Look for the keyboard guide icon on the instrument page or hover over keys to see their corresponding keyboard shortcuts."
    },
    {
      icon: Settings,
      question: "How do I change instrument sounds or styles?",
      answer: "Each instrument has variant selectors that let you switch between different types or styles. These are typically shown as buttons or a dropdown menu above the instrument interface."
    },
    {
      icon: Users,
      question: "Can I play with others in real-time?",
      answer: "Yes! Use our 'Create New Room' feature from the footer to start a jam session, then share the link with friends. They can join and play different instruments together in real-time."
    },
    {
      icon: Music,
      question: "Are the instruments free to use?",
      answer: "Yes, all basic instruments are free to use. We offer premium versions with additional features, sound libraries, and advanced recording capabilities with a subscription."
    },
    {
      icon: Headphones,
      question: "How do I improve my skills on an instrument?",
      answer: "Check out our tutorial section for each instrument. We offer beginner, intermediate and advanced lessons with interactive guides to help you progress."
    },
    {
      icon: Smartphone,
      question: "Can I use my MIDI controller?",
      answer: "Yes, MIDI controller support is available for most instruments. Connect your MIDI device to your computer before opening the app, and it should be automatically detected."
    },
    {
      icon: Volume2,
      question: "My instrument isn't making any sound. What should I do?",
      answer: "First, check if your device's sound is on and volume is up. Make sure you've allowed browser permissions for audio. Try refreshing the page, and if the issue persists, try a different browser."
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <StaticPageLayout
      title="FAQs & Support | HarmonyHub - Virtual Music Instruments"
      description="Get answers to frequently asked questions about HarmonyHub and find support for any issues you may encounter."
      keywords={["faq", "help", "support", "virtual instruments help", "music app support"]}
      heroTitle="Help & Support Center"
      heroSubtitle="Find answers to common questions or reach out to our support team for assistance."
      heroIcon={HelpCircle}
    >
      <div className="container mx-auto px-4 max-w-4xl space-y-8 transition-colors duration-200">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 relative max-w-lg mx-auto"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
            type="text"
            placeholder="Search for answers..."
              className="pl-12 py-5 md:py-6 text-base md:text-lg bg-card dark:bg-card/60 border-border/50 focus:border-primary/50 rounded-xl transition-colors duration-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 transition-colors duration-200">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card dark:bg-card/60 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg flex-shrink-0">
                      <faq.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{faq.question}</span>
                  </div>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="pl-11">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-card dark:bg-card/60 rounded-xl border border-border/50"
            >
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground">Try a different search term or contact support.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-t-4 border-t-primary bg-card dark:bg-card/60 hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-primary/5 dark:bg-primary/10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl text-foreground">Email Support</CardTitle>
                  <p className="text-sm text-muted-foreground">We typically respond within 24 hours</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Send us an email and our team will get back to you.
              </p>
              <a 
                href="mailto:onlinevertualinstrument@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors mb-6"
              >
                <Mail className="w-4 h-4" />
                onlinevertualinstrument@gmail.com
              </a>
              <Button asChild className="w-full hover-scale">
                <a href="mailto:onlinevertualinstrument@gmail.com">
                  Contact Support
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </StaticPageLayout>
  );
};

export default Help;
