import { DiffClient } from "./client"

export const metadata = {
    title: "JSON Diff Tool | API Debug Toolkit",
    description: "Compare two JSON objects side-by-side and highlight differences.",
}

export default function Page() {
    return <DiffClient />
}
