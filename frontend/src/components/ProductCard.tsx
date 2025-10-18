'use client';

import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isSelected: boolean;
}

export default function ProductCard({ product, onClick, isSelected }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
        <span className="text-lg font-bold text-blue-600">${product.price}</span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
      <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
      
      {isSelected && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <span className="text-sm text-blue-600 font-medium">Selected</span>
        </div>
      )}
    </div>
  );
}
