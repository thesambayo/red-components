import { ChevronDown } from "lucide-react";
import {
  NewAccordionContent as AccordionContent,
  NewAccordionItem as AccordionItem,
  NewAccordionRoot as AccordionRoot,
  NewAccordionTrigger as AccordionTrigger,
  NewAccordionHeader,
} from "@red-elements/new-accordion";
import { useState } from "react";

export function Accordion() {
  const [show, setShow] = useState(false);

  const accordionItems = [
    {
      value: "item-1",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      value: "item-2",
      title: "Is it unstyled?",
      content:
        "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    },
    {
      value: "item-3",
      title: "Can it be animated?",
      content:
        "Yes! You can use the transition prop to configure the animation.",
    },
  ];

  return (
    <div className="max-w-md mx-auto">
      <button onClick={() => setShow(!show)}>
        toggle {show ? "single" : "multiple"}
      </button>
      <AccordionRoot
        className="w-full"
        defaultValue={["item-3"]}
        type={show ? "single" : "multiple"}
        collapsible
      >
        {accordionItems.map((accordionItem) => (
          <AccordionItem
            key={accordionItem.value}
            value={accordionItem.value}
            className="flex flex-col border-b focus-visible:outline-0"
          >
            <NewAccordionHeader>
              <AccordionTrigger className="cursor-pointer flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 data-[state=open]:text-red-600">
                {accordionItem.title}
                <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
            </NewAccordionHeader>
            <AccordionContent className="overflow-hidden text-sm transition-all">
              <div className="pb-4 pt-0">{accordionItem.content}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </div>
  );
}
