"use client";
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
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 hover:scale-102 transition-transform">
              <img
                src="/logo.png"
                alt="SketchFlow"
                className="h-10 w-auto hover:rotate-360 transition-all duration-500"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                SketchFlow
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {["Home", "Features", "Pricing", "Contact"].map((item) => (
              <div key={item} className="relative group">
                <Link
                  href={item === "Home" ? "/#" : `/${item.toLowerCase()}`}
                  className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors"
                >
                  {item}
                </Link>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/projects">
                  <Button variant="outline" className="group bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300">
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="hover:scale-105 transition-transform">
                  <Avatar className="ring-2 ring-blue-500 ring-offset-2 cursor-pointer hover:ring-purple-500 transition-all">
                    <AvatarImage src={session?.user?.image || "/default-avatar.png"} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {session?.user?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full group">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-lg animate-in slide-in-from-right">
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
                {["Home", "Features", "Pricing", "Contact"].map((item) => (
                  <div key={item} className="group">
                    <Link
                      href={item === "Home" ? "/#" : `/${item.toLowerCase()}`}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-200 py-3"
                    >
                      <span className="w-1 h-8 bg-transparent group-hover:bg-blue-600 transition-all duration-200 rounded-r-full" />
                      <span className="text-lg font-medium">{item}</span>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 p-4 space-y-4">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link href="/projects" className="block">
                      <Button variant="outline" className="w-full justify-center group text-lg">
                        Dashboard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 justify-center text-lg font-medium py-6">
                      Join Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
