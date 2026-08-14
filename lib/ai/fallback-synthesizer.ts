import type { ArchitectureResult, DiagramType, ResearchResult } from "@/lib/storage/types";
import { repairMermaid } from "@/lib/mermaid-repair";

export function synthesizeFallbackArchitecture(
  idea: string,
  diagramType: DiagramType = "architecture"
): ArchitectureResult {
  const prompt = idea.trim();
  const lower = prompt.toLowerCase();

  const title = prompt.length > 45
    ? `${prompt.slice(0, 42)}...` 
    : prompt.split("\n")[0] || "Custom System Architecture";

  let mermaidCode = "";
  let overview = "";
  let components: { name: string; description: string }[] = [];
  let technologies: string[] = [];

  // Domain Matcher
  const isAutomatedCars = lower.includes("car") || lower.includes("auto") || lower.includes("vehicle") || lower.includes("drive") || lower.includes("fleet") || lower.includes("sensor");
  const isAI = lower.includes("ai") || lower.includes("rag") || lower.includes("llm") || lower.includes("gpt") || lower.includes("vector") || lower.includes("embed");
  const isChat = lower.includes("chat") || lower.includes("message") || lower.includes("realtime") || lower.includes("socket");
  const isHospital = lower.includes("hospital") || lower.includes("health") || lower.includes("patient") || lower.includes("medical") || lower.includes("doctor");
  const isEcommerce = lower.includes("e-commerce") || lower.includes("shop") || lower.includes("cart") || lower.includes("order") || lower.includes("payment");
  const isStreaming = lower.includes("stream") || lower.includes("video") || lower.includes("media") || lower.includes("hls");

  if (diagramType === "class") {
    if (isAutomatedCars) {
      mermaidCode = `classDiagram
    class VehicleSensorCluster {
        +Float lidarPoints
        +Image cameraFrame
        +readTelemetry()
    }
    class EdgeECUController {
        +String vehicleId
        +processSensorData()
        +triggerObstacleAvoidance()
    }
    class TelemetryGateway {
        +MQTTConnection socket
        +streamToCloud()
        +bufferOfflineData()
    }
    class CloudFleetEngine {
        +String fleetId
        +updateOTA()
        +aggregateAnalytics()
    }
    VehicleSensorCluster --> EdgeECUController : Telemetry
    EdgeECUController --> TelemetryGateway : Validated Frames
    TelemetryGateway --> CloudFleetEngine : 5G Stream`;
    } else {
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
    }
  } else if (diagramType === "sequence") {
    if (isAutomatedCars) {
      mermaidCode = `sequenceDiagram
    autonumber
    actor Car as Autonomous Vehicle
    participant ECU as Edge Computer (ROS 2)
    participant Gateway as 5G Telemetry Ingress
    participant Cloud as Fleet Manager
    participant AI as AI Model Engine
    Car->>ECU: Telemetry Stream
    ECU->>ECU: Obstacle Avoidance (<5ms)
    ECU->>Gateway: Publish Telemetry (MQTT)
    Gateway->>Cloud: Forward Stream to Kafka
    Cloud->>AI: Trigger Anomaly Detection
    AI-->>Cloud: Vehicle Health Report
    Cloud-->>Car: Push OTA Patch`;
    } else {
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
    }
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
  } else if (isAutomatedCars) {
    mermaidCode = `flowchart TB
    subgraph EdgeLayer["1. Vehicle Edge Hardware"]
        Sensors["LiDAR, Radar & Cameras"]
        ECU["Edge ECU Computer (ROS 2)"]
        CANBus["Vehicle CAN Bus & Controls"]
    end
    subgraph CommunicationLayer["2. Telemetry Transport"]
        MQTT["5G MQTT Telemetry Gateway"]
        Kafka["Apache Kafka Event Bus"]
    end
    subgraph CloudLayer["3. Cloud Intelligence & Storage"]
        Analytics["Fleet Analytics Engine"]
        AIEngine["AI Model Re-Training Pipeline"]
        TimescaleDB[("TimescaleDB Store")]
        OTAService["OTA Firmware Updater"]
    end
    Sensors --> ECU
    ECU --> CANBus
    ECU --> MQTT
    MQTT --> Kafka
    Kafka --> Analytics
    Kafka --> AIEngine
    Analytics --> TimescaleDB
    OTAService -.-> ECU`;

    overview = `Production architecture for Automated / Autonomous Vehicles system. Integrates Edge Vehicle Sensors (LiDAR/Cameras), ROS 2 local ECU processing (<5ms safety latency), 5G MQTT Ingestion, Kafka Stream Processing, and TimescaleDB Fleet Analytics.`;
    components = [
      { name: "Vehicle Edge ECU (ROS 2)", description: "On-board computer executing real-time object detection and CAN bus actuation under 5ms latency." },
      { name: "5G MQTT Telemetry Gateway", description: "Ultra-low-overhead binary telemetry transport receiving sensor data streams over cellular network." },
      { name: "Cloud Fleet Analytics & TimescaleDB", description: "Scalable time-series storage and real-time anomaly detection for global vehicle fleets." },
      { name: "OTA Firmware Update Service", description: "Secure, signed over-the-air firmware updates for autonomous vehicle fleet management." },
    ];
    technologies = ["ROS 2", "TensorRT", "MQTT / Protobuf", "Apache Kafka", "TimescaleDB", "C++ / Rust", "Docker / K8s"];
  } else if (isHospital || isAI) {
    mermaidCode = `flowchart TB
    subgraph ClientLayer["1. User & Client Interface"]
        WebPortal["Web Portal (Next.js)"]
        MobileApp["Mobile Health App"]
    end
    subgraph GatewayLayer["2. Ingress & Security"]
        GW["API Gateway Router"]
        Auth["HIPAA / OAuth2 Auth Service"]
    end
    subgraph LogicLayer["3. Core Logic & AI Services"]
        EMR["FHIR Patient Record Service"]
        LLM["Healthcare LLM Inference Engine"]
        Imaging["DICOM Medical Image Processor"]
    end
    subgraph DataLayer["4. Encrypted Persistence"]
        DB[("Encrypted PostgreSQL DB")]
        VectorDB[("Vector DB Knowledge Base")]
        S3[("AWS S3 Medical Imaging Bucket")]
    end
    WebPortal --> GW
    MobileApp --> GW
    GW --> Auth
    GW --> EMR
    GW --> LLM
    GW --> Imaging
    EMR --> DB
    LLM --> VectorDB
    Imaging --> S3`;

    overview = `HIPAA-Compliant Healthcare & AI Architecture integrating FHIR Patient Record Services, DICOM Medical Imaging, Vector Knowledge Bases, and LLM Inference APIs.`;
    components = [
      { name: "EMR / EHR Service (FHIR)", description: "Standardized HL7 FHIR API service managing medical records, prescriptions, and lab data." },
      { name: "Healthcare LLM Inference Engine", description: "Contextual AI inference engine executing semantic search over vector database records." },
      { name: "DICOM Imaging Vault", description: "Secure storage and viewer service for high-resolution X-Rays, MRIs, and CT Scans." },
    ];
    technologies = ["Next.js 16", "FHIR API", "DICOM Standard", "Vector DB", "PostgreSQL (AES-256)", "AWS S3 Vault"];
  } else if (isChat) {
    mermaidCode = `flowchart TB
    subgraph ClientLayer["1. Client Layer"]
        WebClient["React / Next.js SPA"]
        MobileClient["React Native App"]
    end
    subgraph IngressLayer["2. Ingress & Realtime"]
        WSGateway["WebSocket Gateway (Socket.io)"]
        Auth["JWT & Presence Manager"]
    end
    subgraph MessageLayer["3. Message Routing"]
        Broker["NATS / RabbitMQ Broker"]
        Worker["Message Persistence Worker"]
    end
    subgraph StorageLayer["4. Storage"]
        DB[("ScyllaDB Message Store")]
        Redis[("Redis Active Presence Cache")]
    end
    WebClient --> WSGateway
    MobileClient --> WSGateway
    WSGateway --> Auth
    WSGateway --> Broker
    Broker --> Worker
    Broker --> Redis
    Worker --> DB`;

    overview = `Real-Time Chat & Messaging Architecture built with WebSocket Gateways, Presence Management, NATS Message Broker, and ScyllaDB persistence.`;
    components = [
      { name: "WebSocket Gateway", description: "Maintains bi-directional, persistent socket connections for real-time messaging." },
      { name: "NATS Broker", description: "High-throughput message queuing ensuring sub-millisecond message delivery across active channels." },
      { name: "ScyllaDB Message Store", description: "Distributed NoSQL database designed for high-write chat logs." },
    ];
    technologies = ["React / Next.js", "WebSockets / Socket.io", "RabbitMQ / NATS", "ScyllaDB", "Redis"];
  } else if (isEcommerce) {
    mermaidCode = `flowchart TB
    subgraph ClientLayer["1. Storefront Interface"]
        Storefront["Next.js Storefront App"]
    end
    subgraph IngressLayer["2. Gateway & Routing"]
        GW["API Gateway & Router"]
    end
    subgraph ServicesLayer["3. Core Microservices"]
        Catalog["Product Catalog Service"]
        Cart["Cart & Reservation Service"]
        Payment["Payment Gateway (Stripe)"]
    end
    subgraph StorageLayer["4. Persistence & Async"]
        DB[("PostgreSQL Main DB")]
        Redis[("Redis Inventory Lock Cache")]
        EventBus["Kafka Event Bus"]
        Fulfillment["Warehouse Fulfillment Worker"]
    end
    Storefront --> GW
    GW --> Catalog
    GW --> Cart
    GW --> Payment
    Catalog --> DB
    Cart --> Redis
    Payment --> EventBus
    EventBus --> Fulfillment`;

    overview = `Scalable E-Commerce Microservices Architecture with Inventory Reservation Caching, Stripe Payments, and Async Fulfillment Pipelines.`;
    components = [
      { name: "Cart & Inventory Cache", description: "Uses Redis in-memory locks to prevent double-selling stock during flash sales." },
      { name: "Stripe Payment Gateway", description: "PCI-DSS compliant payment processing with webhook event handling." },
      { name: "Kafka Order Bus", description: "Asynchronous order processing triggering warehouse fulfillment and email receipts." },
    ];
    technologies = ["Next.js", "Node.js", "Stripe API", "PostgreSQL", "Redis", "Apache Kafka"];
  } else {
    mermaidCode = `flowchart TB
    subgraph ClientLayer["1. User Client Interface"]
        Client["React / Next.js Application"]
    end
    subgraph GatewayLayer["2. Ingress Gateway"]
        API["API Gateway & Load Balancer"]
        Auth["Authentication & Security Guard"]
    end
    subgraph ServicesLayer["3. Core Microservices"]
        Service["Core Business Service"]
    end
    subgraph DataLayer["4. Persistence & Async Workers"]
        Cache[("Redis Memory Cache")]
        DB[("PostgreSQL Transaction DB")]
        EventBus["Kafka Event Stream"]
        Worker["Async Background Worker"]
    end
    Client --> API
    API --> Auth
    API --> Service
    Service --> Cache
    Service --> DB
    Service --> EventBus
    EventBus --> Worker`;

    overview = `Architecture specification synthesized for: "${prompt}". Designed for resilience, fault tolerance, and independent service scaling.`;
    components = [
      { name: "Client UI Layer", description: "Renders user interfaces across web and mobile viewports." },
      { name: "API Gateway Router", description: "Central entry point for routing, authentication, and rate limiting." },
      { name: "Microservices & Database", description: "Decoupled business logic backed by relational persistence and Redis caching." },
    ];
    technologies = ["Next.js 16", "TypeScript", "Node.js API", "PostgreSQL 16", "Redis Cache", "Tailwind CSS"];
  }

  const repaired = repairMermaid(mermaidCode, diagramType);

  return {
    title,
    diagramType,
    mermaidCode: repaired,
    explanation: {
      overview: overview || `Architecture specification synthesized for: "${prompt}". Designed for resilience, fault tolerance, and independent service scaling.`,
      components: components.length > 0 ? components : [
        { name: "Client UI Layer", description: "Renders user interfaces across web and mobile viewports." },
        { name: "API Gateway Router", description: "Central entry point for routing, authentication, and rate limiting." },
        { name: "Microservices & Database", description: "Decoupled business logic backed by relational persistence and Redis caching." },
      ],
      dataFlow: "HTTPS Payload -> Gateway -> Authentication -> Service Handler -> Database / Cache -> Client Response.",
      technologyChoices: technologies.length > 0 ? technologies.join(", ") : "Next.js 16, TypeScript, Node.js API, PostgreSQL 16, Redis Cache.",
      scalability: "Horizontal pod autoscaling on ingress gateway and stateless application replicas.",
      security: "TLS 1.3 encryption in transit, JWT token rotation, role-based access control (RBAC).",
      reliability: "Circuit breaker pattern with exponential backoff retries and Redis read-replica fallback.",
      tradeoffs: "Microservices architecture increases operational monitoring and infrastructure overhead.",
      improvements: "Implement distributed tracing (OpenTelemetry) and Kafka event streaming for asynchronous workers.",
    },
    technologies: technologies.length > 0 ? technologies : [
      "Next.js 16",
      "TypeScript",
      "Node.js",
      "PostgreSQL 16",
      "Redis",
      "Tailwind CSS",
    ],
    adaptiveInsights: {
      health: 88,
      healthLabel: "Excellent",
      scalability: 90,
      maintainability: 86,
      reliability: 89,
      security: 87,
      adaptability: 91,
      potentialIssues: [
        "Network latency under spike traffic loads.",
        "Requires automated cache invalidation hooks.",
      ],
      suggestions: [
        {
          current: "Single region database deployment",
          suggested: "Multi-region database read-replicas",
          reason: "Improves global read latency and disaster recovery resilience.",
          category: "scalability",
        },
      ],
    },
  };
}

export function synthesizeFallbackResearch(question: string): ResearchResult {
  const lower = question.toLowerCase();
  const isAutomatedCars = lower.includes("car") || lower.includes("auto") || lower.includes("vehicle") || lower.includes("fleet");

  return {
    question,
    answer: isAutomatedCars
      ? `For automated/autonomous vehicle systems, an Edge ECU architecture combined with sub-5ms ROS 2 processing, 5G MQTT telemetry streams, Kafka, and TimescaleDB provides optimal real-time safety, low latency, and scalable fleet monitoring.`
      : `For "${question}", the recommended architectural approach balances low latency, modular scalability, and high fault tolerance. Using a decoupled API Gateway with in-memory caching (Redis) alongside PostgreSQL for persistence provides optimal trade-offs.`,
    recommendations: isAutomatedCars
      ? [
          "Execute real-time obstacle avoidance on vehicle Edge ECU (ROS 2 / C++) under 5ms latency.",
          "Use MQTT with Protobuf serialization over 5G for low-overhead telemetry ingestion.",
          "Persist time-series telemetry in TimescaleDB for fleet performance analytics.",
          "Enforce cryptographic signatures for Over-The-Air (OTA) firmware update safety.",
        ]
      : [
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
    tradeoffs: "Choosing microservices or edge computing increases deployment and monitoring complexity, but yields independent service scaling and resilience against single-point crashes.",
    architectureImplications: "Requires CI/CD pipeline automation, container registry management, and centralized log aggregation.",
    relevantTechnologies: isAutomatedCars ? ["ROS 2", "TensorRT", "MQTT", "Kafka", "TimescaleDB", "C++", "Docker"] : ["Next.js", "Node.js", "PostgreSQL", "Redis", "Kafka", "Docker"],
    risks: ["Network latency between services", "Cache invalidation complexity"],
  };
}
