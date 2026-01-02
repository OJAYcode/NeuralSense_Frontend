# NeuralSense Frontend - Project Structure

## 📂 Directory Layout

```
NeuralSense_Frontend/
│
├── app/                            # Next.js App Router
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Landing page (/)
│   ├── globals.css                # Global styles
│   ├── loading.tsx                # Global loading UI
│   ├── error.tsx                  # Global error UI
│   ├── not-found.tsx              # 404 page
│   │
│   ├── auth/                      # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── consent/                   # Consent flow
│   │   └── page.tsx              # Consent page
│   │
│   ├── session/                   # Stress detection session
│   │   └── page.tsx              # Session page (main flow)
│   │
│   ├── results/                   # Analysis results
│   │   └── page.tsx              # Results page
│   │
│   └── history/                   # Session history
│       └── page.tsx              # History page
│
├── components/                    # Reusable React components
│   ├── AudioRecorder.tsx         # Voice recording component
│   ├── CameraCapture.tsx         # Camera capture component
│   ├── ConsentModal.tsx          # Consent dialog
│   ├── FeedbackCard.tsx          # Stress feedback display
│   ├── Loader.tsx                # Loading spinner
│   └── StressBadge.tsx           # Stress level indicator
│
├── lib/                           # Core utilities and logic
│   ├── api.ts                    # Axios API client
│   ├── store.ts                  # Zustand state stores
│   └── utils.ts                  # Helper functions
│
├── types/                         # TypeScript type definitions
│   └── index.ts                  # All app types
│
├── public/                        # Static assets
│   └── (images, icons, etc.)
│
├── .env.local                     # Environment variables (local)
├── .env.local.example            # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
├── postcss.config.js             # PostCSS config
├── package.json                  # Dependencies and scripts
│
├── README.md                      # Main documentation
├── QUICKSTART.md                 # Quick start guide
├── API_INTEGRATION.md            # API integration docs
├── DEPLOYMENT.md                 # Deployment guide
└── CONTRIBUTING.md               # Contribution guidelines
```

## 🗂️ File Organization Principles

### 1. **Pages** (`app/` directory)

- Each route has its own folder
- `page.tsx` exports the route component
- Nested routes use nested folders
- Special files: `layout.tsx`, `loading.tsx`, `error.tsx`

### 2. **Components** (`components/` directory)

- Reusable UI components
- Self-contained with props interface
- Named exports for tree-shaking
- Co-locate styles using Tailwind

### 3. **Utilities** (`lib/` directory)

- Business logic and helpers
- API client and state management
- Pure functions without side effects
- Shared across multiple components

### 4. **Types** (`types/` directory)

- TypeScript interfaces and types
- Centralized type definitions
- Imported throughout the app

## 📄 Key Files Explained

### `app/layout.tsx`

- Root layout wrapper
- Metadata configuration
- Font loading
- Global providers

### `app/page.tsx`

- Landing page
- Hero section
- Feature highlights
- Call-to-action

### `app/session/page.tsx`

- Main stress detection flow
- Multi-step process
- Face and voice capture
- Progress tracking

### `lib/api.ts`

- Axios HTTP client
- Authentication handling
- Error interceptors
- Retry logic

### `lib/store.ts`

- Zustand state management
- Auth store
- Session store
- Consent store
- History store

### `components/CameraCapture.tsx`

- Camera access via getUserMedia
- Live video preview
- Image capture from canvas
- Permission handling

### `components/AudioRecorder.tsx`

- Microphone access
- MediaRecorder API
- Audio visualization
- Duration constraints

### `types/index.ts`

- User types
- Session types
- Analysis result types
- API response types

## 🎨 Styling Architecture

### Tailwind CSS Utility Classes

```typescript
// Component styling
<div className="px-4 py-2 bg-primary-500 rounded-lg">
```

### Custom Theme Configuration

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: { ... },
      calm: { ... },
      stress: { low, moderate, high }
    }
  }
}
```

### Global Styles

```css
/* app/globals.css */
- Tailwind directives
- Custom scrollbar
- Focus styles
- Animations
```

## 🔄 Data Flow

### 1. Authentication Flow

```
User Input → API Client → Backend
         ← JWT Token ←
Store in Zustand → localStorage
```

### 2. Session Flow

```
Start Session → Get Session ID
Capture Face → Upload Image → Backend Analysis
Record Voice → Upload Audio → Backend Analysis
Get Results → Display to User
```

### 3. State Management

```
Zustand Store (Global State)
    ↓
React Components (Local State)
    ↓
User Actions → API Calls → State Updates
```

## 🔐 Security Considerations

### Environment Variables

- Prefix with `NEXT_PUBLIC_` for client-side access
- Never commit `.env.local` to version control
- Use different values for dev/staging/prod

### Authentication

- JWT tokens stored in localStorage
- Tokens injected in Authorization header
- Automatic token clearing on logout

### Media Permissions

- Explicit consent required
- User can revoke at any time
- Clear explanation of data usage

## 📦 Dependencies Overview

### Core Framework

- **next**: React framework with routing
- **react**: UI library
- **react-dom**: React DOM rendering

### State & Data

- **zustand**: Lightweight state management
- **axios**: HTTP client

### UI Components

- **recharts**: Chart visualization
- **clsx**: Conditional class names

### Styling

- **tailwindcss**: Utility-first CSS
- **autoprefixer**: CSS vendor prefixes
- **postcss**: CSS processing

### TypeScript

- **typescript**: Type safety
- **@types/\***: Type definitions

## 🧪 Testing Structure (Future)

```
├── __tests__/
│   ├── components/
│   ├── lib/
│   └── pages/
└── jest.config.js
```

## 📱 Responsive Design

### Breakpoints (Tailwind)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

```typescript
// Default: mobile styles
<div className="text-sm md:text-base lg:text-lg">

// Scales up for larger screens
```

## 🚀 Build Output

### Production Build

```
npm run build
```

Creates:

- `.next/` - Optimized build files
- Static assets
- Server-side rendering setup
- Client-side JavaScript bundles

### Start Production Server

```
npm start
```

Serves from `.next/` directory

---

This structure provides:

- ✅ Clear separation of concerns
- ✅ Scalable architecture
- ✅ Easy navigation
- ✅ Type safety
- ✅ Reusable components
- ✅ Maintainable codebase
