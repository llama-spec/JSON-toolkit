export interface AnalysisIssue {
    type: "warning" | "error" | "info";
    message: string;
    path?: string; // Dot notation path
}

export function analyzeJson(json: any): AnalysisIssue[] {
    const issues: AnalysisIssue[] = [];

    function traverse(obj: any, path: string, depth: number) {
        if (depth > 5) {
            // Avoid reporting every single nested item beyond 5, maybe just once per branch or generic warning
            // But let's report basic deep nesting warning at specific paths
            if (depth === 6) {
                issues.push({
                    type: "warning",
                    message: "Deep nesting detected (> 5 levels). Consider flattening structure.",
                    path
                });
            }
        }

        if (obj === null) {
            issues.push({
                type: "info",
                message: "Null value found. Verify if this should be optional or omitted.",
                path
            });
            return;
        }

        const type = typeof obj;

        if (type === "number") {
            // Check for float precision or large integers
            if (!Number.isSafeInteger(obj) && Number.isInteger(obj)) {
                issues.push({
                    type: "error",
                    message: "Number exceeds safe integer limit (2^53). Precision loss likely.",
                    path
                });
            } else if (!Number.isInteger(obj)) {
                // Check decimal places
                const parts = obj.toString().split(".");
                if (parts[1] && parts[1].length > 10) {
                    issues.push({
                        type: "warning",
                        message: "High precision float. Ensure backend handles this correctly.",
                        path
                    });
                }
            }
        } else if (Array.isArray(obj)) {
            // Check consistency
            if (obj.length > 0) {
                const firstType = typeof obj[0];
                // Simple check: Mixed types in array
                const mixed = obj.some(item => typeof item !== firstType && item !== null);
                if (mixed) {
                    issues.push({
                        type: "warning",
                        message: "Array contains mixed types.",
                        path
                    });
                }

                // Check object keys consistency (simplified)
                if (firstType === 'object' && obj[0] !== null) {
                    const keys = Object.keys(obj[0]).sort().join(",");
                    for (let i = 1; i < obj.length; i++) {
                        if (obj[i] && typeof obj[i] === 'object') {
                            const currentKeys = Object.keys(obj[i]).sort().join(",");
                            if (currentKeys !== keys) {
                                issues.push({
                                    type: "warning",
                                    message: "Inconsistent object keys in array.",
                                    path: `${path}[${i}]`
                                });
                                break; // Report once per array
                            }
                        }
                    }
                }
            }

            obj.forEach((item, index) => traverse(item, `${path}[${index}]`, depth + 1));
        } else if (type === "object") {
            Object.keys(obj).forEach(key => {
                traverse(obj[key], path ? `${path}.${key}` : key, depth + 1);
            });
        }
    }

    try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;
        traverse(parsed, "", 0);
    } catch (e) {
        issues.push({
            type: "error",
            message: "Invalid JSON: Cannot analyze.",
        });
    }

    // Deduplicate issues if needed, or limit count
    return issues.slice(0, 50); // Limit to 50 issues
}
