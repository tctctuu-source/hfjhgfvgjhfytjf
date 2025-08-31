export interface Result {
  id: string;
  created_at: string;
  category: string;
  event: string;
  participant: string;
  school: string;
  position: number;
  year: string;
}

export interface Team {
  id: string;
  created_at: string;
  name: string;
  points: number;
}

export interface NewsItem {
  id: string;
  created_at: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image_url: string;
  is_featured: boolean;
  status: 'published' | 'draft';
  views: number;
}

export interface GalleryItem {
    id: string;
    created_at: string;
    title: string;
    description: string;
    category: string;
    image_url: string;
    photographer: string;
    views: number;
}

export interface ContactMessage {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied';
}

export interface AboutContent {
    id: number;
    section: 'mission' | 'vision' | 'history';
    content: string;
    updated_at: string;
}

export interface TeamMember {
    id: string;
    created_at: string;
    name: string;
    position: string;
    bio: string;
    image_url: string;
}

export interface HomepageBackground {
  id: string;
  created_at: string;
  type: 'image' | 'video';
  url: string;
  is_active: boolean;
}
