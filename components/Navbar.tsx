"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Terminal } from "lucide-react"

export function Navbar() {
    const { theme, setTheme } = useTheme()

    return (
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg select-none">
                    <div className="p-1 bg-foreground text-background rounded-md">
                        <Terminal size={20} />
                    </div>
                    <span>API Debug Toolkit</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/json-formatter" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        Formatter
                    </Link>
                    <Link href="/convert-json-to-typescript" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        Converter
                    </Link>
                    <Link href="/json-diff-tool" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        Diff
                    </Link>
                    <Link href="/json-to-xml" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        XML
                    </Link>
                    <Link href="/json-to-yaml" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        YAML
                    </Link>
                    <Link href="/json-to-csv" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
                        CSV
                    </Link>
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="relative p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </button>
                </div>
            </div>
        </nav>
    )
}
