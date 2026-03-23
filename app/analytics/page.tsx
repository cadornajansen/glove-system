"use client";

import { useGloveData } from "@/lib/use-glove-data";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const { flex1, flex2, temperature } = useGloveData();

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (flex1 !== null && flex2 !== null && temperature !== null) {
      setHistory((prev) => [
        ...prev.slice(-20), // keep last 20
        { flex1, flex2, temperature, time: Date.now() },
      ]);
    }
  }, [flex1, flex2, temperature]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <p className="text-muted-foreground">
        Real-time sensor trends (last 20 readings)
      </p>

      <div className="space-y-2">
        {history.map((h, i) => (
          <div key={i} className="border p-3 rounded-lg text-sm">
            Flex1: {h.flex1} | Flex2: {h.flex2} | Temp: {h.temperature}
          </div>
        ))}
      </div>
    </div>
  );
}
