"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeroCTASection() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <section className="py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="backdrop-blur-lg bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl"
          >
            <h2 className="text-5xl font-bold text-white mb-6 text-center leading-tight">
              Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">Workflow</span> with
              <br />Next-Gen Design Tools
            </h2>
            <p className="text-xl text-blue-50 mb-12 text-center max-w-2xl mx-auto leading-relaxed">
              Join the design revolution with thousands of forward-thinking teams already using SketchFlow to create, collaborate, and innovate.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {isAuthenticated ? (
                <Link href="/projects">
                  <Button
                    size="lg"
                    className="group bg-white hover:bg-blue-50 text-blue-600 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Open Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button
                    size="lg"
                    className="group bg-white hover:bg-blue-50 text-blue-600 text-lg px-10 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}