export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Security</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            At SketchFlow, security is our top priority. We employ industry-leading
            security measures to protect your data and ensure a safe collaboration
            environment.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
            <ul className="list-disc pl-6">
              <li className="mb-3">
                End-to-end encryption for all data transmission
              </li>
              <li className="mb-3">
                Regular security audits and penetration testing
              </li>
              <li className="mb-3">
                Secure data storage with regular backups
              </li>
              <li className="mb-3">
                Multi-factor authentication support
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Infrastructure Security</h2>
            <ul className="list-disc pl-6">
              <li className="mb-3">
                SOC 2 Type II compliant infrastructure
              </li>
              <li className="mb-3">
                24/7 infrastructure monitoring
              </li>
              <li className="mb-3">
                Regular vulnerability assessments
              </li>
              <li className="mb-3">
                DDoS protection and mitigation
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Compliance</h2>
            <p className="mb-4">
              We maintain compliance with major security standards and regulations:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-3">GDPR compliance for EU users</li>
              <li className="mb-3">CCPA compliance for California residents</li>
              <li className="mb-3">HIPAA compliance for healthcare data</li>
              <li className="mb-3">ISO 27001 certified</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
            <ul className="list-disc pl-6">
              <li className="mb-3">Single Sign-On (SSO) integration</li>
              <li className="mb-3">Role-based access control</li>
              <li className="mb-3">Activity logging and monitoring</li>
              <li className="mb-3">IP allowlisting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Report a Vulnerability</h2>
            <p>
              If you discover a security vulnerability, please report it to our
              security team at:
              <br />
              <a
                href="mailto:security@sketchflow.com"
                className="text-blue-600 hover:text-blue-800"
              >
                security@sketchflow.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
