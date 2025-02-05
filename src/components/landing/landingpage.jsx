import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
    return (
        <div className="bg-white min-h-screen">
            <header className="fixed w-full bg-white shadow-sm z-50">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-fuchsia-600">SketchyKids</div>
                    <div className="hidden md:flex space-x-4">
                        <a href="#home" className="text-gray-600 hover:text-fuchsia-500">Home</a>
                        <a href="#features" className="text-gray-600 hover:text-fuchsia-500">Features</a>
                        <a href="#pricing" className="text-gray-600 hover:text-fuchsia-500">Pricing</a>
                    </div>
                    <Button variant="outline" className="hidden md:inline-flex">Get Started</Button>
                </nav>
            </header>

            <main>
                <section id="home" className="pt-24 h-[60vh] flex justify-center items-center pb-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
                            Make Learning <span className="text-fuchsia-500">Fun</span> and <span className="text-fuchsia-500">Easy</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            SketchyKids helps children learn through interactive and engaging activities
                        </p>
                        <Button size="lg" className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white">Start Your Adventure</Button>
                    </div>
                </section>

                <section id="features" className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Fun Features for Kids</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">🎨 Creative Drawing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Let your imagination run wild with our digital drawing tools!</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">🧩 Fun Puzzles</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Solve exciting puzzles and train your brain!</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">📚 Interactive Stories</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Dive into magical stories where you're the hero!</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Simple Pricing for Families</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">Basic</CardTitle>
                                    <CardDescription>For small families</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800 mb-4">$9/month</p>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>✅ 2 Child Accounts</li>
                                        <li>✅ Basic Activities</li>
                                        <li>✅ Parent Dashboard</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white">Choose Plan</Button>
                                </CardFooter>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-fuchsia-500">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">Pro</CardTitle>
                                    <CardDescription>Most popular</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800 mb-4">$19/month</p>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>✅ 5 Child Accounts</li>
                                        <li>✅ All Activities</li>
                                        <li>✅ Advanced Parent Controls</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white">Choose Plan</Button>
                                </CardFooter>
                            </Card>
                            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-fuchsia-500">Family</CardTitle>
                                    <CardDescription>For large families</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800 mb-4">$29/month</p>
                                    <ul className="text-gray-600 space-y-2">
                                        <li>✅ Unlimited Child Accounts</li>
                                        <li>✅ All Activities + Exclusives</li>
                                        <li>✅ Priority Support</li>
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white">Choose Plan</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-100 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>&copy; 2023 SketchyKids. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
