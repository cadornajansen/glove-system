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

export default function ConditionsPage() {
  const {
    gesture,
    asymmetry,
    asymmetryWarning,
    flex1Percent,
    flex2Percent,
    status,
  } = useGloveData();

  return (
    <PageShell
      title="Condition Logs"
      status={status}
      crumbs={[
        { label: "Health Records", href: "/records/conditions" },
        { label: "Condition Logs" },
      ]}
    >
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle>Detected Command</CardTitle>
          <CardDescription>Current gesture interpretation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{gesture}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Motor Balance</CardTitle>
            <CardDescription>Difference between sensor outputs</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {asymmetry !== null ? `${asymmetry.toFixed(0)}%` : "--"}
            </p>
            <p className="text-sm text-muted-foreground">
              {asymmetryWarning ? "Uneven movement detected" : "Balanced movement"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movement Summary</CardTitle>
            <CardDescription>Current finger activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Flex 1: {flex1Percent !== null ? `${flex1Percent.toFixed(0)}%` : "--"}</p>
            <p>Flex 2: {flex2Percent !== null ? `${flex2Percent.toFixed(0)}%` : "--"}</p>
          </CardContent>
        </Card>
      </div>

      {asymmetryWarning && (
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">
              Uneven Motor Response Detected
            </CardTitle>
            <CardDescription>
              Significant difference between left and right movement.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </PageShell>
  );
}