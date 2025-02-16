'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { blogPosts } from '../data/blogPosts';

export default function ArticlePage() {
    const { slug } = useParams();
    const post = blogPosts[slug];

    if (!post) {
        return <div>Article not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
            <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </Link>
                </motion.div>

                {/* Article Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                        </div>
                    </div>
                </motion.header>

                {/* Author Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-4 mb-8 bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/20"
                >
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48';
                        }}
                    />
                    <div>
                        <div className="font-medium text-gray-900">{post.author.name}</div>
                        <div className="text-gray-600 text-sm">{post.author.role}</div>
                    </div>
                </motion.div>

                {/* Article Content */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="prose prose-lg max-w-none bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20"
                >
                    {post.content.map((block, index) => {
                        switch (block.type) {
                            case 'paragraph':
                                return (
                                    <p key={index} className="text-gray-600 leading-relaxed mb-6">
                                        {block.content}
                                    </p>
                                );
                            case 'heading':
                                return (
                                    <h2 key={index} className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
                                        {block.content}
                                    </h2>
                                );
                            case 'list':
                                return (
                                    <ul key={index} className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                                        {block.items.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                );
                            default:
                                return null;
                        }
                    })}
                </motion.article>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center gap-4 mt-8"
                >
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-xl border border-white/20 text-gray-600 hover:bg-white/90 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share Article
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-xl border border-white/20 text-gray-600 hover:bg-white/90 transition-colors">
                        <Bookmark className="w-4 h-4" />
                        Save for Later
                    </button>
                </motion.div>
            </div>
        </div>
    );
}