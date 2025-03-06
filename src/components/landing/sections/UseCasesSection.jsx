"use client";

import { motion } from "framer-motion";
import { Lightbulb, Cpu, Users, PieChart } from "lucide-react";

export default function UseCasesSection() {
  const useCases = [
    {
      icon: Lightbulb,
      title: "Brainstorming",
      description: "Capture and organize ideas in real-time with your team.",
    },
    {
      icon: Cpu,
      title: "System Design",
      description: "Create detailed system architecture diagrams with ease.",
    },
    {
      icon: Users,
      title: "Team Planning",
      description: "Plan projects and workflows collaboratively.",
    },
    {
      icon: PieChart,
      title: "Data Visualization",
      description: "Transform complex data into clear visual representations.",
    },
    {
      icon: Users,
      title: "Remote Collaboration",
      description: "Work seamlessly with team members across different locations.",
    },
    {
      icon: Lightbulb,
      title: "Product Design",
      description: "Design and iterate on product concepts with your team.",
    },
    {
      icon: PieChart,
      title: "Process Mapping",
      description: "Map out business processes and identify optimization opportunities.",
    },
    {
      icon: Cpu,
      title: "Technical Documentation",
      description: "Create comprehensive technical documentation with visual aids.",
    },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Perfect for Every{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
              Use Case
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Discover how teams use SketchFlow to solve different challenges
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            >
              <useCase.icon className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">{useCase.title}</h3>
              <p className="text-gray-600">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}