# NeuralSense Frontend - API Integration Guide

This document describes how the frontend integrates with the NeuralSense backend API.

## Base Configuration

```typescript
// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
```

## Authentication

### JWT Token Management

The API client automatically handles JWT tokens:

```typescript
// Setting token (after login/register)
apiClient.setToken(token);

// Token is stored in localStorage
// Token is automatically injected in all requests via Authorization header
```

### Guest Mode

Guest users don't receive a JWT token but can still use the application.

## API Endpoints

### Authentication Endpoints

#### Register User

```typescript
POST / auth / register;
Body: {
  name: string;
  email: string;
  password: string;
}
Response: {
  token: string;
  user: User;
}
```

#### Login User

```typescript
POST / auth / login;
Body: {
  email: string;
  password: string;
}
Response: {
  token: string;
  user: User;
}
```

#### Guest Mode

```typescript
POST / auth / guest;
Response: {
  sessionToken: string;
}
```

### Session Endpoints

#### Start Session

```typescript
POST /session/start
Headers: {
  Authorization: Bearer <token> (if authenticated)
}
Response: {
  id: string;
  userId?: string;
  startTime: string;
  status: 'started';
}
```

#### Get Session History

```typescript
GET /session/history
Headers: {
  Authorization: Bearer <token>
}
Response: HistorySession[]
```

### Analysis Endpoints

#### Analyze Face

```typescript
POST /analyze/face
Headers: {
  Authorization: Bearer <token> (if authenticated)
  Content-Type: multipart/form-data
}
Body: FormData {
  sessionId: string;
  image: Blob (JPEG format);
}
Response: 200 OK
```

#### Analyze Voice

```typescript
POST /analyze/voice
Headers: {
  Authorization: Bearer <token> (if authenticated)
  Content-Type: multipart/form-data
}
Body: FormData {
  sessionId: string;
  audio: Blob (WebM format);
}
Response: 200 OK
```

#### Get Stress Analysis

```typescript
POST /analyze/session
Headers: {
  Authorization: Bearer <token> (if authenticated)
}
Body: {
  sessionId: string;
}
Response: {
  sessionId: string;
  stressLevel: 'low' | 'moderate' | 'high';
  confidence: number; // 0-1
  faceAnalysis: {
    emotion: string;
    confidence: number;
    features?: Record<string, number>;
  };
  voiceAnalysis: {
    tone: string;
    confidence: number;
    features?: Record<string, number>;
  };
  feedback: string;
  timestamp: string;
}
```

## Error Handling

The API client includes automatic error handling:

```typescript
// Network errors
{
  message: 'Unable to connect to server...',
  code: 'NETWORK_ERROR'
}

// HTTP errors
{
  message: 'Invalid request. Please check your input.',
  code: 'HTTP_400',
  details: {...}
}

// Authentication errors
{
  message: 'Authentication required. Please log in.',
  code: 'HTTP_401'
}
```

## Retry Logic

The API client automatically retries failed requests:

- Face analysis: 2 retries
- Voice analysis: 2 retries
- Final analysis: 3 retries
- Exponential backoff delay

## Usage Examples

### Starting a Session

```typescript
import { apiClient } from "@/lib/api";

const session = await apiClient.startSession();
console.log("Session ID:", session.id);
```

### Uploading Face Image

```typescript
import { apiClient } from "@/lib/api";

// Capture image from canvas
canvas.toBlob(
  async (blob) => {
    if (blob) {
      await apiClient.analyzeFace(sessionId, blob);
    }
  },
  "image/jpeg",
  0.9
);
```

### Recording and Uploading Voice

```typescript
import { apiClient } from "@/lib/api";

// After MediaRecorder stops
mediaRecorder.onstop = async () => {
  const audioBlob = new Blob(chunks, { type: "audio/webm" });
  await apiClient.analyzeVoice(sessionId, audioBlob);
};
```

### Getting Results

```typescript
import { apiClient } from "@/lib/api";

const result = await apiClient.getStressAnalysis(sessionId);
console.log("Stress Level:", result.stressLevel);
console.log("Confidence:", result.confidence);
```

## CORS Configuration

The backend must allow these headers:

```
Access-Control-Allow-Origin: <frontend-domain>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## File Upload Specifications

### Image Requirements

- Format: JPEG
- Quality: 0.9 compression
- Captured from: HTMLCanvasElement
- Expected size: ~100-500 KB

### Audio Requirements

- Format: WebM (with Opus codec)
- Duration: 10-20 seconds
- Sample rate: Browser default (typically 48kHz)
- Expected size: ~200-800 KB

## Rate Limiting

If implementing rate limiting on backend:

- Display user-friendly error messages
- Provide retry-after information
- Consider implementing client-side throttling

## Testing API Integration

### Mock Backend for Development

```typescript
// For testing without backend
if (process.env.NODE_ENV === "development") {
  // Mock API responses
  apiClient.analyzeFace = async () => {
    await sleep(1000);
    return Promise.resolve();
  };
}
```

### Environment-Specific URLs

```bash
# Development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.neuralsense.com/api

# Production
NEXT_PUBLIC_API_BASE_URL=https://api.neuralsense.com/api
```

## Security Best Practices

1. **Never expose sensitive data in frontend code**
2. **Always use HTTPS in production**
3. **Validate responses before using**
4. **Handle token expiration gracefully**
5. **Sanitize user inputs before sending**
6. **Implement CSRF protection if using cookies**

---

For backend API documentation, refer to the backend repository.
