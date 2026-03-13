import { AnalyzerClient } from "./client"

export const metadata = {
    title: "Smart JSON Analyzer | API Debug Toolkit",
    description: "Detect deep nesting, float precision loss, and structural issues in your JSON.",
}

export default function Page() {
    return <AnalyzerClient />
}
