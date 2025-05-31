import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { db } from '@/firebase';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
        })) as Notification[];

        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n) => !n.read).length);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        showToast('error', 'Failed to load notifications');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, showToast]);

  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      // Implement mark as read logic here
      // Example: await notificationsService.markAsRead(user.id, notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast('error', 'Failed to mark notification as read');
    }
  }, [user, showToast]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      // Implement mark all as read logic here
      // Example: await notificationsService.markAllAsRead(user.id);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showToast('error', 'Failed to mark all notifications as read');
    }
  }, [user, showToast]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return;

    try {
      // Implement delete notification logic here
      // Example: await notificationsService.deleteNotification(user.id, notificationId);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast('error', 'Failed to delete notification');
    }
  }, [user, showToast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}; 