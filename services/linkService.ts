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
  writeBatch
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Link, ApiResponse, ServiceResponse } from '@/types';

class LinkService {
  async getUserLinks(userId: string): Promise<ServiceResponse<Link[]>> {
    try {
      const linksRef = collection(db, 'links');
      const q = query(
        linksRef,
        where('userId', '==', userId),
        orderBy('order', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const links: Link[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        links.push({
          id: doc.id,
          platform: data.platform,
          url: data.url,
          userId: data.userId,
          order: data.order,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        });
      });

      return { data: links };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async createLink(link: Omit<Link, 'id'>): Promise<ApiResponse<Link>> {
    try {
      const linksRef = collection(db, 'links');
      const docRef = await addDoc(linksRef, {
        ...link,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return { 
        data: { 
          ...link, 
          id: docRef.id 
        }, 
        loading: false 
      };
    } catch (error: any) {
      return { 
        error: error.message, 
        loading: false 
      };
    }
  }

  async updateLink(id: string, link: Partial<Link>): Promise<ApiResponse<Link>> {
    try {
      const linkRef = doc(db, 'links', id);
      await updateDoc(linkRef, {
        ...link,
        updatedAt: new Date()
      });

      return { 
        data: { 
          ...link, 
          id 
        } as Link, 
        loading: false 
      };
    } catch (error: any) {
      return { 
        error: error.message, 
        loading: false 
      };
    }
  }

  async deleteLink(id: string): Promise<ApiResponse<void>> {
    try {
      const linkRef = doc(db, 'links', id);
      await deleteDoc(linkRef);
      return { loading: false };
    } catch (error: any) {
      return { 
        error: error.message, 
        loading: false 
      };
    }
  }

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
  }

  async removeLink(userId: string, linkId: string): Promise<ServiceResponse<void>> {
    try {
      const linkRef = doc(db, "links", linkId);
      await deleteDoc(linkRef);
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  }
}

export const linkService = new LinkService(); 