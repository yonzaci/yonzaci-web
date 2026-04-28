export type PortfolioType = 'video' | 'article';
export type Category = 'Politics' | 'International' | 'Economy' | 'Issues';

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  type: PortfolioType;
  category: Category;
  mediaName: string;
  url: string;
  images: string[];
  createdAt: any;
  isFeatured?: boolean;
}

export interface SiteConfig {
  id?: string;
  tagline: string;
  subTagline: string;
  aboutText: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  servicesHeadline: string;
  servicesSubline: string;
  phone: string;
  email: string;
  kakao: string;
  office?: string;
}
