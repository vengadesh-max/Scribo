import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePost, PostProvider } from '../contexts/PostContext';
import PostCard from '../components/post/PostCard';
import { PenSquare, Settings, Twitter, Linkedin, Github, Facebook, Instagram } from 'lucide-react';

const ProfileContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { userPosts } = usePost();
  const [activeTab, setActiveTab] = useState('posts');

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">You need to be logged in to view this page</h2>
        <Link 
          to="/login" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const sortedPosts = [...userPosts].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderSocialIcon = (type: string) => {
    switch (type) {
      case 'twitter':
        return <Twitter size={18} />;
      case 'linkedin':
        return <Linkedin size={18} />;
      case 'github':
        return <Github size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'instagram':
        return <Instagram size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-green-400 to-blue-500 sm:h-48"></div>
        
        <div className="px-4 py-5 sm:px-6 -mt-16 sm:-mt-24 flex flex-col items-center">
          {/* Profile Image */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white overflow-hidden">
            {currentUser.profileImage ? (
              <img 
                src={currentUser.profileImage} 
                alt={currentUser.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 text-2xl font-semibold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
            <p className="text-gray-500">{currentUser.email}</p>
            
            {currentUser.bio && (
              <p className="mt-2 text-gray-600">{currentUser.bio}</p>
            )}
            
            {/* Social Links */}
            {currentUser.socialLinks && Object.keys(currentUser.socialLinks).length > 0 && (
              <div className="mt-3 flex justify-center space-x-3">
                {Object.entries(currentUser.socialLinks).map(([type, url]) => 
                  url && (
                    <a 
                      key={type}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      {renderSocialIcon(type)}
                    </a>
                  )
                )}
              </div>
            )}
            
            {/* Premium Badge */}
            {currentUser.isPremium && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Premium
                </span>
              </div>
            )}
            
            <div className="mt-6 flex justify-center space-x-4">
              <Link 
                to="/profile/edit" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Settings size={18} className="mr-2" />
                Edit Profile
              </Link>
              <Link 
                to="/create" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <PenSquare size={18} className="mr-2" />
                Write
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-1 py-3 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-1 py-3 font-medium text-sm ${
                activeTab === 'drafts'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-8">
        {activeTab === 'posts' && (
          <>
            {sortedPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedPosts.map(post => (
                  <PostCard key={post.id} post={post} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">Start writing and share your ideas with the world</p>
                <Link 
                  to="/create" 
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <PenSquare size={18} className="mr-2" />
                  Write your first post
                </Link>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'drafts' && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts yet</h3>
            <p className="text-gray-500 mb-4">Your unpublished stories will appear here</p>
            <Link 
              to="/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <PenSquare size={18} className="mr-2" />
              Start writing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <PostProvider>
      <ProfileContent />
    </PostProvider>
  );
};

export default Profile;