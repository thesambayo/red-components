import { useState } from "react";
import { cva } from "class-variance-authority";
import { ToastRoot, toaster } from "@red-elements/toast";
import viteLogo from "/vite.svg";

import { Accordion } from "./primitives/accordion.tsx";
import { Avatar } from "./primitives/avatar.tsx";
import { Combobox } from "./primitives/combobox.tsx";
import { Dialog } from "./primitives/dialog.tsx";
import { Dropdown } from "./primitives/dropdown.tsx";
import { Tabs } from "./primitives/tabs.tsx";
import { Tooltip } from "./primitives/tooltip.tsx";

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
        <Tooltip />
        <Tabs />
        <Combobox />
        <Dropdown />
        <Dialog />
      </div>
      <ToastRoot theme="light" />
    </>
  );
}

export default App;
