'use client';

import { Brain, Sparkles, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  insights: string;
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  // Parse the insights to extract key metrics and recommendations
  const parseInsights = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const metrics = [];
    const recommendations = [];
    
    lines.forEach(line => {
      // Clean up the line by removing markdown formatting
      const cleanLine = line
        .replace(/^[•\*\-\s]+/, '') // Remove bullet points and dashes
        .replace(/\*\*/g, '') // Remove all ** markdown
        .replace(/:\s*/, ': ') // Clean up colons
        .trim();
      
      if (cleanLine.includes('Revenue Growth') || cleanLine.includes('Unit Sales') || cleanLine.includes('Price Point')) {
        metrics.push(cleanLine);
      } else if (cleanLine.includes('Recommendation')) {
        recommendations.push(cleanLine);
      }
    });
    
    return { metrics, recommendations };
  };

  const { metrics, recommendations } = parseInsights(insights);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full mr-3">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">AI Insights</h4>
          <p className="text-sm text-gray-500">Powered by advanced analytics</p>
        </div>
        <Sparkles className="h-5 w-5 text-gray-400 ml-auto" />
      </div>
      
      <div className="space-y-6">
        {/* Key Metrics */}
        {metrics.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-gray-700" />
              Key Performance Metrics
            </h5>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="text-gray-800 text-sm leading-relaxed">{metric}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-gray-700" />
              Strategic Recommendations
            </h5>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
                  <p className="text-gray-800 text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback for any remaining content */}
        {metrics.length === 0 && recommendations.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
            <p className="text-gray-800 text-sm leading-relaxed">{insights}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <Sparkles className="h-3 w-3 mr-1" />
          <span>AI-powered analysis</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Target className="h-3 w-3 mr-1" />
          <span>Real-time insights</span>
        </div>
      </div>
    </div>
  );
}
