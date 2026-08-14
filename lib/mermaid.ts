import type { UML } from "@/lib/ai/schema";

export function toMermaid(data: UML) {
  let output = "classDiagram\n\n";

  // Relationships
  data.relationships.forEach((rel) => {
    let arrow = "-->";

    switch (rel.type) {
      case "inheritance":
        arrow = "<|--";
        break;

      case "aggregation":
        arrow = "o--";
        break;

      case "composition":
        arrow = "*--";
        break;

      case "association":
      default:
        arrow = "-->";
        break;
    }

    output += `${rel.from} ${arrow} ${rel.to}\n`;
  });

  output += "\n";

  // Classes
  data.classes.forEach((cls) => {
    output += `class ${cls.name} {\n`;

    cls.attributes.forEach((attribute) => {
      output += `  +${attribute}\n`;
    });

    cls.methods.forEach((method) => {
      output += `  +${method}\n`;
    });

    output += "}\n\n";
  });

  return output;
}