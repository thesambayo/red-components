import viteLogo from "/vite.svg";
import { Accordion } from "./primitives/accordion.tsx";
import { Tooltip } from "@/primitives/tooltip.tsx";
import { ToastRoot, toaster } from "@red-elements/toast";

import { DialogRoot, DialogTrigger } from "@red-elements/dialog";
import { X } from "lucide-react";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { Dropdown } from "./primitives/dropdown.tsx";
import { Avatar } from "./primitives/avatar.tsx";
import { Tabs } from "./primitives/tabs.tsx";

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

function App() {
  const [show, setShow] = useState(false);
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
        <Accordion />
        <Avatar />
        <Tabs />
        <Tooltip />
        <Dropdown />

        <div className="max-w-md mx-auto space-x-5">
          <DialogRoot modal onOpenChange={(e) => console.log(e)}>
            <DialogTrigger as-child>
              <button className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3.5 py-1.5">
                Open Dialog
              </button>
            </DialogTrigger>
            <dialog className="backdrop:bg-fuchsia-100/70 relative w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 open:animate-in animate-out fade-out-0 open:fade-in-0 sm:rounded-lg">
              <h2 data-dialog-title>Edit Profile</h2>
              <p data-dialog-description>Make changes to your profile.</p>
              <div className=" grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <input id="name" className="col-span-3 border p-1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right">
                    Username
                  </label>
                  <input id="username" className="col-span-3 border p-1" />
                </div>
                <button
                  data-dialog-close
                  className="absolute cursor-pointer right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="size-5" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </dialog>
          </DialogRoot>
        </div>
      </div>
      <ToastRoot theme="light" />
    </>
  );
}

export default App;
