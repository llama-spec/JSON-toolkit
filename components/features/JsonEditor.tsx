"use client"

import * as React from "react"
import Editor, { OnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useDropzone } from "react-dropzone"
import { Download, Upload, Link as LinkIcon, AlertTriangle, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TreeView } from "./TreeView"
import { cn } from "@/lib/utils"
import { useWorker } from "@/hooks/useWorker"
import { getAdaptiveDebounce, shouldEnableTreeView, getEditorOptions, analyzeContentSize } from "@/lib/performance-utils"

interface JsonEditorProps {
    value: string
    onChange?: (value: string | undefined) => void
    language?: string
    readOnly?: boolean
    className?: string
}

export function JsonEditor({ value, onChange, language = "json", readOnly = false, className }: JsonEditorProps) {
    const { theme } = useTheme()
    const { runTask } = useWorker()
    const [monacoTheme, setMonacoTheme] = React.useState("vs-dark")
    const [viewMode, setViewMode] = React.useState<"code" | "tree">("code")
    const [treeData, setTreeData] = React.useState<any>(null)
    const [workerError, setWorkerError] = React.useState<string | null>(null)
    const [isValidJson, setIsValidJson] = React.useState(false)
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [canUseTreeView, setCanUseTreeView] = React.useState(true)
    const [performanceWarning, setPerformanceWarning] = React.useState<string | null>(null)

    // File Upload
    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const text = reader.result as string
            onChange?.(text)
        }
        reader.readAsText(file)
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true })

    // URL Fetch
    const handleUrlFetch = async () => {
        const url = prompt("Enter JSON URL:")
        if (!url) return
        try {
            const res = await fetch(url)
            const text = await res.text()
            onChange?.(text)
        } catch (e) {
            alert("Failed to fetch URL")
        }
    }

    React.useEffect(() => {
        setMonacoTheme(theme === "light" ? "light" : "vs-dark")
    }, [theme])

    // Worker-based validation and parsing with adaptive debouncing
    React.useEffect(() => {
        if (language !== 'json' || !value) {
            setIsValidJson(false)
            setPerformanceWarning(null)
            setCanUseTreeView(true)
            return
        }

        // Analyze content size and set warnings
        const metrics = analyzeContentSize(value)
        const treeViewEnabled = shouldEnableTreeView(value)
        setCanUseTreeView(treeViewEnabled)

        // Warnings removed or relaxed as per optimization plan
        // if (metrics.isVeryLarge) { ... } 

        let isMounted = true
        const adaptiveDebounce = getAdaptiveDebounce(value)

        const debounceId = setTimeout(async () => {
            setIsProcessing(true)
            try {
                // We use the worker to parse AND flatten the JSON.
                // This validates it AND prepares the data for the tree view without blocking the UI.

                // 1. Validate/Parse
                await runTask('VALIDATE_JSON', value)

                if (isMounted) {
                    setIsValidJson(true)
                    setWorkerError(null)

                    // 2. Flatten for Tree View (only if enabled)
                    if (treeViewEnabled && viewMode === 'tree') {
                        // Optimization: Pass the raw string to worker to avoid JSON.parse on main thread
                        const flattened = await runTask('FLATTEN_JSON', value)
                        if (isMounted) setTreeData(flattened)
                    } else if (treeViewEnabled) {
                        // Lazy load: we can just parse it for now or store the object
                        // But since TreeView now expects a list, we should probably prepare it or 
                        // let TreeView request it. For now, let's fetch it to be ready.
                        const flattened = await runTask('FLATTEN_JSON', value)
                        if (isMounted) setTreeData(flattened)
                    }

                    setIsProcessing(false)
                }
            } catch (e) {
                if (isMounted) {
                    setIsValidJson(false)
                    setWorkerError((e as Error).message)
                    setTreeData(null)
                    setIsProcessing(false)
                }
            }
        }, adaptiveDebounce) // Adaptive debounce based on file size

        return () => {
            isMounted = false
            clearTimeout(debounceId)
        }
    }, [value, language, runTask, viewMode])


    return (
        <div {...getRootProps()} className={cn("flex flex-col h-full bg-muted/20 relative outline-none", className)}>
            <input {...getInputProps()} />

            {isDragActive && !readOnly && (
                <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center border-2 border-primary border-dashed rounded-lg">
                    <div className="text-center">
                        <Upload size={48} className="mx-auto text-primary mb-4" />
                        <p className="text-lg font-bold">Drop file to load</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between px-2 py-1 border-b border-border bg-card/50 h-9 shrink-0">
                <div className="flex items-center gap-1 flex-1 overflow-hidden">
                    {!readOnly && (
                        <>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} title="Upload File">
                                <Upload size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleUrlFetch} title="Load from URL">
                                <LinkIcon size={14} />
                            </Button>
                        </>
                    )}
                    <div className="w-px h-4 bg-border mx-1" />
                    {language === 'json' && (
                        <div className="flex bg-muted rounded p-0.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 px-2 text-[10px]", viewMode === 'code' && "bg-background shadow-sm")}
                                onClick={() => setViewMode('code')}
                            >
                                Code
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={cn("h-6 px-2 text-[10px]", viewMode === 'tree' && "bg-background shadow-sm")}
                                onClick={() => setViewMode('tree')}
                                disabled={!isValidJson || !canUseTreeView}
                                title={!canUseTreeView ? "Tree view disabled for very large files" : ""}
                            >
                                <Network size={10} className="mr-1" /> Tree
                            </Button>
                        </div>
                    )}
                    {isProcessing && (
                        <div className="text-[10px] text-muted-foreground ml-2 animate-pulse">Processing...</div>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {performanceWarning && viewMode === 'code' && (
                        <div className="flex items-center text-yellow-600 dark:text-yellow-500 text-[10px] px-2">
                            <AlertTriangle size={12} className="mr-1" /> {performanceWarning}
                        </div>
                    )}
                    {workerError && viewMode === 'code' && (
                        <div className="flex items-center text-destructive text-[10px] px-2 animate-in fade-in">
                            <AlertTriangle size={12} className="mr-1" /> Invalid JSON
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                {viewMode === 'code' ? (
                    <Editor
                        height="100%"
                        language={language}
                        value={value}
                        theme={monacoTheme}
                        onChange={onChange}
                        options={getEditorOptions(value, {
                            fontSize: 13,
                            padding: { top: 8, bottom: 8 },
                            readOnly,
                        })}
                    />
                ) : (
                    <div className="h-full bg-card">
                        {isValidJson && treeData ? (
                            <TreeView data={treeData} />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <AlertTriangle className="mb-2 opacity-50" />
                                <p>{workerError || "Invalid JSON Data"}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
