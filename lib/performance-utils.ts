/**
 * Performance utilities for handling large files
 */

export interface PerformanceMetrics {
    lineCount: number;
    charCount: number;
    isLarge: boolean;
    isVeryLarge: boolean;
}

/**
 * Analyze content size and return performance metrics
 */
export function analyzeContentSize(content: string): PerformanceMetrics {
    const charCount = content.length;
    const lineCount = content.split('\n').length;

    return {
        lineCount,
        charCount,
        isLarge: lineCount > 1000 || charCount > 50000,
        isVeryLarge: lineCount > 5000 || charCount > 250000,
    };
}

/**
 * Calculate adaptive debounce time based on content size
 */
export function getAdaptiveDebounce(content: string): number {
    const metrics = analyzeContentSize(content);

    // User requested 0 delay for instant feedback
    if (metrics.isVeryLarge) {
        return 0;
    } else if (metrics.isLarge) {
        return 0;
    }
    return 0;
}

/**
 * Check if tree view should be enabled for this content
 */
export function shouldEnableTreeView(content: string): boolean {
    const metrics = analyzeContentSize(content);
    // Disable tree view for very large files (>200000 lines)
    return metrics.lineCount < 200000;
}

/**
 * Get optimized Monaco editor options based on content size
 */
export function getEditorOptions(content: string, baseOptions: any = {}) {
    const metrics = analyzeContentSize(content);

    const optimizedOptions = {
        ...baseOptions,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on' as const,
    };

    if (metrics.isLarge) {
        // Additional optimizations for large files
        return {
            ...optimizedOptions,
            folding: false,
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'none' as const,
            occurrencesHighlight: 'off' as const,
            selectionHighlight: false,
            codeLens: false,
            contextmenu: false,
        };
    }

    return optimizedOptions;
}
