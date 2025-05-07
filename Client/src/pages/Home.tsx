import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePost, PostProvider } from '../contexts/PostContext';
import PostCard from '../components/post/PostCard';
import { PenSquare } from 'lucide-react';

const HomeContent: React.FC = () => {
  const { posts, loading } = usePost();
  const { currentUser } = useAuth();
  const [publicPosts, setPublicPosts] = useState<typeof posts>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Filter out private posts unless they belong to the current user
    const filtered = posts.filter(post => {
      if (post.isPublic) return true;
      if (currentUser && post.authorId === currentUser.id) return true;
      return false;
    });

    const sorted = [...filtered].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setPublicPosts(sorted);
  }, [posts, currentUser]);

  const filteredPosts = publicPosts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'following' && currentUser) {
      // In a real app, you would filter by followed authors
      // For now, just show the current user's posts
      return post.authorId === currentUser.id;
    }
    return false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {currentUser ? `Welcome, ${currentUser.name}` : 'Discover stories that matter'}
          </h1>
          <p className="mt-2 text-gray-600">
            {currentUser 
              ? 'Read the latest posts from writers around the world'
              : 'Join our community and start writing today'
            }
          </p>
        </div>
        {currentUser && (
          <Link 
            to="/create" 
            className="hidden sm:flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PenSquare size={18} className="mr-2" />
            Write a post
          </Link>
        )}
      </div>

      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            For You
          </button>
          <button
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
              filter === 'following'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setFilter('following')}
            disabled={!currentUser}
          >
            Following
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500">
            {currentUser
              ? 'Start by writing your first post or follow some authors'
              : 'Sign up and start sharing your ideas with the world'
            }
          </p>
          {currentUser ? (
            <Link
              to="/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PenSquare size={18} className="mr-2" />
              Write a post
            </Link>
          ) : (
            <div className="mt-4 space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <PostProvider>
      <HomeContent />
    </PostProvider>
  );
};

export default Home;