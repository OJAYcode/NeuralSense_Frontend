# NeuralSense Frontend - Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git (for version control)

## Local Development Setup

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   Copy `.env.local.example` to `.env.local`:

   ```bash
   copy .env.local.example .env.local
   ```

   Update the API URL in `.env.local`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

4. **Build for Production**

   ```bash
   npm run build
   ```

5. **Start Production Server**
   ```bash
   npm start
   ```

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Set Environment Variables**

   In Vercel dashboard, add:

   - `NEXT_PUBLIC_API_BASE_URL`: Your production API URL

### Option 2: Docker Deployment

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/next.config.js ./
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next ./.next
   COPY --from=builder /app/node_modules ./node_modules
   COPY --from=builder /app/package.json ./package.json

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t neuralsense-frontend .
   docker run -p 3000:3000 neuralsense-frontend
   ```

### Option 3: Static Export

For static hosting (Netlify, GitHub Pages, etc.):

1. **Update next.config.js**

   ```javascript
   module.exports = {
     output: "export",
     images: {
       unoptimized: true,
     },
   };
   ```

2. **Build Static Files**

   ```bash
   npm run build
   ```

3. **Deploy `out/` directory to your hosting service**

## Environment Variables

| Variable                         | Description                            | Example                           |
| -------------------------------- | -------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`       | Backend API base URL                   | `https://api.neuralsense.com/api` |
| `NEXT_PUBLIC_APP_NAME`           | Application name                       | `NeuralSense`                     |
| `NEXT_PUBLIC_APP_VERSION`        | App version                            | `1.0.0`                           |
| `NEXT_PUBLIC_MAX_RECORDING_TIME` | Max voice recording duration (seconds) | `20`                              |
| `NEXT_PUBLIC_MIN_RECORDING_TIME` | Min voice recording duration (seconds) | `10`                              |

## Performance Optimization

1. **Enable Image Optimization**

   - Use Next.js Image component for all images
   - Configure image domains in `next.config.js`

2. **Enable Caching**

   - Configure CDN caching headers
   - Use service workers for offline support

3. **Code Splitting**
   - Already handled by Next.js automatically
   - Use dynamic imports for large components

## Security Checklist

- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS on backend API
- [ ] Enable Content Security Policy (CSP)
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Use secure cookies for authentication
- [ ] Keep dependencies updated

## Monitoring & Analytics

1. **Error Tracking**

   - Integrate Sentry or similar service
   - Configure error boundaries

2. **Performance Monitoring**

   - Use Vercel Analytics or Google Analytics
   - Monitor Core Web Vitals

3. **User Analytics**
   - Track user flows and conversions
   - Monitor session completion rates

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Camera/Microphone Not Working

- Ensure HTTPS is enabled (required by browser)
- Check browser permissions
- Verify getUserMedia API support

### API Connection Issues

- Check CORS configuration on backend
- Verify API URL in environment variables
- Check network firewall rules

## Support

For deployment issues or questions:

- Check documentation: [Next.js Deployment](https://nextjs.org/docs/deployment)
- Review error logs
- Contact development team

---

**Last Updated**: January 2026
