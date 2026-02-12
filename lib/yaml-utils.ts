import yaml from "js-yaml"

export function yamlToJson(yamlStr: string): any {
    try {
        return yaml.load(yamlStr)
    } catch (e) {
        throw new Error(`Invalid YAML: ${(e as Error).message}`)
    }
}

export function jsonToYaml(json: any): string {
    try {
        return yaml.dump(json)
    } catch (e) {
        throw new Error(`Invalid JSON for YAML conversion: ${(e as Error).message}`)
    }
}
