'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Loader2,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setIsSubmitting(false);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[length:30px_30px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0V30M28.5 0V30M0 1.5H30M0 28.5H30' stroke='%23000' stroke-opacity='0.7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
            Let's Start a Conversation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Name
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-12"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Work Email
                    </label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Company
                    </label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="h-12"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Message
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/20">
                <Mail className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-600">
                  <a href="mailto:hello@sketchflow.space" className="hover:text-blue-600 transition-colors">
                    hello@sketchflow.space
                  </a>
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl p-6 shadow-lg border border-white/20">
                <Phone className="h-6 w-6 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-600">
                  <a href="tel:+1234567890" className="hover:text-blue-600 transition-colors">
                    +1 (234) 567-890
                  </a>
                </p>
              </div>
            </div>

            {/* Office Information */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl p-8 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Our Office</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-600">
                      123 Innovation Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-gray-600">
                      Monday - Friday<br />
                      9:00 AM - 6:00 PM PST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Contact */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-8 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Enterprise Solutions</h3>
              </div>
              <p className="mb-6 text-blue-50">
                Looking for enterprise-grade solutions? Our team of experts is here to help you scale.
              </p>
              <Link href="/enterprise">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-8">Trusted by Industry Leaders</h3>
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-60">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </motion.div>

        {/* Support Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your needs"
              },
              {
                title: "Quick Response",
                description: "Average response time under 30 minutes"
              },
              {
                title: "99.9% Satisfaction",
                description: "Committed to providing the best service"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 