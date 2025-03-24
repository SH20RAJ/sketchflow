'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-600 text-lg">
            Please read these terms carefully before using our services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using SketchFlow's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">2. Use License</h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Permission is granted to temporarily use our services for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">4. Service Modifications</h2>
            <p className="text-gray-600 leading-relaxed">
              SketchFlow reserves the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">5. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall SketchFlow be liable for any damages arising out of the use or inability to use our services, even if we have been notified of the possibility of such damages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">6. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws, and you submit to the exclusive jurisdiction of the courts located within the jurisdiction for resolution of any disputes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">7. Beta Status and Feature Availability</h2>
            <p className="text-gray-600 leading-relaxed">
              Please note that SketchFlow is currently in beta phase. Some features mentioned on our website, including but not limited to real-time collaboration and AI-powered generation capabilities, may not be fully implemented or available at this time. We are actively developing these features and will make them available as soon as they meet our quality standards. Users will be notified when new features are released.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
              <a href="mailto:legal@sketchflow.space" className="text-blue-600 hover:text-blue-700 ml-1">
                legal@sketchflow.space
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
          Last updated: {new Date().toLocaleDateString()}
        </motion.div>
      </div>
    </div>
  );
}
