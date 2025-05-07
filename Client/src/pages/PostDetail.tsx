import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePost, PostProvider, Post } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Share2, ArrowLeft, Twitter, Linkedin, Facebook, Eye, EyeOff, Lock } from 'lucide-react';

const PostDetailContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, posts, loading } = usePost();
  const { currentUser } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [id, posts, getPost]);

  // If post is not found
  if (!loading && !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  // Check if user is allowed to view this post
  if (post && !post.isPublic && (!currentUser || post.authorId !== currentUser.id)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-yellow-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Private post</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This post is private and can only be viewed by its author.</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLike = () => {
    setLiked(!liked);
    // In a real app, you would update the post's like count in the database
  };

  const sharePost = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this post: ${post.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>
      
      <article className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Post header */}
        <div className="p-6 pb-0">
          <div className="flex items-center mb-4">
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
              <Link to={`/profile/${post.authorId}`} className="text-sm font-medium text-gray-900 hover:underline">
                {post.author?.name || 'Unknown Author'}
              </Link>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            {!post.isPublic && (
              <div className="ml-auto">
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                  <Lock size={12} className="mr-1" />
                  Private
                </div>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.hashtags.map((tag, index) => (
              <Link 
                key={index}
                to={`/search?q=%23${tag}`}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-6">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}
        
        {/* Post content */}
        <div className="px-6 pb-6">
          <div className="prose max-w-none">
            {/* In a real app, you would render HTML safely */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Media gallery */}
          {post.mediaFiles && post.mediaFiles.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Attached Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {post.mediaFiles.map((media, index) => (
                  <a 
                    key={index}
                    href={media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img 
                      src={media} 
                      alt={`Attached media ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          
          {/* Engagement */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
                    liked 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} className={liked ? 'fill-current' : ''} />
                  <span>{liked ? post.likes + 1 : post.likes}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => sharePost('twitter')}
                  className="p-2 text-gray-500 hover:text-blue-400"
                  title="Share on Twitter"
                >
                  <Twitter size={18} />
                </button>
                <button
                  onClick={() => sharePost('linkedin')}
                  className="p-2 text-gray-500 hover:text-blue-600"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} />
                </button>
                <button
                  onClick={() => sharePost('facebook')}
                  className="p-2 text-gray-500 hover:text-blue-800"
                  title="Share on Facebook"
                >
                  <Facebook size={18} />
                </button>
                <button
                  onClick={() => sharePost('copy')}
                  className="p-2 text-gray-500 hover:text-gray-800"
                  title="Copy link"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

const PostDetail: React.FC = () => {
  return (
    <PostProvider>
      <PostDetailContent />
    </PostProvider>
  );
};

export default PostDetail;