import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen">
            <header className="fixed w-full bg-white shadow-sm z-50">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">SketchFlow</div>
                    <div className="hidden md:flex space-x-4">
                        <a href="#home" className="text-gray-600 hover:text-blue-500">Home</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-500">Features</a>
                        <a href="#pricing" className="text-gray-600 hover:text-blue-500">Pricing</a>
                    </div>
                    <Button variant="outline" className="hidden md:inline-flex">Get Started</Button>
                </nav>
            </header>

            <main>
                <section id="home" className="pt-24 h-[60vh] flex justify-center items-center pb-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            Professional <span className="text-blue-500">Whiteboarding</span> Made <span className="text-blue-500">Simple</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            SketchFlow helps developers and teachers collaborate through intuitive whiteboarding and diagramming
                        </p>
                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">Start Creating</Button>
                    </div>
                </section>

                <section id="features" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Powerful Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">🔄 Real-time Collaboration</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Work together seamlessly with your team in real-time</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">📊 Smart Diagrams</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Create professional diagrams with intelligent tools and templates</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">💾 Version Control</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Track changes and maintain history of your work</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Simple, Transparent Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">Free</CardTitle>
                                    <CardDescription>For individual users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800 mb-4">$0/month</p>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>✅ Up to 100 Projects</li>
                                        <li>✅ Basic Templates</li>
                                        <li>✅ Core Features</li>
                                        <li>✅ Community Support</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Get Started</Button>
                                </CardFooter>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-blue-500">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-blue-500">Pro</CardTitle>
                                    <CardDescription>For power users</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800 mb-4">$19/month</p>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>✅ Unlimited Projects</li>
                                        <li>✅ Premium Templates</li>
                                        <li>✅ Advanced Features</li>
                                        <li>✅ Priority Support</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Choose Pro</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-100 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} SketchFlow. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
