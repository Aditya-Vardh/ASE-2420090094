import type { ArchitectureGraph, ArchNode, RiskSeverity } from "@/lib/graph/types";
import type { IntelligenceFinding } from "./types";

export function analyzeSecurityIntelligence(graph: ArchitectureGraph): IntelligenceFinding[] {
  const findings: IntelligenceFinding[] = [];
  const nodes = graph.nodes;
  const edges = graph.edges;

  if (!nodes || nodes.length === 0) return findings;

  const dbNodes = nodes.filter((n) => n.type === "database");
  const authNodes = nodes.filter((n) => n.type === "auth");
  const gatewayNodes = nodes.filter((n) => n.type === "gateway");
  const frontendNodes = nodes.filter((n) => n.type === "frontend");
  const serviceNodes = nodes.filter((n) => n.type === "microservice");
  const externalNodes = nodes.filter((n) => n.type === "external");

  // Inbound call mapping
  const callerMap = new Map<string, string[]>();
  edges.forEach((e) => {
    const list = callerMap.get(e.targetId) || [];
    list.push(e.sourceId);
    callerMap.set(e.targetId, list);
  });

  // 1. Direct Public Exposure of Database Node
  dbNodes.forEach((db) => {
    const callers = callerMap.get(db.id) || [];
    const directFrontendCallers = callers.filter((cId) => {
      const callerNode = nodes.find((n) => n.id === cId);
      return callerNode?.type === "frontend";
    });

    if (directFrontendCallers.length > 0) {
      findings.push({
        id: `sec-db-public-${db.id}`,
        category: "SECURITY",
        severity: "CRITICAL",
        title: `Public Database Exposure on ${db.name}`,
        description: `Client-facing tier directly queries ${db.name} without an isolated microservice application layer.`,
        affectedNodes: [db.id, ...directFrontendCallers],
        impact: "Exposes database network ports to public traffic, permitting SQL injection and unauthorized data exfiltration.",
        recommendation: "Restrict database network access to private subnets behind application microservices.",
        rationale: `Graph evidence: ${db.name} receives direct incoming edges from ${directFrontendCallers.length} frontend component(s).`,
        source: "Security Analysis Engine (Public Exposure)",
      });
    }
  });

  // 2. Missing Ingress API Gateway
  if (gatewayNodes.length === 0 && frontendNodes.length > 0) {
    findings.push({
      id: "sec-missing-gateway",
      category: "SECURITY",
      severity: "HIGH",
      title: "Missing Centralized API Gateway Ingress Router",
      description: "Frontend applications directly query microservices without a single ingress gateway enforcing TLS, CORS, and token verification.",
      affectedNodes: [...frontendNodes.map((f) => f.id), ...serviceNodes.slice(0, 2).map((s) => s.id)],
      impact: "Fragmented security controls, exposed internal IP topology, and duplicated CORS policies across microservices.",
      recommendation: "Deploy Traefik or Kong API Gateway at ingress tier to centralize TLS termination and rate limiting.",
      rationale: `Graph evidence: ${frontendNodes.length} frontend node(s) connect directly to backend services without gateway routing.`,
      source: "Security Analysis Engine (Ingress Boundaries)",
    });
  }

  // 3. Missing Dedicated Auth Vault / Token Issuer
  if (authNodes.length === 0) {
    findings.push({
      id: "sec-missing-auth",
      category: "SECURITY",
      severity: "HIGH",
      title: "Missing Centralized Identity & OAuth2 Auth Vault",
      description: "Architecture lacks a dedicated identity provider for issuing and verifying JWT access tokens.",
      affectedNodes: nodes.filter((n) => n.type === "gateway" || n.type === "frontend").map((n) => n.id),
      impact: "Risk of inconsistent authorization checks and token hijacking across microservice boundaries.",
      recommendation: "Integrate a dedicated Keycloak or OAuth2 JWT authorization vault at entry tier.",
      rationale: `Graph evidence: 0 auth components found in node topology of ${nodes.length} services.`,
      source: "Security Analysis Engine (Identity Vault)",
    });
  }

  // 4. Sensitive Data Flow over Unencrypted External Integration
  externalNodes.forEach((ext) => {
    const callers = callerMap.get(ext.id) || [];
    findings.push({
      id: `sec-external-trust-${ext.id}`,
      category: "SECURITY",
      severity: "MEDIUM",
      title: `Unverified Trust Boundary on ${ext.name}`,
      description: `Integrates with third-party external service ${ext.name} across public network boundary.`,
      affectedNodes: [ext.id, ...callers],
      impact: "Potential MITM vulnerability or payload exposure if webhook signatures or TLS mutual auth are omitted.",
      recommendation: "Enforce mTLS, webhook payload HMAC signatures, and secret vault storage for API keys.",
      rationale: `Graph evidence: Inter-service link connects to external boundary node ${ext.name}.`,
      source: "Security Analysis Engine (Trust Boundaries)",
    });
  });

  // 5. Input Validation & Secret Management Opportunities
  if (dbNodes.length > 0 && !nodes.some((n) => n.name.toLowerCase().includes("vault") || n.name.toLowerCase().includes("secret"))) {
    findings.push({
      id: "sec-missing-secrets-manager",
      category: "SECURITY",
      severity: "LOW",
      title: "Missing Hardware/Cloud Secrets Manager",
      description: "Database connection strings and encryption keys are stored without a dedicated secrets manager.",
      affectedNodes: dbNodes.map((d) => d.id),
      impact: "Hardcoded environment secrets risk accidental exposure in container images or source code.",
      recommendation: "Inject database credentials dynamically using HashiCorp Vault or AWS Secrets Manager.",
      rationale: "Graph evidence: Persistence components exist without dynamic secret injection vault.",
      source: "Security Analysis Engine (Secrets Vault)",
    });
  }

  return findings;
}
