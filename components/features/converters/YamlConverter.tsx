"use client"

import { ConverterLayout } from "@/components/features/ConverterLayout"
import { jsonToYaml, yamlToJson } from "@/lib/yaml-utils"

export function YamlConverter() {
    return (
        <ConverterLayout
            title="JSON <-> YAML"
            sourceExample='{"root": {"foo": "bar"}}'
            targetLanguage="YAML"
            toTarget={jsonToYaml}
            toJson={yamlToJson}
        />
    )
}
