import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen">
            <header className="fixed w-full bg-white shadow-sm z-50">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">SketchFlow</div>
                    <div className="hidden md:flex space-x-6">
                        <a href="#home" className="text-gray-600 hover:text-blue-500">Home</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-500">Features</a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-500">Pricing</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-blue-500">Testimonials</a>
                        <a href="#faq" className="text-gray-600 hover:text-blue-500">FAQ</a>
                        <a href="#contact" className="text-gray-600 hover:text-blue-500">Contact</a>
                    </div>
                    <Link href="/projects"><Button variant="outline" className="hidden md:inline-flex">Get Started</Button></Link>
                </nav>
            </header>

            <main>
                <section id="home" className="pt-24 h-[80vh] flex justify-center items-center pb-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
                            Professional <span className="text-blue-500">Whiteboarding</span> Made <span className="text-blue-500">Simple</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            SketchFlow empowers developers, teachers, and creative teams to collaborate through intuitive whiteboarding and diagramming. Unleash your creativity and boost productivity today!
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/projects"><Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">Start Creating</Button></Link>
                            <Button size="lg" variant="outline" className="text-blue-500 hover:bg-blue-50">Watch Demo</Button>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Powerful Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">🔄 Real-time Collaboration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Work together seamlessly with your team in real-time, no matter where they are located. Share ideas instantly and boost productivity.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">📊 Smart Diagrams</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Create professional diagrams with intelligent tools and templates. Our AI-powered suggestions help you design faster and smarter.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">💾 Version Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Track changes and maintain a complete history of your work. Easily revert to previous versions or compare different iterations side by side.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Simple, Transparent Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold text-blue-500">Free</CardTitle>
                                    <CardDescription className="text-lg">For individual users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-gray-800 mb-6">$0<span className="text-xl text-gray-600">/month</span></p>
                                    <ul className="text-gray-600 space-y-3 text-lg">
                                        <li>✅ Up to 100 Projects</li>
                                        <li>✅ Basic Templates</li>
                                        <li>✅ Core Features</li>
                                        <li>✅ Community Support</li>
                                        <li>✅ 1GB Storage</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6">Get Started</Button>
                                </CardFooter>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-blue-500">
                                <CardHeader>
                                    <CardTitle className="text-3xl font-bold text-blue-500">Pro</CardTitle>
                                    <CardDescription className="text-lg">For power users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-gray-800 mb-6">$19<span className="text-xl text-gray-600">/month</span></p>
                                    <ul className="text-gray-600 space-y-3 text-lg">
                                        <li>✅ Unlimited Projects</li>
                                        <li>✅ Premium Templates</li>
                                        <li>✅ Advanced Features</li>
                                        <li>✅ Priority Support</li>
                                        <li>✅ 100GB Storage</li>
                                        <li>✅ Team Collaboration Tools</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6">Choose Pro</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">What Our Users Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                {
                                    quote: "SketchFlow has revolutionized our team's brainstorming sessions. It's intuitive, powerful, and a joy to use!",
                                    author: "John Doe",
                                    title: "Software Engineer"
                                },
                                {
                                    quote: "As a designer, I've tried many tools, but SketchFlow stands out. It's become an essential part of my creative process.",
                                    author: "Emma Wilson",
                                    title: "UX Designer"
                                },
                                {
                                    quote: "The collaboration features in SketchFlow have significantly improved our remote team's productivity. Highly recommended!",
                                    author: "Michael Chen",
                                    title: "Project Manager"
                                }
                            ].map((testimonial, i) => (
                                <Card key={i} className="bg-white shadow-lg">
                                    <CardContent className="pt-6">
                                        <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                                        <p className="font-semibold text-fuchsia-400">{testimonial.author}, {testimonial.title}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="faq" className="py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Frequently Asked Questions</h2>
                        <div className="max-w-3xl mx-auto">
                            {[
                                {
                                    question: "How does SketchFlow ensure data security?",
                                    answer: "We use industry-standard encryption and follow best practices to keep your data safe and secure."
                                },
                                {
                                    question: "Can I collaborate with my team in real-time?",
                                    answer: "Yes, SketchFlow supports real-time collaboration, allowing multiple team members to work on the same project simultaneously."
                                },
                                {
                                    question: "Is there a limit to the number of projects I can create?",
                                    answer: "Free users can create up to 100 projects, while Pro users have unlimited project creation."
                                },
                                {
                                    question: "Do you offer a free trial for the Pro plan?",
                                    answer: "Yes, we offer a 14-day free trial of our Pro plan, giving you full access to all premium features."
                                }
                            ].map((faq, index) => (
                                <div key={index} className="mb-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Get in Touch</h2>
                        <div className="max-w-xl mx-auto">
                            <p className="text-center text-gray-600 mb-8">Have questions or need support? Our team is here to help!</p>
                            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6">Contact Us</Button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">SketchFlow</h3>
                            <p className="text-gray-400">Empowering creativity through collaborative whiteboarding.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><a href="#home" className="text-gray-400 hover:text-white">Home</a></li>
                                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                                <li><a href="#pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Connect</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">LinkedIn</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} SketchFlow. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
