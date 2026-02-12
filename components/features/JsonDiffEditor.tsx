"use client"

import React from "react"
import { DiffEditor, DiffOnMount } from "@monaco-editor/react"
import { useTheme } from "next-themes"

interface JsonDiffEditorProps {
    original: string
    modified: string
    height?: string | number
    className?: string
}

export function JsonDiffEditor({
    original,
    modified,
    height = "100%",
    className
}: JsonDiffEditorProps) {
    const { theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-full w-full bg-muted/20 animate-pulse rounded-md" />
    }

    const monacoTheme = theme === "dark" || theme === "system" ? "vs-dark" : "light"

    return (
        <div className={className} style={{ height }}>
            <DiffEditor
                height="100%"
                language="json"
                original={original}
                modified={modified}
                theme={monacoTheme}
                options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    renderSideBySide: true,
                }}
            />
        </div>
    )
}
