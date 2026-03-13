"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle, Info, Zap, AlertOctagon } from "lucide-react"
import { JsonEditor } from "@/components/features/JsonEditor"
import { analyzeJson, AnalysisIssue } from "@/lib/analysis"

export function AnalyzerClient() {
    const [input, setInput] = React.useState("")
    const [issues, setIssues] = React.useState<AnalysisIssue[]>([])
    const [isValidJson, setIsValidJson] = React.useState(true)

    const handleInputChange = (value: string | undefined) => {
        const newVal = value || ""
        setInput(newVal)

        if (!newVal.trim()) {
            setIssues([])
            setIsValidJson(true)
            return
        }

        try {
            JSON.parse(newVal)
            setIsValidJson(true)
            // Analyze
            const results = analyzeJson(newVal)
            setIssues(results)
        } catch {
            setIsValidJson(false)
            setIssues([{ type: "error", message: "Invalid JSON Syntax. Fix syntax to run deep analysis." }])
        }
    }

    const counts = {
        error: issues.filter(i => i.type === "error").length,
        warning: issues.filter(i => i.type === "warning").length,
        info: issues.filter(i => i.type === "info").length,
    }

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] p-4 gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Zap className="text-primary" />
                    <h1 className="text-lg font-bold">Smart JSON Analyzer</h1>
                </div>

                <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-1 text-destructive">
                        <AlertOctagon size={16} /> {counts.error} Errors
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                        <AlertTriangle size={16} /> {counts.warning} Warnings
                    </div>
                    <div className="flex items-center gap-1 text-blue-500">
                        <Info size={16} /> {counts.info} Info
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
                {/* Input */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-2 border-b border-border bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">Input JSON to Analyze</span>
                    </div>
                    <div className="flex-1 relative">
                        <JsonEditor
                            value={input}
                            onChange={handleInputChange}
                            className="absolute inset-0"
                        />
                    </div>
                </div>

                {/* Report */}
                <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg overflow-hidden md:max-w-md lg:max-w-lg">
                    <div className="px-4 py-2 border-b border-border bg-muted/30 flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">Analysis Report</span>
                        {isValidJson && issues.length === 0 && input.trim() && (
                            <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle size={12} /> All Good</span>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
                        {!input.trim() && (
                            <div className="text-center text-muted-foreground py-10">
                                <Zap className="mx-auto mb-2 opacity-50" size={32} />
                                <p>Paste JSON to detect precision loss, nesting issues, and more.</p>
                            </div>
                        )}

                        {issues.map((issue, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg border text-sm flex gap-3 ${issue.type === "error" ? "bg-destructive/10 border-destructive/20 text-destructive" :
                                    issue.type === "warning" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                                        "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                                    }`}
                            >
                                <div className="mt-0.5 shrink-0">
                                    {issue.type === "error" ? <AlertOctagon size={16} /> :
                                        issue.type === "warning" ? <AlertTriangle size={16} /> :
                                            <Info size={16} />}
                                </div>
                                <div>
                                    <div className="font-semibold mb-0.5 capitalize">{issue.type}</div>
                                    <div>{issue.message}</div>
                                    {issue.path && (
                                        <div className="mt-1 text-xs opacity-80 font-mono bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded w-fit">
                                            Path: {issue.path}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
