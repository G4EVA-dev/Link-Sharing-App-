"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { User } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { Team, TeamMember, ApiResponse } from '@/types';
import { useToast } from '@/hooks/useToast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  teams: Team[];
  signIn: (email: string, password: string) => Promise<ApiResponse<User>>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<ApiResponse<User>>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<ApiResponse<void>>;
  updateUserProfile: (data: Partial<User>) => Promise<ApiResponse<User>>;
  createTeam: (name: string, description?: string) => Promise<ApiResponse<Team>>;
  joinTeam: (teamId: string) => Promise<ApiResponse<Team>>;
  leaveTeam: (teamId: string) => Promise<ApiResponse<void>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            
            // Fetch user's teams
            const teamsQuery = query(
              collection(db, 'teams'),
              where('members', 'array-contains', { userId: firebaseUser.uid })
            );
            const teamsSnapshot = await getDocs(teamsQuery);
            const userTeams = teamsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Team[];
            setTeams(userTeams);
          }
        } else {
          setUser(null);
          setTeams([]);
        }
      } catch (err: any) {
        setError(err.message);
        showToast('error', 'Error loading user data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data() as User;
      setUser(userData);
      return { success: true, data: userData };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<ApiResponse<User>> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          theme: 'system',
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

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });

      setUser(newUser);
      return { success: true, data: newUser };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await auth.signOut();
      setUser(null);
      setTeams([]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (email: string): Promise<ApiResponse<void>> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateUserProfile = async (data: Partial<User>): Promise<ApiResponse<User>> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const updatedUser = { ...user, ...data, updatedAt: new Date() };
      await updateDoc(doc(db, 'users', user.id), updatedUser);
      setUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const createTeam = async (name: string, description?: string): Promise<ApiResponse<Team>> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const newTeam: Team = {
        id: '', // Will be set by Firestore
        name,
        description,
        ownerId: user.id,
        members: [{
          userId: user.id,
          role: 'owner',
          joinedAt: new Date()
        }],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const teamRef = doc(collection(db, 'teams'));
      newTeam.id = teamRef.id;
      await setDoc(teamRef, newTeam);
      
      setTeams([...teams, newTeam]);
      return { success: true, data: newTeam };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const joinTeam = async (teamId: string): Promise<ApiResponse<Team>> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const team = teamDoc.data() as Team;
      const newMember: TeamMember = {
        userId: user.id,
        role: 'member',
        joinedAt: new Date()
      };

      team.members.push(newMember);
      await updateDoc(teamRef, { members: team.members });
      
      setTeams([...teams, team]);
      return { success: true, data: team };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const leaveTeam = async (teamId: string): Promise<ApiResponse<void>> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const team = teamDoc.data() as Team;
      team.members = team.members.filter(member => member.userId !== user.id);
      
      if (team.members.length === 0) {
        // Delete team if no members left
        await deleteDoc(teamRef);
      } else {
        await updateDoc(teamRef, { members: team.members });
      }
      
      setTeams(teams.filter(t => t.id !== teamId));
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        teams,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateUserProfile,
        createTeam,
        joinTeam,
        leaveTeam
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 