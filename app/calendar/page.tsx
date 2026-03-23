"use client";

import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<string[]>([
    "Therapy Session - 10:00 AM",
    "Vital Check - 2:00 PM",
  ]);

  const addItem = () => {
    if (!text.trim()) return;
    setItems((prev) => [...prev, text.trim()]);
    setText("");
  };

  return (
    <PageShell
      title="Schedules"
      crumbs={[
        { label: "Calendar", href: "/calendar" },
        { label: "Schedules" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Add Schedule</CardTitle>
          <CardDescription>Create a new schedule entry</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter schedule"
          />
          <Button onClick={addItem}>Add</Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card key={`${item}-${index}`}>
            <CardHeader>
              <CardTitle>{item}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}