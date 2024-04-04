import viteLogo from '/vite.svg'
import {Accordion} from "./primitives/accordion.tsx";
import {Tabs} from "@/primitives/tabs.tsx";
import {Tooltip} from "@/primitives/tooltip.tsx";

function App() {
    return (
        <>
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo"/>
            </div>

            <div className="space-y-10">

                {/*<Avatar />*/}
                <Accordion />
                <Tabs />
                <Tooltip />
            </div>
        </>
    )
}

export default App
