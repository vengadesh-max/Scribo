import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, User } from './AuthContext';

export interface Post {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  isPublic: boolean;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
  hashtags: string[];
  likes: number;
  mediaFiles?: string[];
}

interface PostContextType {
  posts: Post[];
  userPosts: Post[];
  getPost: (id: string) => Post | undefined;
  createPost: (post: Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'likes' | 'author'>) => void;
  updatePost: (id: string, postData: Partial<Post>) => void;
  deletePost: (id: string) => void;
  searchPosts: (query: string) => Post[];
  loading: boolean;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error('usePost must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error('Failed to parse saved posts', e);
        localStorage.removeItem('posts');
      }
    }
    setLoading(false);
  }, []);

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('posts', JSON.stringify(posts));
  }, [posts]);

  // Filter posts that belong to the current user
  const userPosts = currentUser 
    ? posts.filter(post => post.authorId === currentUser.id)
    : [];

  // Get a post by id
  const getPost = (id: string): Post | undefined => {
    return posts.find(post => post.id === id);
  };

  // Create a new post
  const createPost = (postData: Omit<Post, 'id' | 'authorId' | 'createdAt' | 'updatedAt' | 'likes' | 'author'>) => {
    if (!currentUser) return;

    const now = new Date().toISOString();
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: currentUser.id,
      author: currentUser,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      ...postData
    };

    setPosts([newPost, ...posts]);
  };

  // Update an existing post
  const updatePost = (id: string, postData: Partial<Post>) => {
    if (!currentUser) return;

    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === id && post.authorId === currentUser.id) {
          return { 
            ...post, 
            ...postData, 
            updatedAt: new Date().toISOString() 
          };
        }
        return post;
      })
    );
  };

  // Delete a post
  const deletePost = (id: string) => {
    if (!currentUser) return;

    setPosts(prevPosts => 
      prevPosts.filter(post => !(post.id === id && post.authorId === currentUser.id))
    );
  };

  // Search posts by title, content or hashtags
  const searchPosts = (query: string): Post[] => {
    if (!query.trim()) return posts.filter(post => post.isPublic);

    const normalizedQuery = query.toLowerCase().trim();
    const isHashtag = normalizedQuery.startsWith('#');
    
    let searchTerm = normalizedQuery;
    if (isHashtag) {
      searchTerm = normalizedQuery.substring(1); // Remove # from the start
    }

    return posts.filter(post => {
      // Only include public posts or posts owned by the current user
      if (!post.isPublic && (!currentUser || post.authorId !== currentUser.id)) {
        return false;
      }

      if (isHashtag) {
        return post.hashtags.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        );
      }

      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
  };

  const value = {
    posts,
    userPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    loading
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};