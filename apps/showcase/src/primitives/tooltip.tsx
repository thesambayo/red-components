import {TooltipContent, TooltipRoot, TooltipTrigger} from "@web-elements/tooltip";
import {PlusIcon} from "lucide-react";

export function Tooltip() {
    return (
        <div className="max-w-md mx-auto">
            <TooltipRoot>
                <TooltipTrigger
                    className="text-violet-300 hover:bg-violet-100 inline-flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white shadow-[0_2px_10px] outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                >
                    {/*Trigger*/}
                    <PlusIcon />
                </TooltipTrigger>
                <TooltipContent className="TooltipContent" side="bottom" sideOffset={10}>Content</TooltipContent>
            </TooltipRoot>
        </div>
    )
}