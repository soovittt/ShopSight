'use client';

import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Forecast } from '@/types';

interface ForecastCardProps {
  forecast: Forecast;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const isIncreasing = forecast.trend === 'increasing';
  const confidencePercentage = Math.round(forecast.confidence * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Next Month Forecast</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Expected Sales</span>
          <span className="text-2xl font-bold text-gray-900">
            ${forecast.next_month_forecast.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Trend</span>
          <div className="flex items-center">
            {isIncreasing ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
              {isIncreasing ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confidence</span>
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidencePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">{confidencePercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> This forecast is based on historical sales patterns and may not account for external factors like seasonality or market changes.
        </p>
      </div>
    </div>
  );
}
