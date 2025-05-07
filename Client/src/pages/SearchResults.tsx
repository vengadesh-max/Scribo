import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { usePost, PostProvider } from '../contexts/PostContext';
import PostCard from '../components/post/PostCard';
import { Search, PenSquare } from 'lucide-react';

const SearchResultsContent: React.FC = () => {
  const location = useLocation();
  const { searchPosts } = usePost();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchPosts>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery.trim()) {
      setLoading(true);
      // Simulate loading state for better UX
      setTimeout(() => {
        setResults(searchPosts(searchQuery));
        setLoading(false);
      }, 300);
    } else {
      setResults([]);
    }
  }, [location.search, searchPosts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      const newUrl = `/search?q=${encodeURIComponent(query)}`;
      window.history.pushState({}, '', newUrl);
      
      setLoading(true);
      // Simulate loading state for better UX
      setTimeout(() => {
        setResults(searchPosts(query));
        setLoading(false);
      }, 300);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-3xl">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search posts and hashtags..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-r-md font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Display search info */}
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? (
              'Searching...'
            ) : (
              `${results.length} ${results.length === 1 ? 'result' : 'results'} for "${query}"`
            )}
          </h2>
        </div>
      )}
      
      {/* Display results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-6">
            We couldn't find any posts matching your search.
          </p>
          <Link 
            to="/create" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <PenSquare size={18} className="mr-2" />
            Write about this topic
          </Link>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a search term</h3>
          <p className="text-gray-500">
            Search for posts by title, content, or hashtags.
          </p>
        </div>
      )}
    </div>
  );
};

const SearchResults: React.FC = () => {
  return (
    <PostProvider>
      <SearchResultsContent />
    </PostProvider>
  );
};

export default SearchResults;