'use client';

import { useState } from 'react';
import { Bot, Send, Lightbulb, TrendingUp, Target, Sparkles } from 'lucide-react';

interface AIAgentProps {
  productId: string;
  productName: string;
}

interface AgentResponse {
  analysis: string;
  // Backend may return a string or an array; handle both defensively
  recommendations: string[] | string;
  confidence: number;
  next_steps?: string[] | string;
}

interface SuggestionsResponse {
  suggestions: string[];
  priority: string;
}

export default function AIAgent({ productId, productName }: AIAgentProps) {
  const [query, setQuery] = useState('');
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions'>('chat');

  const handleAgentQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/agent/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          product_id: productId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // Normalize recommendations/next_steps to arrays for rendering safety
        const normalized: AgentResponse = {
          analysis: String(data.analysis ?? ""),
          recommendations: Array.isArray(data.recommendations)
            ? data.recommendations
            : (data.recommendations ? [String(data.recommendations)] : []),
          confidence: typeof data.confidence === 'number' ? data.confidence : 0,
          next_steps: Array.isArray(data.next_steps)
            ? data.next_steps
            : (data.next_steps ? [String(data.next_steps)] : []),
        };
        setAgentResponse(normalized);
      }
    } catch (error) {
      console.error('Agent query failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/agent/suggestions/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Suggestions failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full mr-3">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">AI Analytics Agent</h4>
          <p className="text-sm text-gray-500">Ask questions about {productName}</p>
        </div>
        <Sparkles className="h-5 w-5 text-gray-400 ml-auto" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bot className="h-4 w-4 inline mr-2" />
          Chat Analysis
        </button>
        <button
          onClick={() => {
            setActiveTab('suggestions');
            if (!suggestions) loadSuggestions();
          }}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Smart Suggestions
        </button>
      </div>

      {/* Chat Analysis Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about pricing, trends, or strategy..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAgentQuery()}
            />
            <button
              onClick={handleAgentQuery}
              disabled={loading || !query.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          {agentResponse && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analysis
                </h5>
                <p className="text-blue-800 text-sm">{agentResponse.analysis}</p>
              </div>

              {agentResponse.recommendations && agentResponse.recommendations.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Recommendations
                  </h5>
                  <ul className="space-y-1">
                    {agentResponse.recommendations.map((rec, index) => (
                      <li key={index} className="text-gray-800 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Confidence: {Math.round(agentResponse.confidence * 100)}%</span>
                <span>AI Agent Analysis</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Smart Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : suggestions ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-900">Proactive Business Suggestions</h5>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestions.priority)}`}>
                  {suggestions.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              
              {suggestions.suggestions.map((suggestion, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-800 text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>Click to load AI-powered suggestions</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
