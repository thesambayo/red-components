import { ChevronDown } from "lucide-react"
import {AccordionContent, AccordionItem, AccordionRoot, AccordionTrigger} from "@samred/accordion";

export function Accordion() {
    return (
        <div className="max-w-md mx-auto">
            <AccordionRoot defaultValue={["item-3"]} type="single" className="w-full">
                <AccordionItem value="item-1" className="flex flex-col border-b focus-visible:outline-0">
                    <AccordionTrigger
                        className="cursor-pointer flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                    >
                        Is it accessible?
                        <ChevronDown  className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="overflow-hidden text-sm transition-all">
                        <div className="pb-4 pt-0">
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="flex flex-col border-b focus-visible:outline-0">
                    <AccordionTrigger
                        className="cursor-pointer flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                    >
                        Is it styled?
                        <ChevronDown  className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="overflow-hidden text-sm transition-all">
                        <div className="pb-4 pt-0">
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="flex flex-col border-b focus-visible:outline-0">
                    <AccordionTrigger
                        className="cursor-pointer flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
                    >
                        Is it animated?
                        <ChevronDown  className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                    <AccordionContent className="overflow-hidden text-sm transition-all">
                        <div className="pb-4 pt-0">
                            Yes. It's animated by default, but you can disable it if you prefer.
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </AccordionRoot>
        </div>
    )
}