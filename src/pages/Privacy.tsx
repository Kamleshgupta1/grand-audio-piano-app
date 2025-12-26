import { motion } from "framer-motion";
import { useTheme } from '@/contexts/ThemeContext';
import { Shield, Lock, Eye, UserCheck, Bell, Baby, RefreshCw, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StaticPageLayout from "@/components/layout/StaticPageLayout";

const Privacy = () => {
  const lastUpdated = "December 14, 2025";

  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Account information (name, email, preferences)",
        "Usage data (features used, time spent)",
        "Device information (browser, OS, IP address)",
        "Musical content you create using our services",
        "Performance data for service improvement"
      ]
    },
    {
      icon: UserCheck,
      title: "How We Use Your Information",
      content: [
        "Provide, maintain, and improve our services",
        "Process and complete transactions",
        "Send technical notices and support messages",
        "Develop new features and services",
        "Prevent fraudulent transactions"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "End-to-end encryption for sensitive data",
        "Secure servers and networks",
        "Regular security assessments",
        "Employee training on privacy practices",
        "Limited access to personal information"
      ]
    },
    {
      icon: Bell,
      title: "Your Choices",
      content: [
        "Update or correct your account information",
        "Opt-out of marketing communications",
        "Request deletion of your account and data",
        "Set privacy options for your content",
        "Manage cookies and tracking preferences"
      ]
    }
  ];

  return (
    <StaticPageLayout
      title="Privacy Policy | HarmonyHub - Virtual Music Instruments"
      description="Review HarmonyHub's privacy policy to understand how we collect, use, and protect your data."
      keywords={["privacy policy", "data protection", "user privacy", "harmonyhub privacy"]}
      heroTitle="Privacy Policy"
      heroSubtitle="We take your privacy seriously. Learn how we collect, use, and protect your information."
      heroIcon={Shield}
    >
      <div className="container mx-auto px-4 max-w-4xl space-y-6 transition-colors duration-200">
        {/* Last Updated Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
            <RefreshCw className="w-4 h-4 mr-2" />
            Last updated: {lastUpdated}
          </span>
        </div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card dark:bg-card/60 rounded-2xl p-6 md:p-8 shadow-sm border border-border/50 mb-8"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            At HarmonyHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you visit our website and use our virtual instrument services.
          </p>
        </motion.div>

        {/* Main Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="space-y-6">
          {/* Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card dark:bg-card/60 rounded-2xl p-6 shadow-sm border border-border/50"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Sharing of Information
            </h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or transfer your personal information to outside parties except:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                With third-party service providers who help us operate our business
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                When required by law or to protect our rights
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                In connection with a business transfer (merger, acquisition)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
                With your explicit consent
              </li>
            </ul>
          </motion.div>

          {/* Children's Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card dark:bg-card/60 rounded-2xl p-6 shadow-sm border border-border/50"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Baby className="w-5 h-5 text-primary" />
              Children's Privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are not directed to children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we learn that we have collected personal 
              information from a child under 13, we will promptly delete that information.
            </p>
          </motion.div>

          {/* Changes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card dark:bg-card/60 rounded-2xl p-6 shadow-sm border border-border/50"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Changes to This Policy
            </h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl p-6 md:p-8 border border-primary/20"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Contact Us
            </h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:onlinevertualinstrument@gmail.com" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                onlinevertualinstrument@gmail.com
              </a>
              <p className="text-muted-foreground">
                Address: Mumbai, Maharashtra, India
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Privacy;
