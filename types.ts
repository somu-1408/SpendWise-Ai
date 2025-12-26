
export interface AnalysisResult {
  id: string;
  rawText: string;
  formattedOutput: string;
  timestamp: number;
}

export interface AppState {
  history: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}
