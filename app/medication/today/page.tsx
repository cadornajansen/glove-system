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
import { Button } from "@/components/ui/button";

export default function TodayMedicationPage() {
  const [taken, setTaken] = useState<Record<string, boolean>>({
    morning: false,
    noon: false,
    evening: false,
  });

  const completed = useMemo(
    () => Object.values(taken).filter(Boolean).length,
    [taken],
  );

  return (
    <PageShell
      title="Today’s Medication"
      crumbs={[
        { label: "Medication", href: "/medication/today" },
        { label: "Today’s Medication" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Medication Completion</CardTitle>
          <CardDescription>Track today’s medication schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{completed}/3</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {[
          { key: "morning", label: "8:00 AM", med: "Morning Dose" },
          { key: "noon", label: "1:00 PM", med: "Afternoon Dose" },
          { key: "evening", label: "8:00 PM", med: "Evening Dose" },
        ].map((item) => (
          <Card key={item.key}>
            <CardHeader>
              <CardTitle>{item.med}</CardTitle>
              <CardDescription>{item.label}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {taken[item.key] ? "Marked as taken" : "Pending"}
              </p>
              <Button
                variant={taken[item.key] ? "secondary" : "default"}
                onClick={() =>
                  setTaken((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
              >
                {taken[item.key] ? "Undo" : "Mark as Taken"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
