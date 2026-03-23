"use client";

import { PageShell } from "@/components/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGloveData } from "@/lib/use-glove-data";

export default function DailySummaryPage() {
  const {
    temperature,
    heartRate,
    spo2,
    gesture,
    flex1Percent,
    flex2Percent,
    status,
  } = useGloveData();

  return (
    <PageShell
      title="Daily Summary"
      status={status}
      crumbs={[
        { label: "Reports", href: "/reports/daily" },
        { label: "Daily Summary" },
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Patient Snapshot</CardTitle>
          <CardDescription>Latest system readings</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <p>
            Gesture: <span className="font-medium">{gesture}</span>
          </p>
          <p>
            Temperature:{" "}
            <span className="font-medium">
              {temperature !== null ? `${temperature.toFixed(2)} °C` : "--"}
            </span>
          </p>
          <p>
            Heart Rate:{" "}
            <span className="font-medium">
              {heartRate !== null ? `${heartRate} BPM` : "--"}
            </span>
          </p>
          <p>
            SpO₂:{" "}
            <span className="font-medium">
              {spo2 !== null ? `${spo2}%` : "--"}
            </span>
          </p>
          <p>
            Flex Sensor 1:{" "}
            <span className="font-medium">
              {flex1Percent !== null ? `${flex1Percent.toFixed(0)}%` : "--"}
            </span>
          </p>
          <p>
            Flex Sensor 2:{" "}
            <span className="font-medium">
              {flex2Percent !== null ? `${flex2Percent.toFixed(0)}%` : "--"}
            </span>
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}
