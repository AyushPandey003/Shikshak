import { Note } from "@/types/note";
import { FileText } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onClick?: (note: Note) => void;
}

const colorMap: Record<string, string> = {
  white: "bg-white border-zinc-200",
  yellow: "bg-yellow-50 border-yellow-200",
  green: "bg-emerald-50 border-emerald-200",
  blue: "bg-blue-50 border-blue-200",
  purple: "bg-purple-50 border-purple-200",
  pink: "bg-pink-50 border-pink-200",
};

const badgeColorMap: Record<string, string> = {
  white: "bg-zinc-100 text-zinc-600",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-emerald-100 text-emerald-700",
  blue: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
  pink: "bg-pink-100 text-pink-700",
};

export function NoteCard({ note, onClick }: NoteCardProps) {
  const themeClasses = colorMap[note.color] || colorMap.white;
  const badgeTheme = badgeColorMap[note.color] || badgeColorMap.white;

  return (
    <div 
      onClick={() => onClick?.(note)}
      className={`rounded-2xl p-5 border cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between h-full min-h-[220px] ${themeClasses}`}
    >
      <div>
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-800 leading-tight mb-1">{note.title}</h3>
          <p className="text-zinc-500 text-sm font-medium">{new Date(note.date).toLocaleDateString()}</p>
        </div>

        <div className="text-zinc-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {/* Strip HTML if content is HTML, simpler here just assuming text for preview or stripping logic needed */}
          {note.content.replace(/<[^>]*>?/gm, '')}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
           {/* Subject Badge */}
           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeTheme}`}>
              {note.subject}
           </span>
           {/* Tags */}
           {note.tags.map(tag => (
             <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-zinc-500 border border-black/5">
                {tag.startsWith('#') ? tag : `#${tag}`}
             </span>
           ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
          <span>{note.wordCount || 0} words</span>
          {note.materialsCount !== undefined && note.materialsCount > 0 && (
             <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
               <FileText size={12} />
               {note.materialsCount} materials
             </span>
          )}
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
          note.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' :
          note.priority === 'medium' ? 'bg-green-50 text-green-600 border-green-200' :
          'bg-zinc-50 text-zinc-600 border-zinc-200'
        }`}>
           {note.priority}
        </div>
      </div>
    </div>
  );
}
