import viteLogo from "/vite.svg";
import { Accordion } from "./primitives/accordion.tsx";
import { Tabs } from "@/primitives/tabs.tsx";
import { Tooltip } from "@/primitives/tooltip.tsx";
import { ToastRoot, toaster } from "@red-elements/toast";

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
        <button onClick={sendToast}>send toast</button>
      </div>
      <ToastRoot />
    </>
  );
}

export default App;
