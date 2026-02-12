function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function getType(value: any): string {
    if (value === null) return "any";
    if (Array.isArray(value)) return "array";
    return typeof value;
}

// --- TypeScript Generator ---
export function jsonToTypescript(json: any, rootName: string = "Root"): string {
    let interfaces: string[] = [];
    const names = new Set<string>();

    function generate(obj: any, name: string) {
        if (names.has(name)) return; // Prevent duplicate processing if same name reused

        // Ensure unique name if collision (simplified)
        names.add(name);

        let output = `export interface ${name} {\n`;

        Object.entries(obj as Record<string, any>).forEach(([key, value]) => {
            const type = getType(value);
            let tsType = "any";

            if (type === "string") tsType = "string";
            else if (type === "number") tsType = "number";
            else if (type === "boolean") tsType = "boolean";
            else if (type === "object") {
                const nestedName = capitalize(key);
                generate(value, nestedName);
                tsType = nestedName;
            } else if (type === "array") {
                if (value.length > 0) {
                    const itemType = getType(value[0]);
                    if (itemType === "object") {
                        const nestedName = capitalize(key) + "Item";
                        generate(value[0], nestedName);
                        tsType = `${nestedName}[]`;
                    } else {
                        tsType = `${itemType}[]`;
                    }
                } else {
                    tsType = "any[]";
                }
            }

            output += `  ${key}: ${tsType};\n`;
        });

        output += "}\n";
        interfaces.push(output);
    }

    try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;

        if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'object') {
                generate(parsed[0], rootName + "Item");
                return interfaces.reverse().join("\n") + `\nexport type ${rootName} = ${rootName}Item[];`;
            } else {
                return `export type ${rootName} = any[]; // Empty or primitive array`;
            }
        }

        generate(parsed, rootName);
        return interfaces.reverse().join("\n");
    } catch (e) {
        return `// Error generating TypeScript: ${(e as Error).message}`;
    }
}

// --- Zod Generator ---
export function jsonToZod(json: any, rootName: string = "schema"): string {
    function generate(obj: any): string {
        const type = getType(obj);
        if (type === "string") return "z.string()";
        if (type === "number") return "z.number()";
        if (type === "boolean") return "z.boolean()";
        if (type === "array") {
            if (obj.length > 0) {
                return `z.array(${generate(obj[0])})`;
            }
            return "z.array(z.any())";
        }
        if (type === "object") {
            let fields: string[] = [];
            Object.entries(obj as Record<string, any>).forEach(([key, value]) => {
                fields.push(`  ${key}: ${generate(value)}`);
            });
            return `z.object({\n${fields.join(",\n")}\n})`;
        }
        return "z.any()";
    }

    try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;
        const schema = generate(parsed);
        return `import { z } from "zod";\n\nexport const ${rootName} = ${schema};`;
    } catch (e) {
        return `// Error generating Zod schema: ${(e as Error).message}`;
    }
}

// --- Pydantic Generator ---
export function jsonToPydantic(json: any, rootName: string = "Model"): string {
    let classes: string[] = [];

    function generate(obj: any, name: string) {
        let fields: string[] = [];

        Object.entries(obj as Record<string, any>).forEach(([key, value]) => {
            const type = getType(value);
            let pyType = "Any";

            if (type === "string") pyType = "str";
            else if (type === "number") pyType = "float"; // Assume float for safety
            else if (type === "boolean") pyType = "bool";
            else if (type === "object") {
                const nestedName = capitalize(key);
                generate(value, nestedName);
                pyType = nestedName;
            } else if (type === "array") {
                if (value.length > 0) {
                    const itemType = getType(value[0]);
                    if (itemType === "object") {
                        const nestedName = capitalize(key) + "Item";
                        generate(value[0], nestedName);
                        pyType = `List[${nestedName}]`;
                    } else {
                        pyType = `List[${itemType}]`; // e.g. List[str]
                    }
                } else {
                    pyType = "List[Any]";
                }
            }

            fields.push(`    ${key}: ${pyType}`);
        });

        classes.push(`class ${name}(BaseModel):\n${fields.length ? fields.join("\n") : "    pass"}`);
    }

    try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;

        // Pydantic imports
        const header = "from typing import List, Any\nfrom pydantic import BaseModel\n\n";

        if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'object') {
                generate(parsed[0], rootName + "Item");
                return header + classes.reverse().join("\n\n") + `\n\n# Note: Root is a List[${rootName}Item]`;
            }
        }

        generate(parsed, rootName);
        return header + classes.reverse().join("\n\n");
    } catch (e) {
        return `# Error generating Pydantic model: ${(e as Error).message}`;
    }
}
