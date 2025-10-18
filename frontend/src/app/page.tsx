'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import SalesChart from '@/components/SalesChart';
import ForecastCard from '@/components/ForecastCard';
import CustomerSegments from '@/components/CustomerSegments';
import InsightsPanel from '@/components/InsightsPanel';
import AIAgent from '@/components/AIAgent';
import { Product, SalesData, Forecast, CustomerSegment } from '@/types';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setLoading(true);
    console.log('Searching for:', query);
    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search failed:', errorText);
        throw new Error(`Search failed: ${response.status} ${errorText}`);
      }
      
      const results = await response.json();
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Show some mock results for demo purposes
      const mockResults = [
        {
          product_id: "nike_air_max_270",
          name: "Nike Air Max 270",
          category: "Running Shoes",
          price: 150.00,
          brand: "Nike",
          description: "Comfortable running shoes with Air Max technology"
        },
        {
          product_id: "adidas_ultraboost_22",
          name: "Adidas Ultraboost 22",
          category: "Running Shoes", 
          price: 180.00,
          brand: "Adidas",
          description: "High-performance running shoes with Boost technology"
        }
      ];
      setSearchResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = async (product: Product) => {
    setSelectedProduct(product);
    setLoading(true);
    
    try {
      // Fetch all data in parallel
      const [salesResponse, forecastResponse, segmentsResponse, insightsResponse] = await Promise.all([
        fetch(`http://localhost:8000/products/${product.product_id}/sales`),
        fetch(`http://localhost:8000/products/${product.product_id}/forecast`),
        fetch(`http://localhost:8000/products/${product.product_id}/segments`),
        fetch(`http://localhost:8000/products/${product.product_id}/insights`)
      ]);

      const [salesData, forecastData, segmentsData, insightsData] = await Promise.all([
        salesResponse.json(),
        forecastResponse.json(),
        segmentsResponse.json(),
        insightsResponse.json()
      ]);

      setSalesData(salesData);
      setForecast(forecastData);
      setSegments(segmentsData.segments);
      setInsights(insightsData.insights);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">ShopSight Analytics</h1>
          <p className="mt-2 text-gray-600">E-commerce analytics powered by AI</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  onClick={() => handleProductSelect(product)}
                  isSelected={selectedProduct?.product_id === product.product_id}
                />
              ))}
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4">{selectedProduct.brand} • ${selectedProduct.price}</p>
              <p className="text-gray-700">{selectedProduct.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trends</h3>
                {salesData && <SalesChart data={salesData} />}
              </div>

              <div className="space-y-6">
                {forecast && <ForecastCard forecast={forecast} />}
                {segments.length > 0 && <CustomerSegments segments={segments} />}
              </div>
            </div>

            {insights && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                <InsightsPanel insights={insights} />
              </div>
            )}

            {selectedProduct && (
              <div className="bg-white rounded-lg shadow p-6">
                <AIAgent 
                  productId={selectedProduct.product_id} 
                  productName={selectedProduct.name} 
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}