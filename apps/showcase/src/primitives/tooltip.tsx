import {TooltipContent, TooltipRoot, TooltipTrigger} from "@red-elements/tooltip";

export function Tooltip() {
    return (
        <div className="max-w-md mx-auto">
            <TooltipRoot>
                <TooltipTrigger
                    className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3.5 py-1.5"
                >
                    Hover me and know peace
                </TooltipTrigger>
                <TooltipContent
                    className="TooltipContent z-50 overflow-hidden rounded-md border bg-popover-foreground px-3 py-1.5 text-sm text-popover shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    side="bottom"
                    sideOffset={5}
                >
                    <p>Add to library</p>
                </TooltipContent>
            </TooltipRoot>
        </div>
    )
}