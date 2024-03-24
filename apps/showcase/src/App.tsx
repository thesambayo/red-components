import viteLogo from '/vite.svg'
import {Accordion} from "./primitives/accordion.tsx";

// import { AvatarFallback, AvatarImage, AvatarRoot } from "@samred/avatar";
// import { TabContent, TabsList, TabsRoot, TabTrigger} from "@samred/tabs";
// import { TooltipContent, TooltipRoot, TooltipTrigger} from "@samred/tooltip";

function App() {
  return (
      <>
          <div>
              <img src={viteLogo} className="logo" alt="Vite logo"/>
          </div>

          <br/>
          <br/>
          <br/>

          {/*<tooltip-root>*/}
          {/*    <tooltip-trigger>Trigger</tooltip-trigger>*/}
          {/*    <tooltip-content side="bottom">Content</tooltip-content>*/}
          {/*</tooltip-root>*/}

          {/*<TooltipRoot>*/}
          {/*    <TooltipTrigger>Trigger</TooltipTrigger>*/}
          {/*    <TooltipContent>Content</TooltipContent>*/}
          {/*</TooltipRoot>*/}

          <br/>
          <br/>
          <br/>
          <Accordion />

          <br/>
          <br/>
          <br/>

          {/*<AvatarRoot>*/}
          {/*    <AvatarImage src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" />*/}
          {/*    <AvatarFallback>CD</AvatarFallback>*/}
          {/*</AvatarRoot>*/}

          {/*<avatar-root>*/}
          {/*    <avatar-image*/}
          {/*        src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"*/}
          {/*        alt="Forrest Gump"*/}
          {/*    ></avatar-image>*/}
          {/*    <avatar-fallback>FG</avatar-fallback>*/}
          {/*</avatar-root>*/}


          <br/>
          <br/>
          <br/>

          {/*<TabsRoot defaultValue="account">*/}
          {/*    <TabsList>*/}
          {/*        <TabTrigger value="account">tab-1</TabTrigger>*/}
          {/*        <TabTrigger value="password">tab-2</TabTrigger>*/}
          {/*        <TabTrigger value="delete">tab-3</TabTrigger>*/}
          {/*    </TabsList>*/}
          {/*    <TabContent value="account">content-1</TabContent>*/}
          {/*    <TabContent value="password">content-2</TabContent>*/}
          {/*    <TabContent value="delete">content-3</TabContent>*/}
          {/*</TabsRoot>*/}

          {/*<tabs-root direction="rtl" orientation="vertical">*/}
          {/*    <tabs-list>*/}
          {/*        <tab-trigger value="account">tab-1</tab-trigger>*/}
          {/*        <tab-trigger value="password">tab-2</tab-trigger>*/}
          {/*        <tab-trigger value="delete">tab-3</tab-trigger>*/}
          {/*    </tabs-list>*/}
          {/*    <tab-content value="account">content-1</tab-content>*/}
          {/*    <tab-content value="password">content-2</tab-content>*/}
          {/*    <tab-content value="delete">content-3</tab-content>*/}
          {/*</tabs-root>*/}
      </>
  )
}

export default App
