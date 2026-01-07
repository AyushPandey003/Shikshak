import React from 'react';
import { FileText, Download } from 'lucide-react';

interface PdfViewerProps {
    url: string;
    title?: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, title }) => {
    return (
        <div className="w-full h-full bg-white flex flex-col rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 ring-1 ring-slate-100">
            {/* Toolbar / Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3 text-slate-700">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-semibold text-sm text-slate-800 block">{title || "PDF Document"}</span>
                        <span className="text-xs text-slate-500">Read Mode</span>
                    </div>
                </div>
                <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#FF6B6B] hover:bg-[#ff5252] rounded-lg transition-all shadow-sm shadow-[#ffbaba]"
                >
                    <Download className="w-4 h-4" />
                    Download
                </a>
            </div>

            {/* Content info message if needed, or just the iframe */}
            <iframe
                src={`${url}#toolbar=0`}
                className="w-full h-[800px] bg-white border-none"
                title={title || "PDF Viewer"}
            />
        </div>
    );
};

export default PdfViewer;
