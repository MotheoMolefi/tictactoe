# 🎮 TicTacToe - Multiplayer Game Platform

A modern, full-stack TicTacToe game built with Next.js 15, TypeScript, and Supabase. Features real-time authentication, beautiful UI animations, and a complete game management system.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with email OTP verification
- 🎨 **Modern UI** - Built with Tailwind CSS and Framer Motion animations
- 🌓 **Dark Mode** - Theme toggle with persistent user preferences
- 💾 **Database Integration** - PostgreSQL via Supabase for game state and user data
- 🔄 **Session Management** - Secure middleware-based authentication
- 📧 **Custom Email Templates** - Beautiful verification emails
- ⚡ **Optimized Performance** - Built with Next.js 15 App Router and Turbopack

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15.3.2 (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn/ui Components

**Backend:**
- Supabase (PostgreSQL + Auth)
- Next.js API Routes
- Server Actions

**Development:**
- Bun runtime
- ESLint
- Turbopack

## 📦 Project Structure

```
tictactoe/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── api/               # API routes
│   ├── login/             # Login page
│   ├── signup/            # Signup with OTP verification
│   └── home/              # Protected game page
├── components/            # Reusable UI components
│   └── ui/               # Shadcn components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client configuration
├── models/               # TypeScript models/types
├── middleware.ts         # Auth middleware
└── next.config.ts        # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account
- PostgreSQL (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tictactoe
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Server-side variables
   SUPABASE_URL=your-supabase-url
   SUPABASE_API_KEY=your-supabase-anon-key

   # Client-side variables (needed for browser code)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the database migrations (tables: `games`, `profiles`)
   - Configure Auth settings:
     - Enable Email provider
     - Set Email OTP length to 6 digits
     - Customize email templates (optional)

5. **Run the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Key Learnings & Skills Demonstrated

### Technical Skills
- **Full-Stack Development**: End-to-end application with frontend, backend, and database
- **Modern React**: Server Components, Client Components, and the App Router pattern
- **Authentication Flow**: Implementing secure OTP-based email verification
- **Database Design**: Relational data modeling with PostgreSQL
- **API Development**: RESTful endpoints and server actions
- **Type Safety**: Comprehensive TypeScript usage throughout the codebase
- **Middleware**: Request/response handling for authentication

### Development Practices
- Environment variable management
- Security best practices (credential storage, auth patterns)
- Code organization and project structure
- Error handling and user feedback
- Responsive design and accessibility

## 📝 Database Schema

```sql
-- Users (managed by Supabase Auth)
-- Profiles table
profiles (
  id UUID PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMP
)

-- Games table
games (
  id UUID PRIMARY KEY,
  player_x UUID REFERENCES profiles(id),
  player_o UUID REFERENCES profiles(id),
  board JSONB,
  winner UUID,
  status TEXT,
  created_at TIMESTAMP
)
```

## 🔧 Configuration

### Supabase Auth Settings
- **Email OTP Length**: 6 digits
- **OTP Expiration**: 3600 seconds (60 minutes)
- **Email Templates**: Custom HTML templates with branding

### Next.js Configuration
- **TypeScript**: Strict mode enabled
- **Turbopack**: Enabled for faster development builds
- **Environment Variables**: Separated for server/client contexts

## 🚢 Deployment

This project is ready to deploy on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any Node.js hosting platform**

Make sure to set environment variables in your deployment platform.

## 📚 What I Learned

- Integrating Supabase with Next.js 15 App Router
- Implementing secure authentication flows
- Managing environment variables in different contexts (server vs client)
- Database restoration and migration
- Troubleshooting deployment issues
- Version compatibility (Next.js 15 vs 16 canary issues)

## 👨‍💻 Author

**Motheo Molefi**
- Email: motheo0220@gmail.com
- Building full-stack applications with modern web technologies

## 📄 License

This project was created as part of a mentorship program and portfolio demonstration.

---

*Built with ❤️ using Next.js, TypeScript, and Supabase*
