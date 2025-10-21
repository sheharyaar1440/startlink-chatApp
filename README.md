# Chat Application

A modern, modular chat application built with React, TypeScript, Vite, and Tailwind CSS. This application uses JSON Server as a dummy backend with a pluggable architecture designed for easy migration to real APIs or WebSocket connections.

## Features

- 🔐 **Authentication System** - Login with email/password validation
- 💬 **Real-time Chat** - Pluggable transport layer (Polling, WebSocket, SSE)
- 🤖 **AI Agent Support** - Gen AI auto-replies or human agent responses
- 🔍 **Smart Filtering** - Search by phone number and filter by chat status
- 📱 **Responsive Design** - Modern UI with Tailwind CSS
- 🎯 **Type Safety** - Full TypeScript support
- 🔌 **Modular Architecture** - Easy to extend and maintain

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Date Formatting**: Day.js
- **Backend (Mock)**: JSON Server

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Toast.tsx
│   ├── Loader.tsx
│   └── ...
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   │   └── LoginPage.tsx
│   └── chat/          # Chat functionality
│       ├── ChatLayout.tsx
│       ├── ConsigneeList.tsx
│       ├── ChatWindow.tsx
│       └── ReplyBar.tsx
├── hooks/             # Custom React hooks
│   ├── useAuth.ts
│   ├── useToast.ts
│   └── useDebounce.ts
├── services/          # API and external services
│   ├── api/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   └── chatService.ts
│   └── realtime/      # Pluggable realtime layer
│       ├── transport.ts
│       ├── PollingTransport.ts
│       ├── WebSocketTransport.ts
│       └── SseTransport.ts
├── types/             # TypeScript type definitions
│   └── index.ts
└── utils/             # Utility functions
    └── validation.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or you're already in it)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install JSON Server globally** (or use npx):
   ```bash
   npm install -g json-server
   ```

### Running the Application

1. **Start JSON Server** (in one terminal):
   ```bash
   npx json-server --watch db.json --port 5000
   ```

   This will start the mock API server at `http://localhost:5000`

2. **Start the development server** (in another terminal):
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or another port if 5173 is busy)

### Demo Credentials

- **Email**: `user@example.com`
- **Password**: `123456`

## Features in Detail

### Authentication

- Email and password validation
- Client-side form validation
- Token storage in localStorage
- Protected routes

### Chat System

- **Consignee List**: View all chats with search and filter options
- **Search**: Filter by phone number (debounced)
- **Status Filter**: Filter by open/closed chats
- **Real-time Updates**: Messages update automatically via polling

### Agent Types

1. **Gen AI Agent** 🤖
   - Automatically responds to messages
   - Input is disabled for human agents
   - Simulated 1-2 second response delay

2. **Human Agent** 👤
   - Manual message replies
   - Full input capability

### Realtime Transport Layer

The application uses a pluggable architecture for real-time message updates:

#### Current Implementation: Polling
- Polls the API every 3 seconds for new messages
- Automatic deduplication by message ID
- Works with JSON Server out of the box

#### Future Options

**WebSocket Transport** (Stub included):
```typescript
// In .env
VITE_REALTIME_TRANSPORT=ws
VITE_WS_URL=ws://api.example.com/realtime
```

**Server-Sent Events (SSE)** (Stub included):
```typescript
// In .env
VITE_REALTIME_TRANSPORT=sse
VITE_SSE_URL=http://api.example.com/sse
```

The transport can be switched by changing the environment variable - **no code changes required**.

## Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Realtime Transport Configuration
# Options: polling | ws | sse
VITE_REALTIME_TRANSPORT=polling

# WebSocket URL (when using ws transport)
# VITE_WS_URL=ws://localhost:5000/realtime

# SSE URL (when using sse transport)
# VITE_SSE_URL=http://localhost:5000/sse
```

## Switching to Real Backend

### 1. Update API Client

The application uses a centralized API client in `src/services/api/apiClient.ts`. All requests go through this single axios instance.

To switch to a real backend:

1. Update the `.env` file:
   ```env
   VITE_API_URL=https://your-api.com/api
   ```

2. If your API requires authentication tokens, uncomment the auth header logic in `apiClient.ts`:
   ```typescript
   const token = localStorage.getItem('token');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```

### 2. Update Authentication

Modify `src/services/api/authService.ts` to match your backend's authentication endpoints and response format.

### 3. Switch to WebSocket/SSE

When your backend supports WebSocket or SSE:

1. Update `.env`:
   ```env
   VITE_REALTIME_TRANSPORT=ws
   VITE_WS_URL=wss://your-api.com/realtime
   ```

2. Update the transport implementation in `src/services/realtime/WebSocketTransport.ts` to match your backend's message format.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints (JSON Server)

### Users
- `GET /users?email={email}&password={password}` - Login

### Consignees
- `GET /consignees` - Get all consignees
- `PATCH /consignees/:id` - Update consignee status

### Chats
- `GET /chats?consigneeId={id}` - Get messages for a consignee
- `GET /chats?consigneeId={id}&timestamp_gte={timestamp}` - Get new messages since timestamp
- `POST /chats` - Send a new message

## Sample Data

The `db.json` file includes:
- 1 test user
- 4 sample consignees (2 with Gen AI, 2 with human agents)
- Sample chat messages

You can modify `db.json` to add more data as needed.

## Future Enhancements

- [ ] Dark mode support
- [ ] File/image attachments
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] User presence (online/offline)
- [ ] Message reactions
- [ ] Chat archives
- [ ] Advanced filters (date range, keywords)

## Architecture Highlights

### Modular Design
- Feature-based folder structure
- Separation of concerns
- Reusable components

### Type Safety
- Comprehensive TypeScript types
- Type inference throughout

### Flexible Backend
- Single API client for all requests
- Environment-based configuration
- Pluggable realtime layer

### State Management
- Zustand for global state
- React hooks for local state
- No prop drilling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
