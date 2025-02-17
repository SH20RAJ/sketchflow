'use client';

import { motion } from 'framer-motion';
import { 
  GitFork, 
  Share2, 
  Users, 
  Clock, 
  Globe,
  Layout,
  Pencil,
  ExternalLink,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function SpacePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username;

  const { data: spaceData, error } = useSWR(`/api/space/${username}`, fetcher);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Space Not Found</h1>
        <p className="text-gray-600 mb-8">The space you're looking for doesn't exist or is private.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );

  if (!spaceData) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-xl mb-8" />
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
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
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] bg-[length:30px_30px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0V30M28.5 0V30M0 1.5H30M0 28.5H30' stroke='%23000' stroke-opacity='0.7' stroke-width='0.5'/%3E%3C/svg%3E")`,
          maskImage: 'radial-gradient(circle at center, transparent 0%, black 100%)'
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="mb-6 relative">
            <div className="w-32 h-32 mx-auto relative">
              <Image
                src={spaceData.user.image || '/default-avatar.png'}
                alt={spaceData.user.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
              />
              {spaceData.user.isPro && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Pro
                </div>
              )}
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
            {spaceData.user.name}'s Space
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {spaceData.user.bio || `Creating amazing diagrams with SketchFlow`}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="gap-2"
              asChild
            >
              <Link href={`mailto:${spaceData.user.email}`}>
                <Mail className="w-4 h-4" />
                Contact
              </Link>
            </Button>
            {spaceData.user.website && (
              <Button
                variant="outline"
                className="gap-2"
                asChild
              >
                <Link href={spaceData.user.website} target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  Website
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {[
            { icon: Layout, value: spaceData.stats.totalProjects, label: "Projects" },
            { icon: Share2, value: spaceData.stats.sharedProjects, label: "Shared" },
            { icon: GitFork, value: spaceData.stats.clones, label: "Clones" },
            { icon: Users, value: spaceData.stats.collaborators, label: "Collaborators" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-lg border border-white/20"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Public Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Public Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaceData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Globe className="h-4 w-4" />
                      <span>Public</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GitFork className="h-4 w-4" />
                      {project.clones} clones
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/project/${project.id}`}>
                        <Pencil className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/project/${project.id}/clone`)}
                    >
                      <GitFork className="h-4 w-4 mr-1" />
                      Clone
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 