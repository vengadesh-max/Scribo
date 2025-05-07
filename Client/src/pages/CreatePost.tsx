import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePost, PostProvider } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Image, X, Hash, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const CreatePostContent: React.FC = () => {
  const { createPost } = usePost();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleHashtagAdd = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && hashtags.length < 5 && !hashtags.includes(tag)) {
      setHashtags([...hashtags, tag]);
      setHashtagInput('');
    }
  };

  const handleHashtagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      handleHashtagAdd();
    }
  };

  const handleHashtagRemove = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaFiles(prev => [...prev, reader.result as string]);
          
          // If this is the first image and no cover image is set, use it as cover
          if (mediaFiles.length === 0 && !coverImage) {
            setCoverImage(reader.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const updatedFiles = [...prev];
      const removedFile = updatedFiles.splice(index, 1)[0];
      
      // If the removed file was the cover image, reset the cover image
      if (removedFile === coverImage) {
        setCoverImage(updatedFiles.length > 0 ? updatedFiles[0] : null);
      }
      
      return updatedFiles;
    });
  };

  const setCoverImageFromMedia = (imageUrl: string) => {
    setCoverImage(imageUrl);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      createPost({
        title,
        content,
        coverImage,
        isPublic,
        hashtags,
        mediaFiles
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
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
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <label htmlFor="title" className="text-xl font-semibold text-gray-900 mb-2 block">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a compelling title..."
              className={`block w-full text-xl font-medium border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-green-600 py-3 px-0 ${
                errors.title ? 'border-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Media upload area */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Media Files
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <Image size={16} className="mr-2" />
                Add Image
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>
            
            {mediaFiles.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {mediaFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className={`relative group rounded-lg overflow-hidden border ${
                      file === coverImage ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <img 
                      src={file} 
                      alt={`Uploaded ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setCoverImageFromMedia(file)}
                        className="p-1 bg-green-500 text-white rounded-full mr-2"
                        title="Set as cover image"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="p-1 bg-red-500 text-white rounded-full"
                        title="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {file === coverImage && (
                      <span className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs py-1 text-center">
                        Cover Image
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Upload images to include in your post</p>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              placeholder="Tell your story..."
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                errors.content ? 'border-red-500' : ''
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (max 5)
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {hashtags.map((tag, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleHashtagRemove(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              
              {hashtags.length < 5 && (
                <div className="flex-grow">
                  <div className="flex items-center">
                    <Hash size={16} className="text-gray-400 mr-1" />
                    <input
                      type="text"
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={handleHashtagInputKeyDown}
                      placeholder="Add a tag"
                      className="border-none focus:ring-0 text-sm p-1"
                    />
                    <button
                      type="button"
                      onClick={handleHashtagAdd}
                      disabled={!hashtagInput.trim()}
                      className="ml-1 text-green-600 disabled:text-gray-300"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Tags help readers discover your story
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
                  isPublic ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Toggle visibility</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="ml-3">
                <span className="font-medium text-gray-900">
                  {isPublic ? 'Public' : 'Private'}
                </span>
                <p className="text-sm text-gray-500">
                  {isPublic 
                    ? 'Anyone can see this post' 
                    : 'Only you can see this post'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
          >
            {submitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

const CreatePost: React.FC = () => {
  return (
    <PostProvider>
      <CreatePostContent />
    </PostProvider>
  );
};

export default CreatePost;