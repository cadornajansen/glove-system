"use client";

import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGloveData } from "@/lib/use-glove-data";

export default function ExportPage() {
  const { temperature, heartRate, spo2, flex1, flex2, gesture, status } =
    useGloveData();

  const exportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      temperature,
      heartRate,
      spo2,
      flex1,
      flex2,
      gesture,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "glove-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell
      title="Export"
      status={status}
      crumbs={[
        { label: "Reports", href: "/reports/export" },
        { label: "Export" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Export Current Report</CardTitle>
          <CardDescription>
            Download the latest live readings as JSON
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={exportJson}>Export Current Data</Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
