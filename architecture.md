# Shikshak Platform Architecture

> A comprehensive educational platform with microservices architecture, event-driven messaging, and AI-powered RAG capabilities.

---

## High-Level System Overview

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        FRONTEND["Next.js Frontend<br/>:3001"]
    end

    subgraph Gateway["API Gateway Layer"]
        GATEWAY["API Gateway<br/>:4000"]
    end

    subgraph Services["Microservices Layer"]
        AUTH["Auth Service<br/>:3000"]
        COURSES["Courses Service<br/>:4002"]
        PAYMENT["Payment Service<br/>:4003"]
        RAG_BE["RAG Backend<br/>:4005"]
    end

    subgraph AI["AI/ML Layer"]
        RAG_PY["RAG Python Service<br/>:8000"]
    end

    subgraph Messaging["Event Bus"]
        KAFKA[("Apache Kafka<br/>:9092")]
    end

    subgraph Storage["Data Layer"]
        MONGO[("MongoDB Atlas")]
        QDRANT[("Qdrant Vector DB")]
        AZURE_BLOB[("Azure Blob Storage")]
        AZURE_QUEUE[("Azure Storage Queue")]
        REDIS[("Redis Cache")]
    end

    subgraph External["External Services"]
        GOOGLE_OAUTH["Google OAuth 2.0"]
        GEMINI["Google Gemini AI"]
        RAZORPAY["Razorpay Gateway"]
    end

    FRONTEND --> GATEWAY
    GATEWAY --> AUTH
    GATEWAY --> COURSES
    GATEWAY --> PAYMENT
    GATEWAY --> RAG_BE

    AUTH <--> GOOGLE_OAUTH
    AUTH <--> MONGO

    COURSES <--> MONGO
    COURSES --> KAFKA
    COURSES --> AZURE_BLOB

    PAYMENT --> KAFKA
    PAYMENT <--> RAZORPAY

    RAG_BE --> KAFKA
    RAG_BE --> AZURE_QUEUE
    RAG_BE --> RAG_PY

    KAFKA --> RAG_BE

    RAG_PY <--> QDRANT
    RAG_PY <--> GEMINI
    RAG_PY <--> AZURE_QUEUE
    RAG_PY <--> REDIS
    RAG_PY --> AZURE_BLOB

    style Client fill:#1e293b,stroke:#3b82f6,color:#fff
    style Gateway fill:#0f172a,stroke:#8b5cf6,color:#fff
    style Services fill:#1e1b4b,stroke:#a78bfa,color:#fff
    style AI fill:#14532d,stroke:#22c55e,color:#fff
    style Messaging fill:#7c2d12,stroke:#f97316,color:#fff
    style Storage fill:#1e3a5f,stroke:#0ea5e9,color:#fff
    style External fill:#3f3f46,stroke:#fbbf24,color:#fff
```

---

## Service Communication Flow

```mermaid
flowchart LR
    subgraph FE["Frontend :3001"]
        direction TB
        F1["React/Next.js App"]
    end

    subgraph GW["Gateway :4000"]
        direction TB
        G1["Express Router"]
        G2["Auth Middleware"]
        G3["Rate Limiter"]
    end

    subgraph BE["Backend Services"]
        direction TB
        S1["Auth :3000"]
        S2["Courses :4002"]
        S3["Payment :4003"]
        S4["RAG Backend :4005"]
    end

    F1 ==>|"HTTP/HTTPS"| G1
    G1 --> G2
    G2 --> G3
    G3 ==>|"/authentication/*"| S1
    G3 ==>|"/material/*"| S2
    G3 ==>|"/payment/*"| S3
    G3 ==>|"/rag/*"| S4

    style FE fill:#1e40af,stroke:#60a5fa,color:#fff
    style GW fill:#6b21a8,stroke:#c084fc,color:#fff
    style BE fill:#0f766e,stroke:#2dd4bf,color:#fff
```

---

## Kafka Event-Driven Architecture

```mermaid
flowchart TB
    subgraph Producers["Producers"]
        P1["Courses Service"]
        P2["Payment Service"]
    end

    subgraph Topics["Kafka Topics"]
        T1["materail_data"]
        T2["payment_done"]
        T3["module_created"]
        T4["course"]
    end

    subgraph Consumers["Consumers"]
        C1["RAG Backend<br/>(material-group)"]
        C2["Courses Service<br/>(Redis Consumer)"]
    end

    subgraph Events["Event Types"]
        direction LR
        E1["video_created"]
        E2["note_created"]
        E3["video_deleted"]
        E4["note_deleted"]
        E5["payment_done"]
    end

    P1 -->|"produces"| T1
    P1 -->|"produces"| T3
    P1 -->|"produces"| T4
    P2 -->|"produces"| T2

    T1 -->|"consumes"| C1
    T2 -->|"consumes"| C2

    C1 -.->|"triggers"| E1
    C1 -.->|"triggers"| E2
    C1 -.->|"triggers"| E3
    C1 -.->|"triggers"| E4

    style Producers fill:#166534,stroke:#4ade80,color:#fff
    style Topics fill:#b45309,stroke:#fbbf24,color:#fff
    style Consumers fill:#1d4ed8,stroke:#60a5fa,color:#fff
    style Events fill:#4c1d95,stroke:#a78bfa,color:#fff
```

---

## RAG Pipeline Architecture

```mermaid
flowchart TB
    subgraph Trigger["Event Trigger"]
        VIDEO["Video Upload"]
        NOTES["Notes Upload"]
    end

    subgraph Kafka["Kafka"]
        TOPIC["materail_data topic"]
    end

    subgraph RAG_BE["RAG Backend :4005"]
        CONSUMER["Kafka Consumer<br/>(material-group)"]
        QUEUE_PUSH["Push to Azure Queue"]
    end

    subgraph Azure["Azure Cloud"]
        QUEUE["Azure Storage Queue<br/>(ingestion-jobs)"]
        BLOB["Azure Blob Storage"]
    end

    subgraph RAG_PY["RAG Python Service :8000"]
        WORKER["Worker Process"]
        INGEST["Ingest Pipeline"]
        EXTRACT["Document Extractor"]
        CHUNK["Text Chunker"]
        EMBED["Embeddings Generator"]
        QUERY["Query Handler"]
    end

    subgraph AI_Models["AI Models"]
        GEMINI["Google Gemini"]
    end

    subgraph VectorDB["Vector Database"]
        QDRANT["Qdrant<br/>HNSW Index"]
    end

    subgraph Cache["Cache"]
        REDIS["Redis"]
    end

    VIDEO --> TOPIC
    NOTES --> TOPIC
    TOPIC --> CONSUMER
    CONSUMER --> QUEUE_PUSH
    QUEUE_PUSH --> QUEUE

    QUEUE -->|"poll"| WORKER
    BLOB -->|"download"| WORKER
    WORKER --> INGEST
    INGEST --> EXTRACT
    EXTRACT --> CHUNK
    CHUNK --> EMBED
    EMBED -->|"upsert"| QDRANT

    QUERY -->|"search"| QDRANT
    QUERY -->|"generate answer"| GEMINI
    QUERY -->|"cache results"| REDIS

    REDIS -.->|"job status"| WORKER

    style Trigger fill:#166534,stroke:#4ade80,color:#fff
    style Kafka fill:#b45309,stroke:#fbbf24,color:#fff
    style RAG_BE fill:#6b21a8,stroke:#c084fc,color:#fff
    style Azure fill:#0369a1,stroke:#38bdf8,color:#fff
    style RAG_PY fill:#14532d,stroke:#22c55e,color:#fff
    style AI_Models fill:#7c3aed,stroke:#a78bfa,color:#fff
    style VectorDB fill:#be185d,stroke:#f472b6,color:#fff
    style Cache fill:#dc2626,stroke:#f87171,color:#fff
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as Frontend
    participant G as Gateway :4000
    participant A as Auth :3000
    participant GO as Google OAuth
    participant M as MongoDB

    U->>F: Click Sign in with Google
    F->>G: POST /authentication/signin/google
    G->>A: Proxy request
    A->>GO: Redirect to Google
    GO->>U: Show login page
    U->>GO: Enter credentials
    GO->>A: Callback with auth code
    A->>GO: Exchange for tokens
    GO-->>A: Access token + user info
    A->>M: Create/Update user and session
    M-->>A: User data
    A->>F: Set session cookie + redirect
    F->>U: Show logged in state

    Note over A,M: Sessions stored with expiry<br/>User roles: Teacher, Student, Parent
```

---

## Payment Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as Frontend
    participant G as Gateway
    participant P as Payment :4003
    participant R as Razorpay
    participant K as Kafka

    U->>F: Click Buy Course
    F->>G: POST /payment/create-order
    G->>P: Proxy request
    P->>R: Create Razorpay order
    R-->>P: Order ID
    P-->>F: Order details
    F->>R: Open Razorpay checkout
    U->>R: Complete payment
    R->>F: Payment success callback
    F->>G: POST /payment/complete-payment
    G->>P: Verify payment
    P->>R: Verify signature
    R-->>P: Verified
    P->>K: Produce payment_done event
    K-->>P: Ack
    P-->>F: Success response

    Note over K: Topic: payment_done<br/>Payload: course_id, user_id, payment_id
```

---

## Course Material Ingestion Flow

```mermaid
sequenceDiagram
    autonumber
    participant T as Teacher
    participant C as Courses :4002
    participant AB as Azure Blob
    participant K as Kafka
    participant RB as RAG Backend
    participant AQ as Azure Queue
    participant RP as RAG Python
    participant Q as Qdrant

    T->>C: Upload video/notes
    C->>AB: Store file
    AB-->>C: Blob URL
    C->>K: Produce materail_data
    K-->>RB: Consume message

    alt video_created
        RB->>AQ: Push ingestion job
        Note over AQ: jobId, sasUrl, metadata
    else note_created
        RB->>AQ: Push ingestion job
    end

    loop Worker polling
        RP->>AQ: Poll for messages
        AQ-->>RP: Job message
        RP->>AB: Download file (SAS URL)
        RP->>RP: Extract text
        RP->>RP: Chunk text
        RP->>RP: Generate embeddings
        RP->>Q: Upsert vectors
        Q-->>RP: Success
        RP->>AQ: Delete message
    end

    Note over Q: Vectors stored with metadata:<br/>course_id, module_id, video_id/notes_id
```

---

## RAG Query Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as Student
    participant F as Frontend
    participant G as Gateway
    participant RB as RAG Backend
    participant RP as RAG Python :8000
    participant Q as Qdrant
    participant GE as Gemini

    U->>F: Ask question about course
    F->>G: POST /rag/query
    G->>RB: Proxy to RAG
    RB->>RP: Forward query
    RP->>RP: Generate query embedding
    RP->>Q: Vector similarity search
    Note over Q: Filter by course_id, module_id
    Q-->>RP: Top-K relevant chunks
    RP->>GE: Generate answer with context
    Note over GE: Strict context-only prompt<br/>No hallucination policy
    GE-->>RP: Generated answer
    RP-->>RB: Answer + sources
    RB-->>G: Response
    G-->>F: JSON response
    F->>U: Display answer with citations

    Note over RP,GE: Response includes:<br/>Answer text, Source citations, Latency metrics
```

---

## Data Models and Relationships

```mermaid
erDiagram
    USER ||--o| TEACHER : "can be"
    USER ||--o| STUDENT : "can be"
    USER ||--o| PARENT : "can be"
    USER ||--o{ SESSION : "has"
    USER ||--o{ ACCOUNT : "has"
    
    COURSE ||--o{ MODULE : "contains"
    MODULE ||--o{ VIDEO : "has"
    MODULE ||--o{ NOTES : "has"
    MODULE ||--o{ TEST : "has"
    
    STUDENT ||--o{ ENROLLMENT : "enrolled in"
    COURSE ||--o{ ENROLLMENT : "has"
    ENROLLMENT ||--o| PAYMENT : "requires"
    
    VIDEO ||--o{ RAG_CHUNK : "vectorized to"
    NOTES ||--o{ RAG_CHUNK : "vectorized to"
    
    USER {
        string id PK
        string email UK
        string name
        string role
        boolean emailVerified
        date createdAt
    }
    
    COURSE {
        string id PK
        string title
        string description
        number price
        string teacherId FK
    }
    
    MODULE {
        string id PK
        string courseId FK
        string title
        number order
    }
    
    VIDEO {
        string id PK
        string moduleId FK
        string blobUrl
        number duration
    }
    
    NOTES {
        string id PK
        string moduleId FK
        string blobUrl
        string fileType
    }
    
    RAG_CHUNK {
        string id PK
        string courseId
        string moduleId
        string videoId
        string notesId
        string text
        vector embedding
    }
    
    PAYMENT {
        string id PK
        string userId FK
        string courseId FK
        string razorpayId
        string status
    }
```

---

## Service Ports and Endpoints

| Service | Port | Base Path | Description |
|---------|------|-----------|-------------|
| **Frontend** | 3001 | `/` | Next.js React application |
| **API Gateway** | 4000 | `/` | Central routing and auth middleware |
| **Auth Service** | 3000 | `/api/auth/*`, `/api/user/*` | Better Auth + Google OAuth |
| **Courses Service** | 4002 | `/api/courses/*`, `/api/upload/*`, `/api/module/*` | Course CRUD operations |
| **Payment Service** | 4003 | `/create-order`, `/complete-payment` | Razorpay integration |
| **RAG Backend** | 4005 | `/api/rag/*` | Kafka consumer + queue management |
| **RAG Python** | 8000 | `/ingest`, `/query`, `/delete`, `/health` | FastAPI RAG engine |
| **Kafka** | 9092 | - | Event streaming |

---

## Kafka Topics

| Topic | Producers | Consumers | Payload |
|-------|-----------|-----------|---------|
| `materail_data` | Courses | RAG Backend | `course_id`, `module_id`, `azureBlobUrl`, `video_id`/`note_id`, `eventtype` |
| `payment_done` | Payment | Courses (Redis) | `course_id`, `user_id`, `payment_id`, `eventtype` |
| `module_created` | Courses | - | Module metadata |
| `course` | Courses | - | Course metadata |

---

## Security Architecture

```mermaid
mindmap
    root((Security))
        Authentication
            Google OAuth 2.0
            Better Auth
            Session Cookies
            Token Rotation
        Authorization
            Auth Middleware
            Role-based Access
            Teacher/Student/Parent
        API Security
            Rate Limiting
            CORS Configuration
            Request Validation
        Data Security
            MongoDB Atlas Encryption
            Azure Blob SAS URLs
            HTTPS/TLS
        Infrastructure
            Non-root Containers
            Managed Identity
            Key Vault
```

---

## Deployment Architecture

```mermaid
flowchart TB
    subgraph Local["Local Development"]
        LOCAL_FE["Next.js :3001"]
        LOCAL_GW["Gateway :4000"]
        LOCAL_SERVICES["Services :3000-4005"]
        LOCAL_KAFKA["Kafka :9092"]
    end

    subgraph Azure["Azure Cloud"]
        ACR["Azure Container Registry"]
        ACA["Azure Container Apps"]
        BLOB["Azure Blob Storage"]
        QUEUE["Azure Storage Queue"]
        KV["Azure Key Vault"]
    end

    subgraph Managed["Managed Services"]
        MONGO_ATLAS["MongoDB Atlas"]
        QDRANT_CLOUD["Qdrant Cloud"]
        GOOGLE_CLOUD["Google Cloud AI"]
    end

    LOCAL_FE -.->|"deploy"| ACR
    LOCAL_SERVICES -.->|"deploy"| ACR
    ACR -->|"pull"| ACA

    ACA <--> BLOB
    ACA <--> QUEUE
    ACA <--> KV

    ACA <--> MONGO_ATLAS
    ACA <--> QDRANT_CLOUD
    ACA <--> GOOGLE_CLOUD

    style Local fill:#1e293b,stroke:#64748b,color:#fff
    style Azure fill:#0369a1,stroke:#38bdf8,color:#fff
    style Managed fill:#166534,stroke:#4ade80,color:#fff
```

---

## Technology Stack Summary

### Frontend
- **Framework**: Next.js 14+ with React
- **Styling**: Tailwind CSS
- **State**: React hooks

### Backend Services
- **Runtime**: Node.js with Express
- **Language**: TypeScript / JavaScript (ES Modules)
- **Auth**: Better Auth library

### AI/ML Service
- **Framework**: FastAPI (Python)
- **Vector DB**: Qdrant
- **LLM**: Google Gemini
- **Embeddings**: Google Generative AI

### Infrastructure
- **Message Queue**: Apache Kafka
- **Databases**: MongoDB Atlas
- **Storage**: Azure Blob Storage
- **Queue**: Azure Storage Queue
- **Cache**: Redis

---

*Last updated: January 2026*
