export type NoteColor = 'white' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export type NotePriority = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  content: string; // HTML or markdown string
  subject: string;
  category: string;
  priority: NotePriority;
  color: NoteColor;
  fontSize: string;
  tags: string[];
  date: string; // ISO date string
  wordCount?: number;
  materialsCount?: number;
}
