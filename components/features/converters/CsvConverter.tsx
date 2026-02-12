"use client"

import { ConverterLayout } from "@/components/features/ConverterLayout"
import { jsonToCsv, csvToJson } from "@/lib/csv-utils"

export function CsvConverter() {
    return (
        <ConverterLayout
            title="JSON <-> CSV"
            sourceExample='[{"name": "Alice", "age": 30}]'
            targetLanguage="CSV"
            toTarget={jsonToCsv}
            toJson={csvToJson}
        />
    )
}
