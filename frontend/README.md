 # F&B Admin Dashboard

A modern admin dashboard for managing restaurants, menus, and orders.

## Features

- Restaurant Management
  - View all restaurants
  - Add new restaurants
  - Edit restaurant details
  - Delete restaurants

- Menu Management
  - Create and manage menu categories
  - Add, edit, and delete menu items
  - Organize items by categories

- Order Management
  - Real-time order updates
  - View order details
  - Update order status
  - Track order history

## Tech Stack

- Next.js 13
- React 18
- Material-UI
- React Query
- Zustand
- Socket.IO Client
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_WS_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production

```bash
npm start
# or
yarn start
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Next.js pages
│   ├── services/      # API services
│   ├── store/         # Zustand store
│   ├── theme/         # Material-UI theme
│   └── types/         # TypeScript types
├── public/            # Static files
└── package.json       # Dependencies and scripts
```

## Development

### Code Style

- Follow the TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Keep components small and focused

### Testing

```bash
npm test
# or
yarn test
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## Docker

Build and run the application using Docker:

```bash
docker build -t f-and-b-admin .
docker run -p 3000:3000 f-and-b-admin
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.