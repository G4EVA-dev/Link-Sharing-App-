import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

class UsernameService {
  private readonly collectionName = 'linkProfiles';

  // Username validation rules
  private readonly usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;

  validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username) {
      return { isValid: false, error: 'Username is required' };
    }

    if (!this.usernameRegex.test(username)) {
      return {
        isValid: false,
        error: 'Username must be 3-30 characters long and can only contain letters, numbers, underscores, and hyphens'
      };
    }

    return { isValid: true };
  }

  async isUsernameAvailable(username: string): Promise<{ available: boolean; error?: string }> {
    try {
      const validation = this.validateUsername(username);
      if (!validation.isValid) {
        return { available: false, error: validation.error };
      }

      const q = query(
        collection(db, this.collectionName),
        where('username', '==', username.toLowerCase())
      );
      const querySnapshot = await getDocs(q);

      return { available: querySnapshot.empty };
    } catch (error) {
      console.error('Error checking username availability:', error);
      return { available: false, error: 'Error checking username availability' };
    }
  }

  formatUsername(username: string): string {
    return username.toLowerCase().trim();
  }
}

export const usernameService = new UsernameService(); 