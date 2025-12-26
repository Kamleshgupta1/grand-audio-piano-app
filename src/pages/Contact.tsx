import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Phone, Send, MessageSquare, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import StaticPageLayout from "@/components/layout/StaticPageLayout";
import { useTheme } from '@/contexts/ThemeContext';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon."
      });
    }, 1500);
  };

  const contactCards = [
    {
      icon: Mail,
      title: "Email Us",
      content: "onlinevertualinstrument@gmail.com",
      href: "mailto:onlinevertualinstrument@gmail.com",
      subtitle: "We typically respond within 24 hours",
      color: "from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10",
      borderColor: "border-t-primary"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (800) 555-1234",
      href: "tel:+18005551234",
      subtitle: "Mon-Fri, 9am-5pm PT",
      color: "from-amber-500/20 to-amber-500/5 dark:from-amber-500/30 dark:to-amber-500/10",
      borderColor: "border-t-amber-500"
    }
  ];

  return (
    <StaticPageLayout
      title="Contact Us | HarmonyHub - Virtual Music Instruments"
      description="Get in touch with the HarmonyHub team for support, feedback, or partnership inquiries."
      keywords={["contact", "support", "help", "feedback", "harmonyhub contact"]}
      heroTitle="Get in Touch"
      heroSubtitle="Have questions about our instruments? Want to collaborate? We'd love to hear from you!"
      heroIcon={MessageSquare}
    >
      <div className="container mx-auto px-4 max-w-6xl transition-colors duration-200">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info Cards */}
          <motion.div
            className="w-full lg:w-1/3 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {contactCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`overflow-hidden border-t-4 ${card.borderColor} bg-gradient-to-br ${card.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-background/50 rounded-lg">
                        <card.icon className="h-5 w-5 text-foreground" />
                      </div>
                      <CardTitle className="text-lg text-foreground">{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <a
                      href={card.href}
                      className="text-foreground hover:text-primary transition-colors font-medium block mb-1"
                    >
                      {card.content}
                    </a>
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-border/50 shadow-md bg-card dark:bg-card/60">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 border-b border-border/50">
                <CardTitle className="text-xl text-foreground">Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="bg-background"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-border/50 bg-muted/30">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="relative overflow-hidden group hover-scale"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send size={16} className="mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/20 rounded-full">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Check out our frequently asked questions or reach out to us directly.
            </p>
            <Button asChild size="lg" className="hover-scale">
              <Link to="/help">View FAQs</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </StaticPageLayout>
  );
};

export default Contact;
