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

export default function VitalsPage() {
  const { temperature, heartRate, spo2, status, latency } = useGloveData();

  return (
    <PageShell
      title="Vital Signs"
      status={status}
      crumbs={[
        { label: "Health Records", href: "/records/vitals" },
        { label: "Vitals" },
      ]}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Heart Rate</CardTitle>
            <CardDescription>Live pulse reading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {heartRate !== null ? `${heartRate} BPM` : "-- BPM"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SpO₂</CardTitle>
            <CardDescription>Blood oxygen saturation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {spo2 !== null ? `${spo2}%` : "-- %"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temperature</CardTitle>
            <CardDescription>Body temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {temperature !== null ? `${temperature.toFixed(2)} °C` : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Responsiveness</CardTitle>
          <CardDescription>Live update interval from glove to website</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {latency !== null ? `${latency} ms` : "--"}
          </p>
          <p className="text-sm text-muted-foreground">
            {latency !== null && latency < 220
              ? "Fast"
              : latency !== null && latency < 300
                ? "Moderate"
                : "Slow"}
          </p>
        </CardContent>
      </Card>
    </PageShell>
  );
}