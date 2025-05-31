"use client";
import { useEffect } from 'react';
import { authService } from '@/services/authService';

export default function AuthStateMonitor() {
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      console.log('Auth state changed:', user);
    });

    return () => unsubscribe();
  }, []);

  return null;
} 