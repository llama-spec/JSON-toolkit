import { jsonToXml, xmlToJson } from "../lib/xml-utils";
import { jsonToCsv, csvToJson } from "../lib/csv-utils";
import { jsonToYaml, yamlToJson } from "../lib/yaml-utils";

self.onmessage = async (e: MessageEvent) => {
    const { type, payload, id } = e.data;
    try {
        let result;
        switch (type) {
            case "PARSE_JSON":
                result = JSON.parse(payload);
                break;
            case "VALIDATE_JSON":
                // Validation-only mode - just check if it's valid without returning full data
                JSON.parse(payload);
                result = { valid: true };
                break;
            case "STRINGIFY_JSON":
                result = JSON.stringify(payload, null, 2);
                break;
            case "JSON_TO_XML":
                result = jsonToXml(payload);
                break;
            case "XML_TO_JSON":
                result = xmlToJson(payload);
                break;
            case "JSON_TO_CS":
                result = jsonToCsv(payload); // Typo in case name fixed below
                break;
            case "JSON_TO_CSV":
                result = jsonToCsv(payload);
                break;
            case "CSV_TO_JSON":
                result = csvToJson(payload);
                break;
            case "JSON_TO_YAML":
                result = jsonToYaml(payload);
                break;
            case "YAML_TO_JSON":
                result = yamlToJson(payload);
                break;
            case "YAML_TO_JSON":
                result = yamlToJson(payload);
                break;
            case "FLATTEN_JSON":
                // Optimization: Parse inside the worker to avoid blocking main thread
                const jsonToFlatten = typeof payload === 'string' ? JSON.parse(payload) : payload;
                result = flattenObject(jsonToFlatten);
                break;
            default:
                throw new Error(`Unknown operation: ${type}`);
        }
        self.postMessage({ type: "SUCCESS", result, id });
    } catch (error) {
        self.postMessage({
            type: "ERROR",
            error: (error as Error).message,
            id
        });
    }
};

// Compact node structure:
// [id, label, depth, isLeaf, isExpanded, isArray, childCount, value]
type CompactNode = [string, string, number, boolean, boolean, boolean, number, any];

// Flattens the object into a list of nodes for virtualization
const flattenObject = (obj: any, depth = 0, prefix = "root", expandedIds: Set<string> = new Set(['root'])): CompactNode[] => {
    const result: CompactNode[] = [];

    // Helper to calculate initial expansion for root level (first 100 items)
    if (depth === 0) {
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            const keys = Object.keys(obj);
            if (keys.length <= 100) {
                keys.forEach(key => expandedIds.add(`root.${key}`));
            }
        }
    }

    // Redefining Traverse with the new plan
    const traverse = (node: any, id: string, label: string, currentDepth: number) => {
        const isObject = node !== null && typeof node === "object";
        const isArray = Array.isArray(node);

        if (!isObject) {
            // [id, label, depth, isLeaf, isExpanded, isArray, childCount, value]
            result.push([id, label, currentDepth, true, false, false, 0, node]);
            return;
        }

        const isExpanded = expandedIds.has(id);
        const keys = Object.keys(node);

        result.push([
            id,
            label,
            currentDepth,
            false, // isLeaf
            isExpanded,
            isArray,
            keys.length,
            null // value (not needed for branches)
        ]);

        // Always recurse to generate full flat list
        keys.forEach(key => {
            traverse(node[key], `${id}.${key}`, key, currentDepth + 1);
        });
    };

    traverse(obj, prefix, prefix, depth);
    return result;
};
