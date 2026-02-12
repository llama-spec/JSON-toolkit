"use client"

import { ConverterLayout } from "@/components/features/ConverterLayout"
import { jsonToXml, xmlToJson } from "@/lib/xml-utils"

export function XmlConverter() {
    return (
        <ConverterLayout
            title="JSON <-> XML"
            sourceExample='{"root": {"foo": "bar"}}'
            targetLanguage="XML"
            toTarget={jsonToXml}
            toJson={xmlToJson}
        />
    )
}
