"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { LinkProfile, SocialLink } from '@/types';
import { linkProfileService } from '@/services/linkProfileService';
import { useAuth } from './AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface LinkProfileContextType {
  profiles: LinkProfile[];
  currentProfile: LinkProfile | null;
  loading: boolean;
  error: string | null;
  createProfile: (data: Partial<LinkProfile>) => Promise<LinkProfile>;
  updateProfile: (id: string, data: Partial<LinkProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setCurrentProfile: (profile: LinkProfile) => void;
  addSocialLink: (profileId: string, link: Partial<SocialLink>) => Promise<void>;
  updateSocialLink: (profileId: string, linkId: string, data: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (profileId: string, linkId: string) => Promise<void>;
  reorderLinks: (profileId: string, links: SocialLink[]) => Promise<void>;
}

const LinkProfileContext = createContext<LinkProfileContextType | undefined>(undefined);

export function LinkProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<LinkProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<LinkProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfiles();
    } else {
      setProfiles([]);
      setCurrentProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadProfiles = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userProfiles = await linkProfileService.getUserProfiles(user.id);
      setProfiles(userProfiles);
      if (userProfiles.length > 0) {
        setCurrentProfile(userProfiles[0]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: Partial<LinkProfile>): Promise<LinkProfile> => {
    try {
      if (!user) throw new Error('User must be logged in to create a profile');
      const newProfile = await linkProfileService.createProfile(user.id, data);
      setProfiles(prev => [...prev, newProfile]);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (id: string, data: Partial<LinkProfile>) => {
    try {
      const updatedProfile = await linkProfileService.updateProfile(id, data);
      setProfiles(prev => prev.map(p => p.id === id ? updatedProfile : p));
      if (currentProfile?.id === id) {
        setCurrentProfile(updatedProfile);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      await linkProfileService.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (currentProfile?.id === id) {
        setCurrentProfile(profiles.find(p => p.id !== id) || null);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const addSocialLink = async (profileId: string, link: Partial<SocialLink>) => {
    try {
      const profileRef = doc(db, 'linkProfiles', profileId);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found');
      }

      const profile = profileDoc.data() as LinkProfile;
      const newLink: SocialLink = {
        id: crypto.randomUUID(),
        ...link,
        createdAt: new Date(),
        updatedAt: new Date()
      } as SocialLink;

      const updatedLinks = [...(profile.socialLinks || []), newLink];
      
      await updateDoc(profileRef, {
        socialLinks: updatedLinks,
        updatedAt: new Date()
      });

      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId
            ? { ...p, socialLinks: updatedLinks, updatedAt: new Date() }
            : p
        )
      );
    } catch (error) {
      console.error('Error adding social link:', error);
      throw error;
    }
  };

  const updateSocialLink = async (profileId: string, linkId: string, data: Partial<SocialLink>) => {
    try {
      const profileRef = doc(db, 'linkProfiles', profileId);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found');
      }

      const profile = profileDoc.data() as LinkProfile;
      const updatedLinks = profile.socialLinks.map(link =>
        link.id === linkId
          ? { ...link, ...data, updatedAt: new Date() }
          : link
      );

      await updateDoc(profileRef, {
        socialLinks: updatedLinks,
        updatedAt: new Date()
      });

      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId
            ? { ...p, socialLinks: updatedLinks, updatedAt: new Date() }
            : p
        )
      );
    } catch (error) {
      console.error('Error updating social link:', error);
      throw error;
    }
  };

  const deleteSocialLink = async (profileId: string, linkId: string) => {
    try {
      const profileRef = doc(db, 'linkProfiles', profileId);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found');
      }

      const profile = profileDoc.data() as LinkProfile;
      const updatedLinks = profile.socialLinks.filter(link => link.id !== linkId);

      await updateDoc(profileRef, {
        socialLinks: updatedLinks,
        updatedAt: new Date()
      });

      setProfiles(prevProfiles =>
        prevProfiles.map(p =>
          p.id === profileId
            ? { ...p, socialLinks: updatedLinks, updatedAt: new Date() }
            : p
        )
      );
    } catch (error) {
      console.error('Error deleting social link:', error);
      throw error;
    }
  };

  const reorderLinks = async (profileId: string, links: SocialLink[]) => {
    try {
      const profileRef = doc(db, 'linkProfiles', profileId);
      await updateDoc(profileRef, {
        socialLinks: links,
        updatedAt: new Date()
      });
      
      // Update local state
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, socialLinks: links, updatedAt: new Date() }
            : profile
        )
      );
    } catch (error) {
      console.error('Error reordering links:', error);
      throw error;
    }
  };

  const value = {
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
  };

  return (
    <LinkProfileContext.Provider value={value}>
      {children}
    </LinkProfileContext.Provider>
  );
}

export function useLinkProfile() {
  const context = useContext(LinkProfileContext);
  if (context === undefined) {
    throw new Error('useLinkProfile must be used within a LinkProfileProvider');
  }
  return context;
} 