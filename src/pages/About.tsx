import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Users, Music, Sparkles, Mail, Heart, Lightbulb, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StaticPageLayout from "@/components/layout/StaticPageLayout";

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const tabs = [
    { id: "story", label: "Our Story" },
    { id: "mission", label: "Mission & Values" },
    { id: "team", label: "Our Team" }
  ];

  const milestones = [
    { year: "2022", title: "The Beginning", description: "Started with a virtual piano prototype" },
    { year: "2023", title: "Growth", description: "Expanded to 10 instruments and launched mobile" },
    { year: "2024", title: "Innovation", description: "Introduced collaborative jam sessions" },
    { year: "2025", title: "Global Impact", description: "Reaching musicians in 150+ countries" }
  ];

  const values = [
    { 
      title: "Accessibility", 
      description: "Making music education accessible to everyone.",
      icon: Heart,
      color: "from-purple-500/20 to-purple-600/10 dark:from-purple-500/30 dark:to-purple-600/20"
    },
    { 
      title: "Innovation", 
      description: "Pushing boundaries in digital music creation.",
      icon: Lightbulb,
      color: "from-blue-500/20 to-blue-600/10 dark:from-blue-500/30 dark:to-blue-600/20"
    },
    { 
      title: "Community", 
      description: "Fostering a supportive environment for all.",
      icon: Globe,
      color: "from-green-500/20 to-green-600/10 dark:from-green-500/30 dark:to-green-600/20"
    },
    { 
      title: "Education", 
      description: "Providing free resources for learning.",
      icon: BookOpen,
      color: "from-pink-500/20 to-pink-600/10 dark:from-pink-500/30 dark:to-pink-600/20"
    }
  ];

  const team = [
    { name: "Kamlesh Gupta", title: "Founder & CEO", image: "https://i.pravatar.cc/300?img=1" },
    { name: "Sam Chen", title: "Lead Developer", image: "https://i.pravatar.cc/300?img=2" },
    { name: "Preeti Gupta", title: "Marketing Lead", image: "https://i.pravatar.cc/300?img=5" },
    { name: "Jamie Wong", title: "Community Lead", image: "https://i.pravatar.cc/300?img=8" }
  ];

  return (
    <StaticPageLayout
      title="About Us | HarmonyHub - Virtual Music Instruments"
      description="Learn about HarmonyHub's mission to make music accessible to everyone through interactive virtual instruments."
      keywords={["about harmonyhub", "virtual instruments company", "music education", "online music platform"]}
      heroTitle="Making Music Accessible to Everyone"
      heroSubtitle="HarmonyHub is dedicated to breaking down barriers in music education and creation through innovative, interactive digital instruments."
      heroIcon={Music}
      showBackgroundImage={true}
      backgroundImageUrl="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070"
    >
      {/* Tab Navigation */}
      <nav className="bg-card/80 dark:bg-card/60 backdrop-blur-md border-y border-border/50 sticky top-16 z-10 mb-8 rounded-xl shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide py-2 gap-2 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`
                  whitespace-nowrap font-medium px-6 py-3 rounded-lg
                  transition-all duration-300 text-sm md:text-base
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto container px-4 transition-colors duration-200">
        {/* Our Story Section */}
        {activeTab === "story" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Story</h2>
                <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                  <p>
                    HarmonyHub began as a passion project by a small team of musicians and developers who shared
                    a common belief: <span className="font-semibold text-primary">everyone should have the opportunity to experience the joy of making music</span>.
                  </p>
                  <p>
                    Traditional instruments can be expensive and difficult to learn. We set out to change that by creating 
                    high-quality virtual instruments that are instantly accessible to anyone with an internet connection.
                  </p>
                </div>
              </div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"
                  alt="Musicians collaborating"
                  className="w-full h-72 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <p className="text-lg font-semibold">Founded in 2022</p>
                    <p className="text-white/80">From a single piano to 18+ virtual instruments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">Our Journey</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    className="bg-card dark:bg-card/60 rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                    <h4 className="text-lg font-medium text-foreground mb-2">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Mission & Values Section */}
        {activeTab === "mission" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Mission & Values</h2>
              <p className="text-muted-foreground text-lg">
                At HarmonyHub, we believe that music is a universal language that should be accessible to everyone.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-br ${value.color} p-6 rounded-xl shadow-sm border border-border/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-background/50 rounded-lg">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{value.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Vision Banner */}
            <div className="bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5 dark:from-primary/30 dark:via-accent/20 dark:to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="p-6 bg-primary/20 rounded-full">
                    <Music className="w-16 h-16 text-primary" />
                  </div>
                </motion.div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                  <p className="text-muted-foreground text-lg">
                    We envision a world where everyone can experience the joy of making music, where
                    virtual instruments are powerful tools for creative expression and musical education.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 p-8 rounded-2xl border border-border/50">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Start Your Musical Journey Today</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Whether you're a beginner or an experienced musician, HarmonyHub has something for you.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/explore">
                  <Button size="lg" className="hover-scale">Explore Instruments</Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg" className="hover-scale">Browse Categories</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Team Section */}
        {activeTab === "team" && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Our diverse team of musicians, developers, and designers are passionate about making music more accessible.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 relative overflow-hidden rounded-full bg-muted border-4 border-transparent group-hover:border-primary/50 transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button className="p-2 bg-background/90 rounded-full hover:bg-background transition-colors">
                          <Users size={14} className="text-foreground" />
                        </button>
                        <button className="p-2 bg-background/90 rounded-full hover:bg-background transition-colors">
                          <Mail size={14} className="text-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Final CTA */}
      <motion.div 
        className="mt-16 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/5 dark:from-primary/30 dark:via-accent/20 dark:to-primary/10 py-16 md:py-20 rounded-3xl border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Make Music?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Join thousands of musicians creating beautiful music with our virtual instruments.
          </p>
          <Link to="/explore">
            <Button size="lg" className="hover-scale shadow-lg">
              Start Playing Now
            </Button>
          </Link>
        </div>
      </motion.div>
    </StaticPageLayout>
  );
};

export default About;
