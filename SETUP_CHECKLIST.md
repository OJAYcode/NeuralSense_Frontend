# NeuralSense Frontend - Setup & Testing Checklist

Use this checklist to ensure your NeuralSense frontend is properly set up and ready for demonstration.

## ✅ Pre-Installation Checklist

- [ ] **Node.js installed** (v18.x or higher)

  ```bash
  node --version
  ```

  Expected: v18.0.0 or higher

- [ ] **npm available**

  ```bash
  npm --version
  ```

  Expected: v9.0.0 or higher

- [ ] **Modern browser installed**

  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

- [ ] **Camera available** on your device
- [ ] **Microphone available** on your device
- [ ] **Internet connection** active

## ✅ Installation Checklist

- [ ] **Clone/Download project**

  ```bash
  cd c:\Users\HP\Desktop\NeuralSense_Frontend
  ```

- [ ] **Install dependencies**

  ```bash
  npm install
  ```

  - Check for errors in terminal
  - Should complete without warnings

- [ ] **Verify .env.local exists**

  - File location: `c:\Users\HP\Desktop\NeuralSense_Frontend\.env.local`
  - Contains: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`

- [ ] **Backend API running** (if testing full integration)
  - Backend server at: `http://localhost:5000`
  - Test endpoint: `http://localhost:5000/api/health` (if available)

## ✅ Development Server Checklist

- [ ] **Start development server**

  ```bash
  npm run dev
  ```

- [ ] **Server starts successfully**

  - No error messages in terminal
  - See: "Ready - started server on 0.0.0.0:3000"

- [ ] **Open in browser**
  - Navigate to: `http://localhost:3000`
  - Landing page loads correctly

## ✅ Landing Page Verification

Navigate to: `http://localhost:3000`

- [ ] **Page loads** without errors
- [ ] **Header displays** with NeuralSense logo
- [ ] **Hero section visible**
  - Title: "Understand Your Stress..."
  - "Start Stress Check" button present
- [ ] **"How It Works" section** displays 3 steps
- [ ] **Privacy section** shows 4 features
- [ ] **Footer displays** correctly
- [ ] **Responsive design** works on mobile/desktop

## ✅ Authentication Flow Verification

### Guest Mode

- [ ] Navigate to `/auth/login`
- [ ] Click "Continue as Guest"
- [ ] Redirects to `/consent` page
- [ ] Guest status stored in Zustand

### Registration

- [ ] Navigate to `/auth/register`
- [ ] Form displays correctly
- [ ] Fill in all fields
- [ ] Submit form
- [ ] (With backend) Creates account and redirects
- [ ] (Without backend) Shows appropriate error

### Login

- [ ] Navigate to `/auth/login`
- [ ] Login form displays
- [ ] Email and password fields present
- [ ] (With backend) Login succeeds
- [ ] (Without backend) Shows connection error

## ✅ Consent Page Verification

Navigate to: `/consent`

- [ ] **Consent modal opens** automatically
- [ ] **Modal content displays**:
  - Camera access explanation
  - Microphone access explanation
  - Data processing information
  - Disclaimer text
- [ ] **"I Do Not Consent" button** works (returns to home)
- [ ] **"I Understand & Consent" button** works (redirects to session)
- [ ] **Consent stored** in localStorage

## ✅ Session Page Verification

Navigate to: `/session` (after consent)

### Step 1: Start Session

- [ ] **Start screen displays**
- [ ] "Begin Stress Check" button present
- [ ] Disclaimer visible
- [ ] Click button starts session
- [ ] (With backend) Session ID received
- [ ] Progress to face capture

### Step 2: Face Capture

- [ ] **Camera preview displays**
- [ ] Camera permission requested
- [ ] Live video stream visible
- [ ] "Capture Photo" button enabled
- [ ] Click captures image
- [ ] Flash effect on capture
- [ ] Success message shows
- [ ] Progresses to voice recording

### Step 3: Voice Recording

- [ ] **Audio visualizer displays**
- [ ] "Start Recording" button present
- [ ] Click starts recording
- [ ] Timer counts up (10-20 seconds)
- [ ] Audio level bars animate
- [ ] "Stop Recording" button appears
- [ ] Recording completes after 10+ seconds
- [ ] Progresses to analysis

### Step 4: Analysis

- [ ] **Loading screen displays**
- [ ] "Analyzing..." message shows
- [ ] Spinner animation visible
- [ ] (With backend) Redirects to results

## ✅ Results Page Verification

Navigate to: `/results?sessionId=test123` (with backend session)

- [ ] **Results page loads**
- [ ] **Stress badge displays** with level
- [ ] **Feedback card shows**:
  - Stress insight text
  - Confidence meter
  - Supportive suggestions
  - Disclaimer note
- [ ] **Analysis details show**:
  - Facial expression emotion
  - Voice pattern tone
  - Confidence percentages
- [ ] **Session info displays** with timestamp
- [ ] **Action buttons work**:
  - "Take Another Check" → `/session`
  - "View All Sessions" → `/history` (if authenticated)

## ✅ History Page Verification

Navigate to: `/history` (requires authentication)

- [ ] **Redirects to login** if not authenticated
- [ ] **Redirects to home** if guest user
- [ ] **History page loads** for authenticated users
- [ ] **Summary stats display**:
  - Total sessions
  - Latest session date
  - Average stress level
- [ ] **Trend chart displays**
- [ ] **Session list shows** past sessions
- [ ] **Empty state** shows if no sessions
- [ ] "Start First Session" button works

## ✅ Error Handling Verification

### Camera Errors

- [ ] **Deny camera permission**
  - Error message displays
  - "Retry Camera Access" button shows
  - Can retry permission

### Microphone Errors

- [ ] **Deny microphone permission**
  - Error message displays
  - User-friendly explanation

### Network Errors

- [ ] **Stop backend server**
- [ ] **Try API call**
  - Shows connection error
  - Error message is clear
  - Doesn't crash application

### 404 Page

- [ ] Navigate to `/nonexistent-page`
- [ ] Custom 404 page displays
- [ ] "Back to Home" button works

## ✅ Responsive Design Verification

### Mobile View (< 768px)

- [ ] **Landing page** responsive
- [ ] **Navigation** menu works
- [ ] **Forms** usable on mobile
- [ ] **Camera preview** fits screen
- [ ] **Buttons** properly sized
- [ ] **Text** readable

### Tablet View (768px - 1024px)

- [ ] **Layout adjusts** correctly
- [ ] **Grid layouts** stack properly
- [ ] **All features** accessible

### Desktop View (> 1024px)

- [ ] **Full layout** displays
- [ ] **Multi-column** layouts work
- [ ] **Charts** render correctly

## ✅ Browser Compatibility Verification

Test in each browser:

### Chrome

- [ ] Camera works
- [ ] Microphone works
- [ ] All pages load
- [ ] No console errors

### Firefox

- [ ] Camera works
- [ ] Microphone works
- [ ] All pages load
- [ ] No console errors

### Safari (Mac)

- [ ] Camera works
- [ ] Microphone works
- [ ] All pages load
- [ ] No console errors

### Edge

- [ ] Camera works
- [ ] Microphone works
- [ ] All pages load
- [ ] No console errors

## ✅ Performance Verification

- [ ] **Page load time** < 3 seconds
- [ ] **No memory leaks** (check DevTools)
- [ ] **Camera stream** stops when leaving page
- [ ] **Smooth animations**
- [ ] **No layout shifts**

## ✅ Security Verification

- [ ] **HTTPS used** in production
- [ ] **.env.local** not in git
- [ ] **No API keys** in frontend code
- [ ] **Tokens stored** securely
- [ ] **Input validation** works

## ✅ Accessibility Verification

- [ ] **Keyboard navigation** works
- [ ] **Tab order** logical
- [ ] **ARIA labels** present
- [ ] **Color contrast** sufficient
- [ ] **Focus indicators** visible
- [ ] **Screen reader** friendly (test with NVDA/JAWS)

## ✅ Production Build Verification

- [ ] **Build command runs**

  ```bash
  npm run build
  ```

- [ ] **Build completes** without errors
- [ ] **No TypeScript errors**
- [ ] **No ESLint warnings**

- [ ] **Production server starts**

  ```bash
  npm start
  ```

- [ ] **Production site works** at `http://localhost:3000`

## ✅ Demo Preparation Checklist

### Pre-Demo

- [ ] **Backend running** and tested
- [ ] **Frontend running** and tested
- [ ] **Camera working** and tested
- [ ] **Microphone working** and tested
- [ ] **Internet stable**
- [ ] **Browser tabs closed** (free resources)
- [ ] **Presentation mode ready**

### Demo Script Ready

- [ ] Can explain the landing page
- [ ] Can demonstrate guest mode
- [ ] Can show consent flow
- [ ] Can complete full session
- [ ] Can explain results
- [ ] Can show history (if time permits)

### Fallback Plan

- [ ] Screenshots prepared
- [ ] Video recording available
- [ ] Presentation slides ready
- [ ] Demo data pre-loaded

## ✅ Documentation Verification

- [ ] **README.md** complete and clear
- [ ] **QUICKSTART.md** tested and accurate
- [ ] **API_INTEGRATION.md** matches backend
- [ ] **DEPLOYMENT.md** has all steps
- [ ] **CONTRIBUTING.md** has guidelines

## 🎓 Final Academic Checklist

- [ ] **Code is clean** and commented
- [ ] **Project structure** is organized
- [ ] **All features** implemented
- [ ] **No critical bugs**
- [ ] **Professional appearance**
- [ ] **Ethical considerations** addressed
- [ ] **Privacy disclaimers** clear
- [ ] **Ready for supervisor review**
- [ ] **Ready for presentation**
- [ ] **Ready for defense**

---

## ✨ Ready for Demo!

If all items are checked, your NeuralSense frontend is ready for demonstration!

**Good luck with your project presentation!** 🧠💙

---

**Last Updated**: January 2026
