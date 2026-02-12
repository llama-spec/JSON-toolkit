import Papa from "papaparse"

export function csvToJson(csv: string): any[] {
    const result = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
    })

    if (result.errors.length > 0) {
        throw new Error(`CSV Parse Error: ${result.errors[0].message}`)
    }

    return result.data as any[]
}

export function jsonToCsv(json: any): string {
    if (Array.isArray(json)) {
        return Papa.unparse(json)
    }
    // Handle single object by wrapping in array for CSV
    if (typeof json === 'object' && json !== null) {
        return Papa.unparse([json])
    }
    throw new Error("Input must be an array of objects or an object")
}
