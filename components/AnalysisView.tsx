
import React from 'react';
import { Globe } from 'lucide-react';

interface AnalysisViewProps {
  content: string;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ content }) => {
  // Check if there's a translation section
  const [englishContent, translationContent] = content.split('--- TRANSLATION');

  const renderSection = (text: string, isTranslation = false) => {
    const sections = text.trim().split('\n\n');
    
    return (
      <div className={`space-y-6 ${isTranslation ? 'pt-8 mt-8 border-t-2 border-dashed border-indigo-100' : ''}`}>
        {isTranslation && (
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full w-fit mb-4">
            <Globe size={16} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {text.split('---')[0]?.trim() || 'Translation'}
            </span>
          </div>
        )}
        
        {sections.map((section, idx) => {
          const lines = section.split('\n');
          const titleLine = lines[0];
          
          // Skip the first line if it's the translation header we already handled
          if (isTranslation && titleLine.includes('---')) return null;
          if (!titleLine.trim()) return null;

          const body = lines.slice(1);

          return (
            <div key={idx} className={`bg-white rounded-xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md ${isTranslation ? 'border-l-4 border-l-indigo-400' : ''}`}>
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                {titleLine}
              </h3>
              <div className="space-y-2">
                {body.map((line, lIdx) => {
                  if (line.trim().startsWith('- ')) {
                    return (
                      <div key={lIdx} className="flex items-start gap-3">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <p className="text-slate-600 leading-relaxed">{line.substring(2).trim()}</p>
                      </div>
                    );
                  }
                  
                  if (line.includes(':')) {
                    const [key, ...rest] = line.split(':');
                    return (
                      <div key={lIdx} className="grid grid-cols-1 sm:grid-cols-3 py-1">
                        <span className="font-semibold text-slate-500 text-sm uppercase tracking-wider">{key.trim()}</span>
                        <span className="sm:col-span-2 text-slate-800">{rest.join(':').trim()}</span>
                      </div>
                    );
                  }

                  return (
                    <p key={lIdx} className="text-slate-600 leading-relaxed">
                      {line.trim()}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderSection(englishContent)}
      {translationContent && renderSection(`--- ${translationContent}`, true)}
    </div>
  );
};

export default AnalysisView;
