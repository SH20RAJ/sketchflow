'use client'
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Testimonials() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="testimonials" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 opacity-70"></div>
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>

            <div className="container mx-auto px-4 relative">
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">TESTIMONIALS</span>
                    <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                        Trusted by{" "}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
                                industry leaders
                            </span>
                            <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                                <path d="M0 7c20-3 40-3 60 0s40 3 60 0" stroke="url(#gradient)" strokeWidth="2" fill="none" />
                            </svg>
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Join the community of visionaries who have transformed their workflow with our platform
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-white backdrop-blur-lg rounded-3xl shadow-2xl p-12 relative"
                    >
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-600 rounded-full opacity-10"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-600 rounded-full opacity-10"></div>

                        <div className="flex items-center gap-8 mb-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                                <img
                                    src={`/logo.svg`}
                                    alt="User"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-6 w-6 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                                        />
                                    ))}
                                </div>
                                <p className="font-bold text-2xl text-gray-900">
                                    {["John Cater", "Emma Wilson", "Michael Chen"][activeTestimonial]}
                                </p>
                                <p className="text-gray-600 text-lg">
                                    {["Software Engineer at Google", "Lead Designer at Apple", "Product Manager at Microsoft"][activeTestimonial]}
                                </p>
                            </div>
                        </div>

                        <p className="text-2xl text-gray-700 leading-relaxed italic mb-8">
                            "{[
                                "SketchFlow has revolutionized our team's brainstorming sessions. The real-time collaboration features are game-changing!",
                                "As a designer, I've tried many tools, but SketchFlow stands out. The AI-powered suggestions save me hours of work.",
                                "The collaboration features have significantly improved our remote team's productivity. Best investment we've made!"
                            ][activeTestimonial]}"
                        </p>

                        <div className="flex justify-center gap-4 mt-8">
                            {[0, 1, 2].map((index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index
                                        ? "bg-blue-600 w-8"
                                        : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
