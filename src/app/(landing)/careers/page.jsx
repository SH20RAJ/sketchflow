export default function CareersPage() {
  const openings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for a Senior Frontend Developer to help build and improve our collaborative whiteboarding platform."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Join our design team to create intuitive and beautiful user experiences for our growing platform."
    },
    {
      title: "Developer Advocate",
      department: "Developer Relations",
      location: "Remote",
      type: "Full-time",
      description: "Help developers and teams get the most out of SketchFlow through documentation, tutorials, and community engagement."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Join Our Team</h1>
        <p className="text-xl text-gray-600 mb-12">
          We're on a mission to transform how teams collaborate. Join us in building
          the future of visual collaboration.
        </p>

        <h2 className="text-2xl font-semibold mb-6">Open Positions</h2>
        <div className="space-y-6">
          {openings.map((job, index) => (
            <div
              key={index}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.department}</p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {job.type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{job.location}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Don't see a perfect fit?</h2>
          <p className="text-gray-600 mb-4">
            We're always looking for talented individuals to join our team. Send us
            your resume and we'll keep you in mind for future opportunities.
          </p>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Send Resume
          </button>
        </div>
      </div>
    </div>
  );
}
