"use client";

import { useGloveData } from "@/lib/use-glove-data";

export default function CarePlans() {
  const { flex1, flex2 } = useGloveData();

  const recommendation =
    flex1 !== null && flex2 !== null
      ? Math.abs(flex1 - flex2) > 200
        ? "Focus on balancing both hands"
        : "Maintain current exercise routine"
      : "Waiting for data...";

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Care Plans</h1>

      <div className="border rounded-xl p-4">
        <p className="font-medium">Recommendation</p>
        <p className="text-muted-foreground">{recommendation}</p>
      </div>
    </div>
  );
}
