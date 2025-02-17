'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.img 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
                src="/logo.svg" 
                alt="SketchFlow" 
                className="h-10 w-auto" 
              />
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                SketchFlow
              </span>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              Transforming ideas into reality through seamless collaboration and innovative design workflows.
            </p>
            <div className="mt-8 flex gap-4">
              {[
                { icon: Twitter, name: 'twitter' },
                { icon: Github, name: 'github' },
                { icon: Linkedin, name: 'linkedin' }
              ].map(({ icon: Icon, name }) => (
                <motion.a
                  key={name}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://${name}.com`}
                  className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {[
            {
              title: "Product",
              links: [
                { href: "/features", label: "Features" },
                { href: "/pricing", label: "Pricing" },
                { href: "#testimonials", label: "Testimonials" },
                { href: "#integrations", label: "Integrations" }
              ]
            },
            {
              title: "Company",
              links: [
                { href: "/about", label: "About Us" },
                { href: "/blog", label: "Blog" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press Kit" }
              ]
            },
            {
              title: "Resources",
              links: [
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
                { href: "/security", label: "Security" },
                { href: "/support", label: "Support" }
              ]
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <motion.li key={link.label} whileHover={{ x: 3 }}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="h-px w-0 bg-blue-400 group-hover:w-4 transition-all duration-300"></span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-8 border-t border-gray-800/50 text-center"
        >
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} SketchFlow. Crafted with ❤️ globally.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
