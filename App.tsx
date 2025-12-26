
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  LayoutDashboard, 
  Send, 
  Trash2, 
  BrainCircuit, 
  TrendingUp, 
  ChevronRight,
  RefreshCcw,
  Sparkles,
  Globe
} from 'lucide-react';
import { analyzeReceiptText } from './services/geminiService';
import { AnalysisResult } from './types';
import AnalysisView from './components/AnalysisView';

const LANGUAGES = [
  "English", "Spanish", "French", "Hindi", "German", 
  "Chinese", "Japanese", "Portuguese", "Arabic", "Bengali"
];

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spendwise_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('spendwise_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError("Please provide some text from a receipt or invoice.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setCurrentAnalysis(null);

    try {
      const output = await analyzeReceiptText(inputText, targetLanguage);
      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        rawText: inputText,
        formattedOutput: output,
        timestamp: Date.now(),
      };

      setCurrentAnalysis(newAnalysis);
      setHistory(prev => [newAnalysis, ...prev].slice(0, 50));
      setInputText('');
    } catch (err: any) {
      setError(err.message || "Failed to analyze text.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your analysis history?")) {
      setHistory([]);
      localStorage.removeItem('spendwise_history');
    }
  };

  const selectHistoryItem = (item: AnalysisResult) => {
    setCurrentAnalysis(item);
    setActiveTab('new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="w-full lg:w-80 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">SpendWise AI</h1>
            <p className="text-xs text-slate-500 font-medium">Purchase Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('new')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'new' ? 'bg-indigo-600/10 text-indigo-400 font-semibold' : 'hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Analyzer</span>
          </button>
          
          <div className="pt-4 pb-2 px-4 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Activity</span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="space-y-1">
            {history.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-600 italic">No previous analyses yet.</p>
              </div>
            ) : (
              history.map(item => {
                const vendorLine = item.formattedOutput.split('\n').find(l => l.includes('Vendor:'));
                const vendorName = vendorLine ? vendorLine.replace('Vendor:', '').trim() : 'Unnamed Analysis';
                
                return (
                  <button
                    key={item.id}
                    onClick={() => selectHistoryItem(item)}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-slate-800 transition-all group flex flex-col gap-1 border border-transparent hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300 truncate">
                        {vendorName}
                      </span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Savings Identified</p>
            <p className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              Calculated On-Demand
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, Business Owner</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-slate-500 max-w-xl">
                Paste your receipt or invoice text below to extract structured data and receive professional spending intelligence.
              </p>
            </div>
          </div>

          {/* Analysis Input Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <FileText size={20} />
                  <h3 className="font-semibold">Invoice Text Input</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 mr-1">Output Language:</span>
                  <select 
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: ABC Stationery | Date: 12 Aug 2024 | Items: A4 Paper pack - 5, Printer Ink - 2 | Total: ₹3,450 | Paid via UPI"
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400 resize-none mb-4"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles size={14} className="text-yellow-500" />
                  <span>Powered by Gemini 3 Flash Intelligence</span>
                </div>
                
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputText.trim()}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 ${
                    isAnalyzing || !inputText.trim() 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCcw className="animate-spin" size={18} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Generate Insights
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="bg-red-100 p-1.5 rounded-full">
                <Trash2 size={16} />
              </div>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Result Section */}
          {isAnalyzing && !currentAnalysis && (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="text-lg font-bold text-slate-700">Brewing Business Intelligence</p>
                <p className="text-sm text-slate-500">Extracting vendors, line items, and smart categories...</p>
                {targetLanguage !== 'English' && (
                  <p className="text-xs text-indigo-500 font-medium italic mt-2">Translating insights to {targetLanguage}...</p>
                )}
              </div>
            </div>
          )}

          {currentAnalysis && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={24} />
                  Latest Analysis Result
                </h3>
                <button 
                  onClick={() => setCurrentAnalysis(null)}
                  className="text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                  Clear Results
                </button>
              </div>
              <AnalysisView content={currentAnalysis.formattedOutput} />
            </div>
          )}

          {/* Empty State */}
          {!currentAnalysis && !isAnalyzing && (
            <div className="bg-white/40 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="bg-white p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-sm border border-slate-100">
                <FileText size={32} className="text-slate-300" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-700">Ready to Analyze</h4>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Paste the contents of your physical receipt or digital invoice text above to see the magic happen. Supporting multiple languages automatically.
                </p>
              </div>
            </div>
          )}

          {/* Footer Branding */}
          <footer className="pt-8 pb-4 text-center text-slate-400 text-xs border-t border-slate-200">
            <p>© {new Date().getFullYear()} SpendWise AI. Designed for Small Business Growth.</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
