"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function ArticlesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, draft

  const { data: articles, isLoading, error } = useSWR('/api/articles', fetcher);

  const filteredArticles = articles?.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'published') return matchesSearch && article.published;
    if (filter === 'draft') return matchesSearch && !article.published;
    return matchesSearch;
  });

  if (error) return <div>Failed to load articles</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
            Articles
          </h1>
          <Button
            onClick={() => router.push('/articles/new')}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:from-blue-700 hover:to-blue-500"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'secondary' : 'outline'}
              onClick={() => setFilter('all')}
              className="min-w-[80px]"
            >
              All
            </Button>
            <Button
              variant={filter === 'published' ? 'secondary' : 'outline'}
              onClick={() => setFilter('published')}
              className="min-w-[80px]"
            >
              Published
            </Button>
            <Button
              variant={filter === 'draft' ? 'secondary' : 'outline'}
              onClick={() => setFilter('draft')}
              className="min-w-[80px]"
            >
              Drafts
            </Button>
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles?.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/articles/${article.id}`)}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${article.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredArticles?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No articles found</p>
            <Button
              onClick={() => router.push('/articles/new')}
              variant="outline"
            >
              Create your first article
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}