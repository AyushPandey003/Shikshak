export interface ContentItem {
  id: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'material';
  title: string;
  duration?: string;
  description?: string;
  source?: string;
  file?: File; // For uploaded files
  fileName?: string; // For display purposes
}

export interface Module {
  id: string;
  title: string;
  description?: string; // New description field
  duration?: string;
  items: ContentItem[];
  isExpanded: boolean;
  learningObjectives?: string[];
}

export interface SidebarRecommendation {
   id: string;
   title: string;
   source: string;
   rating: number;
   reviews: string;
   modules: Module[];
}
