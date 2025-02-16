'use client';

import { motion } from 'framer-motion';

export default function BlogPage() {
  const blogPosts = [
    {
      title: "Introducing SketchFlow: The Future of Collaborative Whiteboarding",
      date: "February 15, 2024",
      excerpt: "Today, we're excited to announce the launch of SketchFlow, a revolutionary platform that combines the power of whiteboarding with real-time collaboration.",
      slug: "introducing-sketchflow",
      category: "Product Updates",
      readTime: "5 min read"
    },
    {
      title: "Best Practices for Remote Team Collaboration",
      date: "February 10, 2024",
      excerpt: "Discover how to make the most of remote collaboration with these proven strategies and tools.",
      slug: "remote-collaboration-best-practices",
      category: "Collaboration",
      readTime: "4 min read"
    },
    {
      title: "The Evolution of Digital Whiteboarding",
      date: "February 5, 2024",
      excerpt: "From physical whiteboards to digital collaboration spaces, explore how whiteboarding has evolved in the digital age.",
      slug: "evolution-of-digital-whiteboarding",
      category: "Industry Insights",
      readTime: "6 min read"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
            SketchFlow Blog
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Insights, updates, and stories about collaboration, creativity, and the future of work.
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.slug}
              variants={item}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="text-gray-500 text-sm">{post.readTime}</span>
              </div>

              <time className="text-sm text-gray-500 block mb-2">{post.date}</time>

              <h2 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                <a href={`/blog/${post.slug}`}>
                  {post.title}
                </a>
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

              <a
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
              >
                Read article
                <svg
                  className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </motion.article>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for the latest updates, insights, and product news.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
