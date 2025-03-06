"use client";

import { motion } from "framer-motion";
import { Rocket, Users, TrendingUp } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Rocket,
      title: "Create Project",
      description: "Start with a blank canvas or choose from templates",
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Invite team members and work together in real-time",
    },
    {
      icon: TrendingUp,
      title: "Ship Faster",
      description: "Export, share, and implement your designs",
    },
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              SketchFlow
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-gray-600">
            Get started in minutes with our intuitive workflow
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 hidden md:block" />
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 relative z-10"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div className="text-center">
                <step.icon className="h-12 w-12 mx-auto text-blue-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}