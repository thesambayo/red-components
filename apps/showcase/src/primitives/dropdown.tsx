import { ChevronDown } from "lucide-react";

import {
  DropdownRoot,
  DropdownSeparator,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from "@red-elements/dropdown";

const dropdownItems = [
  { type: "item", value: "edit", label: "Edit", disabled: false },
  { type: "item", value: "duplicate", label: "Duplicate", disabled: false },
  { type: "separator" },
  { type: "item", value: "archive", label: "Archive", disabled: true },
  { type: "item", value: "delete", label: "Delete", disabled: false },
];

export function Dropdown() {
  return (
    <div className="max-w-md mx-auto">
      <DropdownRoot onOpen={(e) => console.log(e)}>
        <DropdownTrigger className="group cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3.5 py-1.5">
          Open Menu
          <ChevronDown className="ml-2 size-4 transition-all group-data-[state=open]:rotate-180" />
        </DropdownTrigger>
        <DropdownContent className="DropdownContent open:flex open:flex-row max-h-[var(--dropdown-content-available-height)] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md open:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 open:fade-in-0 data-[state=closed]:zoom-out-95 open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--dropdown-content-transform-origin]">
          {dropdownItems.map((item, idx) => {
            if (item.type === "separator") {
              return (
                <DropdownSeparator
                  key={idx}
                  className="flex bg-border -mx-1 my-1 h-px"
                />
              );
            }
            return (
              <DropdownItem
                key={item.value}
                value={item.value}
                onSelect={(e) => console.log(e)}
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:text-red-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
                disabled={item.disabled}
              >
                {item.label}
              </DropdownItem>
            );
          })}
        </DropdownContent>
      </DropdownRoot>
    </div>
  );
}
