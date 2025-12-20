# 🎓 Shikshak Auth Service

A robust authentication microservice for the Shikshak educational platform, built with **Node.js**, **Better Auth**, and **MongoDB**.

## 🏗️ Architecture Overview

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Applications"]
        WEB[Web App]
        MOBILE[Mobile App]
        TEST[Test Page]
    end

    subgraph AuthService["🔐 Auth Service :3000"]
        SERVER[HTTP Server]
        BETTER_AUTH[Better Auth]
        ROUTES[Route Handler]
    end

    subgraph ExternalProviders["🌐 OAuth Providers"]
        GOOGLE[Google OAuth 2.0]
    end

    subgraph Database["💾 MongoDB Atlas"]
        USERS[(Users)]
        SESSIONS[(Sessions)]
        ACCOUNTS[(Accounts)]
    end

    WEB & MOBILE & TEST --> SERVER
    SERVER --> ROUTES
    ROUTES --> BETTER_AUTH
    BETTER_AUTH <--> GOOGLE
    BETTER_AUTH <--> USERS & SESSIONS & ACCOUNTS

    style AuthService fill:#1a1a3e,stroke:#667eea,color:#fff
    style Client fill:#0f0f23,stroke:#34d399,color:#fff
    style ExternalProviders fill:#0f0f23,stroke:#f59e0b,color:#fff
    style Database fill:#0f0f23,stroke:#764ba2,color:#fff
```

---

## 🔄 Authentication Flow

### Google OAuth Sign-In Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant C as 🖥️ Client
    participant A as 🔐 Auth Service
    participant G as 🌐 Google OAuth
    participant DB as 💾 MongoDB

    U->>C: Click "Sign in with Google"
    C->>A: signIn.social({ provider: "google" })
    A->>G: Redirect to Google Auth
    G->>U: Show Google Login Page
    U->>G: Enter Credentials & Consent
    G->>A: Callback with Auth Code
    A->>G: Exchange Code for Tokens
    G-->>A: Access Token + User Info
    A->>DB: Create/Update User & Session
    DB-->>A: User + Session Data
    A->>C: Redirect with Session Cookie
    C->>U: Show Logged In State ✅
```

---

## 🛡️ Session Management

```mermaid
stateDiagram-v2
    [*] --> Anonymous: Visit Site
    Anonymous --> Authenticating: Click Sign In
    Authenticating --> Authenticated: OAuth Success
    Authenticating --> Anonymous: OAuth Failed
    Authenticated --> SessionActive: Session Created
    SessionActive --> SessionActive: API Requests (with cookie)
    SessionActive --> Anonymous: Sign Out
    SessionActive --> SessionExpired: Token Expires
    SessionExpired --> Authenticating: Re-authenticate

    note right of SessionActive
        Session stored in MongoDB
        Cookie sent with each request
    end note
```

---

## 👥 User Role System

```mermaid
erDiagram
    USER ||--o| TEACHER : "can be"
    USER ||--o| STUDENT : "can be"
    USER ||--o| PARENT : "can be"
    
    USER {
        string id PK
        string email UK
        string name
        boolean emailVerified
        string image
        string role
        string phoneNumber
        date createdAt
        date updatedAt
    }
    
    TEACHER {
        array subjects
        array qualifications
        array experiences
        array classes
    }
    
    STUDENT {
        string class
        string courseId
    }
    
    PARENT {
        string referId
    }

    SESSION {
        string id PK
        string userId FK
        string token
        date expiresAt
    }

    ACCOUNT {
        string id PK
        string userId FK
        string provider
        string providerAccountId
    }

    USER ||--o{ SESSION : "has"
    USER ||--o{ ACCOUNT : "has"
```

---

## 📁 Project Structure

```
Backend/Auth/
├── 📄 src/
│   ├── auth.ts              # Better Auth configuration
│   ├── server.ts            # HTTP server & routing
│   ├── config/
│   │   └── db.ts            # MongoDB connection
│   ├── controllers/
│   │   └── userController.ts # Profile update handler
│   ├── models/
│   │   └── User.ts          # User & role discriminators
│   └── utils/
│       └── httpUtils.ts     # CORS & body parsing
├── 📄 public/
│   └── index.html           # Auth test page
├── 📄 .env                  # Environment variables
├── 📄 package.json
└── 📄 README.md
```

---

## 🔌 API Endpoints

```mermaid
flowchart LR
    subgraph BetterAuth["Better Auth Endpoints"]
        A1["/api/auth/signin/google"]
        A2["/api/auth/callback/google"]
        A3["/api/auth/get-session"]
        A4["/api/auth/list-sessions"]
        A5["/api/auth/sign-out"]
    end

    subgraph Custom["Custom Endpoints"]
        C1["/api/user/update-profile"]
    end

    subgraph Static["Static Files"]
        S1["/ → index.html"]
    end

    style BetterAuth fill:#667eea,stroke:#333,color:#fff
    style Custom fill:#34d399,stroke:#333,color:#000
    style Static fill:#f59e0b,stroke:#333,color:#000
```

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signin/google` | GET | Initiate Google OAuth flow |
| `/api/auth/callback/google` | GET | OAuth callback handler |
| `/api/auth/get-session` | GET | Get current user session |
| `/api/auth/list-sessions` | GET | List all active sessions |
| `/api/auth/sign-out` | POST | Sign out current session |
| `/api/user/update-profile` | POST | Update user profile & role |

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit with your credentials
```

**Required Environment Variables:**

```env
MONGO_URI="mongodb+srv://..."
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
PORT=3000
BETTER_AUTH_SECRET="minimum-32-character-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add **Authorized redirect URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### 4. Run Development Server

```bash
pnpm dev
```

### 5. Test Authentication

Open [http://localhost:3000](http://localhost:3000) and click **"Sign in with Google"**

---

## 🔐 Security Features

```mermaid
mindmap
  root((Security))
    Session Management
      Secure Cookies
      Token Rotation
      Session Expiry
    OAuth 2.0
      Google Provider
      PKCE Flow
      State Validation
    Database
      MongoDB Atlas
      Encrypted Connection
      User Isolation
    API
      CORS Headers
      Request Validation
      Error Handling
```

---

## 📊 Data Flow

```mermaid
flowchart TD
    subgraph Request["📥 Incoming Request"]
        R1[HTTP Request]
    end

    subgraph Processing["⚙️ Processing"]
        P1{Route Check}
        P2[Better Auth Handler]
        P3[Custom Controller]
        P4[Static File Server]
    end

    subgraph Response["📤 Response"]
        RES[HTTP Response]
    end

    R1 --> P1
    P1 -->|/api/auth/*| P2
    P1 -->|/api/user/*| P3
    P1 -->|Static Files| P4
    P2 & P3 & P4 --> RES

    style Request fill:#764ba2,stroke:#333,color:#fff
    style Processing fill:#667eea,stroke:#333,color:#fff
    style Response fill:#34d399,stroke:#333,color:#000
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Get Session
curl http://localhost:3000/api/auth/get-session \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Update Profile
curl -X POST http://localhost:3000/api/user/update-profile \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{"role": "teacher", "subjects": ["Math", "Physics"]}'
```

---

## 📝 License

MIT © Shikshak Team
