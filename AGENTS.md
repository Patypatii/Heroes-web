# Heroes Loan App - Web Frontend

A React frontend application for the Heroes Loan App, featuring React Router 6 SPA mode, TypeScript, Vite, and TailwindCSS 3.

This frontend connects to the backend API server for all data operations.

## Tech Stack

- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Separate Express API server (see ../backend/)
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

shared/                   # Types used by both client & backend
└── api.ts                # Shared API interfaces

../backend/               # Express API backend (separate project)
├── src/                  # Backend source code
├── routes/               # API handlers
└── models/               # Database models
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Backend API Integration

- **Development**: Frontend runs on port 8080, backend on port 5001
- **API Proxy**: Vite proxies `/api/*` requests to backend server
- **API endpoints**: All prefixed with `/api/`

#### Backend API Routes (../backend/)
- `POST /api/auth/*` - Authentication endpoints
- `POST /api/uploads/*` - File upload endpoints  
- `POST /api/applications/*` - Loan application endpoints
- `GET /api/loans/*` - Loan management endpoints
- `GET /api/savings/*` - Savings endpoints
- `GET /api/transactions/*` - Transaction endpoints

### Shared Types
Import consistent types in both client and backend:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
npm run dev        # Start frontend dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run typecheck  # TypeScript validation
npm test          # Run Vitest tests
```

## Backend Development

To run the full application:

```bash
# Terminal 1 - Start Backend
cd ../backend
npm install
npm run server

# Terminal 2 - Start Frontend  
cd web
npm install
npm run dev
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route (Backend)
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `../backend/src/routes/my-route.js`:
```javascript
import { RequestHandler } from "express";
// import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute = (req, res) => {
  const response = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `../backend/src/server.js`:
```javascript
import { handleMyRoute } from "./routes/my-route.js";

// Add to the app:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Frontend**: `npm run build` - builds to `dist/spa/`
- **Backend**: Deploy separately (see ../backend/README.md)
- **Static Hosting**: Deploy `dist/spa/` to any static host (Netlify, Vercel, etc.)
- **API**: Deploy backend to any Node.js hosting (Railway, Render, etc.)

## Architecture Notes

- **Frontend**: React SPA with Vite build system
- **Backend**: Separate Express API server
- **Communication**: HTTP API calls with proxy in development
- **TypeScript**: Frontend uses TypeScript, Backend uses JavaScript
- **Hot Reload**: Frontend hot reload via Vite
- **Type Safety**: Shared types between frontend and backend
- **UI Library**: Comprehensive Radix UI + TailwindCSS component library
