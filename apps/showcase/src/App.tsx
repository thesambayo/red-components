import viteLogo from "/vite.svg";
import { Accordion } from "./primitives/accordion.tsx";
import { Tabs } from "@/primitives/tabs.tsx";
import { Tooltip } from "@/primitives/tooltip.tsx";
import { ToastRoot, toaster } from "@red-elements/toast";
import {
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@red-elements/dropdown";

function App() {
  function sendToast() {
    toaster.add({
      type: "success",
      duration: 30000,
      content: "send toast",
      onDismiss: (t) => console.log("toast closed", t.id),
      onAutoClose: (t) => console.log("toast autoclosed", t.id),
    });
  }
  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
      </div>

      <div className="space-y-10">
        {/* <Avatar /> */}
        <Accordion />
        <Tabs />
        <Tooltip />
        <div className="max-w-md mx-auto space-x-5">
          <button onClick={sendToast}>send toast</button>
        </div>
        <div className="max-w-md mx-auto space-x-5">
          <DropdownRoot className="block">
            <DropdownTrigger className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3.5 py-1.5">
              open dropdown
            </DropdownTrigger>
            <DropdownContent
              side="top"
              sideOffset={8}
              className="flex flex-col z-50 max-h-[var(--dropdown-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--dropdown-content-transform-origin]"
            >
              <DropdownItem
                onSelect={(e) => console.log(e)}
                id="first"
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
              >
                first
              </DropdownItem>
              <DropdownItem
                id="second"
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
              >
                second
              </DropdownItem>
              <DropdownItem
                id="third"
                className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
              >
                third
              </DropdownItem>
            </DropdownContent>
          </DropdownRoot>
        </div>
      </div>
      <ToastRoot theme="light" />
    </>
  );
}

export default App;
