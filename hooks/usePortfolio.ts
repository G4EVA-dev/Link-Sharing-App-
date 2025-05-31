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
import { Portfolio, PortfolioSection } from '@/types';

export const usePortfolio = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [currentPortfolio, setCurrentPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPortfolios([]);
      setCurrentPortfolio(null);
      setIsLoading(false);
      return;
    }

    const fetchPortfolios = async () => {
      try {
        const portfoliosQuery = query(
          collection(db, 'portfolios'),
          where('userId', '==', user.id)
        );
        const snapshot = await getDocs(portfoliosQuery);
        const portfolioList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: (doc.data().createdAt as Timestamp).toDate(),
          updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
        })) as Portfolio[];

        setPortfolios(portfolioList);
        if (portfolioList.length > 0) {
          setCurrentPortfolio(portfolioList[0]);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        showToast('error', 'Failed to load portfolios');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, [user, showToast]);

  const createPortfolio = useCallback(async (data: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return null;

    try {
      const portfolioRef = doc(collection(db, 'portfolios'));
      const newPortfolio: Portfolio = {
        id: portfolioRef.id,
        ...data,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(portfolioRef, newPortfolio);
      setPortfolios((prev) => [...prev, newPortfolio]);
      setCurrentPortfolio(newPortfolio);
      showToast('success', 'Portfolio created successfully');
      return newPortfolio;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      showToast('error', 'Failed to create portfolio');
      return null;
    }
  }, [user, showToast]);

  const updatePortfolio = useCallback(async (portfolioId: string, data: Partial<Portfolio>) => {
    if (!user) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      const updatedData = {
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(portfolioRef, updatedData);
      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId ? { ...p, ...updatedData } : p
        )
      );
      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio((prev) => prev ? { ...prev, ...updatedData } : null);
      }
      showToast('success', 'Portfolio updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      showToast('error', 'Failed to update portfolio');
      return false;
    }
  }, [user, currentPortfolio, showToast]);

  const deletePortfolio = useCallback(async (portfolioId: string) => {
    if (!user) return false;

    try {
      await deleteDoc(doc(db, 'portfolios', portfolioId));
      setPortfolios((prev) => prev.filter((p) => p.id !== portfolioId));
      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio(null);
      }
      showToast('success', 'Portfolio deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      showToast('error', 'Failed to delete portfolio');
      return false;
    }
  }, [user, currentPortfolio, showToast]);

  const addSection = useCallback(async (portfolioId: string, section: PortfolioSection) => {
    if (!user) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      const portfolioDoc = await getDoc(portfolioRef);
      
      if (!portfolioDoc.exists()) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolioDoc.data() as Portfolio;
      const updatedSections = [...portfolio.sections, section];

      await updateDoc(portfolioRef, {
        sections: updatedSections,
        updatedAt: new Date(),
      });

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId
            ? { ...p, sections: updatedSections, updatedAt: new Date() }
            : p
        )
      );

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio((prev) =>
          prev
            ? {
                ...prev,
                sections: updatedSections,
                updatedAt: new Date(),
              }
            : null
        );
      }

      showToast('success', 'Section added successfully');
      return true;
    } catch (error) {
      console.error('Error adding section:', error);
      showToast('error', 'Failed to add section');
      return false;
    }
  }, [user, currentPortfolio, showToast]);

  const updateSection = useCallback(async (
    portfolioId: string,
    sectionId: string,
    data: Partial<PortfolioSection>
  ) => {
    if (!user) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      const portfolioDoc = await getDoc(portfolioRef);
      
      if (!portfolioDoc.exists()) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolioDoc.data() as Portfolio;
      const updatedSections = portfolio.sections.map((section) =>
        section.id === sectionId ? { ...section, ...data } : section
      );

      await updateDoc(portfolioRef, {
        sections: updatedSections,
        updatedAt: new Date(),
      });

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId
            ? { ...p, sections: updatedSections, updatedAt: new Date() }
            : p
        )
      );

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio((prev) =>
          prev
            ? {
                ...prev,
                sections: updatedSections,
                updatedAt: new Date(),
              }
            : null
        );
      }

      showToast('success', 'Section updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      showToast('error', 'Failed to update section');
      return false;
    }
  }, [user, currentPortfolio, showToast]);

  const deleteSection = useCallback(async (portfolioId: string, sectionId: string) => {
    if (!user) return false;

    try {
      const portfolioRef = doc(db, 'portfolios', portfolioId);
      const portfolioDoc = await getDoc(portfolioRef);
      
      if (!portfolioDoc.exists()) {
        throw new Error('Portfolio not found');
      }

      const portfolio = portfolioDoc.data() as Portfolio;
      const updatedSections = portfolio.sections.filter(
        (section) => section.id !== sectionId
      );

      await updateDoc(portfolioRef, {
        sections: updatedSections,
        updatedAt: new Date(),
      });

      setPortfolios((prev) =>
        prev.map((p) =>
          p.id === portfolioId
            ? { ...p, sections: updatedSections, updatedAt: new Date() }
            : p
        )
      );

      if (currentPortfolio?.id === portfolioId) {
        setCurrentPortfolio((prev) =>
          prev
            ? {
                ...prev,
                sections: updatedSections,
                updatedAt: new Date(),
              }
            : null
        );
      }

      showToast('success', 'Section deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      showToast('error', 'Failed to delete section');
      return false;
    }
  }, [user, currentPortfolio, showToast]);

  return {
    portfolios,
    currentPortfolio,
    isLoading,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    addSection,
    updateSection,
    deleteSection,
    setCurrentPortfolio,
  };
}; 