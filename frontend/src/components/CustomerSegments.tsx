'use client';

import { Users, Clock, Heart } from 'lucide-react';
import { CustomerSegment } from '@/types';

interface CustomerSegmentsProps {
  segments: CustomerSegment[];
}

export default function CustomerSegments({ segments }: CustomerSegmentsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
        <Users className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{segment.name}</h4>
              <span className="text-sm font-semibold text-blue-600">{segment.percentage}%</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span className="mr-4">Avg Age: {segment.avg_age}</span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{segment.purchase_frequency}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {segment.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  <Heart className="h-2 w-2 mr-1" />
                  {interest}
                </span>
              ))}
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${segment.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Customer segments are based on purchase behavior analysis and demographic patterns.
        </p>
      </div>
    </div>
  );
}
