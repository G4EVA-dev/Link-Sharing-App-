import { useState, useEffect, useCallback } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from '../types';
import { useToast } from './useToast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            // Create user document if it doesn't exist
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              profileImage: firebaseUser.photoURL || '',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date(),
              settings: {
                theme: 'light' as const,
                notifications: {
                  email: true,
                  push: true,
                  marketing: false,
                  updates: true
                },
                privacy: {
                  profileVisibility: 'public',
                  showAnalytics: true,
                  allowIndexing: true
                }
              }
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          showToast('error', 'Error loading user data');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, showToast]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('success', 'Successfully logged in');
    } catch (error) {
      console.error('Error logging in:', error);
      showToast('error', 'Error logging in');
      throw error;
    }
  }, [auth, showToast]);

  const register = useCallback(async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });
      showToast('success', 'Successfully registered');
    } catch (error) {
      console.error('Error registering:', error);
      showToast('error', 'Error registering');
      throw error;
    }
  }, [auth, showToast]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      showToast('success', 'Successfully logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast('error', 'Error logging out');
      throw error;
    }
  }, [auth, showToast]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToast('success', 'Password reset email sent');
    } catch (error) {
      console.error('Error sending password reset:', error);
      showToast('error', 'Error sending password reset');
      throw error;
    }
  }, [auth, showToast]);

  return {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword
  };
}; 