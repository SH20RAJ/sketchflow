"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingNavBar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3"
              >
                <motion.img
                  src="/logo.svg"
                  alt="SketchFlow"
                  className="h-10 w-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                  SketchFlow
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {["Home", "Features", "Pricing", "Contact"].map((item) => (
                <motion.div key={item} whileHover={{ y: -2 }} className="relative group">
                  <Link
                    href={item === "Home" ? "/#" : `/${item.toLowerCase()}`}
                    className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                </motion.div>
              ))}
            </div>

            {/* Auth Section */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
                <>
                  <Link href="/projects">
                    <Button variant="outline" className="group bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300">
                      Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Avatar className="ring-2 ring-blue-500 ring-offset-2 cursor-pointer hover:ring-purple-500 transition-all">
                      <AvatarImage src={session?.user?.image || "/default-avatar.png"} alt={session?.user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {session?.user?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full group">
                    Join Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 space-y-4 pb-4"
              >
                {["Home", "Features", "Pricing", "Contact"].map((item) => (
                  <motion.div key={item} whileHover={{ x: 4 }} className="px-4">
                    <Link
                      href={item === "Home" ? "/#" : `/${item.toLowerCase()}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors block py-2"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                {isAuthenticated ? (
                  <div className="px-4 flex items-center gap-4">
                    <Link href="/projects" className="block">
                      <Button variant="outline" className="w-full justify-center">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="px-4">
                    <Link href="/login">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 justify-center">
                        Join Now
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </AnimatePresence>
  );
}
