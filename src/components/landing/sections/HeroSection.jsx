'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ArrowRight, Shield, Users, Zap, Star, Play, CheckCircle, Sparkles, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const highlightVariant = {
    hidden: { width: "0%" },
    visible: { width: "100%", transition: { duration: 0.8, delay: 0.5 } }
  };

  return (
    <section
      id="home"
      className="pt-32 min-h-screen flex items-center relative overflow-hidden"
      itemScope itemType="https://schema.org/WebPage"
    >
      {/* Background Elements - Enhanced with more dynamic gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-4 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-1/3 -right-4 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Left Content Column */}
          <motion.div variants={fadeIn} className="flex-1 text-left max-w-2xl">
            {/* New Feature Badge */}
            <motion.div
              variants={fadeIn}
              className="mb-6 inline-flex items-center px-3 py-1 bg-blue-50 rounded-full border border-blue-200"
            >
              <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-blue-700 text-sm font-medium">
                New: Project Embedding & Collaboration Features
              </span>
            </motion.div>

            {/* Hero Title - SEO optimized with H1 */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" itemProp="headline">
              Visual Collaboration
              <span className="block mt-2">
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                    Without Limits
                  </span>
                  <motion.span
                    variants={highlightVariant}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-full"
                  />
                </span>
              </span>
            </h1>

            {/* Hero Description - SEO optimized with relevant keywords */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed" itemProp="description">
              SketchFlow combines powerful diagramming, documentation, and real-time collaboration in one seamless platform. Create, share, and collaborate on visual projects with your team—anywhere, anytime.
            </p>

            {/* Feature Bullets - Highlight key benefits */}
            <div className="mb-8 space-y-3">
              {[
                { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "Seamless diagram and markdown integration" },
                { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "Real-time collaboration with your team" },
                { icon: <CheckCircle className="h-5 w-5 text-green-500" />, text: "Embed projects anywhere with custom options" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="flex items-start gap-2">
                  {item.icon}
                  <span className="text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons - Optimized for conversion */}
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl group shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Link href={"/try"}>
                <RainbowButton
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto hover:text-blue-600 bg-white/80 backdrop-blur-sm hover:bg-blue-50 text-lg px-8 py-6 rounded-xl group border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-50"></div>
                    <Play className="h-5 w-5 relative text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium">Try Free (No Login)</span>
                </RainbowButton>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-gray-400" />
              <span>Secure & private</span>
              <span className="mx-2">•</span>
              <Star className="h-4 w-4 text-gray-400" />
              <span>Trusted by 10,000+ teams</span>
            </div>
          </motion.div>

          {/* Right Column - Hero Image */}
          <motion.div
            variants={fadeIn}
            className="flex-1 relative hidden lg:block"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full z-0 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-100 rounded-full z-0 animate-pulse animation-delay-2000"></div>

              {/* Main image with shadow and border */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 opacity-50"></div>
                <div className="p-2">
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src="https://i.imgur.com/GaZsvuB.png"
                      alt="SketchFlow dashboard with visual collaboration features"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover rounded-lg"
                      priority
                    />
                  </div>
                </div>

                {/* Feature badges positioned over the image */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center gap-1.5">
                  <Rocket className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-medium text-blue-700">New Embedding Feature</span>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Social Proof Section - Immediately below hero for credibility */}
        {/* <motion.div
          variants={fadeIn}
          className="mt-16 pt-8 border-t border-gray-100"
        >
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">Trusted by innovative teams worldwide</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            {[
              "/logos/company1.svg",
              "/logos/company2.svg",
              "/logos/company3.svg",
              "/logos/company4.svg",
              "/logos/company5.svg",
              "/logos/company6.svg"
            ].map((logo, index) => (
              <motion.img
                key={index}
                src={logo}
                alt="Company logo"
                className="h-8 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                variants={fadeIn}
              />
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
