# ShopSight Analytics Platform

A next-generation e-commerce analytics platform that transforms product data into actionable business intelligence through AI-powered insights and predictive analytics.

## 🚀 Overview

ShopSight delivers a complete analytics experience: **Natural Language Search → Real-time Analytics → AI-Powered Insights**. Built with modern tech stack and advanced AI integration, it demonstrates the future of e-commerce intelligence.

## ✨ Features

### 🤖 AI-Powered Analytics
- **Natural Language Search**: Query products using conversational language
- **AI Analytics Agent**: Interactive chat interface for product analysis
- **Smart Suggestions**: Proactive business recommendations
- **Intelligent Insights**: Context-aware performance analysis

### 📊 Data Visualization
- **Interactive Sales Charts**: Real-time historical data visualization
- **Predictive Forecasting**: Next-month sales predictions with confidence scores
- **Customer Segmentation**: Demographic and behavioral analysis
- **Performance Metrics**: Revenue growth, unit sales, and trend analysis

### 🎯 Business Intelligence
- **Strategic Recommendations**: AI-generated business strategies
- **Confidence Scoring**: Reliability indicators for all predictions
- **Priority-Based Suggestions**: High/medium/low priority recommendations
- **Real-time Analysis**: Dynamic insights based on current data

## Tech Stack

- **Backend**: Python 3.9+, FastAPI, OpenAI API
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Recharts
- **Data**: Mock e-commerce dataset (ready for S3 integration)

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp env_example.txt .env
# Edit .env and add your OpenAI API key
```

4. Start the backend server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🚀 Usage

### Core User Journey
1. **Natural Language Search**: Query products using conversational language
2. **Product Selection**: Click on any product from search results
3. **Analytics Dashboard**: Explore comprehensive product insights
4. **AI Agent Interaction**: Ask specific questions about the product
5. **Smart Suggestions**: Get proactive business recommendations

### AI Agent Features
- **Chat Analysis**: Ask questions like "Should I increase the price?" or "What's the best marketing strategy?"
- **Smart Suggestions**: Get priority-based business recommendations
- **Confidence Scoring**: Understand the reliability of AI insights
- **Contextual Responses**: AI adapts to your specific product and query

## 🔌 API Endpoints

### Core Analytics
- `POST /search` - Natural language product search
- `GET /products/{id}/sales` - Historical sales data
- `GET /products/{id}/forecast` - Predictive sales forecasting
- `GET /products/{id}/segments` - Customer demographic analysis
- `GET /products/{id}/insights` - AI-generated performance insights

### AI Agent Endpoints
- `POST /agent/analyze` - Interactive AI analysis with custom queries
- `GET /agent/suggestions/{id}` - Proactive business recommendations

## Project Structure

```
komo-take-home/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── env_example.txt      # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx     # Main dashboard
│   │   ├── components/      # React components
│   │   └── types/           # TypeScript types
│   └── package.json
└── README.md
```

## Implementation Details

### Core User Journey
1. User enters natural language search query
2. OpenAI processes query and returns relevant products
3. User selects a product to view detailed analytics
4. System displays sales trends, forecasts, and AI insights

### LLM Integration
- **Search Enhancement**: OpenAI GPT-3.5-turbo processes natural language queries
- **Insights Generation**: AI analyzes sales data and provides business insights
- **Fallback Handling**: Graceful degradation when API calls fail

### Data Handling
- **Real Data**: Sales trends use actual historical data patterns
- **Mocked Data**: Forecasts and segments use realistic mock data
- **Error Handling**: Comprehensive error handling and user feedback

## Future Enhancements

### What Would Be Built Next
1. **S3 Dataset Integration**: Connect to real e-commerce dataset
2. **Advanced Forecasting**: Implement time series forecasting models
3. **Real Customer Data**: Integrate actual customer segmentation data
4. **Comparison Tools**: Side-by-side product comparison
5. **Export Features**: PDF reports and data export
6. **Real-time Updates**: Live data streaming and updates

### Technical Improvements
1. **Database Integration**: PostgreSQL for persistent data storage
2. **Authentication**: User accounts and session management
3. **Caching**: Redis for improved performance
4. **Monitoring**: Application performance monitoring
5. **Testing**: Comprehensive test suite

## Assumptions Made

1. **API Keys**: OpenAI API key is available and configured
2. **Data Format**: E-commerce data follows standard transactional format
3. **User Experience**: Focus on desktop-first responsive design
4. **Performance**: Mock data is sufficient for demonstration purposes
5. **Security**: Basic CORS setup for local development

## Time Investment

- **Total Development Time**: ~2 hours
- **Backend Development**: 45 minutes
- **Frontend Development**: 60 minutes
- **Integration & Testing**: 15 minutes

## 📸 Demo Screenshots

### Main Dashboard
![Main Dashboard](./public/imag1.png)
*Clean, modern interface with search functionality and product analytics*

### Search Results & Product Selection
![Search Results](./public/image2.png)
*Natural language search with AI-powered product matching*

### Analytics Dashboard
![Analytics Dashboard](./public/image3.png)
*Comprehensive product analytics with sales trends and AI insights*

### AI Insights Panel
![AI Insights](./public/image4.png)
*Structured AI-generated insights with performance metrics and recommendations*

### AI Agent Interface
![AI Agent](./public/image5.png)
*Interactive AI agent with chat analysis and smart suggestions*

### Smart Suggestions
![Smart Suggestions](./public/image6.png)
*Proactive business recommendations with priority-based insights*

## Contact

Built as part of Kumo take-home assignment. For questions about implementation or technical details, please refer to the code comments and this README.
