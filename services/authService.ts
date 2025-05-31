import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '@/firebase';
import { AuthResponse, User, Theme } from '@/types';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const defaultUserSettings = {
  theme: 'system' as Theme,
  notifications: {
    email: true,
    push: true,
    marketing: false,
    updates: true
  },
  privacy: {
    profileVisibility: 'public' as const,
    showAnalytics: true,
    allowIndexing: true
  }
};

class AuthService {
  async signUp(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newUser: User = {
        id: user.uid,
        email: user.email!,
        firstName,
        lastName,
        profileImage: user.photoURL || '',
        role: 'user',
        settings: defaultUserSettings,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), newUser);
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      return { user: newUser };
    } catch (error: any) {
      return { 
        user: null, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data() as User;
      return { user: userData };
    } catch (error: any) {
      return { 
        user: null, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  getCurrentUser(): User | null {
    const user = auth.currentUser;
    if (!user) return null;

    return {
      id: user.uid,
      email: user.email || '',
      firstName: user.displayName?.split(' ')[0] || '',
      lastName: user.displayName?.split(' ')[1] || '',
      profileImage: user.photoURL || '',
      role: 'user',
      settings: defaultUserSettings,
      createdAt: new Date(user.metadata.creationTime || ''),
      updatedAt: new Date(user.metadata.lastSignInTime || ''),
    };
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    return this.signUp(email, password, firstName, lastName);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.signIn(email, password);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as User);
        } else {
          // If user document doesn't exist, create a default user
          const appUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ')[1] || '',
            profileImage: firebaseUser.photoURL || '',
            role: 'user',
            settings: defaultUserSettings,
            createdAt: new Date(firebaseUser.metadata.creationTime || ''),
            updatedAt: new Date(firebaseUser.metadata.lastSignInTime || ''),
          };
          callback(appUser);
        }
      } else {
        callback(null);
      }
    });
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please use a different email or sign in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const currentUser = userDoc.data() as User;
    const updatedUser: User = {
      ...currentUser,
      ...data,
      updatedAt: new Date()
    };

    // Convert User object to plain object for Firestore
    const userData = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString()
    };

    await updateDoc(userRef, userData);
    return updatedUser;
  }
}

export const authService = new AuthService(); 