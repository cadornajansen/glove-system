"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Entry = {
  time: string;
  action: string;
};

export default function MedicationHistoryPage() {
  const [entries] = useState<Entry[]>([
    { time: "Today, 8:00 AM", action: "Morning dose taken" },
    { time: "Yesterday, 1:00 PM", action: "Afternoon dose taken" },
    { time: "Yesterday, 8:00 PM", action: "Evening dose missed" },
  ]);

  const total = useMemo(() => entries.length, [entries]);

  return (
    <PageShell
      title="Medication History"
      crumbs={[
        { label: "Medication", href: "/medication/history" },
        { label: "History" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Medication Logs</CardTitle>
          <CardDescription>
            Previously recorded medication actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{total}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {entries.map((entry, index) => (
          <Card key={`${entry.time}-${index}`}>
            <CardHeader>
              <CardTitle>{entry.action}</CardTitle>
              <CardDescription>{entry.time}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
