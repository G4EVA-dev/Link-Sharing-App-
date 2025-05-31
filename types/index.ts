export type Platform = 
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'medium'
  | 'dev.to'
  | 'custom';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  role: 'user' | 'admin';
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    updates: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showAnalytics: boolean;
    allowIndexing: boolean;
  };
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  updates: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  showAnalytics: boolean;
  allowIndexing: boolean;
}

export interface Link {
  id: string;
  userId: string;
  title: string;
  url: string;
  platform: Platform;
  icon?: string;
  order: number;
  clicks: number;
  isActive: boolean;
  schedule?: LinkSchedule;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    thumbnail?: string;
    description?: string;
    tags?: string[];
    customDomain?: string;
  };
}

export interface AuthResponse {
  user: User | null;
  error?: string;
}

export interface LinkResponse {
  data?: Link[];
  error?: string;
}

export interface ServiceResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  sections: PortfolioSection[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    theme?: string;
    layout?: string;
    customDomain?: string;
    seo?: SEOSettings;
  };
}

export interface PortfolioSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'gallery' | 'project';
  title: string;
  content: string;
  order: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface LinkSchedule {
  startDate?: Date;
  endDate?: Date;
  timezone?: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval?: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
  };
}

export interface AnalyticsMetrics {
  page?: string;
  referrer?: Referrer;
  duration?: number;
  scrollDepth?: number;
  eventName?: string;
  eventData?: Record<string, any>;
  clicks?: number;
  uniqueVisitors?: number;
  bounceRate?: number;
  topPages?: string[];
  trafficSources?: string[];
  devices?: string[];
  locations?: Location[];
}

export interface Analytics {
  id: string;
  userId: string;
  type: 'pageview' | 'event' | 'link_click';
  timestamp: Date;
  metrics: AnalyticsMetrics;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface Referrer {
  source: string;
  count: number;
}

export interface Location {
  country: string;
  city: string;
  count: number;
}

export interface FormState {
  values: { [key: string]: any };
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  isSubmitting: boolean;
  isValid: boolean;
}

export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  title: string;
  icon?: string;
  order: number;
  isActive: boolean;
  clicks?: number;
}

export interface LinkProfile {
  id: string;
  userId: string;
  title: string;
  description: string;
  username: string;
  theme: 'light' | 'dark';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  socialLinks: SocialLink[];
  analytics?: {
    views: number;
    clicks: number;
    lastViewed?: Date;
    trafficData?: {
      date: string;
      views: number;
      clicks: number;
    }[];
    platformData?: {
      name: string;
      value: number;
    }[];
    topLinks?: {
      name: string;
      clicks: number;
    }[];
    avgTimeOnPage?: number;
    conversionRate?: number;
    viewsTrend?: number;
    clicksTrend?: number;
    timeTrend?: number;
    conversionTrend?: number;
  };
}

export interface LinkProfileContextType {
  profiles: LinkProfile[];
  currentProfile: LinkProfile | null;
  loading: boolean;
  error: string | null;
  createProfile: (data: Partial<LinkProfile>) => Promise<void>;
  updateProfile: (id: string, data: Partial<LinkProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setCurrentProfile: (profile: LinkProfile) => void;
  addSocialLink: (profileId: string, link: Partial<SocialLink>) => Promise<void>;
  updateSocialLink: (profileId: string, linkId: string, data: Partial<SocialLink>) => Promise<void>;
  deleteSocialLink: (profileId: string, linkId: string) => Promise<void>;
  reorderLinks: (profileId: string, links: SocialLink[]) => Promise<void>;
} 