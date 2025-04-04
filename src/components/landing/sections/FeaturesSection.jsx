'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, CheckCircle2, Shield, Code, Sparkles, Share2, Tag, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function FeaturesSection() {
  // State for feature tabs
  const [activeTab, setActiveTab] = useState('collaboration');

  // Refs for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

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

  // Feature tabs data
  const featureTabs = [
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: <Users className="h-4 w-4" />,
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with your team in real-time. Share ideas instantly and boost productivity with our powerful collaboration features.',
      image: '/features/collaboration.png',
      highlights: [
        'Multiple users editing simultaneously',
        'Role-based access controls',
        'Activity tracking and history',
        'Comment and feedback system'
      ]
    },
    {
      id: 'embedding',
      label: 'Embedding',
      icon: <Code className="h-4 w-4" />,
      title: 'Project Embedding',
      description: 'Embed your SketchFlow projects anywhere with customizable options for security and display preferences.',
      image: '/features/embedding.png',
      highlights: [
        'Customizable display options',
        'Domain-based security controls',
        'Responsive embedding',
        'Auto-sync with source project'
      ],
      isNew: true
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: <Tag className="h-4 w-4" />,
      title: 'Project Organization',
      description: 'Keep your projects organized with powerful tagging, search, and management features.',
      image: '/features/organization.png',
      highlights: [
        'Custom tagging system',
        'Advanced search capabilities',
        'Project categorization',
        'Bulk operations'
      ],
      isNew: true
    }
  ];

  return (
    <section id="features" ref={sectionRef} className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white pointer-events-none" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block px-4 py-2 bg-blue-50 rounded-full text-blue-600 font-medium text-sm mb-4"
          >
            Features
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 mb-6"
          >
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              create amazing diagrams
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600"
          >
            Powerful features that help you bring your ideas to life,
            collaborate with your team, and deliver results faster.
          </motion.p>
        </motion.div>

        {/* Feature Tabs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-16"
        >
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-12">
              {featureTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 relative"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.isNew && (
                    <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded-full">
                      NEW
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {featureTabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                >
                  {/* Feature Content */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-bold text-gray-900">{tab.title}</h3>
                      {tab.isNew && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                          New Feature
                        </Badge>
                      )}
                    </div>

                    <p className="text-lg text-gray-600">{tab.description}</p>

                    <div className="space-y-4 mt-8">
                      <h4 className="text-lg font-semibold text-gray-800">Key Highlights</h4>
                      <ul className="space-y-3">
                        {tab.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Feature Image - CSS Placeholder */}
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl rotate-2 transform"></div>
                    <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                      <div className="w-full aspect-[3/2] bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-8">
                        {/* Feature icon */}
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                          {tab.icon && React.cloneElement(tab.icon, { className: 'h-8 w-8 text-blue-600' })}
                        </div>

                        {/* Feature name */}
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{tab.title}</h3>

                        {/* Feature illustration */}
                        <div className="mt-4 w-full max-w-xs">
                          <div className="h-2 bg-blue-200 rounded-full w-full mb-3"></div>
                          <div className="h-2 bg-blue-200 rounded-full w-4/5 mb-3"></div>
                          <div className="h-2 bg-blue-200 rounded-full w-2/3"></div>
                        </div>
                      </div>
                    </div>

                    {tab.isNew && (
                      <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg transform rotate-12">
                        <Sparkles className="h-4 w-4 inline-block mr-1" />
                        <span className="text-sm font-medium">New!</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Feature Grid - Additional Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-24"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl font-bold text-center mb-12"
          >
            And many more powerful features
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6 text-amber-500" />,
                title: 'Lightning Fast',
                description: 'Optimized performance ensures smooth experience even with complex diagrams.'
              },
              {
                icon: <Shield className="h-6 w-6 text-green-500" />,
                title: 'Enterprise Security',
                description: 'Your data is protected with enterprise-grade security and compliance features.'
              },
              {
                icon: <Share2 className="h-6 w-6 text-indigo-100" />,
                title: 'Easy Sharing',
                description: 'Share your projects with anyone, whether they are team members or external stakeholders.'

              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-50" />
                  <div className="relative h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}