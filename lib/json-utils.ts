export interface ValidationResult {
    isValid: boolean;
    error?: string;
    line?: number;
}

export function validateJson(jsonString: string): ValidationResult {
    if (!jsonString.trim()) {
        return { isValid: true };
    }
    try {
        JSON.parse(jsonString);
        return { isValid: true };
    } catch (e: any) {
        const message = e.message || "Invalid JSON";
        // Basic attempt to extract position/line if available, though V8 messages vary.
        // Example: "Unexpected token } in JSON at position 10"
        return { isValid: false, error: message };
    }
}

export function formatJson(jsonString: string, indent: number = 2): string {
    if (!jsonString.trim()) return "";
    try {
        const obj = JSON.parse(jsonString);
        return JSON.stringify(obj, null, indent);
    } catch {
        return jsonString;
    }
}

export function minifyJson(jsonString: string): string {
    if (!jsonString.trim()) return "";
    try {
        const obj = JSON.parse(jsonString);
        return JSON.stringify(obj);
    } catch {
        return jsonString;
    }
}
