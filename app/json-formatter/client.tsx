"use client"

import * as React from "react"
import { Copy, FileJson, Minus, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { JsonEditor } from "@/components/features/JsonEditor"
import { formatJson, minifyJson, validateJson } from "@/lib/json-utils"
import { cn } from "@/lib/utils"

export function JsonFormatterClient() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [error, setError] = React.useState<string | null>(null)
    const [isValid, setIsValid] = React.useState(true)

    const handleInputChange = (value: string | undefined) => {
        const newVal = value || ""
        setInput(newVal)

        // Real-time validation
        const validation = validateJson(newVal)
        setIsValid(validation.isValid)
        setError(validation.error || null)
    }

    const handleFormat = () => {
        if (!isValid && input.trim()) return
        const formatted = formatJson(input)
        setOutput(formatted)
    }

    const handleMinify = () => {
        if (!isValid && input.trim()) return
        const minified = minifyJson(input)
        setOutput(minified)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
    }

    const handleClear = () => {
        setInput("")
        setOutput("")
        setError(null)
        setIsValid(true)
    }

    const loadSample = () => {
        const sample = JSON.stringify({
            project: "API Debug Toolkit",
            features: ["Formatter", "Converter", "Diff"],
            version: 1.0,
            active: true,
            meta: {
                created_at: new Date().toISOString(),
                author: "User"
            }
        }, null, 2)
        setInput(sample)
        handleInputChange(sample)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4 gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-2">
                    <FileJson className="text-primary" />
                    <h1 className="text-lg font-bold">JSON Formatter & Validator</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={loadSample}
                        className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Load Sample
                    </button>
                    <div className="h-6 w-px bg-border mx-2" />
                    <button
                        onClick={handleFormat}
                        disabled={!isValid || !input}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Format
                    </button>
                    <button
                        onClick={handleMinify}
                        disabled={!isValid || !input}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Minus size={16} /> Minify
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Clear All"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Editor Pane */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Input */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden relative">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Input JSON</span>
                        <div className="flex items-center gap-2 text-xs">
                            {input && (
                                isValid ? (
                                    <span className="text-green-500 flex items-center gap-1"><CheckCircle2 size={12} /> Valid</span>
                                ) : (
                                    <span className="text-destructive flex items-center gap-1"><XCircle size={12} /> Invalid</span>
                                )
                            )}
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <JsonEditor
                            value={input}
                            onChange={handleInputChange}
                            className="absolute inset-0"
                        />
                    </div>
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-2 border-t border-destructive/20 break-all max-h-24 overflow-y-auto">
                            Error: {error}
                        </div>
                    )}
                </div>

                {/* Output */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Output</span>
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
                            className="absolute inset-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
