"use client"

import * as React from "react"
import { Copy, Code2 } from "lucide-react"
import { JsonEditor } from "@/components/features/JsonEditor"
import { jsonToTypescript, jsonToZod, jsonToPydantic } from "@/lib/converters"

type OutputLanguage = "typescript" | "zod" | "pydantic"

export function ConverterClient() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [language, setLanguage] = React.useState<OutputLanguage>("typescript")
    const [rootName, setRootName] = React.useState("Root")

    const handleInputChange = (value: string | undefined) => {
        const newVal = value || ""
        setInput(newVal)
        generate(newVal, language, rootName)
    }

    const generate = (json: string, lang: OutputLanguage, root: string) => {
        if (!json.trim()) {
            setOutput("")
            return
        }

        let result = ""
        if (lang === "typescript") {
            result = jsonToTypescript(json, root)
        } else if (lang === "zod") {
            result = jsonToZod(json, root)
        } else if (lang === "pydantic") {
            result = jsonToPydantic(json, root)
        }
        setOutput(result)
    }

    React.useEffect(() => {
        generate(input, language, rootName)
    }, [language, rootName])

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4 gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Code2 className="text-primary" />
                    <h1 className="text-lg font-bold">JSON to Code Converter</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Input Name:</label>
                        <input
                            type="text"
                            value={rootName}
                            onChange={(e) => setRootName(e.target.value)}
                            className="px-2 py-1.5 rounded-md border border-input bg-background/50 text-sm w-32 focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                    </div>

                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-md border border-input">
                        {(["typescript", "zod", "pydantic"] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${language === lang
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                {lang === "typescript" ? "TypeScript" : lang === "zod" ? "Zod" : "Pydantic"}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Editor Pane */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-2 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Input JSON</span>
                    </div>
                    <div className="flex-1 relative">
                        <JsonEditor
                            value={input}
                            onChange={handleInputChange}
                            className="absolute inset-0"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Output ({language})</span>
                        <button
                            onClick={handleCopy}
                            disabled={!output}
                            className="text-xs flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <Copy size={12} /> Copy
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        <JsonEditor
                            value={output}
                            readOnly={true}
                            language={language === "pydantic" ? "python" : "typescript"}
                            className="absolute inset-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
