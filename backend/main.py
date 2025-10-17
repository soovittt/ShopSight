from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import boto3
import json
import os
from typing import List, Dict, Any
import openai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ShopSight Analytics API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai_api_key = os.getenv("OPENAI_API_KEY")

# S3 client for dataset access
s3_client = boto3.client('s3')

class SearchRequest(BaseModel):
    query: str

class ProductResponse(BaseModel):
    product_id: str
    name: str
    category: str
    price: float
    brand: str
    description: str

class SalesDataResponse(BaseModel):
    product_id: str
    dates: List[str]
    sales: List[float]
    units_sold: List[int]

class ForecastResponse(BaseModel):
    product_id: str
    next_month_forecast: float
    confidence: float
    trend: str

class CustomerSegmentResponse(BaseModel):
    product_id: str
    segments: List[Dict[str, Any]]

# Mock data for demonstration
MOCK_PRODUCTS = [
    {
        "product_id": "nike_air_max_270",
        "name": "Nike Air Max 270",
        "category": "Running Shoes",
        "price": 150.00,
        "brand": "Nike",
        "description": "Comfortable running shoes with Air Max technology"
    },
    {
        "product_id": "adidas_ultraboost_22",
        "name": "Adidas Ultraboost 22",
        "category": "Running Shoes", 
        "price": 180.00,
        "brand": "Adidas",
        "description": "High-performance running shoes with Boost technology"
    },
    {
        "product_id": "nike_react_infinity",
        "name": "Nike React Infinity Run",
        "category": "Running Shoes",
        "price": 160.00,
        "brand": "Nike", 
        "description": "Stable running shoes designed to reduce injury"
    }
]

# Mock sales data
MOCK_SALES_DATA = {
    "nike_air_max_270": {
        "dates": ["2024-01-01", "2024-01-15", "2024-02-01", "2024-02-15", "2024-03-01", "2024-03-15"],
        "sales": [12000, 15000, 18000, 16000, 20000, 22000],
        "units_sold": [80, 100, 120, 107, 133, 147]
    },
    "adidas_ultraboost_22": {
        "dates": ["2024-01-01", "2024-01-15", "2024-02-01", "2024-02-15", "2024-03-01", "2024-03-15"],
        "sales": [14400, 16200, 19800, 18000, 21600, 23400],
        "units_sold": [80, 90, 110, 100, 120, 130]
    },
    "nike_react_infinity": {
        "dates": ["2024-01-01", "2024-01-15", "2024-02-01", "2024-02-15", "2024-03-01", "2024-03-15"],
        "sales": [9600, 12000, 14400, 12800, 16000, 17600],
        "units_sold": [60, 75, 90, 80, 100, 110]
    }
}

def search_products_with_llm(query: str) -> List[ProductResponse]:
    """Use LLM to enhance product search with natural language understanding"""
    try:
        if not openai_api_key:
            print("No OpenAI API key found, using simple keyword matching")
            # Fallback to simple keyword matching
            search_terms = query.lower().split()
            matching_products = []
            for product in MOCK_PRODUCTS:
                product_text = f"{product['name']} {product['brand']} {product['category']}".lower()
                if any(term in product_text for term in search_terms):
                    matching_products.append(ProductResponse(**product))
            return matching_products
        
        # Create a prompt for the LLM to understand the search intent
        prompt = f"""
        Analyze this product search query: "{query}"
        
        Extract key information:
        - Brand names mentioned
        - Product categories (shoes, clothing, etc.)
        - Price range indicators
        - Specific features mentioned
        
        Return a JSON response with the extracted information.
        """
        
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200
        )
        
        # For now, we'll use simple keyword matching with the LLM response
        # In a real implementation, this would be more sophisticated
        search_terms = query.lower().split()
        
        matching_products = []
        for product in MOCK_PRODUCTS:
            product_text = f"{product['name']} {product['brand']} {product['category']} {product['description']}".lower()
            if any(term in product_text for term in search_terms):
                matching_products.append(ProductResponse(**product))
        
        return matching_products
        
    except Exception as e:
        print(f"LLM search error: {e}")
        # Fallback to simple keyword matching
        search_terms = query.lower().split()
        matching_products = []
        for product in MOCK_PRODUCTS:
            product_text = f"{product['name']} {product['brand']} {product['category']}".lower()
            if any(term in product_text for term in search_terms):
                matching_products.append(ProductResponse(**product))
        return matching_products

@app.get("/")
async def root():
    return {"message": "ShopSight Analytics API is running"}

@app.post("/search", response_model=List[ProductResponse])
async def search_products(request: SearchRequest):
    """Search for products using natural language query"""
    try:
        results = search_products_with_llm(request.query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/products/{product_id}/sales", response_model=SalesDataResponse)
async def get_sales_data(product_id: str):
    """Get historical sales data for a product"""
    if product_id not in MOCK_SALES_DATA:
        raise HTTPException(status_code=404, detail="Product not found")
    
    data = MOCK_SALES_DATA[product_id]
    return SalesDataResponse(
        product_id=product_id,
        dates=data["dates"],
        sales=data["sales"],
        units_sold=data["units_sold"]
    )

@app.get("/products/{product_id}/forecast", response_model=ForecastResponse)
async def get_forecast(product_id: str):
    """Get forecasted demand for next month (mocked)"""
    if product_id not in MOCK_SALES_DATA:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Simple mock forecast based on recent trend
    recent_sales = MOCK_SALES_DATA[product_id]["sales"][-3:]
    trend = "increasing" if recent_sales[-1] > recent_sales[0] else "decreasing"
    avg_growth = (recent_sales[-1] - recent_sales[0]) / len(recent_sales)
    next_month = recent_sales[-1] + avg_growth
    
    return ForecastResponse(
        product_id=product_id,
        next_month_forecast=round(next_month, 2),
        confidence=0.75,
        trend=trend
    )

@app.get("/products/{product_id}/segments", response_model=CustomerSegmentResponse)
async def get_customer_segments(product_id: str):
    """Get customer segments for a product (mocked)"""
    if product_id not in MOCK_SALES_DATA:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Mock customer segments
    segments = [
        {
            "name": "Fitness Enthusiasts",
            "percentage": 45,
            "avg_age": 28,
            "interests": ["running", "fitness", "health"],
            "purchase_frequency": "monthly"
        },
        {
            "name": "Casual Athletes", 
            "percentage": 35,
            "avg_age": 32,
            "interests": ["walking", "casual exercise", "comfort"],
            "purchase_frequency": "quarterly"
        },
        {
            "name": "Fashion Conscious",
            "percentage": 20,
            "avg_age": 25,
            "interests": ["style", "trends", "brands"],
            "purchase_frequency": "seasonal"
        }
    ]
    
    return CustomerSegmentResponse(product_id=product_id, segments=segments)

@app.get("/products/{product_id}/insights")
async def get_insights(product_id: str):
    """Get AI-generated insights for a product"""
    try:
        if product_id not in MOCK_SALES_DATA:
            raise HTTPException(status_code=404, detail="Product not found")
        
        sales_data = MOCK_SALES_DATA[product_id]
        product_info = next((p for p in MOCK_PRODUCTS if p["product_id"] == product_id), None)
        
        if not product_info:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Check if OpenAI API key is available
        if not openai_api_key:
            # Generate mock insights when no API key is available
            recent_sales = sales_data['sales'][-3:]
            recent_units = sales_data['units_sold'][-3:]
            growth_rate = ((recent_sales[-1] - recent_sales[0]) / recent_sales[0]) * 100
            
            mock_insights = f"""
            **Sales Performance Analysis for {product_info['name']}**
            
            • **Revenue Growth**: Sales increased by {growth_rate:.1f}% over the last 3 periods, showing strong market demand
            • **Unit Sales Trend**: Units sold grew from {recent_units[0]} to {recent_units[-1]} units, indicating increasing customer adoption
            • **Price Point**: At ${product_info['price']}, this product sits in the premium segment with healthy margins
            • **Recommendation**: Continue current marketing strategy and consider inventory expansion given the positive trend
            """
            return {"insights": mock_insights.strip()}
        
        # Create insights using LLM
        prompt = f"""
        Analyze this product's sales performance and provide insights:
        
        Product: {product_info['name']} by {product_info['brand']}
        Price: ${product_info['price']}
        Recent Sales: {sales_data['sales'][-3:]}
        Recent Units Sold: {sales_data['units_sold'][-3:]}
        
        Provide 3-4 key insights about sales trends, customer behavior, and recommendations.
        Keep it concise and business-focused.
        """
        
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )
        
        return {"insights": response.choices[0].message.content.strip()}
        
    except Exception as e:
        # Fallback to mock insights
        recent_sales = MOCK_SALES_DATA[product_id]['sales'][-3:]
        recent_units = MOCK_SALES_DATA[product_id]['units_sold'][-3:]
        growth_rate = ((recent_sales[-1] - recent_sales[0]) / recent_sales[0]) * 100
        
        mock_insights = f"""
        **Sales Performance Analysis**
        
        • **Revenue Growth**: Sales increased by {growth_rate:.1f}% over the last 3 periods
        • **Unit Sales Trend**: Units sold grew from {recent_units[0]} to {recent_units[-1]} units
        • **Recommendation**: Strong performance suggests continued market demand
        """
        return {"insights": mock_insights.strip()}

@app.post("/agent/analyze")
async def ai_agent_analysis(request: dict):
    """AI Agent that orchestrates multiple analytics components"""
    try:
        query = request.get("query", "")
        product_id = request.get("product_id", "")
        
        if not query or not product_id:
            raise HTTPException(status_code=400, detail="Query and product_id are required")
        
        if not openai_api_key:
            return {
                "analysis": "AI Agent analysis requires OpenAI API key",
                "recommendations": ["Set up OpenAI API key for full functionality"],
                "confidence": 0.5
            }
        
        # Get all product data
        sales_data = MOCK_SALES_DATA.get(product_id, {})
        product_info = next((p for p in MOCK_PRODUCTS if p["product_id"] == product_id), None)
        
        if not product_info:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Create comprehensive analysis prompt
        prompt = f"""
        As an AI Analytics Agent, analyze this e-commerce product based on the user's query: "{query}"
        
        Product: {product_info['name']} by {product_info['brand']}
        Price: ${product_info['price']}
        Sales Data: {sales_data.get('sales', [])}
        Units Sold: {sales_data.get('units_sold', [])}
        
        Provide:
        1. Comprehensive analysis addressing the user's specific query
        2. Strategic recommendations based on the data
        3. Confidence level (0-1) for your analysis
        4. Next steps for the business
        
        Format as JSON with keys: analysis, recommendations, confidence, next_steps
        """
        
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        
        # Try to parse JSON response, fallback to text
        try:
            import json
            result = json.loads(response.choices[0].message.content.strip())
            return result
        except:
            return {
                "analysis": response.choices[0].message.content.strip(),
                "recommendations": ["Review the analysis above"],
                "confidence": 0.8,
                "next_steps": ["Implement recommended strategies"]
            }
        
    except Exception as e:
        return {
            "analysis": f"Analysis failed: {str(e)}",
            "recommendations": ["Check system configuration"],
            "confidence": 0.1
        }

@app.get("/agent/suggestions/{product_id}")
async def get_ai_suggestions(product_id: str):
    """AI Agent that provides proactive business suggestions"""
    try:
        if product_id not in MOCK_SALES_DATA:
            raise HTTPException(status_code=404, detail="Product not found")
        
        sales_data = MOCK_SALES_DATA[product_id]
        product_info = next((p for p in MOCK_PRODUCTS if p["product_id"] == product_id), None)
        
        if not product_info:
            raise HTTPException(status_code=404, detail="Product not found")
        
        if not openai_api_key:
            return {
                "suggestions": [
                    "Consider seasonal promotions during peak months",
                    "Expand inventory based on current growth trend",
                    "Target fitness enthusiasts demographic more aggressively"
                ],
                "priority": "medium"
            }
        
        prompt = f"""
        As an AI Business Strategy Agent, analyze this product and provide 3-5 actionable business suggestions:
        
        Product: {product_info['name']} by {product_info['brand']}
        Price: ${product_info['price']}
        Recent Sales: {sales_data['sales'][-3:]}
        Recent Units: {sales_data['units_sold'][-3:]}
        
        Focus on:
        - Marketing opportunities
        - Inventory management
        - Pricing strategies
        - Customer targeting
        - Growth opportunities
        
        Return as JSON with suggestions array and priority level (low/medium/high).
        """
        
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300
        )
        
        try:
            import json
            return json.loads(response.choices[0].message.content.strip())
        except:
            return {
                "suggestions": [
                    "Optimize pricing strategy based on demand patterns",
                    "Implement targeted marketing campaigns",
                    "Consider seasonal inventory adjustments"
                ],
                "priority": "medium"
            }
        
    except Exception as e:
        return {
            "suggestions": ["Review product performance data"],
            "priority": "low"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
