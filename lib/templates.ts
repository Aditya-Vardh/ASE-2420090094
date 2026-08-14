import type { DiagramType } from "@/lib/storage/types";

export type Template = {
  id: string;
  name: string;
  category: string;
  description: string;
  diagramType: DiagramType;
  prompt: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "ecommerce",
    name: "E-Commerce Platform",
    category: "Web",
    description: "Online store with catalog, cart, orders, and payments.",
    diagramType: "architecture",
    prompt:
      "Build an e-commerce platform with React frontend, Node.js API, PostgreSQL database, Redis caching, payment processing via Stripe, JWT authentication, order management, inventory tracking, and email notifications.",
  },
  {
    id: "social-media",
    name: "Social Media App",
    category: "Web",
    description: "Feed, profiles, messaging, and real-time notifications.",
    diagramType: "architecture",
    prompt:
      "Design a social media application with user profiles, news feed, likes and comments, direct messaging, push notifications, media uploads to S3, and a Node.js backend with MongoDB.",
  },
  {
    id: "banking",
    name: "Banking System",
    category: "Enterprise",
    description: "Accounts, transactions, transfers, and audit logging.",
    diagramType: "class",
    prompt:
      "Design a banking system with Account, Customer, Transaction, Transfer, and AuditLog classes. Include balance management, transaction history, and role-based access for tellers and admins.",
  },
  {
    id: "food-delivery",
    name: "Food Delivery",
    category: "Mobile",
    description: "Restaurants, orders, drivers, and real-time tracking.",
    diagramType: "architecture",
    prompt:
      "Create a food delivery platform with customer mobile app, restaurant dashboard, driver app, order routing, GPS tracking, payment processing, and a microservices backend.",
  },
  {
    id: "lms",
    name: "Learning Management System",
    category: "SaaS",
    description: "Courses, enrollments, assignments, and grading.",
    diagramType: "class",
    prompt:
      "Design an LMS with Student, Instructor, Course, Module, Assignment, Submission, and Grade classes. Students enroll in courses and submit assignments for grading.",
  },
  {
    id: "hospital",
    name: "Hospital Management",
    category: "Enterprise",
    description: "Patients, doctors, appointments, and billing.",
    diagramType: "class",
    prompt:
      "Design a hospital management system where Doctors treat Patients, Patients book Appointments, Prescriptions are issued, and Bills are generated for medical services.",
  },
  {
    id: "chat",
    name: "Chat Application",
    category: "Real-time",
    description: "Rooms, messages, presence, and WebSocket delivery.",
    diagramType: "sequence",
    prompt:
      "Design a real-time chat application. Show the sequence when a user sends a message: client connects via WebSocket, message is validated, stored in database, and broadcast to room participants.",
  },
  {
    id: "streaming",
    name: "Streaming Platform",
    category: "Media",
    description: "Video upload, transcoding, CDN delivery, and subscriptions.",
    diagramType: "architecture",
    prompt:
      "Design a video streaming platform with content upload, transcoding pipeline, CDN delivery, user subscriptions, recommendation engine, and analytics.",
  },
  {
    id: "ride-sharing",
    name: "Ride Sharing",
    category: "Mobile",
    description: "Riders, drivers, trips, and payments.",
    diagramType: "class",
    prompt:
      "Design a ride sharing app where Riders request Rides, Drivers accept them, Trips track routes and fares, and Payments are processed after completion.",
  },
  {
    id: "saas",
    name: "SaaS Platform",
    category: "SaaS",
    description: "Multi-tenant subscriptions, billing, and admin portal.",
    diagramType: "architecture",
    prompt:
      "Design a multi-tenant SaaS platform with subscription billing, tenant isolation, admin dashboard, API rate limiting, and usage analytics.",
  },
  {
    id: "microservices",
    name: "Microservices E-Commerce",
    category: "Distributed",
    description: "Decomposed services with API gateway and message bus.",
    diagramType: "component",
    prompt:
      "Design a microservices e-commerce architecture with API Gateway, User Service, Product Service, Order Service, Payment Service, Notification Service, and an event bus for async communication.",
  },
  {
    id: "rest-api",
    name: "REST API Backend",
    category: "API",
    description: "Resource endpoints, auth middleware, and database layer.",
    diagramType: "component",
    prompt:
      "Design a REST API backend with authentication middleware, resource controllers, service layer, repository pattern, and PostgreSQL database connection pooling.",
  },
  {
    id: "ai-app",
    name: "AI Application",
    category: "AI",
    description: "LLM integration, vector store, and prompt pipeline.",
    diagramType: "architecture",
    prompt:
      "Design an AI application with a Next.js frontend, API gateway, LLM inference service, vector database for embeddings, document ingestion pipeline, and caching layer.",
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
