import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  setDoc,
  writeBatch,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Link, ApiResponse, ServiceResponse } from '@/types';

export const linkService = {
  async getUserLinks(userId: string): Promise<ApiResponse<Link[]>> {
    try {
      const linksQuery = query(
        collection(db, 'links'),
        where('userId', '==', userId),
        orderBy('order', 'asc')
      );
      
      const snapshot = await getDocs(linksQuery);
      const links = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        title: doc.data().title || '',
        clicks: doc.data().clicks || 0,
        isActive: doc.data().isActive ?? true,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Link[];

      return { success: true, data: links };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async getLink(id: string): Promise<ApiResponse<Link>> {
    try {
      const docRef = doc(db, 'links', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return { success: false, error: 'Link not found' };
      }

      const linkData = {
        id: docSnap.id,
        ...docSnap.data(),
        title: docSnap.data().title || '',
        clicks: docSnap.data().clicks || 0,
        isActive: docSnap.data().isActive ?? true,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: docSnap.data().updatedAt?.toDate() || new Date()
      } as Link;

      return { success: true, data: linkData };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async createLink(link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Link>> {
    try {
      const newLink = {
        ...link,
        clicks: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'links'), newLink);
      const createdLink = {
        id: docRef.id,
        ...newLink,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Link;

      return { success: true, data: createdLink };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async updateLink(id: string, updates: Partial<Link>): Promise<ApiResponse<Link>> {
    try {
      const linkRef = doc(db, 'links', id);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(linkRef, updateData);
      const updatedLink = await this.getLink(id);
      
      return updatedLink;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async deleteLink(id: string): Promise<ApiResponse<void>> {
    try {
      await deleteDoc(doc(db, 'links', id));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async reorderLinks(userId: string, linkIds: string[]): Promise<ApiResponse<void>> {
    try {
      const batch = writeBatch(db);
      
      linkIds.forEach((id, index) => {
        const linkRef = doc(db, 'links', id);
        batch.update(linkRef, { 
          order: index,
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async saveLinks(userId: string, links: Link[]): Promise<ServiceResponse<void>> {
    try {
      const batch = writeBatch(db);
      const linksRef = collection(db, "links");

      // Delete existing links
      const existingLinksQuery = query(linksRef, where("userId", "==", userId));
      const existingLinksSnapshot = await getDocs(existingLinksQuery);
      existingLinksSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Add new links
      links.forEach((link) => {
        const newLinkRef = doc(linksRef);
        batch.set(newLinkRef, {
          ...link,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await batch.commit();
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  },

  async removeLink(userId: string, linkId: string): Promise<ServiceResponse<void>> {
    try {
      const linkRef = doc(db, "links", linkId);
      await deleteDoc(linkRef);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }
}; 