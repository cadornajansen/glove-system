"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Record = {
time: string;
temp: number;
hr: number;
spo2: number;
};

export default function HealthRecordsPage() {
const [temperature, setTemperature] = useState<number>(0);
const [heartRate, setHeartRate] = useState<number>(72);
const [spo2, setSpo2] = useState<number>(98);

const [records, setRecords] = useState<Record[]>([]);

// WebSocket (same as your dashboard)
useEffect(() => {
const ws = new WebSocket("ws://localhost:3001");

ws.onmessage = (event) => {
  const matches = event.data.match(/\{[^}]*\}/g);
  if (!matches) return;

  for (const msg of matches) {
    try {
      const data = JSON.parse(msg);
      if (data.temp !== undefined) setTemperature(data.temp);
    } catch {}
  }
};

return () => ws.close();

}, []);

// Simulated HR + SpO2
useEffect(() => {
const interval = setInterval(() => {
const hr = 72 + (Math.random() * 6 - 3);
const oxygen = 98 + (Math.random() * 1 - 0.5);

  setHeartRate(Number(hr.toFixed(0)));
  setSpo2(Number(oxygen.toFixed(1)));
}, 1000);

return () => clearInterval(interval);

}, []);

// SAVE DATA EVERY 10 SECONDS
useEffect(() => {
const interval = setInterval(() => {
const newRecord: Record = {
time: new Date().toLocaleTimeString(),
temp: Number(temperature.toFixed(2)),
hr: heartRate,
spo2: spo2,
};

  setRecords((prev) => [newRecord, ...prev.slice(0, 9)]);
}, 10000);

return () => clearInterval(interval);

}, [temperature, heartRate, spo2]);

return ( <SidebarProvider> <AppSidebar /> <SidebarInset> <div className="p-6 space-y-6"> <h1 className="text-2xl font-semibold">Health Records</h1> <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Auto-Recorded Data (Every 10s)</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full text-sm">
            <thead className="text-left border-b">
              <tr>
                <th>Time</th>
                <th>Temp (°C)</th>
                <th>Heart Rate</th>
                <th>SpO₂</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r, i) => (
                <tr key={i} className="border-b">
                  <td>{r.time}</td>
                  <td>{r.temp}</td>
                  <td>{r.hr} BPM</td>
                  <td>{r.spo2}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </SidebarInset>
</SidebarProvider>

);
}
