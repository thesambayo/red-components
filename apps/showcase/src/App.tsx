import { ToastRoot, toaster } from "@red-elements/toast";
import viteLogo from "/vite.svg";

import { Accordion } from "./primitives/accordion.tsx";
import { Avatar } from "./primitives/avatar.tsx";
import { Combobox } from "./primitives/combobox.tsx";
import { Dialog } from "./primitives/dialog.tsx";
import { Dropdown } from "./primitives/dropdown.tsx";
import { Tabs } from "./primitives/tabs.tsx";
import { Tooltip } from "./primitives/tooltip.tsx";

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
        <Accordion />
        <Avatar />
        <Tooltip />
        <Tabs />
        <Combobox />
        <Dropdown />
        <Dialog />

        <section>
          <h2>Toast</h2>
          <button type="button" onClick={sendToast}>
            Send toast
          </button>
        </section>
      </div>
      <ToastRoot theme="light" />
    </>
  );
}

export default App;
