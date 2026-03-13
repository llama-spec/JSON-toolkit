"use client"

import * as React from "react"
import { ArrowRightLeft, RotateCcw, FileDiff } from "lucide-react"
import { JsonEditor } from "@/components/features/JsonEditor"
import { JsonDiffEditor } from "@/components/features/JsonDiffEditor"
import { formatJson } from "@/lib/json-utils"

export function DiffClient() {
    const [original, setOriginal] = React.useState("")
    const [modified, setModified] = React.useState("")
    const [diffOriginal, setDiffOriginal] = React.useState("")
    const [diffModified, setDiffModified] = React.useState("")
    const [showDiff, setShowDiff] = React.useState(false)

    const handleCompare = () => {
        // Auto-format both before diffing for better results
        const fmtOriginal = formatJson(original)
        const fmtModified = formatJson(modified)

        setDiffOriginal(fmtOriginal)
        setDiffModified(fmtModified)
        setShowDiff(true)
    }

    const handleReset = () => {
        setShowDiff(false)
        setDiffOriginal("")
        setDiffModified("")
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4 gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-2">
                    <FileDiff className="text-primary" />
                    <h1 className="text-lg font-bold">JSON Diff Tool</h1>
                </div>

                <div className="flex items-center gap-2">
                    {showDiff ? (
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <RotateCcw size={16} /> Edit Inputs
                        </button>
                    ) : (
                        <button
                            onClick={handleCompare}
                            disabled={!original || !modified}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <ArrowRightLeft size={16} /> Compare
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 relative">
                {showDiff ? (
                    <div className="absolute inset-0 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
                        <div className="p-2 bg-muted/30 border-b border-border text-center text-sm font-medium text-muted-foreground">
                            Visual Difference (Original vs Modified)
                        </div>
                        <div className="flex-1 relative">
                            <JsonDiffEditor original={diffOriginal} modified={diffModified} className="absolute inset-0" />
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                        {/* Original Input */}
                        <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                            <div className="px-4 py-2 border-b border-border bg-muted/30">
                                <span className="text-sm font-medium text-muted-foreground">Original JSON</span>
                            </div>
                            <div className="flex-1 relative">
                                <JsonEditor
                                    value={original}
                                    onChange={(v) => setOriginal(v || "")}
                                    className="absolute inset-0"
                                />
                            </div>
                        </div>

                        {/* Modified Input */}
                        <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                            <div className="px-4 py-2 border-b border-border bg-muted/30">
                                <span className="text-sm font-medium text-muted-foreground">Modified JSON</span>
                            </div>
                            <div className="flex-1 relative">
                                <JsonEditor
                                    value={modified}
                                    onChange={(v) => setModified(v || "")}
                                    className="absolute inset-0"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
