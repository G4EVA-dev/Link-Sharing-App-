import { LinkProfile, SocialLink, Platform } from '@/types';
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';

class LinkProfileService {
  private readonly collectionName = 'linkProfiles';

  async getUserProfiles(userId: string): Promise<LinkProfile[]> {
    try {
      const q = query(collection(db, this.collectionName), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkProfile));
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  async createProfile(userId: string, data: Partial<LinkProfile>): Promise<LinkProfile> {
    try {
      const profileRef = doc(collection(db, this.collectionName));
      const newProfile: LinkProfile = {
        id: profileRef.id,
        userId,
        title: data.title || 'My Links',
        description: data.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        profileImage: data.profileImage || '',
        theme: data.theme || 'light',
        socialLinks: data.socialLinks || [],
        isActive: true,
        username: data.username?.toLowerCase().trim() || '',
        analytics: {
          views: 0,
          clicks: 0
        }
      };

      console.log('Creating profile with data:', newProfile);
      await setDoc(profileRef, newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  async updateProfile(profileId: string, updates: Partial<LinkProfile>): Promise<LinkProfile> {
    const profileRef = doc(db, this.collectionName, profileId);
    await updateDoc(profileRef, updates);
    const updatedDoc = await getDoc(profileRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as LinkProfile;
  }

  async deleteProfile(profileId: string): Promise<void> {
    const profileRef = doc(db, this.collectionName, profileId);
    await deleteDoc(profileRef);
  }

  async addSocialLink(profileId: string, linkData: Omit<SocialLink, 'id'>): Promise<SocialLink> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      ...linkData
    };

    const updatedLinks = [...profile.socialLinks, newLink];
    await updateDoc(profileRef, { socialLinks: updatedLinks });
    return newLink;
  }

  async updateSocialLink(profileId: string, linkId: string, updates: Partial<SocialLink>): Promise<SocialLink> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    const updatedLinks = profile.socialLinks.map(link => 
      link.id === linkId ? { ...link, ...updates } : link
    );

    await updateDoc(profileRef, { socialLinks: updatedLinks });
    return updatedLinks.find(link => link.id === linkId)!;
  }

  async deleteSocialLink(profileId: string, linkId: string): Promise<void> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    const updatedLinks = profile.socialLinks.filter(link => link.id !== linkId);
    await updateDoc(profileRef, { socialLinks: updatedLinks });
  }

  async reorderSocialLinks(profileId: string, linkIds: string[]): Promise<SocialLink[]> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    const updatedLinks = linkIds.map((id, index) => {
      const link = profile.socialLinks.find(l => l.id === id)!;
      return { ...link, order: index };
    });

    await updateDoc(profileRef, { socialLinks: updatedLinks });
    return updatedLinks;
  }

  async incrementAnalytics(profileId: string, type: 'views' | 'clicks'): Promise<void> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    const analytics = profile.analytics || {
      views: 0,
      clicks: 0,
      trafficData: [],
      platformData: [],
      topLinks: [],
      avgTimeOnPage: 0,
      conversionRate: 0,
      viewsTrend: 0,
      clicksTrend: 0,
      timeTrend: 0,
      conversionTrend: 0
    };

    // Update basic metrics
    analytics[type] = (analytics[type] || 0) + 1;
    analytics.lastViewed = new Date();

    // Update traffic data
    const today = new Date().toLocaleDateString();
    const existingData = analytics.trafficData?.find(d => d.date === today);
    if (existingData) {
      existingData[type]++;
    } else {
      analytics.trafficData = [
        ...(analytics.trafficData || []),
        { date: today, views: type === 'views' ? 1 : 0, clicks: type === 'clicks' ? 1 : 0 }
      ];
    }

    // Update platform data if it's a click
    if (type === 'clicks') {
      // In a real app, you would determine the platform from the referrer
      const platform = 'Twitter'; // Mock platform
      const platformData = analytics.platformData || [];
      const existingPlatform = platformData.find(p => p.name === platform);
      if (existingPlatform) {
        existingPlatform.value++;
      } else {
        platformData.push({ name: platform, value: 1 });
      }
      analytics.platformData = platformData;
    }

    // Update top links
    if (type === 'clicks') {
      // In a real app, you would determine which link was clicked
      const linkName = 'Portfolio'; // Mock link name
      const topLinks = analytics.topLinks || [];
      const existingLink = topLinks.find(l => l.name === linkName);
      if (existingLink) {
        existingLink.clicks++;
      } else {
        topLinks.push({ name: linkName, clicks: 1 });
      }
      analytics.topLinks = topLinks.sort((a, b) => b.clicks - a.clicks).slice(0, 5);
    }

    // Calculate trends (mock data for now)
    analytics.viewsTrend = Math.floor(Math.random() * 20) - 5;
    analytics.clicksTrend = Math.floor(Math.random() * 20) - 5;
    analytics.timeTrend = Math.floor(Math.random() * 20) - 5;
    analytics.conversionTrend = Math.floor(Math.random() * 20) - 5;

    // Calculate average time on page (mock data for now)
    analytics.avgTimeOnPage = Math.floor(Math.random() * 60) + 30;

    // Calculate conversion rate
    if (analytics.views > 0) {
      analytics.conversionRate = Math.round((analytics.clicks / analytics.views) * 100);
    }

    await updateDoc(profileRef, { analytics });
  }

  async getAnalytics(profileId: string): Promise<LinkProfile['analytics']> {
    const profileRef = doc(db, this.collectionName, profileId);
    const profileDoc = await getDoc(profileRef);
    const profile = profileDoc.data() as LinkProfile;
    
    return profile.analytics || {
      views: 0,
      clicks: 0,
      trafficData: [],
      platformData: [],
      topLinks: [],
      avgTimeOnPage: 0,
      conversionRate: 0,
      viewsTrend: 0,
      clicksTrend: 0,
      timeTrend: 0,
      conversionTrend: 0
    };
  }

  async getProfile(profileId: string): Promise<LinkProfile> {
    try {
      const profileRef = doc(db, this.collectionName, profileId);
      const profileDoc = await getDoc(profileRef);
      
      if (!profileDoc.exists()) {
        throw new Error('Profile not found');
      }

      return { id: profileDoc.id, ...profileDoc.data() } as LinkProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  async getProfileByUsername(username: string): Promise<LinkProfile> {
    try {
      const formattedUsername = username.toLowerCase().trim();
      console.log('Searching for username:', formattedUsername);

      const q = query(
        collection(db, this.collectionName),
        where('username', '==', formattedUsername)
      );
      const querySnapshot = await getDocs(q);
      
      console.log('Query results:', querySnapshot.docs.map(doc => doc.data()));
      
      if (querySnapshot.empty) {
        throw new Error('Profile not found');
      }

      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as LinkProfile;
    } catch (error) {
      console.error('Error fetching profile by username:', error);
      throw error;
    }
  }
}

export const linkProfileService = new LinkProfileService(); 