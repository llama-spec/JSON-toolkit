"use client"

import * as React from "react"
import { List } from "react-window"
import { AutoSizer } from "react-virtualized-auto-sizer"
import { ChevronRight, ChevronDown, Braces, Brackets } from "lucide-react"

interface TreeViewProps {
    data: any
}

// Flattens the object into a list of nodes for virtualization
const flattenObject = (obj: any, depth = 0, prefix = "root"): any[] => {
    if (obj === null || typeof obj !== "object") {
        return [{ id: prefix, label: prefix.split('.').pop(), value: obj, depth, isLeaf: true }]
    }

    const keys = Object.keys(obj)
    const isArray = Array.isArray(obj)
    const label = prefix.split('.').pop() || "root"

    return [
        {
            id: prefix,
            label,
            depth,
            isLeaf: false,
            expanded: true, // Default expanded state, managed by parent usually but simplified here
            isArray,
            childCount: keys.length,
            children: keys.reduce((acc: any[], key) => {
                return [...acc, ...flattenObject(obj[key], depth + 1, `${prefix}.${key}`)]
            }, [])
        }
    ]
}


// Compact node structure matching the worker:
// [id, label, depth, isLeaf, isExpanded, isArray, childCount, value]
type CompactNode = [string, string, number, boolean, boolean, boolean, number, any];

// A more robust flattening that supports virtual toggle state - ADAPTED FOR WORKER INPUT (COMPACT)
const useFlattenedTree = (initialFlattenedList: CompactNode[]) => {
    // Optimization: The worker returns the FULL flattened list as compact arrays. 
    // We just filter it here based on expanded IDs. 

    // Initialize expandedIds from the initial list
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() => {
        const ids = new Set<string>();
        initialFlattenedList.forEach(node => {
            // node[0] is id, node[4] is isExpanded
            if (node[4]) ids.add(node[0]);
        });
        return ids;
    });

    const toggle = (id: string) => {
        const newSet = new Set(expandedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setExpandedIds(newSet)
    }

    // Filter the full list based on expanded state
    // This is very fast even for 5000+ items (linear scan)
    const visibleList = React.useMemo(() => {
        const result: CompactNode[] = [];
        const expanded = expandedIds;

        let skipUntilDepth = -1;

        for (let i = 0; i < initialFlattenedList.length; i++) {
            const node = initialFlattenedList[i];
            const depth = node[2];

            if (skipUntilDepth !== -1) {
                if (depth > skipUntilDepth) {
                    continue;
                } else {
                    skipUntilDepth = -1;
                }
            }

            const id = node[0];
            const isExpanded = expanded.has(id);
            const isLeaf = node[3];

            // Create a new tuple with the updated expanded state?
            // Actually, we can just return the node as is if we track expansion externally?
            // But the UI needs to know 'isExpanded' to show correct icon.
            // Let's shallow copy the tuple and update index 4.
            // Actually, we don't need to copy if we pass 'isExpanded' separately to the Row.
            // But let's keep the hook returning "ready to render" data.
            // For max performance, maybe we avoid creating new objects/tuples if possible?
            // But React needs new references to detect changes?
            // Let's create a *lightweight wrapper* or just modify the tuple on the fly? 
            // Modifying the tuple is mutating state - bad.
            // Let's create a new tuple. It's just an array of primitives/refs. Fast.

            const newNode: CompactNode = [
                node[0], // id
                node[1], // label
                node[2], // depth
                node[3], // isLeaf
                isExpanded, // updated expansion
                node[5], // isArray
                node[6], // childCount
                node[7]  // value
            ];

            result.push(newNode);

            if (!isExpanded && !isLeaf) {
                skipUntilDepth = depth;
            }
        }

        return result;
    }, [initialFlattenedList, expandedIds]);

    return { flattenedList: visibleList, toggle }
}

export function TreeView({ data }: TreeViewProps) {
    // data is now the FLATTENED COMPACT list from the worker
    const { flattenedList, toggle } = useFlattenedTree(data as CompactNode[]);

    const Row = ({ index, style, data }: any) => {
        const node = flattenedList[index];
        if (!node) return null;

        // Tuple unpacking for clarity
        const [id, label, depth, isLeaf, isExpanded, isArray, childCount, value] = node;

        const paddingLeft = depth * 16 + 8

        if (isLeaf) {
            let valueColor = "text-yellow-500"
            if (typeof value === "number") valueColor = "text-blue-500"
            if (typeof value === "boolean") valueColor = "text-purple-500"
            if (value === null) valueColor = "text-red-500"

            return (
                <div style={style} className="flex items-center hover:bg-muted/10 text-xs font-mono">
                    <div style={{ paddingLeft }} className="flex items-center truncate">
                        <span className="text-muted-foreground mr-2">{label}:</span>
                        <span className={valueColor}>{JSON.stringify(value)}</span>
                    </div>
                </div>
            )
        }

        const Icon = isArray ? Brackets : Braces

        return (
            <div
                style={style}
                className="flex items-center hover:bg-muted/10 cursor-pointer select-none text-xs font-mono"
                onClick={() => toggle(id)}
            >
                <div style={{ paddingLeft }} className="flex items-center">
                    <div className="w-4 h-4 flex items-center justify-center mr-1 text-muted-foreground">
                        {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </div>
                    <span className="text-primary font-bold mr-2">{label}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                        <Icon size={10} /> {isArray ? childCount + " items" : childCount + " keys"}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full">
            <AutoSizer
                renderProp={({ height, width }: { height: number | undefined, width: number | undefined }) => (
                    <List
                        style={{ height: height || '100%', width: width || '100%' }}
                        rowCount={flattenedList.length}
                        rowHeight={28}
                        overscanCount={10}
                        rowComponent={Row}
                        rowProps={{}}
                    />
                )}
            />
        </div>
    )
}
