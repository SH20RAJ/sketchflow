export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">About SketchFlow</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          SketchFlow is a revolutionary collaborative whiteboarding and documentation platform
          that brings teams together to create, ideate, and innovate.
        </p>
        
        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
        <p className="mb-6">
          Our mission is to empower teams with intuitive tools that make collaboration
          seamless and effective, regardless of where team members are located.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Story</h2>
        <p className="mb-6">
          Founded in 2024, SketchFlow emerged from a simple observation: teams needed
          a better way to collaborate visually. We've built a platform that combines
          the best of whiteboarding and documentation, making it easier than ever for
          teams to work together.
        </p>

        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-3">Innovation: We constantly push the boundaries of what's possible</li>
          <li className="mb-3">Collaboration: We believe in the power of teamwork</li>
          <li className="mb-3">Simplicity: We make complex things simple</li>
          <li className="mb-3">User-First: We build for our users' needs</li>
        </ul>
      </div>
    </div>
  );
}
