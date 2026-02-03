# Doify - Task Management Dashboard

A modern, full-stack task management application with JWT authentication, built with Next.js 16 and Node.js/Express.

![Doify](https://img.shields.io/badge/Next.js-16-black) ![Express](https://img.shields.io/badge/Express-4.18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue)


## Features

### Authentication
- 🔐 JWT-based authentication with 7-day token expiry
- 🔒 Password hashing with bcrypt
- 🛡️ Protected routes (frontend & backend)
- ✅ Form validation (client & server side)

### Task Management
- ✨ Create, read, update, delete tasks
- 🔍 Search tasks by title or description
- 🎯 Filter by status (Pending, In Progress, Completed)
- ⚡ Filter by priority (Low, Medium, High)
- 📅 Due date support

### User Profile
- 👤 View and edit profile information
- 📧 Update email and name

### UI/UX
- 🎨 Modern design with gradients and glassmorphism
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌓 Dark mode support
- ✨ Smooth animations and transitions
- 🔔 Loading states and error handling

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TailwindCSS 4 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AlexKurian77/doify.git
cd doify
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure environment variables**

Backend (`backend/.env`):
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/doify
JWT_SECRET=your-super-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Frontend (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. **Run the application**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Profile (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user |
| PUT | `/api/profile` | Update profile |

### Tasks (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

**Query Parameters for GET /api/tasks:**
- `search` - Search in title/description
- `status` - Filter by status
- `priority` - Filter by priority

## Project Structure

```
doify/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Express app
│
└── frontend/
    └── app/
        ├── components/  # Reusable UI components
        ├── context/     # Auth context provider
        ├── dashboard/   # Protected dashboard pages
        ├── login/       # Login page
        ├── signup/      # Signup page
        └── page.tsx     # Landing page
```

## Screenshots

<img width="1919" height="1079" alt="Screenshot 2026-01-22 191125" src="https://github.com/user-attachments/assets/1928d23e-a048-4166-b424-269c69a4f9e6" />
<img width="1919" height="1079" alt="Screenshot 2026-01-22 191315" src="https://github.com/user-attachments/assets/c899af7e-ac89-4034-875b-39ca8db56727" />
<img width="1919" height="1079" alt="Screenshot 2026-01-22 191319" src="https://github.com/user-attachments/assets/43b2bd58-0642-40cf-9b9e-435fab771ee0" />
<img width="1919" height="1079" alt="Screenshot 2026-01-22 191330" src="https://github.com/user-attachments/assets/8c24c782-8e55-4342-8a50-6e92766fd565" />
<img width="1919" height="1079" alt="Screenshot 2026-01-22 191338" src="https://github.com/user-attachments/assets/e09a44a3-e10e-485e-9435-2895ab395c99" />


## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT tokens with expiration
- ✅ Protected API routes
- ✅ Protected frontend routes
- ✅ Input validation on both client and server
- ✅ CORS configured for frontend origin
- ✅ Passwords never returned in API responses

## License

MIT
