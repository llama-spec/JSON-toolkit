import { XmlConverter } from "@/components/features/converters/XmlConverter"

export const metadata = {
    title: "JSON to XML Converter | API Debug Toolkit",
    description: "Convert JSON to XML and XML to JSON online.",
}

export default function JsonToXmlPage() {
    return <XmlConverter />
}
