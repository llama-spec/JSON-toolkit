export function AdPlaceholder({ className, label = "Ad Space" }: { className?: string, label?: string }) {
    return (
        <div className={`bg-muted/50 border border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center text-xs text-muted-foreground uppercase tracking-wider select-none ${className}`}>
            {label}
        </div>
    )
}
