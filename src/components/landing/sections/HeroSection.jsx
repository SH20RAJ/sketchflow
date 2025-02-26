'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Shield, Users, Zap, Star, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section
    id="home"
    className="pt-32 min-h-screen flex items-center relative overflow-hidden"
  >
    {/* Background Elements */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50 pointer-events-none" />
    <div className="absolute inset-0">
      <div className="absolute top-1/4 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <div className="container mx-auto px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-4xl mx-auto"
      >
        {/* Modern Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm"
        >
          <Star className="h-4 w-4 text-blue-500 mr-2" />
          <span className="text-blue-700 font-medium">
            Trusted by 10,000+ teams worldwide
          </span>
        </motion.div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Professional{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Whiteboarding
            </span>
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-full"
            />
          </span>{" "}
          Made{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Simple
            </span>
            <motion.span
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-full"
            />
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Transform your ideas into reality with our powerful
          collaborative whiteboarding platform. Perfect for teams who want
          to innovate faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
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
          <Link
            href={"/try"}
          >
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-gray-700 hover:text-blue-600 bg-white/80 backdrop-blur-sm hover:bg-blue-50 text-lg px-8 py-6 rounded-xl group border-2 border-gray-200 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-50"></div>
                <Play className="h-5 w-5 relative text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-medium">Try Free (No Login)</span>
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 text-gray-600">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
          >
            <Shield className="h-5 w-5 text-green-500" />
            <span>Enterprise-grade security</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
          >
            <Users className="h-5 w-5 text-blue-500" />
            <span>Collaborative workspace</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm"
          >
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Real-time sync</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </section>
  );
}