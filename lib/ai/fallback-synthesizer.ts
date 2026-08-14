import type { ArchitectureResult, DiagramType, ResearchResult } from "@/lib/storage/types";
import { repairMermaid } from "@/lib/mermaid-repair";

export function synthesizeFallbackArchitecture(
  idea: string,
  diagramType: DiagramType = "architecture"
): ArchitectureResult {
  const prompt = idea.trim();
  const title = prompt.length > 40
    ? `${prompt.slice(0, 37)}...` 
    : prompt.split("\n")[0] || "Custom System Architecture";

  let mermaidCode = "";

  if (diagramType === "class") {
    mermaidCode = `classDiagram
    class ClientApp {
        +String clientId
        +authenticate()
        +renderUI()
    }
    class APIGateway {
        +String route
        +validateToken()
        +forwardRequest()
    }
    class AuthService {
        +String jwtSecret
        +issueToken()
        +verifyCredentials()
    }
    class Database {
        +String connectionString
        +query()
        +persistData()
    }
    ClientApp --> APIGateway : Sends Request
    APIGateway --> AuthService : Validates Token
    APIGateway --> Database : Reads/Writes`;
  } else if (diagramType === "sequence") {
    mermaidCode = `sequenceDiagram
    autonumber
    actor User as Client User
    participant App as Web Frontend
    participant Gateway as API Gateway
    participant Auth as Auth Service
    participant DB as Database
    User->>App: Submits Request
    App->>Gateway: POST /api/v1/action
    Gateway->>Auth: Verify JWT Token
    Auth-->>Gateway: 200 OK Token Valid
    Gateway->>DB: Query User Records
    DB-->>Gateway: Return Dataset
    Gateway-->>App: 200 Success Response
    App-->>User: Render Dashboard View`;
  } else if (diagramType === "er") {
    mermaidCode = `erDiagram
    USER ||--o{ ORDER : places
    USER {
        string id PK
        string email
        string password_hash
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        string id PK
        string user_id FK
        float total_amount
        string status
    }
    ORDER_ITEM }|--|| PRODUCT : references
    PRODUCT {
        string id PK
        string title
        float price
        int stock
    }`;
  } else if (diagramType === "flowchart") {
    mermaidCode = `graph TD
    Start([User Initiates Request]) --> CheckAuth{Is Authenticated?}
    CheckAuth -- No --> RedirectLogin[Redirect to Auth Provider]
    CheckAuth -- Yes --> Process[Process Request Payload]
    Process --> QueryCache{Check Redis Cache}
    QueryCache -- Hit --> ReturnCache[Return Cached Result]
    QueryCache -- Miss --> FetchDB[(Query PostgreSQL DB)]
    FetchDB --> UpdateCache[Write to Redis Cache]
    UpdateCache --> End([Return Final Payload])`;
  } else if (diagramType === "component") {
    mermaidCode = `graph TB
    subgraph Frontend["Frontend Layer"]
        UI["Web SPA (Next.js / React)"]
        Mobile["Mobile App (React Native)"]
    end
    subgraph Gateway["API Gateway Layer"]
        GW["API Router & Rate Limiter"]
    end
    subgraph Microservices["Backend Services"]
        UserSvc["User Management Service"]
        OrderSvc["Order Processing Service"]
        PaymentSvc["Payment Gateway Handler"]
    end
    subgraph Data["Persistence Layer"]
        DB[("PostgreSQL Main DB")]
        Redis[("Redis In-Memory Cache")]
    end
    UI --> GW
    Mobile --> GW
    GW --> UserSvc
    GW --> OrderSvc
    GW --> PaymentSvc
    UserSvc --> DB
    OrderSvc --> DB
    OrderSvc --> Redis`;
  } else if (diagramType === "deployment") {
    mermaidCode = `graph TB
    subgraph Edge["Cloud Edge & CDN"]
        Cloudflare["Cloudflare WAF / CDN"]
    end
    subgraph Cluster["Kubernetes Production Cluster"]
        subgraph IngressPod["Ingress Controller"]
            NGINX["NGINX Ingress Node"]
        end
        subgraph AppPods["Application Pods"]
            Pod1["App Replica 1"]
            Pod2["App Replica 2"]
        end
    end
    subgraph ManagedData["Managed Cloud Storage"]
        RDS[("AWS RDS PostgreSQL Cluster")]
        ElastiCache[("Redis ElastiCache Node")]
    end
    Cloudflare --> NGINX
    NGINX --> Pod1
    NGINX --> Pod2
    Pod1 --> RDS
    Pod1 --> ElastiCache
    Pod2 --> RDS
    Pod2 --> ElastiCache`;
  } else if (diagramType === "state") {
    mermaidCode = `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Submit Prompt
    Processing --> Synthesizing : Validate Inputs
    Synthesizing --> Completed : Render Diagram SVG
    Synthesizing --> Error : Exception Captured
    Error --> Processing : Retry Request
    Completed --> [*]`;
  } else {
    mermaidCode = `graph TD
    Client["Client Application (React/Next.js)"] --> API["API Gateway & Router"]
    API --> Auth["Authentication & JWT Service"]
    API --> Service["Core Microservice (Node.js)"]
    Service --> Cache[("Redis Cache Cluster")]
    Service --> DB[("PostgreSQL Database")]
    Service --> EventBus["Event Bus (Kafka / NATS)"]
    EventBus --> Worker["Async Background Worker"]`;
  }

  const repaired = repairMermaid(mermaidCode, diagramType);

  return {
    title,
    diagramType,
    mermaidCode: repaired,
    explanation: {
      overview: `Architecture specification synthesized for: "${prompt}". Designed for resilience, fault tolerance, and independent service scaling.`,
      components: [
        {
          name: "Client UI Layer",
          description: "Renders user interfaces across web and mobile viewports with fast client-side state management.",
        },
        {
          name: "API Gateway Router",
          description: "Central entry point for routing, authentication verification, and rate limiting.",
        },
        {
          name: "Microservices & Database",
          description: "Decoupled business logic backed by PostgreSQL relational persistence and Redis caching.",
        },
      ],
      dataFlow: "HTTPS REST API payload -> API Gateway -> Auth Token Validation -> Service Handler -> Redis Cache / SQL Storage -> Client JSON Response.",
      technologyChoices: "Next.js 16, TypeScript, Node.js API, PostgreSQL 16, Redis Cache, Docker/Kubernetes container orchestration.",
      scalability: "Horizontal pod autoscaling on ingress gateway and stateless application replicas.",
      security: "TLS 1.3 encryption in transit, JWT token rotation, role-based access control (RBAC).",
      reliability: "Circuit breaker pattern with exponential backoff retries and Redis read-replica fallback.",
      tradeoffs: "Microservices architecture increases operational monitoring and infrastructure overhead.",
      improvements: "Implement distributed tracing (OpenTelemetry) and Kafka event streaming for asynchronous workers.",
    },
    technologies: [
      "Next.js 16",
      "TypeScript",
      "Node.js",
      "PostgreSQL 16",
      "Redis",
      "Tailwind CSS",
    ],
  };
}

export function synthesizeFallbackResearch(question: string): ResearchResult {
  return {
    question,
    answer: `For "${question}", the recommended architectural approach balances low latency, modular scalability, and high fault tolerance. Using a decoupled API Gateway with in-memory caching (Redis) alongside PostgreSQL for persistence provides optimal trade-offs.`,
    recommendations: [
      "Implement an API Gateway to handle authentication and rate limiting centrally.",
      "Use Redis for session state and high-frequency read caching.",
      "Isolate heavy background tasks using an event queue (Kafka or RabbitMQ).",
      "Enforce strict schema validation and TLS 1.3 encryption in transit.",
    ],
    alternatives: [
      {
        name: "Monolithic Architecture",
        description: "Simpler deployment initially, but scales poorly for specialized team ownership as code grows.",
        pros: ["Easier initial deployment", "Single repository code base", "No inter-service network overhead"],
        cons: ["Single point of deployment failure", "Tightly coupled domain modules"],
      },
      {
        name: "Event-Driven Microservices",
        description: "Maximizes loose coupling and throughput, but adds complex event sequencing and eventual consistency handling.",
        pros: ["Independent service scaling", "Isolated failure domains", "High throughput event bus"],
        cons: ["Complex distributed tracing", "Eventual consistency trade-offs"],
      },
    ],
    tradeoffs: "Choosing microservices increases deployment and monitoring complexity, but yields independent service scaling and resilience against single-point crashes.",
    architectureImplications: "Requires CI/CD pipeline automation, container registry management, and centralized log aggregation.",
    relevantTechnologies: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Kafka", "Docker"],
    risks: ["Network latency between microservices", "Cache invalidation complexity"],
  };
}
