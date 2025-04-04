'use client'

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, ArrowLeft, ArrowRight, Building2, Briefcase } from 'lucide-react';
// Image import removed as we're using CSS-based placeholders
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Testimonials() {
  // Refs for animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // State for testimonial carousel
  const [activeIndex, setActiveIndex] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "Dropbox",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "SketchFlow has transformed how our team collaborates on product designs. The real-time editing and embedding features have made our workflow incredibly efficient. We've cut our design time in half!",
      rating: 5
    },
    {
      id: 2,
      name: "David Chen",
      role: "Lead Developer",
      company: "Stripe",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "As a developer, I appreciate how SketchFlow bridges the gap between design and implementation. The ability to embed diagrams directly into our documentation has improved our team communication significantly.",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "Airbnb",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "The new tagging system in SketchFlow is a game-changer for organizing our design library. I can quickly find and reuse components, saving hours of duplicate work. It's now an essential part of our design system.",
      rating: 5
    },
    {
      id: 4,
      name: "Michael Taylor",
      role: "Engineering Director",
      company: "Shopify",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      quote: "We've tried many diagramming tools, but SketchFlow's combination of powerful features and intuitive interface makes it stand out. The new collaboration features have made remote work seamless for our global team.",
      rating: 5
    }
  ];

  // Navigation functions
  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-32 relative overflow-hidden bg-gradient-to-b from-white to-blue-50"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>
      <div className="absolute top-40 -left-24 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-40 -right-24 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 px-4 py-1.5">
              Customer Stories
            </Badge>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Loved by teams <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">worldwide</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600"
          >
            See how organizations of all sizes are improving their workflow with SketchFlow
          </motion.p>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Main testimonial */}
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Left column - Testimonial content */}
                <div className="flex-1 space-y-6">
                  {/* Quote icon */}
                  <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                    <Quote className="h-6 w-6 text-blue-500" />
                  </div>

                  {/* Testimonial text */}
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-8">
                    "{testimonials[activeIndex].quote}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                      <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-full w-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-500">{testimonials[activeIndex].name.charAt(0)}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{testimonials[activeIndex].name}</h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-3.5 w-3.5" />
                        <span>{testimonials[activeIndex].role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{testimonials[activeIndex].company}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column - Company logo and decorative elements (hidden on mobile) */}
                <div className="hidden md:block w-64 h-64 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 rounded-2xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm w-full h-full flex items-center justify-center">
                      <div className="text-xl font-bold text-gray-400">{testimonials[activeIndex].company}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation controls */}
            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevTestimonial}
                  className="h-10 w-10 rounded-full"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextTestimonial}
                  className="h-10 w-10 rounded-full"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Logos section */}
          {/* <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-24 text-center"
          >
            <motion.p variants={itemVariants} className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-8">
              Trusted by innovative companies
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8"
            >
              {['Dropbox', 'Stripe', 'Airbnb', 'Shopify', 'Slack', 'Notion'].map((company) => (
                <div key={company} className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="h-8 px-4 py-1 bg-white rounded-md shadow-sm flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-500">{company}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
