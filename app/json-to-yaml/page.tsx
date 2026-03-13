import { YamlConverter } from "@/components/features/converters/YamlConverter"

export const metadata = {
    title: "JSON to YAML Converter | API Debug Toolkit",
    description: "Convert JSON to YAML and YAML to JSON online.",
}

export default function JsonToYamlPage() {
    return <YamlConverter />
}
