export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  id: string;
  nickname: string;
  mascotType: string;
  department: string;
  age: number;
  height: number;
  gender: Gender;
  heart: number;
  keywords: string[];
  idealKeywords: string[];
}

export interface RecommendedUser {
  id: string;
  nickname: string;
  mascotType: string;
  department: string;
  keywords: string[];
  matchScore: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  partner: RecommendedUser;
  lastMessage?: string;
  lastTime?: string;
  unreadCount: number;
}

export type HeartPingStatus = 'sent' | 'received' | 'matched';

export interface HeartPing {
  id: string;
  userId: string;
  targetId: string;
  status: HeartPingStatus;
  timestamp: string;
}
