import React, { useState, useRef, useEffect } from 'react';
import { Note, NotePriority, NoteColor } from '@/types/note';
import { 
  Bold, Italic, Underline, Code, Link as LinkIcon, 
  Quote, List, ListOrdered, Save, X 
} from 'lucide-react';

interface NoteEditorProps {
  initialNote?: Partial<Note>;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

const COLORS: NoteColor[] = ['white', 'yellow', 'green', 'blue', 'pink', 'purple'];
const SUBJECTS = ['Computer Science', 'Mathematics', 'Physics', 'History', 'General'];
const PRIORITIES: NotePriority[] = ['low', 'medium', 'high'];
const FONT_SIZES = ['Small (14px)', 'Medium (16px)', 'Large (18px)'];

export function NoteEditor({ initialNote, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [subject, setSubject] = useState(initialNote?.subject || SUBJECTS[0]);
  const [priority, setPriority] = useState<NotePriority>(initialNote?.priority || 'medium');
  const [color, setColor] = useState<NoteColor>(initialNote?.color || 'white');
  const [fontSize, setFontSize] = useState(initialNote?.fontSize || 'Medium (16px)');
  const [content, setContent] = useState(initialNote?.content || '');
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== content) {
      // Only set initial content to avoid cursor jumps on re-render if we were fully controlled
      // But for this simple implementation, we just set it once or if it changes externally
      if (contentRef.current.innerText.trim() === '') {
        contentRef.current.innerHTML = content;
      }
    }
  }, []);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
        setTags([...tags, formattedTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      ...initialNote,
      title,
      subject,
      priority,
      color,
      fontSize,
      tags,
      content: contentRef.current?.innerHTML || '',
      date: new Date().toISOString(),
      wordCount: contentRef.current?.innerText.split(/\s+/).filter(w => w.length > 0).length || 0
    });
  };

  const colorBgMap: Record<NoteColor, string> = {
    white: 'bg-white',
    yellow: 'bg-yellow-200',
    green: 'bg-emerald-200',
    blue: 'bg-blue-200',
    pink: 'bg-pink-200',
    purple: 'bg-purple-200'
  };

  const editorBgMap: Record<NoteColor, string> = {
    white: 'bg-white',
    yellow: 'bg-yellow-50',
    green: 'bg-emerald-50',
    blue: 'bg-blue-50',
    pink: 'bg-pink-50',
    purple: 'bg-purple-50'
  };

  return (
    <div className="flex flex-col h-full bg-white p-6">
       {/* Actions Header - Inside Modal content usually, but putting here if used standalone */}
       <div className="flex items-center justify-between mb-8">
         <h2 className="text-2xl font-bold text-slate-900">Edit Note</h2>
         <div className="flex items-center gap-2">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save size={18} />
              Save Note
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
         </div>
       </div>

       {/* Meta Controls */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Subject/Category</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Priority</label>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value as NotePriority)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {PRIORITIES.map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Note Color</label>
            <div className="flex items-center gap-2 p-1.5">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${colorBgMap[c]} ${
                    color === c ? 'border-blue-500 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  aria-label={`Select ${c} color`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">Font Size</label>
            <select 
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              {FONT_SIZES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
       </div>

       {/* Title */}
       <div className="mb-6 space-y-2">
         <label className="text-sm font-semibold text-slate-700 block">Title</label>
         <input 
           type="text" 
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           placeholder="Enter note title..."
           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
         />
       </div>

       {/* Editor Area */}
       <div className={`flex-1 flex flex-col rounded-2xl border border-slate-200 overflow-hidden transition-colors duration-300 ${editorBgMap[color]}`}>
         {/* Toolbar */}
         <div className="flex items-center gap-1 p-2 border-b border-slate-200/60 bg-white/50 backdrop-blur-sm">
            <ToolbarBtn icon={<Bold size={18} />} onClick={() => handleFormat('bold')} tooltip="Bold" />
            <ToolbarBtn icon={<Italic size={18} />} onClick={() => handleFormat('italic')} tooltip="Italic" />
            <ToolbarBtn icon={<Underline size={18} />} onClick={() => handleFormat('underline')} tooltip="Underline" />
            <div className="w-px h-5 bg-slate-300 mx-2" />
            <ToolbarBtn icon={<Code size={18} />} onClick={() => handleFormat('formatBlock', 'PRE')} tooltip="Code Block" />
            <ToolbarBtn icon={<LinkIcon size={18} />} onClick={() => {
              const url = prompt('Enter URL:');
              if (url) handleFormat('createLink', url);
            }} tooltip="Link" />
            <ToolbarBtn icon={<Quote size={18} />} onClick={() => handleFormat('formatBlock', 'BLOCKQUOTE')} tooltip="Quote" />
            <div className="w-px h-5 bg-slate-300 mx-2" />
            <ToolbarBtn icon={<List size={18} />} onClick={() => handleFormat('insertUnorderedList')} tooltip="Bullet List" />
            <ToolbarBtn icon={<ListOrdered size={18} />} onClick={() => handleFormat('insertOrderedList')} tooltip="Numbered List" />
            
            <div className="ml-auto text-xs font-medium text-slate-400 px-3">
               {contentRef.current?.innerText.split(/\s+/).filter(w => w.length > 0).length || 0} words
            </div>
         </div>

         {/* Content */}
         <div className="flex-1 p-6 relative">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Content</label>
            <div 
              ref={contentRef}
              contentEditable
              className="outline-none min-h-[200px] text-slate-700 leading-relaxed max-w-none prose prose-sm focus:prose-blue"
              style={{
                fontSize: fontSize.includes('14px') ? '14px' : fontSize.includes('18px') ? '18px' : '16px'
              }}
              onInput={() => {
                  // Force update for word count
                  setContent(contentRef.current?.innerHTML || '');
              }}
            />
         </div>
       </div>


       {/* Tags Input */}
       <div className="mt-4">
         <label className="text-sm font-semibold text-slate-700 block mb-2">Tags</label>
         <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
                 {tag}
                 <button onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                   <X size={14} />
                 </button>
              </span>
            ))}
            <input 
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "Add tags (press Enter)..." : "Add another..."}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm min-w-[120px]"
            />
         </div>
       </div>
    </div>
  );
}

function ToolbarBtn({ icon, onClick, tooltip }: { icon: React.ReactNode, onClick: () => void, tooltip: string }) {
  return (
    <button 
      onClick={onClick}
      title={tooltip}
      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
    >
      {icon}
    </button>
  );
}
