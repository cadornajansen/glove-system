"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function DailyTasksPage() {
const [tasks, setTasks] = useState([
{ id: 1, text: "Take medication", done: false },
{ id: 2, text: "Drink water", done: false },
{ id: 3, text: "Check vitals", done: false },
{ id: 4, text: "Do finger exercise", done: false },
]);

const toggleTask = (id: number) => {
setTasks((prev) =>
prev.map((task) =>
task.id === id ? { ...task, done: !task.done } : task
)
);
};

return ( <SidebarProvider> <AppSidebar /> <SidebarInset> <div className="p-6 space-y-6"> <h1 className="text-2xl font-semibold">Daily Tasks</h1> <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Today's Checklist</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <Checkbox
                checked={task.done}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span
                className={task.done ? "line-through text-muted-foreground" : ""}
              >
                {task.text}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </SidebarInset>
</SidebarProvider>
);
}
