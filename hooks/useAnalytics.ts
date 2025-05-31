import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { Analytics, AnalyticsMetrics, Referrer, Location } from '../types';

export const useAnalytics = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAnalytics([]);
      setIsLoading(false);
      return;
    }

    const analyticsRef = collection(db, 'analytics');
    const q = query(
      analyticsRef,
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const analyticsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Analytics[];
        setAnalytics(analyticsData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching analytics:', error);
        showToast('error', 'Error fetching analytics data');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, showToast]);

  const trackPageView = useCallback(async (page: string, referrer?: Referrer) => {
    if (!user) return;

    try {
      const analyticsData: Omit<Analytics, 'id'> = {
        userId: user.id,
        type: 'pageview',
        timestamp: new Date(),
        metrics: {
          page,
          referrer,
          duration: 0,
          scrollDepth: 0
        }
      };

      await addDoc(collection(db, 'analytics'), analyticsData);
    } catch (error) {
      console.error('Error tracking page view:', error);
      showToast('error', 'Error tracking page view');
    }
  }, [user, showToast]);

  const trackEvent = useCallback(async (
    eventName: string,
    eventData: Record<string, any>
  ) => {
    if (!user) return;

    try {
      const analyticsData: Omit<Analytics, 'id'> = {
        userId: user.id,
        type: 'event',
        timestamp: new Date(),
        metrics: {
          eventName,
          eventData
        }
      };

      await addDoc(collection(db, 'analytics'), analyticsData);
    } catch (error) {
      console.error('Error tracking event:', error);
      showToast('error', 'Error tracking event');
    }
  }, [user, showToast]);

  const updateMetrics = useCallback(async (
    analyticsId: string,
    metrics: Partial<AnalyticsMetrics>
  ) => {
    try {
      const analyticsRef = doc(db, 'analytics', analyticsId);
      await updateDoc(analyticsRef, {
        metrics: {
          ...metrics
        }
      });
    } catch (error) {
      console.error('Error updating metrics:', error);
      showToast('error', 'Error updating metrics');
    }
  }, [showToast]);

  const getAnalyticsByDateRange = useCallback((
    startDate: Date,
    endDate: Date
  ) => {
    return analytics.filter(
      item => item.timestamp >= startDate && item.timestamp <= endDate
    );
  }, [analytics]);

  const getAnalyticsByType = useCallback((
    type: 'pageview' | 'event' | 'link_click'
  ) => {
    return analytics.filter(item => item.type === type);
  }, [analytics]);

  return {
    analytics,
    isLoading,
    trackPageView,
    trackEvent,
    updateMetrics,
    getAnalyticsByDateRange,
    getAnalyticsByType
  };
}; 