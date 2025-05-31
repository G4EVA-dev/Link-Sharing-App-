"use client";
import { useState, useEffect } from 'react';
import { useLinkProfile } from '@/contexts/LinkProfileContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinkProfile, SocialLink, Platform } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import Toast from '@/components/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiEye, FiLink, FiSettings, FiBarChart2, FiExternalLink, FiX } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useRouter } from 'next/navigation';
import { usernameService } from '@/services/usernameService';
import Image from 'next/image';

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    profiles, 
    currentProfile, 
    loading, 
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    setCurrentProfile,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderLinks
  } = useLinkProfile();
  const router = useRouter();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    title: '',
    description: '',
    theme: 'light' as 'light' | 'dark',
    username: ''
  });
  const [newLinkData, setNewLinkData] = useState({
    platform: '' as Platform,
    url: '',
    title: '',
    isActive: true,
    order: 0
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewProfile, setPreviewProfile] = useState<LinkProfile | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);

  const generateUsernameSuggestions = (base: string): string[] => {
    const suggestions = [];
    const randomNum = Math.floor(Math.random() * 1000);
    suggestions.push(`${base}${randomNum}`);
    suggestions.push(`${base}_${randomNum}`);
    suggestions.push(`${base}-${randomNum}`);
    return suggestions;
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setNewProfileData({ ...newProfileData, username });
    setUsernameError(null);
    setUsernameSuggestions([]);

    if (username) {
      setIsCheckingUsername(true);
      const { available, error } = await usernameService.isUsernameAvailable(username);
      setIsCheckingUsername(false);
      
      if (!available) {
        setUsernameError(error || 'Username is not available');
        // Generate suggestions if username is taken
        setUsernameSuggestions(generateUsernameSuggestions(username));
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewProfileData({ ...newProfileData, username: suggestion });
    setUsernameSuggestions([]);
    setUsernameError(null);
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (usernameError) {
      setToastType('error');
      setToastMessage('Please fix the username error before creating the profile');
      setShowToast(true);
      return;
    }

    try {
      const formattedUsername = newProfileData.username 
        ? usernameService.formatUsername(newProfileData.username)
        : undefined;

      const newProfile = await createProfile({
        ...newProfileData,
        username: formattedUsername,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setToastType('success');
      setToastMessage('Profile created successfully!');
      setShowToast(true);
      setIsCreatingProfile(false);
      setNewProfileData({ title: '', description: '', theme: 'light', username: '' });

      // Redirect to the profile using ID
      router.push(`/profile/${newProfile.id}`);
    } catch (err: any) {
      console.error('Error creating profile:', err);
      setToastType('error');
      setToastMessage(err.message || 'Failed to create profile');
      setShowToast(true);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;

    try {
      const newLink: Partial<SocialLink> = {
        ...newLinkData,
        order: currentProfile.socialLinks?.length || 0
      };
      await addSocialLink(currentProfile.id, newLink);
      setToastType('success');
      setToastMessage('Link added successfully!');
      setShowToast(true);
      setIsAddingLink(false);
      setNewLinkData({
        platform: '' as Platform,
        url: '',
        title: '',
        isActive: true,
        order: 0
      });
    } catch (err: any) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to add link');
      setShowToast(true);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!currentProfile) return;

    try {
      await deleteSocialLink(currentProfile.id, linkId);
      setToastType('success');
      setToastMessage('Link deleted successfully!');
      setShowToast(true);
    } catch (err: any) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to delete link');
      setShowToast(true);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || !currentProfile) return;

    const items = Array.from(currentProfile.socialLinks || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    try {
      await reorderLinks(currentProfile.id, updatedItems);
      setToastType('success');
      setToastMessage('Links reordered successfully!');
      setShowToast(true);
    } catch (err: any) {
      setToastType('error');
      setToastMessage(err.message || 'Failed to reorder links');
      setShowToast(true);
    }
  };

  const handlePreview = (profile: LinkProfile) => {
    setPreviewProfile(profile);
    setIsPreviewing(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard/analytics')}
                className="bg-purple text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FiBarChart2 />
                Analytics
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreatingProfile(true)}
                className="bg-purple text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <FiPlus />
                New Profile
              </motion.button>
            </div>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-600">No profiles yet</h2>
              <p className="text-gray-500 mt-2">Create your first profile to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{profile.title}</h3>
                      <p className="text-sm text-gray-500">{profile.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePreview(profile)}
                        className="text-gray-600 hover:text-purple"
                      >
                        <FiEye />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentProfile(profile)}
                        className="text-gray-600 hover:text-purple"
                      >
                        <FiEdit2 />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(`/profile/${profile.id}`, '_blank')}
                        className="text-gray-600 hover:text-purple"
                      >
                        <FiExternalLink />
                      </motion.button>
                    </div>
                  </div>

                  {currentProfile?.id === profile.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="links">
                          {(provided: any) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-2"
                            >
                              {profile.socialLinks?.map((link, index) => (
                                <Draggable
                                  key={link.id}
                                  draggableId={link.id}
                                  index={index}
                                >
                                  {(provided: any) => (
                                    <motion.div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FiLink className="text-purple" />
                                        <span className="text-sm font-medium">{link.title}</span>
                                      </div>
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <FiTrash2 />
                                      </motion.button>
                                    </motion.div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAddingLink(true)}
                        className="mt-4 w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-200"
                      >
                        <FiPlus />
                        Add Link
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Profile Modal */}
      <AnimatePresence>
        {isCreatingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Create New Profile</h2>
              <form onSubmit={handleCreateProfile}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={newProfileData.username}
                          onChange={handleUsernameChange}
                          className={`mt-1 block w-full rounded-md border-[2px] p-[5px] border-gray-300 shadow-sm focus:border-purple focus:ring-purple ${
                            usernameError ? 'border-red-500' : ''
                          }`}
                          placeholder="your-username"
                          required
                        />
                        {isCheckingUsername && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <LoadingSpinner size="small" />
                          </div>
                        )}
                      </div>
                      {usernameError && (
                        <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                      )}
                      {usernameSuggestions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Try these instead:</p>
                          <div className="flex flex-wrap gap-2">
                            {usernameSuggestions.map((suggestion) => (
                              <motion.button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full"
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        This will be your profile URL: yourdomain.com/{newProfileData.username || 'username'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={newProfileData.title}
                      onChange={(e) => setNewProfileData({ ...newProfileData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-[2px] border-gray-300 shadow-sm focus:border-purple focus:ring-purple p-[5px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newProfileData.description}
                      onChange={(e) => setNewProfileData({ ...newProfileData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-[2px] border-gray-300 shadow-sm focus:border-purple focus:ring-purple p-[5px] "
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Theme</label>
                    <select
                      value={newProfileData.theme}
                      onChange={(e) => setNewProfileData({ ...newProfileData, theme: e.target.value as 'light' | 'dark' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple focus:ring-purple p-[5px] "
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsCreatingProfile(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-purple text-white rounded-md"
                  >
                    Create
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Link Modal */}
      <AnimatePresence>
        {isAddingLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Add New Link</h2>
              <form onSubmit={handleAddLink}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <select
                      value={newLinkData.platform}
                      onChange={(e) => setNewLinkData({ ...newLinkData, platform: e.target.value as Platform })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple focus:ring-purple padding-[5px] "
                      required
                    >
                      <option value="">Select a platform</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="youtube">YouTube</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={newLinkData.title}
                      onChange={(e) => setNewLinkData({ ...newLinkData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-[2px] p-[5px] border-gray-300 shadow-sm focus:border-purple focus:ring-purple"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">URL</label>
                    <input
                      type="url"
                      value={newLinkData.url}
                      onChange={(e) => setNewLinkData({ ...newLinkData, url: e.target.value })}
                      className="mt-1 block w-full rounded-md border-[2px] p-[5px] border-gray-300 shadow-sm focus:border-purple focus:ring-purple"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsAddingLink(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-purple text-white rounded-md"
                  >
                    Add
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewing && previewProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
                previewProfile.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Preview</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPreviewing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="text-center mb-8">
                {previewProfile.profileImage && (
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={previewProfile.profileImage}
                      alt={previewProfile.title}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <h1 className="text-2xl font-bold mb-2">{previewProfile.title}</h1>
                {previewProfile.description && (
                  <p className="text-lg opacity-80">{previewProfile.description}</p>
                )}
              </div>
              <div className="space-y-4">
                {previewProfile.socialLinks.map((link: { id: string; title: string }) => (
                  <div
                    key={link.id}
                    className={`p-4 rounded-lg ${
                      previewProfile.theme === 'dark'
                        ? 'bg-gray-800' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FiLink className="text-purple" />
                      <span className="font-medium">{link.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`/profile/${previewProfile.id}`, '_blank')}
                  className="px-4 py-2 bg-purple text-white rounded-md flex items-center gap-2"
                >
                  <FiExternalLink />
                  View Live Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4"
          >
            <Toast
              message={toastMessage}
              type={toastType}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 