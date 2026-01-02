# NeuralSense Frontend - Quick Start Guide

Welcome to NeuralSense! This guide will help you get the application running in minutes.

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Zustand
- Recharts

### Step 2: Configure Environment

The `.env.local` file is already set up with default values:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

**Important**: Update the API URL if your backend runs on a different address.

### Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the NeuralSense landing page! 🎉

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js 18.x or higher** - [Download here](https://nodejs.org/)
- ✅ **npm** (comes with Node.js) or yarn
- ✅ **Modern browser** (Chrome, Firefox, Edge, Safari)
- ✅ **Camera and microphone** (for stress detection)

Check your Node.js version:

```bash
node --version
```

## 🏗️ Project Structure Overview

```
NeuralSense_Frontend/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page (/)
│   ├── consent/           # Consent page
│   ├── session/           # Stress session page
│   ├── results/           # Results page
│   ├── history/           # History page
│   └── auth/              # Authentication pages
├── components/            # Reusable components
│   ├── CameraCapture.tsx
│   ├── AudioRecorder.tsx
│   ├── StressBadge.tsx
│   ├── FeedbackCard.tsx
│   ├── Loader.tsx
│   └── ConsentModal.tsx
├── lib/                   # Core utilities
│   ├── api.ts            # API client
│   ├── store.ts          # State management
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript definitions
└── public/                # Static assets
```

## 🎯 Testing the Application

### 1. Test Landing Page

- Navigate to `http://localhost:3000`
- Should see hero section with "Start Stress Check" button

### 2. Test Guest Mode

- Click "Start Stress Check"
- Review and accept consent
- Verify camera and microphone permissions

### 3. Test Session Flow

- **Face Capture**: Click "Capture Photo"
- **Voice Recording**: Record 10-20 seconds
- **Results**: View stress analysis

### 4. Test Authentication (Optional)

- Go to `/auth/register`
- Create an account
- Login and view history at `/history`

## 🔧 Common Issues & Solutions

### Issue: Port 3000 already in use

**Solution**: Use a different port

```bash
PORT=3001 npm run dev
```

### Issue: Camera/Microphone not working

**Solutions**:

1. Grant browser permissions when prompted
2. Use HTTPS in production (required by browsers)
3. Check browser console for specific errors
4. Ensure no other app is using camera/mic

### Issue: API connection failed

**Solutions**:

1. Verify backend is running
2. Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Verify CORS settings on backend
4. Check network/firewall settings

### Issue: Build errors

**Solution**: Clear cache and reinstall

```bash
rmdir /s /q .next node_modules
npm install
npm run dev
```

## 📱 Browser Compatibility

| Browser | Minimum Version | Camera Support | Voice Support |
| ------- | --------------- | -------------- | ------------- |
| Chrome  | 90+             | ✅             | ✅            |
| Firefox | 88+             | ✅             | ✅            |
| Safari  | 14+             | ✅             | ✅            |
| Edge    | 90+             | ✅             | ✅            |

## 🔐 Security Requirements

For production deployment:

1. **HTTPS Required**: Camera/microphone APIs require secure context
2. **Environment Variables**: Never commit `.env.local` to version control
3. **API Security**: Ensure backend has proper CORS and authentication

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 🎓 Academic Demo Tips

For presentations and demos:

1. **Test Before Demo**: Ensure camera/mic work
2. **Use Guest Mode**: Quick demo without account creation
3. **Prepare Fallback**: Have screenshots if live demo fails
4. **Network Stable**: Use wired connection if possible
5. **Close Other Apps**: Free up camera/microphone resources

## 📚 Additional Resources

- **README.md**: Full project documentation
- **API_INTEGRATION.md**: Backend API details
- **DEPLOYMENT.md**: Production deployment guide
- **CONTRIBUTING.md**: Development guidelines

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors (F12)
2. Review error messages carefully
3. Check backend server logs
4. Verify environment configuration
5. Try in incognito/private mode
6. Test in different browser

## 🎉 You're Ready!

The application should now be running at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000 (configure as needed)

Navigate to the landing page and click "Start Stress Check" to begin!

---

**Need help?** Check the documentation files or contact the development team.

**Good luck with your project!** 🧠💙
