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
import { Switch } from "@/components/ui/switch";

export default function RemindersPage() {
  const [enabled, setEnabled] = useState({
    meds: true,
    therapy: true,
    checkup: false,
  });

  return (
    <PageShell
      title="Reminders"
      crumbs={[
        { label: "Calendar", href: "/calendar/reminders" },
        { label: "Reminders" },
      ]}
    >
      {[
        {
          key: "meds",
          title: "Medication Reminder",
          desc: "Notify for daily medication schedule",
        },
        {
          key: "therapy",
          title: "Therapy Reminder",
          desc: "Notify before rehabilitation session",
        },
        {
          key: "checkup",
          title: "Checkup Reminder",
          desc: "Notify before checkup schedule",
        },
      ].map((item) => (
        <Card key={item.key}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.desc}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Switch
              checked={enabled[item.key as keyof typeof enabled]}
              onCheckedChange={(value) =>
                setEnabled((prev) => ({ ...prev, [item.key]: value }))
              }
            />
          </CardContent>
        </Card>
      ))}
    </PageShell>
  );
}
