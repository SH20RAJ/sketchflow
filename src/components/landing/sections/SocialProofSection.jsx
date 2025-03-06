"use client";

import { motion } from "framer-motion";

export default function SocialProofSection() {
  const integrations = [
    "https://www.svgrepo.com/show/512317/github-142.svg",
    "https://www.svgrepo.com/show/448248/slack.svg",
    "https://www.svgrepo.com/show/452076/notion.svg",
    "https://www.svgrepo.com/show/452202/figma.svg",
    "https://www.svgrepo.com/show/452241/jira.svg",
    "https://www.svgrepo.com/show/526412/video-library.svg",
    "https://www.svgrepo.com/show/475688/trello-color.svg",
    "https://www.svgrepo.com/show/125087/yoga.svg",
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600">Trusted by teams at</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-50">
          {integrations.map((logo, index) => (
            <motion.img
              key={index}
              src={`${logo}`}
              alt="Company Logo"
              className="h-8 w-auto mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}