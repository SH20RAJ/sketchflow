'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Loader2, Shield, Lock } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/projects');
    }
  }, [router, status]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await signIn('google', { callbackUrl: '/projects' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 relative z-10" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[length:30px_30px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0V30M28.5 0V30M0 1.5H30M0 28.5H30' stroke='%23000' stroke-opacity='0.7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
        }}
      />

      {/* Navigation */}
      {/* <nav className="relative z-10 flex justify-between items-center p-8">
        <Link href="/">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg group-hover:bg-blue-500/30 transition-all duration-300"></div>
              <Image
                src="/logo.svg"
                alt="SketchFlow"
                width={40}
                height={40}
                className="relative transform group-hover:scale-105 transition-transform"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
              SketchFlow
            </h1>
          </motion.div>
        </Link>
      </nav> */}

      {/* Main Content */}
      <div className="flex flex-row-reverse min-h-[calc(100vh-120px)]">
        {/* Left Section - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative"
          >
            {/* Floating Elements */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
              />
            </div>

            <Card className="backdrop-blur-xl bg-white/90 shadow-2xl transition-all duration-500 hover:shadow-3xl rounded-2xl border-white/20">
              <CardHeader className="text-center space-y-2 pb-0">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mb-4 relative"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg"
                  />
                  <Image
                    src="/logo.svg"
                    alt="SketchFlow"
                    width={60}
                    height={60}
                    className="relative transform hover:scale-105 transition-transform"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg mt-2">
                    Continue your creative journey
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div 
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      className="w-full relative group overflow-hidden bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-200 transition-all duration-300"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="relative flex items-center justify-center py-4 gap-3">
                        {isLoggingIn ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Image
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            width={22}
                            height={22}
                            className="transition-transform group-hover:scale-110"
                          />
                        )}
                        <span className="text-base font-medium">
                          {isLoggingIn ? 'Connecting...' : 'Continue with Google'}
                        </span>
                      </div>
                      <motion.div
                        className="absolute inset-0 border-2 border-transparent rounded-lg"
                        animate={{
                          borderColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  </motion.div>

                  <div className="relative py-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 py-1 bg-white/80 text-gray-500 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span>Enterprise-grade security</span>
                        </div>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Section - Social Proof */}
        <div className="hidden lg:flex flex-1 items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-md space-y-8 p-8"
          >
            {/* Trust Indicators */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure by Design</h3>
                  <p className="text-sm text-gray-600">End-to-end encryption for your data</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm space-y-4"
              >
                <h3 className="font-semibold text-gray-900">Trusted Worldwide</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Google', 'Microsoft', 'Adobe', 'Shopify', 'GitHub', 'Tesla'].map((company, index) => (
                    <motion.div
                      key={company}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-center h-8"
                    >
                      <span className="text-sm font-medium text-gray-600">{company}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="text-center space-y-2"
              >
                <p className="text-sm text-gray-500">Join 10,000+ teams worldwide</p>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.svg
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
