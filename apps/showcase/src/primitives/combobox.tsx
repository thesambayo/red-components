import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
  ComboboxTrigger,
} from "@red-elements/combobox";
import { ChevronDownIcon } from "lucide-react";

const frameworks = [
  { value: "nextjs", label: "Next.js", disabled: false },
  { value: "sveltekit", label: "SvelteKit", disabled: false },
  { value: "nuxtjs", label: "Nuxt.js", disabled: true },
  { value: "remix", label: "Remix", disabled: false },
  { value: "astro", label: "Astro", disabled: false },
];

export function Combobox() {
  return (
    <div className="max-w-md mx-auto space-x-5">
      <ComboboxRoot
        default-value="nextjs"
        onOpen={(value) => console.log(value, "onOpen")}
        onClose={(value) => console.log(value, "onClose")}
        onValueChange={(value) => console.log(value, "onValueChange")}
        onSearchChange={(value) => console.log(value, "onSearchChange")}
      >
        <ComboboxAnchor>
          <ComboboxTrigger className="group cursor-pointer inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3.5 py-1.5">
            <span>Select framework</span>
            <ChevronDownIcon className="size-4 transition-all group-data-[state=open]:rotate-180" />
          </ComboboxTrigger>
        </ComboboxAnchor>
        <ComboboxContent className="data-[state=open]:flex flex-col gap-3 border p-1 bg-white">
          <ComboboxInput placeholder="Search framework..."></ComboboxInput>
          {frameworks.map(({ label, value, disabled }) => (
            <ComboboxItem
              key={value}
              value={value}
              className="data-[highlighted]:bg-accent data-[disabled]:text-red-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              disabled={disabled}
            >
              {label}
            </ComboboxItem>
          ))}
          <ComboboxEmpty>No framework found</ComboboxEmpty>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  );
}
