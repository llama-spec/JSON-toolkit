"use client"

import * as React from "react"
import { ArrowRightLeft, Copy, Download, Upload } from "lucide-react"
import { JsonEditor } from "@/components/features/JsonEditor"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConverterLayoutProps {
    title: string
    sourceExample: string
    targetLanguage: string
    toTarget: (json: any) => string
    toJson: (target: string) => any
}

export function ConverterLayout({ title, sourceExample, targetLanguage, toTarget, toJson }: ConverterLayoutProps) {
    const [left, setLeft] = React.useState("")
    const [right, setRight] = React.useState("")
    const [error, setError] = React.useState<string | null>(null)

    const handleConvertLeftToRight = () => {
        try {
            const json = JSON.parse(left)
            const result = toTarget(json)
            setRight(result)
            setError(null)
        } catch (e) {
            setError(`Failed to convert to ${targetLanguage}: ${(e as Error).message}`)
        }
    }

    const handleConvertRightToLeft = () => {
        try {
            const json = toJson(right)
            setLeft(JSON.stringify(json, null, 2))
            setError(null)
        } catch (e) {
            setError(`Failed to convert to JSON: ${(e as Error).message}`)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] container mx-auto px-4 py-6 gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{title} Converter</h1>
                {error && <div className="text-destructive text-sm font-medium animate-pulse">{error}</div>}
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Left Panel (JSON) */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between items-center h-10">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">JSON</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(left)}>
                            <Copy size={14} />
                        </Button>
                    </div>
                    <div className="flex-1 relative group">
                        <JsonEditor
                            value={left}
                            onChange={(v) => setLeft(v || "")}
                            className="absolute inset-0"
                            readOnly={false}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-center gap-4 shrink-0">
                    <Button onClick={handleConvertLeftToRight} title="JSON to Target" variant="secondary">
                        <ArrowRightLeft size={18} />
                    </Button>
                    <Button onClick={handleConvertRightToLeft} title="Target to JSON" variant="secondary" className="md:rotate-180">
                        <ArrowRightLeft size={18} />
                    </Button>
                </div>

                {/* Right Panel (Target) */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between items-center h-10">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{targetLanguage}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => navigator.clipboard.writeText(right)}>
                            <Copy size={14} />
                        </Button>
                    </div>
                    <div className="flex-1 relative">
                        <JsonEditor
                            value={right}
                            onChange={(v) => setRight(v || "")}
                            className="absolute inset-0"
                            language={targetLanguage.toLowerCase() === 'xml' ? 'html' : targetLanguage.toLowerCase()}
                            readOnly={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
