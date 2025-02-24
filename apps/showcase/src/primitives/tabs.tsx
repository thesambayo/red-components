import { TabContent, TabsList, TabsRoot, TabTrigger } from "@red-elements/tabs";

export function Tabs() {
  return (
    <div className="max-w-md mx-auto">
      <TabsRoot defaultValue="password">
        <TabsList className="grid grid-cols-3 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <TabTrigger
            value="account"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Account
          </TabTrigger>
          <TabTrigger
            value="password"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Password
          </TabTrigger>
          <TabTrigger
            value="delete"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Delete
          </TabTrigger>
        </TabsList>
        <TabContent
          value="account"
          className="block mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
            content-1
          </div>
        </TabContent>
        <TabContent
          value="password"
          className="block mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
            content-2
          </div>
        </TabContent>
        <TabContent
          value="delete"
          className="block mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow p-6">
            content-3
          </div>
        </TabContent>
      </TabsRoot>
    </div>
  );
}
