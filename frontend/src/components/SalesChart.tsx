'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesData } from '@/types';

interface SalesChartProps {
  data: SalesData;
}

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: data.sales[index],
    units: data.units_sold[index]
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <YAxis 
            yAxisId="sales"
            orientation="left"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis 
            yAxisId="units"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#6B7280' }}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'sales' ? `$${value.toLocaleString()}` : value,
              name === 'sales' ? 'Sales Revenue' : 'Units Sold'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            yAxisId="sales"
            type="monotone" 
            dataKey="sales" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
          <Line 
            yAxisId="units"
            type="monotone" 
            dataKey="units" 
            stroke="#10B981" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Sales Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2" style={{ background: 'repeating-linear-gradient(90deg, #10B981 0px, #10B981 3px, transparent 3px, transparent 6px)' }}></div>
          <span>Units Sold</span>
        </div>
      </div>
    </div>
  );
}
