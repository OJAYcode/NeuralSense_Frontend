# NeuralSense Frontend

A web-based student stress detection application using facial expression and voice analysis.

## 🎓 Academic Project

This is a Computer Science final year project that demonstrates real-time stress detection using:

- Facial expression analysis via device camera
- Voice analysis via device microphone
- Machine learning backend integration
- Privacy-aware, ethical design principles

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Charts**: Recharts
- **Web APIs**: getUserMedia(), MediaRecorder

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Modern browser (Chrome, Firefox, Edge, Safari)
- Camera and microphone access

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd NeuralSense_Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
NeuralSense_Frontend/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Landing page (/)
│   ├── consent/             # Consent page
│   ├── session/             # Stress session page
│   ├── results/             # Results page
│   ├── history/             # History page
│   └── auth/                # Authentication pages
├── components/              # Reusable components
│   ├── CameraCapture.tsx
│   ├── AudioRecorder.tsx
│   ├── StressBadge.tsx
│   ├── FeedbackCard.tsx
│   ├── Loader.tsx
│   └── ConsentModal.tsx
├── lib/                     # Utilities and services
│   ├── api.ts              # Axios API client
│   └── store.ts            # Zustand state management
├── types/                   # TypeScript type definitions
└── public/                  # Static assets

```

## 🔑 Key Features

### 1. Landing Page

- Clear explanation of NeuralSense
- Ethical disclaimer
- Privacy assurance
- Call-to-action

### 2. Authentication

- Guest mode (primary)
- Optional account creation
- JWT token management

### 3. Consent & Permissions

- Explicit camera/microphone consent
- Clear data usage explanation
- User-controlled access

### 4. Stress Session

- Multi-step analysis flow
- Real-time camera preview
- Audio recording with visual feedback
- Loading states and progress indicators

### 5. Results & Feedback

- Stress level visualization (Low/Moderate/High)
- Confidence indicators
- Personalized, calming feedback
- No medical claims

### 6. History & Trends

- Session timeline
- Stress trend visualization
- Historical data charts

## 🎨 Design Principles

- **Minimal Cognitive Load**: Simple, clear interfaces
- **Calming Aesthetics**: Soft colors, gentle transitions
- **Step-by-Step Flow**: Guided user experience
- **Explicit Consent**: No hidden data collection
- **Non-Alarming Language**: Supportive, not diagnostic

## 🔒 Privacy & Ethics

- No data stored without consent
- Clear explanations of data usage
- Advisory insights only (not medical diagnosis)
- Camera/microphone access requested explicitly
- User can deny permissions at any time

## 📊 API Integration

Backend endpoints integrated:

- `POST /api/session/start` - Start new session
- `POST /api/analyze/face` - Analyze facial expression
- `POST /api/analyze/voice` - Analyze voice recording
- `POST /api/analyze/session` - Get final stress analysis
- `GET /api/session/history` - Retrieve past sessions
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 🧪 Testing

Test the application:

1. Grant camera and microphone permissions
2. Complete a stress session
3. View results and feedback
4. Check stress history

## 🚀 Deployment

Build for production:

```bash
npm run build
npm start
```

## 📝 Academic Notes

**Disclaimer**: NeuralSense provides supportive insights and does not replace professional evaluation. This is an educational project demonstrating AI/ML integration in web applications.

## 🤝 Contributing

This is an academic project. For questions or collaboration, please contact the project team.

## 📄 License

Academic use only. All rights reserved.

---

**Built with care for student well-being** 💙
