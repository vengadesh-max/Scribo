import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { X, Plus, Upload, Twitter, Linkedin, Github, Facebook, Instagram } from 'lucide-react';

const EditProfile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    socialLinks: {
      twitter: currentUser?.socialLinks?.twitter || '',
      linkedin: currentUser?.socialLinks?.linkedin || '',
      github: currentUser?.socialLinks?.github || '',
      facebook: currentUser?.socialLinks?.facebook || '',
      instagram: currentUser?.socialLinks?.instagram || '',
    }
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.profileImage || null);
  const [saving, setSaving] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateUser({
        name: formData.name,
        bio: formData.bio,
        profileImage: profileImage,
        socialLinks: formData.socialLinks
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-xl font-semibold">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-5 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Upload size={16} className="mr-2" />
                  {profileImage ? 'Change' : 'Upload'}
                </button>
                
                {profileImage && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="inline-flex items-center ml-3 px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    <X size={16} className="mr-2" />
                    Remove
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-gray-500">JPG, PNG or GIF, max 2MB</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              placeholder="Tell us about yourself"
            />
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Social Links</h2>
          <p className="text-sm text-gray-500 mb-4">Connect your social media accounts to your profile</p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 text-gray-500 mr-2">
                <Twitter size={20} />
              </div>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="Twitter URL"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 text-gray-500 mr-2">
                <Linkedin size={20} />
              </div>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="LinkedIn URL"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 text-gray-500 mr-2">
                <Github size={20} />
              </div>
              <input
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                placeholder="GitHub URL"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 text-gray-500 mr-2">
                <Facebook size={20} />
              </div>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                placeholder="Facebook URL"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 text-gray-500 mr-2">
                <Instagram size={20} />
              </div>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="Instagram URL"
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;