"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LinkProfile } from '@/types';
import { linkProfileService } from '@/services/linkProfileService';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { FiLink, FiClock, FiEye } from 'react-icons/fi';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<LinkProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for:', username);
        const profileData = await linkProfileService.getProfile(username as string);
        console.log('Found profile:', profileData);
        setProfile(profileData);
        
        // Track view only if user is authenticated
        if (user) {
          await linkProfileService.incrementAnalytics(profileData.id, 'views');
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        if (err.code === 'permission-denied') {
          setError('This profile is private or has been removed');
        } else {
          setError('Profile not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, user]);

  const handleLinkClick = async (linkId: string) => {
    if (!profile || !user) return;
    try {
      await linkProfileService.incrementAnalytics(profile.id, 'clicks');
      // Update the link's click count
      const updatedLinks = profile.socialLinks.map(link => 
        link.id === linkId ? { ...link, clicks: (link.clicks || 0) + 1 } : link
      );
      await linkProfileService.updateProfile(profile.id, { socialLinks: updatedLinks });
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">{error || "The profile you're looking for doesn't exist or has been removed."}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{profile.title} | Link Profile</title>
        <meta name="description" content={profile.description} />
        <meta property="og:title" content={profile.title} />
        <meta property="og:description" content={profile.description} />
        {profile.profileImage && <meta property="og:image" content={profile.profileImage} />}
      </Head>

      <div className={`min-h-screen ${profile.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {profile.profileImage && (
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                src={profile.profileImage}
                alt={profile.title}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{profile.title}</h1>
            {profile.description && (
              <p className="text-lg opacity-80">{profile.description}</p>
            )}
          </motion.div>

          <div className="space-y-4">
            {profile.socialLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`block p-4 rounded-lg ${
                  profile.theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-50'
                } shadow-sm transition-colors`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiLink className="text-purple" />
                    <span className="font-medium">{link.title}</span>
                  </div>
                  <FiEye className="text-gray-400" />
                </div>
              </motion.a>
            ))}
          </div>

          {profile.analytics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`mt-8 p-4 rounded-lg ${
                profile.theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-sm`}
            >
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <FiEye />
                  <span>{profile.analytics.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock />
                  <span>Last updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
} 