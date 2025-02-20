import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ArticleDetails({ article }) {
  return (
    <Card className="max-w-4xl mx-auto p-6 space-y-6">
      {article.coverImage && (
        <div className="w-full h-64 relative overflow-hidden rounded-lg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{article.title}</h1>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            {article.user?.image && (
              <img
                src={article.user.image}
                alt={article.user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{article.user?.name}</span>
          </div>
          <span>•</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.readingTime} min read</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.tags?.map(tag => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

        <div className="prose max-w-none">
          {article.content}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <span>👏</span>
            <span>{article._count?.claps || 0} claps</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💬</span>
            <span>{article._count?.comments || 0} comments</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>👁️</span>
            <span>{article.views || 0} views</span>
          </div>
        </div>

        {article.seoDesc && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">SEO Information</h2>
            <div className="space-y-2">
              <p><strong>Title:</strong> {article.seoTitle || article.title}</p>
              <p><strong>Description:</strong> {article.seoDesc}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}