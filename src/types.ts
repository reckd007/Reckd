export type ToolCategoryId =
  | 'finance'
  | 'calculators'
  | 'conversion'
  | 'security'
  | 'text'
  | 'developer'
  | 'media'
  | 'links'
  | 'privacy'
  | 'webmaster'
  | 'generators'
  | 'ai'
  | 'torrent';

export interface ToolCategory {
  id: ToolCategoryId;
  title: string;
  name?: string;
  emoji?: string;
  description: string;
  iconName: string;
  count: number;
  tools?: ToolItem[];
}

export interface ToolItem {
  id: string;
  title: string;
  name?: string;
  emoji?: string;
  categoryId: ToolCategoryId;
  category?: ToolCategoryId;
  description: string;
  badge?: string;
  iconName: string;
  isFeatured?: boolean;
  tags?: string[];
}

export type ThemeMode = 'dark' | 'light';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
