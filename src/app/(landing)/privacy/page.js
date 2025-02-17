'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  // Format date consistently between server and client
  const lastUpdated = new Date('2024-02-17').toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric', 
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg">
            Your privacy is important to us. Learn how we protect and manage your data.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information that you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Your name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Usage data and preferences</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Communicate with you about products, services, and events</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <a href="mailto:privacy@sketchflow.space" className="text-blue-600 hover:text-blue-700 ml-1">
                privacy@sketchflow.space
              </a>
            </p>
          </section>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          Last updated: {lastUpdated}
        </motion.div>
      </div>
    </div>
  );
}
