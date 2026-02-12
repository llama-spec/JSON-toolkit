import { Code2, FileDiff, FileJson, Zap } from "lucide-react"
import { FeatureCard } from "@/components/ui/FeatureCard"
import { AdPlaceholder } from "@/components/ads/AdPlaceholder"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-3.5rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

        {/* Main Content */}
        <div className="flex flex-col gap-10">
          {/* Hero Section */}
          <div className="text-center lg:text-left space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              API Debug Toolkit
            </h1>
            <p className="text-lg text-muted-foreground/80 max-w-2xl leading-relaxed">
              Essential, privacy-first developer tools. No server calls, no data leaks.
              Run entire workflows client-side.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              title="JSON Formatter"
              description="Validate, format, and minify JSON with smart error highlighting."
              href="/json-formatter"
              icon={<FileJson size={28} className="text-foreground" />}
            />
            <FeatureCard
              title="JSON to Types"
              description="Convert JSON to TypeScript, Zod Schemas, and Pydantic models."
              href="/convert-json-to-typescript"
              icon={<Code2 size={28} className="text-foreground" />}
            />
            <FeatureCard
              title="JSON Diff"
              description="Compare two JSON objects to find differences instantly."
              href="/json-diff-tool"
              icon={<FileDiff size={28} className="text-foreground" />}
            />
            <FeatureCard
              title="Smart Analyzer"
              description="Detect precision loss, nulls, and schema inconsistencies."
              href="/debug-invalid-json"
              icon={<Zap size={28} className="text-foreground" />}
            />
          </div>

          <div className="w-full mt-4">
            <AdPlaceholder className="w-full h-24" label="Horizontal Ad Space" />
          </div>
        </div>

        {/* Sidebar (Ads) */}
        <aside className="hidden lg:flex flex-col gap-6 pt-4">
          <div className="sticky top-24 space-y-6">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sponsored</div>
            <AdPlaceholder className="w-full h-[600px]" label="Vertical Ad Space" />
            <div className="p-4 bg-muted/10 border border-white/5 rounded-lg text-sm text-muted-foreground/60">
              <p>Simple, client-side tools built for speed and privacy.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
