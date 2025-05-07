import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../contexts/PostContext';
import { User } from '../../contexts/AuthContext';
import { Heart, EyeOff, Lock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, compact = false }) => {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get the first image from media files if any
  const coverImage = post.coverImage || (post.mediaFiles && post.mediaFiles.length > 0 ? post.mediaFiles[0] : null);

  // Truncate text for preview
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Content preview without HTML tags
  const contentPreview = post.content.replace(/<[^>]*>/g, '');

  return (
    <article className={`bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md ${compact ? 'border' : ''}`}>
      <Link to={`/post/${post.id}`} className="block">
        {/* Cover image */}
        {coverImage && !compact && (
          <div className="h-48 w-full overflow-hidden">
            <img 
              src={coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        
        {/* Content */}
        <div className={`p-4 ${compact ? 'pb-3' : 'p-6'}`}>
          {/* Author info and date */}
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden mr-3 flex-shrink-0">
              {post.author?.profileImage ? (
                <img 
                  src={post.author.profileImage} 
                  alt={post.author.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600">
                  {post.author?.name.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{post.author?.name || 'Unknown Author'}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            {!post.isPublic && (
              <div className="ml-auto">
                <Lock size={16} className="text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Title */}
          <h2 className={`font-bold text-gray-900 mb-2 ${compact ? 'text-lg' : 'text-xl'}`}>
            {truncateText(post.title, compact ? 60 : 100)}
          </h2>
          
          {/* Preview text */}
          {!compact && (
            <p className="text-gray-600 mb-4">
              {truncateText(contentPreview, 150)}
            </p>
          )}
          
          {/* Tags and likes */}
          <div className={`flex items-center justify-between ${compact ? 'mt-3' : 'mt-4'}`}>
            <div className="flex flex-wrap">
              {post.hashtags.slice(0, compact ? 2 : 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
              {post.hashtags.length > (compact ? 2 : 3) && (
                <span className="inline-block text-gray-500 text-xs px-1 py-1 mb-2">
                  +{post.hashtags.length - (compact ? 2 : 3)}
                </span>
              )}
            </div>
            <div className="flex items-center text-gray-500">
              <Heart size={16} className="mr-1" />
              <span className="text-xs">{post.likes}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;