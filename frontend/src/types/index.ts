export interface Product {
  product_id: string;
  name: string;
  category: string;
  price: number;
  brand: string;
  description: string;
}

export interface SalesData {
  product_id: string;
  dates: string[];
  sales: number[];
  units_sold: number[];
}

export interface Forecast {
  product_id: string;
  next_month_forecast: number;
  confidence: number;
  trend: string;
}

export interface CustomerSegment {
  name: string;
  percentage: number;
  avg_age: number;
  interests: string[];
  purchase_frequency: string;
}
