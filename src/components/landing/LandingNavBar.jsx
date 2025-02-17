"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingNavBar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <img src="/logo.svg" alt="SketchFlow" className="h-8 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              SketchFlow
            </span>
          </motion.div>
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link
              href="/#"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#features" 
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Testimonials
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {isAuthenticated ? (
              <>
                <Link href="/projects">
                  <Button variant="outline" className="group">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Avatar className="ring-2 ring-blue-500 ring-offset-2">
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name}
                  />
                  <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white group">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </motion.div>
        </nav>
      </header>
    </>
  );
}
