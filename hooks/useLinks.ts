import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { db } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { Link, LinkSchedule } from '@/types';

export const useLinks = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLinks([]);
      setIsLoading(false);
      return;
    }

    const fetchLinks = async () => {
      try {
        const linksQuery = query(
          collection(db, 'links'),
          where('userId', '==', user.id)
        );
        const snapshot = await getDocs(linksQuery);
        const linkList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
          updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
        })) as Link[];

        setLinks(linkList);
      } catch (error) {
        console.error('Error fetching links:', error);
        showToast('error', 'Failed to load links');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, [user, showToast]);

  const createLink = useCallback(async (data: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    try {
      const linkRef = doc(collection(db, 'links'));
      const newLink: Link = {
        id: linkRef.id,
        ...data,
        userId: user.id,
        clicks: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(linkRef, newLink);
      setLinks((prev) => [...prev, newLink]);
      showToast('success', 'Link created successfully');
      return newLink;
    } catch (error) {
      console.error('Error creating link:', error);
      showToast('error', 'Failed to create link');
      return null;
    }
  }, [user, showToast]);

  const updateLink = useCallback(async (linkId: string, data: Partial<Link>) => {
    if (!user) return false;

    try {
      const linkRef = doc(db, 'links', linkId);
      const updatedData = {
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(linkRef, updatedData);
      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId ? { ...l, ...updatedData } : l
        )
      );
      showToast('success', 'Link updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating link:', error);
      showToast('error', 'Failed to update link');
      return false;
    }
  }, [user, showToast]);

  const deleteLink = useCallback(async (linkId: string) => {
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'links', linkId));
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
      showToast('success', 'Link deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      showToast('error', 'Failed to delete link');
      return false;
    }
  }, [user, showToast]);

  const scheduleLink = useCallback(async (linkId: string, schedule: LinkSchedule) => {
    if (!user) return false;

    try {
      const linkRef = doc(db, 'links', linkId);
      await updateDoc(linkRef, {
        schedule,
        updatedAt: new Date(),
      });

      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId
            ? { ...l, schedule, updatedAt: new Date() }
            : l
        )
      );
      showToast('success', 'Link scheduled successfully');
      return true;
    } catch (error) {
      console.error('Error scheduling link:', error);
      showToast('error', 'Failed to schedule link');
      return false;
    }
  }, [user, showToast]);

  const toggleLinkStatus = useCallback(async (linkId: string) => {
    if (!user) return false;

    try {
      const linkRef = doc(db, 'links', linkId);
      const linkDoc = await getDoc(linkRef);
      
      if (!linkDoc.exists()) {
        throw new Error('Link not found');
      }

      const link = linkDoc.data() as Link;
      const newStatus = !link.isActive;

      await updateDoc(linkRef, {
        isActive: newStatus,
        updatedAt: new Date(),
      });

      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId
            ? { ...l, isActive: newStatus, updatedAt: new Date() }
            : l
        )
      );

      showToast(
        'success',
        `Link ${newStatus ? 'activated' : 'deactivated'} successfully`
      );
      return true;
    } catch (error) {
      console.error('Error toggling link status:', error);
      showToast('error', 'Failed to update link status');
      return false;
    }
  }, [user, showToast]);

  const incrementClicks = useCallback(async (linkId: string) => {
    if (!user) return false;

    try {
      const linkRef = doc(db, 'links', linkId);
      const linkDoc = await getDoc(linkRef);
      
      if (!linkDoc.exists()) {
        throw new Error('Link not found');
      }

      const link = linkDoc.data() as Link;
      const newClicks = link.clicks + 1;

      await updateDoc(linkRef, {
        clicks: newClicks,
        updatedAt: new Date(),
      });

      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId
            ? { ...l, clicks: newClicks, updatedAt: new Date() }
            : l
        )
      );

      return true;
    } catch (error) {
      console.error('Error incrementing clicks:', error);
      return false;
    }
  }, [user]);

  return {
    links,
    isLoading,
    createLink,
    updateLink,
    deleteLink,
    scheduleLink,
    toggleLinkStatus,
    incrementClicks,
  };
}; 