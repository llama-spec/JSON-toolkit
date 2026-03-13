import { CsvConverter } from "@/components/features/converters/CsvConverter"

export const metadata = {
    title: "JSON to CSV Converter | API Debug Toolkit",
    description: "Convert JSON to CSV and CSV to JSON online.",
}

export default function JsonToCsvPage() {
    return <CsvConverter />
}
