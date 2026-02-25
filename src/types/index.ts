export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatar?: string;
  imageShape: 'circle' | 'square' | 'portrait';
  imagePosition: number;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    customPlatform?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
