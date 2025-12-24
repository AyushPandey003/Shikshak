export interface GuidedStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

export interface ContentItem {
  id: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment' | 'material';
  title: string;
  duration?: string;
  description?: string;
  source?: string;
  file?: File; // For uploaded files
  fileName?: string; // For display purposes
  azureId?: string; // Azure Blob ID
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

export interface CreationSidebarProps {
  onBack: () => void;
  guidedSteps: GuidedStep[];
  recommendations: SidebarRecommendation[];
  onAddRecommendation: (recId: string) => void;
  className?: string; // For adding custom classes
  onClose?: () => void; // For closing the sidebar (mobile)
  courseTitle?: string;
}

export interface SidebarRecommendation {
  id: string;
  title: string;
  source: string;
  rating: number;
  reviews: string;
  modules: Module[];
}
