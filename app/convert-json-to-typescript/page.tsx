import { ConverterClient } from "./client"

export const metadata = {
    title: "JSON to TypeScript, Zod & Pydantic | API Debug Toolkit",
    description: "Instantly convert JSON objects to TypeScript Interfaces, Zod Schemas, or Pydantic Models.",
}

export default function Page() {
    return <ConverterClient />
}
