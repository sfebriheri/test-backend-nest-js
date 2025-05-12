# F&B Tech Platform Integration

A food & beverage tech platform that integrates with delivery aggregators, built with NestJS microservices and Next.js.

## System Architecture

### Backend Services (NestJS Microservices)

1. **Menu Management Service**
   - REST API endpoints for CRUD operations
   - Redis caching for menu data
   - Image upload handling
   - RabbitMQ publisher for menu updates
   - Prisma models for:
     - Restaurants
     - Menu Categories
     - Menu Items
     - Images

2. **Order Management Service**
   - RabbitMQ consumer for incoming orders
   - Order status management
   - Status update publisher
   - Prisma models for:
     - Orders
     - Order Items
     - Order Status History

3. **Analytics Service**
   - Sales volume tracking
   - Popular items ranking
   - Performance metrics
   - Prisma models for:
     - Analytics
     - Sales Reports
     - Item Rankings

### Frontend (Next.js Admin Dashboard)

1. **Restaurant Management**
   - Restaurant CRUD interface
   - Location management
   - Operating hours
   - Contact information

2. **Menu Management**
   - Category management
   - Item management with image upload
   - Price and availability controls
   - Menu sequencing
   - Real-time updates

3. **Order Management**
   - Real-time order tracking
   - Status management
   - Filtering and search
   - Order history

4. **Analytics Dashboard**
   - Sales charts
   - Popular items
   - Performance metrics
   - Export capabilities

### Infrastructure

1. **Message Broker (RabbitMQ)**
   - Exchanges:
     - `menu.updates` (fanout)
     - `orders.incoming` (direct)
     - `orders.status` (topic)
   - Queues:
     - `menu-updates`
     - `order-processing`
     - `status-updates`

2. **Database (PostgreSQL)**
   - Prisma schema with relations
   - Migrations
   - Seeding data

3. **Cache (Redis)**
   - Menu data caching
   - Session management
   - Rate limiting

4. **Containerization (Docker)**
   - Service containers
   - Development environment
   - Production configuration

## Technical Requirements

### Backend (NestJS)

1. **Menu Service**
   ```typescript
   // Key Features
   - REST API endpoints
   - RabbitMQ integration
   - Redis caching
   - Image upload
   - Prisma integration
   ```

2. **Order Service**
   ```typescript
   // Key Features
   - RabbitMQ consumer
   - Status management
   - Event publishing
   - Prisma integration
   ```

3. **Analytics Service**
   ```typescript
   // Key Features
   - Data aggregation
   - Report generation
   - Real-time metrics
   ```

### Frontend (Next.js)

1. **Pages**
   ```typescript
   // Key Pages
   - /dashboard
   - /restaurants
   - /menus
   - /orders
   - /analytics
   ```

2. **Components**
   ```typescript
   // Key Components
   - RestaurantForm
   - MenuEditor
   - OrderTracker
   - AnalyticsCharts
   ```

3. **State Management**
   ```typescript
   // Key Features
   - React Query for data fetching
   - Zustand for state management
   - WebSocket for real-time updates
   ```

## Setup Instructions

1. **Prerequisites**
   ```bash
   - Node.js v18+
   - Docker & Docker Compose
   - PostgreSQL
   - RabbitMQ
   - Redis
   ```

2. **Environment Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd f-and-b-platform

   # Install dependencies
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Environment Variables**
   ```bash
   # Backend (.env)
   DATABASE_URL=postgresql://user:password@localhost:5432/fandb
   REDIS_URL=redis://localhost:6379
   RABBITMQ_URL=amqp://guest:guest@localhost:5672
   JWT_SECRET=your-secret-key

   # Frontend (.env)
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_ORDER_API_URL=http://localhost:3001
   ```

4. **Database Setup**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Development**
   ```bash
   # Start infrastructure
   docker-compose up -d

   # Start backend services
   cd backend
   npm run start:dev

   # Start frontend
   cd frontend
   npm run dev
   ```

## API Documentation

### Menu Service (Port 3000)
- REST API endpoints
- Swagger documentation
- OpenAPI specification

### Order Service (Port 3001)
- REST API endpoints
- Swagger documentation
- OpenAPI specification

## Testing

1. **Backend Tests**
   ```bash
   cd backend
   npm run test
   npm run test:e2e
   ```

2. **Frontend Tests**
   ```bash
   cd frontend
   npm run test
   ```

## Deployment

1. **Production Build**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd frontend
   npm run build
   ```

2. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Project Structure

```
├── backend/
│   ├── menu-service/
│   │   ├── src/
│   │   ├── prisma/
│   │   └── Dockerfile
│   ├── order-service/
│   │   ├── src/
│   │   ├── prisma/
│   │   └── Dockerfile
│   └── analytics-service/
│       ├── src/
│       ├── prisma/
│       └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── styles/
│   ├── public/
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Evaluation Criteria

1. **System Design**
   - Microservice architecture
   - Event-driven design
   - Database schema
   - API design

2. **Code Quality**
   - Clean architecture
   - Type safety
   - Error handling
   - Testing coverage

3. **UI Implementation**
   - Responsive design
   - State management
   - Real-time updates
   - User experience

4. **Operational Excellence**
   - Docker setup
   - Documentation
   - Testing approach
   - Deployment strategy

## License

MIT 