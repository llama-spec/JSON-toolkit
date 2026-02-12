import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
    title: string
    description: string
    href: string
    icon: React.ReactNode
    className?: string
}

export function FeatureCard({ title, description, href, icon, className }: FeatureCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group block p-6 bg-card border border-white/10 rounded-xl hover:shadow-lg transition-all hover:border-primary relative overflow-hidden active:scale-[0.98]",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                {icon}
            </div>
            <div className="relative z-10">
                <div className="mb-4 text-primary">{icon}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground mb-4">{description}</p>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    Launch Tool <ArrowRight size={16} className="ml-1" />
                </div>
            </div>
        </Link>
    )
}
