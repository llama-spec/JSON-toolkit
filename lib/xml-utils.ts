import { XMLParser, XMLBuilder } from "fast-xml-parser"

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
})

const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    format: true,
})

export function xmlToJson(xml: string): any {
    try {
        return parser.parse(xml)
    } catch (e) {
        throw new Error("Invalid XML")
    }
}

export function jsonToXml(json: any): string {
    try {
        return builder.build(json)
    } catch (e) {
        throw new Error("Invalid JSON for XML conversion")
    }
}
